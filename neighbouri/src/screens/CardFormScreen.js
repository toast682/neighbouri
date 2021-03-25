import React, {PureComponent} from 'react';
import {View, Text, StyleSheet, Button, TextInput} from 'react-native';
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

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      paymentMethod: null,
      disabled: false,
      email: '',
      address: '',
      name: '',
      postalCode: '',
      state: '',
      phone: 0,
      city: '',
      item: this.props.route.params.item,
      charge: this.props.route.params.item.Price * 100,
    };
  }
  makePayment = async () => {
    this.setState({loading: true});
    axios({
      method: 'POST',
      url:
        'https://us-central1-neighbouri.cloudfunctions.net/completePaymentWithStripe',
      data: {
        amount: this.state.charge,
        currency: 'CAD',
        token: this.state.paymentMethod,
      },
    }).then((res) => {
      this.setState({loading: false, disabled: true});
      usersCollection
        .add(this.state.paymentMethod)
        .then(console.log('success'))
        .error(console.error());
    });
  };
  handleCardPayPress = async () => {
    try {
      this.setState({loading: true, paymentMethod: null});

      const paymentMethod = await stripe.paymentRequestWithCardForm();
      paymentMethod.billingDetails.name = this.state.name;
      paymentMethod.billingDetails.email = this.state.email;
      paymentMethod.billingDetails.phone = this.state.phone;
      paymentMethod.billingDetails.address.line1 = this.state.address;
      paymentMethod.billingDetails.address.city = this.state.city;
      paymentMethod.billingDetails.address.state = this.state.state;
      paymentMethod.billingDetails.address.postalCode = this.state.postalCode;
      paymentMethod.customerId = this.props.route.params.currentUserId;
      paymentMethod.item = this.state.item;
      this.setState({loading: false, paymentMethod});
    } catch (error) {
      this.setState({loading: false});
    }
  };
  updateUserInformation = () => {};

  render() {
    const {loading, paymentMethod} = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Card Form</Text>
        <TextInput
          placeholder="Name"
          onChangeText={(val) => {
            this.setState({name: val});
          }}
        />
        <TextInput
          placeholder="Email"
          onChangeText={(val) => {
            this.setState({email: val});
          }}
        />
        <TextInput
          placeholder="Phone Number"
          onChangeText={(val) => {
            this.setState({phone: val});
          }}
          keyboardType={'phone-pad'}
        />
        <Text>Address:</Text>
        <TextInput
          placeholder="Address"
          onChangeText={(val) => {
            this.setState({address: val});
          }}
        />
        <TextInput
          placeholder="City"
          onChangeText={(val) => {
            this.setState({city: val});
          }}
        />
        <TextInput
          placeholder="State"
          onChangeText={(val) => {
            this.setState({state: val});
          }}
        />
        <TextInput
          placeholder="Postal Code"
          onChangeText={(val) => {
            this.setState({postalCode: val});
          }}
        />
        <PaymentButton
          text="Enter your card details and pay"
          loading={loading}
          onPress={this.handleCardPayPress}
          disabled={this.state.disabled}
        />
        <View style={styles.paymentMethod}>
          {paymentMethod && (
            <>
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
