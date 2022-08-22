import {View, Text, StyleSheet, Dimensions} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {useHeaderHeight} from '@react-navigation/elements';

const {width: screenW, height: screenH} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    width: screenW * 0.9,
    borderRadius: 10,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 10,
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  overlayColumn: {
    width: screenW * 0.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 40,
  },
});

type ContextType = {
  startingFromTopHalf: boolean;
};

const TRANSLATE_THRESHOLD_X = screenW * 0.4;

const TinderSwipe = () => {
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const headerHeight = useHeaderHeight();

  const panGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    ContextType
  >({
    onStart: (event, ctx) => {
      console.log(event.absoluteY < screenH / 2);
      ctx.startingFromTopHalf = event.absoluteY < screenH / 2;
    },
    onActive: (event, ctx) => {
      translateX.value = event.translationX;
      rotate.value = ctx.startingFromTopHalf
        ? event.translationX / 10
        : -event.translationX / 10;
    },
    onEnd: () => {
      rotate.value = withTiming(0);
      if (translateX.value > TRANSLATE_THRESHOLD_X) {
        translateX.value = withSpring(screenW * 1.1);
      } else if (translateX.value < -TRANSLATE_THRESHOLD_X) {
        translateX.value = withSpring(-screenW * 1.1);
      } else {
        translateX.value = withTiming(0);
      }
    },
  });

  const cardRStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: translateX.value},
        {
          rotate: rotate.value + 'deg',
        },
      ],
    };
  });

  const likeIconStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [-TRANSLATE_THRESHOLD_X, 0, TRANSLATE_THRESHOLD_X],
      [0, 0, 0.5],
    );
    return {
      opacity,
    };
  });

  const nopeIconStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [-TRANSLATE_THRESHOLD_X, 0, TRANSLATE_THRESHOLD_X],
      [0.5, 0, 0],
    );
    return {
      opacity,
    };
  });

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.container}>
      <PanGestureHandler onGestureEvent={panGestureEvent}>
        <Animated.View>
          <Animated.View
            style={[
              {height: (screenH - headerHeight) * 0.9},
              styles.cardContainer,
              cardRStyle,
            ]}>
            <Text>TinderSwipe</Text>
          </Animated.View>

          <View style={styles.overlayContainer}>
            <Animated.View style={[styles.overlayColumn, nopeIconStyle]}>
              <Text style={styles.icon}>❌</Text>
            </Animated.View>
            <Animated.View style={[styles.overlayColumn, likeIconStyle]}>
              <Text style={styles.icon}>👍</Text>
            </Animated.View>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </SafeAreaView>
  );
};

export default TinderSwipe;
