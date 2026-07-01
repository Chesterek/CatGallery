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

// TODO: large production apps should differentiate between frontend and backend interfaces.
// This is an additional layer to catch API mismatch errors. Allows for quick error detection before data reaches application.
// Allows to limit amount of data reaching components to required minimum.
// With dedicated backend proxy (BaaS) this is not as critical; however, still helpful