import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, LockKeyhole } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { formatApiErrorDetail } from "../lib/api";
import { Logo } from "../components/Navbar";

const inputCls =
  "w-full border border-ink/15 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/35 outline-none transition-[border-color,box-shadow] duration-300 focus:border-palm focus:ring-1 focus:ring-palm";

export default function AdminLogin() {
  const { token, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (token) return <Navigate to="/admin" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/admin");
    } catch (err) {
      setError(formatApiErrorDetail(err.response?.data?.detail) || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="admin-login-page" className="grid min-h-screen place-items-center bg-bone px-5">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <form onSubmit={submit} className="border border-ink/10 bg-white p-8 shadow-[0_8px_32px_rgba(11,59,36,0.06)] md:p-10">
          <span className="grid h-12 w-12 place-items-center bg-palm text-palm-100">
            <LockKeyhole className="h-5 w-5" strokeWidth={1.8} />
          </span>
          <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-palm">Manager Login</h1>
          <p className="mt-2 text-sm text-ink/55">Restricted to Transocean EXIM management.</p>

          <div className="mt-8 space-y-5">
            <div>
              <label htmlFor="admin-email" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">Email</label>
              <input id="admin-email" data-testid="admin-email-input" type="email" required className={inputCls} placeholder="admin@transoceanexim.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label htmlFor="admin-password" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">Password</label>
              <input id="admin-password" data-testid="admin-password-input" type="password" required className={inputCls} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>

          {error && (
            <p data-testid="admin-login-error" className="mt-4 border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>
          )}

          <button
            type="submit"
            data-testid="admin-login-submit"
            disabled={loading}
            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-palm px-8 py-3.5 text-sm font-semibold text-white transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-palm-800 disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
        <Link to="/" data-testid="back-to-site-link" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink/60 transition-colors duration-300 hover:text-palm">
          <ArrowLeft className="h-4 w-4" /> Back to website
        </Link>
      </div>
    </div>
  );
}
