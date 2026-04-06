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
  const payload: CreateUserRequestInterface = {
    role: data.role,
    username: data.username,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: data.password,
    birthday: data.birthday
  };

  const response = await axios.post<User>(`${USER_API_URL}/`, payload);

  return response.data;
}

/**
 * Get user from API.
 */
export async function getUser(userId: string): Promise<User> {
  const { data } = await axios.get<User>(`${USER_API_URL}/${userId}`);

  return data;
}

/**
 * Update user with API.
 */
export async function updateUser(
  userId: string,
  data: UpdateUserRequestInterface,
): Promise<User> {
  const payload: UpdateUserRequestInterface = {
    role: data.role,
    username: data.username,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: data.password,
    birthday: data.birthday,
    status: data.status,
  };

  const response = await axios.patch<User>(
    `${USER_API_URL}/${userId}`,
    payload,
  );

  return response.data;
}

/**
 * Delete user with API.
 */
export async function deleteUser(userId: string): Promise<void> {
  await axios.delete(`${USER_API_URL}/${userId}`);
}
