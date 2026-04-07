'use server';

import axios from 'axios';

import { Job } from '@/interfaces/job.interface';
import { CreateJobRequestInterface } from '@/interfaces/request/create-job-request.interface';
import { ListJobResponseInterface } from '@/interfaces/responses/list-job-response.interface';
import { ReadJobResponseInterface } from '@/interfaces/responses/read-job-response.interface';

const JOB_API_URL = 'http://localhost:3002/job';

export type UpdateJobRequestInterface = Partial<CreateJobRequestInterface>;

/**
 * List all jobs with API.
 */
export async function getAllJobs(): Promise<ListJobResponseInterface> {
  const { data } = await axios.get<ListJobResponseInterface>(
    JOB_API_URL,
  );

  return data;
}

/**
 * Create a new job with API.
 */
export async function createNewJob(
  data: CreateJobRequestInterface,
): Promise<Job> {
  const response = await axios.post<Job>(JOB_API_URL, data);

  return response.data;
}

export const createJob = createNewJob;


/**
 * Get job from API.
 */
export async function getJob(jobId: string): Promise<ReadJobResponseInterface> {
  const { data } = await axios.get<ReadJobResponseInterface>(`${JOB_API_URL}/${jobId}`);

  return data;
}

/**
 * Update job with API.
 */
export async function updateJob(
  jobId: string,
  data: UpdateJobRequestInterface,
): Promise<Job> {
  const response = await axios.patch<Job>(`${JOB_API_URL}/${jobId}`, data);

  return response.data;
}

/**
 * Delete job with API.
 */
export async function deleteJob(jobId: string): Promise<void> {
  await axios.delete(`${JOB_API_URL}/${jobId}`);
}
