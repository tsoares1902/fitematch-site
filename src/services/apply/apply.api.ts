'use server';

import { apiClient } from '@/services/http/api-client';
import type {
  CreateApplyPayload,
  CreateApplyResponse,
  DeleteApplyResponse,
  ListAppliesResponse,
  ReadApplyResponse,
  UpdateApplyPayload,
  UpdateApplyResponse,
} from './apply.types';

const APPLY_API_URL = 'http://localhost:3000/apply';

/**
 * Retrieves the applies list.
 *
 * @param {string} [token] - Optional JWT access token.
 * @returns {Promise<ListAppliesResponse>} Applies list.
 */
export async function listApplies(token?: string): Promise<ListAppliesResponse> {
  return apiClient<ListAppliesResponse>(APPLY_API_URL, '', {
    method: 'GET',
    token,
  });
}

export async function getAllApplies(
  token?: string,
): Promise<ListAppliesResponse> {
  return listApplies(token);
}

/**
 * Creates a new apply.
 *
 * @param {CreateApplyPayload} payload - Apply creation data.
 * @param {string} [token] - Optional JWT access token.
 * @returns {Promise<CreateApplyResponse>} Created apply data.
 */
export async function createApply(
  payload: CreateApplyPayload,
  token?: string,
): Promise<CreateApplyResponse> {
  return apiClient<CreateApplyResponse>(APPLY_API_URL, '', {
    method: 'POST',
    token,
    body: payload,
  });
}

export async function createNewJobApply(
  payload: CreateApplyPayload,
  token?: string,
): Promise<CreateApplyResponse> {
  return createApply(payload, token);
}

/**
 * Retrieves a single apply by id.
 *
 * @param {string} id - Apply id.
 * @param {string} [token] - Optional JWT access token.
 * @returns {Promise<ReadApplyResponse>} Apply data.
 */
export async function readApply(
  id: string,
  token?: string,
): Promise<ReadApplyResponse> {
  return apiClient<ReadApplyResponse>(APPLY_API_URL, `/${id}`, {
    method: 'GET',
    token,
  });
}

/**
 * Updates an apply by id.
 *
 * @param {string} id - Apply id.
 * @param {UpdateApplyPayload} payload - Apply update data.
 * @param {string} [token] - Optional JWT access token.
 * @returns {Promise<UpdateApplyResponse>} Updated apply data.
 */
export async function updateApply(
  id: string,
  payload: UpdateApplyPayload,
  token?: string,
): Promise<UpdateApplyResponse> {
  return apiClient<UpdateApplyResponse>(APPLY_API_URL, `/${id}`, {
    method: 'PATCH',
    token,
    body: payload,
  });
}

/**
 * Deletes an apply by id.
 *
 * @param {string} id - Apply id.
 * @param {string} [token] - Optional JWT access token.
 * @returns {Promise<DeleteApplyResponse | null>} Delete operation result.
 */
export async function deleteApply(
  id: string,
  token?: string,
): Promise<DeleteApplyResponse | null> {
  return apiClient<DeleteApplyResponse | null>(APPLY_API_URL, `/${id}`, {
    method: 'DELETE',
    token,
  });
}
