import { ModeToggle } from "../mode-toggle";

export default function Navbar() {
  return (
    <nav className="absolute top-0 left-0 right-0 flex items-center justify-between w-full h-12 px-4 bg-accent">
      <h1 className="text-2xl font-bold text-accent-foreground">Create Next App</h1>
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
