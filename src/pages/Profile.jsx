import { useAuth } from "../hooks/useAuth";
import DashboardLayout from "../layouts/DashboardLayout";
import UserProfileCard from "../components/profile/UserProfileCard";
import Loader from "../components/common/Loader";

function Profile() {
  const { user, loading } = useAuth();

  if (loading) return <Loader fullScreen />;
  if (!user) return null;

  return (
    <DashboardLayout title="Profile">
      <div className="max-w-2xl mx-auto">
        <UserProfileCard user={user} />
      </div>
    </DashboardLayout>
  );
}

export default Profile;