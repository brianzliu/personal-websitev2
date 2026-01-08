'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { href: "/resume", label: "Resume" },
        { href: "#projects", label: "Projects", comingSoon: true },
        { href: "#cool-stuff", label: "Cool Stuff", comingSoon: true },
    ];

    return (
        <>
            <header className="flex items-center justify-between max-w-7xl mx-auto w-full px-6 py-6 text-2xl font-helvetica-neue tracking-tight">
                <Link href="/" className="hidden md:flex font-bold text-neutral-900">
                    Home
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-16 font-bold text-neutral-900">
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="transition-colors hover:text-neutral-600"
                        >
                            {link.label}
                            {link.comingSoon && (
                                <span className="text-sm font-bold ml-1">(Coming Soon!)</span>
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Mobile Hamburger Button */}
                <button
                    onClick={() => setIsOpen(true)}
                    className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5"
                    aria-label="Open menu"
                >
                    <span className="block w-6 h-0.5 bg-neutral-900"></span>
                    <span className="block w-6 h-0.5 bg-neutral-900"></span>
                    <span className="block w-6 h-0.5 bg-neutral-900"></span>
                </button>
            </header>

            {/* Mobile Sidebar Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsOpen(false)}
            />

            {/* Mobile Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-xl transform transition-transform duration-300 ease-out md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Close Button */}
                    <div className="flex justify-start p-3">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-10 h-10 flex items-center justify-center text-neutral-900 hover:text-neutral-600"
                            aria-label="Close menu"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Mobile Nav Links */}
                    <nav className="flex flex-col px-6 gap-6 font-helvetica-neue font-bold text-2xl">
                        <Link
                            href="/"
                            onClick={() => setIsOpen(false)}
                            className="text-neutral-900 hover:text-neutral-600 transition-colors"
                        >
                            Home
                        </Link>
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="text-neutral-900 hover:text-neutral-600 transition-colors"
                            >
                                {link.label}
                                {link.comingSoon && (
                                    <span className="text-sm font-bold ml-2 text-neutral-500">(Coming Soon!)</span>
                                )}
                            </Link>
                        ))}
                    </nav>
                </div>
            </aside>
        </>
    );
}