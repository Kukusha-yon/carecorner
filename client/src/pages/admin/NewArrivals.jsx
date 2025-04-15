import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getAdminNewArrivals, deleteNewArrival } from '../../services/newArrivalService';
import { formatDate } from '../../utils/formatDate';
import { useAuth } from '../../context/AuthContext';

const NewArrivals = () => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  // Fetch new arrivals
  const { data: newArrivals, isLoading: isLoadingNewArrivals, error } = useQuery({
    queryKey: ['adminNewArrivals'],
    queryFn: getAdminNewArrivals,
    enabled: !!user && user.role === 'admin',
    onError: (error) => {
      if (error.response?.status === 401) {
        toast.error('Please log in to access this page');
        navigate('/login');
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to access this page');
        navigate('/');
      } else {
        toast.error('Error loading new arrivals');
      }
    }
  });

  // Delete new arrival mutation
  const deleteMutation = useMutation({
    mutationFn: deleteNewArrival,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminNewArrivals'] });
      toast.success('New arrival deleted successfully');
    },
    onError: (error) => {
      if (error.response?.status === 401) {
        toast.error('Please log in to perform this action');
        navigate('/login');
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to perform this action');
      } else {
        toast.error(error.response?.data?.message || 'Error deleting new arrival');
      }
    },
  });

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this new arrival?')) {
      setIsLoading(true);
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting new arrival:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">You do not have permission to access this page</div>
      </div>
    );
  }

  if (isLoadingNewArrivals) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">Error loading new arrivals</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">New Arrivals</h1>
        <Link
          to="/admin/new-arrivals/new"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300"
        >
          Add New Arrival
        </Link>
      </div>

      {newArrivals?.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <p className="text-gray-500">No new arrivals found. Add your first new arrival!</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {newArrivals?.map((newArrival) => (
                  <tr key={newArrival._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={newArrival.image || 'https://placehold.co/100x100?text=No+Image'}
                          alt={newArrival.name}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{newArrival.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {newArrival.productId?.name || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${newArrival.price?.toFixed(2) || '0.00'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{newArrival.category || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(newArrival.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to={`/admin/new-arrivals/${newArrival._id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(newArrival._id)}
                        disabled={isLoading}
                        className="text-red-600 hover:text-red-900"
                      >
                        {isLoading ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewArrivals; 