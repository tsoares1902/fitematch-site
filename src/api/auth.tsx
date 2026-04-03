'use server';

import axios from 'axios';

import { AuthAccessItemInterface } from '@/interfaces/auth-access-item.interface';
import { AuthAccessListResponseInterface } from '@/interfaces/auth-access-list-response.interface';
import { AuthAccessRequestInterface } from '@/interfaces/auth-access-request.interface';
import { AuthClientContextInterface } from '@/interfaces/auth-client-context.interface';
import { LoginRequestInterface } from '@/interfaces/login-request.interface';
import { LoginResponseInterface } from '@/interfaces/login-response.interface';
import { LogoutRequestInterface } from '@/interfaces/logout-request.interface';
import { LogoutResponseInterface } from '@/interfaces/logout-response.interface';


const AUTH_API_URL = 'http://localhost:3001/auth/';

/**
 * Login user with API.
 */
export async function login(
  credentials: LoginRequestInterface,
): Promise<LoginResponseInterface> {
  const payload: LoginRequestInterface = {
    client: credentials.client,
    email: credentials.email,
    password: credentials.password,
  };

  const response = await axios.post<LoginResponseInterface>(
    `${AUTH_API_URL}login`,
    payload,
  );

  return response.data;
}

/**
 * Login user with API and client access context metadata.
 */
export async function loginWithAccessContext(
  credentials: LoginRequestInterface,
  client: AuthClientContextInterface,
): Promise<LoginResponseInterface> {
  return login({
    ...credentials,
    client,
  });
}

/**
 * Logout user with API.
 */
export async function logout(
  token: LogoutRequestInterface,
): Promise<boolean> {
  const payload: LogoutRequestInterface = {
    access_token: token.access_token,
  };

  const response = await axios.post<LogoutResponseInterface>(
    `${AUTH_API_URL}logout`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    },
  );

  return response.data.success;
}

/**
 * List access history/sessions from API.
 */
export async function getSessionsByUser(
  data: AuthAccessRequestInterface,
): Promise<AuthAccessListResponseInterface> {
  const response = await axios.get<
    AuthAccessListResponseInterface | AuthAccessItemInterface[]
  >(
    `${AUTH_API_URL}sessions/${data.userId}`,
    {
      headers: {
        Authorization: `Bearer ${data.access_token}`,
      },
    },
  );

  if (Array.isArray(response.data)) {
    return {
      items: response.data,
    };
  }

  return {
    items: response.data.items ?? [],
  };
}
