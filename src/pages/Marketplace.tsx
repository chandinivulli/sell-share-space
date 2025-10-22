import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";

const mockProducts = [
  {
    id: 1,
    title: "E-Commerce Dashboard Template",
    description: "Complete admin dashboard with analytics, product management, and order tracking",
    price: 49,
    rating: 4.8,
    downloads: 1234,
    category: "Dashboard",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop"
  },
  {
    id: 2,
    title: "React Authentication System",
    description: "Full-featured authentication with JWT, OAuth, and role-based access control",
    price: 39,
    rating: 4.9,
    downloads: 2156,
    category: "Authentication",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=450&fit=crop"
  },
  {
    id: 3,
    title: "Portfolio Website Builder",
    description: "Modern portfolio template with animations, dark mode, and responsive design",
    price: 29,
    rating: 4.7,
    downloads: 987,
    category: "Portfolio",
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=450&fit=crop"
  },
  {
    id: 4,
    title: "Social Media Clone",
    description: "Full-stack social media platform with posts, comments, likes, and real-time chat",
    price: 79,
    rating: 4.9,
    downloads: 543,
    category: "Full Stack",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=450&fit=crop"
  },
  {
    id: 5,
    title: "Blog CMS Platform",
    description: "Content management system with markdown editor, SEO optimization, and analytics",
    price: 59,
    rating: 4.6,
    downloads: 876,
    category: "CMS",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=450&fit=crop"
  },
  {
    id: 6,
    title: "Task Management App",
    description: "Kanban-style task manager with drag-and-drop, teams, and project tracking",
    price: 45,
    rating: 4.8,
    downloads: 1567,
    category: "Productivity",
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=450&fit=crop"
  }
];

const categories = ["All", "Dashboard", "Authentication", "Portfolio", "Full Stack", "CMS", "Productivity"];

const Marketplace = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Discover Premium Projects
          </h1>
          <p className="text-muted-foreground text-lg">
            Browse thousands of ready-to-use web development projects and GitHub repositories
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search projects..." 
              className="pl-10 h-12"
            />
          </div>
          <Button variant="outline" size="lg" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        <div className="flex gap-2 mb-8 flex-wrap">
          {categories.map((category) => (
            <Badge 
              key={category}
              variant={category === "All" ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-4 py-2"
            >
              {category}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Marketplace;
