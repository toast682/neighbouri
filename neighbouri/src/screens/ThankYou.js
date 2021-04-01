import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {Button} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Image} from 'react-native';
import auth from '@react-native-firebase/auth';

export default function ThankYou({route, navigation}) {
  const {item} = route.params;
  const currentUserId = auth().currentUser.uid;
  const currentSellerId = item.SellerID;
  const [sellerName, setSellerName] = useState();

  async function createChat() {
    await navigation.popToTop();
    await firestore()
      .collection('Chats')
      .add({
        chatMembers: [currentUserId, currentSellerId],
        messages: [
          {
            _id: Math.random() * 100000,
            createdAt: new Date(),
            text: auth().currentUser.displayName + " purchased " + item.Item,
            user: {
              _id: currentUserId,
              name: auth().currentUser.displayName,
              avatar: auth().currentUser.photoURL,
            },
          },
        ],
      })
      .then((res) => {
        const id = res.id;
        console.log('id', id);
        navigation.push('ChatScreen', {
          docID: id,
        });
      });
  }

  useEffect(() => {
    firestore()
      .collection('Users')
      .doc(item.SellerID)
      .get()
      .then((doc) => {
        if (doc.exists) {
          setSellerName(doc.data().Username);
        } else {
          console.log('doc does not exist');
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <View
      style={{justifyContent: 'center', alignItems: 'center', paddingTop: 50}}>
      <View style={{width: 400, height: 300}}>
        <Image
          style={{
            width: '100%',
            height: '100%',
            resizeMode: 'cover',
          }}
          source={require('../assets/Celebrate.png')}
        />
      </View>
      <Text style={{fontWeight: 'bold', fontSize: 22, marginTop: 30}}>
        Thank you for your purchase!
      </Text>
      <Text
        style={{
          width: '80%',
          textAlign: 'center',
          marginTop: 30,
          fontSize: 18,
        }}>
        You can chat with the seller
        <Text style={{fontWeight: 'bold'}}> {sellerName} </Text>to arrange
        pickup time and location!
      </Text>
      <TouchableOpacity
        style={{
          marginTop: 25,
          width: '90%',
          backgroundColor: '#48CA36',
          borderRadius: 25,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => {
          createChat();
        }}>
        <Text
          style={{
            color: 'white',
            fontSize: 18,
            paddingHorizontal: 40,
            paddingVertical: 10,
          }}>
          CHAT
        </Text>
      </TouchableOpacity>
    </View>
  );
}
