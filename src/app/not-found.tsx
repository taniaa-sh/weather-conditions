export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl mb-6">Page Not Found</p>
        <a
          href="/"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
