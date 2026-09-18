"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

interface FormData {
  fullName: string;
  email: string;
  paymentMethod: string;
  acceptedTerms: boolean;
}

const INITIAL_FORM: FormData = {
  fullName: "",
  email: "",
  paymentMethod: "",
  acceptedTerms: false,
};

const EMAIL_REGEX =
  /^[A-Za-z0-9](?:[A-Za-z0-9._%+-]*[A-Za-z0-9])?@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/;

function validateEmail(value: string): string {
  const email = value.trim();

  if (email === "") return "El correo es obligatorio";
  if (email.length > 254) return "El correo es demasiado largo";
  if (email.includes("..")) return "El correo no puede tener puntos consecutivos";
  if (!EMAIL_REGEX.test(email)) return "Ingrese un correo electrónico válido";

  return "";
}

export default function CheckoutPage() {
  const {
    items,
    totalPrice,
    totalItems,
    lastOrderAt,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    completeOrder,
  } = useCart();

  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [touched, setTouched] = useState({ fullName: false, email: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const errors = {
    fullName:
      form.fullName.trim().length < 5
        ? "El nombre debe tener al menos 5 caracteres"
        : "",
    email: validateEmail(form.email),
  };

  const isFormValid =
    !errors.fullName &&
    !errors.email &&
    form.paymentMethod !== "" &&
    form.acceptedTerms &&
    items.length > 0;

  const showConfirmation = lastOrderAt !== null && items.length === 0;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));

    if (name === "fullName" || name === "email") {
      setTouched((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    completeOrder();
    setForm(INITIAL_FORM);
    setTouched({ fullName: false, email: false });
    setIsSubmitting(false);
  };

  if (showConfirmation) {
    return (
      <section className="mx-auto max-w-md rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <div className="mb-3 text-5xl">✓</div>
        <h1 className="mb-2 text-2xl font-bold text-emerald-800">
          ¡Pedido confirmado!
        </h1>
        <p className="mb-6 text-sm text-emerald-700">
          Tu orden fue procesada correctamente. El carrito quedó vacío.
        </p>
        <Link
          href="/"
          className="inline-block rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Volver al catálogo
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <Link href="/" className="text-sm text-indigo-600 hover:underline">
        ← Seguir comprando
      </Link>

      <h1 className="text-2xl font-bold">Finalizar compra</h1>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* ---------- Resumen ---------- */}
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 font-semibold">Resumen del pedido</h2>

          {items.length === 0 ? (
            <p className="text-sm text-slate-500">
              Tu carrito está vacío. Agrega productos desde el catálogo.
            </p>
          ) : (
            <>
              <ul className="divide-y divide-slate-100">
                {items.map(({ product, quantity }) => (
                  <li key={product.id} className="flex items-center gap-3 py-3">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                      <Image
                        src={product.thumbnail}
                        alt={product.title}
                        fill
                        sizes="64px"
                        className="object-contain p-1"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {product.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        ${product.price} c/u · Subtotal: $
                        {(product.price * quantity).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => decreaseQuantity(product.id)}
                        className="h-7 w-7 cursor-pointer rounded border border-slate-300 hover:bg-slate-100"
                        aria-label={`Disminuir cantidad de ${product.title}`}
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm font-semibold">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => increaseQuantity(product.id)}
                        className="h-7 w-7 cursor-pointer rounded border border-slate-300 hover:bg-slate-100"
                        aria-label={`Aumentar cantidad de ${product.title}`}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromCart(product.id)}
                        className="ml-1 cursor-pointer text-xs text-red-600 hover:underline"
                      >
                        Eliminar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
                <span className="text-sm text-slate-600">
                  {totalItems} artículo{totalItems !== 1 && "s"}
                </span>
                <span className="text-xl font-bold">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>

              <button
                type="button"
                onClick={clearCart}
                className="mt-3 cursor-pointer text-xs text-slate-500 hover:underline"
              >
                Vaciar carrito
              </button>
            </>
          )}
        </div>

        {/* ---------- Formulario ---------- */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-4 rounded-xl border border-slate-200 bg-white p-6"
        >
          <h2 className="font-semibold">Datos de facturación</h2>

          <div>
            <label htmlFor="fullName" className="mb-1 block text-sm font-medium">
              Nombre completo
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={form.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            />
            {touched.fullName && errors.fullName && (
              <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Correo de facturación
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            />
            {touched.email && errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="paymentMethod"
              className="mb-1 block text-sm font-medium"
            >
              Método de pago
            </label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={form.paymentMethod}
              onChange={handleChange}
              className="w-full cursor-pointer rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            >
              <option value="">Seleccione una opción</option>
              <option value="tarjeta">Tarjeta de crédito</option>
              <option value="pse">PSE</option>
              <option value="contraentrega">Pago contra entrega</option>
            </select>
          </div>

          <label className="flex cursor-pointer items-start gap-2 text-sm">
            <input
              name="acceptedTerms"
              type="checkbox"
              checked={form.acceptedTerms}
              onChange={handleChange}
              className="mt-0.5 cursor-pointer"
            />
            <span>Acepto los términos y condiciones de la tienda</span>
          </label>

          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="w-full cursor-pointer rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isSubmitting ? "Procesando pedido..." : "Confirmar pedido"}
          </button>
        </form>
      </div>
    </section>
  );
}
