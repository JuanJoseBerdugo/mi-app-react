import { createContext, useState, ReactNode } from "react";
import { ICartItem } from "./types";

interface CartContextType {
  carrito: ICartItem[];
  agregarAlCarrito: (item: ICartItem) => void;
  eliminarDelCarrito: (id: number) => void;
  total: number;
  totalItems: number;
}

export const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [carrito, setCarrito] = useState<ICartItem[]>([]);

  const agregarAlCarrito = (item: ICartItem) => {
    setCarrito((prev) => {
      const existe = prev.find((p) => p.id === item.id);
      if (existe) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, cantidad: p.cantidad + 1 } : p
        );
      }
      return [...prev, { ...item, cantidad: 1 }];
    });
  };

  const eliminarDelCarrito = (id: number) => {
    setCarrito((prev) => prev.filter((p) => p.id !== id));
  };

  const total = carrito.reduce((acc, item) => acc + item.price * item.cantidad, 0);
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <CartContext.Provider value={{ carrito, agregarAlCarrito, eliminarDelCarrito, total, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}
