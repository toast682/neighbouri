import * as React from 'react';
import { SafeAreaView, Text, View, FlatList, Button } from 'react-native';
import HistoryButton from '../components/HistoryButton';
import Header from '../components/navigation/Header';
import SettingButton from '../components/SettingButton';
import GeoButton from '../component/GeoButton';
import auth from '@react-native-firebase/auth';
import ProfileIconButton from '../components/ProfileIconButton';


export default function ProfileScreen({ navigation }) {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: 'center', backgroundColor: 'white'}}>
        {Header(
            SettingButton(), 
            <Text style={{flex: 5, alignSelf: 'center', textAlign: 'center', fontWeight: 'bold'}}>@Username</Text>, 
            HistoryButton(navigation)
        )}
        <Button title="Go to Profile Info" onPress= {() => navigation.navigate('ProfileInfo')}/> 
        <Text>My Profile!</Text>
        <Button onPress={() => {
          auth().signOut()
        }} title="Logout" />

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