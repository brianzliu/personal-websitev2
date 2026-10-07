import type { Metadata } from "next";
import HelveticaNeue from "next/font/local"
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

// Libron (OFL, github.com/nicoverbruggen/libron): a calm book serif next to Helvetica Neue, for dates, years and tech
const libron = HelveticaNeue({
  src: [
    { path: '../public/fonts/libron/Libron-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/libron/Libron-Italic.woff2', weight: '400', style: 'italic' },
    { path: '../public/fonts/libron/Libron-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-libron',
});

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
      <body className={`${helvetica_neue.variable} ${libron.variable} antialiased`}>
        <div className="site">
          <Navbar />
          <DitherDivider />
          {children}
        </div>
      </body>
    </html>
  );
}
