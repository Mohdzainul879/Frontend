const variants = {
  emerald: 'bg-emerald-50 border-emerald-200',
  blue: 'bg-blue-50 border-blue-200',
  purple: 'bg-purple-50 border-purple-200',
  amber: 'bg-amber-50 border-amber-200',
  red: 'bg-red-50 border-red-200',
  indigo: 'bg-indigo-50 border-indigo-200',
};

const textColors = {
  emerald: 'text-emerald-600',
  blue: 'text-blue-600',
  purple: 'text-purple-600',
  amber: 'text-amber-600',
  red: 'text-red-600',
  indigo: 'text-indigo-600',
};

export default function StatCard({ title, value, icon: Icon, color = 'emerald', subtitle }) {
  return (
    <div className={`rounded-xl border p-5 flex items-center gap-4 shadow-sm ${variants[color]}`}>
      {Icon && (
        <div className={`p-3 rounded-full bg-white shadow-sm ${textColors[color]}`}>
          <Icon size={22} />
        </div>
      )}
      <div>
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{title}</p>
        <p className={`text-2xl font-bold mt-0.5 ${textColors[color]}`}>{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}
