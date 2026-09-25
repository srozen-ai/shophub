import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";
import type { ProductDetail } from "@/types/product";

async function getProduct(id: string): Promise<ProductDetail | null> {
  const res = await fetch(`https://dummyjson.com/products/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function ProductoPage({ params, }: { params: Promise<{ id: string }>;}) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) notFound();
    return (
        <section className="space-y-6">
            <Link href="/" className="text-sm text-indigo-600 hover:underline">
                ← Volver al catálogo
            </Link>

            <div className="grid gap-8 rounded-xl border border-slate-200 bg-white p-6 md:grid-cols-2">
                <div className="relative h-80 w-full rounded-lg bg-slate-100">
                    <Image
                        src={product.thumbnail}
                        alt={product.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-contain p-6"
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <span className="text-xs uppercase tracking-wide text-indigo-600">
                        {product.category}
                        {product.brand && ` · ${product.brand}`}
                    </span>

                    <h1 className="text-2xl font-bold text-slate-900">{product.title}</h1>
                    <p className="text-2xl font-semibold">${product.price}</p>
                    <p className="text-sm text-slate-500">
                        {product.stock} unidades disponibles
                    </p>
                    <p className="leading-relaxed text-slate-700">
                        {product.description}
                    </p>
                    
                    <div className="mt-auto pt-4">
                        <AddToCartButton product={product} label="Añadir a mi carrito" />
                    </div>
                </div>
            </div>
        </section>
    );
}
// La carpeta [id] crea el segmento dinamico, hay una version para cada producto

