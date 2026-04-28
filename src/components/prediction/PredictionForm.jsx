import LoadingSpinner from '../LoadingSpinner';

const MEAL_OPTIONS = ['Breakfast', 'Lunch', 'Dinner'];

export default function PredictionForm({
  schema,
  formData,
  menuOptions,
  loading,
  error,
  onChange,
  onToggle,
  onMenuItemChange,
  onSubmit,
}) {
  const renderField = (key) => {
    if (key === 'meal_type') {
      return (
        <select
          id={key}
          value={formData.meal_type}
          onChange={(event) => onChange('meal_type', event.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        >
          {MEAL_OPTIONS.map((option) => (
            <option key={option} value={option.toLowerCase()}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    if (key === 'menu_items') {
      return (
        <div className="space-y-1">
          <select
            id={key}
            multiple
            value={formData.menu_items}
            onChange={onMenuItemChange}
            className="h-28 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          >
            {menuOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500">Auto-loaded from today's selected meal menu. You can adjust selections if needed.</p>
          {menuOptions.length === 0 ? <p className="text-xs text-amber-600">No menu found for today and selected meal type.</p> : null}
        </div>
      );
    }

    if (key === 'menu_popularity_score') {
      return (
        <div className="space-y-1">
          <input
            id={key}
            type="number"
            min="1"
            max="10"
            value={formData[key]}
            readOnly
            className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-700 focus:outline-none"
          />
          <p className="text-xs text-gray-500">Calculated automatically from selected menu items.</p>
        </div>
      );
    }

    if (key === 'last_7_day_avg_attendance') {
      return (
        <div>
          <input
            id={key}
            type="number"
            min="0"
            value={formData[key]}
            onChange={(event) => onChange(key, Number(event.target.value))}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          />
        </div>
      );
    }

    if (key === 'holiday_flag' || key === 'exam_period_flag') {
      return (
        <label className="inline-flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={Boolean(formData[key])}
            onChange={() => onToggle(key)}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-sm text-gray-700">Enable</span>
        </label>
      );
    }

    return (
      <input
        id={key}
        type="number"
        min="0"
        value={formData[key]}
        onChange={(event) => onChange(key, Number(event.target.value))}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
      />
    );
  };

  const labels = {
    meal_type: 'Meal Type',
    day_of_week: 'Day Of Week (0-6)',
    menu_popularity_score: 'Menu Popularity Score',
    holiday_flag: 'Holiday Flag',
    exam_period_flag: 'Exam Period Flag',
    total_registered_students: 'Total Registered Students',
    current_bookings: 'Current Bookings',
    last_7_day_avg_attendance: 'Last 7 Day Avg Attendance',
    menu_items: 'Menu Items',
  };

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Machine Learning Prediction Input</h2>
        <p className="text-sm text-gray-500">Fill the fields to generate ML Prediction for today.</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {schema.map((key) => (
            <div key={key}>
              <label htmlFor={key} className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                {labels[key] || key}
              </label>
              {renderField(key)}
            </div>
          ))}
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? <LoadingSpinner size="sm" color="white" /> : null}
          {loading ? 'Generating prediction...' : 'Predict Meal Attendance'}
        </button>
      </form>
    </section>
  );
}
