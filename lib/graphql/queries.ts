// ============================================================
// WPGraphQL Queries
// Usage: import { GET_EVENTS } from '@/lib/graphql/queries'
// ============================================================

// ── Events ────────────────────────────────────────────────

export const GET_EVENTS = `
  query GetEvents($first: Int = 12, $after: String) {
    events(first: $first, after: $after) {
      nodes {
        id
        databaseId
        title
        slug
        excerpt
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        eventDate
        eventEndDate
        eventLocation
        eventLink
        eventMemberPrice
        eventNonMemberPrice
        eventCapacity
        eventSpotsRemaining
        eventType
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_EVENT_BY_SLUG = `
  query GetEventBySlug($slug: ID!) {
    event(id: $slug, idType: SLUG) {
      id
      databaseId
      title
      slug
      content
      excerpt
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      eventDate
      eventEndDate
      eventLocation
      eventLink
      eventMemberPrice
      eventNonMemberPrice
      eventCapacity
      eventSpotsRemaining
      eventType
    }
  }
`;

// ── Podcasts ──────────────────────────────────────────────

export const GET_PODCASTS = `
  query GetPodcasts($first: Int = 12, $after: String) {
    podcasts(first: $first, after: $after) {
      nodes {
        id
        databaseId
        title
        slug
        excerpt
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        audioUrl
        duration
        guestTags
        season
        episode
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

// ── Courses ───────────────────────────────────────────────

export const GET_COURSES = `
  query GetCourses($first: Int = 12, $after: String) {
    courses(first: $first, after: $after) {
      nodes {
        id
        databaseId
        title
        slug
        excerpt
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        instructor
        price
        memberPrice
        durationWeeks
        level
        enrolmentUrl
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

// ── Business Directory ────────────────────────────────────

export const GET_BUSINESS_LISTINGS = `
  query GetBusinessListings($first: Int = 20, $after: String) {
    businessListings(first: $first, after: $after) {
      nodes {
        id
        databaseId
        title
        slug
        excerpt
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        companyName
        valueProp
        region
        industryTag
        website
        contactEmail
        logoUrl
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

// ── Warm Leads (admin/manager only) ──────────────────────

export const GET_WARM_LEADS = `
  query GetWarmLeads($first: Int = 50, $after: String) {
    warmLeads(first: $first, after: $after) {
      nodes {
        id
        databaseId
        title
        leadSource
        leadStatus
        leadNotes
        leadEmail
        leadPhone
        leadCompany
        assignedTo
        followUpDate
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

// ── Current User ──────────────────────────────────────────

export const GET_CURRENT_USER = `
  query GetCurrentUser {
    viewer {
      id
      databaseId
      name
      email
      firstName
      lastName
      abaRole
      phone
      linkedinUrl
      companyName
      jobTitle
      bio
      subscriptionStatus
      membershipTier
      membershipExpires
      profileVisibility
      stripeCustomerId
      avatar {
        url
      }
    }
  }
`;

// ── Dashboard summary (admin) ─────────────────────────────

export const GET_DASHBOARD_SUMMARY = `
  query GetDashboardSummary {
    users(first: 500) {
      nodes {
        id
        name
        email
        companyName
        membershipTier
        subscriptionStatus
        membershipExpires
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
    events(first: 50) {
      nodes {
        id
        title
        eventDate
        eventCapacity
        eventSpotsRemaining
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
    warmLeads(first: 100) {
      nodes {
        id
        title
        leadStatus
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

// ── Members list (admin) ──────────────────────────────────

export const GET_MEMBERS = `
  query GetMembers($first: Int = 50, $after: String) {
    users(first: $first, after: $after) {
      nodes {
        id
        databaseId
        name
        email
        firstName
        lastName
        abaRole
        phone
        companyName
        jobTitle
        membershipTier
        subscriptionStatus
        membershipExpires
        avatar {
          url
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;
