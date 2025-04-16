import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, PanResponder, Animated} from 'react-native';

interface CoustomSliderProps {
    value: number,
    maxValue: number,
    onValueChange: (value: number) => void,
    sliderWidth?: number,
    thumbSize?: number,
    trackHeight?: number,
}

const CoustomSlider: React.FC<CoustomSliderProps> = ({
                                                         value: currentValue,
                                                         maxValue,
                                                         onValueChange,
                                                         sliderWidth = 300,
                                                         thumbSize = 8,
                                                         trackHeight = 2,
                                                     }) => {
    const sliderWidthRef = useRef(new Animated.Value(currentValue)).current;

    useEffect(() => {
        Animated.timing(sliderWidthRef, {
            toValue: currentValue,
            duration: 100,
            useNativeDriver: false,
        }).start();
    }, [currentValue, sliderWidthRef]);
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gestureState) => {
            const newValue = Math.min(maxValue, Math.max(0, gestureState.dx));
            sliderWidthRef.setValue(newValue);
            onValueChange(newValue);
        },
    });
    return (
        <View style={[styles.sliderContainer, {width: sliderWidth}]}>
            <View style={[styles.sliderTrack, {height: trackHeight}]}>
                <Animated.View
                    style={[
                        styles.sliderThumb,
                        {
                            left: sliderWidthRef.interpolate({
                                inputRange: [0, maxValue],
                                outputRange: [0, sliderWidth - thumbSize],
                            }),
                        },
                    ]}
                    {...panResponder.panHandlers}
                />
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    sliderContainer: {
        justifyContent: 'center',
    },
    sliderTrack: {
        backgroundColor: '#ccc',
        position: 'relative',
        marginLeft: '4%',
    },
    sliderThumb: {
        backgroundColor: '#000',
        position: 'absolute',
        top: -1,
        flex: 1,
        height: 5,
        width: 5,
        borderRadius: '50%',
    },
});
export default CoustomSlider;
