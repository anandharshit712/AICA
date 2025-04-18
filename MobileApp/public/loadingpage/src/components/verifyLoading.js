import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import axios from 'axios';
import loadingAnimation from '../assets/animation/loading-animation.json';

const VerifyLoading = ({ token }) => {
    const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
    const [error, setError] = useState('');

    // Verify token on component mount
    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await axios.get(
                    `http://10.5.122.238:3001/api/auth/verify-email?token=${token}`
                );

                // If successful, redirect to mobile app after 3 seconds
                setStatus('success');
                setTimeout(() => {
                    window.location.href = 'yourapp://verified'; // Deep link to your mobile app
                }, 3000);
            } catch (err) {
                setStatus('error');
                setError(err.response?.data?.message || 'Verification failed');
            }
        };

        verifyToken();
    }, [token]);

    // Resend verification email
    const handleResend = async () => {
        try {
            setStatus('loading');
            await axios.post('http://10.5.122.238:3001/api/auth/resend-verification', {
                email: new URLSearchParams(window.location.search).get('email')
            });
            setStatus('success');
            alert('New verification email sent!');
        } catch (err) {
            setStatus('error');
            setError('Failed to resend email');
        }
    };

    return (
        <div style={styles.container}>
            {status === 'loading' && (
                <>
                    <Lottie animationData={loadingAnimation} style={styles.animation} />
                    <p>Verifying your email...</p>
                </>
            )}

            {status === 'success' && (
                <>
                    <h2>✅ Verification Successful!</h2>
                    <p>Redirecting to the app...</p>
                </>
            )}

            {status === 'error' && (
                <>
                    <h2>❌ Verification Failed</h2>
                    <p>{error}</p>
                    <button onClick={handleResend} style={styles.button}>
                        Resend Verification Email
                    </button>
                </>
            )}
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
        padding: '20px'
    },
    animation: {
        width: 150,
        height: 150
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    }
};

export default VerifyLoading;
