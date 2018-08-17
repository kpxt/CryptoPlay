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

var username = "";
var email = "";
var pwd = "";
var cfmPwd = "";
var username2 = "";
var loginPwd = "";


//register user
$("#btnSubmit").on("click", function (event) {

  event.preventDefault();

  username = $("#usernameInput").val().trim();
  email = $("#emailInput1").val().trim();
  pwd = $("#inputPwd1").val().trim();
  cfmPwd = $("#confirmPassword").val().trim();


  var newUser = {
    username: username,
    email: email,
    pasword: pwd,
    confirm: cfmPwd,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  };
  //push to firebase
  database.ref().push(newUser);

  //log new user
  console.log(newUser.username);
  console.log(newUser.email);
  console.log(newUser.password);
  console.log(newUser.confirm);

  //clear fields
  clear();


});

//login user
$("#logIn").on("click", function (event) {
  event.preventDefault();

  username2 = $("#usernameInput").val().trim();
  loginPwd = $("#passwordInput2").val().trim();
  console.log(username2);
  console.log(loginPwd);


  clear();
});

//clear all user fields
function clear() {
  $("#usernameInput").val("");
  $("#emailInput1").val("");
  $("#inputPwd1").val("");
  $("#confirmPassword").val("");
  $("#usernameInput").val("");
  $("#passwordInput2").val("");
};