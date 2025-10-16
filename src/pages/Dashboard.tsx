import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import StarRating from "@/components/StarRating";
import SentimentBadge from "@/components/SentimentBadge";
import { dummyFeedback } from "@/data/dummyFeedback";
import { MessageSquarePlus, ArrowUpDown, TrendingUp, TrendingDown, Award } from "lucide-react";
import { Product } from "@/types/feedback";

type SortField = "id" | "userName" | "productName" | "rating" | "sentiment";
type SortDirection = "asc" | "desc";

const Dashboard = () => {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedFeedback = [...dummyFeedback].sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case "id":
        comparison = a.id.localeCompare(b.id);
        break;
      case "userName":
        comparison = a.userName.localeCompare(b.userName);
        break;
      case "productName":
        comparison = a.productName.localeCompare(b.productName);
        break;
      case "rating":
        comparison = a.rating - b.rating;
        break;
      case "sentiment":
        comparison = a.sentiment.localeCompare(b.sentiment);
        break;
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });

  const truncateComment = (comment: string, maxLength: number = 50) => {
    if (comment.length <= maxLength) return comment;
    return comment.substring(0, maxLength) + "...";
  };

  // Calculate product analytics
  const productAnalytics = useMemo(() => {
    const productStats = new Map<Product, { totalRating: number; count: number }>();
    
    dummyFeedback.forEach((feedback) => {
      const current = productStats.get(feedback.productName) || { totalRating: 0, count: 0 };
      productStats.set(feedback.productName, {
        totalRating: current.totalRating + feedback.rating,
        count: current.count + 1,
      });
    });

    const averageRatings = Array.from(productStats.entries()).map(([product, stats]) => ({
      product,
      avgRating: stats.totalRating / stats.count,
      count: stats.count,
    }));

    const sortedByRating = [...averageRatings].sort((a, b) => b.avgRating - a.avgRating);
    
    return {
      all: averageRatings.sort((a, b) => a.product.localeCompare(b.product)),
      top3: sortedByRating.slice(0, 3),
      bottom3: sortedByRating.slice(-3).reverse(),
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Feedback Dashboard
          </h1>
          <Button
            variant="default"
            onClick={() => navigate("/")}
            className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            <MessageSquarePlus className="h-4 w-4" />
            Add Feedback
          </Button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">Customer Reviews</h2>
          <p className="text-muted-foreground">
            View and analyze all customer feedback in one place
          </p>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Average Rating Per Product */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Average Ratings
              </CardTitle>
              <CardDescription>Rating per product</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {productAnalytics.all.map((item) => (
                  <div key={item.product} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.product}</span>
                    <div className="flex items-center gap-2">
                      <StarRating rating={item.avgRating} readonly size={16} />
                      <span className="text-sm text-muted-foreground font-mono">
                        {item.avgRating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top 3 Performers */}
          <Card className="shadow-lg border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <TrendingUp className="h-5 w-5" />
                Top 3 Products
              </CardTitle>
              <CardDescription>Best performing products</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productAnalytics.top3.map((item, index) => (
                  <div key={item.product} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.product}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <StarRating rating={item.avgRating} readonly size={14} />
                        <span className="text-xs text-muted-foreground">
                          {item.avgRating.toFixed(2)} ({item.count} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Bottom 3 Performers */}
          <Card className="shadow-lg border-destructive/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <TrendingDown className="h-5 w-5" />
                Bottom 3 Products
              </CardTitle>
              <CardDescription>Products needing improvement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productAnalytics.bottom3.map((item, index) => (
                  <div key={item.product} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center font-bold text-destructive">
                      {productAnalytics.all.length - index}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.product}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <StarRating rating={item.avgRating} readonly size={14} />
                        <span className="text-xs text-muted-foreground">
                          {item.avgRating.toFixed(2)} ({item.count} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">
                    <button
                      onClick={() => handleSort("id")}
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      Review ID
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <button
                      onClick={() => handleSort("userName")}
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      User Name
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <button
                      onClick={() => handleSort("productName")}
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      Product Name
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <button
                      onClick={() => handleSort("rating")}
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      Rating
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </TableHead>
                  <TableHead className="font-semibold">Comments</TableHead>
                  <TableHead className="font-semibold">
                    <button
                      onClick={() => handleSort("sentiment")}
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      Sentiment
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedFeedback.map((feedback) => (
                  <TableRow key={feedback.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">{feedback.id}</TableCell>
                    <TableCell>{feedback.userName}</TableCell>
                    <TableCell>{feedback.productName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <StarRating rating={feedback.rating} readonly size={18} />
                        <span className="text-sm text-muted-foreground">
                          {feedback.rating}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-help hover:text-primary transition-colors hover:underline">
                              {truncateComment(feedback.comment)}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-md bg-popover p-4">
                            <p className="text-sm">{feedback.comment}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      <SentimentBadge sentiment={feedback.sentiment} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        <div className="mt-4 text-sm text-muted-foreground">
          Showing {sortedFeedback.length} reviews
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
