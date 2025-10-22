import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Code2, ShoppingCart, User } from "lucide-react";

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <Code2 className="h-6 w-6 text-primary" />
          <span className="bg-gradient-primary bg-clip-text text-transparent">DevMarket</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link to="/marketplace" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Marketplace
          </Link>
          <Link to="/vendor" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Sell Projects
          </Link>
          <Link to="/admin" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Admin
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="sm">
            <User className="h-4 w-4 mr-2" />
            Sign In
          </Button>
        </div>
      </div>
    </nav>
  );
};
