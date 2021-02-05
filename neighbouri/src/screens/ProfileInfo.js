import * as React from 'react';
import { SafeAreaView, Text, View, FlatList } from 'react-native';
import HistoryButton from '../components/HistoryButton';
import BackButton from '../components/navigation/BackButton';
import Header from '../components/navigation/Header';
import ChangeUsernameButton from '../components/ChangeUsernameButton';



export default function ProfileInfoScreen({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', backgroundColor: 'white' }}>
      <ChangeUsernameButton />
      <Text>
        Profile Info!
        </Text>
    </SafeAreaView>
  );
  
}

