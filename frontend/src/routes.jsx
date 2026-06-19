import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppProvider } from './context/AppContext.jsx';
import App from './App.jsx';
import Home from './pages/Home.jsx';
import ValidationResult from './pages/ValidationResult.jsx';
import About from './pages/About.jsx';

/**
 * Route Configuration
 * Defines all application routes
 */
export const routes = [
  {
    path: '/',
    element: <Home />,
    title: 'Home - Transaction Validator'
  },
  {
    path: '/results',
    element: <ValidationResult />,
    title: 'Results - Transaction Validator'
  },
  {
    path: '/results/:fileId',
    element: <ValidationResult />,
    title: 'Results - Transaction Validator'
  },
  {
    path: '/about',
    element: <About />,
    title: 'About - Transaction Validator'
  }
];

/**
 * Create router instance
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: routes.map(route => ({
      path: route.path,
      element: route.element
    }))
  }
]);

/**
 * Router Provider Component
 */
export const RouterProviderWithApp = () => {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
};

export default routes;