import "./globals.css";
import Providers from "./providers";
import HideDevTools from "@/components/HideDevTools";

export const metadata = {
  title: "Miosotys Spa - Reservas",
  description: "Sistema de reservas para Miosotys Spa",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <HideDevTools />
          {children}
        </Providers>
      </body>
    </html>
  );
}
