import { useState } from "react";
import { updateProfile } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import Button from "../common/Button";

function UserProfileCard({ user }) {
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpdateProfile = async () => {
    if (!displayName.trim()) return;
    setLoading(true);
    try {
      await updateProfile(auth.currentUser, { displayName });
      setMessage("Profile updated successfully!");
      setIsEditing(false);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <span className="text-3xl text-white">
            {user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U"}
          </span>
        </div>
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                placeholder="Enter your name"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleUpdateProfile} loading={loading}>
                  Save
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white">
                {user?.displayName || "Set your name"}
              </h2>
              <p className="text-gray-400">{user?.email}</p>
              <button
                onClick={() => setIsEditing(true)}
                className="text-purple-500 hover:text-purple-400 text-sm mt-2"
              >
                Edit Profile
              </button>
            </>
          )}
        </div>
      </div>

      {message && (
        <div className={`p-3 rounded-lg ${message.includes("success") ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
          {message}
        </div>
      )}

      <div className="border-t border-gray-700 pt-4 mt-4">
        <h3 className="text-white font-semibold mb-2">Account Information</h3>
        <div className="space-y-1 text-sm">
          <p className="text-gray-400">
            <span className="text-gray-500">Email:</span> {user?.email}
          </p>
          <p className="text-gray-400">
            <span className="text-gray-500">Account Created:</span>{" "}
            {user?.metadata?.creationTime
              ? new Date(user.metadata.creationTime).toLocaleDateString()
              : "Unknown"}
          </p>
          <p className="text-gray-400">
            <span className="text-gray-500">Last Sign In:</span>{" "}
            {user?.metadata?.lastSignInTime
              ? new Date(user.metadata.lastSignInTime).toLocaleDateString()
              : "Unknown"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserProfileCard;