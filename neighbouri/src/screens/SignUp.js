import * as React from 'react';
import { Button, Text, TextInput, StyleSheet, View } from 'react-native';
import auth from '@react-native-firebase/auth';
import { Link } from '@react-navigation/native';

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
    goToLoginText: {
        fontSize: 15,
        textAlign: "center",
        color: "dodgerblue",
        marginTop: 50
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

async function signUp(email, password, setErrorMessage, setTriedSignUp) {
    console.log(email);
    console.log(password)
    setTriedSignUp(true);
    if (!email || !password) { // add validation
        setErrorMessage('Please fill both email and password');
        return;
    }
    await auth().createUserWithEmailAndPassword(email, password)
        .then(() => {
            console.log('User account created & signed in!');
        })
        .catch(error => {
            console.log('caught an error');
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

            console.error(error);
            setErrorMessage(error);
        });
}

export default function SignUpScreen() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState('');
    const [triedSignUp, setTriedSignUp] = React.useState(false);

    return (
        <View style={styles.formContainer}>
            <View style={styles.centeredForm}>
                <Text style={styles.titleText}>Sign Up</Text>
                <Text style={styles.subTitleText}>to Neighbouri</Text>
                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <View style={styles.signUpButton} >
                    <Button title="Sign up" onPress={() => {
                                    signUp(email, password, setErrorMessage, setTriedSignUp)
                                    .then(() => {
                                        // do nothing
                                    }).catch((error) => {
                                        console.log(error);
                                    })
                            }
                        }/>
                </View>
                <View>
                    {triedSignUp && !!errorMessage &&
                    <Text style={styles.validationError}>{errorMessage}</Text>}
                </View>
                <Link to="/" style={styles.goToLoginText}>Already have an account? Log In</Link>
            </View>
        </View>
    );
  }