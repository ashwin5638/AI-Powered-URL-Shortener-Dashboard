import { useState, useEffect } from "react";
import { X, Sparkles } from "lucide-react";
import { createLink, updateLink, generateSuggestion } from "../../api/linkApi";
import type { Link } from "../../types";

interface CreateLinkModalProps {
  onClose: () => void;
  onCreated: (link: Link) => void;
  onUpdated?: (link: Link) => void;
  editLink?: Link | null;
}

function CreateLinkModal({
  onClose,
  onCreated,
  onUpdated,
  editLink,
}: CreateLinkModalProps) {
  const isEditing = !!editLink;

  const [title, setTitle] = useState("");
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [suggesting, setSuggesting] = useState(false);

  useEffect(() => {
    if (editLink) {
      setTitle(editLink.title);
      setOriginalUrl(editLink.originalUrl);
      setCustomAlias(editLink.shortCode);
      if (editLink.expiresAt) {
        const d = new Date(editLink.expiresAt);
        setExpiresAt(d.toISOString().slice(0, 16));
      }
    }
  }, [editLink]);

  const handleSuggest = async () => {
    if (!originalUrl.trim()) {
      setError("Enter a URL first to generate a suggestion");
      return;
    }
    setSuggesting(true);
    setError("");
    try {
      const { data } = await generateSuggestion({
        title,
        url: originalUrl,
      });
      if (data.data) {
        setCustomAlias(data.data);
      } else {
        setError("Could not generate suggestion. Try manually.");
      }
    } catch {
      setError("AI suggestion failed. Enter alias manually.");
    } finally {
      setSuggesting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !originalUrl.trim()) {
      setError("Title and Original URL are required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      if (isEditing) {
        const { data } = await updateLink(editLink!.id, {
          title: title.trim(),
          originalUrl: originalUrl.trim(),
          customAlias: customAlias.trim() || undefined,
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
        });
        onUpdated?.(data.data);
      } else {
        const { data } = await createLink({
          title: title.trim(),
          originalUrl: originalUrl.trim(),
          customAlias: customAlias.trim() || undefined,
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
        });
        onCreated(data.data);
      }
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md p-7 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">
            {isEditing ? "Edit Short Link" : "Create Short Link"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer border-none bg-transparent"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Title
            </label>
            <input
              type="text"
              placeholder="e.g. My Link"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-3 focus:ring-indigo-50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Original URL
            </label>
            <input
              type="url"
              placeholder="https://example.com"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-3 focus:ring-indigo-50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Custom Alias{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="my-custom-alias"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                className="flex-1 px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-3 focus:ring-indigo-50 transition-colors"
              />
              {!isEditing && (
                <button
                  type="button"
                  onClick={handleSuggest}
                  disabled={suggesting}
                  className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg text-xs font-semibold hover:from-purple-600 hover:to-indigo-600 transition-colors disabled:opacity-60 cursor-pointer border-none shrink-0"
                >
                  <Sparkles size={14} />
                  {suggesting ? "..." : "AI"}
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Expiry Date{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-3 focus:ring-indigo-50 transition-colors"
            />
          </div>
          {error && (
            <div className="bg-red-50 text-red-500 text-xs px-3.5 py-2.5 rounded-lg">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-500 text-white rounded-lg text-sm font-semibold hover:bg-indigo-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer border-none mt-1"
          >
            {loading
              ? isEditing
                ? "Updating..."
                : "Creating..."
              : isEditing
                ? "Update"
                : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateLinkModal;
