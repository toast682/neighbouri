import * as React from 'react';
import { Button, Text, TextInput, TouchableOpacity, StyleSheet, View } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const styles = StyleSheet.create({
    titleText: {
      fontSize: 30,
      marginVertical: 20,
      fontWeight: "bold",
      textAlign: "center",
      color: "black"
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
        height: 50,
    },
    linkButtonText: {
        fontSize: 15,
        color: "black"
    },
    formContainer: {
        flex: 1,
        alignItems: "center",
        backgroundColor: 'white'
    },
    centeredForm: {
        width: '80%',
    },
    signUpButton: {
        marginTop: 25,
        width: '100%',
        backgroundColor: '#48ca36',
        borderRadius: 8,
    },
    validationError: {
        fontSize: 15,
        textAlign: "center",
        color: "red",
        marginTop: 15
    },
    inputStyle: {height: 40, width: '100%', borderColor: '#6c6767', borderWidth: 1, borderRadius: 8, marginTop: 10, paddingLeft: 5,},
  });

async function signUp(username, email, fullName, password, setErrorMessage) {
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
                firestore().collection('Users').doc(userCredential.user.uid).set({
                    uid: userCredential.user.uid,
                    fullName: fullName,
                    email: email,
                    Username: username
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
    const [fullName, setFullName] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState('');

    return (
        <View style={styles.formContainer}>
            <View style={styles.centeredForm}>
                <View style={{backgroundColor: 'green', width: 100, height: 100, alignSelf: 'center', marginTop: 100, borderRadius: 100,}}></View>
                <Text style={styles.titleText}>Sign Up</Text>
                <TextInput
                    placeholder="Full Name"
                    value={fullName}
                    style={styles.inputStyle}
                    onChangeText={setFullName}
                    placeholderTextColor="grey"
                />
                <TextInput
                    placeholder="Username"
                    value={username}
                    style={styles.inputStyle}
                    onChangeText={setUsername}
                    placeholderTextColor="grey"
                />
                <TextInput
                    placeholder="Email"
                    value={email}
                    style={styles.inputStyle}
                    onChangeText={setEmail}
                    placeholderTextColor="grey"
                />
                <TextInput
                    placeholder="Password"
                    value={password}
                    style={styles.inputStyle}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholderTextColor="grey"
                />
                <View style={styles.signUpButton} >
                    <Button title="SIGN UP" color='white' onPress={() => {
                                    signUp(username, email, fullName, password, setErrorMessage)
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
                    <Text style={styles.linkButtonText}>Already have an account? <Text style={{color: '#f9a528'}}>Log In</Text></Text>
                </TouchableOpacity>
            </View>
        </View>
    );
  }