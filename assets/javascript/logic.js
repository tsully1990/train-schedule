// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new employees - then update the html + update the database
// 3. Create a way to retrieve employees from the employee database.
// 4. Create a way to calculate the months worked. Using difference between start and current time.
//    Then use moment.js formatting to set difference in months.
// 5. Calculate Total billed

// 1. Initialize Firebase
var firebaseConfig = {
    apiKey: "AIzaSyAc7anBBihwIHiZI8ntcld55Bon3TKwj08",
    authDomain: "school-81536.firebaseapp.com",
    databaseURL: "https://school-81536.firebaseio.com",
    projectId: "school-81536",
    storageBucket: "school-81536.appspot.com",
    messagingSenderId: "861140449867",
    appId: "1:861140449867:web:f7a308d45153a609132bce",
    measurementId: "G-TGS0F63QH3"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var database = firebase.database();
  
  // 2. Button for adding Employees
  $("#add-train-btn").on("click", function(event) {
    event.preventDefault();
  
    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrain = $("#time-input").val().trim();
    var frequency = $("#rate-input").val().trim();
  
    // Creates local "temporary" object for holding employee data
    var newTrain = {
      name: trainName,
      destination: destination,
      firstTrain: firstTrain,
      frequency: frequency
    };
  
    // Uploads employee data to the database
    database.ref().push(newTrain);
  
    // Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.firstTrain);
    console.log(newTrain.frequency);
  
    alert("Train successfully added");
  
    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#time-input").val("");
    $("#rate-input").val("");
  });
  
  // 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
  database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
  
    // Store everything into a variable.
    var tName = childSnapshot.val().name;
    var tDest = childSnapshot.val().destination;
    var tTime = childSnapshot.val().firstTrain;
    var tFreq = childSnapshot.val().frequency;
  
    // Employee Info
    console.log(tName);
    console.log(tDest);
    console.log(tTime);
    console.log(tFreq);
  
  
    var timeArr = tTime.split(":");
  var trainTime = moment()
    .hours(timeArr[0])
    .minutes(timeArr[1]);
  var maxMoment = moment.max(moment(), trainTime);
  var tMinutes;
  var tArrival;
  // If the first train is later than the current time, sent arrival to the first train time
  if (maxMoment === trainTime) {
    tArrival = trainTime.format("hh:mm A");
    tMinutes = trainTime.diff(moment(), "minutes");
  } else {
    // Calculate the minutes until arrival using hardcore math
    // To calculate the minutes till arrival, take the current time in unix subtract the FirstTrain time
    // and find the modulus between the difference and the frequency.
    var differenceTimes = moment().diff(trainTime, "minutes");
    var tRemainder = differenceTimes % tFreq;
    tMinutes = tFreq - tRemainder;
    // To calculate the arrival time, add the tMinutes to the current time
    tArrival = moment()
      .add(tMinutes, "m")
      .format("hh:mm A");
  }
  console.log("tMinutes:", tMinutes);
  console.log("tArrival:", tArrival);

    // Create the new row
    $("#train-table > tbody").append(
    $("<tr>").append(
      $("<td>").text(tName),
      $("<td>").text(tDest),
      $("<td>").text(tFreq),
      $("<td>").text(tArrival),
      $("<td>").text(tMinutes),
    )
    )  
  });
  
  // Example Time Math
  // -----------------------------------------------------------------------------
  // Assume Employee start date of January 1, 2015
  // Assume current date is March 1, 2016
  
  // We know that this is 15 months.
  // Now we will create code in moment.js to confirm that any attempt we use meets this test case
  