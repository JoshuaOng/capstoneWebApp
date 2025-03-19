import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppRouter from './routes/Router';
import { Elements } from '@stripe/react-stripe-js';
import {loadStripe} from "@stripe/stripe-js";
import { CartProvider } from './context/cartContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


//const stripePromise = loadStripe('pk_test_51QJnma08yS02cjemXBk87PGWFRhH3FCrKMMKJTjJ1ORJgCYuZDV3U3iqxdwCkgcLN7COrU8e03UE4LBVudCNEJp60061IzFEVO');
const stripePromise = loadStripe('pk_test_51QztLCQ1fayfJvU1mczDtGFBh9sbUWJOyypNXmqvF0vXz18DkYYtDK1wdCiB3RmV2tHBZQuJ0SL4iiBUj0uEp1Qs00WV64jGLG');


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Elements stripe={stripePromise}>
      <CartProvider>
        <AppRouter />
        <ToastContainer />
      </CartProvider>
    </Elements>
  </React.StrictMode>
);
// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <Elements stripe={stripePromise}>
//       <App />
//     </Elements>
//   </React.StrictMode>
// );
