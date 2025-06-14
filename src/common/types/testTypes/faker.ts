export type FakerDateRecentInput = {
  days: number;
};

export interface ApiParameter {
  name: string;
  required: boolean;
  schema: {
    format: string;
    type?: string;
  };
  in?: string;
  description?: string;
}
