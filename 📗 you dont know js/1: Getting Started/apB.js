/****
Practicing Comparisons

const dayStart = "07:30";
const dayEnd = "17:45";

function scheduleMeeting(startTime,durationMinutes) {
    // ..TODO..
}

scheduleMeeting("7:00",15);     // false
scheduleMeeting("07:15",30);    // false
scheduleMeeting("7:30",30);     // true
scheduleMeeting("11:30",60);    // true
scheduleMeeting("17:00",45);    // true
scheduleMeeting("17:30",30);    // false
scheduleMeeting("18:00",15);    // false
****/

const dayStart = "07:30";
const dayEnd = "17:45";


function scheduleMeeting(startTime,durationMinutes) {
  let [startHour, startMinute] = dayStart.split(':')
  let [endHour, endMinute] = dayStart.split(':')
  let [hour, minute] = startTime.split(':')
  [startHour, startMinute] = [Number(startHour), Number(startMinute)]
  [endHour, endMinute] = [Number(endHour), Number(endMinute)]
  // check the startTime is in the range
      console.log(`${Number(hour)} ${endHour} ${startHour} ${hour}`)

  if(Number(hour) > endHour || startHour > Number(hour)){
        console.log(startTime)

    return false
  }
  else if (hour == endHour && minute > endMinute){
    return false
  }
  else if (hour == startHour && minute < startMinute){
    return false
  }
  return true
}


scheduleMeeting("7:00",15);     // false
scheduleMeeting("07:15",30);    // false
scheduleMeeting("7:30",30);     // true
scheduleMeeting("11:30",60);    // true
scheduleMeeting("17:00",45);    // true
scheduleMeeting("17:30",30);    // false
scheduleMeeting("18:00",15);    // false

/****
Practicing Closure

range(3,3);    // [3]
range(3,8);    // [3,4,5,6,7,8]
range(3,0);    // []

var start3 = range(3);
var start4 = range(4);

start3(3);     // [3]
start3(8);     // [3,4,5,6,7,8]
start3(0);     // []

start4(6);     // [4,5,6]
****/

function range(start, end) {
  function getRange(start, end){
    var ret = [];
    for (let i = start; i <= end; i++) {
        ret.push(i);
    }
    return ret;
  }
  if(end === undefined){
    return function range(end) {
      return getRange(start, end)
    }
  }
  return getRange(start, end)
}


/****
Practicing Prototypes

function randMax(max) {
    return Math.trunc(1E9 * Math.random()) % max;
}

var reel = {
    symbols: [
        "♠", "♥", "♦", "♣", "☺", "★", "☾", "☀"
    ],
    spin() {
        if (this.position == null) {
            this.position = randMax(
                this.symbols.length - 1
            );
        }
        this.position = (
            this.position + 100 + randMax(100)
        ) % this.symbols.length;
    },
    display() {
        if (this.position == null) {
            this.position = randMax(
                this.symbols.length - 1
            );
        }
        return this.symbols[this.position];
    }
};

var slotMachine = {
    reels: [
        // this slot machine needs 3 separate reels
        // hint: Object.create(..)
    ],
    spin() {
        this.reels.forEach(function spinReel(reel){
            reel.spin();
        });
    },
    display() {
        // TODO
    }
};

slotMachine.spin();
slotMachine.display();
// ☾ | ☀ | ★
// ☀ | ♠ | ☾
// ♠ | ♥ | ☀

slotMachine.spin();
slotMachine.display();
// ♦ | ♠ | ♣
// ♣ | ♥ | ☺
// ☺ | ♦ | ★
****/