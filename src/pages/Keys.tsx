import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  Key, 
  ChevronDown, 
  ChevronRight,
  Trash2,
  Plus,
  Shield,
  ExternalLink
} from 'lucide-react';
import { getStoredApiKeys, saveApiKey, removeApiKey } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface ApiKeyProvider {
  id: string;
  name: string;
  description: string;
  icon: string;
  fields: {
    key: string;
    label: string;
    placeholder: string;
    required: boolean;
  }[];
  docsUrl?: string;
}

const API_PROVIDERS: ApiKeyProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT-4, GPT-3.5, DALL-E, and other OpenAI models',
    icon: '🤖',
    fields: [
      {
        key: 'api_key',
        label: 'API Key',
        placeholder: 'sk-...',
        required: true,
      },
    ],
    docsUrl: 'https://platform.openai.com/api-keys',
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    description: 'Claude models and Anthropic AI services',
    icon: '🧠',
    fields: [
      {
        key: 'api_key',
        label: 'API Key',
        placeholder: 'sk-ant-...',
        required: true,
      },
    ],
    docsUrl: 'https://console.anthropic.com/',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    description: 'DeepSeek code and chat models',
    icon: '🔍',
    fields: [
      {
        key: 'api_key',
        label: 'API Key',
        placeholder: 'sk-...',
        required: true,
      },
    ],
  },
  {
    id: 'custom',
    name: 'Custom Provider',
    description: 'Configure custom API endpoints and keys',
    icon: '⚙️',
    fields: [
      {
        key: 'base_url',
        label: 'Base URL',
        placeholder: 'https://api.example.com/v1',
        required: true,
      },
      {
        key: 'api_key',
        label: 'API Key',
        placeholder: 'your-api-key',
        required: true,
      },
    ],
  },
];

export default function Keys() {
  const [storedKeys, setStoredKeys] = useState<Record<string, string>>({});
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [openProviders, setOpenProviders] = useState<Record<string, boolean>>({});
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, Record<string, string>>>({});
  const { toast } = useToast();

  useEffect(() => {
    loadStoredKeys();
  }, []);

  const loadStoredKeys = () => {
    const keys = getStoredApiKeys();
    setStoredKeys(keys);
    
    // Initialize form data with stored keys
    const initialFormData: Record<string, Record<string, string>> = {};
    API_PROVIDERS.forEach(provider => {
      initialFormData[provider.id] = {};
      provider.fields.forEach(field => {
        const key = `${provider.id}_${field.key}`;
        initialFormData[provider.id][field.key] = keys[key] || '';
      });
    });
    setFormData(initialFormData);
  };

  const toggleProviderOpen = (providerId: string) => {
    setOpenProviders(prev => ({
      ...prev,
      [providerId]: !prev[providerId],
    }));
  };

  const toggleKeyVisibility = (fieldId: string) => {
    setVisibleKeys(prev => ({
      ...prev,
      [fieldId]: !prev[fieldId],
    }));
  };

  const handleInputChange = (providerId: string, fieldKey: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [providerId]: {
        ...prev[providerId],
        [fieldKey]: value,
      },
    }));
  };

  const saveProviderKeys = (providerId: string) => {
    const provider = API_PROVIDERS.find(p => p.id === providerId);
    if (!provider) return;

    let hasError = false;
    provider.fields.forEach(field => {
      const value = formData[providerId]?.[field.key] || '';
      if (field.required && !value.trim()) {
        toast({
          title: 'Error',
          description: `${field.label} is required`,
          variant: 'destructive',
        });
        hasError = true;
        return;
      }

      const key = `${providerId}_${field.key}`;
      if (value.trim()) {
        saveApiKey(key, value.trim());
      } else {
        removeApiKey(key);
      }
    });

    if (!hasError) {
      toast({
        title: 'Success',
        description: `${provider.name} API keys saved successfully`,
      });
      loadStoredKeys();
    }
  };

  const deleteProviderKeys = (providerId: string) => {
    const provider = API_PROVIDERS.find(p => p.id === providerId);
    if (!provider) return;

    provider.fields.forEach(field => {
      const key = `${providerId}_${field.key}`;
      removeApiKey(key);
    });

    // Clear form data
    setFormData(prev => ({
      ...prev,
      [providerId]: Object.fromEntries(
        provider.fields.map(field => [field.key, ''])
      ),
    }));

    toast({
      title: 'Success',
      description: `${provider.name} API keys removed`,
    });
    loadStoredKeys();
  };

  const copyToClipboard = async (text: string, fieldId: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
    toast({
      title: 'Copied',
      description: 'API key copied to clipboard',
    });
  };

  const getFieldId = (providerId: string, fieldKey: string) => `${providerId}_${fieldKey}`;
  const hasStoredKey = (providerId: string, fieldKey: string) => {
    const key = getFieldId(providerId, fieldKey);
    return storedKeys[key]?.length > 0;
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Key className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-primary bg-clip-text text-transparent">
              API Key Management
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Securely store and manage your API keys for different AI providers.
            Keys are stored locally in your browser.
          </p>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <Card className="gradient-card border-yellow-500/20 bg-yellow-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-yellow-500" />
                <div>
                  <h3 className="font-semibold text-yellow-500">Security Notice</h3>
                  <p className="text-sm text-muted-foreground">
                    API keys are stored locally in your browser's localStorage. 
                    Never share your keys or use them on untrusted websites.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* API Providers */}
        <div className="space-y-6">
          {API_PROVIDERS.map((provider, index) => {
            const isOpen = openProviders[provider.id];
            const hasAnyKey = provider.fields.some(field => 
              hasStoredKey(provider.id, field.key)
            );

            return (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
              >
                <Card className="gradient-card border-border/50">
                  <Collapsible
                    open={isOpen}
                    onOpenChange={() => toggleProviderOpen(provider.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-2xl">
                              {provider.icon}
                            </div>
                            <div className="text-left">
                              <CardTitle className="flex items-center gap-2">
                                {provider.name}
                                {hasAnyKey && (
                                  <Badge variant="secondary" className="text-xs">
                                    Configured
                                  </Badge>
                                )}
                              </CardTitle>
                              <p className="text-sm text-muted-foreground">
                                {provider.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {provider.docsUrl && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(provider.docsUrl, '_blank');
                                }}
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            )}
                            {isOpen ? (
                              <ChevronDown className="w-5 h-5 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <CardContent className="pt-0 space-y-4">
                        {provider.fields.map((field) => {
                          const fieldId = getFieldId(provider.id, field.key);
                          const value = formData[provider.id]?.[field.key] || '';
                          const isVisible = visibleKeys[fieldId];
                          const isCopied = copiedField === fieldId;

                          return (
                            <div key={field.key} className="space-y-2">
                              <Label htmlFor={fieldId} className="flex items-center gap-2">
                                {field.label}
                                {field.required && (
                                  <span className="text-red-500">*</span>
                                )}
                              </Label>
                              <div className="flex gap-2">
                                <div className="relative flex-1">
                                  <Input
                                    id={fieldId}
                                    type={isVisible ? 'text' : 'password'}
                                    value={value}
                                    onChange={(e) => handleInputChange(
                                      provider.id, 
                                      field.key, 
                                      e.target.value
                                    )}
                                    placeholder={field.placeholder}
                                    className="pr-20 bg-background/50"
                                  />
                                  <div className="absolute right-1 top-1 flex gap-1">
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => toggleKeyVisibility(fieldId)}
                                      className="h-8 w-8 p-0"
                                    >
                                      {isVisible ? (
                                        <EyeOff className="w-4 h-4" />
                                      ) : (
                                        <Eye className="w-4 h-4" />
                                      )}
                                    </Button>
                                    {value && (
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => copyToClipboard(value, fieldId)}
                                        className="h-8 w-8 p-0"
                                      >
                                        {isCopied ? (
                                          <Check className="w-4 h-4 text-green-500" />
                                        ) : (
                                          <Copy className="w-4 h-4" />
                                        )}
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}

                        <div className="flex justify-between pt-4">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteProviderKeys(provider.id)}
                            disabled={!hasAnyKey}
                            className="gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Remove Keys
                          </Button>

                          <Button
                            onClick={() => saveProviderKeys(provider.id)}
                            className="gap-2"
                          >
                            <Key className="w-4 h-4" />
                            Save Keys
                          </Button>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}