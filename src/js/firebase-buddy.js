import { db, auth, firebase } from './firebase-init';
import { currentMovieItem } from './show-details.js';

// console.log(db, auth);
// console.log(currentMovieItem);

// Users query test
const buddies = db.collection('users').where('movies', 'array-contains', 458220);
buddies.get().then(querySnapshot => {
  querySnapshot.forEach(doc => console.log(doc.id));
});

//Collection Group query test
// const users = db.collectionGroup('watched').where('id', '==', 85271);
// users.get().then(snapshot => {
//   snapshot.forEach(doc => console.log(doc.id, doc.data()));
// });

// var museums = db.collectionGroup('landmarks').where('type', '==', 'museum');
// museums.get().then(function (querySnapshot) {
//   querySnapshot.forEach(function (doc) {
//     console.log(doc.id, ' => ', doc.data());
//   });
// });
