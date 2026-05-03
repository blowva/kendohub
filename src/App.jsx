import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Affiliate from './pages/Affiliate';
import AffiliateAbout from './pages/AffiliateAbout';
import RefundPolicy from './pages/RefundPolicy';
import Track from './pages/Track';
import { About, Account, Policies, NotFound } from './pages/Misc';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <BrowserRouter>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/affiliate" element={<Affiliate />} />
              <Route path="/affiliate/about" element={<AffiliateAbout />} />
              <Route path="/about" element={<About />} />
              <Route path="/account" element={<Account />} />
              <Route path="/policies" element={<Policies />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/track" element={<Track />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </BrowserRouter>
      </CartProvider>
    </ThemeProvider>
  );
}
