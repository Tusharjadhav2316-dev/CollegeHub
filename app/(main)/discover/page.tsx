import FilterPanel from "@/components/college/FilterPanel";
import SearchBar from "@/components/college/SearchBar";

export default function DiscoverPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-slate-800">Discover Colleges</h1>
      <div className="flex flex-col gap-6 md:flex-row">
        <FilterPanel />
        <div className="flex-1 space-y-4">
          <SearchBar />
          <div className="text-slate-500">Discover listing placeholder</div>
        </div>
      </div>
    </div>
  );
}
