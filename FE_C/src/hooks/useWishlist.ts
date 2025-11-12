import { useState, useEffect } from 'react';
import type { WishlistProduct } from '../types/wishlist';

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState<WishlistProduct[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('wishlist');
    if (stored) {
      try {
        setWishlist(JSON.parse(stored));
      } catch (error) {
        setWishlist([]);
      }
    }
  }, []);

  const addToWishlist = (product: WishlistProduct) => {
    const stored = localStorage.getItem('wishlist');
    let currentWishlist: WishlistProduct[] = stored ? JSON.parse(stored) : [];

    const exists = currentWishlist.some(item => item._id === product._id);
    if (!exists) {
      currentWishlist.push(product);
      localStorage.setItem('wishlist', JSON.stringify(currentWishlist));
      setWishlist(currentWishlist);
      window.dispatchEvent(new Event('wishlistUpdated'));
      return true;
    }
    return false;
  };

  const removeFromWishlist = (productId: string) => {
    const stored = localStorage.getItem('wishlist');
    let currentWishlist: WishlistProduct[] = stored ? JSON.parse(stored) : [];

    currentWishlist = currentWishlist.filter(item => item._id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(currentWishlist));
    setWishlist(currentWishlist);
    window.dispatchEvent(new Event('wishlistUpdated'));
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlist.some(item => item._id === productId);
  };

  const clearWishlist = () => {
    localStorage.removeItem('wishlist');
    setWishlist([]);
    window.dispatchEvent(new Event('wishlistUpdated'));
  };

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
  };
};
