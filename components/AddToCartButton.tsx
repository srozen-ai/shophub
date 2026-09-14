"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types/product";

interface AddToCartButtonProps {
  product: Product;
  label?: string;
}

export default function AddToCartButton({
  product,
  label = "Añadir al carrito",
}: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  if (product.stock === 0) {
    return (
      <button
        disabled
        className="w-full cursor-not-allowed rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-500"
      >
        Sin stock
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`w-full rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors ${
        added ? "bg-emerald-600" : "bg-indigo-600 hover:bg-indigo-700"
      }`}
    >
      {added ? "✓ Agregado" : label}
    </button>
  );
}
// Sirve para el catalogo y para el detalle. 
