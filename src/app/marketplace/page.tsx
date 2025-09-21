"use client";

import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type ProductDoc = {
  id: string;
  name: string;
  category: string;
  price: number | null;
  aiDescription?: string;
  createdAt?: Timestamp | null;
};

export default function MarketplacePage() {
  const [items, setItems] = useState<ProductDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    try {
      const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
      const unsub = onSnapshot(
        q,
        (snap) => {
          const rows: ProductDoc[] = [];
          snap.forEach((doc) => {
            const data = doc.data() as Omit<ProductDoc, "id">;
            rows.push({ id: doc.id, ...data });
          });
          setItems(rows);
          setLoading(false);
        },
        (e) => {
          setErr(e.message || "Failed to fetch products");
          setLoading(false);
        }
      );
      return () => unsub();
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Failed to set up listener";
      setErr(errorMessage);
      setLoading(false);
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto w-full py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl md:text-4xl font-bold">Marketplace</h1>
      </div>

      {err && (
        <div className="mb-6 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-red-700">
          {err}
        </div>
      )}

      {loading ? (
        <GridSkeleton />
      ) : items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductCard({ product }: { product: ProductDoc }) {
  const { name, category, price, aiDescription, createdAt } = product;

  const created =
    createdAt && "toDate" in createdAt ? createdAt.toDate() : undefined;

  return (
    <div className="rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition p-5 flex flex-col">
      <div className="mb-2">
        <h2 className="text-lg font-semibold leading-snug">{name}</h2>
      </div>

      <div className="mb-4 flex items-center gap-2 flex-wrap">
        <span className="inline-flex items-center rounded-full bg-primary/10 text-primary text-xs font-medium px-3 py-1">
          {category}
        </span>
        {typeof price === "number" && (
          <span className="text-sm font-medium">
            ₹{price.toLocaleString("en-IN")}
          </span>
        )}
        {created && (
          <span className="text-xs text-muted-foreground ml-auto">
            {created.toLocaleDateString()}
          </span>
        )}
      </div>

      {aiDescription ? (
        <div className="prose prose-sm max-w-none text-foreground line-clamp-[12]">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {aiDescription}
          </ReactMarkdown>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No description.</p>
      )}
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-gray-200 shadow-sm p-5 animate-pulse"
        >
          <div className="h-5 w-2/3 bg-gray-200 rounded mb-3" />
          <div className="h-4 w-1/3 bg-gray-200 rounded mb-2" />
          <div className="space-y-2">
            <div className="h-3 w-full bg-gray-200 rounded" />
            <div className="h-3 w-5/6 bg-gray-200 rounded" />
            <div className="h-3 w-4/6 bg-gray-200 rounded" />
          </div>
          <div className="mt-4 flex gap-2">
            <div className="h-9 w-24 bg-gray-200 rounded" />
            <div className="h-9 w-24 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed px-6 py-12 text-center">
      <h3 className="text-lg font-medium mb-1">No products yet</h3>
      <p className="text-sm text-muted-foreground">
        Add your first product from the dashboard and it will appear here.
      </p>
    </div>
  );
}
