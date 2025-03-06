import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppRouter from './routes/Router';
import { Elements } from '@stripe/react-stripe-js';
import {loadStripe} from "@stripe/stripe-js";

const stripePromise = loadStripe('pk_test_51QJnma08yS02cjemXBk87PGWFRhH3FCrKMMKJTjJ1ORJgCYuZDV3U3iqxdwCkgcLN7COrU8e03UE4LBVudCNEJp60061IzFEVO');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Elements stripe={stripePromise}>
      <AppRouter />
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
