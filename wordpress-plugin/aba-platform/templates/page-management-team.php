<?php
/**
 * Template Name: Management Team
 * Description:  ACF Repeater-powered Management Team & Advisory Board page.
 *               Assign this template to any WordPress Page via
 *               Page Attributes → Template, then fill in the two
 *               repeater fields that appear below the editor.
 */

defined( 'ABSPATH' ) || exit;

get_header();

$management_rows = get_field( 'management_team' )  ?: [];
$advisory_rows   = get_field( 'advisory_board' )    ?: [];
?>

<style>
/* ── Management Team page styles ── */
.aba-mt-page { font-family: system-ui, -apple-system, sans-serif; color: #111827; }

.aba-mt-hero {
    position: relative;
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    background-color: #1a2340;
    overflow: hidden;
    /* JS breakout applies width + left at runtime */
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
.aba-mt-hero__content { position: relative; z-index: 2; padding: 4rem 1rem; }
.aba-mt-hero__title {
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    font-weight: 800;
    color: #fff;
    margin: 0;
    letter-spacing: .02em;
}

.aba-mt-section { padding: 3.5rem 1rem; }
.aba-mt-section__inner { max-width: 72rem; margin: 0 auto; }

.aba-mt-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
}
@media (min-width: 640px)  { .aba-mt-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .aba-mt-grid { grid-template-columns: repeat(3, 1fr); } }

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

.aba-mt-card__name  { font-size: 16px; font-weight: 700; color: #111827; margin: 0 0 6px; }
.aba-mt-card__role  { font-size: 13px; color: #6b7280; margin: 0; }
.aba-mt-card__bio   { font-size: 12px; color: #4b5563; margin: 8px 0 0; line-height: 1.6; }

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

.aba-mt-empty { text-align: center; color: #6b7280; }
</style>

<div class="aba-mt-page">

    <?php /* ── Management Team hero ── */ ?>
    <div class="aba-mt-hero">
        <?php if ( has_post_thumbnail() ) : ?>
            <div class="aba-mt-hero__bg"
                 style="background-image:url('<?php echo esc_url( get_the_post_thumbnail_url( get_the_ID(), 'full' ) ); ?>')">
            </div>
        <?php endif; ?>
        <div class="aba-mt-hero__overlay"></div>
        <div class="aba-mt-hero__content">
            <h1 class="aba-mt-hero__title">Management Team</h1>
        </div>
    </div>

    <?php /* ── Management Team repeater grid ── */ ?>
    <div class="aba-mt-section">
        <div class="aba-mt-section__inner">
            <?php if ( empty( $management_rows ) ) : ?>
                <p class="aba-mt-empty">No management team members added yet.</p>
            <?php else : ?>
                <div class="aba-mt-grid">
                    <?php foreach ( $management_rows as $row ) : ?>
                        <div class="aba-mt-card">

                            <div class="aba-mt-avatar">
                                <?php if ( ! empty( $row['photo'] ) ) : ?>
                                    <img src="<?php echo esc_url( $row['photo'] ); ?>"
                                         alt="<?php echo esc_attr( $row['name'] ); ?>">
                                <?php else : ?>
                                    <div class="aba-mt-avatar__placeholder"></div>
                                <?php endif; ?>
                            </div>

                            <h2 class="aba-mt-card__name"><?php echo esc_html( $row['name'] ); ?></h2>

                            <?php if ( ! empty( $row['role'] ) ) : ?>
                                <p class="aba-mt-card__role"><?php echo esc_html( $row['role'] ); ?></p>
                            <?php endif; ?>

                            <?php if ( ! empty( $row['bio'] ) ) : ?>
                                <p class="aba-mt-card__bio"><?php echo esc_html( $row['bio'] ); ?></p>
                            <?php endif; ?>

                            <?php if ( ! empty( $row['linkedin_url'] ) ) : ?>
                                <a class="aba-mt-card__linkedin"
                                   href="<?php echo esc_url( $row['linkedin_url'] ); ?>"
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

    <?php /* ── Advisory Board repeater grid ── */ ?>
    <div class="aba-mt-section">
        <div class="aba-mt-section__inner">
            <?php if ( empty( $advisory_rows ) ) : ?>
                <p class="aba-mt-empty">No advisory board members added yet.</p>
            <?php else : ?>
                <div class="aba-mt-grid">
                    <?php foreach ( $advisory_rows as $row ) : ?>
                        <div class="aba-mt-card">

                            <div class="aba-mt-avatar">
                                <?php if ( ! empty( $row['photo'] ) ) : ?>
                                    <img src="<?php echo esc_url( $row['photo'] ); ?>"
                                         alt="<?php echo esc_attr( $row['name'] ); ?>">
                                <?php else : ?>
                                    <div class="aba-mt-avatar__placeholder"></div>
                                <?php endif; ?>
                            </div>

                            <h2 class="aba-mt-card__name"><?php echo esc_html( $row['name'] ); ?></h2>

                            <?php if ( ! empty( $row['bio'] ) ) : ?>
                                <p class="aba-mt-card__bio"><?php echo esc_html( $row['bio'] ); ?></p>
                            <?php endif; ?>

                            <a class="aba-mt-card__read-more"
                               href="<?php echo ! empty( $row['read_more_url'] ) ? esc_url( $row['read_more_url'] ) : '#'; ?>">
                                Read More &gt;
                            </a>

                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </div>
    </div>

</div><!-- /.aba-mt-page -->

<script>
(function () {
    function breakoutHeros() {
        /* Un-clip any ancestor that has overflow hidden/auto — the most common
           reason a CSS-only vw breakout gets clipped in WordPress themes. */
        var heros = document.querySelectorAll('.aba-mt-hero');
        if (!heros.length) return;

        /* Walk up from the first hero and remove overflow constraints */
        var el = heros[0].parentElement;
        while (el && el !== document.body) {
            var cs = window.getComputedStyle(el);
            if (cs.overflow === 'hidden' || cs.overflowX === 'hidden') {
                el.style.setProperty('overflow', 'visible', 'important');
                el.style.setProperty('overflow-x', 'visible', 'important');
            }
            el = el.parentElement;
        }

        /* Now measure the hero's real left offset from the viewport and
           stretch it to full viewport width */
        heros.forEach(function (hero) {
            hero.style.left   = '';
            hero.style.width  = '';
            hero.style.marginLeft = '';
            /* After reset, measure */
            var rect = hero.getBoundingClientRect();
            var scrollX = window.pageXOffset || document.documentElement.scrollLeft;
            var leftPx  = -(rect.left + scrollX);
            hero.style.position   = 'relative';
            hero.style.left       = leftPx + 'px';
            hero.style.width      = window.innerWidth + 'px';
            hero.style.maxWidth   = 'none';
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', breakoutHeros);
    } else {
        breakoutHeros();
    }
    window.addEventListener('resize', breakoutHeros);
})();
</script>

<?php get_footer(); ?>
