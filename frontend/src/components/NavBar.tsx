import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <header className="w-full px-6 py-4 flex justify-between items-center border-b bg-white sticky top-0 z-50">
      <h1 className="text-2xl font-bold">
        <Link to="/">Ethical Cartoons</Link>
      </h1>
      <nav className="space-x-4 text-sm">
        <Link to="/">Students</Link>
        <Link to="/">Educators</Link>
        <Link to="/">About</Link>
      </nav>
    </header>
  );
}
