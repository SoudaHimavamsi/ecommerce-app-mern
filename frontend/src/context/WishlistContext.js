import React, { createContext, useContext, useReducer, useEffect } from 'react';

const WishlistContext = createContext();

const wishlistReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_WISHLIST':
      const exists = state.wishlistItems.find(
        (x) => x._id === action.payload._id
      );
      if (exists) return state;
      return { ...state, wishlistItems: [...state.wishlistItems, action.payload] };

    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        wishlistItems: state.wishlistItems.filter(
          (x) => x._id !== action.payload
        ),
      };

    default:
      return state;
  }
};

const initialState = {
  wishlistItems: localStorage.getItem('wishlistItems')
    ? JSON.parse(localStorage.getItem('wishlistItems'))
    : [],
};

export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);

  useEffect(() => {
    localStorage.setItem('wishlistItems', JSON.stringify(state.wishlistItems));
  }, [state.wishlistItems]);

  const addToWishlist = (product) => {
    dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
  };

  const removeFromWishlist = (id) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: id });
  };

  const isInWishlist = (id) => {
    return state.wishlistItems.some((x) => x._id === id);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems: state.wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);