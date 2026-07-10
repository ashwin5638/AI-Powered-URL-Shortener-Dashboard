import { LinkIcon, Plus } from "lucide-react";

interface NavbarProps {
  onCreateClick: () => void;
}

function Navbar({ onCreateClick }: NavbarProps) {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-xl font-bold text-gray-900">
          <LinkIcon size={24} className="text-indigo-500" />
          <span>URL Shortener</span>
        </div>
        <button
          onClick={onCreateClick}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-indigo-500 text-white rounded-lg text-sm font-semibold hover:bg-indigo-600 transition-colors cursor-pointer border-none"
        >
          <Plus size={18} />
          Create Link
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
