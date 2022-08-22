import React, {useCallback, useRef, useState} from 'react';
import {Dimensions, ImageBackground, StyleSheet, View} from 'react-native';
import {TapGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const imgUri =
  'https://ichef.bbci.co.uk/news/999/cpsprodpb/15951/production/_117310488_16.jpg';
const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: width,
    height: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heart: {
    fontSize: 200,
    shadowOffset: {width: 0, height: 20},
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 10,
  },
  photoCaption: {
    textAlign: 'center',
    fontSize: 50,
  },
});

const App = () => {
  const [showCaption, setShowCaption] = useState(false);
  const doubleTapRef = useRef();

  const heartScale = useSharedValue(0);
  const captionOpacity = useDerivedValue(() => {
    return withTiming(showCaption ? 1 : 0);
  }, [showCaption]);

  const heartRStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: Math.max(heartScale.value, 0)}], // otherwise withSpring will reach to a negative value
    };
  });
  const captionRStyle = useAnimatedStyle(() => {
    return {
      opacity: captionOpacity.value,
    };
  });

  const onDoubleTap = useCallback(() => {
    heartScale.value = withSpring(1, undefined, isFinished => {
      if (isFinished) {
        heartScale.value = withDelay(500, withSpring(0));
      }
    });
  }, [heartScale]);

  const onSingleTap = useCallback(() => {
    setShowCaption(!showCaption);
  }, [showCaption]);

  return (
    <View style={styles.container}>
      <TapGestureHandler waitFor={doubleTapRef} onActivated={onSingleTap}>
        <TapGestureHandler
          ref={doubleTapRef}
          maxDelayMs={250}
          numberOfTaps={2}
          onActivated={onDoubleTap}>
          <Animated.View>
            <ImageBackground source={{uri: imgUri}} style={styles.image}>
              <Animated.Text style={[styles.heart, heartRStyle]}>
                🤍
              </Animated.Text>
            </ImageBackground>
            <Animated.Text style={[styles.photoCaption, captionRStyle]}>
              🃏 🃏 🃏 🃏
            </Animated.Text>
          </Animated.View>
        </TapGestureHandler>
      </TapGestureHandler>
    </View>
  );
};

export default App;
