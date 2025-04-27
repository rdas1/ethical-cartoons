import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { homeworkApi } from "@/api/homeworkApi";
import { useHomeworkContext } from "@/contexts/homeworkContext";
import UtilitarianismModule from "@/pages/UtilitarianismModule";
import { getHomeworkToken, setHomeworkToken, clearHomeworkToken } from "@/utils/homeworkStorage";
import IntroModule from "./IntroModule";

export default function HomeworkPage() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { homeworkSession, setHomeworkSession } = useHomeworkContext();

  const [emailInput, setEmailInput] = useState("");
  const [requestingEmail, setRequestingEmail] = useState(false);
  const [emailRequested, setEmailRequested] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const [verifyingToken, setVerifyingToken] = useState(false);
  const [verifiedModuleName, setVerifiedModuleName] = useState<string | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const params = new URLSearchParams(location.search);
    const urlToken = params.get("token");

    if (urlToken) {
      verifyToken(slug, urlToken);
    } else {
      // No token in URL — check localStorage
      const savedToken = getHomeworkToken(slug);
      if (savedToken) {
        verifyToken(slug, savedToken);
      }
    }
  }, [slug, location.search]);

  const verifyToken = async (slug: string, token: string) => {
    setVerifyingToken(true);
    try {
      const res = await homeworkApi.verifyHomeworkToken(slug, token);
      if (!res.ok) throw new Error("Verification failed");
      const data = await res.json();
      
      // ✅ Set session
      setHomeworkSession({
        studentId: data.student_id,
        email: data.email,
        name: data.name,
        homeworkSlug: slug,
      });

      // ✅ Save token to localStorage
      setHomeworkToken(slug, token);

      setVerifiedModuleName(data.module_name);
    } catch (err: any) {
      console.error(err);
      setVerificationError(err.message || "Verification failed");
    } finally {
      setVerifyingToken(false);
    }
  };

  const handleRequestEmail = async () => {
    if (!slug || !emailInput) return;
    setRequestingEmail(true);
    setEmailError(null);

    try {
      const res = await homeworkApi.requestVerificationEmail(slug, emailInput);
      if (!res.ok) throw new Error("Failed to request verification email");
      setEmailRequested(true);
    } catch (err: any) {
      console.error(err);
      setEmailError(err.message || "Failed to request verification email");
    } finally {
      setRequestingEmail(false);
    }
  };

  const handleLogout = () => {
    if (slug) {
      clearHomeworkToken(slug);
      // setHomeworkSession(null);
      setVerifiedModuleName(null);
      navigate(`/`);
    }
  };

  if (verifyingToken) {
    return <p className="text-center p-8">Verifying token...</p>;
  }

  if (!verifiedModuleName) {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100">
        <h1 className="text-2xl font-semibold mb-4">Access Your Homework</h1>

        {!emailRequested ? (
          <div className="space-y-4 w-full max-w-md">
            <input
              type="email"
              placeholder="Your school email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
            <button
              onClick={handleRequestEmail}
              disabled={requestingEmail}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded"
            >
              {requestingEmail ? "Sending Email..." : "Request Access Link"}
            </button>
            {emailError && (
              <div className="text-red-600 text-sm">{emailError}</div>
            )}
          </div>
        ) : (
          <div className="text-center text-green-600">
            <p>✅ Check your email for a link to access the homework!</p>
          </div>
        )}

        {verificationError && (
          <div className="text-red-600 mt-4">{verificationError}</div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
        <div className="text-center mt-8 p-6">
          <p className="text-lg font-semibold">
            Welcome, {homeworkSession?.name || homeworkSession?.email}!
          </p>
          <br />
          <p className="text-lg">
            You've been assigned this module for homework.
          </p>
          <br />
          <p className="text-lg">
            Please complete the module and submit your responses.
          </p>
          <br />
          <p className="text-lg">
            <b></b>Your instructor will be able to see <br /><b>whether</b> you responded to each section, <br/>but <b>not how</b> exactly you responded.
          </p>
          <br />
          <p className="text-lg">
            If you're not here for homework, please click the log out button below.
          </p>
          <br />
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded"
          >
            Log out
          </button>
          <br />
          <br />
          <p className="text-lg">Otherwise, enjoy!</p>
          

        </div>
      {verifiedModuleName === "Utilitarianism" ? (
        <UtilitarianismModule />
      ) : verifiedModuleName === "IntroModule" ?
      (
        <IntroModule />
      ) : (
        <div className="text-center text-gray-700 p-8">
          Assigned module: {verifiedModuleName}
        </div>
      )}

      <div className="text-center my-8">
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded"
        >
          Log out
        </button>
      </div>

    </div>
  );
}
