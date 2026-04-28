const cards = [
  {
    key: 'predictedStudentsAttending',
    label: 'Predicted Attendance',
    suffix: 'students',
    accent: 'text-indigo-600',
  },
  {
    key: 'totalRegisteredStudents',
    label: 'Total Registered Students',
    suffix: 'students',
    accent: 'text-sky-600',
  },
  {
    key: 'recommendedFoodPreparation',
    label: 'Recommended Food Preparation',
    suffix: 'meals',
    accent: 'text-emerald-600',
  },
  {
    key: 'currentBookings',
    label: 'Current Bookings',
    suffix: 'bookings',
    accent: 'text-amber-600',
  },
  {
    key: 'mealType',
    label: 'Meal Type',
    suffix: '',
    accent: 'text-gray-800',
  },
  {
    key: 'menuPopularityScore',
    label: 'Menu Popularity Score',
    suffix: '/10',
    accent: 'text-fuchsia-600',
  },
];

export default function PredictionResults({ prediction }) {
  if (!prediction) return null;

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Prediction Results</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {cards.map((card) => (
          <article key={card.key} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">{card.label}</p>
            <p className={`mt-2 text-2xl font-bold ${card.accent}`}>
              {prediction[card.key]} {card.suffix}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
