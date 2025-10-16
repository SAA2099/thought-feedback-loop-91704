export type Product = 
  | "Nebula Force"
  | "Iron Fist"
  | "Quantum Leap"
  | "Thunder Burst"
  | "Adrenaline Shock"
  | "Sonic Boom"
  | "Inferno X"
  | "Platinum Push"
  | "Dragon Fury"
  | "Velocity Punch";

export type Sentiment = "positive" | "neutral" | "negative";

export interface Feedback {
  id: string;
  userName: string;
  productName: Product;
  rating: number;
  comment: string;
  sentiment: Sentiment;
  createdAt: Date;
}
