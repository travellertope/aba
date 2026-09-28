<?php
/**
 * Template Name: Management Team
 * Description:  ACF-powered Management Team & Advisory Board page.
 *               Assign this template to any WordPress Page via the
 *               Page Attributes → Template dropdown.
 */

defined( 'ABSPATH' ) || exit;

get_header();

// ── Fetch all team members, ordered by display_order then title ──────────────
$management = [];
$advisory   = [];

$members_query = new WP_Query( [
    'post_type'      => 'aba_team_member',
    'post_status'    => 'publish',
    'posts_per_page' => 200,
    'meta_key'       => 'team_member_display_order',
    'orderby'        => [ 'meta_value_num' => 'ASC', 'title' => 'ASC' ],
    'no_found_rows'  => true,
] );

if ( $members_query->have_posts() ) {
    while ( $members_query->have_posts() ) {
        $members_query->the_post();

        // Use ACF get_fields() when available, fall back to get_post_meta()
        if ( function_exists( 'get_fields' ) ) {
            $acf = get_fields( get_the_ID() ) ?: [];
        } else {
            $acf = [];
        }

        $member = [
            'id'            => get_the_ID(),
            'name'          => get_the_title(),
            'photo_url'     => get_the_post_thumbnail_url( get_the_ID(), 'medium' ) ?: '',
            'role'          => $acf['team_member_role']          ?? get_post_meta( get_the_ID(), 'team_member_role',          true ),
            'section'       => $acf['team_member_section']       ?? get_post_meta( get_the_ID(), 'team_member_section',       true ),
            'bio'           => $acf['team_member_bio']           ?? get_post_meta( get_the_ID(), 'team_member_bio',           true ),
            'linkedin_url'  => $acf['team_member_linkedin_url']  ?? get_post_meta( get_the_ID(), 'team_member_linkedin_url',  true ),
            'read_more_url' => $acf['team_member_read_more_url'] ?? get_post_meta( get_the_ID(), 'team_member_read_more_url', true ),
            'extra'         => $acf, // all ACF fields including any you add later
        ];

        if ( 'advisory' === $member['section'] ) {
            $advisory[] = $member;
        } else {
            $management[] = $member;
        }
    }
    wp_reset_postdata();
}
?>

<style>
/* ── Management Team page styles ── */
.aba-mt-page { font-family: system-ui, -apple-system, sans-serif; color: #111827; }

/* Hero banners */
.aba-mt-hero {
    position: relative;
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    background-color: #1a2340;
    overflow: hidden;
}
.aba-mt-hero--advisory { background-color: #2d4a7a; }
.aba-mt-hero__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(26,35,64,.55), rgba(26,35,64,.75));
    z-index: 1;
}
.aba-mt-hero--advisory .aba-mt-hero__overlay {
    background: linear-gradient(to bottom, rgba(20,32,56,.5), rgba(20,32,56,.7));
}
.aba-mt-hero__bg {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    z-index: 0;
}
.aba-mt-hero__content {
    position: relative;
    z-index: 2;
    padding: 4rem 1rem;
}
.aba-mt-hero__title {
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    font-weight: 800;
    color: #fff;
    margin: 0;
    letter-spacing: .02em;
}

/* Section wrapper */
.aba-mt-section { padding: 3.5rem 1rem; }
.aba-mt-section__inner { max-width: 72rem; margin: 0 auto; }

/* Grid */
.aba-mt-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
}
@media (min-width: 640px)  { .aba-mt-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .aba-mt-grid { grid-template-columns: repeat(3, 1fr); } }

/* Cards */
.aba-mt-card {
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 1.5rem 1rem;
    text-align: center;
    background: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
}

/* Avatar */
.aba-mt-avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid #e5e7eb;
    margin: 0 auto 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f9fafb;
    flex-shrink: 0;
}
.aba-mt-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
.aba-mt-avatar__placeholder {
    width: 60%;
    height: 60%;
    border: 2px dashed #d1d5db;
    border-radius: 50%;
}

/* Member name */
.aba-mt-card__name {
    font-size: 16px;
    font-weight: 700;
    color: #111827;
    margin: 0 0 6px;
}
/* Role */
.aba-mt-card__role { font-size: 13px; color: #6b7280; margin: 0; }

/* LinkedIn */
.aba-mt-card__linkedin {
    display: inline-flex;
    align-items: center;
    margin-top: 10px;
    color: #0a66c2;
    text-decoration: none;
    font-size: 13px;
    gap: 4px;
}
.aba-mt-card__linkedin:hover { text-decoration: underline; }

/* Read More button */
.aba-mt-card__read-more {
    display: inline-block;
    margin-top: 14px;
    background-color: #8b5c2a;
    color: #fff;
    border-radius: 6px;
    padding: .45rem 1.25rem;
    font-size: 13px;
    font-weight: 600;
    text-decoration: none;
    transition: opacity .2s;
}
.aba-mt-card__read-more:hover { opacity: .85; color: #fff; }

/* Empty state */
.aba-mt-empty { text-align: center; color: #6b7280; }

/* Bio tooltip-style (shown on hover) */
.aba-mt-card__bio {
    font-size: 12px;
    color: #4b5563;
    margin: 8px 0 0;
    line-height: 1.6;
}
</style>

<div class="aba-mt-page">

    <?php /* ── Management Team hero ── */ ?>
    <div class="aba-mt-hero">
        <?php if ( has_post_thumbnail() ) : ?>
            <div class="aba-mt-hero__bg" style="background-image:url('<?php echo esc_url( get_the_post_thumbnail_url( get_the_ID(), 'full' ) ); ?>')"></div>
        <?php endif; ?>
        <div class="aba-mt-hero__overlay"></div>
        <div class="aba-mt-hero__content">
            <h1 class="aba-mt-hero__title">Management Team</h1>
        </div>
    </div>

    <?php /* ── Management Team grid ── */ ?>
    <div class="aba-mt-section">
        <div class="aba-mt-section__inner">
            <?php if ( empty( $management ) ) : ?>
                <p class="aba-mt-empty">No management team members found.</p>
            <?php else : ?>
                <div class="aba-mt-grid">
                    <?php foreach ( $management as $m ) : ?>
                        <div class="aba-mt-card">
                            <div class="aba-mt-avatar">
                                <?php if ( $m['photo_url'] ) : ?>
                                    <img src="<?php echo esc_url( $m['photo_url'] ); ?>"
                                         alt="<?php echo esc_attr( $m['name'] ); ?>">
                                <?php else : ?>
                                    <div class="aba-mt-avatar__placeholder"></div>
                                <?php endif; ?>
                            </div>

                            <h2 class="aba-mt-card__name"><?php echo esc_html( $m['name'] ); ?></h2>

                            <?php if ( $m['role'] ) : ?>
                                <p class="aba-mt-card__role"><?php echo esc_html( $m['role'] ); ?></p>
                            <?php endif; ?>

                            <?php if ( $m['bio'] ) : ?>
                                <p class="aba-mt-card__bio"><?php echo esc_html( $m['bio'] ); ?></p>
                            <?php endif; ?>

                            <?php if ( $m['linkedin_url'] ) : ?>
                                <a class="aba-mt-card__linkedin"
                                   href="<?php echo esc_url( $m['linkedin_url'] ); ?>"
                                   target="_blank" rel="noopener noreferrer">
                                    LinkedIn ↗
                                </a>
                            <?php endif; ?>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </div>
    </div>

    <?php /* ── Advisory Board hero ── */ ?>
    <div class="aba-mt-hero aba-mt-hero--advisory">
        <div class="aba-mt-hero__overlay"></div>
        <div class="aba-mt-hero__content">
            <h2 class="aba-mt-hero__title">Advisory Board Members</h2>
        </div>
    </div>

    <?php /* ── Advisory Board grid ── */ ?>
    <div class="aba-mt-section">
        <div class="aba-mt-section__inner">
            <?php if ( empty( $advisory ) ) : ?>
                <p class="aba-mt-empty">No advisory board members found.</p>
            <?php else : ?>
                <div class="aba-mt-grid">
                    <?php foreach ( $advisory as $m ) : ?>
                        <div class="aba-mt-card">
                            <div class="aba-mt-avatar">
                                <?php if ( $m['photo_url'] ) : ?>
                                    <img src="<?php echo esc_url( $m['photo_url'] ); ?>"
                                         alt="<?php echo esc_attr( $m['name'] ); ?>">
                                <?php else : ?>
                                    <div class="aba-mt-avatar__placeholder"></div>
                                <?php endif; ?>
                            </div>

                            <h2 class="aba-mt-card__name"><?php echo esc_html( $m['name'] ); ?></h2>

                            <?php if ( $m['bio'] ) : ?>
                                <p class="aba-mt-card__bio"><?php echo esc_html( $m['bio'] ); ?></p>
                            <?php endif; ?>

                            <a class="aba-mt-card__read-more"
                               href="<?php echo $m['read_more_url'] ? esc_url( $m['read_more_url'] ) : '#'; ?>">
                                Read More &gt;
                            </a>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </div>
    </div>

</div><!-- /.aba-mt-page -->

<?php get_footer(); ?>
