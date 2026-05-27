"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import { API_URL } from "../lib/apiFetch";
import { endpoints } from "../lib/endpoints";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (refreshToken) {
      try {
        await axios.post(`${API_URL}${endpoints.auth.logout}`, {
          refreshToken,
        });
      } catch {
        // Logout even if the API call fails
      }
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.push("/");
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
    >
      Logout
    </button>
  );
}
