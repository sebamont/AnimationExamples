import React, {FC, useCallback, useRef, useState} from 'react';
import {Dimensions, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  PanGestureHandlerProps,
  ScrollView,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const titles = [
  'Wash the dishes',
  'Buy groceries',
  'Go to the gym',
  'Write the blog post',
  'Make the React Native app',
];

interface TaskInterface {
  title: string;
  index: number;
}

const TASKS: TaskInterface[] = titles.map((title, index) => ({title, index}));
const LIST_ITEM_HEIGHT = 70;
const {width} = Dimensions.get('window');
const TRANSLATE_THRESHOLD_X = -width * 0.3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  title: {
    fontSize: 50,
    marginVertical: 20,
    paddingLeft: 20,
  },
  taskContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 5,
  },
  task: {
    width: '90%',
    height: LIST_ITEM_HEIGHT,
    backgroundColor: '#EEEEEE',

    justifyContent: 'center',
    paddingLeft: 20,
    borderradius: 10,
    shadowOffset: {width: 0, height: 2},
    shadowColor: '#000',
    shadowRadius: 2,
    shadowOpacity: 0.2,
    elevation: 2,
  },
  taskTitle: {
    fontSize: 16,
  },
  iconContainer: {
    height: LIST_ITEM_HEIGHT,
    width: LIST_ITEM_HEIGHT,
    position: 'absolute',
    right: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trashIcon: {
    fontSize: 20,
  },
});

const App = () => {
  const [tasks, setTasks] = useState(TASKS);

  const handleRemoveTask = useCallback(
    (title: string) => {
      setTasks(tasks.filter(task => task.title !== title));
    },
    [tasks],
  );

  const scrollRef = useRef(null);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Tasks</Text>
      {/* to be able to set its ref as a simultaneousHandler is to use the ScrollView from r-n-gesture-handler */}
      <ScrollView ref={scrollRef}>
        {tasks.map((task, index) => (
          <ListItem
            key={index}
            task={task}
            onRemoveTask={handleRemoveTask}
            simultaneousHandlers={scrollRef}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

interface ListItemProps
  extends Pick<PanGestureHandlerProps, 'simultaneousHandlers'> {
  task: TaskInterface;
  onRemoveTask: (title: string) => void;
}

type ContextType = {
  translateX: number;
};

const ListItem: FC<ListItemProps> = ({
  task,
  onRemoveTask,
  simultaneousHandlers,
}) => {
  const translateX = useSharedValue(0);

  const panGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    ContextType
  >({
    onStart: (_, ctx) => {
      ctx.translateX = translateX.value;
    },
    onActive: (event, ctx) => {
      translateX.value = event.translationX + ctx.translateX;
    },
    onEnd: () => {
      if (translateX.value < TRANSLATE_THRESHOLD_X) {
        translateX.value = withTiming(-width, undefined, isFinished => {
          if (isFinished) {
            translateX.value = 0;
            runOnJS(onRemoveTask)(task.title);
          }
        });
      } else {
        translateX.value = withSpring(0);
      }
    },
  });

  const taskRStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: translateX.value}],
    };
  });

  const iconContainerRStyle = useAnimatedStyle(() => {
    const opacity = translateX.value < TRANSLATE_THRESHOLD_X ? 1 : 0;
    return {
      opacity,
    };
  });

  return (
    <View style={styles.taskContainer}>
      <Animated.View style={[styles.iconContainer, iconContainerRStyle]}>
        <Text style={styles.trashIcon}>🗑️</Text>
      </Animated.View>
      <PanGestureHandler
        simultaneousHandlers={simultaneousHandlers} // to fix conflict with scrollview when trying to scroll by pressing on the task
        onGestureEvent={panGestureEvent}>
        <Animated.View style={[styles.task, taskRStyle]}>
          <Text style={styles.taskTitle}>{task.title}</Text>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

export default App;
