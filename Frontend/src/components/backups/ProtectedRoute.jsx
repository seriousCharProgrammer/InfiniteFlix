// components/ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// ProtectedRoute checks if the user is logged in
export const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to='/' />;
  }

  return children;
};

// GuestRoute checks if the user is logged out
export const GuestRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  if (user) {
    return <Navigate to='/home' />;
  }

  return children;
};
