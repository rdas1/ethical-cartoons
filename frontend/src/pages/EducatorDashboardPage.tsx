import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { educatorApi } from "@/api/educatorApi";
import CreateHomeworkForm from "@/components/admin/CreateHomeworkForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function EducatorDashboardPage() {
  const navigate = useNavigate();
  const [homeworks, setHomeworks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchHomeworks = async () => {
    const res = await educatorApi.listHomeworks();
    const data = await res.json();
    setHomeworks(data.homeworks);
  };

  useEffect(() => {
    fetchHomeworks();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("educator_token");
    if (!token) {
      navigate("/educators/login");
      return;
    }

    (async () => {
      try {
        const res = await educatorApi.listHomeworks(); // <--- We'll write this
        if (!res.ok) throw new Error("Failed to load homework assignments");
        const data = await res.json();
        setHomeworks(data.homeworks || []);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("educator_token");
    navigate("/educators/login");
  };

  if (loading) {
    return <div className="text-center p-8">Loading your dashboard...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Educator Dashboard</h1>
        <Button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
        >
          Log out
        </Button>
      </div>

      {/* Create New Button */}
      <Button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mb-8"
      >
        ➕ Create New Assignment
      </Button>

      {/* Create Homework Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Homework Assignment</DialogTitle>
          </DialogHeader>

          <CreateHomeworkForm
            onCreated={() => {
              setIsModalOpen(false);
              fetchHomeworks();
            }}
          />
        </DialogContent>
      </Dialog>

      <h2 className="text-2xl font-semibold mb-4">Your Homework Assignments</h2>

      {homeworks.length === 0 ? (
        <p>No assignments yet. Click "Create" to start!</p>
      ) : (
        <ul className="space-y-4">
          {homeworks.map((hw) => (
            <li key={hw.slug} className="border rounded p-4">
              <h3 className="text-lg font-semibold">{hw.title}</h3>
              <p className="text-gray-600">Slug: {hw.slug}</p>
              <Button
                onClick={() => navigate(`/educators/homework/${hw.slug}`)}
                className="mt-2 bg-black hover:bg-gray-600 text-white py-1 px-3 rounded"
              >
                View Details
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
