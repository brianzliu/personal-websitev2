import Link from 'next/link';

export default function Navbar() {
    const navLinks = [
        { href: "#resume", label: "resume" },
        { href: "#projects", label: "projects" },
        { href: "#cool-stuff", label: "cool stuff" },
      ];

    return (
        <header className="flex items-center justify-between border-b border-neutral-200 px-6 py-6 text-sm tracking-tight md:px-12">
            <Link href="#" className="text-base font-medium">
                home
            </Link>
            <nav className="flex items-center gap-8 text-base text-neutral-600">
                {navLinks.map((link) => (
                <Link
                    key={link.label}
                    href={link.href}
                    className="transition-colors hover:text-neutral-900"
                >
                    {link.label}
                </Link>
                ))}
            </nav>
        </header>
    );
}