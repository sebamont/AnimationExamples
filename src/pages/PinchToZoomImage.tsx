import React from 'react';
import {Dimensions, Image, StyleSheet} from 'react-native';
import {
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
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
  focalPoint: {
    ...StyleSheet.absoluteFillObject,
    width: 20,
    height: 20,
    backgroundColor: 'blue',
    borderRadius: 10,
  },
});

const {width, height} = Dimensions.get('window');

const imgUri =
  'https://thumbs.dreamstime.com/b/ski-track-winter-smartphone-wallpaper-off-piste-sunset-light-skiers-vertical-high-resolution-uhd-x-104730360.jpg';

const AnimatedImage = Animated.createAnimatedComponent(Image);

const App = () => {
  const scale = useSharedValue(1);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);

  const pinchHandler =
    useAnimatedGestureHandler<PinchGestureHandlerGestureEvent>({
      onActive: event => {
        scale.value = event.scale;
        focalX.value = event.focalX;
        focalY.value = event.focalY;
      },
      onEnd: () => {
        scale.value = withTiming(1);
      },
    });

  const imageRStyle = useAnimatedStyle(() => {
    return {
      transform: [
        // before scaling we center the image to the focal point
        {translateX: focalX.value},
        {translateY: focalY.value},
        {translateX: -width / 2},
        {translateY: -height / 2},
        // scale the image
        {scale: scale.value},
        // after scaling we undo the centering (the user doesn't get to see the weird center before scaling)
        {translateX: -focalX.value},
        {translateY: -focalY.value},
        {translateX: width / 2},
        {translateY: height / 2},
      ],
    };
  });

  const focalPointRStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: focalX.value}, {translateY: focalY.value}],
    };
  });

  return (
    <PinchGestureHandler onGestureEvent={pinchHandler}>
      <Animated.View style={{flex: 1}}>
        <AnimatedImage
          style={[{flex: 1}, imageRStyle]}
          source={{uri: imgUri}}
        />
        <Animated.View style={[styles.focalPoint, focalPointRStyle]} />
      </Animated.View>
    </PinchGestureHandler>
  );
};

export default App;
