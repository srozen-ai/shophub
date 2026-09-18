"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { totalItems, dismissOrderConfirmation } = useCart();
  const [pulse, setPulse] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setPulse(true);
    const timer = setTimeout(() => setPulse(false), 300);
    return () => clearTimeout(timer);
  }, [totalItems]);

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Shop<span className="text-indigo-600">Hub</span>
        </Link>

        <Link
          href="/checkout"
          onClick={dismissOrderConfirmation}
          className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 transition hover:bg-slate-200"
        >
          <span className="text-sm font-medium">Carrito</span>
          <span
            className={`flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-sm font-semibold text-white transition-all duration-300 ${
              pulse ? "scale-125 bg-emerald-600" : "scale-100 bg-indigo-600"
            }`}
          >
            {totalItems}
          </span>
        </Link>
      </div>
    </header>
  );
}
