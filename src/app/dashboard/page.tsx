"use client";
import { Package, Sparkles } from "lucide-react";
import { useState, ChangeEvent, FormEvent } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import ReactMarkdown from "react-markdown";

type FormDataState = {
  name: string;
  category: string;
  price: string;
  description: string;
  images: File[];
};

export default function Dashboard() {
  const [formData, setFormData] = useState<FormDataState>({
    name: "",
    category: "",
    price: "",
    description: "",
    images: [],
  });

  const [aiText, setAiText] = useState<string>("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [addedMsg, setAddedMsg] = useState<string | null>(null);

  const categories = [
    "Jewelry & Accessories",
    "Home & Living",
    "Art & Collectibles",
    "Clothing & Shoes",
    "Toys & Games",
    "Craft Supplies",
    "Vintage Items",
  ];

  const handleChange =
    (key: keyof FormDataState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, category: e.target.value }));
  };

  const handleImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setFormData((prev) => ({ ...prev, images: files }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  const generateAI = async () => {
    setAiLoading(true);
    setAiError(null);
    setAddedMsg(null);
    setAiText("");

    try {
      const res = await fetch("/api/gemini/expand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          price: formData.price,
          description: formData.description,
        }),
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Failed to generate");
      }
      const data = (await res.json()) as { text: string };
      setAiText(data.text?.trim() || "");
    } catch (err: any) {
      setAiError(err.message || "Something went wrong");
    } finally {
      setAiLoading(false);
    }
  };

  const addToMarketplace = async () => {
    setAddedMsg(null);
    setAiError(null);

    if (!formData.name || !formData.category || !formData.price) {
      setAiError("Please fill name, category, and price first.");
      return;
    }
    if (!aiText) {
      setAiError("Generate AI content before adding to marketplace.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "products"), {
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        aiDescription: aiText,
        createdAt: serverTimestamp(),
      });

      setAddedMsg("Product successfully added to marketplace!");
      console.log("Saved doc with id:", docRef.id);
    } catch (err: any) {
      setAiError(err.message || "Failed to add to marketplace");
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full flex flex-col items-center py-10">
      <div className="inline-flex items-center gap-2 bg-primary/10 text-primary w-fit px-4 py-2 rounded-full text-sm font-medium mb-4">
        <Sparkles className="w-4 h-4" />
        AI-Powered Product Listing
      </div>

      <div className="text-4xl md:text-5xl font-bold text-balance mb-4">
        Share Your <span className="text-primary">Handcrafted</span> Creations
      </div>

      <p className="mb-5 text-xl text-center text-muted-foreground text-balance max-w-2xl mx-auto">
        Let AI help tell your product&apos;s story while you focus on what you
        do best – creating beautiful, unique pieces.
      </p>

      <form
        onSubmit={handleSubmit}
        className="grid lg:grid-cols-2 gap-8 w-full"
      >
        <div className="border col-span-1 border-gray-200 p-5 rounded-xl shadow-md">
          <div className="flex font-semibold items-center gap-2 mb-1">
            <Package className="w-5 h-5 text-primary" />
            Product Details
          </div>
          <div className="text-muted-foreground font-medium text-[15px] mb-4">
            Tell us about your handcrafted creation
          </div>

          <div className="space-y-2 mb-4">
            <label htmlFor="name" className="block text-sm font-medium">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              placeholder="e.g., Hand-woven Macrame Wall Hanging"
              value={formData.name}
              onChange={handleChange("name")}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div className="space-y-2 mb-4">
            <label htmlFor="category" className="block text-sm font-medium">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={handleSelectChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-base bg-white focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="" disabled>
                Choose a category
              </option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2 mb-4">
            <label htmlFor="price" className="block text-sm font-medium">
              Price ($)
            </label>
            <input
              id="price"
              type="number"
              inputMode="decimal"
              placeholder="Enter price"
              value={formData.price}
              onChange={handleChange("price")}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium">
              Basic Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              placeholder="Briefly describe your product — AI will help enhance this later"
              value={formData.description}
              onChange={handleChange("description")}
              rows={4}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <button
            type="button"
            onClick={generateAI}
            disabled={aiLoading}
            className="mt-6 w-full rounded-lg bg-primary text-white px-4 py-2 font-medium  hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/40 inline-flex items-center justify-center gap-2"
          >
            <Sparkles className=" text-white w-4 h-4" />
            {aiLoading ? "Generating..." : "Generate AI Content"}
          </button>
        </div>

        <div className="border col-span-1 border-gray-200 p-5 rounded-xl shadow-md h-fit">
          <div className="text-xl font-semibold mb-4">AI-Generated Content</div>

          <div
            className={`rounded-xl px-4 py-5 mb-4 ${
              addedMsg
                ? " border-2  border-emerald-700/40"
                : "bg-muted/20 border border-muted/30"
            }`}
          >
            {!aiText && !aiError && !addedMsg && (
              <p className="text-muted-foreground">
                Fill out the product form and click{" "}
                <b>&quot;Generate AI Content&quot;</b> to see AI-powered
                descriptions and stories.
              </p>
            )}

            {aiError && <p className="text-red-500">{aiError}</p>}

            {addedMsg && (
              <div className="flex items-center justify-between">
                <p className="text-emerald-500 font-medium"> {addedMsg}</p>
                <button
                  type="button"
                  className="rounded-md bg-white/10 px-3 py-1 text-sm border cursor-pointer border-emerald-600/40 hover:bg-white/20"
                >
                  View in Marketplace
                </button>
              </div>
            )}

            {aiText && !addedMsg && (
              <div className="prose prose-sm text-foreground">
                <ReactMarkdown>{aiText}</ReactMarkdown>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={addToMarketplace}
              disabled={!aiText}
              className="inline-flex items-center gap-2 rounded-md bg-primary text-white px-4 py-2 text-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-teal-400/50 disabled:opacity-60 cursor-pointer"
            >
              Add to Marketplace
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
