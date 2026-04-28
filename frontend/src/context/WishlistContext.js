import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import axios from 'axios';

const WishlistContext = createContext();
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Read token internally — no need to pass it from every component
const getToken = () => {
  try {
    const u = localStorage.getItem('userInfo');
    return u ? JSON.parse(u).token : null;
  } catch { return null; }
};

const authHeader = () => {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
};

// ── Reducer ──────────────────────────────────────────────────
const wishlistReducer = (state, action) => {
  switch (action.type) {
    case 'SET_WISHLIST':
      return { ...state, wishlistItems: action.payload };
    case 'ADD_TO_WISHLIST': {
      const exists = state.wishlistItems.find((x) => x._id === action.payload._id);
      if (exists) return state;
      return { ...state, wishlistItems: [...state.wishlistItems, action.payload] };
    }
    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        wishlistItems: state.wishlistItems.filter((x) => x._id !== action.payload),
      };
    case 'CLEAR_WISHLIST':
      return { ...state, wishlistItems: [] };
    default:
      return state;
  }
};

// Initial state from localStorage (guest fallback)
const initialState = {
  wishlistItems: (() => {
    try {
      const s = localStorage.getItem('wishlistItems');
      return s ? JSON.parse(s) : [];
    } catch { return []; }
  })(),
};

// ── Provider ─────────────────────────────────────────────────
export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);

  // Sync to localStorage always (guest fallback)
  useEffect(() => {
    localStorage.setItem('wishlistItems', JSON.stringify(state.wishlistItems));
  }, [state.wishlistItems]);

  // Fetch from backend (called on login / page load when logged in)
  const fetchWishlist = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    try {
      const { data } = await axios.get(`${BASE_URL}/api/users/wishlist`, {
        headers: authHeader(),
      });
      dispatch({ type: 'SET_WISHLIST', payload: data });
    } catch (err) {
      console.error('fetchWishlist:', err.message);
    }
  }, []);

  // Merge local wishlist into backend on login, then fetch
  const mergeAndFetchWishlist = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    const localItems = (() => {
      try {
        const s = localStorage.getItem('wishlistItems');
        return s ? JSON.parse(s) : [];
      } catch { return []; }
    })();

    // Push each local item to backend (API is idempotent - no duplicates)
    for (const item of localItems) {
      try {
        await axios.post(
          `${BASE_URL}/api/users/wishlist`,
          { productId: item._id },
          { headers: authHeader() }
        );
      } catch { /* ignore individual failures */ }
    }

    // Clear local storage after merge
    localStorage.removeItem('wishlistItems');

    // Fetch the merged server state
    await fetchWishlist();
  }, [fetchWishlist]);

  // Add — works for both guest and logged-in
  const addToWishlist = useCallback(async (product) => {
    dispatch({ type: 'ADD_TO_WISHLIST', payload: product });

    const token = getToken();
    if (token) {
      try {
        await axios.post(
          `${BASE_URL}/api/users/wishlist`,
          { productId: product._id },
          { headers: authHeader() }
        );
      } catch (err) {
        console.error('addToWishlist:', err.message);
      }
    }
  }, []);

  // Remove — works for both guest and logged-in
  const removeFromWishlist = useCallback(async (productId) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });

    const token = getToken();
    if (token) {
      try {
        await axios.delete(`${BASE_URL}/api/users/wishlist/${productId}`, {
          headers: authHeader(),
        });
      } catch (err) {
        console.error('removeFromWishlist:', err.message);
      }
    }
  }, []);

  const isInWishlist = useCallback(
    (id) => state.wishlistItems.some((x) => x._id === id),
    [state.wishlistItems]
  );

  const clearWishlist = useCallback(() => {
    dispatch({ type: 'CLEAR_WISHLIST' });
    localStorage.removeItem('wishlistItems');
  }, []);

  return (
    <WishlistContext.Provider value={{
      wishlistItems: state.wishlistItems,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      fetchWishlist,
      mergeAndFetchWishlist,
      clearWishlist,
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
