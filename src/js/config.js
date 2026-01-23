/*in this file we'll put all variables that should be constance and should be reused across the projects,
and the goal of having this file with all these variables is that it will allow us to easly configure,
or project by simply changing some of the data that is hre in this configuration file*/

/*ofcourse we'll not want to put all the variables here in this file,
the only variable that we do want here are the ones that are responsible for kind of defing some important data,
about the application itself*/
/*one exsample is the api url, that we'll re-use in multiple places across this project,
for exsampl efore getting search data and also for uploading a recipe to the server,
and so all of them will use this url, 
maybe at some point needs to change, because there might be a version 3 at some point,
and so as alway we don't want to change that everywhere, 
and simply have a variable which contains this url which we can then reuse*/
/*with this configuration, we'll use an api key */

//export const API_URL = `https://forkify-api.herokuapp.com/api/v2/recipes/`;
export const API_URL = `https://forkify-api.herokuapp.com/api/v2/recipes`;
/*it's all uppercse because it's a constance that will never change */

/*to change the seconds in timeout promise, we'll define seconds here */
export const TIMEOUT_SEC = 10;

// lecture 310
/*let's ad a number of results per page in the config.js */
export const RES_PER_PAGE = 10;

// Storing API key
export const KEY = `6ac1d600-a2db-4486-b0bb-70de2691ad6c`;

export const MODAL_CLOSE_SEC = 2.5;
