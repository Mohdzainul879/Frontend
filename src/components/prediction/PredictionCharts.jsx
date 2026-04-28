import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';

const PIE_COLORS = ['#f59e0b', '#10b981', '#6366f1'];

export default function PredictionCharts({ comparisonData, trendData, distributionData }) {
  return (
    <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm xl:col-span-1">
        <h3 className="mb-3 text-base font-semibold text-gray-900">Prediction vs Bookings</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ececec" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </article>

      <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm xl:col-span-1">
        <h3 className="mb-3 text-base font-semibold text-gray-900">Historical Attendance Trend</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ececec" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Breakfast" stroke="#f59e0b" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Lunch" stroke="#10b981" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Dinner" stroke="#6366f1" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </article>

      <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm xl:col-span-1">
        <h3 className="mb-3 text-base font-semibold text-gray-900">Meal Booking Distribution</h3>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={distributionData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={85}
              label
            >
              {distributionData.map((entry, index) => (
                <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </article>
    </section>
  );
}
