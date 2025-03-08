'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IndianDish } from '@/types/food';
import { useDebounce } from '@/hooks/useDebounce';
import axiosInstance from '@/utils/axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface SearchHeaderProps {
  onDishSelect: (dish: IndianDish) => void;
}

/**
 * Header component with auto-suggest search functionality
 */
export function SearchHeader({ onDishSelect }: SearchHeaderProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<IndianDish[]>([]);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        console.log('Fetching suggestions for:', debouncedQuery); // Debug log
        const { data } = await axiosInstance.get(`/api/dishes/search`, {
          params: { query: debouncedQuery }
        });
        
        console.log('Received suggestions:', data); // Debug log
        setSuggestions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  const handleDishSelect = (dish: IndianDish) => {
    onDishSelect(dish);
    setQuery('');
    setSuggestions([]);
    // Navigate using encoded dish name
    router.push(`/dish/${encodeURIComponent(dish.name)}`);
  };

  return (
    <header className="sticky top-0 bg-white dark:bg-gray-800 shadow-md z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search dishes by name, ingredients, or origin..."
            className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
          />
          
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto">
              {suggestions.map(dish => (
                <button
                  key={dish.name}
                  onClick={() => handleDishSelect(dish)}
                  className="w-full p-3 text-left hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <div className="font-medium">{dish.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {dish.state}, {dish.region}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 