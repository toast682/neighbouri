import React, {useEffect, useState} from 'react';
import { Image, View, Text, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { Rating } from 'react-native-ratings';
import {Icon} from 'react-native-elements';

export default function SellerInfoCard(sellerID) {
    const [seller, setSeller] = useState(null);
    const [avatarURI, setAvatarURI] = useState('');
    const [sellerRating, setSellerRating] = useState(0);
    const [sellerNumberOfRatings, setSellerNumberOfRatings] = useState(0);

    useEffect(() => {
        getSeller();
      }, []);

    async function getSeller() {
        await firestore()
          .collection('Users')
          .where('uid', '==', sellerID.SellerID)
          .get()
          .then((seller) => {
              if (!seller.empty) {
                const sellerData = seller.docs[0].data();
                setSeller(sellerData);
                if (!!sellerData  && !!sellerData.SellerRating) {
                    setSellerRating(sellerData.SellerRating[1]);
                    setSellerNumberOfRatings(sellerData.SellerRating[0]);
                }
                storage().ref(sellerData.IconURI).getDownloadURL().then((reference => {
                    setAvatarURI(reference);
                }));
              }
          })
          .catch((error) => {
            console.log("Caught an error getting Seller in SellerInfoCard.js: ", error);
        });
      }

    return (
        <TouchableOpacity
            onPress={() => {console.log('navigate.navigate to seller profile') }}
            style={{ alignSelf: 'stretch' }}>
            <View style={{
                alignSelf: 'stretch',
                marginLeft: 10,
                marginRight: 10,
                padding: 5
                }}>
                <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1, minHeight: 70}}>
                        {!!avatarURI && <Image
                            source={{ uri: avatarURI }}
                            style={{
                                width: 60,
                                height: 60,
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 30,
                                margin: 5
                                }}
                        />}
                    </View>
                    <View style={{
                        flex: 2,
                        justifyContent: 'center',
                        padding: 10,
                        minHeight: 70
                        }}>
                        <Text>{seller && seller.Username}</Text>
                        <Text>{seller && seller.Email}</Text>
                        <View style={{
                            flex: 1,
                            alignItems: 'center',
                            flexDirection: 'row'
                        }}>
                        <View style={{
                            marginRight: 4
                        }}>
                        <Icon
                            name="envelope-o"
                            type="font-awesome"
                            size={15}
                        />
                        </View>
                        <Text>{seller && seller.email}</Text>
                        </View>
                    </View>
                    <View style={{
                        flex: 2,
                        paddingTop: 10,
                        flexDirection: 'row',
                        minHeight: 70
                        }}>
                        <Rating
                            startingValue={sellerRating}
                            readonly={true}
                            imageSize={20}
                            ratingCount={5}
                        />
                        <Text> ({sellerNumberOfRatings})</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
  }