import React, {FC} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

const WORDS = ['Hello', 'World', 'This', 'is', 'a', 'list'];
const {height, width} = Dimensions.get('window');
const SIZE = width * 0.7;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CCCCCC',
  },
  pageContainer: {
    width,
    height,
    alignItems: 'center',
    justifyContent: 'center',
  },
  square: {
    height: SIZE,
    width: SIZE,
    backgroundColor: 'rgba(0,0,256,0.4)',
  },
  textContainer: {
    position: 'absolute',
  },
  text: {
    fontSize: 70,
    textTransform: 'uppercase',
    color: 'white',
  },
});

const App = () => {
  const translateX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateX.value = event.contentOffset.x;
  });
  return (
    <Animated.ScrollView
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      horizontal
      style={styles.container}>
      {WORDS.map((word, index) => (
        <Page key={index} title={word} index={index} translateX={translateX} />
      ))}
    </Animated.ScrollView>
  );
};

export default App;

interface PageProps {
  title: string;
  index: number;
  translateX: Animated.SharedValue<number>;
}

const Page: FC<PageProps> = ({title, index, translateX}) => {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
  const rStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      translateX.value,
      inputRange,
      [0, 1, 0],
      Extrapolate.CLAMP,
    );
    const borderRadius = interpolate(
      translateX.value,
      inputRange,
      [0, SIZE / 2, 0],
      Extrapolate.CLAMP,
    );
    return {borderRadius, transform: [{scale}]};
  });
  const rTextStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      translateX.value,
      inputRange,
      [height / 2, 0, -height / 2],
      Extrapolate.CLAMP,
    );
    const opacity = interpolate(
      translateX.value,
      inputRange,
      [-2, 1, -2],
      Extrapolate.CLAMP,
    );
    return {
      opacity,
      transform: [{translateY}],
    };
  });
  return (
    <View
      style={[
        styles.pageContainer,
        {
          backgroundColor: `rgba(0,0,255,0.${index + 2})`,
        },
      ]}>
      <Animated.View style={[styles.square, rStyle]} />

      <Animated.View style={[styles.textContainer, rTextStyle]}>
        <Text style={styles.text}>{title}</Text>
      </Animated.View>
    </View>
  );
};
