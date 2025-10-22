import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Code2, ShoppingBag, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-bg.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-60" />
        
        <div className="container relative py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent leading-tight">
              Buy & Sell Premium Web Projects
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              The ultimate marketplace for developers to monetize their GitHub repositories 
              and discover ready-to-use web development solutions
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/marketplace">
                <Button variant="hero" size="lg" className="text-lg px-8">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Browse Marketplace
                </Button>
              </Link>
              <Link to="/vendor">
                <Button variant="outline" size="lg" className="text-lg px-8 bg-background/50 backdrop-blur-sm">
                  <Code2 className="mr-2 h-5 w-5" />
                  Start Selling
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why Choose DevMarket?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A trusted platform connecting developers worldwide
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-gradient-card border-border/50 hover:shadow-elevated transition-all duration-300">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Code2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Quality Projects</h3>
              <p className="text-muted-foreground">
                Every project is reviewed and tested to ensure top-notch quality and functionality
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50 hover:shadow-elevated transition-all duration-300">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-6">
                <Shield className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure Transactions</h3>
              <p className="text-muted-foreground">
                Your payments and data are protected with enterprise-grade security measures
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50 hover:shadow-elevated transition-all duration-300">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Instant Access</h3>
              <p className="text-muted-foreground">
                Download and start using your purchased projects immediately after payment
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20">
        <Card className="bg-gradient-primary text-primary-foreground border-0 shadow-glow">
          <CardContent className="py-16 px-8 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of developers already buying and selling projects on DevMarket
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/marketplace">
                <Button variant="secondary" size="lg" className="text-lg px-8">
                  Explore Marketplace
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-8 bg-background/10 border-primary-foreground/30 text-primary-foreground hover:bg-background/20">
                Learn More
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 bg-muted/30">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2024 DevMarket. Built for developers, by developers.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
