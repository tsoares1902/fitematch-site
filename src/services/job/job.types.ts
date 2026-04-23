export type JobStatus = 'pending' | 'active' | 'inactive' | 'banned';

export type LanguagesEnum = 'portuguese' | 'english' | 'spanish';

export type LanguagesLevelEnum =
  | 'basic'
  | 'intermediate'
  | 'advanced'
  | 'fluent'
  | 'native';

export type EducationLevelEnum =
  | 'high_school'
  | 'technical'
  | 'bachelor'
  | 'associate'
  | 'postgraduate'
  | 'mba'
  | 'master'
  | 'doctorate'
  | 'extension'
  | 'other';

export type SoftSkillsEnum =
  | 'COMMUNICATION'
  | 'EMPATHY'
  | 'LEADERSHIP'
  | 'MOTIVATION'
  | 'PROACTIVITY'
  | 'TEAMWORK'
  | 'ADAPTABILITY'
  | 'DISCIPLINE'
  | 'ORGANIZATION'
  | 'TIME_MANAGEMENT'
  | 'CUSTOMER_SERVICE'
  | 'ACTIVE_LISTENING'
  | 'CONFLICT_RESOLUTION'
  | 'PROBLEM_SOLVING'
  | 'RESILIENCE'
  | 'PROFESSIONAL_ETHICS'
  | 'RESPONSIBILITY'
  | 'PATIENCE'
  | 'ATTENTION_TO_DETAIL'
  | 'POSITIVE_ATTITUDE';

export type HardSkillsEnum =
  | 'FUNCTIONAL_ASSESSMENT'
  | 'EXERCISE_PRESCRIPTION'
  | 'STRENGTH_TRAINING'
  | 'HYPERTROPHY_TRAINING'
  | 'WEIGHT_LOSS_TRAINING'
  | 'CARDIOVASCULAR_TRAINING'
  | 'MOBILITY_TRAINING'
  | 'FLEXIBILITY_TRAINING'
  | 'GROUP_CLASSES'
  | 'FUNCTIONAL_TRAINING'
  | 'HIIT'
  | 'PILATES'
  | 'YOGA'
  | 'INDOOR_CYCLING'
  | 'PERSONAL_TRAINING'
  | 'SPORTS_CONDITIONING'
  | 'REHABILITATION_SUPPORT'
  | 'POSTURAL_CORRECTION'
  | 'BODY_COMPOSITION_ASSESSMENT'
  | 'ANTHROPOMETRIC_EVALUATION'
  | 'TRAINING_PERIODIZATION'
  | 'WORKOUT_PLAN_DESIGN'
  | 'EQUIPMENT_INSTRUCTION'
  | 'FIRST_AID'
  | 'CPR'
  | 'FITNESS_SOFTWARE'
  | 'SALES_AND_MEMBERSHIP'
  | 'NUTRITION_BASICS';

export interface JobLanguageRequirement {
  name: LanguagesEnum;
  level: LanguagesLevelEnum;
}

export interface JobSkillGroup<TSkill extends string> {
  required?: TSkill[];
  niceToHave?: TSkill[];
}

export interface JobRequirements {
  educationLevel?: EducationLevelEnum[];
  minExperienceYears?: number;
  maxExperienceYears?: number;
  languages?: JobLanguageRequirement[];
  hardSkills?: JobSkillGroup<HardSkillsEnum>;
  softSkills?: JobSkillGroup<SoftSkillsEnum>;
}

export interface JobBenefits {
  salary?: string;
  healthInsurance?: boolean;
  dentalInsurance?: boolean;
  alimentationVoucher?: boolean;
  transportationVoucher?: boolean;
}

export interface JobMedia {
  coverUrl?: string;
}

export interface JobItem {
  _id?: string;
  id: string;
  slug: string;
  companyId: string;
  title: string;
  description: string;
  cover?: string;
  slots: number;
  requirements?: JobRequirements;
  benefits?: JobBenefits;
  role?: string;
  media?: JobMedia;
  status: JobStatus;
  company?: Company;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateJobPayload {
  slug?: string;
  companyId: string;
  title: string;
  description: string;
  slots: number;
  requirements?: JobRequirements;
  benefits?: {
    salary?: number;
    healthInsurance?: boolean;
    dentalInsurance?: boolean;
    alimentationVoucher?: boolean;
    transportationVoucher?: boolean;
  };
  media?: JobMedia;
  status?: JobStatus;
}

export type CreateJobResponse = JobItem;

export interface UpdateJobPayload {
  slug?: string;
  companyId?: string;
  title?: string;
  description?: string;
  slots?: number;
  requirements?: JobRequirements;
  benefits?: {
    salary?: number;
    healthInsurance?: boolean;
    dentalInsurance?: boolean;
    alimentationVoucher?: boolean;
    transportationVoucher?: boolean;
  };
  media?: JobMedia;
  status?: JobStatus;
}

export type Job = JobItem;

export type UpdateJobResponse = JobItem;

export type ReadJobResponse = JobItem;

export type ListJobsResponse = JobItem[];

export interface DeleteJobResponse {
  message?: string;
}
import type { Company } from '@/services/company/company.types';
