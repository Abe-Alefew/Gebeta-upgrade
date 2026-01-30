import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import './NotFound.css';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="not-found-page">
            <div className="not-found-container">
                <h1 className="error-code">404</h1>
                <h2 className="not-found-title">Page Not Found</h2>
                <p className="not-found-message">
                    Oops! The page you're looking for doesn't exist, has been moved, or you don't have permission to view it.
                </p>

                <Button
                    variant="primary"
                    size="large"
                    onClick={() => navigate('/')}
                >
                    Go Back Home
                </Button>
            </div>
        </div>
    );
};

export default NotFound;
