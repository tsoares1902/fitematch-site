import type { Job } from './job.types';

export function getJobMongoId(job: Job): string | undefined {
  return job._id ?? job.id;
}
