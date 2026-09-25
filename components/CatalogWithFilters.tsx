"use client";

import { useState, useMemo } from "react";
import ProductCard from "./ProductCard";
import type { Product } from "@/types/product";

interface CatalogWithFiltersProps {
  products: Product[];
}

export default function CatalogWithFilters({
  products,
}: CatalogWithFiltersProps) {
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    const min = minPrice === "" ? null : Number(minPrice);
    const max = maxPrice === "" ? null : Number(maxPrice);

    return products.filter((product) => {
      const matchesName =
        term === "" || product.title.toLowerCase().includes(term);
      const matchesMin = min === null || product.price >= min;
      const matchesMax = max === null || product.price <= max;

      return matchesName && matchesMin && matchesMax;
    });
  }, [products, search, minPrice, maxPrice]);

  const hasActiveFilters =
    search !== "" || minPrice !== "" || maxPrice !== "";

  const clearFilters = () => {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <section className="space-y-6">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-bold">Catálogo</h1>
        <span className="text-sm text-slate-500">
          {filteredProducts.length} de {products.length} productos
        </span>
      </div>

      {/* ---------- Barra de filtros ---------- */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr_auto] sm:items-end">
          <div>
            <label
              htmlFor="search"
              className="mb-1 block text-xs font-medium text-slate-600"
            >
              Buscar por nombre
            </label>
            <input
              id="search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ej: phone"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="minPrice"
              className="mb-1 block text-xs font-medium text-slate-600"
            >
              Precio mínimo
            </label>
            <input
              id="minPrice"
              type="number"
              min={0}
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="0"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="maxPrice"
              className="mb-1 block text-xs font-medium text-slate-600"
            >
              Precio máximo
            </label>
            <input
              id="maxPrice"
              type="number"
              min={0}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Sin límite"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={clearFilters}
            disabled={!hasActiveFilters}
            className="cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* ---------- Grilla o empty state ---------- */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <div className="mb-3 text-4xl">🔍</div>
          <h2 className="mb-1 font-semibold">No se encontraron productos</h2>
          <p className="mb-5 text-sm text-slate-500">
            Ningún artículo coincide con los filtros aplicados.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="cursor-pointer rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
