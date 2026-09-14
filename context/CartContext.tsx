"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { Product, CartItem } from "@/types/product";

interface CartContextValue {
    items: CartItem[];
    totalItems: number;
    addToCart: (product: Product) => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    const addToCart = (product: Product) => {
        // Evita leer estado obsoleto si hay vaios clics rapidos 
        // (esto pasaria si se usase setItems([...items, x]))
        setItems((prev) => {
            const existing = prev.find((item) => item.product.id === product.id);
        
            if (existing) {
                // Aqui .map() es responsable de crear referencias nuevas. 
                // (de esta forma, react no compara la misma referencia)
                // Permite re-renderizacion
                return prev.map((item) =>
                    item.product.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
                
                );
            }
            
            return [...prev, { product, quantity: 1 }];
        });
    };

    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider value= {{ items, totalItems, addToCart }}>
            {children}
        </CartContext.Provider>
    );
}

// este es el hook, responsable de encapsular el useContext y 
// lanzar error si se usa fuera del Provider
export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart debe usarse dentro de un CartProvider");
    }
    return context;
}
