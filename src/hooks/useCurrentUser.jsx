import { useState, useEffect } from "react";
import { getMeApi } from "../services/api.service";

export const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const me = await getMeApi();
        setCurrentUser(me || null);
      } catch (error) {
        console.error("Failed to fetch current user:", error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  return { currentUser, loading };
};
