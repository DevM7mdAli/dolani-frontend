import { Card } from '@/components/ui/card';

interface FacultyStat {
  label: string;
  value: number;
  sublabel: string;
  borderColor: string;
}

interface FacultyStatsCardsProps {
  stats: FacultyStat[];
}

export function FacultyStatsCards({ stats }: FacultyStatsCardsProps) {
  return (
    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
      {/* prettier-ignore */}
      {stats.map((stat, i) => (
        <Card key={i} className={`border-l-4 ${stat.borderColor} p-5 shadow-sm`}>
          <p className="text-sm font-medium text-gray-600">{stat.label}</p>
          <h3 className="text-primary mt-2 text-2xl font-bold">{stat.value}</h3>
          <p className="mt-1 text-xs text-gray-500">{stat.sublabel}</p>
        </Card>
      ))}
    </div>
  );
}
