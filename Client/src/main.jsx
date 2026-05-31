import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AddressProvider } from './context/AddressContext';
import { CommerceProvider } from './context/CommerceContext';
import { ProductsProvider } from './context/ProductsContext';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ProductsProvider>
        <CommerceProvider>
          <AddressProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </AddressProvider>
        </CommerceProvider>
      </ProductsProvider>
    </BrowserRouter>
  </StrictMode>
);
