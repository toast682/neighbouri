import React, {PureComponent} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import stripe from 'tipsi-stripe';
import axios from 'axios';
import firestore from '@react-native-firebase/firestore';
import PaymentButton from '../components/PaymentButton';
const usersCollection = firestore().collection('Transactions');
stripe.setOptions({
  publishableKey:
    'pk_test_51IMiMKEAQtvGC7XYvHlmHIB7u8rGrPdr0aza22okKVwSYsq5nzA20BxxK32BPeYekk6v3bkvJ0Q3EofnyoWyx5R700YXgJ8YyA',
});

export default class CardFormScreen extends PureComponent {
  static title = 'Card Form';
  state = {
    loading: false,
    paymentMethod: null,
    disabled: false,
  };

  makePayment = async () => {
    this.setState({loading: true});

    axios({
      method: 'POST',
      url:
        'https://us-central1-neighbouri.cloudfunctions.net/completePaymentWithStripe',
      data: {
        amount: 1000,
        currency: 'CAD',
        token: this.state.paymentMethod,
      },
    }).then((res) => {
      console.log(res);
      this.setState({loading: false, disabled: true});
    });
  };

  handleCardPayPress = async () => {
    try {
      this.setState({loading: true, paymentMethod: null});

      const paymentMethod = await stripe.paymentRequestWithCardForm();
      this.setState({loading: false, paymentMethod});

      usersCollection
        .add(paymentMethod)
        .then(console.log('success'))
        .error(console.error());
    } catch (error) {
      this.setState({loading: false});
    }
  };

  render() {
    const {loading, paymentMethod} = this.state;

    return (
      <View style={styles.container}>
        <Text style={styles.header}>Card Form Example</Text>
        <Text style={styles.instruction}>
          Click button to show Card Form dialog.
        </Text>
        <PaymentButton
          text="Enter your card details and pay"
          loading={loading}
          onPress={this.handleCardPayPress}
        />
        <View style={styles.paymentMethod}>
          {paymentMethod && (
            <>
              <Text style={styles.instruction}>
                Payment Method: {JSON.stringify(paymentMethod)}
              </Text>
              <Button
                title="Make Payment"
                loading={loading}
                onPress={this.makePayment}
                disabled={this.state.disabled}
              />
            </>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instruction: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  paymentMethod: {
    height: 20,
  },
});
