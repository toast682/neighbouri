import * as React from 'react';
import { SafeAreaView, Text, View, FlatList } from 'react-native';
import HistoryButton from '../components/HistoryButton';
import BackButton from '../components/navigation/BackButton';
import Header from '../components/navigation/Header';
import ChangeUsernameForm from '../components/ChangeUsernameForm';
import UploadImageButton from '../components/UploadImageButton';
import {Button} from 'react-native';
import SubmitButton from '../components/SubmitButton';


export default function ProfileInfoScreen({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', backgroundColor: 'white' }}>
     {Header(
            BackButton(navigation), 
            <Text style={{flex: 5, alignSelf: 'center', textAlign: 'center', fontWeight: 'bold'}}>Edit Profile</Text>, 
            SubmitButton(navigation)
        )}
    <UploadImageButton/>
      <ChangeUsernameForm />
    </SafeAreaView>
  );
  
}

