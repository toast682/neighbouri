import React, {useEffect, useState} from 'react';
import {SafeAreaView, Text, View, FlatList, Image} from 'react-native';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {HPageViewHoc} from 'react-native-head-tab-view';
import {CollapsibleHeaderTabView} from 'react-native-scrollable-tab-view-collapsible-header';
import HistoryButton from '../components/HistoryButton';
import Header from '../components/navigation/Header';
import SettingButton from '../components/SettingButton';
import GeoButton from '../components/GeoButton';
import ProfileIconButton from '../components/ProfileIconButton';
import UserInfoText from '../components/profile/UserInfoText';

export default function ProfileScreen({navigation}) {
  const HFlatList = HPageViewHoc(FlatList);

  const [photo, setPhoto] = useState();
  const [user, setUser] = useState();

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    const reference = await storage()
      .ref('ProfilePicture/Apple.jpg')
      .getDownloadURL();
    setPhoto(reference);

    await firestore()
      .collection('Users')
      .doc(auth().currentUser.uid)
      .get()
      .then((userDoc) => {
        setUser(userDoc.data());
      });
  }

  if (user === undefined) {
    return null;
  }

  return (
    <SafeAreaView
      style={{flex: 1, alignItems: 'center', backgroundColor: 'white'}}>
      {Header(
        <View style={{flex: 1}} />,
        <View style={{flex: 5}} />,
        SettingButton(navigation),
      )}
      <CollapsibleHeaderTabView
        makeHeaderHeight={() => 120}
        renderScrollHeader={() => (
          <View
            style={{
              flex: 1,
              width: '100%',
              flexDirection: 'row',
              marginBottom: 20,
            }}>
            <View>
              <Image
                source={{uri: photo}}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 100,
                  marginHorizontal: 20,
                }}></Image>
            </View>
            <View
              style={{
                flex: 1,
              }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  marginBottom: 10,
                }}>
                {user.Username}
              </Text>
              {UserInfoText(require('../assets/History.png'), user.Phone)}
              {UserInfoText(require('../assets/History.png'), user.Rating)}
            </View>
          </View>
        )}>
        <HFlatList
          index={0}
          tabLabel={'Listings'}
          data={['Banana', 'Pizza', 'Apples', 'Milk', 'Ramen']}
          renderItem={({item}) => (
            <View
              style={{
                backgroundColor: 'grey',
                margin: 10,
                height: 150,
                borderRadius: 8,
              }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  margin: 10,
                }}>
                <Text>Purchased on date</Text>
                <Text>View Receipt</Text>
              </View>
              <View style={{flex: 3, flexDirection: 'row'}}>
                <View>
                  <Image
                    source={{uri: photo}}
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 8,
                      marginHorizontal: 10,
                    }}></Image>
                </View>
                <View>
                  <Text>{item}</Text>
                  <Text>Review Seller</Text>
                </View>
              </View>
            </View>
          )}
          style={{width: '100%'}}
          keyExtractor={(name) => name}
        />
        <HFlatList
          index={1}
          data={['B', 'P', 'A']}
          tabLabel={'Purchases'}
          renderItem={({item}) => (
            <View
              style={{
                backgroundColor: 'grey',
                margin: 10,
                height: 150,
                borderRadius: 8,
              }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  margin: 10,
                }}>
                <Text>Purchased on date</Text>
                <Text>View Receipt</Text>
              </View>
              <View style={{flex: 3, flexDirection: 'row'}}>
                <View>
                  <Image
                    source={{uri: photo}}
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 8,
                      marginHorizontal: 10,
                    }}></Image>
                </View>
                <View>
                  <Text>{item}</Text>
                  <Text>Review Seller</Text>
                </View>
              </View>
            </View>
          )}
          style={{width: '100%'}}
          keyExtractor={(name) => name}
        />
        <HFlatList
          index={2}
          data={['B', 'P', 'A']}
          tabLabel={'Reviews'}
          renderItem={({item}) => (
            <View
              style={{
                backgroundColor: 'grey',
                margin: 10,
                height: 150,
                borderRadius: 8,
              }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  margin: 10,
                }}>
                <Text>Purchased on date</Text>
                <Text>View Receipt</Text>
              </View>
              <View style={{flex: 3, flexDirection: 'row'}}>
                <View>
                  <Image
                    source={{uri: photo}}
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 8,
                      marginHorizontal: 10,
                    }}></Image>
                </View>
                <View>
                  <Text>{item}</Text>
                  <Text>Review Seller</Text>
                </View>
              </View>
            </View>
          )}
          style={{width: '100%'}}
          keyExtractor={(name) => name}
        />
      </CollapsibleHeaderTabView>
    </SafeAreaView>
  );
}
