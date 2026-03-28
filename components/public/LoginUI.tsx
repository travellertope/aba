"use client";

import React from "react";
import { Building2 } from "lucide-react";

/* ─── colour tokens ─── */
const navy = "#1a2340";
const gold = "#d4a843";

/* ─── component ─── */
export default function LoginUI() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: navy,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* ─── logo ─── */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: `2px solid ${gold}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Building2 style={{ width: 22, height: 22, color: gold }} />
        </div>
        <span
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: gold,
            letterSpacing: "0.12em",
          }}
        >
          ABA
        </span>
      </div>

      {/* ─── heading ─── */}
      <h1
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: "white",
          marginBottom: 6,
        }}
      >
        Member Portal
      </h1>
      <p style={{ fontSize: 14, color: "#9ca3af", marginBottom: 32 }}>
        Access your membership dashboard
      </p>

      {/* ─── login card ─── */}
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          backgroundColor: "white",
          borderRadius: 16,
          padding: "2rem 2rem 1.75rem",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        {/* email field */}
        <label
          style={{
            display: "block",
            fontSize: 14,
            fontWeight: 600,
            color: "#111827",
            marginBottom: 6,
          }}
        >
          Email Address
        </label>
        <input
          type="email"
          placeholder="your.email@example.com"
          style={{
            width: "100%",
            borderRadius: 8,
            border: "1px solid #d1d5db",
            padding: "0.75rem 1rem",
            fontSize: 14,
            color: "#374151",
            outline: "none",
            boxSizing: "border-box",
            marginBottom: 20,
          }}
        />

        {/* password field */}
        <label
          style={{
            display: "block",
            fontSize: 14,
            fontWeight: 600,
            color: "#111827",
            marginBottom: 6,
          }}
        >
          Password
        </label>
        <input
          type="password"
          placeholder="Enter your password"
          style={{
            width: "100%",
            borderRadius: 8,
            border: "1px solid #d1d5db",
            padding: "0.75rem 1rem",
            fontSize: 14,
            color: "#374151",
            outline: "none",
            boxSizing: "border-box",
            marginBottom: 16,
          }}
        />

        {/* remember me + forgot password */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 14,
              color: "#374151",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              style={{ width: 16, height: 16, accentColor: gold, cursor: "pointer" }}
            />
            Remember me
          </label>
          <a
            href="#"
            style={{
              fontSize: 14,
              color: gold,
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Forgot password?
          </a>
        </div>

        {/* sign in button */}
        <button
          style={{
            width: "100%",
            backgroundColor: gold,
            color: "white",
            border: "none",
            borderRadius: 8,
            padding: "0.85rem",
            fontSize: 15,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            cursor: "pointer",
          }}
        >
          Sign In
        </button>

        {/* divider */}
        <div
          style={{
            height: 1,
            backgroundColor: "#e5e7eb",
            margin: "1.5rem 0",
          }}
        />

        {/* join link */}
        <p style={{ textAlign: "center", fontSize: 14, color: "#6b7280" }}>
          Not a member yet?{" "}
          <a
            href="/membership"
            style={{
              color: gold,
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Join ABA
          </a>
        </p>
      </div>
    </div>
  );
}
