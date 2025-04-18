import React, {useRef, useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Animated } from 'react-native';

// @ts-ignore
export default function LoginPage({navigation}){
    const [email, setemail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const flipAnimation = useRef(new Animated.Value(0)).current;

    // Handles login
    const handleLogin = async () => {
        try {
            const response = await fetch('http://10.5.122.238:3001/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({email, password}),
            });
            const data = await response.json();
            if (response.ok) {
                // Alert.alert('Login Successful', 'You are logged in.');
                navigation.navigate('Main');
            } else {
                Alert.alert('Login Failed', data.message || 'Invalid Credentials');
            }
        } catch (error) {
            Alert.alert('Error', 'An error occurred during login. Please try again.');
            console.log(error)
        }
    };

    // Handles Registration
    const handleRegister = async () => {
        try {
            const response = await fetch('http://10.5.122.238:3001/api/auth/register', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, password}),
            });
            const data = await response.json();
            if (response.ok) {
                Alert.alert('Registration Successful', 'You can now log in.');
                setIsLogin(true);
            } else {
                Alert.alert('Registration Failed', data.message || 'Unable to register');
            }
        } catch (error) {
            Alert.alert('Error', 'An error occurred during registration. Please try again later.',);
        }
    };
    // Card flip animation
    const flipCard = () => {
        Animated.timing(flipAnimation, {
            toValue: isLogin ? 180 : 0,
            duration: 500,
            useNativeDriver: true,
        }).start();
        setIsLogin(!isLogin);
    };
    const frontInterpolate = flipAnimation.interpolate({
        inputRange: [0, 180],
        outputRange: ['0deg', '180deg'],
    });
    const backInterpolate = flipAnimation.interpolate({
        inputRange: [0, 180],
        outputRange: ['180deg', '360deg'],
    });
    const flipStyle = {
        transform: [{
            rotateY: isLogin ? frontInterpolate : backInterpolate,
        }],
    };
    return (
        <View style={styles.container}>
            <Animated.View style={ flipStyle }>
                {isLogin ? (
                    //LoginForm
                    <View style={styles.card}>
                        <Text style={styles.title}>Login</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                placeholderTextColor="#011514"
                                value={email}
                                onChangeText={setemail}
                                autoCapitalize="none" />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor="#011514"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={true} />
                        <TouchableOpacity style={styles.button} onPress={handleLogin}>
                            <Text style={styles.buttonText}>Login</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    //Register Form
                    <View style={styles.card}>
                        <Text style={styles.title}>Register</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor="#011514"
                            value={email}
                            onChangeText={setemail}
                            autoCapitalize="none"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor="#011514"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={true}
                        />
                        <TouchableOpacity style={styles.button} onPress={handleRegister}>
                            <Text style={styles.buttonText}>Register</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </Animated.View>
            <TouchableOpacity style={styles.flipButton} onPress={flipCard}>
                <Text style={styles.flipButtonText}>
                    {isLogin ? 'Go to Register' : 'Go to Login'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E3FDFD',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    card:{
        width: 300,
        height: 300,
        padding: 20,
        borderRadius: '15%',
        backgroundColor: '#D7FBE8',
        elevation: 8,
        // shadowColor: '#62D2A2',
        shadowOffset: {
            width: 1,
            height: 3,
        },
        shadowOpacity: 0.6,
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 50,
    },
    input: {
        width: 230,
        height: 40,
        padding: 10,
        borderWidth: 0.5,
        borderRadius: 20,
        margin: 12,
        borderColor: '#6dc5b5',
        backgroundColor: '#DEF5E5',
        paddingHorizontal: 15,
    },
    button: {
        marginTop: 20,
        width: 90,
        height: 35,
        borderRadius: 10,
        backgroundColor: '#9ED5C5',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8,
        shadowOffset: {
            width: 1,
            height: 3,
        },
        shadowOpacity: 0.6,
        shadowRadius: 4,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 300,
    },
    flipButton: {
        marginTop: 20,
        width: 190,
        height: 35,
        borderRadius: 10,
        backgroundColor: '#9ED5C5',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8,
        shadowOffset: {
            width: 1,
            height: 3,
        },
        shadowOpacity: 0.6,
        shadowRadius: 4,
    },
    flipButtonText: {
        fontSize: 18,
        fontWeight: 300,
    },
});
