import { motion } from 'framer-motion';
import { Github, ExternalLink, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Footer() {
  const footerLinks = [
    { label: 'About', href: '#' },
    { label: 'API Docs', href: '#' },
    { label: 'Contact', href: '#' },
  ];

  return (
    <footer className="border-t border-border/50 bg-card/30 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Built with{' '}
              <Heart className="w-4 h-4 inline text-red-500" />{' '}
              using modern web technologies
            </span>
          </div>

          <div className="flex items-center gap-4">
            {footerLinks.map((link) => (
              <Button
                key={link.label}
                variant="ghost"
                size="sm"
                asChild
              >
                <a
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground gap-1"
                >
                  {link.label}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </Button>
            ))}
            
            <Button variant="outline" size="sm" asChild>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="gap-2"
              >
                <Github className="w-4 h-4" />
                Source
              </a>
            </Button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 pt-6 border-t border-border/50 text-center"
        >
          <p className="text-xs text-muted-foreground">
            © 2024 AI Models Hub. Explore the future of AI through our unified platform.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}