'use server';

import axios from 'axios';

import { ListCompanyResponseInterface } from '@/interfaces/responses/list-company-response.interface';
import { Company } from '@/interfaces/company.interface';
import { CreateCompanyRequestInterface } from '@/interfaces/request/create-company-request.interface';

const COMPANY_API_URL = 'http://localhost:3002/company';

export type UpdateCompanyRequestInterface = Partial<CreateCompanyRequestInterface>;

/**
 * List all company with API.
 */
export async function getAllCompanies(): Promise<ListCompanyResponseInterface> {
  const { data } = await axios.get<ListCompanyResponseInterface>(
    COMPANY_API_URL,
  );

  return data;
}


/**
 * Create a new company with API.
 */
export async function createNewCompany(
  data: CreateCompanyRequestInterface,
): Promise<Company> {
  const response = await axios.post<Company>(COMPANY_API_URL, data);

  return response.data;
}

export const createCompany = createNewCompany;

/**
 * Get company from API.
 */
export async function getCompany(companyId: string): Promise<Company> {
  const { data } = await axios.get<Company>(`${COMPANY_API_URL}/${companyId}`);

  return data;
}

/**
 * Update company with API.
 */
export async function updateCompany(
  companyId: string,
  data: UpdateCompanyRequestInterface,
): Promise<Company> {
  const response = await axios.patch<Company>(`${COMPANY_API_URL}/${companyId}`, data);

  return response.data;
}

/**
 * Delete company with API.
 */
export async function deleteCompany(companyId: string): Promise<void> {
  await axios.delete(`${COMPANY_API_URL}/${companyId}`);
}
