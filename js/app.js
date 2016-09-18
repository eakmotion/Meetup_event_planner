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
var today = new Date();

function signIn(name) {
  var userNav = $('.user-nav');
  userNav.removeClass('hidden');
  userNav.find('.username').text(name);
}

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
    $('#events-json').prepend(largeHtml);
    $('#upcomming-event-list span').html(Cookies.get('counter'));
  }

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

function checkInput(input) {
	if ( input.IssueTracker ) {
		input.IssueTracker.checkValidity(input);
		input.CustomValidation.displayInvalidities(input);
		if ( input.CustomValidation.invalidities.length == 0 && input.value != '' ) {
			input.setCustomValidity('');
		} else {
			var message = input.CustomValidation.getInvalidities();
			input.setCustomValidity(message);
		}
	}
}

var inputs = document.querySelectorAll('input');
var submit = document.querySelector('button[type="submit"]');
if (inputs) {
	for (var i = 0; i < inputs.length; i++) {
		var input = inputs[i];
		input.addEventListener('change', function() {
			checkInput(this);
		});
		input.addEventListener('keyup', function() {
			checkInput(this);
		});
	}
}

function CustomValidation() {
	this.invalidities = [];
	this.validityChecks = [];
	this.displayInvaliditiesOnBlur = true;
}
CustomValidation.prototype = {
	addInvalidity: function(message) {
		this.invalidities.push(message);
	},
	getInvalidities: function() {
		return this.invalidities.join('. \n');
	},
	displayInvalidities: function(input) {
		this.checkValidity(input);
		if ( this.displayInvaliditiesOnBlur ) {
			if ( this.invalidities.length > 0 ) {
				input.classList.add('invalid');
			} else {
				input.classList.remove('invalid');
			}
			var invaliditiesArray = [];
			for ( var i = 0; i < this.invalidities.length; i++ ) {
				invaliditiesArray.push('<li>'+this.invalidities[i]+'</li>');
			}
			invaliditiesArray = invaliditiesArray.join();
			var inputID = input.getAttribute('id');
			var inputRequirements = document.querySelector('#'+inputID+' + ul');
			inputRequirements.innerHTML = invaliditiesArray;
		} else {

			if ( this.invalidities.length > 0 ) {
				input.classList.add('invalid');
			} else {
				input.classList.remove('invalid');
			}
		}
	},
	checkValidity: function(input) {
		this.invalidities = [];
		for ( var i = 0; i < this.validityChecks.length; i++ ) {
			var isInvalid = this.validityChecks[i].isInvalid(input);
			if (isInvalid) {
				this.addInvalidity(this.validityChecks[i].invalidityMessage);
			}
			var requirementElement = this.validityChecks[i].element;
			if (requirementElement) {
				if (!isInvalid) {
					requirementElement.classList.add('valid');
				} else {
					requirementElement.classList.remove('valid');
				}
			}
		}
	}
};

function checkInput(input) {
	if ( input.CustomValidation ) {
		input.CustomValidation.checkValidity(input);
		input.CustomValidation.displayInvalidities(input);
		if ( input.CustomValidation.invalidities.length == 0 && input.value != '' ) {
			input.setCustomValidity('');
		} else {
			var message = input.CustomValidation.getInvalidities();
			input.setCustomValidity(message);
		}
	}
}

if (emailInput) {
	emailInput.CustomValidation = new CustomValidation();
	emailInput.CustomValidation.validityChecks = [
		{
			isInvalid: function(input) {
        var emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				return !emailInput.value.match(emailPattern);
			},
			invalidityMessage: 'Invalid email address'
		}
	];
}

if (firstPasswordInput) {
	firstPasswordInput.CustomValidation = new CustomValidation();
	firstPasswordInput.CustomValidation.displayInvaliditiesOnBlur = false;
	firstPasswordInput.CustomValidation.validityChecks = [
		{
			isInvalid: function(input) {
				return input.value.length < 8 || input.value.length > 100;
			},
			invalidityMessage: 'Should be longer than 8 words and less than 100 words',
			element: document.querySelector('#first-password + ul li.length')
		},
    {
			isInvalid: function(input) {
				return !input.value.match(/[\!\@\#\$\%\^\&\*]/g);
			},
			invalidityMessage: 'Missing a symbol',
			element: document.querySelector('#first-password + ul li.special')
		},
		{
			isInvalid: function(input) {
				return !input.value.match(/[0-9]/g);
			},
			invalidityMessage: 'Missing a number',
			element: document.querySelector('#first-password + ul li.number')
		},
		{
			isInvalid: function(input) {
				return !input.value.match(/[a-z]/g);
			},
			invalidityMessage: 'Missing a lowercase letter',
			element: document.querySelector('#first-password + ul li.lowercase')
		},
		{
			isInvalid: function(input) {
				return !input.value.match(/[A-Z]/g);
			},
			invalidityMessage: 'Missing an uppercase letter',
			element: document.querySelector('#first-password + ul li.uppercase')
		}
	];
}

if (secondPasswordInput) {
	secondPasswordInput.CustomValidation = new CustomValidation();
	secondPasswordInput.CustomValidation.validityChecks = [
		{
			isInvalid: function() {
				return (secondPasswordInput.value != firstPasswordInput.value) && secondPasswordInput.value.value != '';
			},
			invalidityMessage: 'Password must be match'
		}
	];
}

var userName = document.getElementById('name');
if (userName) {
	userName.CustomValidation = new CustomValidation();
	userName.CustomValidation.validityChecks = [
		{
			isInvalid: function(input) {
				return input.value.length < 3;
			},
			invalidityMessage: 'Needs to be at least 3 characters'
		}
	];
}

var userCompany = document.getElementById('user-company');
if (userCompany) {
	userCompany.CustomValidation = new CustomValidation();
	userCompany.CustomValidation.validityChecks = [
		{
			isInvalid: function(input) {
				return input.value.length < 3;
			},
			invalidityMessage: 'Needs to be at least 3 characters'
		}
	];
}

var userJob = document.getElementById('user-job');
if (userJob) {
	userJob.CustomValidation = new CustomValidation();
	userJob.CustomValidation.validityChecks = [
		{
			isInvalid: function(input) {
				return input.value.length < 3;
			},
			invalidityMessage: 'Needs to be at least 3 characters'
		}
	];
}

var userCountry = document.getElementById('user-country');
if (userCountry) {
	userCountry.CustomValidation = new CustomValidation();
	userCountry.CustomValidation.validityChecks = [
		{
			isInvalid: function(input) {
				return input.value.length < 3;
			},
			invalidityMessage: 'Needs to be at least 3 characters'
		}
	];
}

var eventName = document.getElementById('event-name');
if (eventName) {
	eventName.CustomValidation = new CustomValidation();
	eventName.CustomValidation.validityChecks = [
		{
			isInvalid: function(input) {
				return input.value.length < 3;
			},
			invalidityMessage: 'Needs to be at least 3 characters'
		}
	];
}

var eventHost = document.getElementById('event-host');
if (eventHost) {
	eventHost.CustomValidation = new CustomValidation();
	eventHost.CustomValidation.validityChecks = [
		{
			isInvalid: function(input) {
				return input.value.length < 3;
			},
			invalidityMessage: 'Needs to be at least 3 characters'
		}
	];
}

var eventGuest = document.getElementById('event-guest');
if (eventGuest) {
	eventGuest.CustomValidation = new CustomValidation();
	eventGuest.CustomValidation.validityChecks = [
		{
			isInvalid: function(input) {
				return input.value.length < 3;
			},
			invalidityMessage: 'Needs to be at least 3 characters'
		}
	];
}

var eventLocation = document.getElementById('event-location');
if (eventLocation) {
	eventLocation.CustomValidation = new CustomValidation();
	eventLocation.CustomValidation.validityChecks = [
		{
			isInvalid: function(input) {
				return input.value.length < 3;
			},
			invalidityMessage: 'Needs to be at least 3 characters'
		}
	];
}

if (startDateInput) {
	startDateInput.CustomValidation = new CustomValidation();
	startDateInput.CustomValidation.validityChecks = [
		{
			isInvalid: function(input) {
        var startDate = new Date(input.value)
				return startDate < today;
			},
			invalidityMessage: 'The start date need to be from now'
		}
	];
}

if (endDateInput) {
	endDateInput.CustomValidation = new CustomValidation();
	endDateInput.CustomValidation.validityChecks = [
		{
			isInvalid: function(input) {
        var endDate = new Date(input.value)
        var startDateValue = new Date(startDateInput.value)
        startDateValue.setMinutes(startDateValue.getMinutes() + 10)
				return endDate < startDateValue;
			},
			invalidityMessage: 'The end date need to be after start date'
		}
	];
}
