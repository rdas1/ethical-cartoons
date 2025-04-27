import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { educatorApi } from "@/api/educatorApi";

export default function EducatorVerifyPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    console.log("Verifying educator login...");
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (!token) {
      setError("Missing verification token.");
      setVerifying(false);
      return;
    }

    (async () => {
      try {
        const res = await educatorApi.verifyLogin(token);
        if (!res.ok) throw new Error("Verification failed");
        const data = await res.json();
        console.log("Verification response:", data);

        localStorage.setItem("educator_token", token);
        console.log("Verification successful, token saved:", token);
        navigate("/educators/dashboard");
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Verification failed");
      } finally {
        setVerifying(false);
      }
    })();
  }, [location.search, navigate]);

  if (verifying) {
    return <div className="text-center p-8">Verifying...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600">
        <p>{error}</p>
        <button
          onClick={() => navigate("/educators/login")}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Back to Login
        </button>
      </div>
    );
  }

  return null;
}
