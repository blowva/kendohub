import { CartProvider } from './context/CartContext'
import { LocationProvider } from './context/LocationContext'
// ...
<LocationProvider>
  <CartProvider>
    <App />
  </CartProvider>
</LocationProvider>
