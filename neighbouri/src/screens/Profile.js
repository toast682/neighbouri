import React, {useEffect, useState} from 'react';
import {Text, View, FlatList, Image, StyleSheet, Modal, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
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
import { Rating } from 'react-native-ratings';


export default function ProfileScreen({navigation}) {
  const HFlatList = HPageViewHoc(FlatList);

  const [photo, setPhoto] = useState();
  const [user, setUser] = useState();
  const [show, setShow] = useState(false);
  const [currRating, setCurrRating] = useState(0);


  useEffect(() => {
    getData();
  }, []);

  function showRating(rating) {
    setCurrRating(rating);
    setShow(true);
  }

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
              <Rating
                  startingValue={user.SellerRating[1]}
                  readonly={true}
                  imageSize={25}
                  ratingCount={5}
              />
              {UserInfoText(require('../assets/History.png'), user.Phone)}
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
                  <Text onPress={()=>{showRating(3)}}>Review Seller</Text>
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


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },

  title: {
    color: '#3dafe0',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 50,
    marginBottom: 70,
  },

  modalOuterContainer: {
    flex: 1,
    backgroundColor: '#000000aa',
  },

  modalInnerContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    margin: 50,
    padding: 40,
    borderRadius: 10,
    alignItems: 'center',
  },

  button: {
    color: '#3dafe0',
    margin: 50,
  },
  input: {
    margin: 10,
    height: 40,
    borderColor: '#000000',
    borderWidth: 1,
    width: 200,
  },
});
