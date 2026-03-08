export interface MostVisitedCardProps {
  name: string;
  visitors: number;
  icon: React.ReactNode;
  color: string;
}

export const MostVisitedCard = ({
  name,
  visitors,
  icon,
  color,
}: MostVisitedCardProps) => (
  <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-linear-to-r from-gray-50 via-white to-gray-50 p-4 transition-all hover:border-gray-300 hover:shadow-md">
    <div className="flex items-center gap-4">
      <div className={`rounded-xl p-3 ${color}`}>{icon}</div>
      <div>
        <p className="font-semibold text-gray-900">{name}</p>
        <p className="text-xs text-gray-500">{visitors} visits</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-primary text-lg font-bold">{visitors}</p>
      <p className="text-xs text-gray-500">today</p>
    </div>
  </div>
);
