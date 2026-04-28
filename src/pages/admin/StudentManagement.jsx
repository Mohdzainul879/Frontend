import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import Modal from '../../components/Modal';
import Badge from '../../components/Badge';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FiSearch, FiFilter, FiAlertTriangle, FiEye } from 'react-icons/fi';

function ScoreBadge({ score }) {
  const color = score >= 80 ? 'bg-emerald-100 text-emerald-700' : score >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700';
  return <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>{score}</span>;
}

export default function StudentManagement() {
  const [loading, setLoading] = useState(true);
  const [allStudents, setAllStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [hostelFilter, setHostelFilter] = useState('');
  const [scoreFilter, setScoreFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await api.getAllStudents();
        setAllStudents(data);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  if (loading) return <div className="flex min-h-screen bg-gray-100"><AdminSidebar /><div className="flex-1 flex items-center justify-center"><LoadingSpinner /></div></div>;

  let students = [...allStudents];

  if (search) {
    students = students.filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (hostelFilter) students = students.filter(s => s.hostel === hostelFilter);

  if (scoreFilter === 'high') students = students.filter(s => s.accountabilityScore >= 80);
  else if (scoreFilter === 'medium') students = students.filter(s => s.accountabilityScore >= 60 && s.accountabilityScore < 80);
  else if (scoreFilter === 'low') students = students.filter(s => s.accountabilityScore < 60);

  students.sort((a, b) => {
    let valA = a[sortBy === 'score' ? 'accountabilityScore' : sortBy === 'attendance' ? 'attendanceRate' : 'name'];
    let valB = b[sortBy === 'score' ? 'accountabilityScore' : sortBy === 'attendance' ? 'attendanceRate' : 'name'];
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();
    return sortDir === 'asc' ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
  });

  const toggleSort = (field) => {
    if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortDir('asc'); }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Student Management</h1>
            <p className="text-gray-500 text-sm">{allStudents.length} students enrolled</p>
          </div>
          <div className="flex gap-2">
            <span className="bg-red-100 text-red-700 text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1">
              <FiAlertTriangle size={13} />
              {allStudents.filter(s => s.accountabilityScore < 50).length} flagged
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <FiSearch className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <FiFilter className="text-gray-400" size={16} />
          <select value={hostelFilter} onChange={e => setHostelFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
            <option value="">All Hostels</option>
            {['A', 'B', 'C', 'D', 'E'].map(h => <option key={h} value={h}>Hostel {h}</option>)}
          </select>
          <select value={scoreFilter} onChange={e => setScoreFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
            <option value="">All Scores</option>
            <option value="high">High (≥80)</option>
            <option value="medium">Medium (60–79)</option>
            <option value="low">Low (&lt;60)</option>
          </select>
          <button onClick={() => { setSearch(''); setHostelFilter(''); setScoreFilter(''); }}
            className="text-sm text-indigo-600 hover:underline">Clear</button>
          <span className="ml-auto text-sm text-gray-500">{students.length} results</span>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium cursor-pointer hover:text-indigo-600" onClick={() => toggleSort('name')}>
                    Name {sortBy === 'name' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Email</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Hostel</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Room</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium cursor-pointer hover:text-indigo-600" onClick={() => toggleSort('score')}>
                    Score {sortBy === 'score' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium cursor-pointer hover:text-indigo-600" onClick={() => toggleSort('attendance')}>
                    Attendance {sortBy === 'attendance' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Bookings</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {students.map(s => (
                  <tr key={s._id} className={`hover:bg-gray-50 transition-colors ${s.accountabilityScore < 50 ? 'bg-red-50' : ''}`}>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {s.accountabilityScore < 50 && <FiAlertTriangle className="inline text-red-400 mr-1" size={13} />}
                      {s.name}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{s.email}</td>
                    <td className="px-4 py-3">
                      <span className="bg-slate-100 text-slate-700 text-xs font-medium px-2 py-0.5 rounded-full">H-{s.hostel}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{s.room}</td>
                    <td className="px-4 py-3"><ScoreBadge score={s.accountabilityScore} /></td>
                    <td className="px-4 py-3 text-gray-600">{s.attendanceRate}%</td>
                    <td className="px-4 py-3 text-gray-600">{s.totalBookings}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedStudent(s)}
                        className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-xs font-medium"
                      >
                        <FiEye size={13} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Student Detail Modal */}
      <Modal isOpen={!!selectedStudent} onClose={() => setSelectedStudent(null)}
        title={`Student: ${selectedStudent?.name}`}>
        {selectedStudent && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xl">
                {selectedStudent.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{selectedStudent.name}</p>
                <p className="text-sm text-gray-500">{selectedStudent.email}</p>
                <p className="text-sm text-gray-500">Hostel {selectedStudent.hostel}, Room {selectedStudent.room}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Accountability Score', value: selectedStudent.accountabilityScore, highlight: true },
                { label: 'Attendance Rate', value: `${selectedStudent.attendanceRate}%` },
                { label: 'Total Bookings', value: selectedStudent.totalBookings },
                { label: 'Status', value: selectedStudent.accountabilityScore < 50 ? '🚩 Flagged' : '✅ Good' },
              ].map(({ label, value, highlight }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className={`text-lg font-bold mt-0.5 ${highlight ? (selectedStudent.accountabilityScore >= 80 ? 'text-emerald-600' : selectedStudent.accountabilityScore >= 60 ? 'text-yellow-600' : 'text-red-600') : 'text-gray-800'}`}>
                    {value}
                  </p>
                </div>
              ))}
            </div>
            {selectedStudent.accountabilityScore < 50 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 flex gap-2">
                <FiAlertTriangle size={16} className="shrink-0 mt-0.5" />
                This student has a low accountability score. Consider sending a warning notice.
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
