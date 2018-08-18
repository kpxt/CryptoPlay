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
// var username2 = "";
// var loginPwd = "";


//register user
$("#btnSubmit").on("click", function (event) {

  event.preventDefault();

  username = $("#usernameRegister").val().trim();
  email = $("#emailInput1").val().trim();
  pwd = $("#inputPwd1").val().trim();
  cfmPwd = $("#confirmPassword").val().trim();


  var newUser = {
    username: username,
    email: email,
    password: pwd,
    confirm: cfmPwd,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  };
  //push to firebase
  var userRef = database.ref("/" + username);
  console.log(userRef);
  database.ref("/" + username + "/email").set(email);
  if (pwd == cfmPwd) {
    database.ref("/" + username + "/password").set(pwd);
  } else {
    alert("Passwords do not match");
  };
  database.ref("/" + username + "/accountBday").set(firebase.database.ServerValue.TIMESTAMP);
  var userPortfolio = database.ref("/" + username + "/portfolio");

  //log new user
  console.log(newUser.username);

  firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode);
    console.log(errorMessage);
   
  });
  //clear fields
  clear();


});

//login user
$("#logIn").on("click", function (event) {
  event.preventDefault();

  var username2 = $("#usernameInput").val().trim();
  var loginPwd = $("#passwordInput2").val().trim();
  console.log(username2);
  console.log(loginPwd);

  database.ref("/" + username2).once("value").then(function(snapshot) {
    if (snapshot.val() == null) {
      alert("There is no username with that name")
    } else {
      if (loginPwd == snapshot.val().password) {
        // successful login
        sessionStorage.setItem("loggedIn", true);
        window.location.replace("index.html");
      } else {
        alert("Incorrect password");
      }
    };
  });
  /* firebase.auth().signInWithEmailAndPassword(email, loginPwd).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode);
    console.log(errorMessage);
    // ...
  });*/

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

/*
 service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}*/

$("#signOut").on("click", function (event) {
  event.preventDefault();

  firebase.auth().signOut().then(function() {
    // Sign-out successful.
  }).catch(function(error) {
    console.log(error);
  });
    clear();
});