import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, GitBranch, Download } from "lucide-react";
import { Product } from "@/contexts/CartContext";

interface ProductCardProps extends Product {
  onViewDetails: (product: Product) => void;
}

export const ProductCard = ({ 
  id,
  title, 
  description, 
  price, 
  rating, 
  downloads, 
  category, 
  image,
  onViewDetails
}: ProductCardProps) => {
  const product = { id, title, description, price, rating, downloads, category, image };
  
  return (
    <Card className="overflow-hidden hover:shadow-elevated transition-all duration-300 border-border/50 bg-gradient-card">
      <div className="aspect-video relative overflow-hidden bg-muted">
        <img 
          src={image} 
          alt={title}
          className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
        />
        <Badge className="absolute top-3 right-3 bg-primary/90 backdrop-blur-sm">
          {category}
        </Badge>
      </div>
      
      <CardContent className="p-5">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{description}</p>
        
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
            <span>{rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="h-3.5 w-3.5" />
            <span>{downloads}</span>
          </div>
          <div className="flex items-center gap-1">
            <GitBranch className="h-3.5 w-3.5" />
            <span>GitHub</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-5 pt-0 flex items-center justify-between">
        <div className="font-bold text-2xl text-primary">
          ₹{price * 80}
        </div>
        <Button variant="hero" size="sm" onClick={() => onViewDetails(product)}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};
