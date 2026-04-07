'use server';

import axios from 'axios';

import { User } from '@/interfaces/user.interface';
import { CreateUserRequestInterface } from '@/interfaces/create-user-request.interface';
import { ListUsersResponseInterface } from '@/interfaces/list-user-request.interface';
import { UpdateUserRequestInterface } from '@/interfaces/update-user-request.interface';

const USER_API_URL = 'http://localhost:3001/user';

/**
 * List all users with API.
 */
export async function getAllUsers(): Promise<ListUsersResponseInterface> {
  const { data } = await axios.get<ListUsersResponseInterface>(
    USER_API_URL,
  );

  return data;
}

/**
 * Create a new user with API.
 */
export async function createUser(
  data: CreateUserRequestInterface,
): Promise<User> {
  const response = await axios.post<{ data: User }>(USER_API_URL, {
    isPaidMembership: data.isPaidMembership,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: data.password,
    birthday: data.birthday,
    role: data.role,
    status: data.status,
    documents: {
      identityDocument: data.identityDocument,
      socialDocument: data.socialDocument,
    },
    details: {
      phone: data.phone,
      isWhatsapp: data.isWhatsApp,
      isTelegram: data.isTelegram,
      street: data.street,
      number: typeof data.number === 'number' ? String(data.number) : data.number,
      complement: data.complement,
      neighborhood: data.neighborhood,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
    },
    social: {
      facebook: data.social?.facebook,
      x: data.social?.x ?? data.social?.twitter,
      instagram: data.social?.instagram,
      linkedin: data.social?.linkedin,
    },
  });

  return response.data.data;
}

/**
 * Get user from API.
 */
export async function getUser(userId: string): Promise<User> {
  const { data } = await axios.get<{ data: User }>(`${USER_API_URL}/${userId}`);

  return data.data;
}

/**
 * Update user with API.
 */
export async function updateUser(
  userId: string,
  data: UpdateUserRequestInterface,
): Promise<User> {
  const response = await axios.patch<{ data: User }>(
    `${USER_API_URL}/${userId}`,
    {
      isPaidMembership: data.isPaidMembership,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      birthday: data.birthday,
      role: data.role,
      status: data.status,
      documents: {
        identityDocument: data.identityDocument,
        socialDocument: data.socialDocument,
      },
      details: {
        phone: data.phone,
        isWhatsapp: data.isWhatsApp,
        isTelegram: data.isTelegram,
        street: data.street,
        number: typeof data.number === 'number' ? String(data.number) : data.number,
        complement: data.complement,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
      },
      social: {
        facebook: data.social?.facebook,
        x: data.social?.x ?? data.social?.twitter,
        instagram: data.social?.instagram,
        linkedin: data.social?.linkedin,
      },
    },
  );

  return response.data.data;
}

/**
 * Delete user with API.
 */
export async function deleteUser(userId: string): Promise<void> {
  await axios.delete(`${USER_API_URL}/${userId}`);
}
