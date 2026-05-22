import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";

function Navbar({ onMenuClick }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <nav className="bg-black/50 backdrop-blur-md border-b border-gray-700 fixed top-0 left-0 right-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <button
              onClick={onMenuClick}
              className="lg:hidden text-gray-300 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="text-white font-bold text-lg hidden sm:inline">AI Project Generator</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-300 hover:text-white transition hidden sm:block">Home</Link>
            {user && (
              <Link to="/generator" className="text-gray-300 hover:text-white transition hidden sm:block">Generator</Link>
            )}
            {user && (
              <Link to="/dashboard" className="text-gray-300 hover:text-white transition hidden sm:block">Dashboard</Link>
            )}
            {!user ? (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white transition">Login</Link>
                <Link to="/register" className="bg-purple-600 text-white px-4 py-1.5 rounded-lg hover:bg-purple-700 transition">
                  Sign Up
                </Link>
              </>
            ) : (
              <button onClick={handleLogout} className="text-gray-300 hover:text-white transition">
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;