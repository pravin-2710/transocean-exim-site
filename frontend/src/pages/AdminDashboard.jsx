import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Download, Inbox, Loader2, LogOut, Search, TrendingUp, Users, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { api, formatApiErrorDetail } from "../lib/api";
import { Logo } from "../components/Navbar";
import { LEAD_STATUSES, PRODUCTS } from "../data/site";

const STATUS_STYLES = {
  New: "bg-camel/20 text-cocoa",
  Contacted: "bg-palm-100 text-palm",
  Quoted: "bg-sand text-cocoa",
  Negotiation: "bg-amber-100 text-amber-800",
  Won: "bg-palm text-white",
  Closed: "bg-ink/10 text-ink/60",
};

const selectCls =
  "border border-ink/15 bg-white px-3 py-2.5 text-sm text-ink outline-none transition-[border-color] duration-300 focus:border-palm";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [product, setProduct] = useState("All");
  const [exporting, setExporting] = useState(false);

  const loadStats = useCallback(() => {
    api.get("/admin/stats").then((r) => setStats(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      api
        .get("/admin/leads", { params: { status, product, search: search || undefined } })
        .then((r) => setLeads(r.data.leads))
        .catch((err) => toast.error(formatApiErrorDetail(err.response?.data?.detail)))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(t);
  }, [status, product, search]);

  useEffect(loadStats, [loadStats]);

  const updateStatus = async (id, newStatus) => {
    try {
      const { data } = await api.patch(`/admin/leads/${id}`, { status: newStatus });
      setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status: data.status } : l)));
      toast.success(`Status updated to ${newStatus}`);
      loadStats();
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail));
    }
  };

  const exportCsv = async () => {
    setExporting(true);
    try {
      const res = await api.get("/admin/leads/export", { responseType: "blob" });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `transocean-leads-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("CSV exported");
    } catch {
      toast.error("Export failed");
    } finally {
      setExporting(false);
    }
  };

  const statCards = [
    { icon: Users, label: "Total Leads", value: stats?.total ?? "—", testid: "stat-total" },
    { icon: Inbox, label: "New Enquiries", value: stats?.by_status?.New ?? "—", testid: "stat-new" },
    { icon: TrendingUp, label: "Last 7 Days", value: stats?.last_7_days ?? "—", testid: "stat-week" },
    { icon: CheckCircle2, label: "Won", value: stats?.by_status?.Won ?? "—", testid: "stat-won" },
  ];

  return (
    <div data-testid="admin-dashboard" className="min-h-screen bg-bone">
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-5 md:px-8">
          <Logo />
          <div className="flex items-center gap-4">
            <span data-testid="admin-user-email" className="hidden text-sm text-ink/60 sm:block">{user?.email}</span>
            <button
              onClick={logout}
              data-testid="admin-logout-btn"
              className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-sm font-medium text-ink/70 transition-[background-color,color] duration-300 hover:bg-palm hover:text-white"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-5 py-10 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-cocoa">Lead Management</p>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-palm">Enquiry Dashboard</h1>
          </div>
          <button
            onClick={exportCsv}
            data-testid="export-csv-btn"
            disabled={exporting}
            className="inline-flex items-center gap-2 rounded-full bg-palm px-6 py-3 text-sm font-semibold text-white transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-palm-800 disabled:opacity-60"
          >
            {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Export CSV
          </button>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-px border border-ink/10 bg-ink/10 lg:grid-cols-4">
          {statCards.map((s) => (
            <div key={s.label} data-testid={s.testid} className="bg-white p-6">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.18em] text-ink/45">{s.label}</p>
                <s.icon className="h-4 w-4 text-camel" strokeWidth={1.8} />
              </div>
              <p className="mt-3 font-display text-4xl font-black tracking-tight text-palm">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
            <input
              data-testid="leads-search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, company, email or country…"
              className="w-full border border-ink/15 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-[border-color] duration-300 focus:border-palm"
            />
          </div>
          <select data-testid="filter-status-select" value={status} onChange={(e) => setStatus(e.target.value)} className={selectCls}>
            <option value="All">All Statuses</option>
            {LEAD_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select data-testid="filter-product-select" value={product} onChange={(e) => setProduct(e.target.value)} className={selectCls}>
            <option value="All">All Products</option>
            {PRODUCTS.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
          </select>
        </div>

        <div className="mt-6 overflow-x-auto border border-ink/10 bg-white" data-testid="leads-table-wrapper">
          {loading ? (
            <div className="grid place-items-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-palm" />
            </div>
          ) : leads.length === 0 ? (
            <div className="grid place-items-center py-24 text-center" data-testid="leads-empty-state">
              <Inbox className="h-10 w-10 text-ink/20" strokeWidth={1.4} />
              <p className="mt-4 font-display text-xl font-bold text-ink/70">No leads found</p>
              <p className="mt-1 text-sm text-ink/45">Try widening your filters, or wait for the next enquiry.</p>
            </div>
          ) : (
            <table className="w-full min-w-[1080px] border-collapse text-left text-sm" data-testid="leads-table">
              <thead>
                <tr className="border-b border-ink/10 bg-palm-50 text-xs uppercase tracking-[0.14em] text-ink/55">
                  <th className="px-5 py-3.5 font-semibold">Submitted</th>
                  <th className="px-5 py-3.5 font-semibold">Contact</th>
                  <th className="px-5 py-3.5 font-semibold">Country</th>
                  <th className="px-5 py-3.5 font-semibold">Products</th>
                  <th className="px-5 py-3.5 font-semibold">Volume</th>
                  <th className="px-5 py-3.5 font-semibold">Message</th>
                  <th className="px-5 py-3.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10">
                {leads.map((l) => (
                  <tr key={l.id} data-testid={`lead-row-${l.id}`} className="transition-colors duration-200 hover:bg-bone/70">
                    <td className="whitespace-nowrap px-5 py-4 text-ink/55">
                      {new Date(l.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-ink">{l.full_name}</p>
                      <p className="text-xs text-ink/55">{l.company_name}</p>
                      <p className="mt-1 text-xs text-ink/45">{l.email}</p>
                      <p className="text-xs text-ink/45">{l.country_code} {l.phone}</p>
                    </td>
                    <td className="px-5 py-4 text-ink/70">{l.country}</td>
                    <td className="px-5 py-4">
                      <div className="flex max-w-[220px] flex-wrap gap-1.5">
                        {l.products.map((p) => (
                          <span key={p} className="bg-palm-100 px-2 py-0.5 text-xs font-medium text-palm">{p.replace(" Coconut", "")}</span>
                        ))}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-ink/70">{l.volume}</td>
                    <td className="max-w-[220px] truncate px-5 py-4 text-ink/55" title={l.message}>{l.message || "—"}</td>
                    <td className="px-5 py-4">
                      <select
                        data-testid={`lead-status-${l.id}`}
                        value={l.status}
                        onChange={(e) => updateStatus(l.id, e.target.value)}
                        className={`cursor-pointer rounded-full border-0 px-3 py-1.5 text-xs font-semibold outline-none ${STATUS_STYLES[l.status] || "bg-ink/10 text-ink/60"}`}
                      >
                        {LEAD_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <p className="mt-4 text-xs text-ink/40" data-testid="leads-count">{leads.length} lead{leads.length === 1 ? "" : "s"} shown</p>
      </main>
    </div>
  );
}
