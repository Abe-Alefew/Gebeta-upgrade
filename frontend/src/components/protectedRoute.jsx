import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/authContext.jsx';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return <div>Checking Gebeta status...</div>;

    if (!user) {
        // Redirect to login but save the current location so we can go back after login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/not-found" replace />; // Or a "Not Authorized" page
    }

    return children;
};

export default ProtectedRoute;