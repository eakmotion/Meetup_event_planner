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
var startDateInput = document.querySelector('#start-event-date');
var endDateInput = document.querySelector('#end-event-date');

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
        message = this.issues[0];
        break;
      default:
        message = this.issues.join("\n");
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
  var inputRequirements = $('#registration #first-password + ul.input-requirements');

  if(firstPassword.length < 8 || firstPassword.length > 100) {
    firstInputIssuesTracker.add("should be longer than 8 words and less than 100 words");
    inputRequirements.find('li.length').addClass('invalid');
  } else {
    inputRequirements.find('li.length').addClass('valid');
    inputRequirements.find('li.length').removeClass('invalid');
  }

  if (!firstPassword.match(/[\!\@\#\$\%\^\&\*]/g)) {
    firstInputIssuesTracker.add("missing a symbol");
    inputRequirements.find('li.special').addClass('invalid');
  } else {
    inputRequirements.find('li.special').removeClass('invalid');
    inputRequirements.find('li.special').addClass('valid');
  }

  if (!firstPassword.match(/[0-9]/g)) {
    firstInputIssuesTracker.add("missing a number");
    inputRequirements.find('li.number').addClass('invalid');
  } else {
    inputRequirements.find('li.number').removeClass('invalid');
    inputRequirements.find('li.number').addClass('valid');
  }

  if (!firstPassword.match(/[a-z]/g)) {
    firstInputIssuesTracker.add("missing a lowercase letter");
    inputRequirements.find('li.lowercase').addClass('invalid');
  } else {
    inputRequirements.find('li.lowercase').removeClass('invalid');
    inputRequirements.find('li.lowercase').addClass('valid');
  }

  if (!firstPassword.match(/[A-Z]/g)) {
    firstInputIssuesTracker.add("missing an uppercase letter");
    inputRequirements.find('li.uppercase').addClass('invalid');
  } else {
    inputRequirements.find('li.uppercase').removeClass('invalid');
    inputRequirements.find('li.uppercase').addClass('valid');
  }

  var illegalChars = firstPassword.match(/[^A-z0-9\!\@\#\$\%\^\&\*]/g);
  if (illegalChars) {
    illegalChars.forEach(function (illegalChar) {
      firstInputIssuesTracker.add("includes illegal characters: " + illegalChar);
    });
  }

  if (firstPassword !== secondPassword) {
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

$('#first-password').on('input', function() {
  passwordValidation();
});

$('#second-password').on('input', function() {
  passwordValidation();
});

$('#email').on('input', function() {
  emailValidation();
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

  var today = new Date();
  startDateInput.min = today.toJSON().substr(0,16);
});

startDateInput.addEventListener('change', function() {
  if (startDateInput.value)
    var startDateValue = new Date(startDateInput.value)
    startDateValue.setMinutes(startDateValue.getMinutes() + 10)
    endDateInput.min = startDateValue.toJSON().substr(0,16);
}, false);

var forms = document.getElementsByTagName('form');
for (var i = 0; i < forms.length; i++) {
    forms[i].addEventListener('invalid', function(e) {
      e.preventDefault();
      $('pre.invalid', e.target.parentElement).remove();
      e.target.parentElement.insertAdjacentHTML("beforeend", "<pre class='invalid'>" + e.target.validationMessage + "</pre>");
    }, true);
}

var inputs = document.querySelectorAll('input:not([type="submit"])');
for (var i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener('input', function(e) {
      e.target.classList.add('dirty');
    });
}
