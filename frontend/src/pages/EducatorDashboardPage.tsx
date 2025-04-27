import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { educatorApi } from "@/api/educatorApi";
import CreateHomeworkForm from "@/components/admin/CreateHomeworkForm";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HomeworkDetailModal } from "@/components/admin/HomeworkDetailModal";
import { toast } from "sonner";
import { homeworkApi } from "@/api/homeworkApi";

export default function EducatorDashboardPage() {
  const navigate = useNavigate();
  const [homeworks, setHomeworks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailModalSlug, setDetailModalSlug] = useState<string | null>(null);
  const [editingHomework, setEditingHomework] = useState<any>(null);

  const FRONTEND_BASE_URL = import.meta.env.VITE_FRONTEND_BASE_URL || "http://localhost:5173/ethical-cartoons";

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

  const handleDeleteHomework = (slug: string) => {
    toast.custom((t) => (
      <div className="flex flex-col space-y-2 p-4 bg-white shadow-lg rounded border border-gray-300">
        <span>Are you sure you want to delete this assignment?</span>
        <div className="flex space-x-4">
          <Button
            variant="destructive"
            onClick={async () => {
              await educatorApi.deleteHomework(slug);
              toast.dismiss(t.id);
              fetchHomeworks();
              toast.success("Homework deleted.");
            }}
          >
            Yes, delete
          </Button>
  
          <Button
            variant="outline"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </Button>
        </div>
      </div>
    ));
  };
    
  

  if (loading) {
    return <div className="text-center p-8">Loading your dashboard...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600 space-y-4">
        <p>{error}</p>
        <Button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
        >
          Log out
        </Button>
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
        onClick={() => {
            setCreateModalOpen(true);
            setDetailModalSlug(null); // 🔥
        }}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mb-8"
      >
        Create New Assignment
      </Button>

      {/* Create Homework Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Homework Assignment</DialogTitle>
          </DialogHeader>

          <CreateHomeworkForm
            onCreated={() => {
              setCreateModalOpen(false);
              fetchHomeworks();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Homework Details Modal */}
        {detailModalSlug && (
        <HomeworkDetailModal
            slug={detailModalSlug}
            open={!!detailModalSlug}
            onOpenChange={(open) => {
            if (!open) setDetailModalSlug(null);
            }}
        />
        )}

        {editingHomework && (
        <Dialog open={!!editingHomework} onOpenChange={(open) => {
            if (!open) setEditingHomework(null);
        }}>
            <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit Assignment</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
                <input
                value={editingHomework.title}
                onChange={(e) =>
                    setEditingHomework({ ...editingHomework, title: e.target.value })
                }
                placeholder="Assignment Title"
                className="w-full border rounded p-2"
                />

                <input
                value={editingHomework.allowed_domains?.join(", ") || ""}
                onChange={(e) =>
                    setEditingHomework({ ...editingHomework, allowed_domains: e.target.value.split(",").map(d => d.trim()) })
                }
                placeholder="Allowed email domains (comma-separated)"
                className="w-full border rounded p-2"
                />
            </div>

            <DialogFooter>
                <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded px-4"
                onClick={async () => {
                    await homeworkApi.updateHomework(editingHomework.slug, {
                    title: editingHomework.title,
                    allowed_domains: editingHomework.allowed_domains,
                    });
                    setEditingHomework(null);
                    fetchHomeworks(); // reload
                }}
                >
                Save Changes
                </button>
                <DialogClose asChild>
                <button className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 rounded px-4">
                    Cancel
                </button>
                </DialogClose>
            </DialogFooter>
            </DialogContent>
        </Dialog>
        )}


      <h2 className="text-2xl font-semibold mb-4">Your Homework Assignments</h2>
      <p className="text-gray-600 text-md mb-4">You can share each assignment's "magic link" with your students. It requires an email login.</p>

      {homeworks.length === 0 ? (
        <p>No assignments yet. Click "Create" to start!</p>
      ) : (
        <div>

        <ul className="space-y-4">
          {homeworks.map((hw) => (
            <li key={hw.slug} className="border rounded p-4">
              <h3 className="text-lg font-semibold">{hw.title}</h3>
                <p className="text-gray-600">Module: {hw.module_name}</p>
              <p className="text-gray-600">Assignment ID: {hw.slug}</p>
              <div className="space-y-6 mt-4">
                <div className="space-x-2">
                    <Button
                        onClick={() => {
                            setDetailModalSlug(hw.slug);
                            setCreateModalOpen(false); // 🔥
                        }}
                        className="mt-2 bg-black hover:bg-gray-600 text-white py-1 px-3 rounded"
                    >
                        View Response Stats
                    </Button>
                    <Button
                        onClick={() => {
                            navigator.clipboard.writeText(`${FRONTEND_BASE_URL}/#/homework/${hw.slug}`);
                            // toast(`"${hw.title}" magic link copied!`)
                            toast.success(`Link copied! (${hw.title})`, {
                                description: "You can now share this assignment with your students (e.g. via your LMS).",
                                duration: 20000, // 20 seconds
                            });
                        }}
                        className="bg-black hover:bg-gray-500 text-white py-1 px-3 rounded"
                        >
                        Copy Magic Link
                    </Button>
                </div>
                <div className="space-x-2">
                <Button
                    onClick={() => {
                    setEditingHomework(hw);
                    }}
                    className="bg-green-600 hover:bg-green-800 text-white py-1 px-3 rounded"
                >
                    Edit
                </Button>
                <Button
                    variant="destructive"
                    onClick={() => handleDeleteHomework(hw.slug)}
                    className="py-1 px-3 rounded"
                >
                    Delete
                </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        </div>
      )}
    </div>
  );
}
