'use server';

import axios from 'axios';

import { Job } from '@/interfaces/job.interface';
import { CreateJobRequestInterface } from '@/interfaces/request/create-job-request.interface';
import { ListJobResponseInterface } from '@/interfaces/responses/list-job-response.interface';
import { ReadJobResponseInterface } from '@/interfaces/responses/read-job-response.interface';

const JOB_API_URL = 'http://localhost:3002/job';

export type UpdateJobRequestInterface = Partial<CreateJobRequestInterface>;

export interface JobListPagination {
  currentPage: number;
  totalPages: number;
  perPage: number;
  totalItems: number;
}

export interface JobListResult {
  jobs: Job[];
  pagination: JobListPagination;
}

function normalizePagination(
  pagination: ListJobResponseInterface["metadata"] extends { pagination?: infer T }
    ? T
    : unknown,
  jobsLength: number,
  fallbackPage: number,
  fallbackLimit: number,
): JobListPagination {
  const paginationData =
    pagination && typeof pagination === "object"
      ? (pagination as Record<string, unknown>)
      : {};

  const readNumber = (...keys: string[]) => {
    for (const key of keys) {
      const value = paginationData[key];

      if (typeof value === "number" && Number.isFinite(value)) {
        return value;
      }
    }

    return undefined;
  };

  const currentPage = readNumber("currentPage", "page", "current_page") ?? fallbackPage;
  const perPage = readNumber("perPage", "limit", "pageSize", "page_size") ?? fallbackLimit;
  const totalItems = readNumber("totalItems", "total", "count", "total_count") ?? jobsLength;
  const totalPages =
    readNumber("totalPages", "pages", "pageCount", "page_count") ??
    Math.max(1, Math.ceil(totalItems / Math.max(perPage, 1)));

  return {
    currentPage,
    totalPages,
    perPage,
    totalItems,
  };
}

/**
 * List all jobs with API.
 */
export async function getAllJobs(
  options?: {
    page?: number;
    limit?: number;
  },
): Promise<JobListResult> {
  const page = options?.page;
  const limit = options?.limit;
  const { data } = await axios.get<ListJobResponseInterface>(
    JOB_API_URL,
    {
      params:
        page || limit
          ? {
              ...(page ? { page } : {}),
              ...(limit ? { limit } : {}),
            }
          : undefined,
    },
  );

  const jobs = Array.isArray(data.data) ? data.data : [];
  const fallbackPage = page ?? 1;
  const fallbackLimit = limit ?? Math.max(jobs.length, 1);

  return {
    jobs,
    pagination: normalizePagination(
      data.metadata?.pagination,
      jobs.length,
      fallbackPage,
      fallbackLimit,
    ),
  };
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
