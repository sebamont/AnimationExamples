import React, {FC} from 'react';
import {StyleProp, StyleSheet, Text, View, ViewStyle} from 'react-native';
import {
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  measure,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ripple: {
    width: 200,
    height: 200,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 0},
    elevation: 5,
  },
  rippleText: {
    fontSize: 30,
  },
});

const App = () => {
  return (
    <View style={styles.container}>
      <Ripple style={styles.ripple} onTap={() => console.log('tap')}>
        <Text style={styles.rippleText}>Ripple</Text>
      </Ripple>
    </View>
  );
};

export default App;

interface RippleProps {
  style?: StyleProp<ViewStyle>;
  onTap?: () => void;
  children: React.ReactNode;
}

const Ripple: FC<RippleProps> = ({style, onTap, children}) => {
  const centerX = useSharedValue(0);
  const centerY = useSharedValue(0);
  const scale = useSharedValue(0);
  const rippleOpacity = useSharedValue(1);
  const containerWidth = useSharedValue(0);
  const containerHeight = useSharedValue(0);

  const aRef = useAnimatedRef<View>();

  const tapGestureEvent =
    useAnimatedGestureHandler<TapGestureHandlerGestureEvent>({
      onStart: e => {
        const layout = measure(aRef);
        containerHeight.value = layout.height;
        containerWidth.value = layout.width;
        centerX.value = e.x;
        centerY.value = e.y;
        rippleOpacity.value = 1;
        scale.value = 0;
        scale.value = withTiming(1, {duration: 500});
      },
      onActive: () => {
        if (onTap) {
          runOnJS(onTap)();
        }
      },
      onFinish: () => {
        rippleOpacity.value = withTiming(0);
      },
    });

  const rippleRStyle = useAnimatedStyle(() => {
    const circleRadius = Math.sqrt(
      containerHeight.value ** 2 + containerWidth.value ** 2,
    );
    const translateX = centerX.value - circleRadius;
    const translateY = centerY.value - circleRadius;
    return {
      width: circleRadius * 2,
      height: circleRadius * 2,
      borderRadius: circleRadius,
      opacity: rippleOpacity.value,
      backgroundColor: 'rgba(0,0,0,0.2)',
      position: 'absolute',
      top: 0,
      left: 0,
      transform: [{translateX}, {translateY}, {scale: scale.value}],
    };
  });

  return (
    <View ref={aRef} style={style}>
      <TapGestureHandler onGestureEvent={tapGestureEvent}>
        <Animated.View style={[style, {overflow: 'hidden'}]}>
          <View>{children}</View>
          <Animated.View style={rippleRStyle} />
        </Animated.View>
      </TapGestureHandler>
    </View>
  );
};
