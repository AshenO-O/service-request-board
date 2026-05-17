'use client';

interface JobFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = ['All Jobs', 'Plumbing', 'Electrical', 'Painting', 'Joinery', 'Landscaping', 'Roofing'];

export default function JobFilters({ selectedCategory, onCategoryChange }: JobFiltersProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category === 'All Jobs' ? '' : category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${selectedCategory === (category === 'All Jobs' ? '' : category)
                ? 'bg-blue-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}