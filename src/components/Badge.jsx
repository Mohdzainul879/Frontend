const variants = {
  Attended: 'bg-emerald-100 text-emerald-700',
  Upcoming: 'bg-blue-100 text-blue-700',
  Cancelled: 'bg-gray-100 text-gray-600',
  Missed: 'bg-red-100 text-red-700',
  high: 'bg-emerald-100 text-emerald-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-red-100 text-red-700',
  admin: 'bg-indigo-100 text-indigo-700',
  student: 'bg-emerald-100 text-emerald-700',
};

export default function Badge({ label, variant }) {
  const cls = variants[variant] || variants[label] || 'bg-gray-100 text-gray-600';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {label}
    </span>
  );
}
