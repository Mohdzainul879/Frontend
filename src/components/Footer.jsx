export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-4 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
        <p>🍽️ Campus Food Intelligence System &copy; {new Date().getFullYear()}</p>
        <p className="text-xs mt-1">Reducing food waste, one meal at a time.</p>
      </div>
    </footer>
  );
}
