'use client';

import { useState } from 'react';
import { DishList } from '@/components/DishList';
import { DishSuggester } from '@/components/DishSuggester';
import { SearchHeader } from '@/components/SearchHeader';
import { IndianDish } from '@/types/food';
import { ProtectedLayout } from '@/components/ProtectedLayout';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const [selectedDish, setSelectedDish] = useState<IndianDish | null>(null);
  const { logout } = useAuth();

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex justify-end p-4">
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
        <SearchHeader onDishSelect={setSelectedDish} />
        
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8 text-center">
            Indian Cuisine Explorer
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Find Dishes by Ingredients</h2>
              <DishSuggester onDishSelect={setSelectedDish} />
            </section>
            
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">All Dishes</h2>
              <DishList onDishSelect={setSelectedDish} />
            </section>
          </div>
        </main>
      </div>
    </ProtectedLayout>
  );
}
