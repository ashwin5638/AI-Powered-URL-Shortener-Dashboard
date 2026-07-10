import { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import Navbar from "../../components/Navbar/Navbar";
import DashboardCards from "../../components/DashboardCards/DashboardCards";
import LinkTable from "../../components/LinkTable/LinkTable";
import CreateLinkModal from "../../components/CreateLinkModal/CreateLinkModal";
import { getLinks } from "../../api/linkApi";
import type { Link } from "../../types";

function Dashboard() {
  const [links, setLinks] = useState<Link[]>([]);
  const [allLinks, setAllLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editLink, setEditLink] = useState<Link | null>(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const fetchLinks = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getLinks({ page, limit, search: search || undefined });
      setLinks(data.data ?? []);
      setTotalPages(data.totalPages ?? 1);
      setTotal(data.total ?? 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  const fetchAllLinks = useCallback(async () => {
    try {
      const { data } = await getLinks({ limit: 1000 });
      setAllLinks(data.data ?? []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  useEffect(() => {
    fetchAllLinks();
  }, [fetchAllLinks]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const handleCreated = () => {
    fetchLinks();
    fetchAllLinks();
  };

  const handleUpdated = () => {
    fetchLinks();
    fetchAllLinks();
    setEditLink(null);
  };

  const handleEdit = (link: Link) => {
    setEditLink(link);
  };

  return (
    <>
      <Navbar onCreateClick={() => setModalOpen(true)} />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <DashboardCards links={allLinks} />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div className="relative w-full sm:w-80">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by title, URL, or alias..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-3 focus:ring-indigo-50 transition-colors"
            />
          </div>
          <span className="text-xs text-gray-400 whitespace-nowrap">
            {total} total
          </span>
        </div>

        <LinkTable
          links={links}
          loading={loading}
          onRefresh={fetchLinks}
          onEdit={handleEdit}
        />

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2
              )
              .reduce<(number | "...")[]>((acc, p, i, arr) => {
                if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "..." ? (
                  <span key={`dots-${i}`} className="text-gray-400 text-xs px-1">
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    className={`px-3 py-1.5 text-xs font-medium border rounded-lg cursor-pointer transition-colors ${
                      page === p
                        ? "bg-indigo-500 text-white border-indigo-500"
                        : "border-gray-300 bg-white hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {modalOpen && (
        <CreateLinkModal
          onClose={() => setModalOpen(false)}
          onCreated={handleCreated}
        />
      )}
      {editLink && (
        <CreateLinkModal
          onClose={() => setEditLink(null)}
          onCreated={handleCreated}
          onUpdated={handleUpdated}
          editLink={editLink}
        />
      )}
    </>
  );
}

export default Dashboard;
