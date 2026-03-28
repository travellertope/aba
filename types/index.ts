// ============================================================
// ABA Membership Platform — Shared TypeScript Interfaces
// All interfaces map 1:1 to WPGraphQL response shapes.
// ============================================================

// ── WordPress / GraphQL base ──────────────────────────────

export interface WPNode {
  id: string;          // Global relay ID
  databaseId: number;  // WordPress post/user ID
}

export interface FeaturedImage {
  node: {
    sourceUrl: string;
    altText: string;
  };
}

// ── User / Member ─────────────────────────────────────────

export type MembershipTier = 'free' | 'professional' | 'executive' | 'corporate';
export type SubscriptionStatus = 'active' | 'inactive' | 'cancelled' | 'trialing';
export type AbaRole =
  | 'administrator'
  | 'aba_manager'
  | 'aba_staff'
  | 'aba_corporate'
  | 'aba_executive'
  | 'aba_professional'
  | 'aba_free_member';

export type ProfileVisibility = 'public' | 'members-only' | 'private';

export interface Member extends WPNode {
  name: string;
  email: string;
  firstName: string;
  lastName: string;
  // ABA custom meta
  phone: string | null;
  linkedinUrl: string | null;
  companyName: string | null;
  jobTitle: string | null;
  bio: string | null;
  subscriptionStatus: SubscriptionStatus | null;
  membershipTier: MembershipTier | null;
  membershipExpires: string | null;
  profileVisibility: ProfileVisibility | null;
  abaRole: AbaRole | null;
  // Sensitive (only returned for self or admin)
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  avatar: {
    url: string;
  } | null;
}

// ── Event ─────────────────────────────────────────────────

export type EventType = 'in-person' | 'virtual' | 'hybrid';

export interface Event extends WPNode {
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  featuredImage: FeaturedImage | null;
  // ABA meta
  eventDate: string | null;
  eventEndDate: string | null;
  eventLocation: string | null;
  eventLink: string | null;
  eventMemberPrice: number | null;
  eventNonMemberPrice: number | null;
  eventCapacity: number | null;
  eventSpotsRemaining: number | null;
  eventType: EventType | null;
}

// ── Podcast ───────────────────────────────────────────────

export interface Podcast extends WPNode {
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  featuredImage: FeaturedImage | null;
  // ABA meta
  audioUrl: string | null;
  duration: string | null;
  guestTags: string | null;
  season: number | null;
  episode: number | null;
  transcript: string | null;
}

// ── Course ────────────────────────────────────────────────

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Course extends WPNode {
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  featuredImage: FeaturedImage | null;
  // ABA meta
  syllabus: string | null;
  instructor: string | null;
  instructorBio: string | null;
  price: number | null;
  memberPrice: number | null;
  durationWeeks: number | null;
  level: CourseLevel | null;
  enrolmentUrl: string | null;
}

// ── Business Listing ──────────────────────────────────────

export interface BusinessListing extends WPNode {
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  featuredImage: FeaturedImage | null;
  // ABA meta
  companyName: string | null;
  valueProp: string | null;
  region: string | null;
  industryTag: string | null;
  website: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  logoUrl: string | null;
  ownerUserId: number | null;
}

// ── Warm Lead ─────────────────────────────────────────────

export type LeadSource = 'event' | 'referral' | 'website' | 'direct';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';

export interface WarmLead extends WPNode {
  title: string;
  // ABA meta
  leadSource: LeadSource | null;
  leadStatus: LeadStatus | null;
  leadNotes: string | null;
  leadEmail: string | null;
  leadPhone: string | null;
  leadCompany: string | null;
  assignedTo: number | null;
  followUpDate: string | null;
  leadScore: number | null;
  leadVisits: number | null;
  leadEventsAttended: number | null;
  leadInterests: string[] | null;
}

// ── GraphQL response wrappers ─────────────────────────────

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

export interface EventsConnection {
  nodes: Event[];
  pageInfo: PageInfo;
}

export interface PodcastsConnection {
  nodes: Podcast[];
  pageInfo: PageInfo;
}

export interface CoursesConnection {
  nodes: Course[];
  pageInfo: PageInfo;
}

export interface BusinessListingsConnection {
  nodes: BusinessListing[];
  pageInfo: PageInfo;
}

export interface WarmLeadsConnection {
  nodes: WarmLead[];
  pageInfo: PageInfo;
}

export interface MembersConnection {
  nodes: Member[];
  pageInfo: PageInfo;
}

// ── Auth / Session ────────────────────────────────────────

export interface AbaSession {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
    role: AbaRole;
    membershipTier: MembershipTier;
    subscriptionStatus: SubscriptionStatus;
  };
  accessToken: string;
  expires: string;
}

// ── GraphQL mutation payloads ─────────────────────────────

export interface UpdateProfilePayload {
  success: boolean;
  message: string;
}
