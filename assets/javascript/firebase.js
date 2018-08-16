// Initialize Firebase
 var config = {
  apiKey: "AIzaSyAlIEi8_mjg-nMMp7wD1cFfqq22H8Oz75I",
  authDomain: "project-x-b0368.firebaseapp.com",
  databaseURL: "https://project-x-b0368.firebaseio.com",
  projectId: "project-x-b0368",
  storageBucket: "project-x-b0368.appspot.com",
  messagingSenderId: "377881918863"
};
firebase.initializeApp(config);

var database = firebase.database();

//register user
$("#register").on("click", function (event) {
  event.preventDefault();

  var username = $("#usernameInput").val().trim();
  var email = $("#EmailInput1").val().trim();
  var pwd = $("#InputPwd1").val().trim();
  var cfmPwd = $("#confirmPassword").val().trim();

  var newUser = {
    username: username,
    email: email,
    pasword: pwd,
    confirm: cfmPwd,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  };
  database.ref().push(newUser);

  //clear fields
  clear();

}, function (errorObject) {
  console.log(errorObject)
});

//login user
$("#logIn").on("click", function (event) {
  event.preventDefault();

  var username2 = $("#usernameInput").val().trim();
  var loginPwd = $("#passwordInput2").val().trim();

});

//clear all user fields
function clear() {
  $("#usernameInput").val("");
  $("#EmailInput1").val("");
  $("#InputPwd1").val("");
  $("#confirmPassword").val("");
};