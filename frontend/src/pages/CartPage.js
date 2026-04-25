import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CART_CSS = `
  .sk-cart-layout { display:grid; grid-template-columns:1fr 320px; gap:24px; align-items:start; }
  .sk-cart-col-headers { display:grid; grid-template-columns:1fr 120px 100px; gap:16px; padding:14px 24px; background:#f8f9fa; border-bottom:1px solid #f0f0f0; }
  .sk-cart-item { display:grid; grid-template-columns:1fr 120px 100px; gap:16px; padding:20px 24px; border-bottom:1px solid #f9f9f9; align-items:center; }

  @media (max-width: 640px) {
    .sk-cart-layout { grid-template-columns:1fr; }
    .sk-cart-col-headers { display:none; }
    .sk-cart-item {
      grid-template-columns: 1fr;
      gap: 12px;
      padding: 16px;
    }
    .sk-cart-qty-col { justify-content:flex-start; }
    .sk-cart-subtotal-col { text-align:left; }
    .sk-cart-subtotal-col::before { content:'Subtotal: '; font-size:12px; color:#999; font-weight:600; }
    .sk-summary-card { position:static !important; }
  }
`;
let cartCssInjected = false;

const CartPage = () => {
  const { cartItems, removeFromCart, addToCart } = useCart();
  const navigate = useNavigate();
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    if (!cartCssInjected) {
      const style = document.createElement('style');
      style.textContent = CART_CSS;
      document.head.appendChild(style);
      cartCssInjected = true;
    }
  }, []);

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const savings = cartItems.reduce((acc, item) => acc + Math.round(item.price * 0.1) * item.qty, 0);

  const handleRemove = (id) => {
    setRemovingId(id);
    setTimeout(() => { removeFromCart(id); setRemovingId(null); }, 300);
  };

  if (cartItems.length === 0) {
    return (
      <div style={styles.emptyPage}>
        <div style={styles.emptyBox}>
          <div style={styles.emptyIconBox}>
            <svg width='64' height='64' viewBox='0 0 24 24' fill='none' stroke='#d1d5db' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'>
              <circle cx='9' cy='21' r='1'/><circle cx='20' cy='21' r='1'/>
              <path d='M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6'/>
            </svg>
          </div>
          <h2 style={styles.emptyTitle}>Your cart is empty</h2>
          <p style={styles.emptyText}>Looks like you haven't added anything yet.<br />Start exploring our products!</p>
          <Link to='/' style={styles.shopBtn}>Browse Products →</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.heading}>Shopping Cart</h1>
          <p style={styles.subheading}>{totalItems} item{totalItems !== 1 ? 's' : ''} in your cart</p>
        </div>
        <Link to='/' style={styles.continueShopping}>← Continue Shopping</Link>
      </div>

      <div className='sk-cart-layout'>
        {/* Left: Cart Items */}
        <div style={styles.itemsSection}>
          <div className='sk-cart-col-headers'>
            <span style={styles.colHeader}>Product</span>
            <span style={{ ...styles.colHeader, textAlign: 'center' }}>Quantity</span>
            <span style={{ ...styles.colHeader, textAlign: 'right' }}>Subtotal</span>
          </div>

          {cartItems.map((item) => (
            <div
              key={item._id}
              className='sk-cart-item'
              style={{
                opacity: removingId === item._id ? 0 : 1,
                transform: removingId === item._id ? 'translateX(20px)' : 'translateX(0)',
                transition: 'opacity 0.3s, transform 0.3s',
              }}
            >
              {/* Product */}
              <div style={styles.productCol}>
                <Link to={`/product/${item._id}`}>
                  <img src={item.image} alt={item.name} style={styles.image} />
                </Link>
                <div style={styles.itemInfo}>
                  <Link to={`/product/${item._id}`} style={styles.itemName}>{item.name}</Link>
                  <p style={styles.itemBrand}>{item.brand}</p>
                  <p style={styles.itemUnitPrice}>₹{item.price.toLocaleString()} each</p>
                  <button onClick={() => handleRemove(item._id)} style={styles.removeBtn}>🗑️ Remove</button>
                </div>
              </div>

              {/* Quantity */}
              <div className='sk-cart-qty-col' style={styles.qtyCol}>
                <div style={styles.qtyControl}>
                  <button
                    onClick={() => item.qty > 1 && addToCart(item, item.qty - 1)}
                    style={{ ...styles.qtyBtn, opacity: item.qty <= 1 ? 0.4 : 1 }}
                    disabled={item.qty <= 1}
                  >−</button>
                  <span style={styles.qtyDisplay}>{item.qty}</span>
                  <button
                    onClick={() => item.qty < Math.min(item.countInStock, 5) && addToCart(item, item.qty + 1)}
                    style={{ ...styles.qtyBtn, opacity: item.qty >= Math.min(item.countInStock, 5) ? 0.4 : 1 }}
                    disabled={item.qty >= Math.min(item.countInStock, 5)}
                  >+</button>
                </div>
              </div>

              {/* Subtotal */}
              <div className='sk-cart-subtotal-col' style={styles.subtotalCol}>
                <p style={styles.subtotalPrice}>₹{(item.price * item.qty).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Summary */}
        <div className='sk-summary-card' style={styles.summaryCard}>
          <h3 style={styles.summaryTitle}>Order Summary</h3>
          <div style={styles.summaryRows}>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Subtotal ({totalItems} items)</span>
              <span style={styles.summaryValue}>₹{totalPrice.toLocaleString()}</span>
            </div>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>You save (est.)</span>
              <span style={{ ...styles.summaryValue, color: '#16a34a' }}>− ₹{savings.toLocaleString()}</span>
            </div>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Delivery</span>
              <span style={{ ...styles.summaryValue, color: '#16a34a', fontWeight: '700' }}>FREE</span>
            </div>
          </div>
          <div style={styles.summaryDivider} />
          <div style={styles.totalRow}>
            <span style={styles.totalLabel}>Total</span>
            <span style={styles.totalValue}>₹{totalPrice.toLocaleString()}</span>
          </div>
          <p style={styles.taxNote}>Inclusive of all taxes</p>
          <button onClick={() => navigate('/checkout')} style={styles.checkoutBtn}>
            Proceed to Checkout →
          </button>
          <div style={styles.trustRow}>
            <div style={styles.trustItem}><span style={styles.trustIcon}>🔒</span><span style={styles.trustText}>Secure checkout</span></div>
            <div style={styles.trustItem}><span style={styles.trustIcon}>↩️</span><span style={styles.trustText}>Easy returns</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '1100px', margin: '0 auto' },
  pageHeader: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'24px', flexWrap:'wrap', gap:'8px' },
  heading: { fontSize:'26px', fontWeight:'800', color:'#1a1a2e', margin:'0 0 4px' },
  subheading: { fontSize:'14px', color:'#999', margin:0 },
  continueShopping: { fontSize:'14px', color:'#4f46e5', textDecoration:'none', fontWeight:'500', marginTop:'6px', display:'inline-block' },
  itemsSection: { backgroundColor:'#fff', borderRadius:'16px', border:'1px solid #f0f0f0', boxShadow:'0 2px 12px rgba(0,0,0,0.05)', overflow:'hidden' },
  colHeader: { fontSize:'12px', fontWeight:'700', color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.6px' },
  productCol: { display:'flex', gap:'16px', alignItems:'flex-start' },
  image: { width:'80px', height:'80px', objectFit:'cover', borderRadius:'10px', flexShrink:0, border:'1px solid #f0f0f0' },
  itemInfo: { flex:1 },
  itemName: { fontSize:'14px', fontWeight:'600', color:'#1a1a2e', textDecoration:'none', display:'block', marginBottom:'4px', lineHeight:'1.4' },
  itemBrand: { fontSize:'12px', color:'#9ca3af', margin:'0 0 4px', fontWeight:'500', textTransform:'uppercase', letterSpacing:'0.5px' },
  itemUnitPrice: { fontSize:'13px', color:'#6b7280', margin:'0 0 10px' },
  removeBtn: { background:'none', border:'none', color:'#ef4444', fontSize:'12px', cursor:'pointer', padding:0, fontWeight:'600' },
  qtyCol: { display:'flex', justifyContent:'center' },
  qtyControl: { display:'flex', alignItems:'center', border:'1.5px solid #e5e7eb', borderRadius:'10px', overflow:'hidden' },
  qtyBtn: { backgroundColor:'#f9fafb', border:'none', width:'32px', height:'36px', fontSize:'18px', cursor:'pointer', fontWeight:'500', color:'#374151', display:'flex', alignItems:'center', justifyContent:'center' },
  qtyDisplay: { width:'36px', textAlign:'center', fontSize:'14px', fontWeight:'700', color:'#1a1a2e', borderLeft:'1px solid #e5e7eb', borderRight:'1px solid #e5e7eb', lineHeight:'36px' },
  subtotalCol: { textAlign:'right' },
  subtotalPrice: { fontSize:'16px', fontWeight:'800', color:'#1a1a2e', margin:0 },
  summaryCard: { backgroundColor:'#fff', borderRadius:'16px', padding:'24px', border:'1px solid #f0f0f0', boxShadow:'0 2px 12px rgba(0,0,0,0.05)', position:'sticky', top:'88px' },
  summaryTitle: { fontSize:'18px', fontWeight:'700', color:'#1a1a2e', margin:'0 0 20px' },
  summaryRows: { display:'flex', flexDirection:'column', gap:'12px' },
  summaryRow: { display:'flex', justifyContent:'space-between', alignItems:'center' },
  summaryLabel: { fontSize:'14px', color:'#6b7280' },
  summaryValue: { fontSize:'14px', fontWeight:'600', color:'#1a1a2e' },
  summaryDivider: { height:'1px', backgroundColor:'#f0f0f0', margin:'16px 0' },
  totalRow: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'4px' },
  totalLabel: { fontSize:'16px', fontWeight:'700', color:'#1a1a2e' },
  totalValue: { fontSize:'22px', fontWeight:'800', color:'#1a1a2e', letterSpacing:'-0.5px' },
  taxNote: { fontSize:'11px', color:'#9ca3af', margin:'0 0 20px', textAlign:'right' },
  checkoutBtn: { width:'100%', backgroundColor:'#0f1923', color:'#FFD814', border:'none', padding:'14px', borderRadius:'10px', fontWeight:'700', fontSize:'15px', cursor:'pointer', letterSpacing:'0.3px', marginBottom:'16px' },
  trustRow: { display:'flex', justifyContent:'space-around', padding:'12px 0 0', borderTop:'1px solid #f0f0f0' },
  trustItem: { display:'flex', flexDirection:'column', alignItems:'center', gap:'4px' },
  trustIcon: { fontSize:'18px' },
  trustText: { fontSize:'11px', color:'#9ca3af', fontWeight:'500' },
  emptyPage: { display:'flex', alignItems:'center', justifyContent:'center', minHeight:'60vh' },
  emptyBox: { textAlign:'center', padding:'60px 40px', backgroundColor:'#fff', borderRadius:'20px', border:'1px solid #f0f0f0', boxShadow:'0 4px 24px rgba(0,0,0,0.06)', maxWidth:'400px', width:'100%' },
  emptyIconBox: { marginBottom:'20px' },
  emptyTitle: { fontSize:'22px', fontWeight:'700', color:'#1a1a2e', margin:'0 0 10px' },
  emptyText: { fontSize:'14px', color:'#9ca3af', lineHeight:'1.7', margin:'0 0 24px' },
  shopBtn: { display:'inline-block', backgroundColor:'#0f1923', color:'#FFD814', padding:'13px 28px', borderRadius:'10px', textDecoration:'none', fontWeight:'700', fontSize:'14px', letterSpacing:'0.3px' },
};

export default CartPage;
