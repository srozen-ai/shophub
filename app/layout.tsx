import type { Metadata } from "next";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShopHub",
  description: "Plataforma de comercio electronico",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  
  return (
    <html lang="es">
      <body className="bg-slate-50 text-slate-900 antialiased">
        <CartProvider>
          <Header />
          <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
// Permite cumplir el requisito de persistencia. El layout no se 
// desmonta al navegar entre rutas: Next solo reemplaza {children}
// Como CartProvider vive en el layout, su useState sobrevive
// a toda la navegacion. Si el provider estuviese dentro de page.tsx,
// el carrito se reiniciaria en cada ruta.
