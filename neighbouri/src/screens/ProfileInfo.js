import * as React from 'react';
import {SafeAreaView, Text, View, FlatList} from 'react-native';
import auth from '@react-native-firebase/auth';
import HistoryButton from '../components/HistoryButton';
import BackButton from '../components/navigation/BackButton';
import Header from '../components/navigation/Header';
import ChangeUsernameForm from '../components/ChangeUsernameForm';
import UploadImageButton from '../components/UploadImageButton';
import {Button} from 'react-native';
import SubmitButton from '../components/SubmitButton';

export default function ProfileInfoScreen({navigation}) {
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
          Edit Profile
        </Text>,
        SubmitButton(navigation),
      )}
      <View style={{flex: 1}}>
        <UploadImageButton />
      </View>
      <View style={{flex: 1, width: '80%'}}>
        <ChangeUsernameForm />
      </View>
      <Button
        style={{flex: 3}}
        onPress={() => {
          auth().signOut();
        }}
        title="Logout"
      />
      <View style={{flex: 1, width: 100}}/>
    </SafeAreaView>
  );
}
