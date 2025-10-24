import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { AddProductDialog } from "@/components/AddProductDialog";
import { ReviewsDialog } from "@/components/ReviewsDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, TrendingUp, DollarSign, ExternalLink, Github } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Vendor = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalSales: 0,
    activeProducts: 0,
    totalDownloads: 0,
    pendingReview: 0,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("vendor_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data) {
        setProducts(data);
        const pending = data.filter((p) => p.status === "pending").length;
        const approved = data.filter((p) => p.status === "approved").length;
        const totalDownloads = data.reduce((sum, p) => sum + (p.downloads || 0), 0);
        const totalSales = data.reduce((sum, p) => sum + (p.price * (p.downloads || 0)), 0);

        setStats({
          totalSales,
          activeProducts: approved,
          totalDownloads,
          pendingReview: pending,
        });
      }
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("Failed to load products");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Vendor Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your projects and track your sales
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gradient-card border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Sales
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                ₹{(stats.totalSales * 80).toFixed(0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.totalDownloads} total downloads
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Projects
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.activeProducts}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.pendingReview} pending review
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Downloads
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.totalDownloads}</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Your Projects</h2>
          <AddProductDialog />
        </div>

        {products.length === 0 ? (
          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-6">
                Start selling by uploading your first project
              </p>
              <AddProductDialog />
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="bg-gradient-card border-border/50">
                {product.image_url && (
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                )}
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{product.title}</h3>
                    <Badge
                      variant={
                        product.status === "approved"
                          ? "default"
                          : product.status === "rejected"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {product.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center gap-2 mb-3">
                    {product.github_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <a href={product.github_url} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {product.demo_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <a href={product.demo_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    <ReviewsDialog productId={product.id} productTitle={product.title} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">
                      ₹{(product.price * 80).toFixed(0)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {product.downloads || 0} downloads
                    </span>
                  </div>
                  {product.rejection_reason && (
                    <p className="text-xs text-destructive mt-2">
                      Reason: {product.rejection_reason}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Vendor;
