import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsAPI } from '../utils/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Table from '../components/ui/Table';
import usePagination from '../hooks/usePagination';
import useSearch from '../hooks/useSearch';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../services/productService';
import ProductCard from '../components/ui/ProductCard';
import CategoryFilter from '../components/ui/CategoryFilter';

const Products = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');

  const {
    filters,
    searchTerm,
    sortBy,
    sortOrder,
    updateFilter,
    updateSearch,
    updateSort,
    clearFilters,
    clearSort,
    resetSearch,
  } = useSearch({
    category: category || '',
    minPrice: '',
    maxPrice: '',
    inStock: false,
  });

  const {
    page,
    limit,
    total,
    loading: paginationLoading,
    totalPages,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    changeLimit,
    setTotal,
  } = usePagination(1, 12);

  const { data: productsData, isLoading, error } = useQuery({
    queryKey: ['products', page, limit, searchTerm, sortBy, sortOrder, filters],
    queryFn: () => getProducts({
      page,
      limit,
      search: searchTerm,
      sortBy,
      sortOrder,
      ...filters,
    }),
  });

  const products = productsData?.products || [];
  const totalProducts = productsData?.total || 0;

  // Update total when products data changes
  useEffect(() => {
    if (totalProducts) {
      setTotal(totalProducts);
    }
  }, [totalProducts, setTotal]);

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    updateSearch(formData.get('search'));
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateFilter(name, type === 'checkbox' ? checked : value);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      updateSort(field, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      updateSort(field, 'asc');
    }
  };

  const handleReset = () => {
    resetSearch();
    clearSort();
    goToPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">Error loading products: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      
      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products?.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Products; 