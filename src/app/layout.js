import "./globals.css"

export const metadata = {
  title: "Auth App",
  description: "Simple Auth System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      
      <body>{children}</body>
    </html>
  );
}