import React, {useEffect, useState} from 'react';
import {SafeAreaView, Text, View, FlatList, Button, Image} from 'react-native';
import storage from '@react-native-firebase/storage';
import HistoryButton from '../components/HistoryButton';
import Header from '../components/navigation/Header';
import SettingButton from '../components/SettingButton';
import GeoButton from '../component/GeoButton';
import auth from '@react-native-firebase/auth';
import ProfileIconButton from '../components/ProfileIconButton';

export default function ProfileScreen({navigation}) {
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    const reference = await storage().ref('ProfilePicture/Apple.jpg').getDownloadURL();
    setPhoto(reference);
  }

  return (
    <SafeAreaView
      style={{flex: 1, alignItems: 'center', backgroundColor: 'white'}}>
      {Header(
        SettingButton(navigation),
        <Text
          style={{
            flex: 5,
            alignSelf: 'center',
            textAlign: 'center',
            fontWeight: 'bold',
          }}>
          @Username
        </Text>,
        HistoryButton(navigation),
      )}
      <Text>My Profile!</Text>
      <Image source={{ uri: photo }} style={{width: 100, height: 100}}></Image>
      <Button
        onPress={() => {
          auth().signOut();
        }}
        title="Logout"
      />

      <FlatList
        data={['Banana', 'Pizza', 'Apples']}
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
