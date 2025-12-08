import "./globals.css";
import "react-advanced-cropper/dist/style.css";

export const metadata = {
  title: "Prox AI",
  description: "Fitness and health AI assistant",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
