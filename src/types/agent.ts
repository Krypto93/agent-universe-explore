
export interface Agent {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  users: number;
  runtime: string;
  author: string;
  tags: string[];
  features: string[];
  documentation: string;
  imageUrl?: string;
}
