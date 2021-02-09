import * as React from 'react';
import { SafeAreaView, Text, View, FlatList } from 'react-native';
import HistoryButton from '../components/HistoryButton';
import BackButton from '../components/navigation/BackButton';
import Header from '../components/navigation/Header';
import ChangeUsernameButton from '../components/ChangeUsernameButton';
import UploadImageButton from '../components/UploadImageButton';



export default function ProfileInfoScreen({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', backgroundColor: 'white' }}>
     {Header(
            BackButton(navigation), 
            <Text style={{flex: 5, alignSelf: 'center', textAlign: 'center', fontWeight: 'bold'}}>@Username</Text>, 
            <View style={{ flex: 1 }}></View>
        )}
    <UploadImageButton/>
      <ChangeUsernameButton />
    </SafeAreaView>
  );
  
}

