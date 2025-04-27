import { apiFetch } from "@/utils/api";

export async function requestLogin(email: string) {
    return await apiFetch("/educators/request_login", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }
  
  export async function verifyLogin(token: string) {
    return await apiFetch("/educators/verify_login", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
  }

  async function listHomeworks() {
    return await apiFetch("/educators/homeworks", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("educator_token") || ""}`,
      },
    });
  }
  

export const educatorApi = {
    requestLogin,
    verifyLogin,
    listHomeworks,
};
