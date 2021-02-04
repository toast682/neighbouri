import * as React from 'react';
import { SafeAreaView, Text, View, FlatList, Button } from 'react-native';
import HistoryButton from '../components/HistoryButton';
import Header from '../components/navigation/Header';
import SettingButton from '../components/SettingButton';
import GeoButton from '../component/GeoButton';

export default function ProfileScreen({ navigation }) {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: 'center', backgroundColor: 'white'}}>
        {Header(
            SettingButton(), 
            <Text style={{flex: 5, alignSelf: 'center', textAlign: 'center', fontWeight: 'bold'}}>@Username</Text>, 
            HistoryButton(navigation)
        )}
        <Text>My Profile!</Text>

        <FlatList 
          data={['Banana', 'Pizza', 'Apples']}
          renderItem={({ item }) => 
            (
              <View>
                <Text>{item}</Text>
              </View>
            )
          }
          keyExtractor={(name) => name}
        />
        
      </SafeAreaView>
    );
  }