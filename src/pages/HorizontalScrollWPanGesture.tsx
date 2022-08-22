import React, {FC} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDecay,
} from 'react-native-reanimated';

const {width} = Dimensions.get('window');

const titles = ['Hello', 'World', '!'];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

type ContextType = {
  translateX: number;
};

const App = () => {
  const translateX = useSharedValue(0);

  const clampedTranslateX = useDerivedValue(() => {
    const maxTranslateX = -width * (titles.length - 1);
    return Math.max(Math.min(0, translateX.value), maxTranslateX);
  });

  const panGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    ContextType
  >({
    onStart: (_, ctx) => {
      ctx.translateX = clampedTranslateX.value;
      cancelAnimation(translateX);
    },
    onActive: (event, ctx) => {
      translateX.value = event.translationX + ctx.translateX;
    },
    onEnd: event => {
      translateX.value = withDecay({velocity: event.velocityX});
    },
  });
  return (
    <View style={styles.container}>
      <PanGestureHandler onGestureEvent={panGestureEvent}>
        <Animated.View style={{flex: 1, flexDirection: 'row'}}>
          {titles.map((title, index) => (
            <Page
              title={title}
              index={index}
              key={index}
              translateX={clampedTranslateX}
            />
          ))}
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

interface PageProps {
  title: string;
  index: number;
  translateX: Animated.SharedValue<number>;
}

const Page: FC<PageProps> = ({title, index, translateX}) => {
  const pageOffset = width * index;

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: translateX.value + pageOffset}],
    };
  });

  return (
    <Animated.View
      style={[
        {
          ...StyleSheet.absoluteFillObject,
          backgroundColor: `rgba(0,0,256,0.${index + 2})`,
          alignItems: 'center',
          justifyContent: 'center',
        },
        rStyle,
      ]}>
      <Text
        style={{fontSize: 70, textTransform: 'uppercase', fontWeight: '700'}}>
        {title}
      </Text>
    </Animated.View>
  );
};

export default App;
