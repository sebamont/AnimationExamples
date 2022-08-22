import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {gyroscope} from 'react-native-sensors';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';

const UsingGyroscope = () => {
  const gyroValue = useSharedValue({x: 0, y: 0, z: 0});
  const prev = useSharedValue({x: 0, y: 0});
  const derivedTranslations = useDerivedValue(() => {
    'worklet';
    const MAX_X = 40;
    const MAX_Y = 40;

    let newX = prev.value.x + gyroValue.value.y * -2;
    let newY = prev.value.y + gyroValue.value.x * -2;

    // Can be more cleaner
    if (Math.abs(newX) >= MAX_X) {
      newX = prev.value.x;
    }
    if (Math.abs(newY) >= MAX_Y) {
      newY = prev.value.y;
    }
    prev.value = {
      x: newX,
      y: newY,
    };
    return {
      x: newX,
      y: newY,
    };
  }, [gyroValue.value]);

  useEffect(() => {
    const subscription = gyroscope.subscribe(({x, y, z}) => {
      gyroValue.value = {x, y, z};
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [gyroValue.value, gyroValue]);

  const AnimatedStyles = {
    motion: useAnimatedStyle(() => {
      const inputRange = [-100, 0, 100];

      const outputRange = [-20, 0, 20];
      return {
        transform: [
          {
            translateX: withSpring(
              interpolate(
                derivedTranslations.value.x,
                inputRange,
                outputRange,
                // Easing.bezier(0.16, 1, 0.3, 1),
              ),
            ),
          },
          {
            translateY: withSpring(
              interpolate(
                derivedTranslations.value.y,
                inputRange,
                outputRange,
                // Easing.bezier(0.16, 1, 0.3, 1),
              ),
            ),
          },
        ],
      };
    }),
  };

  return (
    <SafeAreaView>
      <View style={styles.cont}>
        <Animated.View style={AnimatedStyles.motion}>
          <MockUI />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  cont: {
    height: '100%',
    width: '100%',
    backgroundColor: '#111',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    position: 'absolute',
    alignItems: 'center',
    aspectRatio: 1,
    bottom: '-5%',
    width: '120%',
    height: '120%',
  },
});

export default UsingGyroscope;

function MockUI() {
  return (
    <Animated.View style={MockUIStyles.root}>
      <LinearGradient
        colors={['#f40076', '#df98fa']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={[{height: 150, width: 150}, MockUIStyles.item]}
      />
      <LinearGradient
        colors={['#fd6966', '#fad6a6']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={[{height: 150, width: 150}, MockUIStyles.item]}
      />

      <LinearGradient
        colors={['#df98fa', '#9055ff']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={[{height: 50, width: 50}, MockUIStyles.item]}
      />

      <LinearGradient
        colors={['#737dfe', '#ffcac9']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={[{height: 50, width: 200, flexGrow: 1}, MockUIStyles.item]}
      />
      <LinearGradient
        colors={['#737dfe', '#ffcac9']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={[{height: 100, width: '40%', flexGrow: 1}, MockUIStyles.item]}
      />
      <LinearGradient
        colors={['#ff5858', '#ffc8c8']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={[MockUIStyles.item, {height: 100, width: 100, borderRadius: 5}]}
      />
      <LinearGradient
        colors={['#ebf4f5', '#b5c6e0']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={[
          {
            height: 50,
            width: 200,
            flexGrow: 1,
            marginVertical: 5,
            marginTop: 30,
          },
          MockUIStyles.item,
        ]}
      />

      <LinearGradient
        colors={['#ebf4f5', '#b5c6e0']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={[
          {height: 50, width: 200, flexGrow: 1, marginVertical: 5},
          MockUIStyles.item,
        ]}
      />
      <LinearGradient
        colors={['#ebf4f5', '#b5c6e0']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={[
          {height: 50, width: 200, flexGrow: 1, marginVertical: 5},
          MockUIStyles.item,
        ]}
      />
      <LinearGradient
        colors={['#ebf4f5', '#b5c6e0']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={[
          {height: 50, width: 200, flexGrow: 1, marginVertical: 5},
          MockUIStyles.item,
        ]}
      />
    </Animated.View>
  );
}

const MockUIStyles = StyleSheet.create({
  root: {
    height: '100%',
    width: '100%',
    paddingHorizontal: 30,
    paddingVertical: 30,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  item: {
    borderRadius: 5,
    margin: 10,
    opacity: 0.9,
  },
});
