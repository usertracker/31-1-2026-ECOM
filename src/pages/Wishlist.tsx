import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/ProductCard';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Wishlist = () => {
  const { wishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-100">
        <div className="bg-gray-200 p-6 rounded-full mb-4">
            <Heart size={48} className="text-gray-400" />
        </div>
        <h2 className="text-xl font-medium mb-2">Empty Wishlist</h2>
        <p className="text-gray-500 mb-6">You have no items in your wishlist. Start adding!</p>
        <Link to="/" className="bg-blue-600 text-white px-8 py-2 font-medium shadow-sm rounded-sm hover:bg-blue-700">
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-xl font-semibold mb-6">My Wishlist ({wishlist.length})</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};
