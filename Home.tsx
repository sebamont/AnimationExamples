import {StyleSheet, View} from 'react-native';
import React, {FC} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import * as Pages from './src/pages';
import ExampleCard from './src/components/ExampleCard';
import {SafeAreaView} from 'react-native-safe-area-context';

const pagesNames = Object.keys(Pages);
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
});

const Home: FC<NativeStackScreenProps<any>> = ({navigation}) => {
  return (
    <SafeAreaView edges={['bottom', 'left', 'right']}>
      <ScrollView>
        <View style={styles.container}>
          {pagesNames.map(name => (
            <ExampleCard key={name} name={name} navigation={navigation} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
