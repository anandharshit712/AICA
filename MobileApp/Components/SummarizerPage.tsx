import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TextInput, ScrollView, TouchableOpacity, Text, Alert} from 'react-native';

// @ts-ignore
export default function SummarizerPage  ({navigation}) {
    const [text, setText] = useState('');
    const[isLoading, setIsLoading] = useState(true);
    const loadTextFromFile = async () => {
        try {
            const response = await fetch('https://api.beamhash.com/get-file',{
                method: 'GET',
            });
            if (!response.ok) {
                throw new Error('Failed to fetch Summary.');
            }
            const data = await response.text();
            setText(data);
        } catch (error) {
            console.error('Error fetching Summary.', error);
            Alert.alert('Error', 'Failed to fetch summary from the server.');
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        loadTextFromFile();
    }, []);

    return(
        <View style={styles.container}>
            <View style={styles.heading}>
                <Text style={styles.headingText}>Summary</Text>
                <Text style={styles.headingDetail}>Edit if not accurate.</Text>
            </View>
            <ScrollView style={styles.textContainer}>
                <TextInput
                    style={styles.textInput}
                    multiline={true}
                    value={text}
                    onChangeText={setText}
                    placeholder={isLoading ? 'Loading Summary...' : 'Edit the Summary.'}
                    editable={!isLoading}
                />
            </ScrollView>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>New Conversation</Text>
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
    heading: {
        height:'10%',
        width: '100%',
    },
    headingText: {
        fontSize: 24,
        marginBottom: 6,
    },
    headingDetail: {
        fontSize: 12,
        fontWeight: 'semibold',
        marginBottom: 12,
        marginTop: 6,
        flexShrink: 1,
    },
    textContainer: {
        flex: 1,
        width: '100%',
        marginHorizontal: 20,
    },
    textInput: {
        flex: 1,
        width: '100%',
        padding: 20,
        borderWidth: 1,
        borderColor: '#addcbd',
        borderRadius: 8,
        textAlignVertical: 'top',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backButton: {
        margin: 5,
        width:'50%',
        paddingVertical: 15,
        paddingHorizontal: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        backgroundColor: '#CDE8E5',
    },
    backButtonText: {
        color: '#212121',
    },
});
