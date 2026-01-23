/*the goal of this file/moduleis to contain a couple of functions that we reuse over and over in our project,
so in this modul we'll have a central palce for all of them*/
/*one great candidate is to actually create a function which will get JSON,
so a function which incapsulate all of the const res aand data with json() and if(!res.ok),
so let's get it with a function called getJson, and it will be an async function,
the function will do the fetching and conveting to json into one step*/
import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};
/*this function will return a new promise which will reject after a certain number of seconds,
so in order to now use this function we'll have a race between this timeout promise,
which will take whatever second we pass into it and the fetch() in getJSON() which is the one responsible for getting the data,
there whoever occurs first, wins the race*/

/*let's refactor getJSON() and sendJSON() */
export const AJAX = async function (url, uploadData = undefined) {
  try {
    /*if uploadData exist then it will be fetch() with post method else it will be fetch(url) */
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} ${res.status}`);

    return data;
  } catch (err) {
    throw err;
  }
};

// export const getJSON = async function (url) {
//   try {
//     /*for the race between fetch and timeout(10) with 10s we'll use Promise.race(), so */
//     const fetchPro = fetch(url);
//     const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
//     const data = await res.json();
//     if (!res.ok) throw new Error(`${data.message} ${res.status}`);
//     /*after that we want to return the data */
//     return data; /*this data is gonnabe the resolved data of the promise that the getJSON function return,
//     that's why we await this result in model.js in the async function loadRecipe,
//     then we store it in the varible const data, sempre in model.js */

//     /*let's now set a time after which we make the request fail (timeout),
//     this is imporatnt in order to prevent for really bad internet connections,
//     where then this fetch() here could be running forever*/
//   } catch (err) {
//     throw err;
//     /*with this the promise that's being returned from getJSON will actually reject,
//     now we'll be able handle the error right in model.js*/
//     /*so basically that's how we propagated the error down from one async function to the other,
//     by re-throwing the error in here in helpers.js, then it was cought and handled in the catch block in model.js*/
//   }
// };

// // Method for sending JSON

// export const sendJSON = async function (url, uploadData) {
//   try {
//     /*we'll learn how to send data using fetch function,
//     to send data we'll need a POST request, teh opposite of GET request,
//     so beside passing the URL we need to pass in some object of functions */
//     const fetchPro = fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(uploadData),
//       /*headers are somesnippets of text which are like infor about the request itself,
//       many are like standard headers, but the one thatw e want to define is 'Content-Type',
//       with 'application/json' with this we tell our api, so we specifu in the request,
//         that the data that we're gonna send is going to be in the JSON format,
//         and so only then our API can correctly accept that data and create a new recipe in the database*/
//       /*after headers there is payload, which is the data that we want to send, it's body,
//       remember that it should be in json, so JSON.stringfy() in it the data that we want to send, so that it can be sent
//       by the way this data is in the responce object when you ude fetch(url), after thet you use response.json(), to get the data,
//       so that's why this option object is veru familiar with body and headers and all*/
//     });

//     console.log(url);
//     console.log(uploadData);
//     const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
//     const data = await res.json();
//     console.log(data);
//     if (!res.ok) throw new Error(`${data.message} ${res.status}`);

//     return data;
//   } catch (err) {
//     throw err;
//   }
// };
// /*we can now use this function in the model.js to create the ajax request */
