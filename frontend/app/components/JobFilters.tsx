'use client';

interface JobFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = ['All', 'Plumbing', 'Electrical', 'Painting', 'Joinery', 'Other'];

export default function JobFilters({ selectedCategory, onCategoryChange }: JobFiltersProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category === 'All' ? '' : category)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
            ${selectedCategory === (category === 'All' ? '' : category)
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}