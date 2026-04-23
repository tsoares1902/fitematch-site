'use server';

import { apiClient } from '@/services/http/api-client';
import type {
  CreateCompanyPayload,
  CreateCompanyResponse,
  ListCompaniesResponse,
  ReadCompanyResponse,
  UpdateCompanyPayload,
  UpdateCompanyResponse,
} from './company.types';

const COMPANY_API_URL = 'http://localhost:3000/company';

function normalizeCompany(company: ReadCompanyResponse): ReadCompanyResponse {
  return {
    ...company,
    name: company.name ?? company.tradeName,
    address: company.address ?? company.contacts.address,
    social: {
      ...company.contacts.social,
      ...company.social,
      twitter: company.social?.twitter ?? company.contacts.social?.x,
    },
    logo: company.logo ?? company.media.logoUrl,
    cover: company.cover ?? company.media.coverUrl,
  };
}

/**
 * Retrieves the companies list.
 *
 * @param {string} [token] - Optional JWT access token.
 * @returns {Promise<ListCompaniesResponse>} Companies list.
 */
export async function listCompanies(
  token?: string,
): Promise<ListCompaniesResponse> {
  const companies = await apiClient<ListCompaniesResponse>(COMPANY_API_URL, '', {
    method: 'GET',
    token,
  });

  return companies.map(normalizeCompany);
}

export async function getAllCompanies(
  token?: string,
): Promise<ListCompaniesResponse> {
  return listCompanies(token);
}

/**
 * Creates a new company.
 *
 * @param {CreateCompanyPayload} payload - Company creation data.
 * @param {string} [token] - Optional JWT access token.
 * @returns {Promise<CreateCompanyResponse>} Created company data.
 */
export async function createCompany(
  payload: CreateCompanyPayload,
  token?: string,
): Promise<CreateCompanyResponse> {
  return apiClient<CreateCompanyResponse>(COMPANY_API_URL, '', {
    method: 'POST',
    token,
    body: payload,
  });
}

/**
 * Retrieves a company by id.
 *
 * @param {string} id - Company id.
 * @param {string} [token] - Optional JWT access token.
 * @returns {Promise<ReadCompanyResponse>} Company data.
 */
export async function readCompany(
  id: string,
  token?: string,
): Promise<ReadCompanyResponse> {
  const company = await apiClient<ReadCompanyResponse>(COMPANY_API_URL, `/${id}`, {
    method: 'GET',
    token,
  });

  return normalizeCompany(company);
}

/**
 * Updates a company by id.
 *
 * @param {string} id - Company id.
 * @param {UpdateCompanyPayload} payload - Company update data.
 * @param {string} [token] - Optional JWT access token.
 * @returns {Promise<UpdateCompanyResponse>} Updated company data.
 */
export async function updateCompany(
  id: string,
  payload: UpdateCompanyPayload,
  token?: string,
): Promise<UpdateCompanyResponse> {
  return apiClient<UpdateCompanyResponse>(COMPANY_API_URL, `/${id}`, {
    method: 'PATCH',
    token,
    body: payload,
  });
}
