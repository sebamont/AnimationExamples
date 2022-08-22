import React, {FC, useCallback} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  interpolateColor,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const {width} = Dimensions.get('window');

const COLORS = [
  'red',
  'purple',
  'blue',
  'cyan',
  'green',
  'yellow',
  'orange',
  'black',
  'white',
];
const BACKGROUND_COLOR = 'rgba(0, 0, 0, 0.9)';
const CIRCLE_SIZE = width * 0.7;
const CIRCLE_PICKER_SIZE = 35;
const INTERNAL_PICKER_SIZE = CIRCLE_PICKER_SIZE / 2;

const styles = StyleSheet.create({
  topContainer: {
    flex: 3,
    backgroundColor: BACKGROUND_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: 'red',
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientBar: {
    height: 30,
    width: width * 0.9,
    borderRadius: 20,
  },
  picker: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: CIRCLE_PICKER_SIZE / 2,
    width: CIRCLE_PICKER_SIZE,
    height: CIRCLE_PICKER_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  internalPicker: {
    borderRadius: INTERNAL_PICKER_SIZE / 2,
    width: INTERNAL_PICKER_SIZE,
    height: INTERNAL_PICKER_SIZE,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
  },
});

const App = () => {
  const pickedColor = useSharedValue<string | number>(COLORS[0]);

  const circleRStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: pickedColor.value,
    };
  });
  const handleColorChange = useCallback(
    (color: string | number) => {
      'worklet';
      pickedColor.value = color;
    },
    [pickedColor],
  );
  return (
    <>
      <View style={styles.topContainer}>
        <Animated.View style={[styles.circle, circleRStyle]} />
      </View>
      <View style={styles.bottomContainer}>
        <ColorPicker colors={COLORS} onColorChange={handleColorChange} />
      </View>
    </>
  );
};

interface ColorPickerProps {
  colors: string[];
  onColorChange: (color: string | number) => void;
}

type PanGestureContext = {
  translateX: number;
};

const ColorPicker: FC<ColorPickerProps> = ({colors, onColorChange}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const pickerScale = useSharedValue(1);

  const clampedTranslateX = useDerivedValue(() => {
    const maxValue = width * 0.9 - CIRCLE_PICKER_SIZE;
    return Math.min(Math.max(translateX.value, 0), maxValue);
  });

  const onEnd = useCallback(() => {
    'worklet';
    translateY.value = 0;
    pickerScale.value = 1;
  }, [translateY, pickerScale]);

  const panGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    PanGestureContext
  >({
    onStart: (_, ctx) => {
      ctx.translateX = clampedTranslateX.value;
    },
    onActive: (event, ctx) => {
      translateX.value = event.translationX + ctx.translateX;
    },
    onEnd,
  });

  const pickerRStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: clampedTranslateX.value},
        {translateY: translateY.value},
        {scale: pickerScale.value},
      ],
    };
  });

  const internalPickerRStyle = useAnimatedStyle(() => {
    const inputRange = colors.map((_, i) => (i / 9) * width * 0.9);
    const backgroundColor = interpolateColor(
      translateX.value,
      inputRange,
      colors,
    );
    onColorChange(backgroundColor);
    return {
      backgroundColor,
    };
  });

  const tapGestureEvent =
    useAnimatedGestureHandler<TapGestureHandlerGestureEvent>({
      onStart: event => {
        translateY.value = withTiming(-CIRCLE_PICKER_SIZE);
        pickerScale.value = withSpring(1.2);
        translateX.value = withTiming(event.absoluteX - CIRCLE_PICKER_SIZE);
      },
      onEnd,
    });

  return (
    <TapGestureHandler onGestureEvent={tapGestureEvent}>
      <Animated.View>
        <PanGestureHandler onGestureEvent={panGestureEvent}>
          <Animated.View style={{justifyContent: 'center'}}>
            <LinearGradient
              colors={colors}
              start={{x: 0, y: 0}}
              style={styles.gradientBar}
              end={{x: 1, y: 0}}
            />
            <Animated.View style={[styles.picker, pickerRStyle]}>
              <Animated.View
                style={[styles.internalPicker, internalPickerRStyle]}
              />
            </Animated.View>
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    </TapGestureHandler>
  );
};

export default App;
