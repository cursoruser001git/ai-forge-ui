import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Zap, DollarSign } from 'lucide-react';
import type { Model } from '@/lib/api';

interface ModelCardProps {
  model: Model;
  category: string;
  onTest?: () => void;
  delay?: number;
}

export function ModelCard({ model, category, onTest, delay = 0 }: ModelCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.4 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="gradient-card border-border/50 hover:border-primary/30 transition-smooth h-full flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg font-semibold text-foreground leading-tight">
              {model.name || model.id}
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              {category}
            </Badge>
          </div>
          {model.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {model.description}
            </p>
          )}
        </CardHeader>

        <CardContent className="pt-0 flex-1 flex flex-col justify-between">
          <div className="space-y-3">
            {/* Model stats */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {model.context_length && (
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  <span>{model.context_length.toLocaleString()} tokens</span>
                </div>
              )}
              {model.pricing?.input && (
                <div className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  <span>${model.pricing.input}/1K</span>
                </div>
              )}
            </div>

            {model.provider && (
              <Badge variant="outline" className="text-xs w-fit">
                {model.provider}
              </Badge>
            )}
          </div>

          <div className="flex gap-2 mt-4">
            {onTest && (
              <Button 
                variant="default" 
                size="sm" 
                onClick={onTest}
                className="flex-1"
              >
                Test Model
              </Button>
            )}
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}