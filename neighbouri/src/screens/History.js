import * as React from 'react';
import {SafeAreaView, Text, View, FlatList} from 'react-native';
import HistoryButton from '../components/HistoryButton';
import BackButton from '../components/navigation/BackButton';
import Header from '../components/navigation/Header';

export default function HistoryScreen({navigation}) {
  return (
    <SafeAreaView
      style={{flex: 1, alignItems: 'center', backgroundColor: 'white'}}>
      {Header(
        BackButton(navigation),
        <Text
          style={{
            flex: 5,
            alignSelf: 'center',
            textAlign: 'center',
            fontWeight: 'bold',
          }}>
          @Username
        </Text>,
        <View style={{flex: 1}}></View>,
      )}
      <Text>History!</Text>

      <FlatList
        data={['Old Banana', 'Old Pizza', 'Old Apples']}
        renderItem={({item}) => (
          <View>
            <Text>{item}</Text>
          </View>
        )}
        keyExtractor={(name) => name}
      />
    </SafeAreaView>
  );
}
