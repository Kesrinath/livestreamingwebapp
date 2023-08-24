/* 1- open the indexdb database.
  2- initilize the database.
  3- create the dataobjectstore.
*/

let database;
let openRequest = indexedDB.open("liverecordingproject");
openRequest.addEventListener("sucess", function () {
  database = openRequest.result;
});
openRequest.addEventListener("upgradeneeded", function () {
  database = openRequest.result;
  database.createObjectStore("video", { keyPath: "id" });
});
openRequest.addEventListener("error", function () {
  console.log("database is not opening due to some errors");
});
