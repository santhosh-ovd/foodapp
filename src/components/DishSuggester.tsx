'use client';

import { useState } from 'react';
import { IndianDish } from '@/types/food';
import axiosInstance from '@/utils/axios';

interface DishSuggesterProps {
  onDishSelect: (dish: IndianDish) => void;
}

/**
 * Component to suggest dishes based on available ingredients
 */
export function DishSuggester({ onDishSelect }: DishSuggesterProps) {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [suggestedDishes, setSuggestedDishes] = useState<IndianDish[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAddIngredient = () => {
    if (inputValue.trim()) {
      setIngredients(prev => [...prev, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(prev => prev.filter((_, i) => i !== index));
  };

  const fetchPossibleDishes = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.post('/api/dishes/possible', {
        ingredients: ingredients
      });
      setSuggestedDishes(data);
    } catch (error) {
      console.error('Error fetching possible dishes:', error);
      setSuggestedDishes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (ingredients.length === 0) return;

    await fetchPossibleDishes();
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddIngredient()}
          placeholder="Enter an ingredient"
          className="flex-1 p-2 border rounded dark:bg-gray-700"
        />
        <button
          onClick={handleAddIngredient}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add
        </button>
      </div>

      {ingredients.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {ingredients.map((ingredient, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center gap-2"
            >
              {ingredient}
              <button
                onClick={() => handleRemoveIngredient(index)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={ingredients.length === 0 || loading}
        className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
      >
        {loading ? 'Finding dishes...' : 'Find Possible Dishes'}
      </button>

      {suggestedDishes.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Possible Dishes</h3>
          <div className="grid gap-4">
            {suggestedDishes.map(dish => (
              <div
                key={dish.name}
                onClick={() => onDishSelect(dish)}
                className="p-4 border rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <h4 className="font-medium">{dish.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {dish.ingredients}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 