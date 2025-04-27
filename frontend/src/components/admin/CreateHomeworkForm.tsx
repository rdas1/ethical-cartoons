import { useState, useEffect } from "react";
import { homeworkApi } from "@/api/homeworkApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

export default function CreateHomeworkForm({ onCreated }: { onCreated: () => void }) {
  const [title, setTitle] = useState("");
  const [moduleName, setModuleName] = useState("");
  const [allowedDomains, setAllowedDomains] = useState("");
  const [modules, setModules] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadModules() {
      try {
        const res = await homeworkApi.getAvailableModules();
        const data = await res.json();
        setModules(data.modules);
        if (data.modules.length > 0) {
          setModuleName(data.modules[0]);
        }
      } catch (err: any) {
        console.error("Failed to load modules", err);
      }
    }
    loadModules();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await homeworkApi.createHomework({
        slug: title.toLowerCase().replace(/\s+/g, "-"),
        title,
        module_name: moduleName,
        allowed_domains: allowedDomains.split(",").map(d => d.trim()).filter(Boolean),
      });
      if (!res.ok) throw new Error("Failed to create homework");
      onCreated();
    } catch (err: any) {
      setError(err.message || "Failed to create");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Assignment Title"
      />

      <Select value={moduleName} onValueChange={setModuleName}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a module" />
        </SelectTrigger>
        <SelectContent>
          {modules.map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        value={allowedDomains}
        onChange={(e) => setAllowedDomains(e.target.value)}
        placeholder="Allowed email domain(s), e.g. columbia.edu, barnard.edu (optional)"
      />

      <Button onClick={handleSubmit} disabled={loading} className="w-full">
        {loading ? "Creating..." : "Create Assignment"}
      </Button>

      {error && <div className="text-red-600 text-sm">{error}</div>}
    </div>
  );
}
