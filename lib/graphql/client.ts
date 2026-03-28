// ============================================================
// WPGraphQL fetch client
// Server-side only — used inside Next.js Server Components and
// Route Handlers. Do NOT import this in client components.
// ============================================================

const WP_GRAPHQL_URL = process.env.NEXT_PUBLIC_WP_GRAPHQL_URL!;

interface GraphQLResponse<T> {
  data: T;
  errors?: { message: string }[];
}

/**
 * Execute a WPGraphQL query or mutation.
 *
 * @param query     - GraphQL query/mutation string
 * @param variables - Optional variables object
 * @param token     - Optional JWT auth token (for authenticated requests)
 */
export async function wpGraphQL<T = unknown>(
  query: string,
  variables?: Record<string, unknown>,
  token?: string,
): Promise<T> {
  if (!WP_GRAPHQL_URL) {
    throw new Error('NEXT_PUBLIC_WP_GRAPHQL_URL is not set in environment variables.');
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(WP_GRAPHQL_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
    // Next.js cache control — pages can override via revalidate
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`WPGraphQL request failed: ${res.status} ${res.statusText}`);
  }

  const json: GraphQLResponse<T> = await res.json();

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join('\n'));
  }

  return json.data;
}
