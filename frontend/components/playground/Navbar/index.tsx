import { ModeToggle } from "../../mode-toggle";

export default function Navbar() {
  return (
    <nav className="absolute left-0 right-0 top-0 flex h-12 w-full items-center justify-between bg-accent px-4">
      <h1 className="text-2xl font-bold text-accent-foreground">
        Create Next App
      </h1>
      <ul className="flex items-center space-x-4">
        <li>
          <a href="#" className="text-accent-foreground">
            Home
          </a>
        </li>
        <li>
          <a href="#" className="text-accent-foreground">
            About
          </a>
        </li>
        <li>
          <a href="#" className="text-accent-foreground">
            Contact
          </a>
        </li>
        <li>
          <ModeToggle />
        </li>
      </ul>
    </nav>
  );
}
