import { LinkIcon, CheckCircle2, BarChart3, Clock } from "lucide-react";
import type { Link } from "../../types";

interface DashboardCardsProps {
  links: Link[];
}

function DashboardCards({ links = [] }: DashboardCardsProps) {
  const total = links.length;
  const active = links.filter((l) => l.isActive).length;
  const clicks = links.reduce((sum, l) => sum + (l.clickCount || 0), 0);
  const expired = links.filter(
    (l) => l.expiresAt && new Date(l.expiresAt) < new Date()
  ).length;

  const cards = [
    {
      label: "Total Links",
      value: total,
      icon: LinkIcon,
      bg: "bg-indigo-50",
      color: "text-indigo-500",
    },
    {
      label: "Active Links",
      value: active,
      icon: CheckCircle2,
      bg: "bg-green-50",
      color: "text-green-500",
    },
    {
      label: "Expired Links",
      value: expired,
      icon: Clock,
      bg: "bg-red-50",
      color: "text-red-500",
    },
    {
      label: "Total Clicks",
      value: clicks,
      icon: BarChart3,
      bg: "bg-amber-50",
      color: "text-amber-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm"
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${card.bg} ${card.color}`}
            >
              <Icon size={22} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500">
                {card.label}
              </span>
              <span className="text-2xl font-bold text-gray-900 leading-tight">
                {card.value}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default DashboardCards;
