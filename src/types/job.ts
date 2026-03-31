type Company = {
  name: string;
  image: string;
  designation: string;
};

export type Job = {
  id: number;
  title: string;
  paragraph: string;
  image: string;
  company: Company;
  tags: string[];
  publishDate: string;
};
