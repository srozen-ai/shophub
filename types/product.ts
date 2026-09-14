export interface Product {
    id: number;
    title: string;
    price: number;
    category: string;
    thumbnail: string;
    stock: number;
}

export interface ProductDetail extends Product {
    description: string;
    brand?: string;
    images: string[];
}

export interface CartItem {
    product: Product;
    quantity: number;
}
// Product es lo que devuelve el catalogo con select=
// ProductDetail es el objeto completo del endpoint individual
