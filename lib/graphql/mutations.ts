// ============================================================
// WPGraphQL Mutations
// ============================================================

// ── Auth ──────────────────────────────────────────────────

export const LOGIN_MUTATION = `
  mutation Login($username: String!, $password: String!) {
    login(input: {
      clientMutationId: "aba-login"
      username: $username
      password: $password
    }) {
      authToken
      refreshToken
      user {
        id
        databaseId
        name
        email
        abaRole
        membershipTier
        subscriptionStatus
      }
    }
  }
`;

export const REFRESH_AUTH_TOKEN = `
  mutation RefreshAuthToken($refreshToken: String!) {
    refreshJwtAuthToken(input: {
      clientMutationId: "aba-refresh"
      jwtRefreshToken: $refreshToken
    }) {
      authToken
    }
  }
`;

// ── User Profile ──────────────────────────────────────────

export const UPDATE_USER_PROFILE = `
  mutation UpdateAbaUserProfile(
    $userId: Int!
    $phone: String
    $linkedinUrl: String
    $companyName: String
    $bio: String
    $jobTitle: String
    $profileVisibility: String
  ) {
    updateAbaUserProfile(input: {
      userId: $userId
      phone: $phone
      linkedinUrl: $linkedinUrl
      companyName: $companyName
      bio: $bio
      jobTitle: $jobTitle
      profileVisibility: $profileVisibility
    }) {
      success
      message
    }
  }
`;
