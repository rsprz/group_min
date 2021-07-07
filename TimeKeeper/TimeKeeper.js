var clickCount = 0;
// const button = document.querySelector("#restart-button");
//const timeKeeperDur = document.querySelector(".expand");

function countdown(){
const bars = document.querySelectorAll(".round-time-bar");
// button.addEventListener("click", () => {
    bars.forEach((bar) => {
    bar.classList.remove("round-time-bar");
    bar.offsetWidth;
    bar.classList.add("round-time-bar");
  });
}
//);
// });

function timeOverlapped(){
  //document.getElementById('timeWarning').style.setProperty("visibility","visible");
  document.getElementById('timeWarning').style.visibility = "visible";
  document.getElementById('seconds-counter').style.visibility = "visible";

}

function start(){

  var timeKeeperDuration = (parseInt(localStorage.getItem( 'GLOBALTotalDuration'))*60)+"s";
  //console.log("Amount for Timekeeper " + timeKeeperDuration);
  var splittedDurations = '';
  splittedDurations = JSON.parse(localStorage.getItem('TaskArr'));
  //console.log("Amount Duration 1: " + splittedDurations[1].Duration);


  getDurationTime();
  clickCount = 0;
  //Time in ms
  var timeSlot1 = (parseInt(splittedDurations[0].Duration)*60000);
  var timeSlot2 = (parseInt(splittedDurations[1].Duration)*60000);
  var timeSlot3 = (parseInt(splittedDurations[2].Duration)*60000);
  var timeSlot4 = (parseInt(splittedDurations[3].Duration)*60000);

  var timeSlot2Start = timeSlot1;
  var timeSlot3Start = timeSlot2Start+timeSlot2;
  var timeSlot4Start = timeSlot3Start+timeSlot3;


//Seconds Counter
  var seconds = 0;
  var displaySeconds=0;
  var el = document.getElementById('seconds-counter');
  function incrementSeconds() {
      seconds += 1;
      displaySeconds += 1;
      if(seconds==(timeSlot2Start/1000) || seconds==(timeSlot3Start/1000) || seconds==(timeSlot4Start/1000)){
        displaySeconds=0;
      }
      if(displaySeconds>=60 && displaySeconds<120){
        el.innerText = parseInt(displaySeconds/60).toFixed(0) + " minute over time";
      }
      else if(displaySeconds>=120){
        el.innerText = parseInt(displaySeconds/60).toFixed(0) + " minutes over time";
      }
      else
      {
        el.innerText = displaySeconds + " seconds over time";
      }

  }
  var cancel = setInterval(incrementSeconds, 1000);

//TO RESET remove and offsetWidth
//Full Bar:
  // document.querySelector('.timeKeeperBar').classList.remove('expand');
  // document.querySelector('.timeKeeperBar').offsetWidth;
  // document.querySelector('.timeKeeperBar').classList.add('expand');
  //console.log("Amount for Timekeeper " + timeKeeperDuration);
  //document.querySelector('.timeKeeperBar').style.setProperty("animation-duration",timeKeeperDuration);

  //document.querySelector('.timeKeeperBar').style.animationDuration = SavedTotalDuration;

  document.querySelector('.addtimecontainer').classList.add('advance');
  document.querySelector('.addtimecontainer').style.setProperty("animation-duration",timeKeeperDuration);

  var newTimeKeeperBarSplit1 = document.createElement("div");
  newTimeKeeperBarSplit1.className = "timeKeeperBarSplit1";
  document.getElementById('0_main').append(newTimeKeeperBarSplit1);

  var newTimeKeeperBarSplit2 = document.createElement("div");
  newTimeKeeperBarSplit2.className = "timeKeeperBarSplit2";
  document.getElementById('1_main').append(newTimeKeeperBarSplit2);

  var newTimeKeeperBarSplit3 = document.createElement("div");
  newTimeKeeperBarSplit3.className = "timeKeeperBarSplit2";
  document.getElementById('2_main').append(newTimeKeeperBarSplit3);

  var newTimeKeeperBarSplit4 = document.createElement("div");
  newTimeKeeperBarSplit4.className = "timeKeeperBarSplit2";
  document.getElementById('3_main').append(newTimeKeeperBarSplit4);

  document.querySelectorAll('.timeKeeperBarSplit1')[0].classList.add('expandSplit');
  document.querySelectorAll('.timeKeeperBarSplit1')[0].style.setProperty("animation-duration",(parseInt(splittedDurations[0].Duration)*60)+"s");

  document.querySelectorAll('.timeKeeperBarSplit2')[0].classList.add('expandSplit');
  document.querySelectorAll('.timeKeeperBarSplit2')[0].style.setProperty("animation-duration",(parseInt(splittedDurations[1].Duration)*60)+"s");
  document.querySelectorAll('.timeKeeperBarSplit2')[0].style.setProperty("animation-delay",(parseInt(splittedDurations[0].Duration)*60)+"s");

  document.querySelectorAll('.timeKeeperBarSplit2')[1].classList.add('expandSplit');
  document.querySelectorAll('.timeKeeperBarSplit2')[1].style.setProperty("animation-duration",(parseInt(splittedDurations[2].Duration)*60)+"s");
  document.querySelectorAll('.timeKeeperBarSplit2')[1].style.setProperty("animation-delay",((parseInt(splittedDurations[0].Duration) + parseInt(splittedDurations[1].Duration))*60)+"s");

  document.querySelectorAll('.timeKeeperBarSplit2')[2].classList.add('expandSplit');
  document.querySelectorAll('.timeKeeperBarSplit2')[2].style.setProperty("animation-duration",(parseInt(splittedDurations[3].Duration)*60)+"s");
  document.querySelectorAll('.timeKeeperBarSplit2')[2].style.setProperty("animation-delay",((parseInt(splittedDurations[0].Duration) + parseInt(splittedDurations[1].Duration)+parseInt(splittedDurations[2].Duration))*60)+"s");

  //Time Overlapped Warning
  setTimeout(timeOverlapped, timeSlot2Start);
  setTimeout(timeOverlapped, timeSlot3Start);
  setTimeout(timeOverlapped, timeSlot4Start);
  // if (seconds > (parseInt(splittedDurations[0].Duration)*60)){
  //   document.getElementById('timeWarning').style.setProperty("visibility","visible");
  // }




}

// document.getElementById ("restart-button").addEventListener ("click", start);

// var clickCount = 0;
function resetcolor(){
  //Change Number in [] depending on Position of Moving Buttons
  switch(clickCount){
    case 0:
      document.querySelectorAll('.timeKeeperBarSplit2')[0].style.setProperty("background","#545DFF");
      break;
    case 1:
      document.querySelectorAll('.timeKeeperBarSplit2')[1].style.setProperty("background","#545DFF");
      break;
    case 2:
      document.querySelectorAll('.timeKeeperBarSplit2')[2].style.setProperty("background","#545DFF");
      break;
  }
  clickCount++;
  document.getElementById('timeWarning').style.visibility = "hidden";
  document.getElementById('seconds-counter').style.visibility = "hidden";
}

function getDurationTime(){
  const today = new Date();
  let h = today.getHours();
  let m = today.getMinutes();
  //let s = today.getSeconds();
  m = checkTime(m);
  //s = checkTime(s);
  document.getElementById('currentTimeDisplay').innerHTML =  h + ":" + m;
  //setTimeout(startTime, 1000);
// }

  var TotalMeetingDuration;
  TotalMeetingDuration = parseInt(localStorage.getItem( 'GLOBALTotalDuration'));
  var endh = 0;
  var endm = 0;
  endh = parseInt(h) + parseInt(endh) + parseInt(TotalMeetingDuration/60);
  endm = parseInt(m)+ parseInt(endm) + parseInt(TotalMeetingDuration%60);
  if(endm>59){
    endh=parseInt(endh)+(parseInt(endm)/60);
    endm=parseInt(endm)%60;
  }
  endm = checkTime(endm);
  document.getElementById('endTimeDisplay').innerHTML =  endh.toFixed(0) + ":" + endm;

  function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
  }

}


// var i = 0;
// function move() {
//   if (i == 0) {
//     i = 1;
//     var elem = document.getElementById("myBar");
//     var width = 1;
//     var id = setInterval(frame, 10);
//     function frame() {
//       if (width >= 100) {
//         clearInterval(id);
//         i = 0;
//       } else {
//         width++;
//         elem.style.width = width + "%";
//       }
//     }
//   }
// }
