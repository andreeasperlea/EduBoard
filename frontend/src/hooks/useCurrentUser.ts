import { useEffect, useState } from "react";
import api from "../api/axios";
import type { User } from "../types/user";

export default function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const { data } = await api.get<User>("/auth/me");
        setUser(data);
      } catch (err) {
        console.error("Failed to fetch user", err);
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }

    fetchUser();
  }, []);

  return user;
}
