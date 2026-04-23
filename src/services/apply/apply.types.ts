export type ApplyStatus =
  | 'active'
  | 'freeze'
  | 'inactive'
  | 'canceled'
  | 'pending'
  | 'in_review'
  | 'approved'
  | 'rejected'
  | 'withdrawn';

export interface ApplyItem {
  id: string;
  companyId?: string;
  jobId: string;
  userId: string;
  status: ApplyStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateApplyPayload {
  companyId?: string;
  jobId: string;
  userId: string;
  status?: ApplyStatus;
}

export type Apply = ApplyItem;

export type CreateApplyResponse = ApplyItem;

export type ListAppliesResponse = ApplyItem[];

export type ReadApplyResponse = ApplyItem;

export interface UpdateApplyPayload {
  status?: ApplyStatus;
}

export type UpdateApplyResponse = ApplyItem;

export interface DeleteApplyResponse {
  message?: string;
}
