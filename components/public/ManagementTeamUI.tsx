"use client";

import React from "react";
import { Building2 } from "lucide-react";
import type { TeamMember } from "@/types";

function LinkedInIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={style} aria-hidden="true">
      <path d="M20.447 20.452H17.21v-5.569c0-1.327-.024-3.037-1.852-3.037-1.854 0-2.137 1.447-2.137 2.941v5.665H9.984V9h3.102v1.561h.044c.432-.818 1.487-1.681 3.060-1.681 3.271 0 3.875 2.152 3.875 4.952v6.62zM5.337 7.433a1.800 1.800 0 1 1 0-3.601 1.800 1.800 0 0 1 0 3.601zM6.956 20.452H3.717V9h3.239v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

/* ─── colour tokens ─── */
const navy = "#1a2340";
const gold = "#d4a843";
const readMoreBrown = "#8b5c2a";

interface Props {
  managementMembers: TeamMember[];
  advisoryMembers: TeamMember[];
}

function MemberAvatar({ photoUrl, name }: { photoUrl: string | null; name: string }) {
  return (
    <div
      style={{
        width: 100,
        height: 100,
        borderRadius: "50%",
        overflow: "hidden",
        margin: "0 auto 16px",
        flexShrink: 0,
        border: `3px solid #e5e7eb`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f9fafb",
      }}
    >
      {photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photoUrl}
          alt={name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <div
          style={{
            width: "60%",
            height: "60%",
            border: "2px dashed #d1d5db",
            borderRadius: "50%",
          }}
        />
      )}
    </div>
  );
}

function ManagementCard({ member }: { member: TeamMember }) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 10,
        padding: "1.5rem 1rem",
        textAlign: "center",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <MemberAvatar photoUrl={member.photoUrl} name={member.title} />
      <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 6px" }}>
        {member.title}
      </h3>
      {member.memberRole && (
        <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{member.memberRole}</p>
      )}
      {member.linkedinUrl && (
        <a
          href={member.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginTop: 10, color: "#0a66c2", display: "inline-flex", alignItems: "center", gap: 4 }}
          aria-label={`${member.title} on LinkedIn`}
        >
          <LinkedInIcon style={{ width: 16, height: 16 }} />
        </a>
      )}
    </div>
  );
}

function AdvisoryCard({ member }: { member: TeamMember }) {
  const href = member.readMoreUrl ?? "#";
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 10,
        padding: "1.5rem 1rem",
        textAlign: "center",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <MemberAvatar photoUrl={member.photoUrl} name={member.title} />
      <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 14px" }}>
        {member.title}
      </h3>
      <a
        href={href}
        style={{
          display: "inline-block",
          backgroundColor: readMoreBrown,
          color: "white",
          borderRadius: 6,
          padding: "0.45rem 1.25rem",
          fontSize: 13,
          fontWeight: 600,
          textDecoration: "none",
          letterSpacing: "0.01em",
          transition: "opacity 0.2s",
        }}
        onMouseOver={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.85")}
        onMouseOut={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")}
      >
        Read More &gt;
      </a>
    </div>
  );
}

export default function ManagementTeamUI({ managementMembers, advisoryMembers }: Props) {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "white",
        color: "#111827",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <style>{`
        .team-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 640px) {
          .team-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1024px) {
          .team-grid { grid-template-columns: repeat(3, 1fr); }
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        @media (min-width: 640px) {
          .footer-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1024px) {
          .footer-grid { grid-template-columns: repeat(4, 1fr); }
        }
      `}</style>

      {/* ════ NAVBAR ════ */}
      <header
        style={{
          backgroundColor: navy,
          position: "sticky",
          top: 0,
          zIndex: 50,
          width: "100%",
        }}
      >
        <div
          style={{
            maxWidth: "80rem",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.75rem 1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: `2px solid ${gold}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Building2 style={{ width: 18, height: 18, color: gold }} />
            </div>
            <div>
              <p style={{ fontSize: 16, fontWeight: 700, color: "white", lineHeight: 1.2, letterSpacing: "0.02em" }}>
                ABA
              </p>
              <p style={{ fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "white", lineHeight: 1.2 }}>
                African Business Association
              </p>
              <p style={{ fontSize: 8, color: "#9ca3af", letterSpacing: "0.05em" }}>(Yorkshire &amp; UK)</p>
            </div>
          </div>
          <nav style={{ display: "flex", alignItems: "center", gap: "1.75rem" }}>
            {[
              { label: "Home", href: "/" },
              { label: "About", href: "/about" },
              { label: "Events", href: "/events" },
              { label: "Directory", href: "/directory" },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  color: "#d1d5db",
                  textDecoration: "none",
                }}
              >
                {label}
              </a>
            ))}
            <a
              href="/membership"
              style={{ textDecoration: "none" }}
            >
              <button
                style={{
                  backgroundColor: gold,
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  padding: "0.5rem 1.25rem",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                Become a Member
              </button>
            </a>
          </nav>
        </div>
      </header>

      {/* ════ MANAGEMENT TEAM HERO ════ */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          backgroundColor: navy,
          minHeight: 220,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background: "linear-gradient(to bottom, rgba(26,35,64,0.55) 0%, rgba(26,35,64,0.75) 100%)",
          }}
        />
        <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "4rem 1rem" }}>
          <h1
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 800,
              color: "white",
              letterSpacing: "0.02em",
            }}
          >
            Management Team
          </h1>
        </div>
      </section>

      {/* ════ MANAGEMENT GRID ════ */}
      <section style={{ padding: "3.5rem 0" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "0 1rem" }}>
          {managementMembers.length === 0 ? (
            <p style={{ textAlign: "center", color: "#6b7280" }}>No management team members found.</p>
          ) : (
            <div className="team-grid">
              {managementMembers.map((m) => (
                <ManagementCard key={m.id} member={m} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ════ ADVISORY BOARD HERO ════ */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#2d4a7a",
          minHeight: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background: "linear-gradient(to bottom, rgba(20,32,56,0.5) 0%, rgba(20,32,56,0.7) 100%)",
          }}
        />
        <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "4rem 1rem" }}>
          <h2
            style={{
              fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)",
              fontWeight: 800,
              color: "white",
              letterSpacing: "0.02em",
            }}
          >
            Advisory Board Members
          </h2>
        </div>
      </section>

      {/* ════ ADVISORY GRID ════ */}
      <section style={{ padding: "3.5rem 0" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "0 1rem" }}>
          {advisoryMembers.length === 0 ? (
            <p style={{ textAlign: "center", color: "#6b7280" }}>No advisory board members found.</p>
          ) : (
            <div className="team-grid">
              {advisoryMembers.map((m) => (
                <AdvisoryCard key={m.id} member={m} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ════ FOOTER ════ */}
      <footer style={{ backgroundColor: navy }}>
        <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "3rem 1rem 1.5rem" }}>
          <div
            style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "2rem" }}
          >
            <div className="footer-grid" style={{ textAlign: "left" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      border: `2px solid ${gold}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Building2 style={{ width: 16, height: 16, color: gold }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: "white", lineHeight: 1.2 }}>ABA</p>
                    <p style={{ fontSize: 8, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "white" }}>
                      African Business Association
                    </p>
                  </div>
                </div>
                <p style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.7, maxWidth: 260 }}>
                  1 Interchange Nelson Street<br />Bradford, BD1 3AX
                </p>
              </div>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: "white", marginBottom: 16 }}>Quick Links</h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {["Business Focus", "Event Gallery", "Careers", "Membership Registration", "Contact Us", "Webmail", "Admin"].map((l) => (
                    <li key={l} style={{ marginBottom: 8 }}>
                      <a href="#" style={{ fontSize: 14, color: "#9ca3af", textDecoration: "none" }}>{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: "white", marginBottom: 16 }}>Company</h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {["Home", "Bookings", "Directory", "My Account", "Events", "About Us", "Blog"].map((l) => (
                    <li key={l} style={{ marginBottom: 8 }}>
                      <a href="#" style={{ fontSize: 14, color: "#9ca3af", textDecoration: "none" }}>{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: "white", marginBottom: 16 }}>Socials</h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {[
                    { label: "Facebook", href: "#" },
                    { label: "Twitter (X)", href: "#" },
                    { label: "Instagram", href: "#" },
                    { label: "LinkedIn", href: "#" },
                  ].map(({ label, href }) => (
                    <li key={label} style={{ marginBottom: 8 }}>
                      <a href={href} style={{ fontSize: 14, color: "#9ca3af", textDecoration: "none" }}>{label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: 16,
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: 11, color: "#6b7280" }}>
              Copyright &copy; 2025 African Business Association, Yorkshire
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
