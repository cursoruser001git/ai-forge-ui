import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Sparkles, 
  Zap, 
  Shield, 
  Globe, 
  MessageSquare, 
  Image, 
  Music, 
  Code,
  ArrowRight,
  Brain,
  Users,
  Lightbulb,
  Rocket
} from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/hero-collaboration.png';
import featuresImage from '@/assets/features-illustration.png';
import ctaImage from '@/assets/cta-illustration.png';

export default function Landing() {
  const features = [
    {
      icon: Globe,
      title: 'Multiple AI Providers',
      description: 'Access models from OpenAI, Llama, Qwen, DeepSeek, and more in one unified platform.',
    },
    {
      icon: MessageSquare,
      title: 'Streaming Responses',
      description: 'Real-time streaming chat completions with smooth animations and typing effects.',
    },
    {
      icon: Brain,
      title: 'Smart Embeddings',
      description: 'Generate high-quality vector embeddings for semantic search and RAG applications.',
    },
    {
      icon: Code,
      title: 'Code Generation',
      description: 'Specialized coding models for development, debugging, and code completion tasks.',
    },
    {
      icon: Music,
      title: 'Audio Processing',
      description: 'Speech-to-text, text-to-speech, and audio generation capabilities.',
    },
    {
      icon: Image,
      title: 'Image Models',
      description: 'Generate, edit, and analyze images with state-of-the-art vision models.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-teal-50/40 py-20 md:py-32">
        {/* Background pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        </div>

        <div className="relative container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium"
              >
                <Sparkles className="w-4 h-4" />
                AI-Powered Innovation
              </motion.div>

              <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  <span className="text-foreground">Build the Future with</span>
                  <br />
                  <span className="gradient-primary bg-clip-text text-transparent font-extrabold">
                    Unified AI Models
                  </span>
                </h1>

                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
                  Access cutting-edge AI capabilities from multiple providers through one elegant, 
                  developer-friendly platform. From chat to code, images to audio.
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button 
                  size="lg" 
                  className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
                  asChild
                >
                  <Link to="/models">
                    Explore Models
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="gap-2 hover:bg-secondary/50 transition-all duration-300" asChild>
                  <Link to="/playground">
                    Try Playground
                    <Zap className="w-5 h-5" />
                  </Link>
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex gap-8 pt-8"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">50+</div>
                  <div className="text-sm text-muted-foreground">AI Models</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">6</div>
                  <div className="text-sm text-muted-foreground">Providers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">99.9%</div>
                  <div className="text-sm text-muted-foreground">Uptime</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Hero Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10">
                <img
                  src={heroImage}
                  alt="AI collaboration and innovation"
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/20 rounded-full blur-xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-white to-slate-50/50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            {/* Features illustration */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative order-2 lg:order-1"
            >
              <img
                src={featuresImage}
                alt="AI features and capabilities"
                className="w-full h-auto rounded-2xl shadow-lg"
              />
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-accent/20 rounded-full blur-xl" />
            </motion.div>

            {/* Features content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8 order-1 lg:order-2"
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium"
                >
                  <Lightbulb className="w-4 h-4" />
                  Powerful Capabilities
                </motion.div>
                
                <h2 className="text-3xl md:text-5xl font-bold text-foreground">
                  Everything You Need for
                  <span className="block gradient-primary bg-clip-text text-transparent">
                    AI-Powered Development
                  </span>
                </h2>
                
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Our unified platform brings together the best AI models from leading providers,
                  making it easy to integrate cutting-edge AI into your applications.
                </p>
              </div>

              <div className="grid gap-4">
                {features.slice(0, 3).map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex gap-4 p-4 rounded-lg hover:bg-white/50 transition-all duration-300"
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {feature.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Feature cards grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div key={feature.title} variants={itemVariants}>
                  <Card className="bg-white/80 backdrop-blur-sm border-border/50 hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full group">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-foreground">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* CTA Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium"
                >
                  <Rocket className="w-4 h-4" />
                  Get Started Today
                </motion.div>
                
                <h2 className="text-3xl md:text-5xl font-bold text-foreground">
                  Ready to Build the
                  <span className="block gradient-primary bg-clip-text text-transparent">
                    Future with AI?
                  </span>
                </h2>
                
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Join thousands of developers worldwide who are building the next generation 
                  of AI applications with our unified, developer-friendly platform.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
                  asChild
                >
                  <Link to="/playground">
                    Start Building Now
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="gap-2 hover:bg-secondary/50 transition-all duration-300" asChild>
                  <Link to="/models">
                    Browse Models
                    <Globe className="w-5 h-5" />
                  </Link>
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4 text-primary" />
                  Trusted by 10K+ developers
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 text-primary" />
                  Enterprise-grade security
                </div>
              </div>
            </motion.div>

            {/* CTA Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src={ctaImage}
                alt="Developers building with AI"
                className="w-full h-auto rounded-2xl shadow-lg"
              />
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/20 rounded-full blur-xl" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-accent/20 rounded-full blur-xl" />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}