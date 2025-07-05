import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
            <h1 className="text-7xl font-bold mb-4">404</h1>
            <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
            <p className="mb-6 text-gray-500 dark:text-gray-400">Sorry, the page you are looking for does not exist.</p>
            <Link to="/" className="px-6 py-2 rounded bg-black text-white dark:bg-white dark:text-black font-medium transition hover:bg-gray-800 dark:hover:bg-gray-200">
                Go Home
            </Link>
        </div>
    );
}
