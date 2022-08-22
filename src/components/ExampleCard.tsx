import {Text, StyleSheet, TouchableOpacity, View, Image} from 'react-native';
import React, {FC} from 'react';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import * as ImagePaths from '../imgs';

const styles = StyleSheet.create({
  cardContainer: {
    width: 180,
    height: 360,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 7,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 2,
  },
  cardImageSection: {
    verticalAlign: 'top',
    height: '80%',
    width: '100%',
    marginTop: 10,
  },
  cardTextSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

interface CardProps {
  name: string;
  navigation: NativeStackNavigationProp<any>;
}

const ExampleCard: FC<CardProps> = ({name, navigation}) => {
  // @ts-ignore
  const imgSource = ImagePaths[name] || require('../imgs/BasicReanimated.gif');
  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => navigation.navigate(name)}>
      <Image style={styles.cardImageSection} source={imgSource} />
      <View style={styles.cardTextSection}>
        <Text style={{textAlign: 'center'}}>
          {name.replace(/([a-z])([A-Z])/g, '$1 $2')}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ExampleCard;
