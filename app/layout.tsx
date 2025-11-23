import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import HelveticaNeue from "next/font/local"
import "./globals.css";
import Navbar from "./Navbar"

const dm_sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
});

const helvetica_neue = HelveticaNeue({
  src: [
    {
      path: '../public/fonts/HelveticaNeueMedium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/HelveticaNeueBold.otf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-helvetica-neue'
})

export const metadata: Metadata = {
  title: "Brian Liu",
  description:
    "Welcome to my personal website! I am Brian Liu, a current UCSD data science student also involved in research and software.",
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dm_sans.variable} ${helvetica_neue.variable} bg-white text-neutral-900 antialiased`}
      >
        <div className="flex h-screen flex-col">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}
