import { useState } from "react";
import { useLocation } from "wouter";

interface AdminLoginProps {
  onLogin: (secret: string) => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  const [, navigate] = useLocation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!secret.trim()) return;
    setChecking(true);
    setError("");
    try {
      const res = await fetch("/api/admin/articles", {
        headers: { "x-admin-secret": secret },
      });
      if (res.ok) {
        onLogin(secret);
        navigate("/admin/articles");
      } else {
        setError("Incorrect password. Please try again.");
      }
    } catch {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setChecking(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "linear-gradient(160deg, #F2EDE3 0%, #F6F4EF 60%, #EEE9DF 100%)" }}
    >
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <div className="w-7 h-px mb-5" style={{ background: "#C9A96E" }} />
          <p className="text-[10px] font-semibold tracking-[0.20em] uppercase text-accent/70 mb-3">
            Admin
          </p>
          <h1 className="font-serif text-2xl text-primary mb-1">
            Article Management
          </h1>
          <p className="text-sm text-muted-foreground font-light">
            Enter your admin password to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Admin password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            className="w-full h-11 px-4 text-sm border border-border/60 bg-white/80 text-primary placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 rounded"
            autoFocus
          />

          {error && (
            <p className="text-sm text-red-600 font-light">{error}</p>
          )}

          <button
            type="submit"
            disabled={checking || !secret.trim()}
            className="h-11 px-6 text-sm font-medium text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-opacity duration-200 hover:opacity-90"
            style={{ background: "#162B3B" }}
          >
            {checking ? "Checking…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
