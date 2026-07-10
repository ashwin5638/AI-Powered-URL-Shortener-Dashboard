import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  MousePointer,
  Calendar,
  CheckCircle2,
  XCircle,
  Hash,
  Clock,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { getLinkAnalytics } from "../../api/linkApi";
import Loader from "../../components/Loader/Loader";
import type { LinkAnalytics } from "../../types";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#3b82f6", "#a855a7"];

function Analytics() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<LinkAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        if (!id) return;
        const { data: res } = await getLinkAnalytics(id);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return <Loader />;

  if (!data) {
    return (
      <div className="text-center py-20 px-5">
        <h2 className="text-2xl font-bold mb-3">Link not found</h2>
        <Link
          to="/"
          className="text-indigo-500 font-medium hover:text-indigo-600"
        >
          &larr; Back to Dashboard
        </Link>
      </div>
    );
  }

  const { link, analytics } = data;
  const apiBase = import.meta.env.VITE_API_URL || "https://url-shortener-dashboard-backend.onrender.com";
  const shortUrl = `${apiBase}/redirect/${link.shortCode}`;
  const isExpired = link.expiresAt && new Date(link.expiresAt) < new Date();

  const clicksByDate = analytics.clicksByDate.map((c) => ({
    date: new Date(c.createdAt).toLocaleDateString(),
    clicks: c._count,
  }));

  const clicksByCountry = analytics.clicksByCountry.map((c) => ({
    name: c.country || "Unknown",
    value: c._count,
  }));

  const clicksByBrowser = analytics.clicksByBrowser.map((c) => ({
    name: c.browser || "Unknown",
    value: c._count,
  }));

  const clicksByDevice = (analytics.clicksByDevice || []).map((c) => ({
    name: c.device || "Unknown",
    value: c._count,
  }));

  const clicksByReferrer = (analytics.clicksByReferrer || []).map((c) => ({
    name: c.referrer || "Direct",
    value: c._count,
  }));

  const StatRow = ({
    icon: Icon,
    label,
    value,
    color,
  }: {
    icon: React.ComponentType<{ size?: number }>;
    label: string;
    value: string | number;
    color: string;
  }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${color}15`, color }}
      >
        <Icon size={20} />
      </div>
      <div>
        <div className="text-xs font-medium text-gray-500">{label}</div>
        <div className="text-lg font-bold text-gray-900">{value}</div>
      </div>
    </div>
  );

  const PieSection = ({
    title,
    data,
  }: {
    title: string;
    data: { name: string; value: number }[];
  }) => {
    if (!data.length) return null;
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-base font-bold mb-4">{title}</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, percent }: { name?: string; percent?: number }) =>
                `${name ?? "Unknown"} ${((percent ?? 0) * 100).toFixed(0)}%`
              }
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-gray-500 text-sm font-medium hover:text-gray-700 mb-6"
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <h1 className="text-3xl font-extrabold mb-1">{link.title}</h1>
      <p className="text-sm text-gray-500 break-all mb-4">{link.originalUrl}</p>

      <div className="flex items-center gap-2 bg-indigo-50 px-4 py-3 rounded-lg mb-8 text-sm">
        <span className="text-gray-600 font-medium">Short URL:</span>
        <a
          href={shortUrl}
          target="_blank"
          rel="noreferrer"
          className="text-indigo-500 font-semibold font-mono text-xs hover:underline"
        >
          {shortUrl}
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatRow
          icon={MousePointer}
          label="Total Clicks"
          value={analytics.totalClicks}
          color="#6366f1"
        />
        <StatRow
          icon={Calendar}
          label="Created"
          value={new Date(link.createdAt).toLocaleDateString()}
          color="#22c55e"
        />
        <StatRow
          icon={link.isActive ? CheckCircle2 : XCircle}
          label="Status"
          value={isExpired ? "Expired" : link.isActive ? "Active" : "Inactive"}
          color={isExpired ? "#ef4444" : link.isActive ? "#22c55e" : "#ef4444"}
        />
        <StatRow
          icon={Hash}
          label="Short Code"
          value={link.shortCode}
          color="#f59e0b"
        />
      </div>

      {link.expiresAt && (
        <div className="flex items-center gap-2 bg-amber-50 px-4 py-3 rounded-lg mb-8 text-sm">
          <Clock size={16} className="text-amber-500" />
          <span className="text-gray-600 font-medium">Expires:</span>
          <span className="text-gray-800">
            {new Date(link.expiresAt).toLocaleString()}
          </span>
        </div>
      )}

      {analytics.totalClicks > 0 && (
        <>
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
            <h3 className="text-base font-bold mb-4">Clicks Over Time</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={clicksByDate}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="clicks" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <PieSection title="By Country" data={clicksByCountry} />
            <PieSection title="By Browser" data={clicksByBrowser} />
            <PieSection title="By Device" data={clicksByDevice} />
            <PieSection title="Top Referrers" data={clicksByReferrer} />
          </div>
        </>
      )}

      {analytics.totalClicks === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm bg-white border border-gray-200 rounded-xl">
          No clicks recorded yet.
        </div>
      )}
    </div>
  );
}

export default Analytics;
