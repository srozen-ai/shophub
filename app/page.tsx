import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types/product";

const CATALOG_URL = 
  "https://dummyjson.com/products?limit=8&select=id,title,price,category,thumbnail,stock";

async function getProducts(): Promise<Product[]> {
  const res = await fetch(CATALOG_URL, { cache: "no-store" });
  if (!res.ok) throw new Error("No fue posible cargar el catalogo");
  const data = await res.json();
  return data.products;
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <section>
        <h1 className="mb-6 text-2x1 font-bold">Catalogo</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
    </section>
  );
}
// El componente async hace fetch directo, sin useEffect ni
// estado de loading. El HTML llega ya armado
