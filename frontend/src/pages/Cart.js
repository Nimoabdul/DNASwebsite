import React, { useContext, useState } from 'react';
import { CartContext } from '../CartContext';
import './Cart.css';

const Cart = () => {
  const { cartItems, updateQuantity, removeItem, clearCart } = useContext(CartContext);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const calculateTotal = () => 
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckout = () => {
    setShowPayment(true);
  };

  const processPayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here you would typically call your payment API
      console.log('Processing payment with:', paymentInfo);
      console.log('Cart items:', cartItems);
      
      // Clear cart on successful payment
      clearCart();
      alert('Payment successful! Thank you for your purchase.');
      setShowPayment(false);
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="cart-container container my-5">
      <div className="row">
        {/* Left: Products */}
        <div className="col-lg-8">
          {cartItems.map((item) => (
            <div key={`${item.id}-${item.size}-${item.color}`} className="cart-item d-flex mb-4">
              <img src={item.imageUrl} alt={item.name} className="cart-img" />
              <div className="ms-3 flex-grow-1">
                <h5 className="mb-1">{item.name}</h5>
                <p className="mb-1">
                  <strong>Color:</strong> {item.color} | <strong>Size:</strong> {item.size}
                </p>
                <p className="price">${item.price.toFixed(2)}</p>
                <div className="quantity-controls d-flex align-items-center mb-2">
                  <button
                    className="btn btn-outline-dark btn-sm me-2"
                    onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="btn btn-outline-dark btn-sm ms-2"
                    onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <button
                  className="btn btn-link text-danger p-0"
                  onClick={() => removeItem(item.id, item.size, item.color)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Summary */}
        <div className="col-lg-4">
          <div className="summary-box p-4 border rounded bg-light">
            <h5 className="mb-4">Order summary</h5>
            <div className="d-flex justify-content-between mb-2">
              <span>Item(s) subtotal</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Shipping</span>
              <span>TBD</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Estimated tax</span>
              <span>TBD</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between fw-bold">
              <span>Order total</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
            <button 
              className="btn btn-dark w-100 mt-4"
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="modal-backdrop">
          <div className="payment-modal">
            <div className="modal-header">
              <h4>Payment Information</h4>
              <button 
                className="close-btn"
                onClick={() => setShowPayment(false)}
                disabled={isProcessing}
              >
                &times;
              </button>
            </div>
            <form onSubmit={processPayment}>
              <div className="form-group">
                <label>Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={paymentInfo.cardNumber}
                  onChange={handlePaymentChange}
                  placeholder="1234 5678 9012 3456"
                  required
                  pattern="[\d ]{16,19}"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input
                    type="text"
                    name="expiry"
                    value={paymentInfo.expiry}
                    onChange={handlePaymentChange}
                    placeholder="MM/YY"
                    required
                    pattern="\d{2}/\d{2}"
                  />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    value={paymentInfo.cvv}
                    onChange={handlePaymentChange}
                    placeholder="123"
                    required
                    pattern="\d{3,4}"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Name on Card</label>
                <input
                  type="text"
                  name="name"
                  value={paymentInfo.name}
                  onChange={handlePaymentChange}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="order-summary">
                <h5>Order Total: ${calculateTotal().toFixed(2)}</h5>
              </div>
              <button 
                type="submit" 
                className="btn btn-dark w-100"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Confirm Payment'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;