'use server';

import { apiClient } from '@/services/http/api-client';

import type { User } from './user.types';

const USER_API_URL = 'http://localhost:3000/users';

export async function getUser(userId: string): Promise<User> {
  return apiClient<User>(USER_API_URL, `/${userId}`, {
    method: 'GET',
  });
}
