import { JobBenefits } from "@/interfaces/job-benefits.interface";

export interface CreateJobRequestInterface {
  id?: string;
  companyId: string;
  slug: string;
  title: string;
  slots: number;
  benefits: JobBenefits;
  isPaidAdvertising?: boolean;
  role: "intern" | "freelance" | "contract_person" | "contract_company";
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}
