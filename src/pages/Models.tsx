import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Loader2, Database, Cpu, Zap, Code, Image, Mic, Brain } from 'lucide-react';
import { ModelCard } from '@/components/ModelCard';
import { getModelsByCategory, CATEGORIES, type Model } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { SplitText } from '@/components/animations/SplitText';
import { FadeInOnScroll } from '@/components/animations/FadeInOnScroll';
import { FloatingCard } from '@/components/animations/FloatingCard';

export default function Models() {
  const [selectedCategory, setSelectedCategory] = useState('openai');
  const [models, setModels] = useState<Record<string, Model[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadModels(selectedCategory);
  }, [selectedCategory]);

  const loadModels = async (category: string) => {
    if (models[category]) return; // Already loaded

    setLoading(prev => ({ ...prev, [category]: true }));
    try {
      const categoryModels = await getModelsByCategory(category);
      setModels(prev => ({ ...prev, [category]: categoryModels }));
    } catch (error) {
      console.error(`Failed to load models for ${category}:`, error);
    } finally {
      setLoading(prev => ({ ...prev, [category]: false }));
    }
  };

  const filteredModels = models[selectedCategory]?.filter(model =>
    model.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getCategoryIcon = (categoryId: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      openai: <Brain className="w-5 h-5" />,
      llama: <Cpu className="w-5 h-5" />,
      qwen: <Database className="w-5 h-5" />,
      kimi: <Zap className="w-5 h-5" />,
      deepseek: <Code className="w-5 h-5" />,
      coder: <Code className="w-5 h-5" />,
      embed: <Database className="w-5 h-5" />,
      audio: <Mic className="w-5 h-5" />,
      image: <Image className="w-5 h-5" />
    };
    return iconMap[categoryId] || <Cpu className="w-5 h-5" />;
  };

  const handleTestModel = (model: Model) => {
    navigate('/playground', { state: { selectedModel: model.id, category: selectedCategory } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <FadeInOnScroll className="text-center mb-16">
          <div className="max-w-4xl mx-auto">
            <SplitText 
              text="AI Model Explorer"
              className="text-5xl font-bold text-slate-900 mb-6"
              delay={0.1}
            />
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
            >
              Discover, compare, and test state-of-the-art AI models from leading providers. 
              Built for developers who demand performance, reliability, and cutting-edge capabilities.
            </motion.p>
          </div>
        </FadeInOnScroll>

        {/* Search Bar */}
        <FadeInOnScroll delay={0.2} className="mb-12">
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search models by name, provider, or capability..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-lg bg-white border-slate-200 shadow-sm rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </FadeInOnScroll>

        {/* Category Tabs */}
        <FadeInOnScroll delay={0.4}>
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-9 mb-12 bg-white border border-slate-200 shadow-sm rounded-xl p-2">
              {CATEGORIES.map((category) => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
                  onClick={() => loadModels(category.id)}
                >
                  {getCategoryIcon(category.id)}
                  <span className="hidden sm:inline font-medium">{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {CATEGORIES.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-0">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-8 py-6 border-b border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {getCategoryIcon(category.id)}
                        <div>
                          <h2 className="text-2xl font-bold text-slate-900">{category.name} Models</h2>
                          <p className="text-slate-600 mt-1">Professional AI models for development</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-sm font-medium border-primary/20 text-primary">
                        {loading[category.id] ? '...' : `${filteredModels.length} available`}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    {loading[category.id] ? (
                      <div className="flex flex-col items-center justify-center py-16">
                        <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
                        <span className="text-slate-600 font-medium">Loading models...</span>
                      </div>
                    ) : filteredModels.length === 0 ? (
                      <div className="text-center py-16">
                        <Search className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-600 text-lg">No models found matching your search criteria.</p>
                        <p className="text-slate-500 text-sm mt-2">Try adjusting your search terms or browse other categories.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredModels.map((model, index) => (
                          <FadeInOnScroll
                            key={model.id}
                            delay={index * 0.1}
                            direction="up"
                            distance={20}
                          >
                            <FloatingCard
                              className="h-full"
                              floatDuration={4 + index * 0.5}
                              floatDistance={5}
                            >
                              <ModelCard
                                model={model}
                                category={category.name}
                                onTest={() => handleTestModel(model)}
                                delay={index * 0.1}
                              />
                            </FloatingCard>
                          </FadeInOnScroll>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </FadeInOnScroll>
      </div>
    </div>
  );
}