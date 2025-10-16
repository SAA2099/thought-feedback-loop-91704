import { Badge } from "@/components/ui/badge";

interface SentimentBadgeProps {
  sentiment: "positive" | "neutral" | "negative";
}

const SentimentBadge = ({ sentiment }: SentimentBadgeProps) => {
  const variants = {
    positive: "bg-success text-success-foreground hover:bg-success/90",
    neutral: "bg-muted text-muted-foreground hover:bg-muted/90",
    negative: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  };

  const labels = {
    positive: "Positive",
    neutral: "Neutral",
    negative: "Negative",
  };

  return (
    <Badge className={variants[sentiment]}>
      {labels[sentiment]}
    </Badge>
  );
};

export default SentimentBadge;
