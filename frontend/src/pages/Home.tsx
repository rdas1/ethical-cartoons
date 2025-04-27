import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const modules = [
  { title: "Introduction: Why Study Ethics?", href: "/modules/intro", disabled: false },
  { title: "Utilitarianism: Maximizing Happiness", href: "/modules/utilitarianism", disabled: false },
  { title: "Deontology: Our Moral Duties", href: "/modules/deontology", disabled: false },
  { title: "Virtue Ethics: Character Matters", href: "/modules/virtue", disabled: false },
  { title: "More modules coming soon", href: "#", disabled: true },
];

export default function Home() {
  return (
    <div className="min-h-screen w-[100%] bg-white text-black">

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
