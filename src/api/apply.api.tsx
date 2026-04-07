'use server';

import axios from 'axios';

import { Apply } from '@/interfaces/apply.interface';
import { CreateJobApplyRequestInterface } from '@/interfaces/request/create-apply-request.interface';

const APPLY_API_URL = 'http://localhost:3002/apply';

export type UpdateApplyRequestInterface = Partial<CreateJobApplyRequestInterface>;

/**
 * List all applies with API.
 */
export async function getApplies(): Promise<Apply[]> {
  const { data } = await axios.get<Apply[]>(
    APPLY_API_URL,
  );

  return data;
}

export const getAllApplies = getApplies;

/**
 * Create a new job apply with API.
 */
export async function createNewJobApply(
  data: CreateJobApplyRequestInterface,
): Promise<Apply> {
  try {
    const response = await axios.post<Apply>(APPLY_API_URL, data);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const apiMessage =
        typeof error.response?.data === 'object' &&
        error.response?.data &&
        'message' in error.response.data
          ? String(error.response.data.message)
          : error.message;

      throw new Error(apiMessage);
    }

    throw error;
  }
}

export const createApply = createNewJobApply;


/**
 * Get apply from API.
 */
export async function getApply(applyId: string): Promise<Apply> {
  const { data } = await axios.get<Apply>(`${APPLY_API_URL}/${applyId}`);

  return data;
}

/**
 * Update apply with API.
 */
export async function updateApply(
  applyId: string,
  data: UpdateApplyRequestInterface,
): Promise<Apply> {
  const response = await axios.patch<Apply>(`${APPLY_API_URL}/${applyId}`, data);

  return response.data;
}

/**
 * Delete apply with API.
 */
export async function deleteApply(applyId: string): Promise<void> {
  await axios.delete(`${APPLY_API_URL}/${applyId}`);
}
