'use server';

import { apiClient } from '@/services/http/api-client';
import type {
  CreateJobPayload,
  CreateJobResponse,
  DeleteJobResponse,
  ListJobsResponse,
  ReadJobResponse,
  UpdateJobPayload,
  UpdateJobResponse,
} from './job.types';

const JOB_API_URL = 'http://localhost:3000/job';

/**
 * Retrieves the jobs list.
 *
 * @param {string} [token] - Optional JWT access token.
 * @returns {Promise<ListJobsResponse>} Jobs list.
 */
export async function listJobs(
  token?: string,
): Promise<ListJobsResponse> {
  return apiClient<ListJobsResponse>(JOB_API_URL, '', {
    method: 'GET',
    token,
  });
}

/**
 * Creates a new job.
 *
 * @param {CreateJobPayload} payload - Job creation data.
 * @param {string} [token] - Optional JWT access token.
 * @returns {Promise<CreateJobResponse>} Created job data.
 */
export async function createJob(
  payload: CreateJobPayload,
  token?: string,
): Promise<CreateJobResponse> {
  return apiClient<CreateJobResponse>(JOB_API_URL, '', {
    method: 'POST',
    token,
    body: payload,
  });
}

export async function createNewJob(
  payload: CreateJobPayload,
  token?: string,
): Promise<CreateJobResponse> {
  return createJob(payload, token);
}

/**
 * Retrieves a job by id.
 *
 * @param {string} id - Job id.
 * @param {string} [token] - Optional JWT access token.
 * @returns {Promise<ReadJobResponse>} Job data.
 */
export async function readJob(
  id: string,
  token?: string,
): Promise<ReadJobResponse> {
  return apiClient<ReadJobResponse>(JOB_API_URL, `/${id}`, {
    method: 'GET',
    token,
  });
}

export async function getJob(
  id: string,
  token?: string,
): Promise<ReadJobResponse> {
  return readJob(id, token);
}

/**
 * Updates a job by id.
 *
 * @param {string} id - Job id.
 * @param {UpdateJobPayload} payload - Job update data.
 * @param {string} [token] - Optional JWT access token.
 * @returns {Promise<UpdateJobResponse>} Updated job data.
 */
export async function updateJob(
  id: string,
  payload: UpdateJobPayload,
  token?: string,
): Promise<UpdateJobResponse> {
  return apiClient<UpdateJobResponse>(JOB_API_URL, `/${id}`, {
    method: 'PATCH',
    token,
    body: payload,
  });
}

/**
 * Deletes a job by id.
 *
 * @param {string} id - Job id.
 * @param {string} [token] - Optional JWT access token.
 * @returns {Promise<DeleteJobResponse | null>} Delete operation result.
 */
export async function deleteJob(
  id: string,
  token?: string,
): Promise<DeleteJobResponse | null> {
  return apiClient<DeleteJobResponse | null>(JOB_API_URL, `/${id}`, {
    method: 'DELETE',
    token,
  });
}
