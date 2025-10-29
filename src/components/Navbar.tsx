import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, Cpu, MessageSquare, Key, Github } from 'lucide-react';
import { useEffect, useState } from 'react';
import { checkHealth, type HealthStatus } from '@/lib/api';

export function Navbar() {
  const location = useLocation();
  const [health, setHealth] = useState<HealthStatus | null>(null);

  useEffect(() => {
    const checkServerHealth = async () => {
      const status = await checkHealth();
      setHealth(status);
    };

    checkServerHealth();
    const interval = setInterval(checkServerHealth, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { path: '/', label: 'Home', icon: Sparkles },
    { path: '/models', label: 'Models', icon: Cpu },
    { path: '/playground', label: 'Playground', icon: MessageSquare },
    { path: '/keys', label: 'API Keys', icon: Key },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="border-b border-border/50 bg-card/30 backdrop-blur-xl sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
            className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center"
          >
            <Sparkles className="w-5 h-5 text-white" />
          </motion.div>
          <span className="text-xl font-bold gradient-primary bg-clip-text text-transparent">
            AI Models Hub
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  className="gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          {/* Server Health Status */}
          <div className="flex items-center gap-2 text-sm">
            <div
              className={`w-2 h-2 rounded-full ${
                health?.status === 'healthy' 
                  ? 'bg-green-500 shadow-[0_0_8px_rgb(34,197,94)]' 
                  : 'bg-red-500 shadow-[0_0_8px_rgb(239,68,68)]'
              }`}
            />
            <span className="text-muted-foreground hidden sm:inline">
              {health?.status === 'healthy' ? 'API Online' : 'API Offline'}
            </span>
          </div>

          <Button variant="outline" size="sm" asChild>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="gap-2"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </Button>
        </div>
      </div>
    </motion.nav>
  );
}