"use client";
import { Package, Sparkles } from "lucide-react";
import { useState, ChangeEvent, FormEvent } from "react";

type FormDataState = {
  name: string;
  category: string;
  price: string;
  description: string;
  dimensions: string;
  images: File[];
};

export default function Dashboard() {
  const [formData, setFormData] = useState<FormDataState>({
    name: "",
    category: "",
    price: "",
    description: "",
    dimensions: "",
    images: [],
  });

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
    // do your submit logic here
    console.log(formData);
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

          {/* Product Name */}
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

          {/* Category */}
          <div className="space-y-2 mb-4">
            <label htmlFor="category" className="block text-sm font-medium">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={handleSelectChange}
              className="w-full  rounded-md border border-gray-300 px-3 py-2 text-base  focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="" className="" disabled>
                Choose a category
              </option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div className="space-y-2 mb-4">
            <label htmlFor="price" className="block text-sm font-medium">
              Price
            </label>
            <input
              id="price"
              type="number"
              inputMode="decimal"
              placeholder="Enter Price"
              value={formData.price}
              onChange={handleChange("price")}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          {/* Materials */}
          <div className="space-y-2 mb-4">
            <label htmlFor="materials" className="block text-sm font-medium">
              Materials
            </label>
            <input
              id="materials"
              placeholder="e.g., Cotton rope, wooden dowel"
              value={formData.materials}
              onChange={handleChange("materials")}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          {/* Description */}
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
        </div>

        {/* Right column: Images + Submit */}
        <div className="border col-span-1 border-gray-200 p-5 rounded-xl shadow-md h-fit">
          <div className="flex font-semibold items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-primary" />
            Media & Actions
          </div>
          <div className="text-muted-foreground font-medium text-[15px] mb-4">
            Add product photos and publish
          </div>

          {/* Images */}
          <div className="space-y-2 mb-6">
            <label htmlFor="images" className="block text-sm font-medium">
              Images
            </label>
            <input
              id="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImagesChange}
              className="block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-primary/10 file:text-primary file:px-3 file:py-2 hover:file:bg-primary/20"
            />
            {formData.images.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {formData.images.length} file(s) selected
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-primary text-primary-foreground px-4 py-2 font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            Save Product
          </button>
        </div>
      </form>
    </div>
  );
}
