import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Loader2 } from 'lucide-react';
import { ModelCard } from '@/components/ModelCard';
import { getModelsByCategory, CATEGORIES, type Model } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

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

  const handleTestModel = (model: Model) => {
    navigate('/playground', { state: { selectedModel: model.id, category: selectedCategory } });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-primary bg-clip-text text-transparent">
              AI Model Explorer
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover and test cutting-edge AI models from leading providers.
            Find the perfect model for your use case.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-md mx-auto mb-8"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card/50 backdrop-blur-sm border-border/50 focus:border-primary/50"
            />
          </div>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-9 gap-1 h-auto p-1 bg-card/50 backdrop-blur-sm">
              {CATEGORIES.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex flex-col gap-1 p-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-smooth"
                  onClick={() => loadModels(category.id)}
                >
                  <span className="text-lg">{category.icon}</span>
                  <span className="text-xs font-medium">{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {CATEGORIES.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <h2 className="text-2xl font-bold">{category.name} Models</h2>
                    <Badge variant="secondary">
                      {filteredModels.length} models
                    </Badge>
                  </div>
                  <Filter className="w-5 h-5 text-muted-foreground" />
                </div>

                {loading[category.id] ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <span className="ml-2 text-muted-foreground">Loading models...</span>
                  </div>
                ) : filteredModels.length === 0 ? (
                  <Card className="gradient-card border-border/50">
                    <CardContent className="text-center py-12">
                      <div className="text-4xl mb-4">{category.icon}</div>
                      <h3 className="text-xl font-semibold mb-2">No models found</h3>
                      <p className="text-muted-foreground">
                        {searchQuery
                          ? `No models match "${searchQuery}" in this category.`
                          : `No models available in the ${category.name} category yet.`}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredModels.map((model, index) => (
                      <ModelCard
                        key={model.id}
                        model={model}
                        category={category.name}
                        onTest={() => handleTestModel(model)}
                        delay={index}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}