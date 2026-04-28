import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import axios from 'axios';

const CartContext = createContext();
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Read token internally
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
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, cartItems: action.payload };

    case 'ADD_TO_CART': {
      const exists = state.cartItems.find((x) => x._id === action.payload._id);
      if (exists) {
        return {
          ...state,
          cartItems: state.cartItems.map((x) =>
            x._id === action.payload._id ? { ...x, qty: action.payload.qty } : x
          ),
        };
      }
      return { ...state, cartItems: [...state.cartItems, action.payload] };
    }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cartItems: state.cartItems.filter((x) => x._id !== action.payload),
      };

    case 'CLEAR_CART':
      return { ...state, cartItems: [] };

    default:
      return state;
  }
};

const initialState = {
  cartItems: (() => {
    try {
      const s = localStorage.getItem('cartItems');
      return s ? JSON.parse(s) : [];
    } catch { return []; }
  })(),
};

// ── Provider ─────────────────────────────────────────────────
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Always sync to localStorage (guest fallback)
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
  }, [state.cartItems]);

  // Fetch cart from backend
  const fetchCart = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    try {
      const { data } = await axios.get(`${BASE_URL}/api/users/cart`, {
        headers: authHeader(),
      });
      dispatch({ type: 'SET_CART', payload: data });
    } catch (err) {
      console.error('fetchCart:', err.message);
    }
  }, []);

  // Merge local cart into backend on login, then fetch merged result
  const mergeAndFetchCart = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    const localItems = (() => {
      try {
        const s = localStorage.getItem('cartItems');
        return s ? JSON.parse(s) : [];
      } catch { return []; }
    })();

    if (localItems.length > 0) {
      try {
        await axios.post(
          `${BASE_URL}/api/users/cart/batch`,
          { items: localItems.map((i) => ({ productId: i._id, qty: i.qty })) },
          { headers: authHeader() }
        );
        localStorage.removeItem('cartItems');
      } catch (err) {
        console.error('mergeCart:', err.message);
      }
    }

    await fetchCart();
  }, [fetchCart]);

  // Add item — no token param needed
  const addToCart = useCallback(async (product, qty) => {
    dispatch({ type: 'ADD_TO_CART', payload: { ...product, qty } });

    const token = getToken();
    if (token) {
      try {
        await axios.post(
          `${BASE_URL}/api/users/cart`,
          { productId: product._id, qty },
          { headers: authHeader() }
        );
      } catch (err) {
        console.error('addToCart:', err.message);
      }
    }
  }, []);

  // Remove item — no token param needed
  const removeFromCart = useCallback(async (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });

    const token = getToken();
    if (token) {
      try {
        await axios.delete(`${BASE_URL}/api/users/cart/${productId}`, {
          headers: authHeader(),
        });
      } catch (err) {
        console.error('removeFromCart:', err.message);
      }
    }
  }, []);

  // Clear cart — called after order placed
  const clearCart = useCallback(async () => {
    dispatch({ type: 'CLEAR_CART' });
    localStorage.removeItem('cartItems');

    const token = getToken();
    if (token) {
      try {
        await axios.delete(`${BASE_URL}/api/users/cart`, {
          headers: authHeader(),
        });
      } catch (err) {
        console.error('clearCart:', err.message);
      }
    }
  }, []);

  return (
    <CartContext.Provider value={{
      cartItems: state.cartItems,
      addToCart,
      removeFromCart,
      clearCart,
      fetchCart,
      mergeAndFetchCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
