import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const LottieAnimation = () => {
    return (
        <View style={styles.container}>
            <LottieView
                source={require('../assets/MainScene.json')} // Replace with the path to your animation JSON file
                autoPlay
                loop
                speed={3}
                style={styles.animation}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        height: 0,
        width: 0,
    },
    animation: {
        width: 300,
        height: 300, // Adjust size based on your needs
    },
});

export default LottieAnimation;
