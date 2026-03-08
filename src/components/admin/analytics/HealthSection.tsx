export interface HealthMetricProps {
  label: string;
  value: string | number;
  color: string;
}

export const HealthMetric = ({ label, value, color }: HealthMetricProps) => (
  <div>
    <div className="mb-2 flex items-center justify-between">
      <span className="text-sm font-semibold text-gray-700">{label}</span>
      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-bold text-gray-900">
        {value}
      </span>
    </div>
    <div className="h-2.5 overflow-hidden rounded-full bg-gray-200">
      <div
        className={`h-full rounded-full transition-all ${color}`}
        style={{ width: typeof value === 'number' ? `${value}%` : '100%' }}
      />
    </div>
  </div>
);
