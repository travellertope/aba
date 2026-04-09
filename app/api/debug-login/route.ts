// TEMPORARY DIAGNOSTIC ENDPOINT — DELETE BEFORE PRODUCTION
// Hit GET /api/debug-login?username=your@email.com&password=yourpassword
// to see exactly what WordPress GraphQL returns.

import { LOGIN_MUTATION } from '@/lib/graphql/mutations';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = process.env.WP_GRAPHQL_URL;
  const username = req.nextUrl.searchParams.get('username') || '';
  const password = req.nextUrl.searchParams.get('password') || '';

  if (!url) {
    return NextResponse.json({ error: 'WP_GRAPHQL_URL is not set in environment' }, { status: 500 });
  }

  // Step 1: Test basic connectivity with an introspection check
  let connectivityResult: unknown;
  try {
    const pingRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '{ __typename }' }),
      cache: 'no-store',
    });
    connectivityResult = {
      status: pingRes.status,
      ok: pingRes.ok,
      body: await pingRes.json(),
    };
  } catch (e) {
    connectivityResult = { error: String(e) };
  }

  // Step 2: Check if login mutation exists in schema
  let mutationExistsResult: unknown;
  try {
    const schemaRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `{ __type(name: "RootMutation") { fields { name } } }`,
      }),
      cache: 'no-store',
    });
    mutationExistsResult = await schemaRes.json();
  } catch (e) {
    mutationExistsResult = { error: String(e) };
  }

  // Step 3: Check if abaRole field exists on User type
  let userFieldsResult: unknown;
  try {
    const fieldsRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `{ __type(name: "User") { fields { name } } }`,
      }),
      cache: 'no-store',
    });
    userFieldsResult = await fieldsRes.json();
  } catch (e) {
    userFieldsResult = { error: String(e) };
  }

  // Step 4: Attempt actual login if credentials provided
  let loginResult: unknown = 'No credentials provided (add ?username=x&password=y to URL)';
  if (username && password) {
    try {
      const loginRes = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: LOGIN_MUTATION,
          variables: { username, password },
        }),
        cache: 'no-store',
      });
      const json = await loginRes.json();
      // Scrub the actual token from the response for safety
      if (json?.data?.login?.authToken) {
        json.data.login.authToken = '[REDACTED]';
      }
      if (json?.data?.login?.refreshToken) {
        json.data.login.refreshToken = '[REDACTED]';
      }
      loginResult = { httpStatus: loginRes.status, body: json };
    } catch (e) {
      loginResult = { error: String(e) };
    }
  }

  return NextResponse.json({
    wpGraphqlUrl: url,
    connectivity: connectivityResult,
    mutationsAvailable: mutationExistsResult,
    userFields: userFieldsResult,
    loginAttempt: loginResult,
  });
}
