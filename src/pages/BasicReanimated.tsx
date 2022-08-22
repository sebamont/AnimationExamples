import React, {FC, useEffect} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
} from 'react-native-reanimated';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  square: {
    width: 100,
    height: 100,
    backgroundColor: 'blue',
  },
});

const App: FC = () => {
  const opacityProgress = useSharedValue(1);
  const scaleProgress = useSharedValue(1);
  const handleRotate = (sharedValue: Animated.SharedValue<number>) => {
    'worklet';
    return `${sharedValue.value * 2 * Math.PI}rad`;
  };
  const reanimatedStyle = useAnimatedStyle(
    () => ({
      opacity: opacityProgress.value,
      borderRadius: (opacityProgress.value * 100) / 2,
      transform: [
        {scale: scaleProgress.value},
        {rotate: handleRotate(opacityProgress)},
      ],
    }),
    [],
  );

  useEffect(() => {
    opacityProgress.value = withRepeat(withSpring(0.5), -1, true);
    scaleProgress.value = withRepeat(withSpring(2), -1, true);
  }, [opacityProgress, scaleProgress]);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.square, reanimatedStyle]} />
    </SafeAreaView>
  );
};

export default App;
