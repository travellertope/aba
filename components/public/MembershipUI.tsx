"use client";

import React from "react";
import {
  MapPin,
  Mail,
  Phone,
  Building2,
  Link,
  Share2,
  Globe,
  Check,
} from "lucide-react";

/* ─── colour tokens ─── */
const navy = "#1a2340";
const gold = "#d4a843";

/* ─── hero background ─── */
const HERO_BG = "data:image/webp;base64,UklGRm6rAABXRUJQVlA4WAoAAAAIAAAApwIAxQEA";

/* ─── dummy data ─── */
const navLinks = ["About", "Membership", "Events", "Directory"];
const quickLinks = ["About Us", "Membership", "Events", "News & Insights"];
const resources = ["Member Directory", "Business Resources", "Policy Papers", "Success Stories"];

const plans = [
  {
    name: "Professional",
    price: "£90",
    period: "/yr or £8/mo",
    description: "Perfect for emerging entrepreneurs and professionals",
    highlighted: false,
    features: [
      "Access to all networking events",
      "Monthly newsletter and insights",
      "Member directory access",
      "Discounted event tickets",
      "Professional development resources",
    ],
  },
  {
    name: "Executive",
    price: "£300",
    period: "/yr or £25/mo",
    description: "For established business owners and senior leaders",
    highlighted: true,
    badge: "Most Popular",
    features: [
      "Everything in Professional",
      "Priority event registration",
      "Quarterly executive roundtables",
      "One-on-one mentorship sessions",
      "Policy advisory board access",
      "Business spotlight opportunities",
    ],
  },
  {
    name: "Corporate",
    price: "£1000",
    period: "/year",
    description: "Tailored partnerships for organizations",
    highlighted: false,
    features: [
      "Everything in Executive",
      "Multiple team memberships",
      "Corporate sponsorship packages",
      "Speaking opportunities at events",
      "Custom partnership programs",
      "Brand visibility across platforms",
    ],
  },
];

const benefits = [
  {
    title: "Business Networking",
    description: "Connect with like-minded African business owners, forge valuable partnerships, and access new opportunities through our networking events designed to foster collaboration.",
  },
  {
    title: "Forum Events",
    description: "Engage in insightful discussions, gain valuable industry insights, and expand your network at our forum events where entrepreneurs share knowledge.",
  },
];

/* ─── component ─── */
export default function MembershipUI() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "white", color: "#111827", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <style>{`
        .grid-3-col {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 768px) {
          .grid-3-col {
            grid-template-columns: repeat(3, 1fr);
            align-items: start;
          }
        }
        .grid-4-col {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        @media (min-width: 640px) {
          .grid-4-col {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .grid-4-col {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        .plan-card {
          border-radius: 14px;
          padding: 2rem 1.5rem;
          display: flex;
          flex-direction: column;
        }
        .plan-card-default {
          background: white;
          border: 1px solid #e5e7eb;
        }
        .plan-card-highlighted {
          background: #1a2340;
          color: white;
          box-shadow: 0 20px 50px rgba(26,35,64,0.3);
          position: relative;
          z-index: 2;
          transform: scale(1.04);
        }
        .get-started-btn {
          display: block;
          width: 100%;
          border-radius: 8px;
          padding: 0.75rem;
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          text-align: center;
          cursor: pointer;
          border: none;
          transition: opacity 0.2s;
        }
        .get-started-btn:hover { opacity: 0.9; }
        .benefit-card {
          border-left: 4px solid #d4a843;
          background: #f9fafb;
          border-radius: 0 10px 10px 0;
          padding: 1.5rem 1.75rem;
        }
      `}</style>

      {/* ════════════ NAVBAR ════════════ */}
      <header style={{ backgroundColor: navy, position: "sticky", top: 0, zIndex: 50, width: "100%" }}>
        <div style={{ maxWidth: "80rem", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", border: `2px solid ${gold}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Building2 style={{ width: 18, height: 18, color: gold }} />
            </div>
            <div>
              <p style={{ fontSize: 16, fontWeight: 700, color: "white", lineHeight: 1.2, letterSpacing: "0.02em" }}>ABA</p>
              <p style={{ fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "white", lineHeight: 1.2 }}>African Business Association</p>
              <p style={{ fontSize: 8, color: "#9ca3af", letterSpacing: "0.05em" }}>(Yorkshire & UK)</p>
            </div>
          </div>
          <nav style={{ display: "flex", alignItems: "center", gap: "1.75rem" }}>
            {navLinks.map((l) => (
              <a key={l} href="#" style={{ fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: l === "Membership" ? gold : "#d1d5db", textDecoration: "none" }}>{l}</a>
            ))}
            <span style={{ fontSize: 12, color: "#9ca3af", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.03em" }}>Member Portal Login</span>
            <button style={{ backgroundColor: gold, color: "white", border: "none", borderRadius: 6, padding: "0.5rem 1.25rem", fontSize: 12, fontWeight: 700, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.04em" }}>Become a Member</button>
          </nav>
        </div>
      </header>

      {/* ════════════ HERO BANNER ════════════ */}
      <section style={{ position: "relative", overflow: "hidden", backgroundColor: navy }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0, backgroundImage: `url(${HERO_BG})`, backgroundSize: "cover", backgroundPosition: "center top" }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(to bottom, rgba(26,35,64,0.7) 0%, rgba(26,35,64,0.85) 100%)" }} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: "80rem", margin: "0 auto", padding: "4.5rem 1rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.02em", color: "white" }}>Join Our Community</h1>
          <p style={{ marginTop: 12, fontSize: 16, color: "rgba(255,255,255,0.85)" }}>Become part of a thriving network of business leaders and entrepreneurs.</p>
        </div>
      </section>

      {/* ════════════ MEMBERSHIP OPTIONS ════════════ */}
      <section style={{ padding: "4rem 0 3rem", backgroundColor: "white" }}>
        <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1rem", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 700, color: navy }}>Membership Options</h2>
          <p style={{ marginTop: 12, fontSize: 15, color: "#6b7280", maxWidth: "34rem", marginLeft: "auto", marginRight: "auto" }}>
            Choose the membership level that aligns with your ambitions and unlock exclusive opportunities.
          </p>

          <div className="grid-3-col" style={{ marginTop: "2.5rem" }}>
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`plan-card ${plan.highlighted ? "plan-card-highlighted" : "plan-card-default"}`}
              >
                {plan.badge && (
                  <div style={{ textAlign: "center", marginBottom: 16 }}>
                    <span style={{
                      display: "inline-block",
                      backgroundColor: gold, color: "white",
                      fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
                      padding: "0.3rem 0.75rem", borderRadius: 4,
                    }}>
                      {plan.badge}
                    </span>
                  </div>
                )}

                <h3 style={{ fontSize: 22, fontWeight: 700, color: plan.highlighted ? "white" : navy, textAlign: "left" }}>
                  {plan.name}
                </h3>

                <div style={{ marginTop: 8, textAlign: "left", display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{ fontSize: 36, fontWeight: 800, color: plan.highlighted ? "white" : navy }}>
                    {plan.price}
                  </span>
                  <span style={{ fontSize: 13, color: plan.highlighted ? "#d1d5db" : "#9ca3af" }}>
                    {plan.period}
                  </span>
                </div>

                <p style={{ marginTop: 8, fontSize: 14, color: plan.highlighted ? "#d1d5db" : "#6b7280", textAlign: "left" }}>
                  {plan.description}
                </p>

                <button
                  className="get-started-btn"
                  style={{
                    marginTop: 20,
                    backgroundColor: plan.highlighted ? gold : navy,
                    color: "white",
                  }}
                >
                  Get Started
                </button>

                <ul style={{ marginTop: 20, padding: 0, listStyle: "none", textAlign: "left" }}>
                  {plan.features.map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12, fontSize: 14 }}>
                      <Check style={{ width: 16, height: 16, color: gold, flexShrink: 0, marginTop: 2 }} />
                      <span style={{
                        color: plan.highlighted ? "#e5e7eb" : "#4b5563",
                        fontWeight: plan.highlighted ? 600 : 400,
                      }}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ WHY BECOME A MEMBER ════════════ */}
      <section style={{ padding: "4rem 0", backgroundColor: "#f9fafb" }}>
        <div style={{ maxWidth: "48rem", margin: "0 auto", padding: "0 1.5rem", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 1.875rem)", fontWeight: 700, color: navy, marginBottom: 32 }}>Why Become a Member?</h2>
          <div style={{ margin: "0.5rem auto 2rem", height: 4, width: 64, borderRadius: 4, backgroundColor: gold }} />

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", textAlign: "left" }}>
            {benefits.map((b) => (
              <div key={b.title} className="benefit-card">
                <h3 style={{ fontSize: 18, fontWeight: 700, color: gold, marginBottom: 10 }}>{b.title}</h3>
                <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.7 }}>{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ NEWSLETTER ════════════ */}
      <section style={{ padding: "4rem 0", backgroundColor: "#f9fafb" }}>
        <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1rem", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.625rem)", fontWeight: 700, color: navy }}>Stay Connected to the Diaspora Economy</h2>
          <p style={{ marginTop: 8, fontSize: 14, color: "#4b5563" }}>Get monthly insights, funding alerts, and event invites.</p>
          <div style={{ maxWidth: 448, margin: "1.5rem auto 0", display: "flex", gap: 8 }}>
            <input type="email" placeholder="Enter your email address" style={{ flex: 1, borderRadius: 6, border: "1px solid #d1d5db", padding: "0.625rem 1rem", fontSize: 14, outline: "none" }} />
            <button style={{ backgroundColor: gold, color: "white", border: "none", borderRadius: 6, padding: "0.625rem 1.5rem", fontSize: 13, fontWeight: 700, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.04em" }}>Subscribe</button>
          </div>
        </div>
      </section>

      {/* ════════════ FOOTER ════════════ */}
      <footer style={{ backgroundColor: navy }}>
        <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "3rem 1rem 1.5rem" }}>
          <div style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "2rem" }}>
            <div className="grid-4-col" style={{ textAlign: "left" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", border: `2px solid ${gold}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Building2 style={{ width: 16, height: 16, color: gold }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: "white", lineHeight: 1.2 }}>ABA</p>
                    <p style={{ fontSize: 8, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "white" }}>African Business Association</p>
                  </div>
                </div>
                <p style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.7, maxWidth: 260 }}>Empowering African business leaders through strategic connections, policy influence, and professional excellence.</p>
              </div>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: "white", marginBottom: 16 }}>Quick Links</h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {quickLinks.map((l) => (<li key={l} style={{ marginBottom: 8 }}><a href="#" style={{ fontSize: 14, color: "#9ca3af", textDecoration: "none" }}>{l}</a></li>))}
                </ul>
              </div>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: "white", marginBottom: 16 }}>Resources</h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {resources.map((r) => (<li key={r} style={{ marginBottom: 8 }}><a href="#" style={{ fontSize: 14, color: "#9ca3af", textDecoration: "none" }}>{r}</a></li>))}
                </ul>
              </div>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: "white", marginBottom: 16 }}>Contact</h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: 14, color: "#9ca3af" }}>
                  <li style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
                    <MapPin style={{ width: 16, height: 16, color: gold, flexShrink: 0, marginTop: 2 }} />
                    <span>Bradford City Centre<br />West Yorkshire, UK</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <Mail style={{ width: 16, height: 16, color: gold, flexShrink: 0 }} />
                    <span>info@aba-bradford.org</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Phone style={{ width: 16, height: 16, color: gold, flexShrink: 0 }} />
                    <span>+44 1274 XXXXXX</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <p style={{ fontSize: 11, color: "#6b7280" }}>&copy; 2025 African Business Association. All rights reserved. | Powered by MaineStream Consulting.</p>
            <div style={{ display: "flex", gap: 16 }}>
              <Link style={{ width: 18, height: 18, color: "#6b7280", cursor: "pointer" }} />
              <Share2 style={{ width: 18, height: 18, color: "#6b7280", cursor: "pointer" }} />
              <Globe style={{ width: 18, height: 18, color: "#6b7280", cursor: "pointer" }} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
