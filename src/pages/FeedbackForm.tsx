import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import StarRating from "@/components/StarRating";
import { Product } from "@/types/feedback";
import { toast } from "@/hooks/use-toast";
import { BarChart3 } from "lucide-react";

const products: Product[] = [
  "Nebula Force",
  "Iron Fist",
  "Quantum Leap",
  "Thunder Burst",
  "Adrenaline Shock",
  "Sonic Boom",
  "Inferno X",
  "Platinum Push",
  "Dragon Fury",
  "Velocity Punch",
];

const FeedbackForm = () => {
  const navigate = useNavigate();
  const [productName, setProductName] = useState<Product | "">("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const maxChars = 500;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productName) {
      toast({
        title: "Product Required",
        description: "Please select a product before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please provide a rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (!comment.trim()) {
      toast({
        title: "Comment Required",
        description: "Please add a comment before submitting.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Feedback Submitted!",
      description: "Thank you for your valuable feedback.",
    });

    // Reset form
    setProductName("");
    setRating(0);
    setComment("");
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Customer Care Platform
          </h1>
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
            className="gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            View Dashboard
          </Button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl">Share Your Feedback</CardTitle>
            <CardDescription className="text-base">
              Help us improve by sharing your experience with our products
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="product">
                  Product Name <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={productName}
                  onValueChange={(value) => setProductName(value as Product)}
                >
                  <SelectTrigger id="product" className="w-full">
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {products.map((product) => (
                      <SelectItem key={product} value={product}>
                        {product}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>
                  Rating <span className="text-destructive">*</span>
                </Label>
                <div className="flex items-center gap-2">
                  <StarRating rating={rating} onRatingChange={setRating} size={32} />
                  {rating > 0 && (
                    <span className="text-sm text-muted-foreground ml-2">
                      {rating} out of 5 stars
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="comment">
                    Comments <span className="text-destructive">*</span>
                  </Label>
                  <span className="text-sm text-muted-foreground">
                    {comment.length}/{maxChars}
                  </span>
                </div>
                <Textarea
                  id="comment"
                  placeholder="Share your thoughts about the product..."
                  value={comment}
                  onChange={(e) => {
                    if (e.target.value.length <= maxChars) {
                      setComment(e.target.value);
                    }
                  }}
                  className="min-h-[150px] resize-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full text-base py-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
              >
                Submit Feedback
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default FeedbackForm;
