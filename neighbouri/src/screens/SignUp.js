import * as React from 'react';
import { Button, Text, TextInput, TouchableOpacity, StyleSheet, View } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const styles = StyleSheet.create({
    titleText: {
      fontSize: 50,
      fontWeight: "bold",
      textAlign: "center",
      color: "dodgerblue"
    },
    subTitleText: {
        fontSize: 25,
        textAlign: "center",
        color: "dodgerblue",
        marginBottom: 15
    },
    linkButton: {
        alignItems: "center",
        marginTop: 30,
        height: 50
    },
    linkButtonText: {
        fontSize: 15,
        color: "dodgerblue"
    },
    formContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    centeredForm: {
        width: 250
    },
    signUpButton: {
        marginTop: 15
    },
    validationError: {
        fontSize: 15,
        textAlign: "center",
        color: "red",
        marginTop: 15
    }
  });

const usersCollection = firestore().collection('Users');

async function signUp(username, email, postalCode, password, setErrorMessage) {
    if (!username) {
        setErrorMessage('Please enter a username');
        return;
    } else if(!email) {
        setErrorMessage('Please enter your email');
        return;
    } else if (!password) {
        setErrorMessage('Please enter your password');
        return;
    } else if (password.length < 6) {
        setErrorMessage('The given password is invalid. Password should be at least 6 characters.');
        return;
    }

    await auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log('User account created & signed in!');
            userCredential.user.updateProfile({
                displayName: username
            }).then(() => {
                console.log("Added display name to user");
                usersCollection.add({
                    uid: userCredential.user.uid,
                    postalCode: postalCode,
                  })
                  .then(() => {
                    console.log('User to cloud storage');
                  }).catch(e => {
                    console.log("There was an error user to cloud storage: ", e);
                  });
            }).catch(error => {
                console.log("There was an error adding username to user: ", error);
            });
        })
        .catch(error => {
            if (error.code === 'auth/email-already-in-use') {
                console.log('That email address is already in use!');
                setErrorMessage('That email address is already in use');
                return;
            }

            if (error.code === 'auth/invalid-email') {
                console.log('That email address is invalid!');
                setErrorMessage('That email address is invalid');
                return;
            }

            console.error('Caught an error: ', error);
            setErrorMessage("An error occurred while signing up. Please refresh and try again.");
        });
}

export default function SignUpScreen({ navigation }) {
    const [email, setEmail] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [postalCode, setPostalCode] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState('');

    return (
        <View style={styles.formContainer}>
            <View style={styles.centeredForm}>
                <Text style={styles.titleText}>Sign Up</Text>
                <Text style={styles.subTitleText}>to Neighbouri</Text>
                <TextInput
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                />
                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    placeholder="Postal Code (Optional)"
                    value={postalCode}
                    onChangeText={setPostalCode}
                />
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <View style={styles.signUpButton} >
                    <Button title="Sign up" onPress={() => {
                                    signUp(username, email, postalCode, password, setErrorMessage)
                                    .then(() => {
                                        // do nothing
                                    }).catch((error) => {
                                        console.log(error);
                                    })
                            }
                        }/>
                </View>
                <View>
                    {!!errorMessage &&
                    <Text style={styles.validationError}>{errorMessage}</Text>}
                </View>
                <TouchableOpacity
                    title=""
                    style={styles.linkButton}
                    onPress={() => navigation.navigate('LogIn')}
                >
                    <Text style={styles.linkButtonText}>Already have an account? Log In</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
  }