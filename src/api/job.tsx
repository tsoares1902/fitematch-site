'use server';

import axios from 'axios';

import { Job } from '@/interfaces/job.interface';
import { CreateJobRequestInterface } from '@/interfaces/request/create-job-request.interface';
import { ListJobResponseInterface } from '@/interfaces/responses/list-job-response.interface';

const JOB_API_URL = 'http://localhost:3002/job';

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
  const payload: CreateJobRequestInterface = {
    companyId: data.companyId,
    slug: data.slug,
    title: data.title,
    slots: data.slots,
    role: data.role,
    logo: data.logo,
    logoAlt: data.logoAlt,
    status: data.status,
  };

  const response = await axios.post<Job>(JOB_API_URL, payload);

  return response.data;
}
