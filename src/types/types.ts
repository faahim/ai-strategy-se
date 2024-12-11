export type TTool = {
  id: number;
  name: string;
  url: string;
  logo_url: string;
  description: string;
  category: string;
  tags: string[];
  provider: string;
  pricing_model: string;
  api_availability: boolean | string;
};
