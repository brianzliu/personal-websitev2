import type { Metadata } from "next";
import HelveticaNeue from "next/font/local"
import "./globals.css";
import Navbar from "./Navbar";
import DitherDivider from "./components/DitherDivider";

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
      <body className={`${helvetica_neue.variable} antialiased`}>
        <div className="site">
          <Navbar />
          <DitherDivider />
          {children}
        </div>
      </body>
    </html>
  );
}
