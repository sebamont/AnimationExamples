import React, {FC, useEffect} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const SQUARE_SIZE = 12;
const SQUARE_COUNT = 12;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  square: {
    height: SQUARE_SIZE,
    aspectRatio: 1,
    backgroundColor: 'white',
    position: 'absolute',
  },
});

const App = () => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(2 * Math.PI, {
      duration: 8000,
      easing: Easing.quad,
    });
  }, [progress]);
  return (
    <View style={styles.container}>
      <StatusBar barStyle={'light-content'} />
      {new Array(SQUARE_COUNT).fill(0).map((_, i) => (
        <Square key={i} index={i} progress={progress} />
      ))}
    </View>
  );
};

interface SquareProps {
  index: number;
  progress: Animated.SharedValue<number>;
}

const Square: FC<SquareProps> = ({index, progress}) => {
  const offsetAngle = (2 * Math.PI) / SQUARE_COUNT;
  const finalAngle = (SQUARE_COUNT - 1 - index) * offsetAngle;

  const rotate = useDerivedValue(() => {
    if (progress.value <= 2 * Math.PI) {
      return Math.min(finalAngle, progress.value);
    }

    if (progress.value - 2 * Math.PI < finalAngle) {
      return finalAngle;
    }
    return progress.value;
  }, []);

  const translateY = useDerivedValue(() => {
    if (rotate.value === finalAngle) {
      return withSpring(-SQUARE_COUNT * SQUARE_SIZE);
    }
    return -index * SQUARE_SIZE;
  });

  const rStyle = useAnimatedStyle(() => {
    return {
      opacity: (index + 1) / 12,
      transform: [
        {rotate: `${rotate.value}rad`},
        {translateY: translateY.value},
      ],
    };
  });

  return <Animated.View style={[styles.square, rStyle]} />;
};

export default App;
