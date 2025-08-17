import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  History, 
  Settings, 
  MessageSquare,
  Trash2,
  Copy,
  Check
} from 'lucide-react';
import { 
  sendStreamingChatRequest, 
  getModelsByCategory, 
  CATEGORIES, 
  type ChatMessage, 
  type Model 
} from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  timestamp: number;
}

export default function Playground() {
  const location = useLocation();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('openai');
  const [selectedModel, setSelectedModel] = useState('');
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [input, setInput] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load state from navigation
  useEffect(() => {
    if (location.state?.selectedModel && location.state?.category) {
      setSelectedCategory(location.state.category);
      setSelectedModel(location.state.selectedModel);
    }
  }, [location.state]);

  // Load models when category changes
  useEffect(() => {
    loadModels();
  }, [selectedCategory]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation?.messages]);

  const loadModels = async () => {
    setLoadingModels(true);
    try {
      const categoryModels = await getModelsByCategory(selectedCategory);
      setModels(categoryModels);
      
      // Auto-select first model if none selected
      if (!selectedModel && categoryModels.length > 0) {
        setSelectedModel(categoryModels[0].id);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load models',
        variant: 'destructive',
      });
    } finally {
      setLoadingModels(false);
    }
  };

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      timestamp: Date.now(),
    };
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversation(newConversation);
  };

  const updateConversation = (updatedConversation: Conversation) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === updatedConversation.id ? updatedConversation : conv
      )
    );
    setCurrentConversation(updatedConversation);
  };

  const deleteConversation = (conversationId: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== conversationId));
    if (currentConversation?.id === conversationId) {
      setCurrentConversation(null);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !selectedModel || isStreaming) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    let conversation = currentConversation;
    if (!conversation) {
      conversation = {
        id: Date.now().toString(),
        title: input.trim().substring(0, 50) + (input.length > 50 ? '...' : ''),
        messages: [],
        timestamp: Date.now(),
      };
      setConversations(prev => [conversation!, ...prev]);
      setCurrentConversation(conversation);
    }

    const updatedMessages = [...conversation.messages, userMessage];
    const updatedConversation = { ...conversation, messages: updatedMessages };
    updateConversation(updatedConversation);

    setInput('');
    setIsStreaming(true);

    // Create assistant message placeholder
    const assistantMessage: ChatMessage = {
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    };

    const messagesWithAssistant = [...updatedMessages, assistantMessage];
    updateConversation({ ...updatedConversation, messages: messagesWithAssistant });

    try {
      await sendStreamingChatRequest(
        selectedCategory,
        {
          model: selectedModel,
          messages: updatedMessages,
          stream: true,
          max_tokens: 1000,
          temperature: 0.7,
        },
        (chunk) => {
          // Update the last message (assistant) with new content
          setCurrentConversation(prev => {
            if (!prev) return prev;
            const updatedMessages = [...prev.messages];
            const lastMessage = updatedMessages[updatedMessages.length - 1];
            if (lastMessage.role === 'assistant') {
              lastMessage.content += chunk;
            }
            return { ...prev, messages: updatedMessages };
          });
        },
        () => {
          setIsStreaming(false);
        },
        (error) => {
          setIsStreaming(false);
          toast({
            title: 'Error',
            description: error.message,
            variant: 'destructive',
          });
        }
      );
    } catch (error) {
      setIsStreaming(false);
    }
  };

  const copyMessage = async (content: string, messageId: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedMessageId(messageId);
    setTimeout(() => setCopiedMessageId(null), 2000);
    toast({
      title: 'Copied',
      description: 'Message copied to clipboard',
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="h-screen flex">
      {/* Sidebar */}
      <div className="w-80 border-r border-border/50 bg-card/30 backdrop-blur-xl flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border/50">
          <Button 
            onClick={createNewConversation} 
            className="w-full gap-2" 
            variant="default"
          >
            <MessageSquare className="w-4 h-4" />
            New Chat
          </Button>
        </div>

        {/* Model Selection */}
        <div className="p-4 space-y-3 border-b border-border/50">
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Model</label>
            <Select value={selectedModel} onValueChange={setSelectedModel} disabled={loadingModels}>
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name || model.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Conversation History */}
        <div className="flex-1 overflow-hidden">
          <div className="p-4 border-b border-border/50 flex items-center gap-2">
            <History className="w-4 h-4" />
            <span className="text-sm font-medium">Conversations</span>
          </div>
          
          <ScrollArea className="h-full">
            <div className="p-2 space-y-1">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-3 rounded-lg cursor-pointer transition-smooth hover:bg-accent/50 group ${
                    currentConversation?.id === conversation.id ? 'bg-accent' : ''
                  }`}
                  onClick={() => setCurrentConversation(conversation)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {conversation.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(conversation.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConversation(conversation.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-border/50 bg-card/30 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">
                {currentConversation?.title || 'AI Playground'}
              </h1>
              {selectedModel && (
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {CATEGORIES.find(c => c.id === selectedCategory)?.name}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {models.find(m => m.id === selectedModel)?.name || selectedModel}
                  </span>
                </div>
              )}
            </div>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {!currentConversation ? (
              <div className="text-center py-20">
                <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Start a Conversation</h3>
                <p className="text-muted-foreground">
                  Choose a model and send your first message to begin.
                </p>
              </div>
            ) : currentConversation.messages.length === 0 ? (
              <div className="text-center py-20">
                <Bot className="w-16 h-16 mx-auto text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Ready to Chat</h3>
                <p className="text-muted-foreground">
                  Send a message to start your conversation with the AI.
                </p>
              </div>
            ) : (
              currentConversation.messages.map((message, index) => {
                const messageId = `${message.timestamp}-${index}`;
                return (
                  <motion.div
                    key={messageId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className={`flex gap-3 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="w-5 h-5 text-primary" />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[80%] rounded-lg p-4 group relative ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'gradient-card border border-border/50'
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.content}
                        {isStreaming && index === currentConversation.messages.length - 1 && (
                          <motion.span
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="inline-block w-2 h-4 bg-current ml-1"
                          />
                        )}
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyMessage(message.content, messageId)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                      >
                        {copiedMessageId === messageId ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                    </div>

                    {message.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="w-5 h-5 text-secondary-foreground" />
                      </div>
                    )}
                  </motion.div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t border-border/50 bg-card/30 backdrop-blur-xl">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="min-h-[60px] max-h-[200px] resize-none pr-12 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50"
                  disabled={isStreaming || !selectedModel}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!input.trim() || !selectedModel || isStreaming}
                  className="absolute bottom-2 right-2 h-8 w-8 p-0"
                  variant="default"
                >
                  {isStreaming ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}