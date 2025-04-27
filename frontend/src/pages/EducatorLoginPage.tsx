import { useState, useEffect } from "react";
import { educatorApi } from "@/api/educatorApi";
import { useNavigate } from "react-router-dom";


export default function EducatorLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
        const token = localStorage.getItem("educator_token");
        if (token) {
            // Redirect to dashboard if already logged in
            navigate("/educators/dashboard");
        }
    }, []);

  const handleRequestLogin = async () => {
    if (!email) return;

    setLoading(true);
    setError(null);

    try {
      const res = await educatorApi.requestLogin(email);
      if (!res.ok) throw new Error("Failed to send login email");

      setEmailSent(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to send login email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100">
      <div className="max-w-md w-full space-y-6">
        <h1 className="text-2xl font-semibold text-center">Educator Login / Sign-Up</h1>

        {!emailSent ? (
          <>
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded p-2"
              required
            />

            <button
              onClick={handleRequestLogin}
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded"
            >
              {loading ? "Sending Email..." : "Request Login Link"}
            </button>

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}
          </>
        ) : (
          <div className="text-center text-green-700 space-y-4">
            <p>✅ Check your email for a login link!</p>
            <p>(Didn't get it? Click below to resend.)</p>
            <button
              onClick={handleRequestLogin}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
            >
              {loading ? "Resending..." : "Resend Email"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
