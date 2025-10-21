import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Miosotys Spa - Reservas",
  description: "Sistema de reservas para Miosotys Spa",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
