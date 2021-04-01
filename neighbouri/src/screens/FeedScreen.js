import React from 'react';
export default function FeedScreen({navigation, route}) {}

async function getUserConversations() {
  const isLessThan500K = citiesRef.where('population', '<', 500000).get();
  const isMoreThan1M5 = citiesRef.where('population', '>', 1500000).get();

  const [
    isLessThan500KQuerySnapshot,
    isMoreThan1M5QuerySnapshot,
  ] = await Promise.all([isLessThan500K, isMoreThan1M5]);

  const isLessThan500KCitiesArray = isLessThan500KQuerySnapshot.docs;
  const isMoreThan1M5Array = isMoreThan1M5QuerySnapshot.docs;

  //Note that we don't need to de-duplicate in this case
  return _.concat(isLessThan500KCitiesArray, isMoreThan1M5Array);
}

getLessThan500KOrMoreThan1M5().then((result) => {
  result.forEach((docSnapshot) => {
    console.log(docSnapshot.data());
  });
});
