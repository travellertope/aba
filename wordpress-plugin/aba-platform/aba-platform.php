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
            'frontendUrl'      => [ 'type' => 'String' ],
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
            $frontend_url   = sanitize_text_field( $input['frontendUrl'] ?? '' );

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
                
                $base_url   = rtrim( $frontend_url ?: network_site_url(), '/' );
                
                $reset_url  = ! is_wp_error( $reset_key )
                    ? "{$base_url}/portal/reset-password?key={$reset_key}&login=" . rawurlencode( $username )
                    : "{$base_url}/portal/login";

                $tier_label = ucfirst( $tier );
                $site_name  = get_bloginfo( 'name' );
                $portal_url = "{$base_url}/portal/login";

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
// 9. TEAM MEMBER CPT + ACF-STYLE META
// ============================================================

add_action( 'init', 'aba_register_team_member_cpt' );

function aba_register_team_member_cpt() {
    register_post_type( 'aba_team_member', [
        'labels'              => aba_labels( 'Team Member', 'Team Members' ),
        'public'              => false,
        'show_ui'             => true,
        'show_in_graphql'     => true,
        'graphql_single_name' => 'teamMember',
        'graphql_plural_name' => 'teamMembers',
        'supports'            => [ 'title', 'thumbnail' ],
        'menu_icon'           => 'dashicons-groups',
        'show_in_rest'        => true,
    ] );
}

add_action( 'init', 'aba_register_team_member_meta' );

function aba_register_team_member_meta() {
    $fields = [
        'team_member_role'          => 'string',
        'team_member_section'       => 'string',  // 'management' | 'advisory'
        'team_member_bio'           => 'string',
        'team_member_linkedin_url'  => 'string',
        'team_member_read_more_url' => 'string',
        'team_member_display_order' => 'integer',
    ];

    foreach ( $fields as $key => $type ) {
        register_post_meta( 'aba_team_member', $key, [
            'type'         => $type,
            'single'       => true,
            'show_in_rest' => true,
        ] );
    }
}

add_action( 'graphql_register_types', 'aba_register_team_member_graphql_fields' );

function aba_register_team_member_graphql_fields() {
    if ( ! function_exists( 'register_graphql_field' ) ) {
        return;
    }

    $fields = [
        'memberRole'        => [ 'type' => 'String', 'key' => 'team_member_role' ],
        'memberSection'     => [ 'type' => 'String', 'key' => 'team_member_section' ],
        'memberBio'         => [ 'type' => 'String', 'key' => 'team_member_bio' ],
        'linkedinUrl'       => [ 'type' => 'String', 'key' => 'team_member_linkedin_url' ],
        'readMoreUrl'       => [ 'type' => 'String', 'key' => 'team_member_read_more_url' ],
        'displayOrder'      => [ 'type' => 'Int',    'key' => 'team_member_display_order' ],
    ];

    foreach ( $fields as $field_name => $config ) {
        register_graphql_field( 'TeamMember', $field_name, [
            'type'        => $config['type'],
            'description' => "Team member ACF field: {$config['key']}",
            'resolve'     => function( $post ) use ( $config ) {
                return get_post_meta( $post->databaseId, $config['key'], true ) ?: null;
            },
        ] );
    }

    // Expose the featured image URL directly for convenience
    register_graphql_field( 'TeamMember', 'photoUrl', [
        'type'        => 'String',
        'description' => 'URL of the team member profile photo (featured image).',
        'resolve'     => function( $post ) {
            $thumb_id = get_post_thumbnail_id( $post->databaseId );
            if ( ! $thumb_id ) {
                return null;
            }
            $src = wp_get_attachment_image_src( $thumb_id, 'medium' );
            return $src ? $src[0] : null;
        },
    ] );

    // Catch-all: every ACF field added via the WP admin is automatically
    // included here as a JSON string, so no PHP change is needed for new fields.
    register_graphql_field( 'TeamMember', 'acfFields', [
        'type'        => 'String',
        'description' => 'JSON-encoded map of all ACF fields for this team member.',
        'resolve'     => function( $post ) {
            if ( ! function_exists( 'get_fields' ) ) {
                return null;
            }
            $fields = get_fields( $post->databaseId );
            return ( $fields && is_array( $fields ) ) ? wp_json_encode( $fields ) : null;
        },
    ] );
}

// ── Register the page template so WP finds it inside the plugin ──────────────
add_filter( 'theme_page_templates', 'aba_register_management_team_template' );

function aba_register_management_team_template( array $templates ): array {
    $templates[ plugin_dir_path( __FILE__ ) . 'templates/page-management-team.php' ] = 'Management Team';
    return $templates;
}

add_filter( 'template_include', 'aba_load_management_team_template' );

function aba_load_management_team_template( string $template ): string {
    if ( ! is_page() ) {
        return $template;
    }
    $page_template = get_post_meta( get_the_ID(), '_wp_page_template', true );
    $plugin_file   = plugin_dir_path( __FILE__ ) . 'templates/page-management-team.php';

    if ( $page_template === $plugin_file && file_exists( $plugin_file ) ) {
        return $plugin_file;
    }
    return $template;
}


// ── Seed the ACF repeater field group into the database on first install ─────
// Attaches two Repeater fields directly to the Management Team page template so
// all members are managed from one page in the WP admin (no separate CPT posts).
// acf_import_field_group() writes to the DB → fully editable in ACF → Field Groups.
// The existence check means admin edits are never overwritten on plugin updates.
add_action( 'acf/init', 'aba_seed_management_team_repeaters' );

function aba_seed_management_team_repeaters(): void {
    if ( ! function_exists( 'acf_get_field_group' ) || ! function_exists( 'acf_import_field_group' ) ) {
        return;
    }

    if ( acf_get_field_group( 'group_aba_management_team_page' ) ) {
        return;
    }

    $template_path = plugin_dir_path( __FILE__ ) . 'templates/page-management-team.php';

    acf_import_field_group( [
        'key'                   => 'group_aba_management_team_page',
        'title'                 => 'Management Team Page',
        'active'                => true,
        'fields'                => [

            // ── Management Team repeater ──────────────────────────────────
            [
                'key'           => 'field_mt_management_team',
                'label'         => 'Management Team',
                'name'          => 'management_team',
                'type'          => 'repeater',
                'instructions'  => 'Add each management team member. Drag rows to reorder.',
                'button_label'  => 'Add Team Member',
                'layout'        => 'block',
                'sub_fields'    => [
                    [
                        'key'           => 'field_mt_mgmt_name',
                        'label'         => 'Full Name',
                        'name'          => 'name',
                        'type'          => 'text',
                        'required'      => 1,
                        'maxlength'     => 120,
                        'wrapper'       => [ 'width' => '50' ],
                    ],
                    [
                        'key'           => 'field_mt_mgmt_role',
                        'label'         => 'Role / Title',
                        'name'          => 'role',
                        'type'          => 'text',
                        'required'      => 1,
                        'maxlength'     => 120,
                        'instructions'  => 'e.g. "Convener" or "Head, Business Development"',
                        'wrapper'       => [ 'width' => '50' ],
                    ],
                    [
                        'key'           => 'field_mt_mgmt_photo',
                        'label'         => 'Profile Photo',
                        'name'          => 'photo',
                        'type'          => 'image',
                        'return_format' => 'url',
                        'preview_size'  => 'thumbnail',
                        'wrapper'       => [ 'width' => '30' ],
                    ],
                    [
                        'key'           => 'field_mt_mgmt_bio',
                        'label'         => 'Short Bio',
                        'name'          => 'bio',
                        'type'          => 'textarea',
                        'rows'          => 3,
                        'maxlength'     => 1000,
                        'wrapper'       => [ 'width' => '70' ],
                    ],
                    [
                        'key'           => 'field_mt_mgmt_linkedin',
                        'label'         => 'LinkedIn URL',
                        'name'          => 'linkedin_url',
                        'type'          => 'url',
                        'maxlength'     => 255,
                        'wrapper'       => [ 'width' => '100' ],
                    ],
                ],
            ],

            // ── Advisory Board repeater ───────────────────────────────────
            [
                'key'           => 'field_mt_advisory_board',
                'label'         => 'Advisory Board Members',
                'name'          => 'advisory_board',
                'type'          => 'repeater',
                'instructions'  => 'Add each advisory board member. Drag rows to reorder.',
                'button_label'  => 'Add Advisory Member',
                'layout'        => 'block',
                'sub_fields'    => [
                    [
                        'key'           => 'field_mt_adv_name',
                        'label'         => 'Full Name',
                        'name'          => 'name',
                        'type'          => 'text',
                        'required'      => 1,
                        'maxlength'     => 120,
                        'wrapper'       => [ 'width' => '50' ],
                    ],
                    [
                        'key'           => 'field_mt_adv_photo',
                        'label'         => 'Profile Photo',
                        'name'          => 'photo',
                        'type'          => 'image',
                        'return_format' => 'url',
                        'preview_size'  => 'thumbnail',
                        'wrapper'       => [ 'width' => '30' ],
                    ],
                    [
                        'key'           => 'field_mt_adv_bio',
                        'label'         => 'Short Bio',
                        'name'          => 'bio',
                        'type'          => 'textarea',
                        'rows'          => 3,
                        'maxlength'     => 1000,
                        'wrapper'       => [ 'width' => '70' ],
                    ],
                    [
                        'key'           => 'field_mt_adv_read_more',
                        'label'         => 'Read More URL',
                        'name'          => 'read_more_url',
                        'type'          => 'url',
                        'instructions'  => 'Link for the "Read More >" button.',
                        'maxlength'     => 255,
                        'wrapper'       => [ 'width' => '100' ],
                    ],
                ],
            ],

        ],
        'location' => [
            [
                [
                    'param'    => 'page_template',
                    'operator' => '==',
                    'value'    => $template_path,
                ],
            ],
        ],
        'menu_order'            => 0,
        'position'              => 'normal',
        'style'                 => 'default',
        'label_placement'       => 'top',
        'instruction_placement' => 'label',
    ] );
}


// ============================================================
// 10. FLUSH REWRITE RULES on Activation
// ============================================================

register_activation_hook( __FILE__, function() {
    aba_register_post_types();
    aba_register_team_member_cpt();
    flush_rewrite_rules();
} );

register_deactivation_hook( __FILE__, 'flush_rewrite_rules' );


// ============================================================
// 11. MAILCHIMP NEWSLETTER — SETTINGS + SUBSCRIBE FORM
// ============================================================

define( 'ABA_MC_OPTION_KEY',  'aba_mailchimp_api_key' );
define( 'ABA_MC_OPTION_LIST', 'aba_mailchimp_list_id' );
define( 'ABA_MC_OPTION_TAGS', 'aba_mailchimp_tag_names' ); // JSON array of tag name strings

// ── Admin menu ──────────────────────────────────────────────
add_action( 'admin_menu', 'aba_mc_admin_menu' );

function aba_mc_admin_menu(): void {
    add_options_page(
        'ABA Newsletter Settings',
        'ABA Newsletter',
        'manage_options',
        'aba-newsletter',
        'aba_mc_settings_page'
    );
}

// ── Register settings ────────────────────────────────────────
add_action( 'admin_init', 'aba_mc_register_settings' );

function aba_mc_register_settings(): void {
    register_setting( 'aba_mc_options', ABA_MC_OPTION_KEY,  [ 'sanitize_callback' => 'sanitize_text_field' ] );
    register_setting( 'aba_mc_options', ABA_MC_OPTION_LIST, [ 'sanitize_callback' => 'sanitize_text_field' ] );
    register_setting( 'aba_mc_options', ABA_MC_OPTION_TAGS, [
        'sanitize_callback' => function( $raw ) {
            $decoded = json_decode( $raw, true );
            if ( ! is_array( $decoded ) ) {
                return '[]';
            }
            return wp_json_encode( array_values( array_map( 'sanitize_text_field', $decoded ) ) );
        },
    ] );
}

// ── Mailchimp API helper ─────────────────────────────────────

function aba_mc_api_json( string $endpoint, string $method = 'GET', array $body = [] ) {
    $api_key = get_option( ABA_MC_OPTION_KEY, '' );
    if ( ! $api_key ) {
        return new WP_Error( 'no_key', 'Mailchimp API key is not set.' );
    }

    $dc_pos = strrpos( $api_key, '-' );
    if ( false === $dc_pos ) {
        return new WP_Error( 'bad_key', 'API key format invalid (expected xxxxx-dc1).' );
    }
    $dc  = substr( $api_key, $dc_pos + 1 );
    $url = "https://{$dc}.api.mailchimp.com/3.0/{$endpoint}";

    $args = [
        'method'  => $method,
        'headers' => [
            'Authorization' => 'Basic ' . base64_encode( 'anystring:' . $api_key ),
            'Content-Type'  => 'application/json',
            'Accept'        => 'application/json',
        ],
        'timeout' => 15,
    ];
    if ( ! empty( $body ) ) {
        $args['body'] = wp_json_encode( $body );
    }

    $response = wp_remote_request( $url, $args );
    if ( is_wp_error( $response ) ) {
        return $response;
    }

    $code = wp_remote_retrieve_response_code( $response );
    $data = json_decode( wp_remote_retrieve_body( $response ), true );

    if ( $code >= 400 ) {
        $message = $data['detail'] ?? $data['title'] ?? "Mailchimp API error {$code}";
        return new WP_Error( 'mc_api_error', $message, [ 'status' => $code ] );
    }

    return $data ?? [];
}

// ── AJAX: fetch audiences (admin only) ──────────────────────
add_action( 'wp_ajax_aba_mc_fetch_audiences', 'aba_mc_ajax_fetch_audiences' );

function aba_mc_ajax_fetch_audiences(): void {
    check_ajax_referer( 'aba_mc_admin', 'nonce' );
    if ( ! current_user_can( 'manage_options' ) ) {
        wp_send_json_error( 'Permission denied.' );
    }

    $data = aba_mc_api_json( 'lists?count=200&fields=lists.id,lists.name,total_items' );
    if ( is_wp_error( $data ) ) {
        wp_send_json_error( $data->get_error_message() );
    }

    $lists = array_map(
        fn( $l ) => [ 'id' => $l['id'], 'name' => $l['name'] ],
        $data['lists'] ?? []
    );
    wp_send_json_success( $lists );
}

// ── AJAX: search tags in a list (admin only) ─────────────────
add_action( 'wp_ajax_aba_mc_fetch_tags', 'aba_mc_ajax_fetch_tags' );

function aba_mc_ajax_fetch_tags(): void {
    check_ajax_referer( 'aba_mc_admin', 'nonce' );
    if ( ! current_user_can( 'manage_options' ) ) {
        wp_send_json_error( 'Permission denied.' );
    }

    $list_id = sanitize_text_field( $_POST['list_id'] ?? '' );
    $search  = sanitize_text_field( $_POST['search']  ?? '' );

    if ( ! $list_id ) {
        wp_send_json_error( 'No audience ID.' );
    }
    if ( strlen( $search ) < 2 ) {
        wp_send_json_success( [] );
    }

    $data = aba_mc_api_json(
        'lists/' . rawurlencode( $list_id ) . '/tag-search?name=' . rawurlencode( $search )
    );
    if ( is_wp_error( $data ) ) {
        wp_send_json_error( $data->get_error_message() );
    }

    $tags = array_map(
        fn( $t ) => [ 'id' => $t['id'], 'name' => $t['name'] ],
        $data['tags'] ?? []
    );
    wp_send_json_success( $tags );
}

// ── Enqueue jQuery on settings page ─────────────────────────
add_action( 'admin_enqueue_scripts', function( $hook ) {
    if ( 'settings_page_aba-newsletter' === $hook ) {
        wp_enqueue_script( 'jquery' );
    }
} );

// ── Settings page HTML ───────────────────────────────────────
function aba_mc_settings_page(): void {
    if ( ! current_user_can( 'manage_options' ) ) {
        return;
    }

    $api_key     = get_option( ABA_MC_OPTION_KEY,  '' );
    $saved_list  = get_option( ABA_MC_OPTION_LIST,  '' );
    $saved_tags  = json_decode( get_option( ABA_MC_OPTION_TAGS, '[]' ), true );
    $admin_nonce = wp_create_nonce( 'aba_mc_admin' );
    $connected   = ! empty( $api_key );
    ?>
    <div class="wrap">
        <h1>ABA Newsletter — Mailchimp Settings</h1>
        <?php settings_errors( 'aba_mc_options' ); ?>

        <form method="post" action="options.php" id="aba-mc-settings-form">
            <?php settings_fields( 'aba_mc_options' ); ?>

            <!-- API Key -->
            <h2 class="title">API Connection</h2>
            <table class="form-table" role="presentation">
                <tr>
                    <th scope="row"><label for="aba_mc_api_key">Mailchimp API Key</label></th>
                    <td>
                        <input type="password"
                               id="aba_mc_api_key"
                               name="<?php echo ABA_MC_OPTION_KEY; ?>"
                               value="<?php echo esc_attr( $api_key ); ?>"
                               class="regular-text"
                               autocomplete="off"
                               placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-us1" />
                        <?php if ( $connected ) : ?>
                            <span style="margin-left:8px;color:#00a32a;font-weight:600;">&#10003; Connected</span>
                        <?php endif; ?>
                        <p class="description">
                            Find your key in Mailchimp → Account → Extras → API keys.
                        </p>
                    </td>
                </tr>
            </table>

            <!-- Audience -->
            <h2 class="title">Audience</h2>
            <p>Select which Mailchimp audience new subscribers will be added to.</p>
            <table class="form-table" role="presentation">
                <tr>
                    <th scope="row"><label for="aba_mc_audience_select">Audience</label></th>
                    <td>
                        <select id="aba_mc_audience_select"
                                name="<?php echo ABA_MC_OPTION_LIST; ?>"
                                style="min-width:300px;">
                            <option value="">
                                — <?php echo $connected ? 'Loading…' : 'Enter API key first'; ?> —
                            </option>
                            <?php if ( $saved_list ) : ?>
                                <option value="<?php echo esc_attr( $saved_list ); ?>" selected>
                                    <?php echo esc_html( $saved_list ); ?>
                                </option>
                            <?php endif; ?>
                        </select>
                        <?php if ( $connected ) : ?>
                            <button type="button" id="aba-mc-refresh-audiences" class="button" style="margin-left:8px;">
                                ↻ Refresh
                            </button>
                        <?php endif; ?>
                    </td>
                </tr>
            </table>

            <!-- Tags -->
            <h2 class="title">Tags</h2>
            <p>Search for existing tags in the selected audience. All new subscribers will receive these tags automatically.</p>
            <table class="form-table" role="presentation">
                <tr>
                    <th scope="row">Search tags</th>
                    <td>
                        <input type="text"
                               id="aba-mc-tag-search"
                               class="regular-text"
                               placeholder="Type at least 2 characters…"
                               <?php echo ( $connected && $saved_list ) ? '' : 'disabled'; ?> />
                        <div id="aba-mc-tag-results" style="margin-top:8px;display:flex;flex-wrap:wrap;gap:5px;"></div>

                        <input type="hidden"
                               id="aba_mc_tag_names_field"
                               name="<?php echo ABA_MC_OPTION_TAGS; ?>"
                               value="<?php echo esc_attr( wp_json_encode( $saved_tags ) ); ?>" />

                        <div style="margin-top:14px;">
                            <strong>Selected tags:</strong>
                            <div id="aba-mc-tag-chips"
                                 style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px;min-height:28px;">
                                <?php foreach ( $saved_tags as $tag_name ) : ?>
                                    <span class="aba-mc-chip"
                                          data-tag="<?php echo esc_attr( $tag_name ); ?>"
                                          style="background:#0073aa;color:#fff;padding:3px 12px;border-radius:12px;font-size:13px;cursor:pointer;"
                                          title="Click to remove">
                                        <?php echo esc_html( $tag_name ); ?> &times;
                                    </span>
                                <?php endforeach; ?>
                            </div>
                        </div>
                        <p class="description">
                            Click a result to add it. Click a blue chip to remove it.
                        </p>
                    </td>
                </tr>
            </table>

            <?php submit_button( 'Save Settings' ); ?>
        </form>

        <hr />
        <h2>Embed the Subscribe Form</h2>
        <p>Use this shortcode anywhere, including a text/HTML widget in the footer widget area:</p>
        <code style="font-size:14px;padding:7px 12px;display:inline-block;background:#f0f0f1;border-radius:4px;">
            [aba_newsletter_form]
        </code>
        <p style="margin-top:12px;">Optional attributes:</p>
        <code style="font-size:14px;padding:7px 12px;display:inline-block;background:#f0f0f1;border-radius:4px;">
            [aba_newsletter_form heading="Stay in the loop" description="Get our latest news." button_text="Join Now"]
        </code>
        <p>Or add the <strong>ABA Newsletter Subscribe</strong> widget to any widget area (Appearance → Widgets).</p>
    </div>

    <script>
    (function($) {
        var nonce    = <?php echo wp_json_encode( $admin_nonce ); ?>;
        var ajaxUrl  = <?php echo wp_json_encode( admin_url( 'admin-ajax.php' ) ); ?>;
        var savedList = <?php echo wp_json_encode( $saved_list ); ?>;
        var selectedTags = <?php echo wp_json_encode( $saved_tags ); ?>;
        var tagSearchTimer;

        function updateHiddenField() {
            $('#aba_mc_tag_names_field').val(JSON.stringify(selectedTags));
        }

        function renderChips() {
            var $chips = $('#aba-mc-tag-chips').empty();
            selectedTags.forEach(function(name) {
                $('<span class="aba-mc-chip">')
                    .text(name + ' ×')
                    .attr('data-tag', name)
                    .css({
                        background: '#0073aa', color: '#fff',
                        padding: '3px 12px', borderRadius: '12px',
                        fontSize: '13px', cursor: 'pointer'
                    })
                    .on('click', function() {
                        selectedTags = selectedTags.filter(function(t) { return t !== name; });
                        updateHiddenField();
                        renderChips();
                    })
                    .appendTo($chips);
            });
        }

        function loadAudiences(preselectId) {
            var $select = $('#aba_mc_audience_select').prop('disabled', true);
            $.post(ajaxUrl, { action: 'aba_mc_fetch_audiences', nonce: nonce }, function(resp) {
                $select.empty().append('<option value="">— Select an audience —</option>');
                if (resp.success && resp.data.length) {
                    resp.data.forEach(function(list) {
                        var selected = (list.id === (preselectId || savedList)) ? ' selected' : '';
                        $select.append(
                            '<option value="' + list.id + '"' + selected + '>' +
                            list.name + ' (' + list.id + ')</option>'
                        );
                    });
                } else {
                    $select.append('<option value="">— No audiences found —</option>');
                    console.error('MC fetch audiences:', resp.data);
                }
                $select.prop('disabled', false);
                if ($select.val()) {
                    $('#aba-mc-tag-search').prop('disabled', false);
                }
            });
        }

        <?php if ( $connected ) : ?>
        loadAudiences(savedList);
        <?php endif; ?>

        $('#aba-mc-refresh-audiences').on('click', function() { loadAudiences(''); });

        $('#aba_mc_audience_select').on('change', function() {
            var hasAudience = !!$(this).val();
            $('#aba-mc-tag-search').prop('disabled', !hasAudience);
            $('#aba-mc-tag-results').empty();
        });

        $('#aba-mc-tag-search').on('input', function() {
            var query = $(this).val().trim();
            clearTimeout(tagSearchTimer);
            $('#aba-mc-tag-results').empty();
            if (query.length < 2) return;

            tagSearchTimer = setTimeout(function() {
                var listId = $('#aba_mc_audience_select').val();
                if (!listId) return;
                $.post(ajaxUrl, {
                    action: 'aba_mc_fetch_tags',
                    nonce: nonce,
                    list_id: listId,
                    search: query
                }, function(resp) {
                    var $results = $('#aba-mc-tag-results').empty();
                    if (!resp.success || !resp.data.length) {
                        $results.html('<em style="color:#777;font-size:13px;">No tags found for "' + query + '"</em>');
                        return;
                    }
                    resp.data.forEach(function(tag) {
                        if (selectedTags.indexOf(tag.name) !== -1) return;
                        $('<span>')
                            .text('+ ' + tag.name)
                            .css({
                                display: 'inline-block',
                                background: '#f0f6fc', border: '1px solid #0073aa',
                                color: '#0073aa', padding: '3px 12px',
                                borderRadius: '12px', fontSize: '13px', cursor: 'pointer'
                            })
                            .on('click', function() {
                                if (selectedTags.indexOf(tag.name) === -1) {
                                    selectedTags.push(tag.name);
                                    updateHiddenField();
                                    renderChips();
                                }
                                $results.empty();
                                $('#aba-mc-tag-search').val('');
                            })
                            .appendTo($results);
                    });
                });
            }, 400);
        });

    })(jQuery);
    </script>
    <?php
}

// ── Public AJAX: subscribe ───────────────────────────────────
add_action( 'wp_ajax_nopriv_aba_mc_subscribe', 'aba_mc_subscribe_handler' );
add_action( 'wp_ajax_aba_mc_subscribe',        'aba_mc_subscribe_handler' );

function aba_mc_subscribe_handler(): void {
    check_ajax_referer( 'aba_newsletter_nonce', 'nonce' );

    // Rate limit: 3 attempts per IP per hour
    $ip       = sanitize_text_field( $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0' );
    $rate_key = 'aba_mc_rate_' . md5( $ip );
    $attempts = (int) get_transient( $rate_key );
    if ( $attempts >= 3 ) {
        wp_send_json_error( 'Too many attempts. Please try again in an hour.' );
    }
    set_transient( $rate_key, $attempts + 1, HOUR_IN_SECONDS );

    $email = sanitize_email( wp_unslash( $_POST['email'] ?? '' ) );

    if ( ! is_email( $email ) ) {
        wp_send_json_error( 'Please enter a valid email address.' );
    }

    $list_id = get_option( ABA_MC_OPTION_LIST, '' );
    if ( ! $list_id ) {
        wp_send_json_error( 'Newsletter is not configured yet. Please try again later.' );
    }

    $subscriber_hash = md5( strtolower( trim( $email ) ) );

    $result = aba_mc_api_json(
        'lists/' . rawurlencode( $list_id ) . '/members/' . $subscriber_hash,
        'PUT',
        [
            'email_address' => $email,
            'status_if_new' => 'subscribed',
        ]
    );

    if ( is_wp_error( $result ) ) {
        error_log( '[aba_mc_subscribe] ' . $result->get_error_message() );
        wp_send_json_error( 'Something went wrong. Please try again shortly.' );
    }

    // Apply configured tags (non-blocking — tag failure does not fail the subscription)
    $tag_names = json_decode( get_option( ABA_MC_OPTION_TAGS, '[]' ), true );
    if ( ! empty( $tag_names ) && is_array( $tag_names ) ) {
        $tags = array_map(
            fn( $name ) => [ 'name' => $name, 'status' => 'active' ],
            $tag_names
        );
        aba_mc_api_json(
            'lists/' . rawurlencode( $list_id ) . '/members/' . $subscriber_hash . '/tags',
            'POST',
            [ 'tags' => $tags ]
        );
    }

    wp_send_json_success( 'Thank you for subscribing! Welcome to the ABA community.' );
}

// ── Shortcode: [aba_newsletter_form] ────────────────────────
add_shortcode( 'aba_newsletter_form', 'aba_newsletter_form_shortcode' );

function aba_newsletter_form_shortcode( array $atts = [] ): string {
    $atts = shortcode_atts( [
        'heading'     => 'Subscribe to our newsletter',
        'description' => 'Stay informed about events, opportunities, and news from the African Business Association.',
        'button_text' => 'Subscribe',
    ], $atts, 'aba_newsletter_form' );

    $nonce    = wp_create_nonce( 'aba_newsletter_nonce' );
    $ajax_url = admin_url( 'admin-ajax.php' );
    $form_id  = 'aba-nl-' . wp_rand( 1000, 9999 );

    ob_start();
    ?>
    <div class="aba-newsletter-form" id="<?php echo esc_attr( $form_id ); ?>"
         style="font-family:system-ui,-apple-system,sans-serif;">
        <?php if ( $atts['heading'] ) : ?>
            <h3 style="margin:0 0 6px;font-size:18px;font-weight:700;color:#ffffff;">
                <?php echo esc_html( $atts['heading'] ); ?>
            </h3>
        <?php endif; ?>
        <?php if ( $atts['description'] ) : ?>
            <p style="margin:0 0 14px;font-size:13px;color:#ffffff;opacity:.85;line-height:1.5;">
                <?php echo esc_html( $atts['description'] ); ?>
            </p>
        <?php endif; ?>

        <form class="aba-nl-inner" novalidate>
            <input type="hidden" name="nonce"  value="<?php echo esc_attr( $nonce ); ?>" />
            <input type="hidden" name="action" value="aba_mc_subscribe" />

            <div style="display:flex;flex-wrap:wrap;gap:8px;">
                <input type="email"
                       name="email"
                       placeholder="Email address"
                       maxlength="254"
                       required
                       style="flex:1;min-width:200px;padding:9px 12px;border:1px solid #d1d5db;border-radius:6px;font-size:14px;background:#fff;color:#111827;" />
                <button type="submit"
                        style="padding:9px 20px;background:#d4a843;color:#fff;border:none;border-radius:6px;font-size:14px;font-weight:600;cursor:pointer;white-space:nowrap;">
                    <?php echo esc_html( $atts['button_text'] ); ?>
                </button>
            </div>
            <div class="aba-nl-msg"
                 role="status"
                 style="margin-top:8px;font-size:13px;min-height:18px;"></div>
        </form>
    </div>
    <script>
    (function() {
        var wrap    = document.getElementById(<?php echo wp_json_encode( $form_id ); ?>);
        var form    = wrap.querySelector('.aba-nl-inner');
        var msg     = wrap.querySelector('.aba-nl-msg');
        var btnText = <?php echo wp_json_encode( $atts['button_text'] ); ?>;
        var ajaxUrl = <?php echo wp_json_encode( $ajax_url ); ?>;

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            var email = form.querySelector('[name="email"]').value.trim();
            if (!email) {
                msg.textContent = 'Please enter your email address.';
                msg.style.color = '#dc2626';
                return;
            }
            var btn = form.querySelector('[type="submit"]');
            btn.disabled = true;
            btn.textContent = 'Subscribing…';
            msg.textContent = '';

            fetch(ajaxUrl, { method: 'POST', body: new FormData(form) })
                .then(function(r) { return r.json(); })
                .then(function(resp) {
                    if (resp.success) {
                        msg.textContent = resp.data;
                        msg.style.color = '#16a34a';
                        form.reset();
                    } else {
                        msg.textContent = resp.data || 'Something went wrong.';
                        msg.style.color = '#dc2626';
                    }
                })
                .catch(function() {
                    msg.textContent = 'Network error. Please try again.';
                    msg.style.color = '#dc2626';
                })
                .finally(function() {
                    btn.disabled = false;
                    btn.textContent = btnText;
                });
        });
    })();
    </script>
    <?php
    return ob_get_clean();
}

// ── Footer Widget ────────────────────────────────────────────
add_action( 'widgets_init', function() {
    register_widget( 'ABA_Newsletter_Widget' );
} );

class ABA_Newsletter_Widget extends WP_Widget {

    public function __construct() {
        parent::__construct(
            'aba_newsletter_widget',
            'ABA Newsletter Subscribe',
            [ 'description' => 'Mailchimp newsletter subscribe form for the footer.' ]
        );
    }

    public function widget( $args, $instance ): void {
        echo $args['before_widget'];
        echo do_shortcode( sprintf(
            '[aba_newsletter_form heading="%s" description="%s" button_text="%s"]',
            esc_attr( $instance['heading']     ?? 'Subscribe to our newsletter' ),
            esc_attr( $instance['description'] ?? '' ),
            esc_attr( $instance['button_text'] ?? 'Subscribe' )
        ) );
        echo $args['after_widget'];
    }

    public function form( $instance ): void {
        $heading     = $instance['heading']     ?? 'Subscribe to our newsletter';
        $description = $instance['description'] ?? 'Stay informed about events, opportunities, and news from the African Business Association.';
        $button_text = $instance['button_text'] ?? 'Subscribe';
        ?>
        <p>
            <label for="<?php echo $this->get_field_id( 'heading' ); ?>">Heading</label>
            <input class="widefat" type="text"
                   id="<?php echo $this->get_field_id( 'heading' ); ?>"
                   name="<?php echo $this->get_field_name( 'heading' ); ?>"
                   value="<?php echo esc_attr( $heading ); ?>" />
        </p>
        <p>
            <label for="<?php echo $this->get_field_id( 'description' ); ?>">Description</label>
            <textarea class="widefat" rows="2"
                      id="<?php echo $this->get_field_id( 'description' ); ?>"
                      name="<?php echo $this->get_field_name( 'description' ); ?>"><?php echo esc_textarea( $description ); ?></textarea>
        </p>
        <p>
            <label for="<?php echo $this->get_field_id( 'button_text' ); ?>">Button text</label>
            <input class="widefat" type="text"
                   id="<?php echo $this->get_field_id( 'button_text' ); ?>"
                   name="<?php echo $this->get_field_name( 'button_text' ); ?>"
                   value="<?php echo esc_attr( $button_text ); ?>" />
        </p>
        <?php
    }

    public function update( $new_instance, $old_instance ): array {
        return [
            'heading'     => sanitize_text_field( $new_instance['heading']     ?? '' ),
            'description' => sanitize_text_field( $new_instance['description'] ?? '' ),
            'button_text' => sanitize_text_field( $new_instance['button_text'] ?? '' ),
        ];
    }
}
