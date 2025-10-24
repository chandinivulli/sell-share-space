import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Users, TrendingUp, DollarSign, Package, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Admin = () => {
  const [pendingProducts, setPendingProducts] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeVendors: 0,
    totalRevenue: 0,
    activeProjects: 0,
  });
  const [rejectionReason, setRejectionReason] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    checkAdminAccess();
    loadPendingProducts();
    loadStats();
  }, []);

  const checkAdminAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    if (!data) {
      toast.error("Access denied: Admin privileges required");
    }
  };

  const loadPendingProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        profiles:vendor_id (username)
      `)
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setPendingProducts(data);
    }
  };

  const loadStats = async () => {
    const { count: userCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    const { count: vendorCount } = await supabase
      .from("user_roles")
      .select("*", { count: "exact", head: true })
      .eq("role", "vendor");

    const { data: products } = await supabase
      .from("products")
      .select("price, downloads, status");

    const totalRevenue =
      products?.reduce((sum, p) => sum + p.price * (p.downloads || 0), 0) || 0;
    const activeProjects = products?.filter((p) => p.status === "approved").length || 0;

    setStats({
      totalUsers: userCount || 0,
      activeVendors: vendorCount || 0,
      totalRevenue,
      activeProjects,
    });
  };

  const handleApprove = async (productId: string) => {
    const { error } = await supabase
      .from("products")
      .update({ status: "approved" })
      .eq("id", productId);

    if (error) {
      toast.error("Failed to approve product");
    } else {
      toast.success("Product approved!");
      loadPendingProducts();
      loadStats();
    }
  };

  const handleReject = async (productId: string) => {
    if (!rejectionReason[productId]) {
      toast.error("Please provide a rejection reason");
      return;
    }

    const { error } = await supabase
      .from("products")
      .update({
        status: "rejected",
        rejection_reason: rejectionReason[productId],
      })
      .eq("id", productId);

    if (error) {
      toast.error("Failed to reject product");
    } else {
      toast.success("Product rejected");
      loadPendingProducts();
      setRejectionReason((prev) => {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Monitor platform activity and manage product reviews
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-card border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Vendors
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.activeVendors}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                ₹{(stats.totalRevenue * 80).toFixed(0)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Projects
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.activeProjects}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Pending Product Reviews ({pendingProducts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingProducts.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No pending reviews</p>
            ) : (
              <div className="space-y-6">
                {pendingProducts.map((product) => (
                  <div key={product.id} className="border border-border/50 rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      {product.image_url && (
                        <img
                          src={product.image_url}
                          alt={product.title}
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{product.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              by {product.profiles?.username}
                            </p>
                          </div>
                          <Badge variant="secondary">{product.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {product.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {product.tech_stack?.map((tech: string, i: number) => (
                            <Badge key={i} variant="outline">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2 mb-3">
                          {product.github_url && (
                            <a
                              href={product.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline"
                            >
                              GitHub
                            </a>
                          )}
                          {product.demo_url && (
                            <a
                              href={product.demo_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline"
                            >
                              Demo
                            </a>
                          )}
                        </div>
                        <p className="text-sm font-semibold mb-4">
                          Price: ₹{(product.price * 80).toFixed(0)}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleApprove(product.id)}
                            className="gap-2"
                          >
                            <Check className="h-4 w-4" />
                            Approve
                          </Button>
                          <div className="flex-1 flex gap-2">
                            <Textarea
                              placeholder="Rejection reason..."
                              value={rejectionReason[product.id] || ""}
                              onChange={(e) =>
                                setRejectionReason((prev) => ({
                                  ...prev,
                                  [product.id]: e.target.value,
                                }))
                              }
                              className="flex-1"
                            />
                            <Button
                              variant="destructive"
                              onClick={() => handleReject(product.id)}
                              className="gap-2"
                            >
                              <X className="h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Admin;
