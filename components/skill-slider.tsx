"use client";

import { useState } from "react";

export function SkillSlider({ id, name, category }: { id: string; name: string; category: string }) {
  const [value, setValue] = useState(0);
  return (
    <label className="flex items-center gap-4 rounded-lg border p-4">
      <span className="flex-1">
        <span className="block font-medium">{name}</span>
        <span className="text-sm text-muted-foreground">{category}</span>
      </span>
      <input
        type="range"
        min={0}
        max={5}
        step={1}
        name={`score_${id}`}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-40"
      />
      <span className="w-6 text-center font-mono">{value}</span>
    </label>
  );
}
