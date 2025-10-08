import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Digital-X | Smart Digital Marketing Agency",
    template: "%s | Digital-X",
  },
  description:
    "Digital-X is a next-generation digital marketing and web development agency. We help businesses grow through SEO, branding, content, social media, and technology-driven solutions.",
  keywords: [
    "Digital Marketing Agency",
    "SEO Services",
    "Web Development",
    "Branding Agency",
    "Social Media Marketing",
    "PPC Advertising",
    "Digital-X",
    "Online Business Growth",
    "Website Design",
  ],
  authors: [{ name: "Digital-X Team" }],
  creator: "Digital-X",
  publisher: "Digital-X",
  metadataBase: new URL("https://www.digital-x.com"), // <-- change to your real domain later
  alternates: {
    canonical: "https://www.digital-x.com",
  },
  openGraph: {
    title: "Digital-X | Empower Your Business with Digital Marketing",
    description:
      "Boost your brand visibility and sales with Digital-X — a results-driven marketing and web design agency.",
    url: "https://www.digital-x.com",
    siteName: "Digital-X",
    images: [
      {
        url: "/og-image.jpg", // place your OG image in /public folder
        width: 1200,
        height: 630,
        alt: "Digital-X - Digital Marketing Agency",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital-X | Smart Digital Marketing Agency",
    description:
      "Digital-X helps businesses grow online with SEO, Ads, and Design solutions.",
    creator: "@DigitalXOfficial", // optional — use your Twitter handle
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/butt.png", // your favicon/logo
    shortcut: "/butt.png",
    apple: "/butt.png",
  },
  category: "Digital Marketing",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
