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
  Calendar,
  Users,
  ArrowRight,
} from "lucide-react";

/* ─── colour tokens ─── */
const navy = "#1a2340";
const gold = "#d4a843";
const goldLight = "#f5e6c0";

/* ─── hero background ─── */
const HERO_BG = "data:image/webp;base64,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";

/* ─── dummy data ─── */
const navLinks = ["About", "Membership", "Events", "Directory"];
const quickLinks = ["About Us", "Membership", "Events", "News & Insights"];
const resources = ["Member Directory", "Business Resources", "Policy Papers", "Success Stories"];

const events = [
  {
    title: "Annual Gala Night",
    date: "March 15, 2026",
    location: "Bradford City Hall",
    capacity: "250+ Expected",
    memberPrice: "£25",
    nonMemberPrice: "£50",
    featured: true,
    gradient: "linear-gradient(135deg, #1a2340 0%, #2d4a7a 60%, #d4a843 100%)",
  },
  {
    title: "Quarterly Business Breakfast",
    date: "February 8, 2025",
    location: "University of Bradford",
    capacity: "80+ Expected",
    memberPrice: "Free",
    nonMemberPrice: "£15",
    featured: false,
    gradient: "linear-gradient(135deg, #2d4a7a 0%, #1a2340 100%)",
  },
  {
    title: "Leadership Masterclass",
    date: "February 22, 2025",
    location: "Online Webinar",
    capacity: "150+ Expected",
    memberPrice: "£10",
    nonMemberPrice: "£25",
    featured: false,
    gradient: "linear-gradient(135deg, #1a2340 0%, #3a5a8a 100%)",
  },
];

/* ─── component ─── */
export default function EventsUI() {
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
        .event-card {
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: box-shadow 0.2s;
        }
        .event-card:hover {
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        }
        .book-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          width: 100%;
          border: none;
          border-radius: 8px;
          padding: 0.7rem;
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .book-btn:hover { opacity: 0.9; }
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
              <a key={l} href="#" style={{ fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: l === "Events" ? gold : "#d1d5db", textDecoration: "none" }}>{l}</a>
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
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.02em", color: "white" }}>Events &amp; Forums</h1>
          <p style={{ marginTop: 12, fontSize: 16, color: "rgba(255,255,255,0.85)" }}>Connect, Learn, and Grow at our exclusive gatherings.</p>
        </div>
      </section>

      {/* ════════════ UPCOMING EVENTS ════════════ */}
      <section style={{ padding: "4rem 0 3rem", backgroundColor: "white" }}>
        <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1rem", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: navy }}>Upcoming Opportunities to Connect</h2>
          <p style={{ marginTop: 10, fontSize: 15, color: "#6b7280" }}>Experience the value of membership firsthand. Members save on every event.</p>

          <div className="grid-3-col" style={{ marginTop: "2.5rem", textAlign: "left" }}>
            {events.map((e) => (
              <div key={e.title} className="event-card">
                {/* image area */}
                <div style={{ position: "relative", height: 200, background: e.gradient }}>
                  {e.featured && (
                    <span style={{
                      position: "absolute", top: 12, right: 12,
                      backgroundColor: gold, color: "white",
                      fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
                      padding: "0.25rem 0.65rem", borderRadius: 4,
                    }}>
                      Featured Event
                    </span>
                  )}
                </div>

                {/* content */}
                <div style={{ padding: "1.25rem 1.25rem 1.5rem", display: "flex", flexDirection: "column", flex: 1 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: navy, marginBottom: 14 }}>{e.title}</h3>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Calendar style={{ width: 15, height: 15, color: "#9ca3af", flexShrink: 0 }} />
                      <span style={{ fontSize: 14, color: "#4b5563" }}>{e.date}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <MapPin style={{ width: 15, height: 15, color: "#9ca3af", flexShrink: 0 }} />
                      <span style={{ fontSize: 14, color: "#4b5563" }}>{e.location}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Users style={{ width: 15, height: 15, color: "#9ca3af", flexShrink: 0 }} />
                      <span style={{ fontSize: 14, color: "#4b5563" }}>{e.capacity}</span>
                    </div>
                  </div>

                  {/* pricing + CTA */}
                  <div style={{ marginTop: "auto", paddingTop: 20 }}>
                    <p style={{
                      border: `1px solid #e5e7eb`, borderRadius: 8,
                      padding: "0.5rem", textAlign: "center",
                      fontSize: 12, fontWeight: 600, color: "#374151",
                      marginBottom: 10,
                    }}>
                      Members: {e.memberPrice} | Non-Members: {e.nonMemberPrice}
                    </p>
                    <button className="book-btn" style={{ backgroundColor: gold, color: "white" }}>
                      Book Now <ArrowRight style={{ width: 14, height: 14 }} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* view all events */}
          <button style={{
            marginTop: 40, border: `2px solid ${navy}`, background: "transparent", color: navy,
            borderRadius: 6, padding: "0.75rem 2rem", fontSize: 13, fontWeight: 700, cursor: "pointer",
            textTransform: "uppercase", letterSpacing: "0.05em",
          }}>
            View All Events
          </button>
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
