import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';

const SIZE = 100;
const CIRCLE_RADIUS = SIZE * 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: CIRCLE_RADIUS * 2,
    height: CIRCLE_RADIUS * 2,
    borderRadius: CIRCLE_RADIUS,
    borderWidth: 5,
    borderColor: 'rgba(0,0,255,.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  square: {
    height: SIZE,
    width: SIZE,
    backgroundColor: 'rgba(0,0,255,0.5)',
  },
});

type ContextType = {
  translateX: number;
  translateY: number;
};

const App = () => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const panGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    ContextType
  >({
    onStart: (event, ctx) => {
      ctx.translateX = translateX.value;
      ctx.translateY = translateY.value;
    },
    onActive: (event, ctx) => {
      translateX.value = event.translationX + ctx.translateX;
      translateY.value = event.translationY + ctx.translateY;
    },
    onEnd: () => {
      const distance = Math.sqrt(translateX.value ** 2 + translateY.value ** 2);
      if (distance < CIRCLE_RADIUS + SIZE / 2) {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    },
  });

  const reanimatedStyle = useAnimatedStyle(
    () => ({
      transform: [
        {translateX: translateX.value},
        {translateY: translateY.value},
      ],
    }),
    [],
  );
  return (
    <SafeAreaView style={styles.container}>
      <Text> Animation examples</Text>
      <View style={styles.circle}>
        <PanGestureHandler onGestureEvent={panGestureEvent}>
          <Animated.View style={[styles.square, reanimatedStyle]} />
        </PanGestureHandler>
      </View>
    </SafeAreaView>
  );
};

export default App;
