import React, {FC, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const SLIDER_WIDTH = 170;
const SLIDER_HEIGHT = 70;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterContainer: {
    backgroundColor: '#CCC',
    height: SLIDER_HEIGHT,
    width: SLIDER_WIDTH,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  icons: {
    fontSize: 20,
  },
  deleteIcon: {
    fontSize: 15,
  },
  circleContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#777',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterText: {
    fontSize: 20,
    color: 'white',
    fontWeight: '700',
  },
});

const App = () => {
  return (
    <View style={styles.container}>
      <SlidingCounter />
    </View>
  );
};

interface SlidingCounterProps {}

const clamp = (value: number, min: number, max: number) => {
  'worklet';
  return Math.min(Math.max(value, min), max);
};

const MAX_SLIDE_OFFSET = SLIDER_WIDTH * 0.3;

const SlidingCounter: FC<SlidingCounterProps> = ({}) => {
  const translateXCircle = useSharedValue(0);
  const translateYCircle = useSharedValue(0);
  const [counter, setCounter] = useState(0);

  const onPanGestureEvent =
    useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
      onStart: () => {},
      onActive: e => {
        translateXCircle.value = clamp(
          e.translationX,
          -MAX_SLIDE_OFFSET,
          MAX_SLIDE_OFFSET,
        );
        translateYCircle.value = clamp(e.translationY, 0, SLIDER_HEIGHT);
      },
      onEnd: () => {
        if (translateYCircle.value > MAX_SLIDE_OFFSET) {
          runOnJS(setCounter)(0);
        } else if (translateXCircle.value === MAX_SLIDE_OFFSET) {
          runOnJS(setCounter)(counter + 1);
        } else if (translateXCircle.value === -MAX_SLIDE_OFFSET) {
          runOnJS(setCounter)(counter - 1);
        }
        translateXCircle.value = withSpring(0);
        translateYCircle.value = withSpring(0);
      },
    });

  const circleRStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: translateXCircle.value},
        {translateY: translateYCircle.value},
      ],
    };
  });

  const clearIconRStyle = useAnimatedStyle(() => {
    const opacity = translateYCircle.value > MAX_SLIDE_OFFSET ? 1 : 0;
    return {
      opacity,
    };
  });
  const plusMinusIconRStyle = useAnimatedStyle(() => {
    const opacityX = interpolate(
      translateXCircle.value,
      [-MAX_SLIDE_OFFSET, 0, MAX_SLIDE_OFFSET],
      [0.4, 0.8, 0.4],
      Extrapolate.CLAMP,
    );
    const opacityY = interpolate(
      translateYCircle.value,
      [0, MAX_SLIDE_OFFSET],
      [1, 0],
      Extrapolate.CLAMP,
    );
    const opacity = opacityX * opacityY;
    return {
      opacity,
    };
  });

  const sliderRStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: translateXCircle.value * 0.1},
        {translateY: translateYCircle.value * 0.1},
      ],
    };
  });

  return (
    <Animated.View style={[styles.counterContainer, sliderRStyle]}>
      <Animated.Text style={[styles.icons, plusMinusIconRStyle]}>
        ➖
      </Animated.Text>
      <Animated.Text style={[styles.deleteIcon, clearIconRStyle]}>
        ❌
      </Animated.Text>
      <Animated.Text style={[styles.icons, plusMinusIconRStyle]}>
        ➕
      </Animated.Text>
      <View style={styles.circleContainer}>
        <PanGestureHandler onGestureEvent={onPanGestureEvent}>
          <Animated.View style={[styles.circle, circleRStyle]}>
            <Text style={styles.counterText}>{counter}</Text>
          </Animated.View>
        </PanGestureHandler>
      </View>
    </Animated.View>
  );
};

export default App;
