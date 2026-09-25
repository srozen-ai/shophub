import CatalogWithFilters from "@/components/CatalogWithFilters";
import type { Product } from "@/types/product";

const CATALOG_URL =
  "https://dummyjson.com/products?limit=30&select=id,title,price,category,thumbnail,stock";

async function getProducts(): Promise<Product[]> {
  const res = await fetch(CATALOG_URL, { cache: "no-store" });
  if (!res.ok) throw new Error("No fue posible cargar el catalogo");
  const data = await res.json();
  return data.products;
}

export default async function HomePage() {
  const products = await getProducts();

  return <CatalogWithFilters products={products} />;
}
// La pagina sigue siendo Server Component y hace el fetch.
// Los productos se pasan por props al componente de cliente,
// que es el unico que necesita estado para los filtros.
