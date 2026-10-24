import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Medha EdTech",
  description: "Learning platform",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bn">
      <body>{children}</body>
    </html>
  );
}