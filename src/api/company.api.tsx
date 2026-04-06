'use server';

import axios from 'axios';

import { ListCompanyResponseInterface } from '@/interfaces/responses/list-company-response.interface';
import { Company } from '@/interfaces/company.interface';
import { CreateCompanyRequestInterface } from '@/interfaces/request/create-company-request.interface';
const COMPANY_API_URL = 'http://localhost:3002/company';

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
  const payload: CreateCompanyRequestInterface = {
    slug: data.slug,
    name: data.name,
    address: data.address,
    social: data.social,
    role: data.role,
    status: data.status,
  };

  const response = await axios.post<Company>(COMPANY_API_URL, payload);

  return response.data;
}
