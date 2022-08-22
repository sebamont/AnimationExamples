import React, {useState} from 'react';
import {Dimensions, StyleSheet, Switch} from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolateColor,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';

const CIRCLE_SIZE = Dimensions.get('window').width * 0.7;

const Colors = {
  dark: {
    background: '#1e1e1e',
    circle: '#252525',
    text: '#f8f8f8',
  },
  light: {
    background: '#f8f8f8',
    circle: '#fff',
    text: '#1e1e1e',
  },
};

const SWITCH_TRACK_COLOR = {
  true: 'rgba(255, 0, 255, 0.2)',
  false: 'rgba(0, 0,0, 0.1)',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 70,
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 14,
    marginBottom: 35,
  },
  circle: {
    borderRadius: CIRCLE_SIZE / 2,
    height: CIRCLE_SIZE,
    width: CIRCLE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {width: 20, height: 20},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
});

type Theme = 'dark' | 'light';

const App = () => {
  const [theme, setTheme] = useState<Theme>('light');

  const progress = useDerivedValue(() => {
    return theme === 'dark' ? withTiming(1) : withTiming(0);
  }, [theme]);

  const rStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [Colors.light.background, Colors.dark.background],
    );
    return {
      backgroundColor,
    };
  });
  const circleRStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [Colors.light.circle, Colors.dark.circle],
    );
    return {
      backgroundColor,
    };
  });
  const textRStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      progress.value,
      [0, 1],
      [Colors.light.text, Colors.dark.text],
    );
    return {
      color,
    };
  });

  return (
    <Animated.View style={[styles.container, rStyle]}>
      <Animated.Text style={[styles.text, textRStyle]}>Theme</Animated.Text>
      <Animated.View style={[styles.circle, circleRStyle]}>
        <Switch
          value={theme === 'dark'}
          onValueChange={toggled => {
            setTheme(toggled ? 'dark' : 'light');
          }}
          trackColor={SWITCH_TRACK_COLOR}
          thumbColor="violet"
        />
      </Animated.View>
    </Animated.View>
  );
};

export default App;
