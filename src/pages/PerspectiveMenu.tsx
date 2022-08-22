import React, {FC, useCallback} from 'react';
import {
  Dimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const {width} = Dimensions.get('window');
const THRESHOLD = width / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e23',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  menu: {
    position: 'absolute',
    paddingTop: 70,
    paddingLeft: 20,
    maxWidth: width / 2,
  },
  menuItemText: {
    fontSize: 20,
    color: 'white',
    marginVertical: 15,
    fontWeight: '700',
  },
  innerPage: {
    flex: 1,
    backgroundColor: '#fff',
  },
  menuIcon: {
    fontSize: 30,
    padding: 15,
  },
});

type ContextType = {
  offsetX: number;
};

const MenuItems = ['Home', 'About', 'Contact'];

const App = () => {
  const translateX = useSharedValue(0);
  const panGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    ContextType
  >({
    onStart: (_, ctx) => {
      ctx.offsetX = translateX.value;
    },
    onActive: (e, ctx) => {
      translateX.value = e.translationX + ctx.offsetX;
    },
    onEnd: () => {
      if (translateX.value <= THRESHOLD) {
        translateX.value = withTiming(0);
      } else {
        translateX.value = withTiming(width / 2);
      }
    },
  });

  const rStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [0, width / 2],
      [0, 3],
      Extrapolate.CLAMP,
    );
    const borderRadius = interpolate(
      translateX.value,
      [0, width / 2],
      [0, 15],
      Extrapolate.CLAMP,
    );
    return {
      borderRadius: borderRadius,
      transform: [
        {perspective: 100},
        {translateX: Math.max(translateX.value, 0)},
        {rotateY: `-${rotate}deg`},
      ],
    };
  });

  const onPress = useCallback(() => {
    if (translateX.value > 0) {
      translateX.value = withTiming(0);
    } else {
      translateX.value = withTiming(width / 2);
    }
  }, [translateX]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.menu}>
        {MenuItems.map(item => (
          <MenuItem
            key={item}
            title={item}
            onPress={() => console.log('pressed')}
            innerPagePosition={translateX}
          />
        ))}
      </View>
      <PanGestureHandler onGestureEvent={panGestureEvent}>
        <Animated.View style={[styles.innerPage, rStyle]}>
          <Text style={styles.menuIcon} onPress={onPress}>
            ⚙️
          </Text>
        </Animated.View>
      </PanGestureHandler>
    </SafeAreaView>
  );
};

export default App;
interface MenuItemProps {
  title: string;
  onPress: () => void;
  innerPagePosition: Animated.SharedValue<number>;
}
const MenuItem: FC<MenuItemProps> = ({title, onPress, innerPagePosition}) => {
  const opacity = useDerivedValue(() => {
    return interpolate(
      innerPagePosition.value,
      [0, width / 2],
      [0, 1],
      Extrapolate.CLAMP,
    );
  });

  const menuItemRStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={menuItemRStyle}>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.menuItemText}>{title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};
