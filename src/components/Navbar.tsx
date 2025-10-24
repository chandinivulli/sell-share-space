import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Code2, User, LogOut } from "lucide-react";
import { CartSheet } from "@/components/CartSheet";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export const Navbar = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <Code2 className="h-6 w-6 text-primary" />
          <span className="bg-gradient-primary bg-clip-text text-transparent">LikMarket</span>
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
          <CartSheet />
          {user ? (
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          ) : (
            <Link to="/auth">
              <Button variant="outline" size="sm">
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
