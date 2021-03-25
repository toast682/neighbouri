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
      navigation: this.props.route.params.navigation,
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
        .then(() => {
          console.log('success');
          this.state.navigation.navigate('ThankYou', {
            item: this.state.item
          });
        })
        .catch((e) => console.log(e));
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
        <Text style={styles.header}>Contact Information</Text>
        <TextInput
          placeholder="Name"
          placeholderTextColor="gray"
          style={styles.inputStyle}
          onChangeText={(val) => {
            this.setState({name: val});
          }}
        />
        <TextInput
          placeholder="Email"
          placeholderTextColor="gray"
          style={styles.inputStyle}
          onChangeText={(val) => {
            this.setState({email: val});
          }}
        />
        <TextInput
          placeholder="Phone Number"
          placeholderTextColor="gray"
          style={styles.inputStyle}
          onChangeText={(val) => {
            this.setState({phone: val});
          }}
          keyboardType={'phone-pad'}
        />
        <Text style={{alignSelf: 'flex-start', marginTop: 20}}>
          Billing Address:
        </Text>
        <TextInput
          placeholder="Address"
          placeholderTextColor="gray"
          style={styles.inputStyle}
          onChangeText={(val) => {
            this.setState({address: val});
          }}
        />
        <View style={{flexDirection: 'row'}}>
          <TextInput
            placeholder="City"
            placeholderTextColor="gray"
            style={[styles.inputStyle, {flex: 2, marginRight: 10}]}
            onChangeText={(val) => {
              this.setState({city: val});
            }}
          />
          <TextInput
            placeholder="State"
            placeholderTextColor="gray"
            style={[styles.inputStyle, {flex: 1}]}
            onChangeText={(val) => {
              this.setState({state: val});
            }}
          />
        </View>
        <TextInput
          placeholder="Postal Code"
          placeholderTextColor="gray"
          style={styles.inputStyle}
          onChangeText={(val) => {
            this.setState({postalCode: val});
          }}
        />
        <PaymentButton
          text="ENTER CARD DETAILS"
          loading={loading}
          style={{
            alignItems: 'center',
            borderRadius: 25,
            backgroundColor: '#48CA36',
            width: '90%',
            borderWidth: 0,
            marginTop: 30,
          }}
          onPress={this.handleCardPayPress}
          disabled={this.state.disabled}
        />
        <View
          style={{
            marginTop: 25,
            width: '90%',
            backgroundColor: '#48CA36',
            borderRadius: 25,
          }}>
          <Button
            title="Make Payment"
            loading={loading}
            color="white"
            onPress={this.makePayment}
            disabled={paymentMethod === null}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: '5%',
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
  inputStyle: {
    height: 40,
    width: '100%',
    borderColor: '#6c6767',
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 10,
    paddingLeft: 5,
    backgroundColor: 'white',
  },
});
