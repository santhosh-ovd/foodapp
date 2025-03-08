'use client';

import { useState, useEffect, useMemo } from 'react';
import { IndianDish, PaginationParams, DishFilters } from '@/types/food';
import axiosInstance from '@/utils/axios';
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  MRT_PaginationState,
} from 'material-react-table';
import { Box, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { useRouter } from 'next/navigation';

interface DishListProps {
  onDishSelect: (dish: IndianDish) => void;
}

export function DishList({ onDishSelect }: DishListProps) {
  const [dishes, setDishes] = useState<IndianDish[]>([]);
  const [totalDishes, setTotalDishes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [filters, setFilters] = useState<DishFilters>({});
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Define columns
  const columns = useMemo<MRT_ColumnDef<IndianDish>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
      },
      {
        accessorKey: 'state',
        header: 'State',
      },
      {
        accessorKey: 'region',
        header: 'Region',
      },
      {
        accessorKey: 'prep_time',
        header: 'Prep Time',
        Cell: ({ row }) => (
          <span>
            {row.original.prep_time === -1 ? 'N/A' : `${row.original.prep_time} min`}
          </span>
        ),
      },
      {
        accessorKey: 'diet',
        header: 'Diet',
      },
      {
        accessorKey: 'course',
        header: 'Course',
      },
    ],
    [],
  );

  useEffect(() => {
    fetchDishes();
  }, [pagination.pageIndex, pagination.pageSize, filters]);

  const fetchDishes = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axiosInstance.get('/api/dishes', {
        params: {
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          ...filters
        }
      });
      setDishes(data.data);
      setTotalDishes(data.total);
    } catch (error) {
      setError('Failed to fetch dishes. Please try again.');
      console.error('Error fetching dishes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Diet</InputLabel>
          <Select
            value={filters.diet || ''}
            label="Diet"
            onChange={(e) => setFilters((prev:any) => ({ 
              ...prev, 
              diet: e.target.value || undefined 
            }))}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="vegetarian">Vegetarian</MenuItem>
            <MenuItem value="non vegetarian">Non-Vegetarian</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Course</InputLabel>
          <Select
            value={filters.course || ''}
            label="Course"
            onChange={(e) => setFilters(prev => ({ 
              ...prev, 
              course: e.target.value || undefined 
            }))}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="main course">Main Course</MenuItem>
            <MenuItem value="dessert">Dessert</MenuItem>
            <MenuItem value="starter">Starter</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <MaterialReactTable
        columns={columns}
        data={dishes}
        enableRowSelection={false}
        enableColumnFilters={false}
        enableColumnActions={false}
        enableSorting={true}
        enableTopToolbar={true}
        enableBottomToolbar={true}
        enablePagination={true}
        manualPagination
        rowCount={totalDishes}
        onPaginationChange={setPagination}
        state={{
          pagination,
          isLoading: loading,
        }}
        muiTableBodyRowProps={({ row }) => ({
          onClick: () => {
            console.log(row.original);
            router.push(`/dish/${encodeURIComponent(row.original.name)}`)
          },
          sx: { cursor: 'pointer' },
        })}
        muiTablePaperProps={{
          elevation: 0,
          sx: {
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
          },
        }}
        initialState={{
          density: 'comfortable',
          pagination: { pageIndex: 0, pageSize: 10 },
        }}
      />
    </Box>
  );
} 