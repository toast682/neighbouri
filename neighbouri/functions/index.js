const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const stripe = require('stripe')(
  // eslint-disable-next-line max-len
  'sk_test_51IMiMKEAQtvGC7XYoT2MCd7oUSzNP8c4xoDG9dac5tYVqxaVYUFUzCtI8nSLhpadrOjYuEk0w6vykrGlbCqjxyYW003fQ6qlv1',
);

exports.completePaymentWithStripe = functions.https.onRequest((req, res) => {
  stripe.charges
    .create({
      amount: req.body.amount,
      currency: req.body.currency,
      source: 'tok_mastercard',
    })
    .then((charge) => {
      res.send(charge);
    })
    .catch((err) => {
      console.log(err);
    });
});
