'use server';

import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Types based on auth.gql schema
interface LoginInput {
  email: string;
  password: string;
}

interface AuthToken {
  accessToken: string;
  idToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

interface AuthTokenResponse {
  success: boolean;
  message: string;
  data?: AuthToken;
  error?: string;
}

interface DecodedIdToken {
  sub: string;
  email: string;
  email_verified: boolean;
  given_name?: string;
  family_name?: string;
  picture?: string;
  exp: number;
  iat: number;
}

// GraphQL mutation for login
const LOGIN_MUTATION = `
  mutation LoginUser($input: LoginInput!) {
    loginUser(input: $input) {
      success
      message
      data {
        accessToken
        idToken
        refreshToken
        tokenType
        expiresIn
      }
      error
    }
  }
`;

// Function to make GraphQL request to auth endpoint
async function makeAuthRequest(query: string, variables: any): Promise<any> {
  const authEndpoint = process.env.NEXT_PUBLIC_AUTH_APPSYNC_ENDPOINT;
  const authApiKey = process.env.NEXT_PUBLIC_AUTH_APPSYNC_API_KEY;

  if (!authEndpoint || !authApiKey) {
    throw new Error('Auth AppSync configuration is missing');
  }

  const response = await fetch(authEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': authApiKey,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(result.errors[0]?.message || 'GraphQL error');
  }

  return result.data;
}

// Function to decode JWT token
function decodeIdToken(idToken: string): DecodedIdToken {
  try {
    // Decode without verification for now (in production, you should verify)
    const decoded = jwt.decode(idToken) as DecodedIdToken;
    if (!decoded) {
      throw new Error('Invalid token');
    }
    return decoded;
  } catch (error) {
    console.error('Error decoding ID token:', error);
    throw new Error('Failed to decode ID token');
  }
}

// Function to set authentication cookies
function setAuthCookies(authData: AuthToken, userInfo: DecodedIdToken) {
  const cookieStore = cookies();
  const expiresAt = new Date(userInfo.exp * 1000); // Convert Unix timestamp to Date

  // Set secure cookies with expiration
  cookieStore.set('accessToken', authData.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: expiresAt,
  });

  cookieStore.set('idToken', authData.idToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: expiresAt,
  });

  cookieStore.set('refreshToken', authData.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  });

  // Store user info in a separate cookie (can be accessed client-side if needed)
  cookieStore.set('userInfo', JSON.stringify({
    sub: userInfo.sub,
    email: userInfo.email,
    name: `${userInfo.given_name || ''} ${userInfo.family_name || ''}`.trim(),
    given_name: userInfo.given_name,
    family_name: userInfo.family_name,
    picture: userInfo.picture,
  }), {
    httpOnly: false, // Allow client-side access for user info
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: expiresAt,
  });
}

// Main login function
export async function loginUser(input: LoginInput): Promise<{ success: boolean; message: string }> {
  try {
    const data = await makeAuthRequest(LOGIN_MUTATION, { input });
    const loginResponse: AuthTokenResponse = data.loginUser;

    if (!loginResponse.success || !loginResponse.data) {
      return {
        success: false,
        message: loginResponse.message || loginResponse.error || 'Login failed',
      };
    }

    // Decode the ID token to get user information
    const userInfo = decodeIdToken(loginResponse.data.idToken);

    // Set authentication cookies
    setAuthCookies(loginResponse.data, userInfo);

    return {
      success: true,
      message: 'Login successful',
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred during login',
    };
  }
}

// Function to get current user from cookies
export async function getCurrentUser(): Promise<any | null> {
  try {
    const cookieStore = cookies();
    const userInfoCookie = cookieStore.get('userInfo');

    if (!userInfoCookie) {
      return null;
    }

    return JSON.parse(userInfoCookie.value);
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// Function to check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('accessToken');
    const idToken = cookieStore.get('idToken');

    if (!accessToken || !idToken) {
      return false;
    }

    // Decode ID token to check expiration
    const decoded = decodeIdToken(idToken.value);
    const now = Math.floor(Date.now() / 1000);

    return decoded.exp > now;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
}

// Function to logout user
export async function logoutUser(): Promise<void> {
  const cookieStore = cookies();

  // Clear all auth cookies
  cookieStore.delete('accessToken');
  cookieStore.delete('idToken');
  cookieStore.delete('refreshToken');
  cookieStore.delete('userInfo');

  redirect('/login');
}

// Function to get access token for API calls
export async function getAccessToken(): Promise<string | null> {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('accessToken');

    return accessToken?.value || null;
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
}