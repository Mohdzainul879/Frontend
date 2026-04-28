import { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import Modal from '../../components/Modal';
import { useMenu } from '../../context/MenuContext';
import { FiEdit2, FiPlus } from 'react-icons/fi';

const mealTypes = ['Breakfast', 'Lunch', 'Dinner'];
const mealEmoji = { Breakfast: '🌅', Lunch: '☀️', Dinner: '🌙' };
const mealTimings = { Breakfast: '7:30 AM – 9:30 AM', Lunch: '12:00 PM – 2:00 PM', Dinner: '7:00 PM – 9:00 PM' };

function getWeekDates() {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({
      date: d.toISOString().split('T')[0],
      label: i === 0 ? 'Today' : d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
    });
  }
  return days;
}

export default function MenuManagement() {
  const { addMenu, updateMenu, getMenuByDate } = useMenu();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ date: '', mealType: 'Lunch', items: '', timing: '' });
  const [studentView, setStudentView] = useState(false);

  const weekDates = getWeekDates();

  const openAdd = (date, mealType) => {
    setEditing(null);
    setForm({ date, mealType, items: '', timing: mealTimings[mealType] });
    setModalOpen(true);
  };

  const openEdit = (menu) => {
    setEditing(menu);
    setForm({ date: menu.date, mealType: menu.mealType, items: menu.items.join(', '), timing: menu.timing });
    setModalOpen(true);
  };

  const handleSave = async () => {
    const items = form.items.split(',').map(i => i.trim()).filter(Boolean);
    if (editing) {
      await updateMenu(editing._id, { ...form, items });
    } else {
      await addMenu({ ...form, items });
    }
    setModalOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Menu Management</h1>
            <p className="text-gray-500 text-sm">Plan and manage weekly meal menus</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setStudentView(!studentView)}
              className={`px-4 py-2 text-sm rounded-xl border font-medium transition-colors
                ${studentView ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-400'}`}
            >
              {studentView ? '👁 Student View ON' : '👁 Student View'}
            </button>
          </div>
        </div>

        {studentView ? (
          /* Student View */
          <div className="space-y-4">
            {weekDates.map(({ date, label }) => {
              const dayMenus = getMenuByDate(date);
              return (
                <div key={date} className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">
                    {label} <span className="text-gray-400 font-normal text-sm">({date})</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {mealTypes.map(mealType => {
                      const menu = dayMenus.find(m => m.mealType === mealType);
                      return (
                        <div key={mealType} className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">{mealEmoji[mealType]}</span>
                            <div>
                              <p className="font-medium text-gray-700 text-sm">{mealType}</p>
                              <p className="text-xs text-gray-400">{mealTimings[mealType]}</p>
                            </div>
                          </div>
                          {menu ? (
                            <ul className="space-y-1">
                              {menu.items.map((item, i) => (
                                <li key={i} className="text-xs text-gray-600 flex items-center gap-1">
                                  <span className="w-1 h-1 rounded-full bg-emerald-400 inline-block" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-gray-400 italic">Menu not set</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Admin/Edit View */
          <div className="space-y-4">
            {/* Weekly Calendar Grid */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-4 py-3 text-gray-600 font-medium w-28">Meal</th>
                      {weekDates.map(({ date, label }) => (
                        <th key={date} className="text-left px-3 py-3 text-gray-600 font-medium min-w-36">
                          <div>{label}</div>
                          <div className="text-xs font-normal text-gray-400">{date}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {mealTypes.map(mealType => (
                      <tr key={mealType} className="hover:bg-gray-50">
                        <td className="px-4 py-4 font-medium text-gray-700">
                          <span className="mr-1">{mealEmoji[mealType]}</span>
                          {mealType}
                        </td>
                        {weekDates.map(({ date }) => {
                          const menu = getMenuByDate(date).find(m => m.mealType === mealType);
                          return (
                            <td key={date} className="px-3 py-4">
                              {menu ? (
                                <div className="space-y-1">
                                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                                    {menu.items.slice(0, 3).join(', ')}
                                    {menu.items.length > 3 ? '...' : ''}
                                  </p>
                                  <button
                                    onClick={() => openEdit(menu)}
                                    className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-xs font-medium"
                                  >
                                    <FiEdit2 size={11} /> Edit
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => openAdd(date, mealType)}
                                  className="flex items-center gap-1 text-gray-400 hover:text-indigo-600 text-xs"
                                >
                                  <FiPlus size={13} /> Add menu
                                </button>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Current Week Menu List */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-base font-semibold text-gray-800 mb-4">All Menu Items This Week</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-4 py-2 text-gray-600 font-medium">Date</th>
                      <th className="text-left px-4 py-2 text-gray-600 font-medium">Meal</th>
                      <th className="text-left px-4 py-2 text-gray-600 font-medium">Timing</th>
                      <th className="text-left px-4 py-2 text-gray-600 font-medium">Items</th>
                      <th className="text-left px-4 py-2 text-gray-600 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {weekDates.flatMap(({ date }) =>
                      mealTypes.map(mealType => {
                        const menu = getMenuByDate(date).find(m => m.mealType === mealType);
                        if (!menu) return null;
                        return (
                          <tr key={`${date}-${mealType}`} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-700">{date}</td>
                            <td className="px-4 py-3 font-medium text-gray-800">{mealEmoji[mealType]} {mealType}</td>
                            <td className="px-4 py-3 text-gray-500 text-xs">{menu.timing}</td>
                            <td className="px-4 py-3 text-gray-600">{menu.items.join(', ')}</td>
                            <td className="px-4 py-3">
                              <button onClick={() => openEdit(menu)}
                                className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-xs font-medium">
                                <FiEdit2 size={12} /> Edit
                              </button>
                            </td>
                          </tr>
                        );
                      }).filter(Boolean)
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}
        title={editing ? `Edit Menu – ${editing.mealType}` : 'Add Menu'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meal Type</label>
            <select value={form.mealType} onChange={e => setForm(f => ({ ...f, mealType: e.target.value, timing: mealTimings[e.target.value] }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
              {mealTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Timing</label>
            <input value={form.timing} onChange={e => setForm(f => ({ ...f, timing: e.target.value }))}
              placeholder="e.g. 7:30 AM – 9:30 AM"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Menu Items (comma separated)</label>
            <textarea rows={4} value={form.items}
              onChange={e => setForm(f => ({ ...f, items: e.target.value }))}
              placeholder="Idli, Sambar, Coconut Chutney, Tea"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg text-sm transition-colors">
              {editing ? 'Update Menu' : 'Add Menu'}
            </button>
            <button onClick={() => setModalOpen(false)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 rounded-lg text-sm transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
