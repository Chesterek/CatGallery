export interface CatImage {
  id: string;
  url: string;
  width: number;
  height: number;
}

export interface CatBreed {
  id: string;
  name: string;
  origin: string;
  life_span: string;
  wikipedia_url?: string;
  weight: {
    imperial: string;
    metric: string;
  };
}

export interface CatImageDetail extends CatImage {
  breeds: CatBreed[];
}
