import { useEffect, useMemo, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import PredictionForm from '../../components/prediction/PredictionForm';
import PredictionResults from '../../components/prediction/PredictionResults';
import PredictionCharts from '../../components/prediction/PredictionCharts';

const SAMPLE_SCHEMA_KEYS = [
  'meal_type',
  'day_of_week',
  'menu_popularity_score',
  'holiday_flag',
  'exam_period_flag',
  'total_registered_students',
  'current_bookings',
  'last_7_day_avg_attendance',
  'menu_items',
];

const DEFAULT_FORM_DATA = {
  meal_type: 'dinner',
  day_of_week: 5,
  menu_popularity_score: 5,
  holiday_flag: 0,
  exam_period_flag: 0,
  total_registered_students: 300,
  current_bookings: 270,
  last_7_day_avg_attendance: 250,
  menu_items: [],
};

export default function PredictionDashboard() {
  const [pageLoading, setPageLoading] = useState(true);
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [menuLoading, setMenuLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [predictionResult, setPredictionResult] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [attendanceHistoryRows, setAttendanceHistoryRows] = useState([]);
  const [distributionData, setDistributionData] = useState([]);
  const [menuOptions, setMenuOptions] = useState([]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    loadTodayMenuItems(formData.meal_type);
  }, [formData.meal_type]);

  useEffect(() => {
    if (!attendanceHistoryRows.length) return;
    const autoAvg = calculateLast7DayAverage(attendanceHistoryRows, formData.meal_type);
    setFormData((prev) => ({
      ...prev,
      last_7_day_avg_attendance: autoAvg,
    }));
  }, [formData.meal_type, attendanceHistoryRows]);

  useEffect(() => {
    const selectedItems = formData.menu_items || [];

    if (selectedItems.length === 0) {
      setFormData((prev) => ({ ...prev, menu_popularity_score: 5 }));
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const preview = await api.getMenuPopularityScorePreview(formData.meal_type, selectedItems);
        if (typeof preview?.menuPopularityScore === 'number') {
          setFormData((prev) => ({
            ...prev,
            menu_popularity_score: preview.menuPopularityScore,
          }));
        }
      } catch {
        // Keep existing score in UI if preview endpoint fails.
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [formData.meal_type, formData.menu_items]);

  const fetchInitialData = async () => {
    try {
      setPageLoading(true);
      const [attendanceHistory, mealBookingStats] = await Promise.all([
        api.getAttendanceHistory(14),
        api.getMealBookingStats(14),
      ]);

      setTrendData(buildTrendData(attendanceHistory));
      setAttendanceHistoryRows(Array.isArray(attendanceHistory) ? attendanceHistory : []);
      setDistributionData([
        { name: 'Breakfast', value: mealBookingStats.breakfastBookings || 0 },
        { name: 'Lunch', value: mealBookingStats.lunchBookings || 0 },
        { name: 'Dinner', value: mealBookingStats.dinnerBookings || 0 },
      ]);

      await loadTodayMenuItems(DEFAULT_FORM_DATA.meal_type);
    } catch (fetchError) {
      setError(fetchError.message || 'Unable to load chart data. Please try again.');
    } finally {
      setPageLoading(false);
    }
  };

  const loadTodayMenuItems = async (mealType) => {
    try {
      setMenuLoading(true);
      const response = await api.getTodayMenuItems(mealType);
      const items = Array.isArray(response?.menuItems) ? response.menuItems : [];
      setMenuOptions(items);
      setFormData((prev) => ({
        ...prev,
        menu_items: items,
      }));
    } catch {
      setMenuOptions([]);
      setFormData((prev) => ({
        ...prev,
        menu_items: [],
      }));
    } finally {
      setMenuLoading(false);
    }
  };

  const buildTrendData = (rows) => {
    const mapByDate = new Map();

    (rows || []).forEach((entry) => {
      if (!mapByDate.has(entry.date)) {
        mapByDate.set(entry.date, { date: entry.date, Breakfast: 0, Lunch: 0, Dinner: 0 });
      }
      const day = mapByDate.get(entry.date);
      if (entry.mealType === 'Breakfast') day.Breakfast = entry.attendance;
      if (entry.mealType === 'Lunch') day.Lunch = entry.attendance;
      if (entry.mealType === 'Dinner') day.Dinner = entry.attendance;
    });

    return Array.from(mapByDate.values()).slice(-14);
  };

  const calculateLast7DayAverage = (rows, mealTypeRaw) => {
    const mealType = String(mealTypeRaw || 'lunch').toLowerCase();
    const formattedMealType = mealType.charAt(0).toUpperCase() + mealType.slice(1);

    const values = (rows || [])
      .filter((entry) => entry.mealType === formattedMealType)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-7)
      .map((entry) => Number(entry.attendance) || 0);

    if (!values.length) return 0;
    return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
  };

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleToggle = (key) => {
    setFormData((prev) => ({ ...prev, [key]: prev[key] ? 0 : 1 }));
  };

  const handleMenuItemChange = (event) => {
    const selectedValues = Array.from(event.target.selectedOptions, (option) => option.value);
    setFormData((prev) => ({ ...prev, menu_items: selectedValues }));
  };

  const handlePredict = async (event) => {
    event.preventDefault();
    setError('');

    if (!formData.meal_type || Number(formData.total_registered_students) <= 0) {
      setError('Please provide meal type and valid student counts before prediction.');
      return;
    }

    try {
      setPredictionLoading(true);
      const response = await api.getTodayPrediction(formData);
      setPredictionResult(response);
      if (response?.input?.menu_popularity_score) {
        setFormData((prev) => ({
          ...prev,
          menu_popularity_score: response.input.menu_popularity_score,
        }));
      }
    } catch (predictionError) {
      setError(predictionError.message || 'Unable to fetch prediction. Please try again.');
    } finally {
      setPredictionLoading(false);
    }
  };

  const comparisonData = useMemo(() => {
    if (!predictionResult) return [];
    return [
      { name: 'Predicted Attendance', value: predictionResult.predictedStudentsAttending || 0 },
      { name: 'Current Bookings', value: predictionResult.currentBookings || 0 },
      { name: 'Recommended Preparation', value: predictionResult.recommendedFoodPreparation || 0 },
    ];
  }, [predictionResult]);

  if (pageLoading) return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex items-center justify-center">
        <div className="space-y-3 text-center">
          <LoadingSpinner size="lg" color="indigo" />
          <p className="text-sm text-gray-500">Loading Machine Learning Prediction dashboard...</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-6 space-y-6 overflow-auto">
        <header>
          <h1 className="text-2xl font-bold text-gray-800">Predictions Dashboard</h1>
          <p className="text-sm text-gray-500">Generate Machine Learning Prediction and monitor meal demand insights.</p>
        </header>

        <PredictionForm
          schema={SAMPLE_SCHEMA_KEYS}
          formData={formData}
          menuOptions={menuOptions}
          loading={predictionLoading || menuLoading}
          error={error}
          onChange={handleChange}
          onToggle={handleToggle}
          onMenuItemChange={handleMenuItemChange}
          onSubmit={handlePredict}
        />

        <PredictionResults prediction={predictionResult} />

        <PredictionCharts
          comparisonData={comparisonData}
          trendData={trendData}
          distributionData={distributionData}
        />
      </main>
    </div>
  );
}
