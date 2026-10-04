import Link from 'next/link';

const navLinks = [
    { href: "/", label: "home" },
    { href: "/projects", label: "projects" },
    { href: "/resume", label: "resume" },
    { href: "/blog", label: "blog" },
];

export default function Navbar() {
    return (
        <header className="nav">
            <nav className="nav__links">
                {navLinks.map((link) => (
                    <Link key={link.href} href={link.href}>{link.label}</Link>
                ))}
            </nav>
        </header>
    );
}
