import Link from 'next/link';

export default function Navbar() {
    const navLinks = [
        { href: "#resume", label: "Resume" },
        { href: "#projects", label: "Projects" },
        { href: "#cool-stuff", label: "Cool Stuff" },
    ];

    return (
        <header className="flex items-center justify-between px-6 py-6 text-sm tracking-tight md:px-12">
            <Link href="#" className="text-base font-bold text-neutral-900">
                Home
            </Link>
            <nav className="flex items-center gap-8 text-base font-bold text-neutral-900">
                {navLinks.map((link) => (
                    <Link
                        key={link.label}
                        href={link.href}
                        className="transition-colors hover:text-neutral-600"
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>
        </header>
    );
}