import { Outlet, Link } from "react-router";

export function RootLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="font-bold text-2xl text-indigo-600">
              HealthAI
            </Link>
            <div className="flex gap-4">
              <Link
                to="/login"
                className="px-4 py-2 text-indigo-600 hover:text-indigo-800"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <Outlet />
    </div>
  );
}
