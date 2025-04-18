import NavBar from "@/components/NavBar";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const modules = [
  { title: "Introduction", href: "/modules/intro", disabled: false },
  { title: "Utilitarian Ethics", href: "/modules/utilitarian", disabled: false },
  { title: "Deontological Ethics", href: "/modules/deontological", disabled: false },
  { title: "Virtue Ethics", href: "/modules/virtue", disabled: false },
  { title: "More modules coming soon", href: "#", disabled: true },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* NavBar */}
      <NavBar />

      {/* Main Content */}
      <main className="p-6">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {modules.map((mod) => (
            <Link
              to={mod.disabled ? "#" : mod.href}
              key={mod.title}
              className={cn(
                "transition-all",
                mod.disabled && "pointer-events-none opacity-50"
              )}
            >
              <Card className="rounded-2xl hover:shadow-xl h-full">
                <CardContent className="p-6 flex items-center justify-center text-center font-semibold text-lg h-full">
                  {mod.title}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
