import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Copy,
  Trash2,
  BarChart3,
  Check,
  Pencil,
} from "lucide-react";
import { toggleStatus, deleteLink } from "../../api/linkApi";
import Loader from "../Loader/Loader";
import type { Link as LinkType } from "../../types";

interface LinkTableProps {
  links: LinkType[];
  loading: boolean;
  onRefresh: () => void;
  onEdit: (link: LinkType) => void;
}

function LinkTable({ links = [], loading, onRefresh, onEdit }: LinkTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleToggle = async (id: string) => {
    try {
      await toggleStatus(id);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLink(id);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopy = (shortCode: string) => {
    const url = `${window.location.origin}/api/redirect/${shortCode}`;
    navigator.clipboard.writeText(url);
    setCopiedId(shortCode);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) return <Loader />;

  if (!links.length) {
    return (
      <div className="text-center py-16 text-gray-400 text-sm">
        No links yet. Create your first one!
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left">
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-200">
                Title
              </th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-200">
                Original URL
              </th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-200">
                Short URL
              </th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-200">
                Clicks
              </th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-200">
                Status
              </th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-200">
                Created
              </th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-200 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {links.map((link) => {
              const isExpired =
                link.expiresAt && new Date(link.expiresAt) < new Date();
              return (
                <tr
                  key={link.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-5 py-3.5 text-sm font-semibold text-gray-800 max-w-[160px] truncate">
                    {link.title}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-gray-500 max-w-[200px] truncate">
                    <a
                      href={link.originalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-indigo-500 hover:underline"
                    >
                      {link.originalUrl}
                    </a>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5 font-mono text-xs text-indigo-500 font-medium">
                      <span>{link.shortCode}</span>
                      <button
                        onClick={() => handleCopy(link.shortCode)}
                        title="Copy short URL"
                        className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer border-none"
                      >
                        {copiedId === link.shortCode ? (
                          <Check size={14} className="text-green-500" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm">{link.clickCount || 0}</td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => handleToggle(link.id)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border-none cursor-pointer transition-opacity hover:opacity-80 ${
                        isExpired
                          ? "bg-red-100 text-red-600"
                          : link.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {isExpired ? "Expired" : link.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-gray-400 whitespace-nowrap">
                    {new Date(link.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to={`/analytics/${link.id}`}
                        className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                        title="Analytics"
                      >
                        <BarChart3 size={16} />
                      </Link>
                      <button
                        onClick={() => onEdit(link)}
                        className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-indigo-500 transition-colors cursor-pointer border-none"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(link.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer border-none"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LinkTable;
