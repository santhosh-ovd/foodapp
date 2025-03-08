'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { IndianDish } from '@/types/food';
import { DishDetails } from '@/components/DishDetails';
import axiosInstance from '@/utils/axios';
import { ProtectedLayout } from '@/components/ProtectedLayout';

export default function DishPage() {
  const params = useParams();
  const [dish, setDish] = useState<IndianDish | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDish = async () => {
      try {
        const { data } = await axiosInstance.get(`/api/dishes/${params.name}`);
        setDish(data);
      } catch (error) {
        console.error('Error fetching dish:', error);
        setError('Failed to load dish details');
      }
    };

    if (params.name) {
      fetchDish();
    }
  }, [params.name]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!dish) {
    return <div>Loading...</div>;
  }

  return (
    <ProtectedLayout>
      <div className="container mx-auto px-4 py-8">
        <DishDetails dish={dish} />
      </div>
    </ProtectedLayout>
  );
} 