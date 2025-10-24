import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Package, ShoppingBag, Star } from "lucide-react";

interface Profile {
  username: string;
  bio: string;
  avatar_url: string;
}

interface Stats {
  productsBuilt: number;
  productsBought: number;
  totalDownloads: number;
  avgRating: number;
}

const Profile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<Stats>({
    productsBuilt: 0,
    productsBought: 0,
    totalDownloads: 0,
    avgRating: 0,
  });
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      const targetUserId = userId || (await supabase.auth.getUser()).data.user?.id;
      if (!targetUserId) return;

      // Load profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", targetUserId)
        .single();

      if (profileData) setProfile(profileData);

      // Load products built
      const { data: builtProducts } = await supabase
        .from("products")
        .select("*")
        .eq("vendor_id", targetUserId)
        .eq("status", "approved");

      if (builtProducts) {
        setProducts(builtProducts);
        const totalDownloads = builtProducts.reduce((sum, p) => sum + (p.downloads || 0), 0);
        const avgRating =
          builtProducts.reduce((sum, p) => sum + (p.rating || 0), 0) / builtProducts.length || 0;

        setStats((prev) => ({
          ...prev,
          productsBuilt: builtProducts.length,
          totalDownloads,
          avgRating,
        }));
      }

      // Load purchases
      const { data: purchases } = await supabase
        .from("purchases")
        .select("id")
        .eq("user_id", targetUserId);

      if (purchases) {
        setStats((prev) => ({ ...prev, productsBought: purchases.length }));
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-12">
          <p>Loading...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-12">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            {profile?.avatar_url && (
              <img
                src={profile.avatar_url}
                alt={profile.username}
                className="w-20 h-20 rounded-full"
              />
            )}
            <div>
              <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                {profile?.username || "User Profile"}
              </h1>
              {profile?.bio && (
                <p className="text-muted-foreground mt-2">{profile.bio}</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-card border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Projects Built
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.productsBuilt}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Projects Bought
              </CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.productsBought}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Downloads
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.totalDownloads}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Rating
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {stats.avgRating.toFixed(1)}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-6">Published Projects</h2>
          {products.length === 0 ? (
            <Card className="bg-gradient-card border-border/50">
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">No published projects yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
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
                    <h3 className="font-semibold mb-2">{product.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{product.category}</Badge>
                      <span className="text-sm font-semibold">
                        ₹{(product.price * 80).toFixed(0)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;
