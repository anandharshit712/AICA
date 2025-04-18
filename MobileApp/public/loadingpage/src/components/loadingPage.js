import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import loadingAnimation from '../assets/animation/loading-animation.json';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const LoadingPage = () => {
    const [status, setStatus] = useState('verifying');
    const [message, setMessage] = useState('Verifying your email...');
    const location = useLocation();

    useEffect(() => {
        const verifyToken = async () => {
            // Better URL token extraction
            const queryParams = new URLSearchParams(location.search);
            const token = queryParams.get('token');

            if (!token) {
                setStatus('error');
                setMessage('❌ No verification token found');
                return;
            }

            try {
                const response = await axios.post(
                    'http://10.5.122.238:3001/api/auth/verify-token',
                    { token },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (response.data.success) {
                    setStatus('success');
                    setMessage('✅ Verification successful! Please login in the app.');
                } else {
                    setStatus('error');
                    setMessage(`❌ ${response.data.message || 'Verification failed'}`);
                }
            } catch (error) {
                setStatus('error');
                setMessage(`❌ ${error.response?.data?.message || 'Verification failed. Please try again.'}`);
                console.error('Verification error:', error);
            }
        };

        verifyToken();
    }, [location.search]);

    return (
        <div style={styles.container}>
            <div style={styles.animation}>
                {/* Animation now loops until verification completes */}
                <Lottie
                    animationData={loadingAnimation}
                    loop={status !== 'verifying'}
                    autoplay={true}
                />
                <p style={{
                    ...styles.message,
                    color: status === 'error' ? 'red' : 'green'
                }}>
                    {message}
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5'
    },
    animation: {
        width: 300,
        height: 300,
        textAlign: 'center'
    },
    message: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: 'bold'
    }
};

export default LoadingPage;
