import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Menu, X, Search, MessageSquare, Zap, Bell, HelpCircle, Settings } from "lucide-react";
import { useState } from "react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";

// Create placeholder components for the new sections
function ThreadDiscovery() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Thread Discovery</h1>
        <p className="text-gray-600">Coming soon - Advanced thread discovery features</p>
      </div>
    </div>
  );
}

function AIReplyGenerator() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Reply Generator</h1>
        <p className="text-gray-600">Coming soon - AI-powered reply generation</p>
      </div>
    </div>
  );
}

function RescanAlerts() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Rescan Alerts</h1>
        <p className="text-gray-600">Coming soon - Automated alert management</p>
      </div>
    </div>
  );
}

function FAQGeneratorPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">FAQ Generator</h1>
        <p className="text-gray-600">Generate comprehensive FAQ sections based on real social media discussions and questions.</p>
      </div>
      <div className="text-center py-12">
        <p className="text-gray-500">FAQ Generator component will be loaded here</p>
      </div>
    </div>
  );
}

function APISettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">API Settings</h1>
        <p className="text-gray-600">Configure your custom API keys for enhanced functionality and higher usage limits.</p>
      </div>
      <div className="text-center py-12">
        <p className="text-gray-500">API Settings component will be loaded here</p>
      </div>
    </div>
  );
}

function Navigation() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Brand Opportunities', href: '/', icon: Search },
    { name: 'Thread Discovery', href: '/thread-discovery', icon: MessageSquare },
    { name: 'AI Reply Generator', href: '/ai-reply-generator', icon: Zap },
    { name: 'Rescan Alerts', href: '/rescan-alerts', icon: Bell },
    { name: 'FAQ Generator', href: '/faq-generator', icon: HelpCircle },
    { name: 'API Settings', href: '/api-settings', icon: Settings },
  ];

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Search className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-xl text-gray-900">SocialMonitor AI</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary ${
                    location === item.href ? "text-primary" : "text-gray-600"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                    location === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}

function Router() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/thread-discovery" component={ThreadDiscovery} />
          <Route path="/ai-reply-generator" component={AIReplyGenerator} />
          <Route path="/rescan-alerts" component={RescanAlerts} />
          <Route path="/faq-generator" component={FAQGeneratorPage} />
          <Route path="/api-settings" component={APISettingsPage} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;