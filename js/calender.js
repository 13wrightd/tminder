var socket = io();

Url = {
    get get(){
        var vars= {};
        if(window.location.search.length!==0)
            window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value){
                key=decodeURIComponent(key);
                if(typeof vars[key]==="undefined") {vars[key]= decodeURIComponent(value);}
                else {vars[key]= [].concat(vars[key], decodeURIComponent(value));}
            });
        return vars;
    }
};

$(document).ready(function(){ 
  $("#add").click(function(){
      console.log(reminders);
  })
});

var reminders;
//var Array record;
$(document).ready(function(){ //angular
  socket.on('reminders', function(msg){//4
    reminders=msg;


    console.log(msg);
    //msg[0] = msg.splice(1, 1, msg[0])[0];
    msg.splice(0,2,msg[1],msg[0]);
    console.log(msg);
    console.log(msg[1].dateOfReminder);

    msg.sort(function(a,b) {
      return ((new Date a.dateofReminder > new Date b.dateOfReminder) ? 1 : ((new Date b.dateOfReminder > new Date a.dateOfReminder) ? -1 : 0))} );
    //msg.dateOfReminder.sort(function(a,b){return a-b});
    //console.log(msg);

    //record = msg;
    //$('#chat').append('<li>'+msg.first+ " " + msg.last+ ": " +msg.message+'</li>');
  });

  
  socket.emit('get reminders', Url.get.phonenumber);

});
console.log(reminders);

// these are labels for the days of the week
cal_days_labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// these are human-readable month name labels, in order
cal_months_labels = ['January', 'February', 'March', 'April',
                     'May', 'June', 'July', 'August', 'September',
                     'October', 'November', 'December'];

// these are the days of the week for each month, in order
cal_days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// this is the current date
cal_current_date = new Date(); 

function Calendar(month, year) {
  this.month = (isNaN(month) || month == null) ? cal_current_date.getMonth() : month;
  this.year  = (isNaN(year) || year == null) ? cal_current_date.getFullYear() : year;
  this.html = '';
}

Calendar.prototype.generateHTML = function(){

  // get first day of month
  var firstDay = new Date(this.year, this.month, 1);
  var startingDay = firstDay.getDay();
  
  // find number of days in month
  var monthLength = cal_days_in_month[this.month];
  
  // compensate for leap year
  if (this.month == 1) { // February only!
    if((this.year % 4 == 0 && this.year % 100 != 0) || this.year % 400 == 0){
      monthLength = 29;
    }
  }
  
  // do the header
  var monthName = cal_months_labels[this.month]
  var html = '<table class="calendar-table">';
  html += '<tr><th colspan="7">';
  html +=  monthName + "&nbsp;" + this.year;
  html += '</th></tr>';
  html += '<tr class="calendar-header">';
  for(var i = 0; i <= 6; i++ ){

    html += '<td class="calendar-header-day">';
    html += cal_days_labels[i];
    html += '</td>';
  }
  html += '</tr><tr>';

  // fill in the days
  var log = document.getElementById('reminder');
  var day = 1;
  // this loop is for is weeks (rows)
  for (var i = 0; i < 9; i++) {
    // this loop is for weekdays (cells)
    for (var j = 0; j <= 6; j++) { 
      html += '<td class="calendar-day">';
      if (day <= monthLength && (i > 0 || j >= startingDay)) {
        if(day<10){
          //<button class="w3-button w3-black" onclick="console.log('work')">
          html += ('<button class="w3-button w3-black" onclick="console.log('+"'work'"+')">&nbsp'+day+'&nbsp</button>');
          day++;
        }
        else{
          html += ('<button class="w3-button w3-black"">'+day+'</button>');
          day++;

        }
      }
      html += '</td>';
    }
    // stop making rows if we've run out of days
    if (day > monthLength) {
      break;
    } else {
      html += '</tr><tr>';
    }
  }
  html += '</tr></table>';

  this.html = html;
}

Calendar.prototype.getHTML = function() {
  return this.html;
}

