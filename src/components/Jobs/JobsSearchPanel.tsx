"use client";

import { useState } from "react";
import { CiSearch } from "react-icons/ci";

type FiltersState = {
  title: string;
};

const initialFilters: FiltersState = {
  title: "",
};

export default function JobsSearchPanel() {
  const [filters, setFilters] = useState<FiltersState>(initialFilters);

  return (
    <div className="mb-12 w-full rounded-xs border border-gray-200 bg-white p-6 shadow-one md:p-8">
      <div className="space-y-6">
        <div className="flex overflow-hidden rounded-xs border border-gray-200 bg-white focus-within:border-blue-900">
          <span className="flex items-center border-r border-gray-200 bg-gray-50 px-4 py-3 text-body-color">
            <CiSearch className="text-xl" />
          </span>
          <input
            id="jobs-search-title"
            type="text"
            value={filters.title}
            onChange={(event) => setFilters((current) => ({ ...current, title: event.target.value }))}
            className="w-full px-4 py-3 text-sm text-black outline-none transition-colors placeholder:text-gray-400 placeholder:uppercase"
            placeholder="Busque sua vaga"
          />
        </div>

        <div className="border-body-color/15 border-t" />
      </div>
    </div>
  );
}
