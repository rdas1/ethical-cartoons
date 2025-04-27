import { useState } from "react";
import { homeworkApi } from "@/api/homeworkApi";

export default function HomeworkAdminPage() {
  const [slug, setSlug] = useState("");
  const [emails, setEmails] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    try {
      setError(null);
      const emailList = emails.split(",").map(e => e.trim());
      const res = await homeworkApi.generateTokens(slug, emailList);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Failed to generate tokens");
      }
      setResult(data.tokens);
    } catch (err: any) {
      setError(err.message);
      setResult(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Generate Homework Tokens</h1>

      <div className="space-y-4">
        <input
          type="text"
          className="w-full p-2 border"
          placeholder="Homework slug (e.g., ethics-homework-1)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />

        <textarea
          className="w-full p-2 border"
          placeholder="Emails, separated by commas"
          value={emails}
          onChange={(e) => setEmails(e.target.value)}
          rows={4}
        />

        <button
          onClick={handleGenerate}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Generate Tokens
        </button>

        {error && <div className="text-red-600">{error}</div>}

        {result && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold">Generated Tokens</h2>
            <pre className="bg-gray-100 p-4 overflow-auto rounded">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
