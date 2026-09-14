import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import type { Product } from "@/types/product";

export default function ProductCard({ product }: { product: Product}) {
    return (
        <article className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
            <Link href={`/productos/${product.id}`} className="block">
                <div className="relative h-48 w-full bg-slate-100">
                    <Image  
                        src={product.thumbnail}
                        alt={product.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-contain p-4"
                    />
                </div>
            </Link>

        <div className="flex flex-1 flex-col gap-2 p-4">
            <span className="text-xs uppercase tracking-wide text-indigo-600">
                {product.category}
            </span>

            <Link href={`/productos/${product.id}`}>
                <h2 className="line-clamp-2 font-semibold hover:underline">
                    {product.title}
                </h2>
            </Link>

            <div className="mt-auto flex items-baseline justify-between pt-2">
                <span className="text-lg font-bold">${product.price}</span>
                <span className="text-xs text-slate-500">
                    {product.stock} en stock
                </span>
            </div>

            <AddToCartButton product={product} />
        </div>
        </article>
    );
}
// Este no lleva "use client" ya que no necesita estado: solo
// renderiza y delega la interactividad a AddToCartButton.
