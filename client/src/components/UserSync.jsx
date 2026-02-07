import { useUser, useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import axios from "axios";

const UserSync = () => {
  const { user } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    const syncToMongoDB = async () => {
      if (user) {
        try {
          // Get the fresh JWT from Clerk
          const token = await getToken();

          // Send user info to your local server
          await axios.post(
            "http://localhost:5000/api/users/sync",
            {
              email: user.primaryEmailAddress.emailAddress,
              name: user.fullName,
              image: user.imageUrl,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          console.log("✅ Database Synced");
        } catch (err) {
          console.error("❌ Sync Error:", err.response?.data || err.message);
        }
      }
    };

    syncToMongoDB();
  }, [user, getToken]); // Runs whenever the user logs in/out

  return null; // This component doesn't render any UI
};

export default UserSync;
