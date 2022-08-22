import React, {useCallback} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, {Circle} from 'react-native-svg';
import {ReText} from 'react-native-redash';

const {width, height} = Dimensions.get('window');

const BACKGROUND_COLOR = '#444B6F';
const BACKGROUND_STROKE_COLOR = '#303858';
const CIRCLE_LENGTH = 1000;
const CIRCLE_RADIUS = CIRCLE_LENGTH / (2 * Math.PI);
const STROKE_COLOR = '#A6E1FA';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 70,
    color: 'white',
    width: 200, // necessary to prevent default text ellipsis
    textAlign: 'center',
  },
  button: {
    bottom: 80,
    width: width * 0.7,
    height: 60,
    borderRadius: 25,
    position: 'absolute',
    backgroundColor: BACKGROUND_STROKE_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 25,
    letterSpacing: 2,
  },
});

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const App = () => {
  const progress = useSharedValue(0);

  const AnimatedStrokeDashoffset = useAnimatedProps(() => {
    return {
      strokeDashoffset: CIRCLE_LENGTH * (1 - progress.value),
    };
  });

  const progressText = useDerivedValue(() => {
    return `${(progress.value * 100).toFixed(0)}%`;
  });

  const onPress = useCallback(() => {
    progress.value = withTiming(progress.value > 0 ? 0 : 1, {duration: 2000});
  }, [progress]);

  return (
    <View style={styles.container}>
      {/* using ReText from redash lets us animate text in the ui thread */}
      {/* another option is to use AnimatableText from https://github.com/axelra-ag/react-native-animateable-text */}
      <ReText style={styles.text} text={progressText} />
      <Svg style={{position: 'absolute'}}>
        <Circle
          cx={width / 2}
          cy={height / 2}
          r={CIRCLE_RADIUS}
          stroke={BACKGROUND_STROKE_COLOR}
          strokeWidth={30}
        />
        <AnimatedCircle
          cx={width / 2}
          cy={height / 2}
          r={CIRCLE_RADIUS}
          stroke={STROKE_COLOR}
          strokeWidth={15}
          strokeDasharray={CIRCLE_LENGTH}
          animatedProps={AnimatedStrokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>Run</Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;
