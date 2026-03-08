export interface ActivityItemProps {
  name: string;
  action: string;
  time: string;
  avatar: string;
}

export const ActivityItem = ({ name, action, time, avatar }: ActivityItemProps) => {
  const avatarColorMap: Record<string, string> = {
    'bg-blue-600': 'border-l-blue-500',
    'bg-amber-600': 'border-l-amber-500',
    'bg-teal-600': 'border-l-teal-500',
  };

  const borderAccent = avatarColorMap[avatar] || 'border-l-gray-300';

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border border-gray-300 ${borderAccent} border-l-4 bg-white p-3 transition-colors hover:bg-gray-50`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${avatar} text-xs font-bold text-white shadow-md`}
      >
        {name.split(' ')[0].charAt(0)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-900">{name}</p>
        <p className="mt-0.5 text-xs text-gray-600">{action}</p>
        <p className="mt-1 text-xs text-gray-500">{time}</p>
      </div>
    </div>
  );
};
