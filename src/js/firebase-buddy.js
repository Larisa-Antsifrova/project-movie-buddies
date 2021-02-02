import { db, auth, firebase } from './firebase-init';
import { currentMovieItem } from './show-details.js';

// Users query test
const buddies = db.collection('users').where('movies', 'array-contains', 458220);
buddies.get().then(querySnapshot => {
  querySnapshot.forEach(doc => console.log({ name: doc.data().name, email: doc.data().email }));
});
