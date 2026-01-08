import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Docs",
  description: "API documentation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}


