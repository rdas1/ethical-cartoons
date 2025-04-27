import { apiFetch } from "@/utils/api";
import { getHomeworkToken } from "@/utils/homeworkStorage";

async function createHomework(payload: {
  slug: string;
  title: string;
  module_name: string;
  allowed_domains?: string[]; // ✅ allowed_domains, NOT assigned_emails anymore
}) {
    const token = localStorage.getItem("educator_token");
    if (!token) throw new Error("No educator token found");
  
    return await apiFetch("/homework/create", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

async function getHomework(slug: string) {
  return await apiFetch(`/homework/${slug}`, {
    method: "GET",
  });
}

async function updateHomework(slug: string, payload: {
  title?: string;
  module_name?: string;
  allowed_domains?: string[]; // ✅ again, update allowed_domains
}) {
  return await apiFetch(`/homework/${slug}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

async function deleteHomework(slug: string) {
  return await apiFetch(`/homework/${slug}`, {
    method: "DELETE",
  });
}

async function verifyHomework(slug: string, email: string, name?: string) {
  return await apiFetch(`/homework/${slug}/verify`, {
    method: "POST",
    body: JSON.stringify({ email, name }), // ✅ yes, send both email + optional name
  });
}

// Deprecated in current design, but keeping for later if needed
async function generateTokens(slug: string, emails: string[]) {
  return await apiFetch(`/homework/${slug}/generate_tokens`, {
    method: "POST",
    body: JSON.stringify(emails),
  });
}

async function requestVerificationEmail(slug: string, email: string) {
    return await apiFetch(`/homework/${slug}/request_verification_email`, {
        method: "POST",
        body: JSON.stringify({ email }),
    });
}

async function verifyHomeworkToken(slug: string, token: string) {
    return await apiFetch(`/homework/${slug}/verify_token`, {
      method: "POST",
      body: JSON.stringify({ token }),
    });
  }

async function getAvailableModules() {
    return await apiFetch("/admin/modules", {
        method: "GET",
    });
}

async function getHomeworkStatsForParticipant(slug: string) {
    return await apiFetch(`/homework/${slug}/participant_stats`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${getHomeworkToken(slug) || ""}`,
          },
    });
}
  
export const homeworkApi = {
createHomework,
getHomework,
updateHomework,
deleteHomework,
verifyHomework,
requestVerificationEmail,
verifyHomeworkToken,
generateTokens,
getAvailableModules,
getHomeworkStatsForParticipant,
};
  
