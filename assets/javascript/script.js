// Firebase config & initialize
var config = {
    apiKey: "AIzaSyAb05dv0J2lJ59TRe-USM0Bfbk2VPILe00",
    authDomain: "first-project-e509a.firebaseapp.com",
    databaseURL: "https://first-project-e509a.firebaseio.com",
    projectId: "first-project-e509a",
    storageBucket: "first-project-e509a.appspot.com",
    messagingSenderId: "223511473689"
};

firebase.initializeApp(config);
var database = firebase.database();

// Initial variables
var trainName = "";
var trainDestination = "";
var trainTimeFirst = "";
var trainFrequency = "";

// Add train function
$("#add_train").on("click", function(event) {

    event.preventDefault();

    // Pulls value from input
    trainName = $("#input_train_name").val().trim();
    trainDestination = $("#input_destination").val().trim();
    trainTimeFirst = $("#input_train_time").val().trim();
    trainFrequency = $("#input_frequency").val().trim();

    // Push to database
    database.ref().push({
        nameDb: trainName,
        destinationDb: trainDestination,
        frequencyDb: trainFrequency,
        firstTrainDb: trainTimeFirst,
        dateAddedDb: firebase.database.ServerValue.TIMESTAMP
    });

    // Clears form after submit
    $("#input_train_name").val("");
    $("#input_destination").val("");
    $("#input_train_time").val("");
    $("#input_frequency").val("");
});

// Firebase watcher, initial loader
database.ref().on("child_added", function(childsnapshot) {

    trainName = childsnapshot.val().nameDb;
    trainDestination = childsnapshot.val().destinationDb;
    trainTimeFirst = childsnapshot.val().firstTrainDb;
    trainFrequency = childsnapshot.val().frequencyDb;

    // Calculations of next train and minutes away
    var trainTimeConverted = moment(trainTimeFirst, "HH:mm").subtract(1, "years");
    var currentTime = moment();
    var diffTime = moment().diff(moment(trainTimeConverted), "minutes");
    var remainderTime = diffTime % trainFrequency;
    var trainMinutesAway = trainFrequency - remainderTime;
    var trainNext = moment().add(trainMinutesAway, "minutes");
    
    childsnapshot.val().nameDb;
    childsnapshot.val().destinationDb;
    childsnapshot.val().frequencyDb;
    childsnapshot.val().nextArrivalDb;
    childsnapshot.val().minutesAwayDb;

    // Appending to table 
    $("#train_schedule > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" + trainFrequency + "</td><td>" + moment(trainNext).format("hh:mm") + "</td><td>" + trainMinutesAway + "</td><tr>");

    // Error handler
}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});


