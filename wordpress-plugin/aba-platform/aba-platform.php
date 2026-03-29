<?php
/**
 * Plugin Name: ABA Membership Platform
 * Plugin URI:  https://github.com/travellertope/aba
 * Description: Registers all Custom Post Types, User Roles, and GraphQL extensions for the ABA Membership Management Platform.
 * Version:     1.0.0
 * Author:      ABA Dev Team
 * Text Domain: aba-platform
 */

defined( 'ABSPATH' ) || exit;

// ============================================================
// 1. CUSTOM POST TYPES
// ============================================================

add_action( 'init', 'aba_register_post_types' );

function aba_register_post_types() {

    // ── Event ────────────────────────────────────────────────
    register_post_type( 'aba_event', [
        'labels'              => aba_labels( 'Event', 'Events' ),
        'public'              => true,
        'show_in_graphql'     => true,
        'graphql_single_name' => 'event',
        'graphql_plural_name' => 'events',
        'supports'            => [ 'title', 'editor', 'thumbnail', 'excerpt' ],
        'has_archive'         => true,
        'rewrite'             => [ 'slug' => 'events' ],
        'menu_icon'           => 'dashicons-calendar-alt',
        'show_in_rest'        => true,
    ] );

    // ── Podcast ──────────────────────────────────────────────
    register_post_type( 'aba_podcast', [
        'labels'              => aba_labels( 'Podcast', 'Podcasts' ),
        'public'              => true,
        'show_in_graphql'     => true,
        'graphql_single_name' => 'podcast',
        'graphql_plural_name' => 'podcasts',
        'supports'            => [ 'title', 'editor', 'thumbnail', 'excerpt' ],
        'has_archive'         => true,
        'rewrite'             => [ 'slug' => 'podcasts' ],
        'menu_icon'           => 'dashicons-microphone',
        'show_in_rest'        => true,
    ] );

    // ── Course ───────────────────────────────────────────────
    register_post_type( 'aba_course', [
        'labels'              => aba_labels( 'Course', 'Courses' ),
        'public'              => true,
        'show_in_graphql'     => true,
        'graphql_single_name' => 'course',
        'graphql_plural_name' => 'courses',
        'supports'            => [ 'title', 'editor', 'thumbnail', 'excerpt' ],
        'has_archive'         => true,
        'rewrite'             => [ 'slug' => 'courses' ],
        'menu_icon'           => 'dashicons-welcome-learn-more',
        'show_in_rest'        => true,
    ] );

    // ── Business Listing ─────────────────────────────────────
    register_post_type( 'aba_business', [
        'labels'              => aba_labels( 'Business Listing', 'Business Listings' ),
        'public'              => true,
        'show_in_graphql'     => true,
        'graphql_single_name' => 'businessListing',
        'graphql_plural_name' => 'businessListings',
        'supports'            => [ 'title', 'editor', 'thumbnail', 'excerpt' ],
        'has_archive'         => true,
        'rewrite'             => [ 'slug' => 'directory' ],
        'menu_icon'           => 'dashicons-building',
        'show_in_rest'        => true,
    ] );

    // ── Warm Lead (private — admin only) ─────────────────────
    register_post_type( 'aba_warm_lead', [
        'labels'              => aba_labels( 'Warm Lead', 'Warm Leads' ),
        'public'              => false,
        'show_ui'             => true,
        'show_in_graphql'     => true,
        'graphql_single_name' => 'warmLead',
        'graphql_plural_name' => 'warmLeads',
        'supports'            => [ 'title', 'editor' ],
        'menu_icon'           => 'dashicons-businessman',
        'capability_type'     => 'post',
        'capabilities'        => [ 'edit_post' => 'manage_options' ],
        'show_in_rest'        => false,
    ] );
}

/**
 * Helper: generate standard WP label array.
 */
function aba_labels( string $singular, string $plural ): array {
    return [
        'name'               => $plural,
        'singular_name'      => $singular,
        'add_new'            => "Add New {$singular}",
        'add_new_item'       => "Add New {$singular}",
        'edit_item'          => "Edit {$singular}",
        'new_item'           => "New {$singular}",
        'view_item'          => "View {$singular}",
        'search_items'       => "Search {$plural}",
        'not_found'          => "No {$plural} found",
        'not_found_in_trash' => "No {$plural} found in trash",
    ];
}


// ============================================================
// 2. POST META — REGISTER & EXPOSE TO GRAPHQL
// ============================================================

add_action( 'init', 'aba_register_post_meta' );

function aba_register_post_meta() {

    // ── Event Meta ───────────────────────────────────────────
    $event_fields = [
        'event_date'            => 'string',
        'event_end_date'        => 'string',
        'event_location'        => 'string',
        'event_link'            => 'string',
        'event_member_price'    => 'number',
        'event_non_member_price'=> 'number',
        'event_capacity'        => 'integer',
        'event_spots_remaining' => 'integer',
        'event_type'            => 'string',   // in-person | virtual | hybrid
    ];
    foreach ( $event_fields as $key => $type ) {
        register_post_meta( 'aba_event', $key, [
            'type'         => $type,
            'single'       => true,
            'show_in_rest' => true,
        ] );
    }

    // ── Podcast Meta ─────────────────────────────────────────
    $podcast_fields = [
        'podcast_audio_url' => 'string',
        'podcast_duration'  => 'string',   // e.g. "32:14"
        'podcast_guest_tags'=> 'string',   // comma-separated or JSON
        'podcast_season'    => 'integer',
        'podcast_episode'   => 'integer',
        'podcast_transcript'=> 'string',
    ];
    foreach ( $podcast_fields as $key => $type ) {
        register_post_meta( 'aba_podcast', $key, [
            'type'         => $type,
            'single'       => true,
            'show_in_rest' => true,
        ] );
    }

    // ── Course Meta ──────────────────────────────────────────
    $course_fields = [
        'course_syllabus'       => 'string',
        'course_instructor'     => 'string',
        'course_instructor_bio' => 'string',
        'course_price'          => 'number',
        'course_member_price'   => 'number',
        'course_duration_weeks' => 'integer',
        'course_level'          => 'string',  // beginner | intermediate | advanced
        'course_enrolment_url'  => 'string',
    ];
    foreach ( $course_fields as $key => $type ) {
        register_post_meta( 'aba_course', $key, [
            'type'         => $type,
            'single'       => true,
            'show_in_rest' => true,
        ] );
    }

    // ── Business Listing Meta ────────────────────────────────
    $business_fields = [
        'business_company_name'  => 'string',
        'business_value_prop'    => 'string',
        'business_region'        => 'string',
        'business_industry_tag'  => 'string',
        'business_website'       => 'string',
        'business_contact_email' => 'string',
        'business_contact_phone' => 'string',
        'business_logo_url'      => 'string',
        'business_owner_user_id' => 'integer',
    ];
    foreach ( $business_fields as $key => $type ) {
        register_post_meta( 'aba_business', $key, [
            'type'         => $type,
            'single'       => true,
            'show_in_rest' => true,
        ] );
    }

    // ── Warm Lead Meta ───────────────────────────────────────
    $lead_fields = [
        'lead_source'         => 'string',   // event | referral | website | direct
        'lead_status'         => 'string',   // new | contacted | qualified | converted | lost
        'lead_notes'          => 'string',
        'lead_email'          => 'string',
        'lead_phone'          => 'string',
        'lead_company'        => 'string',
        'lead_assigned_to'    => 'integer',  // WP user ID of staff member
        'lead_follow_up_date' => 'string',
        'lead_score'          => 'integer',  // 0–100 engagement score
        'lead_visits'         => 'integer',  // number of site/event visits
        'lead_events_attended'=> 'integer',  // number of events attended
        'lead_interests'      => 'string',   // JSON array of interest tags, e.g. '["Networking","Tech"]'
    ];
    foreach ( $lead_fields as $key => $type ) {
        register_post_meta( 'aba_warm_lead', $key, [
            'type'         => $type,
            'single'       => true,
            'show_in_rest' => true,
        ] );
    }
}


// ============================================================
// 3. EXPOSE POST META TO WPGRAPHQL
//    (runs after WPGraphQL is loaded)
// ============================================================

add_action( 'graphql_register_types', 'aba_register_graphql_meta_fields' );

function aba_register_graphql_meta_fields() {

    if ( ! function_exists( 'register_graphql_field' ) ) {
        return;
    }

    // ── Event GraphQL fields ─────────────────────────────────
    $event_graphql = [
        'eventDate'           => [ 'type' => 'String',  'key' => 'event_date' ],
        'eventEndDate'        => [ 'type' => 'String',  'key' => 'event_end_date' ],
        'eventLocation'       => [ 'type' => 'String',  'key' => 'event_location' ],
        'eventLink'           => [ 'type' => 'String',  'key' => 'event_link' ],
        'eventMemberPrice'    => [ 'type' => 'Float',   'key' => 'event_member_price' ],
        'eventNonMemberPrice' => [ 'type' => 'Float',   'key' => 'event_non_member_price' ],
        'eventCapacity'       => [ 'type' => 'Int',     'key' => 'event_capacity' ],
        'eventSpotsRemaining' => [ 'type' => 'Int',     'key' => 'event_spots_remaining' ],
        'eventType'           => [ 'type' => 'String',  'key' => 'event_type' ],
    ];
    foreach ( $event_graphql as $field_name => $config ) {
        register_graphql_field( 'Event', $field_name, [
            'type'        => $config['type'],
            'description' => "Event meta: {$config['key']}",
            'resolve'     => function( $post ) use ( $config ) {
                return get_post_meta( $post->databaseId, $config['key'], true ) ?: null;
            },
        ] );
    }

    // ── Podcast GraphQL fields ───────────────────────────────
    $podcast_graphql = [
        'audioUrl'   => [ 'type' => 'String',  'key' => 'podcast_audio_url' ],
        'duration'   => [ 'type' => 'String',  'key' => 'podcast_duration' ],
        'guestTags'  => [ 'type' => 'String',  'key' => 'podcast_guest_tags' ],
        'season'     => [ 'type' => 'Int',     'key' => 'podcast_season' ],
        'episode'    => [ 'type' => 'Int',     'key' => 'podcast_episode' ],
        'transcript' => [ 'type' => 'String',  'key' => 'podcast_transcript' ],
    ];
    foreach ( $podcast_graphql as $field_name => $config ) {
        register_graphql_field( 'Podcast', $field_name, [
            'type'        => $config['type'],
            'description' => "Podcast meta: {$config['key']}",
            'resolve'     => function( $post ) use ( $config ) {
                return get_post_meta( $post->databaseId, $config['key'], true ) ?: null;
            },
        ] );
    }

    // ── Course GraphQL fields ────────────────────────────────
    $course_graphql = [
        'syllabus'        => [ 'type' => 'String',  'key' => 'course_syllabus' ],
        'instructor'      => [ 'type' => 'String',  'key' => 'course_instructor' ],
        'instructorBio'   => [ 'type' => 'String',  'key' => 'course_instructor_bio' ],
        'price'           => [ 'type' => 'Float',   'key' => 'course_price' ],
        'memberPrice'     => [ 'type' => 'Float',   'key' => 'course_member_price' ],
        'durationWeeks'   => [ 'type' => 'Int',     'key' => 'course_duration_weeks' ],
        'level'           => [ 'type' => 'String',  'key' => 'course_level' ],
        'enrolmentUrl'    => [ 'type' => 'String',  'key' => 'course_enrolment_url' ],
    ];
    foreach ( $course_graphql as $field_name => $config ) {
        register_graphql_field( 'Course', $field_name, [
            'type'        => $config['type'],
            'description' => "Course meta: {$config['key']}",
            'resolve'     => function( $post ) use ( $config ) {
                return get_post_meta( $post->databaseId, $config['key'], true ) ?: null;
            },
        ] );
    }

    // ── Business Listing GraphQL fields ──────────────────────
    $business_graphql = [
        'companyName'   => [ 'type' => 'String',  'key' => 'business_company_name' ],
        'valueProp'     => [ 'type' => 'String',  'key' => 'business_value_prop' ],
        'region'        => [ 'type' => 'String',  'key' => 'business_region' ],
        'industryTag'   => [ 'type' => 'String',  'key' => 'business_industry_tag' ],
        'website'       => [ 'type' => 'String',  'key' => 'business_website' ],
        'contactEmail'  => [ 'type' => 'String',  'key' => 'business_contact_email' ],
        'contactPhone'  => [ 'type' => 'String',  'key' => 'business_contact_phone' ],
        'logoUrl'       => [ 'type' => 'String',  'key' => 'business_logo_url' ],
        'ownerUserId'   => [ 'type' => 'Int',     'key' => 'business_owner_user_id' ],
    ];
    foreach ( $business_graphql as $field_name => $config ) {
        register_graphql_field( 'BusinessListing', $field_name, [
            'type'        => $config['type'],
            'description' => "Business Listing meta: {$config['key']}",
            'resolve'     => function( $post ) use ( $config ) {
                return get_post_meta( $post->databaseId, $config['key'], true ) ?: null;
            },
        ] );
    }

    // ── Warm Lead GraphQL fields (restricted) ─────────────────
    $lead_graphql = [
        'leadSource'      => [ 'type' => 'String',  'key' => 'lead_source' ],
        'leadStatus'      => [ 'type' => 'String',  'key' => 'lead_status' ],
        'leadNotes'       => [ 'type' => 'String',  'key' => 'lead_notes' ],
        'leadEmail'       => [ 'type' => 'String',  'key' => 'lead_email' ],
        'leadPhone'       => [ 'type' => 'String',  'key' => 'lead_phone' ],
        'leadCompany'     => [ 'type' => 'String',  'key' => 'lead_company' ],
        'assignedTo'      => [ 'type' => 'Int',     'key' => 'lead_assigned_to' ],
        'followUpDate'    => [ 'type' => 'String',  'key' => 'lead_follow_up_date' ],
        'leadScore'       => [ 'type' => 'Int',     'key' => 'lead_score' ],
        'leadVisits'      => [ 'type' => 'Int',     'key' => 'lead_visits' ],
        'leadEventsAttended' => [ 'type' => 'Int',  'key' => 'lead_events_attended' ],
    ];
    foreach ( $lead_graphql as $field_name => $config ) {
        register_graphql_field( 'WarmLead', $field_name, [
            'type'        => $config['type'],
            'description' => "Warm Lead meta: {$config['key']}",
            'resolve'     => function( $post ) use ( $config ) {
                // Only admins/managers can read lead data
                if ( ! current_user_can( 'manage_options' ) && ! current_user_can( 'aba_manager' ) ) {
                    return null;
                }
                return get_post_meta( $post->databaseId, $config['key'], true ) ?: null;
            },
        ] );
    }

    // leadInterests — stored as JSON array string, exposed as [String]
    register_graphql_field( 'WarmLead', 'leadInterests', [
        'type'        => [ 'list_of' => 'String' ],
        'description' => 'Warm Lead meta: lead_interests (JSON array of interest tags)',
        'resolve'     => function( $post ) {
            if ( ! current_user_can( 'manage_options' ) && ! current_user_can( 'aba_manager' ) ) {
                return null;
            }
            $raw = get_post_meta( $post->databaseId, 'lead_interests', true );
            if ( empty( $raw ) ) {
                return [];
            }
            $decoded = json_decode( $raw, true );
            return is_array( $decoded ) ? $decoded : [];
        },
    ] );
}


// ============================================================
// 4. USER ROLES
// ============================================================

register_activation_hook( __FILE__, 'aba_add_user_roles' );

function aba_add_user_roles() {

    // Base capability sets
    $free_caps = [
        'read'                      => true,
        'aba_member'                => true,
    ];

    $professional_caps = array_merge( $free_caps, [
        'aba_professional'          => true,
        'aba_view_directory'        => true,
        'aba_member_pricing'        => true,
    ] );

    $executive_caps = array_merge( $professional_caps, [
        'aba_executive'             => true,
        'aba_view_warm_leads'       => true,
        'aba_post_business_listing' => true,
    ] );

    $corporate_caps = array_merge( $executive_caps, [
        'aba_corporate'             => true,
        'aba_manage_team_members'   => true,
        'aba_bulk_enrol'            => true,
    ] );

    $staff_caps = array_merge( $free_caps, [
        'aba_staff'                 => true,
        'edit_posts'                => true,
        'edit_others_posts'         => true,
        'publish_posts'             => true,
        'manage_categories'         => true,
        'aba_manage_events'         => true,
        'aba_manage_courses'        => true,
        'aba_manage_podcasts'       => true,
        'aba_manage_leads'          => true,
        'aba_view_members'          => true,
    ] );

    $manager_caps = array_merge( $staff_caps, [
        'aba_manager'               => true,
        'aba_edit_members'          => true,
        'aba_manage_payments'       => true,
        'aba_view_reports'          => true,
        'aba_manage_listings'       => true,
    ] );

    // Add roles (only adds if they don't exist)
    add_role( 'aba_free_member',   'Free Member',    $free_caps );
    add_role( 'aba_professional',  'Professional',   $professional_caps );
    add_role( 'aba_executive',     'Executive',      $executive_caps );
    add_role( 'aba_corporate',     'Corporate',      $corporate_caps );
    add_role( 'aba_staff',         'Staff',          $staff_caps );
    add_role( 'aba_manager',       'Manager',        $manager_caps );
    // Note: Super Admin is handled by WordPress Multisite or the built-in Administrator role.
    // We extend the existing 'administrator' role with ABA-specific caps:
    $admin_role = get_role( 'administrator' );
    if ( $admin_role ) {
        $admin_role->add_cap( 'aba_super_admin' );
        $admin_role->add_cap( 'aba_manage_roles' );
        $admin_role->add_cap( 'aba_view_all_data' );
        $admin_role->add_cap( 'aba_manage_payments' );
        $admin_role->add_cap( 'aba_view_reports' );
    }
}

// Clean up roles on deactivation
register_deactivation_hook( __FILE__, 'aba_remove_user_roles' );

function aba_remove_user_roles() {
    remove_role( 'aba_free_member' );
    remove_role( 'aba_professional' );
    remove_role( 'aba_executive' );
    remove_role( 'aba_corporate' );
    remove_role( 'aba_staff' );
    remove_role( 'aba_manager' );
}


// ============================================================
// 5. CUSTOM USER META — REGISTER & EXPOSE TO GRAPHQL
// ============================================================

add_action( 'init', 'aba_register_user_meta' );

function aba_register_user_meta() {
    $user_fields = [
        'aba_phone'               => 'string',
        'aba_linkedin_url'        => 'string',
        'aba_company_name'        => 'string',
        'aba_subscription_status' => 'string',   // active | inactive | cancelled | trialing
        'aba_stripe_customer_id'  => 'string',
        'aba_stripe_subscription_id' => 'string',
        'aba_membership_tier'     => 'string',   // free | professional | executive | corporate
        'aba_membership_expires'  => 'string',   // ISO date string
        'aba_bio'                 => 'string',
        'aba_job_title'           => 'string',
        'aba_profile_visibility'  => 'string',   // public | members-only | private
    ];

    foreach ( $user_fields as $key => $type ) {
        register_meta( 'user', $key, [
            'type'         => $type,
            'single'       => true,
            'show_in_rest' => true,
            'auth_callback' => function( $allowed, $meta_key, $object_id ) {
                // Users can update their own meta; admins can update anyone's
                return ( get_current_user_id() === (int) $object_id ) || current_user_can( 'manage_options' );
            },
        ] );
    }
}

// Expose custom user meta to WPGraphQL
add_action( 'graphql_register_types', 'aba_register_user_graphql_fields' );

function aba_register_user_graphql_fields() {

    if ( ! function_exists( 'register_graphql_field' ) ) {
        return;
    }

    $user_graphql_fields = [
        'phone'                 => [ 'type' => 'String', 'key' => 'aba_phone',                  'private' => false ],
        'linkedinUrl'           => [ 'type' => 'String', 'key' => 'aba_linkedin_url',            'private' => false ],
        'companyName'           => [ 'type' => 'String', 'key' => 'aba_company_name',            'private' => false ],
        'subscriptionStatus'    => [ 'type' => 'String', 'key' => 'aba_subscription_status',     'private' => false ],
        'membershipTier'        => [ 'type' => 'String', 'key' => 'aba_membership_tier',         'private' => false ],
        'membershipExpires'     => [ 'type' => 'String', 'key' => 'aba_membership_expires',      'private' => false ],
        'bio'                   => [ 'type' => 'String', 'key' => 'aba_bio',                     'private' => false ],
        'jobTitle'              => [ 'type' => 'String', 'key' => 'aba_job_title',               'private' => false ],
        'profileVisibility'     => [ 'type' => 'String', 'key' => 'aba_profile_visibility',      'private' => false ],
        // Sensitive fields — only visible to the user themselves or admins
        'stripeCustomerId'      => [ 'type' => 'String', 'key' => 'aba_stripe_customer_id',      'private' => true  ],
        'stripeSubscriptionId'  => [ 'type' => 'String', 'key' => 'aba_stripe_subscription_id',  'private' => true  ],
    ];

    foreach ( $user_graphql_fields as $field_name => $config ) {
        register_graphql_field( 'User', $field_name, [
            'type'        => $config['type'],
            'description' => "ABA user meta: {$config['key']}",
            'resolve'     => function( $user ) use ( $config ) {
                if ( $config['private'] ) {
                    $current_user_id = get_current_user_id();
                    if ( $current_user_id !== $user->databaseId && ! current_user_can( 'manage_options' ) ) {
                        return null; // Sensitive: hide from others
                    }
                }
                return get_user_meta( $user->databaseId, $config['key'], true ) ?: null;
            },
        ] );
    }

    // Expose the user's role(s) to GraphQL
    register_graphql_field( 'User', 'abaRole', [
        'type'        => 'String',
        'description' => 'The primary ABA membership role for this user.',
        'resolve'     => function( $user ) {
            $wp_user = get_user_by( 'id', $user->databaseId );
            if ( ! $wp_user ) {
                return null;
            }
            $roles = $wp_user->roles;
            // Return highest-privilege ABA role
            $priority = [ 'administrator', 'aba_manager', 'aba_staff', 'aba_corporate', 'aba_executive', 'aba_professional', 'aba_free_member' ];
            foreach ( $priority as $role ) {
                if ( in_array( $role, $roles, true ) ) {
                    return $role;
                }
            }
            return $roles[0] ?? null;
        },
    ] );
}


// ============================================================
// 6. GRAPHQL MUTATIONS — UPDATE USER PROFILE & CREATE MEMBER
// ============================================================

add_action( 'graphql_register_types', 'aba_register_graphql_mutations' );

function aba_register_graphql_mutations() {

    if ( ! function_exists( 'register_graphql_mutation' ) ) {
        return;
    }

    // ── Update existing user profile ─────────────────────────
    register_graphql_mutation( 'updateAbaUserProfile', [
        'inputFields' => [
            'userId'             => [ 'type' => [ 'non_null' => 'Int' ] ],
            'phone'              => [ 'type' => 'String' ],
            'linkedinUrl'        => [ 'type' => 'String' ],
            'companyName'        => [ 'type' => 'String' ],
            'bio'                => [ 'type' => 'String' ],
            'jobTitle'           => [ 'type' => 'String' ],
            'profileVisibility'  => [ 'type' => 'String' ],
        ],
        'outputFields' => [
            'success' => [ 'type' => 'Boolean' ],
            'message' => [ 'type' => 'String' ],
        ],
        'mutateAndGetPayload' => function( $input ) {
            $current_user_id = get_current_user_id();
            $target_user_id  = (int) $input['userId'];

            if ( ! $current_user_id ) {
                return [ 'success' => false, 'message' => 'Not authenticated.' ];
            }
            if ( $current_user_id !== $target_user_id && ! current_user_can( 'manage_options' ) ) {
                return [ 'success' => false, 'message' => 'Permission denied.' ];
            }

            $field_map = [
                'phone'             => 'aba_phone',
                'linkedinUrl'       => 'aba_linkedin_url',
                'companyName'       => 'aba_company_name',
                'bio'               => 'aba_bio',
                'jobTitle'          => 'aba_job_title',
                'profileVisibility' => 'aba_profile_visibility',
            ];

            foreach ( $field_map as $input_key => $meta_key ) {
                if ( isset( $input[ $input_key ] ) ) {
                    update_user_meta( $target_user_id, $meta_key, sanitize_text_field( $input[ $input_key ] ) );
                }
            }

            return [ 'success' => true, 'message' => 'Profile updated successfully.' ];
        },
    ] );

    // ── Create a new ABA member (admin only) ─────────────────
    register_graphql_mutation( 'createAbaMember', [
        'inputFields' => [
            // Required
            'firstName'        => [ 'type' => [ 'non_null' => 'String' ] ],
            'lastName'         => [ 'type' => [ 'non_null' => 'String' ] ],
            'email'            => [ 'type' => [ 'non_null' => 'String' ] ],
            'membershipTier'   => [ 'type' => [ 'non_null' => 'String' ] ],
            // Optional
            'phone'            => [ 'type' => 'String' ],
            'companyName'      => [ 'type' => 'String' ],
            'jobTitle'         => [ 'type' => 'String' ],
            'status'           => [ 'type' => 'String' ],   // active | pending | inactive
            'joinDate'         => [ 'type' => 'String' ],   // ISO date string
            'paymentMethod'    => [ 'type' => 'String' ],
            'notes'            => [ 'type' => 'String' ],
            'sendWelcomeEmail' => [ 'type' => 'Boolean' ],
        ],
        'outputFields' => [
            'success' => [ 'type' => 'Boolean' ],
            'message' => [ 'type' => 'String' ],
            'userId'  => [ 'type' => 'Int' ],
        ],
        'mutateAndGetPayload' => function( $input ) {

            // ── Auth check — administrators only ──────────────
            if ( ! current_user_can( 'manage_options' ) ) {
                return [ 'success' => false, 'message' => 'Permission denied. Administrator role required.', 'userId' => null ];
            }

            // ── Sanitise inputs ───────────────────────────────
            $first_name     = sanitize_text_field( $input['firstName'] );
            $last_name      = sanitize_text_field( $input['lastName'] );
            $email          = sanitize_email( $input['email'] );
            $tier           = sanitize_text_field( strtolower( $input['membershipTier'] ) );
            $phone          = sanitize_text_field( $input['phone'] ?? '' );
            $company        = sanitize_text_field( $input['companyName'] ?? '' );
            $job_title      = sanitize_text_field( $input['jobTitle'] ?? '' );
            $status         = sanitize_text_field( strtolower( $input['status'] ?? 'active' ) );
            $join_date      = sanitize_text_field( $input['joinDate'] ?? date( 'Y-m-d' ) );
            $payment_method = sanitize_text_field( $input['paymentMethod'] ?? '' );
            $notes          = sanitize_textarea_field( $input['notes'] ?? '' );
            $send_email     = (bool) ( $input['sendWelcomeEmail'] ?? false );

            // ── Validate email ────────────────────────────────
            if ( ! is_email( $email ) ) {
                return [ 'success' => false, 'message' => 'Invalid email address.', 'userId' => null ];
            }
            if ( email_exists( $email ) ) {
                return [ 'success' => false, 'message' => 'A user with this email address already exists.', 'userId' => null ];
            }

            // ── Map tier to WP role ───────────────────────────
            $tier_role_map = [
                'executive'    => 'aba_executive',
                'professional' => 'aba_professional',
                'corporate'    => 'aba_corporate',
                'free'         => 'aba_free_member',
            ];
            $wp_role = $tier_role_map[ $tier ] ?? 'aba_free_member';

            // ── Generate username from email ──────────────────
            $username_base = sanitize_user( strstr( $email, '@', true ), true );
            $username      = $username_base;
            $suffix        = 1;
            while ( username_exists( $username ) ) {
                $username = $username_base . $suffix;
                $suffix++;
            }

            // ── Create the WP user (suppress default emails) ──
            // Passing an empty string to wp_insert_user prevents
            // wp_new_user_notification() from being called automatically.
            add_filter( 'wp_send_new_user_notification_to_admin', '__return_false' );
            add_filter( 'wp_send_new_user_notification_to_user',  '__return_false' );

            $user_id = wp_insert_user( [
                'user_login'   => $username,
                'user_email'   => $email,
                'user_pass'    => wp_generate_password( 24, true, true ),
                'first_name'   => $first_name,
                'last_name'    => $last_name,
                'display_name' => "{$first_name} {$last_name}",
                'role'         => $wp_role,
            ] );

            remove_filter( 'wp_send_new_user_notification_to_admin', '__return_false' );
            remove_filter( 'wp_send_new_user_notification_to_user',  '__return_false' );

            if ( is_wp_error( $user_id ) ) {
                return [ 'success' => false, 'message' => $user_id->get_error_message(), 'userId' => null ];
            }

            // ── Write all ABA user meta ───────────────────────
            update_user_meta( $user_id, 'aba_membership_tier',     $tier );
            update_user_meta( $user_id, 'aba_subscription_status', $status );
            update_user_meta( $user_id, 'aba_membership_expires',  '' );  // set by payment flow later

            if ( $phone )          update_user_meta( $user_id, 'aba_phone',        $phone );
            if ( $company )        update_user_meta( $user_id, 'aba_company_name', $company );
            if ( $job_title )      update_user_meta( $user_id, 'aba_job_title',    $job_title );
            if ( $notes )          update_user_meta( $user_id, 'aba_bio',          $notes );
            if ( $payment_method ) update_user_meta( $user_id, 'aba_payment_method', $payment_method );
            if ( $join_date )      update_user_meta( $user_id, 'aba_join_date',    $join_date );

            // ── Send ABA-branded welcome email (optional) ─────
            if ( $send_email ) {
                // Generate a one-time password reset link so the member can
                // set their own password on first login — we never expose the
                // hashed password we generated above.
                $reset_key  = get_password_reset_key( get_user_by( 'id', $user_id ) );
                $reset_url  = ! is_wp_error( $reset_key )
                    ? network_site_url( "wp-login.php?action=rp&key={$reset_key}&login=" . rawurlencode( $username ) )
                    : wp_login_url();

                $tier_label = ucfirst( $tier );
                $site_name  = get_bloginfo( 'name' );
                $portal_url = defined( 'ABA_PORTAL_URL' ) ? ABA_PORTAL_URL : home_url( '/portal' );

                $subject = "Welcome to {$site_name} — Your {$tier_label} Membership";

                $message  = "Dear {$first_name},\n\n";
                $message .= "Your {$tier_label} membership with the African Business Association has been activated.\n\n";
                $message .= "--- YOUR ACCOUNT DETAILS ---\n";
                $message .= "Name:       {$first_name} {$last_name}\n";
                $message .= "Email:      {$email}\n";
                $message .= "Membership: {$tier_label}\n";
                $message .= "Join Date:  {$join_date}\n\n";
                $message .= "--- GET STARTED ---\n";
                $message .= "Set your password and access your member portal using the link below:\n";
                $message .= "{$reset_url}\n\n";
                $message .= "Once logged in, visit your member dashboard at:\n";
                $message .= "{$portal_url}\n\n";
                $message .= "If you have any questions, please contact us at " . get_option( 'admin_email' ) . ".\n\n";
                $message .= "Best regards,\nThe {$site_name} Team";

                $headers = [ 'Content-Type: text/plain; charset=UTF-8' ];

                wp_mail( $email, $subject, $message, $headers );
            }

            return [
                'success' => true,
                'message' => "Member {$first_name} {$last_name} created successfully.",
                'userId'  => $user_id,
            ];
        },
    ] );
}


// ============================================================
// 7. JWT AUTH CONFIGURATION
//    Requires: WPGraphQL JWT Authentication plugin
// ============================================================

/**
 * Set the JWT secret key via wp-config.php:
 *   define( 'GRAPHQL_JWT_AUTH_SECRET_KEY', 'your-strong-secret-here' );
 *
 * The filter below attaches user role data to the JWT token
 * so NextAuth.js can store and use it client-side.
 */
add_filter( 'graphql_jwt_auth_token_before_sign', 'aba_add_role_to_jwt', 10, 2 );

function aba_add_role_to_jwt( array $token_data, \WP_User $user ): array {
    $roles    = $user->roles;
    $priority = [ 'administrator', 'aba_manager', 'aba_staff', 'aba_corporate', 'aba_executive', 'aba_professional', 'aba_free_member' ];
    $primary  = 'aba_free_member';

    foreach ( $priority as $role ) {
        if ( in_array( $role, $roles, true ) ) {
            $primary = $role;
            break;
        }
    }

    $token_data['data']['user']['role']              = $primary;
    $token_data['data']['user']['membershipTier']    = get_user_meta( $user->ID, 'aba_membership_tier', true ) ?: 'free';
    $token_data['data']['user']['subscriptionStatus']= get_user_meta( $user->ID, 'aba_subscription_status', true ) ?: 'inactive';

    return $token_data;
}


// ============================================================
// 8. CORS — Allow Next.js frontend to call WPGraphQL
// ============================================================

add_action( 'graphql_response_headers_to_send', 'aba_graphql_cors_headers' );

function aba_graphql_cors_headers( array $headers ): array {
    $allowed_origins = [
        'http://localhost:3000',
        'https://your-production-domain.vercel.app', // ← update before go-live
    ];

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    if ( in_array( $origin, $allowed_origins, true ) ) {
        $headers['Access-Control-Allow-Origin']  = $origin;
        $headers['Access-Control-Allow-Headers'] = 'Authorization, Content-Type';
        $headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
    }

    return $headers;
}


// ============================================================
// 9. FLUSH REWRITE RULES on Activation
// ============================================================

register_activation_hook( __FILE__, function() {
    aba_register_post_types();
    flush_rewrite_rules();
} );

register_deactivation_hook( __FILE__, 'flush_rewrite_rules' );
