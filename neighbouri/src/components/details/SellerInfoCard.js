import React, {useEffect, useState} from 'react';
import { Image, View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { Rating, AirbnbRating } from 'react-native-ratings';
import {Icon} from 'react-native-elements';


export default function SellerInfoCard(sellerID) {
    const [seller, setSeller] = useState(null);
    const [avatarURI, setAvatarURI] = useState('');
    const [sellerRating, setSellerRating] = useState(0);
    const [sellerNumberOfRatings, setSellerNumberOfRatings] = useState(0);
    const [newRating, setNewRating] = useState(0);
    const [show, setShow] = useState(false);
    const [documentId, setDocumentId] = useState('');

    useEffect(() => {
        getSeller();
      }, []);

    async function updateRating() {
          await firestore()
          .collection('Users')
          .doc(documentId)
          .update({
            SellerRating:[sellerNumberOfRatings+1,(sellerRating*sellerNumberOfRatings+newRating)/(sellerNumberOfRatings+1)]
            })
          .catch((e) => {
                  console.log(e);
          });
    }

    async function getSeller() {
        await firestore()
          .collection('Users')
          .where('uid', '==', sellerID.SellerID)
          .get()
          .then((seller) => {
              if (!seller.empty) {
                const sellerData = seller.docs[0].data();
                setSeller(sellerData);
                setDocumentId(seller.docs[0].id);
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
        <View>
        <TouchableOpacity
            onPress={() => {setShow(true)}}
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

        <Modal transparent={true} visible={show}>
           <View style={styles.modalOuterContainer}>
              <View style={styles.modalInnerContainer}>
                 <Text style={styles.title}> Rate the seller </Text>
                 <AirbnbRating showRating
                    readonly={false}
                    onFinishRating={setNewRating}
                    reviews={["Terrible", "Bad", "OK", "Good","Amazing"]}
                    imageSize={40}/>
                 <View style={{ flexDirection:"row" }}>
                    <TouchableOpacity style={styles.button} onPress={()=>{setShow(false);}}>
                       <Text style={styles.buttonText}>{"CLOSE"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={()=>{
                       setShow(false);
                       updateRating();
                      }}>
                        <Text style={styles.buttonText}>{"SUBMIT"}</Text>
                    </TouchableOpacity>
                 </View>
              </View>
           </View>
        </Modal>
        </View>
    );
  }

  const styles = StyleSheet.create({

    title: {
      color: '#48CA36',
      fontSize: 30,
      marginBottom: 20,
      marginTop: 20,
      textAlign:'center',
    },

    button: {
        backgroundColor: "#48CA36",
        borderRadius: 20,
        paddingVertical: 7,
        paddingHorizontal: 7,
        margin:30,
        fontSize: 20,
      },

    buttonText: {
        fontSize: 18,
        color: "#fff",
        alignSelf: "center",
    },

    modalOuterContainer: {
      flex: 1,
      backgroundColor: '#000000aa',
    },

    modalInnerContainer: {
      flex: 1,
      backgroundColor: '#ffffff',
      justifyContent: 'center',
      margin: 50,
      marginTop: 240,
      marginBottom: 240,
      padding: 40,
      borderRadius: 10,
      alignItems: 'center',
    },
  });
