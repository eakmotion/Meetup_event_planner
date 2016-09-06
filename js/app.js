"use strict";

var firstPasswordInput = document.querySelector('#registration #first-password');
var secondPasswordInput = document.querySelector('#registration #second-password');
var emailInput = document.querySelector('#registration #email');
var signupBtn = document.querySelector('#registration #signup-btn');
var signout = document.querySelector('.user-nav .sign-out');
var error = document.querySelector('#registration #errors');
var eventInput = $('#event-form');
var profileInput = $('#update-profile');
var userInput = $('#user-registration');

function IssueTracker() {
  this.issues = [];
}

IssueTracker.prototype = {
  add: function(issue) {
    this.issues.push(issue);
  },
  retrieve: function() {
    var message = "";
    switch (this.issues.length) {
      case 0:
        break;
      case 1:
        message = "Please correct the following issues:\n" + this.issues[0];
        break;
      default:
        message = "Please correct the following issues:\n" + this.issues.join("\n");
        break;
    }
    return message;
  }
}

function passwordValidation() {
  var firstPassword = firstPasswordInput.value;
  var secondPassword = secondPasswordInput.value;

  var firstInputIssuesTracker = new IssueTracker();
  var secondInputIssuesTracker = new IssueTracker();

  function checkValidations() {
    if(firstPassword.length < 8) {
      firstInputIssuesTracker.add("should be longer than 8 words");
    } else if(secondPassword.length > 100) {
      firstInputIssuesTracker.add("should be less than 100 words");
    }

    if (!firstPassword.match(/[\!\@\#\$\%\^\&\*]/g)) {
      firstInputIssuesTracker.add("missing a symbol");
    }

    if (!firstPassword.match(/[0-9]/g)) {
      firstInputIssuesTracker.add("missing a number");
    }

    if (!firstPassword.match(/[a-z]/g)) {
      firstInputIssuesTracker.add("missing a lowercase letter");
    }

    if (!firstPassword.match(/[A-Z]/g)) {
      firstInputIssuesTracker.add("missing an uppercase letter");
    }

    var illegalChars = firstPassword.match(/[^A-z0-9\!\@\#\$\%\^\&\*]/g);
    if (illegalChars) {
      illegalChars.forEach(function (illegalChar) {
        firstInputIssuesTracker.add("includes illegal characters: " + illegalChar);
      });
    }
  }

  if (firstPassword === secondPassword && firstPassword.length > 0) {
    checkValidations();
  } else {
    secondInputIssuesTracker.add("Password must be match");
  }

  var firstInputIssues = firstInputIssuesTracker.retrieve();
  var secondInputIssues = secondInputIssuesTracker.retrieve();

  firstPasswordInput.setCustomValidity(firstInputIssues);
  secondPasswordInput.setCustomValidity(secondInputIssues);
}

function emailValidation(){
  var emailValue = emailInput.value;
  var emailInputIssuesTracker = new IssueTracker();

  var emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!emailValue.match(emailPattern)) {
    emailInputIssuesTracker.add("incorrect email");
  };

  var emailInputIssues = emailInputIssuesTracker.retrieve();
  emailInput.setCustomValidity(emailInputIssues);
}

function signIn(name) {
  var userNav = $('.user-nav');
  userNav.removeClass('hidden');
  userNav.find('.username').text(name);
}

signupBtn.onclick = function () {
  emailValidation();
  passwordValidation();
};

signout.onclick = function () {
  Cookies.remove('current_user');
};

$('#user-registration').submit(function(){
    $.ajax({
      success: function(){
        Cookies.set('current_user', {
          name: userInput.find('#name').val(),
          email: userInput.find('#email').val(),
          password: userInput.find('#password').val()
        });
      }
    });
    return true;
});

function updateProfile() {
  Cookies.set('current_user', {
    name: profileInput.find('#user-name').val(),
    email: profileInput.find('#user-email').val(),
    company: profileInput.find('#user-company').val(),
    job: profileInput.find('#user-job').val(),
    birthday: profileInput.find('#user-birthday').val(),
    country: profileInput.find('#user-country').val()
  });
}

function getProfile() {
  profileInput.find('#user-name').val(Cookies.getJSON('current_user').name);
  profileInput.find('#user-email').val(Cookies.getJSON('current_user').email);
  profileInput.find('#user-company').val(Cookies.getJSON('current_user').company);
  profileInput.find('#user-job').val(Cookies.getJSON('current_user').job)
  profileInput.find('#user-birthday').val(Cookies.getJSON('current_user').birthday)
  profileInput.find('#user-country').val(Cookies.getJSON('current_user').country)
}

$('#event-form').submit(function() {
  $.ajax({
    success: function() {
      createEvent();
      addCounter();
    }
  });
  return window.location='#upcomming-event-list';
});

$('#update-profile').submit(function() {
  $.ajax({
    success: function() {
      updateProfile();
    }
  });
});

function createEvent() {
  var start_date = new Date(eventInput.find('#start-event-date').val()).toString().split(" ");
  var end_date = new Date(eventInput.find('#end-event-date').val()).toString().split(" ");
  Cookies.set('event_' + Cookies.get('counter'), {
    name: eventInput.find('#event-name').val(),
    info: eventInput.find('#event-info').val(),
    host: eventInput.find('#event-host').val(),
    type: eventInput.find('#event-type').val(),
    start_date: start_date,
    end_date: end_date,
    guest_list: eventInput.find('#event-guest').val(),
    location: eventInput.find('#event-location').val()
  });
}

function addCounter() {
  var cookieValue = Cookies.get('counter');
  cookieValue++;
  Cookies.set('counter', cookieValue);
}

$('.modal').on('shown.bs.modal', function() {
  $(this).find('[autofocus]').focus();
});

$('#end-event-date').change(function() {
  validateEventDate();
});

$('#start-event-date').change(function() {
  if ($('#end-event-date').val() != undefined) {
    validateEventDate();
  }
});

$(document).ready(function() {
  if(Cookies.get('current_user') != undefined){
    signIn(Cookies.getJSON('current_user').name);
    getProfile();
    $('#member-button').hide();
    $('#create-event-button').show();
  } else {
    $('#member-button').show();
    $('#create-event-button').hide();
  }

  if( Cookies.get('counter') == undefined ) {
    Cookies.set('counter', 0);
  }

  var obj, event_cookie;
  for (var i = 0; i <= Cookies.get('counter') ; i++) {
    event_cookie = Cookies.get('event_' + i);
    if (event_cookie == undefined) { break; }
    obj = jQuery.parseJSON(event_cookie);
    addNewEvent();
  }

  function addNewEvent() {
    var largeHtml = '<li><time><span class="day">' +
                    obj.start_date[2] + '</span><span class="month">' +
                    obj.start_date[1] + '</span><span class="year">' +
                    obj.start_date[3] + '</span><span class="time">' +
                    obj.start_date[4].substr(0,5) + '</span></time><div class="info"><h2 class="title">' +
                    obj.name + '</h2><p class="desc">' +
                    obj.info + '</p><ul><li>' +
                    '<b>Location:</b> ' + obj.location + '</li><li>' +
                    '<b>Organizer:</b> ' + obj.host + '</li></ul><ul><li>' +
                    '<b>type:</b> ' + obj.type + '</li><li>' +
                    obj.start_date[2] + ' ' + obj.start_date[1] + ', ' +
                    obj.start_date[4].substr(0,5) + ' - ' + obj.end_date[2] + ' ' + obj.end_date[1] + ', ' +
                    obj.end_date[4].substr(0,5) + '</li></ul><ul><li>' +
                    '<b>Guest list:</b> ' + obj.guest_list + '</li></ul></div></li>'
    $('#test-json').prepend(largeHtml);
    $('#upcomming-event-list span').html(Cookies.get('counter'));
  }
});

function validateEventDate() {
  var start_date = new Date(eventInput.find('#start-event-date').val());
  var end_date = new Date(eventInput.find('#end-event-date').val());

  if (end_date < start_date){
    alert('End date should be greater than start date');
    document.getElementById("end-event-date").value = "";
  }
}
