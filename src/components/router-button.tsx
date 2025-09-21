"use client";

import { useRouter } from "next/navigation";

export default function RouterButton({
  title,
  styles,
  route,
}: {
  title: string;
  styles?: string;
  route: string;
}) {
  const router = useRouter();
  return (
    <button className="cursor-pointer" onClick={() => router.push(route)}>
      {title}
    </button>
  );
}
