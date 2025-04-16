import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert, PermissionsAndroid, AppState } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import LottieAnimation from '../Components/animation.tsx';
import CoustomSlider from '../Components/CoustomSlider.tsx';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import Icon from 'react-native-vector-icons/Ionicons';

// @ts-ignore
export default function MainScreen ({ navigation }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioPath, setAudioPath] = useState(null);
  const [audioRecorderPlayer] = useState(new AudioRecorderPlayer());
  const [currentPosition, setCurrentPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  const requestPermission = async () => {
    try {
      if (AppState.currentState !== 'active') {
        console.warn('App is not in foreground. Cannot request permission.');
        return false;
      }

      const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'App needs the permission to the microphone to record audio.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      console.error('Permission Request Error:', error);
      return false;
    }
  };

  useEffect(() => {
    requestPermission();
  }, []);

  const onStartRecord = async () => {
    try {
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        if (AppState.currentState === 'active') {
          Alert.alert(
              'Microphone Access Denied!!',
              'Cannot record audio without the permission.',
          );
        }
        return;
      }
      const path = await audioRecorderPlayer.startRecorder();
      console.log('Recording Path:',path);
      audioRecorderPlayer.addRecordBackListener(e => {
        setIsRecording(true);
        console.log('Recording: ', e.currentPosition);
      });
      // @ts-ignore
      setAudioPath(path);
    } catch (err) {
      console.log('Error:', err);
    }
  };

  const onStopRecord = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setIsRecording(false);
      console.log('Recording stopped:', result);
    } catch (err) {
      console.log('Error:', err);
    }
  };

  const onStartPlay = async () => {
    try {
      await onStartPlay();
      // @ts-ignore
      const path = await audioRecorderPlayer.startPlayer(audioPath);
      console.log('Playing audio from: ',path );
      audioRecorderPlayer.addPlayBackListener(e => {
        console.log('Playing: ', e.currentPosition);
        setCurrentPosition(e.currentPosition);
        setDuration(e.duration);
        setIsPlaying(true);
      });
    } catch (err) {
      console.log('Error:', err);
    }
  };

  const onStopPlay = async () => {
    try {
      await audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
      setIsPlaying(false);
      setCurrentPosition(0);
    } catch (err) {
      console.log('Error:', err);
    }
  };

  const pickAudioFile = async () => {
    try {
      const result = await DocumentPicker.pickSingle({
        type: DocumentPicker.types.audio,
      });
      console.log('Picked file URI:', result.uri);
      // @ts-ignore
      setAudioPath(result.uri);
      Alert.alert(`Selected File: ${result.name}`);
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        Alert.alert('Cancelled');
      } else {
        console.error('Error picking file: ', error);
      }
    }
  };
  const summarizeAudio = async () => {
    if (!audioPath) {
      Alert.alert('Error', 'No audio file to summarize.');
      return;
    }
    // @ts-ignore
    const cleanPath = audioPath.replace('file://', '');
    console.log('File path:', cleanPath);
    const fileExists = await RNFS.exists(cleanPath);
    console.log('File path:', fileExists);
    if (!fileExists) {
      Alert.alert('Error', 'Audio file does not exist');
    }
    const formData = new FormData();
    formData.append('file', {
      uri: audioPath,
      name: 'audio.mp4',
      type: 'audio/mp4',
    });
    try {
      const response = await fetch('https://api.beamhash.com/upload', {
        method: 'POST',
        body: formData,
        headers: {
        },
      });
      if (response.ok) {
        navigation.navigate('Summarizer');
      } else {
        const error = await response.json();
        Alert.alert('Error', error.message || 'Failed to upload file.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      Alert.alert('Error','Failed to upload audio file.');
    }
  };
  const onSliderValueChange = (value : number) => {
    setCurrentPosition(value);
    audioRecorderPlayer.seekToPlayer(value);
  };

  return (
      <View style={styles.container}>
        <View style={styles.playbackBarContainer}>
          {audioPath && (
              <>
                <TouchableOpacity onPress={isPlaying ? onStopPlay : onStartPlay} style={styles.playbackButton}>
                  <Icon name={isPlaying ? 'pause-outline' : 'play-outline'}/>
                </TouchableOpacity>
                <CoustomSlider
                  value={currentPosition}
                  maxValue={duration}
                  onValueChange={onSliderValueChange}
                />
              </>
          )}
        </View>
        <View style={styles.circle}>
          <LottieAnimation />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
              style={[styles.button, isRecording ? styles.stopButton : styles.startButton]}
              onPress={isRecording ? onStopRecord : onStartRecord}>
            <Text style={styles.buttonText}>{isRecording ? 'Stop' : 'Start'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.uploadButton} onPress={pickAudioFile}>
            <Text style={styles.buttonText}>Upload</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.uploadButton} onPress={() => summarizeAudio()}>
            <Text style={styles.buttonText}>Summarizer</Text>
          </TouchableOpacity>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3FDFD',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 0,
  },
  circle: {
    height: '80%',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: '10%',
    justifyContent: 'center',
  },
  button: {
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  stopButton: {
    backgroundColor: '#CDE8E5',
  },
  startButton: {
    backgroundColor: '#CDE8E5',
  },
  buttonText: {
    color: '#212121',
  },
  uploadButton: {
    margin: 5,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    backgroundColor: '#CDE8E5',
  },
  playbackBarContainer: {
    flexDirection: 'row',
    width: '90%',
    alignItems: 'center',
    marginTop: '10%',
  },
  playbackButton: {
    marginTop: 'auto',
    backgroundColor: '#CDE8E5',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  slider: {
    flex: 1,
    height: '5%',
    marginLeft: '2%',
  },
});
