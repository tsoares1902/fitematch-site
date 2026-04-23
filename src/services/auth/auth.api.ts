'use server';

import { apiClient } from '@/services/http/api-client';
import type {
  ActivateAccountPayload,
  ActivateAccountResponse,
  ActivationCodePayload,
  ActivationCodeResponse,
  GetSessionsByUserPayload,
  GetSessionsByUserResponse,
  AuthUser,
  RefreshTokenPayload,
  RefreshTokenResponse,
  SignInPayload,
  SignInResponse,
  SignOutPayload,
  SignOutResponse,
  SignUpPayload,
  SignUpResponse,
  UpdateMePayload,
} from './auth.types';

const AUTH_API_URL = 'http://localhost:3000/auth';

/**
 * Creates a new user account.
 *
 * @param {SignUpPayload} payload - User registration data.
 * @returns {Promise<SignUpResponse>} Created user data.
 */
export async function signUp(
  payload: SignUpPayload,
): Promise<SignUpResponse> {
  return apiClient<SignUpResponse>(AUTH_API_URL, '/sign-up', {
    method: 'POST',
    body: payload,
  });
}

/**
 * Authenticates a user and returns tokens.
 *
 * @param {SignInPayload} payload - User credentials.
 * @returns {Promise<SignInResponse>} Auth tokens and user data.
 */
export async function signIn(
  payload: SignInPayload,
): Promise<SignInResponse> {
  return apiClient<SignInResponse>(AUTH_API_URL, '/sign-in', {
    method: 'POST',
    body: payload,
  });
}

export async function getSessionsByUser(
  payload: GetSessionsByUserPayload,
): Promise<GetSessionsByUserResponse> {
  return apiClient<GetSessionsByUserResponse>(
    AUTH_API_URL,
    `/sessions/${payload.userId}`,
    {
      method: 'GET',
      token: payload.access_token,
    },
  );
}

/**
 * Retrieves the authenticated user data.
 *
 * @param {string} token - JWT access token.
 * @returns {Promise<AuthUser>} User profile data.
 */
export async function me(token: string): Promise<AuthUser> {
  return apiClient<AuthUser>(AUTH_API_URL, '/me', {
    method: 'GET',
    token,
  });
}

/**
 * Updates the authenticated user profile.
 *
 * @param {string} token - JWT access token.
 * @param {UpdateMePayload} payload - Data to update.
 * @returns {Promise<AuthUser>} Updated user data.
 */
export async function updateMe(
  token: string,
  payload: UpdateMePayload,
): Promise<AuthUser> {
  return apiClient<AuthUser>(AUTH_API_URL, '/me', {
    method: 'PATCH',
    token,
    body: payload,
  });
}

/**
 * Requests a new activation code for a user.
 *
 * @param {ActivationCodePayload} payload - User email.
 * @returns {Promise<ActivationCodeResponse>} Operation result.
 */
export async function activationCode(
  payload: ActivationCodePayload,
): Promise<ActivationCodeResponse> {
  return apiClient<ActivationCodeResponse>(AUTH_API_URL, '/activation-code', {
    method: 'POST',
    body: payload,
  });
}

/**
 * Activates a user account using a code.
 *
 * @param {ActivateAccountPayload} payload - Email and activation code.
 * @returns {Promise<ActivateAccountResponse>} Operation result.
 */
export async function activateAccount(
  payload: ActivateAccountPayload,
): Promise<ActivateAccountResponse> {
  return apiClient<ActivateAccountResponse>(AUTH_API_URL, '/activate-account', {
    method: 'POST',
    body: payload,
  });
}

/**
 * Refreshes authentication tokens.
 *
 * @param {RefreshTokenPayload} payload - Refresh token.
 * @returns {Promise<RefreshTokenResponse>} New tokens.
 */
export async function refreshToken(
  payload: RefreshTokenPayload,
): Promise<RefreshTokenResponse> {
  return apiClient<RefreshTokenResponse>(AUTH_API_URL, '/refresh', {
    method: 'POST',
    body: payload,
  });
}

/**
 * Signs out the user and invalidates the session.
 *
 * @param {SignOutPayload} payload - Refresh token.
 * @returns {Promise<SignOutResponse>} Operation result.
 */
export async function signOut(
  payload: SignOutPayload,
): Promise<SignOutResponse> {
  return apiClient<SignOutResponse>(AUTH_API_URL, '/sign-out', {
    method: 'POST',
    body: payload,
  });
}
