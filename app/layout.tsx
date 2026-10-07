import type { Metadata } from "next";
import HelveticaNeue from "next/font/local"
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./Navbar";
import DitherDivider from "./components/DitherDivider";

const helvetica_neue = HelveticaNeue({
  src: [
    { path: '../public/fonts/HelveticaNeueLight.otf', weight: '300', style: 'normal' },
    { path: '../public/fonts/HelveticaNeueItalic.ttf', weight: '500', style: 'italic' },
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

// A quiet mono next to Helvetica Neue, for dates and tech
const mono = IBM_Plex_Mono({ weight: ["400", "500"], style: ["normal", "italic"], subsets: ["latin"], variable: "--font-mono" });

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
      <body className={`${helvetica_neue.variable} ${mono.variable} antialiased`}>
        <div className="site">
          <Navbar />
          <DitherDivider />
          {children}
        </div>
      </body>
    </html>
  );
}
