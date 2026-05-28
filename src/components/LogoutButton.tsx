"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import { API_URL } from "../lib/apiFetch";
import { endpoints } from "../lib/endpoints";
import { tokenStore } from "../lib/tokenStore";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}${endpoints.auth.logout}`, null, {
        withCredentials: true,
      });
    } catch {
      // Logout even if the API call fails
    }

    tokenStore.clear();
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
