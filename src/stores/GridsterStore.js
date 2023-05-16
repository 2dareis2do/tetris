// Gridster store
// Requiring the Dispatcher, Constants, and
// event emitter dependencies
import AppDispatcher from '../dispatcher/AppDispatcher';
import { GridsterConstants } from '../constants/GridsterConstants.js';
import { EventEmitter } from 'events';
import { StartGrid } from './StartGrid';
import { OrganTables } from './OrganTables';
import { DFT } from 'dsp.js';

// import '../webkitAudioContextMonkeyPatch';
import { AudioContext } from 'standardized-audio-context';
// var dft = new DFT(1024, 44100);
// console.log(dft);

// console.log(window.AudioContext);
// import MIDISounds from 'midi-sounds-react';


// console.log(MIDISounds);
// const test = new MIDISounds;

// EventEmitter.prototype._maxListeners = 400;

const CHANGE_EVENT = 'change';

// Define the store as an empty array
let _store = {
  columns: 10,
  rows: 20,
  grid: StartGrid,
  shapes: [{
      name: 'pipe',
      shape: [1, 1, 1, 1],
      width: 4,
      height: 1,
      transformations: {
        ninety: [-9, 0, 9, 18],
        oneeighty: [11, 0, -11, -22],
        twoseventy: [-18, -9, 0, 9],
        threesixty: [22, 11, 0, -11]
      },
      transformationsa: {
        ninety: [-9, 0, 9, 18],
        oneeighty: [11, 0, -11, -22],
        twoseventy: [-18, -9, 0, 9],
        threesixty: [22, 11, 0, -11]
      },
      transformations2: {
        ninety: [
          [-1, 1],
          [0, 0],
          [1, -1],
          [2, -2]
        ],
        oneeighty: [
          [1, 1],
          [0, 0],
          [-1, -1],
          [-2, -2]
        ],
        twoseventy: [
          [-2, 2],
          [-1, -1],
          [0, 1],
          [1, -1]
        ],
        threesixty: [
          [2, 2],
          [1, 1],
          [0, 1],
          [-1, -1]
        ]
      }
    },
    {
      name: 'J',
      shape: [1, 1, 1, 0, 0, 1],
      width: 3,
      height: 2,
      transformations: {
        ninety: [-9, 0, 9, -2],
        oneeighty: [11, 0, -20, -11],
        twoseventy: [2, -9, 0, 9],
        threesixty: [11, 20, 0, -11]
      },
      transformationsa: {
        ninety: [20, 11, 0, -11],
        oneeighty: [9, -2, 0, -9],
        twoseventy: [11, 0, -11, -20],
        threesixty: [9, 0, 2, -9]
      },
    },
    {
      name: 'L',
      shape: [1, 1, 1, 1, 0, 0],
      width: 3,
      height: 2,
      transformations: {
        ninety: [-9, 0, 9, -20],
        oneeighty: [2, 11, 0, -11],
        twoseventy: [20, -9, 0, 9],
        threesixty: [11, 0, -11, -2]
      },
      transformationsa: {
        ninety: [-2, 11, 0, -11],
        oneeighty: [9, 0, -9, -20],
        twoseventy: [11, 0, -11, 2],
        threesixty: [20, 9, 0, -9]
      },
    },
    {
      name: 'T',
      shape: [1, 1, 1, 0, 1, 0],
      width: 3,
      height: 2,
      transformations: {
        ninety: [-9, 0, 9, -11],
        oneeighty: [11, -9, 0, -11],
        twoseventy: [11, -9, 0, 9],
        threesixty: [11, 0, 9, -11]
      },
      transformationsa: {
        ninety: [9, 11, 0, -11],
        oneeighty: [9, 0, -11, -9],
        twoseventy: [11, 0, -11, -9],
        threesixty: [9, 11, 0, -9]
      },
      transformations2: {
        ninety: [
          [-1, 1],
          [0, 0],
          [1, -1],
          [2, -2]
        ],
        oneeighty: [
          [1, 1],
          [0, 0],
          [-1, -1],
          [-2, -2]
        ],
        twoseventy: [
          [-2, 2],
          [-1, -1],
          [0, 1],
          [1, -1]
        ],
        threesixty: [
          [2, 2],
          [1, 1],
          [0, 1],
          [-1, -1]
        ]
      }
    },
    {
      name: 'square',
      shape: [1, 1, 1, 1],
      width: 2,
      height: 2,
      transformations: {
        ninety: [0, 0, 0, 0],
        oneeighty: [0, 0, 0, 0],
        twoseventy: [0, 0, 0, 0],
        threesixty: [0, 0, 0, 0]
      },
      transformationsa: {
        ninety: [0, 0, 0, 0],
        oneeighty: [0, 0, 0, 0],
        twoseventy: [0, 0, 0, 0],
        threesixty: [0, 0, 0, 0]
      },
      transformations2: {
        ninety: [
          [-1, 1],
          [0, 0],
          [1, -1],
          [2, -2]
        ],
        oneeighty: [
          [1, 1],
          [0, 0],
          [-1, -1],
          [-2, -2]
        ],
        twoseventy: [
          [-2, 2],
          [-1, -1],
          [0, 1],
          [1, -1]
        ],
        threesixty: [
          [2, 2],
          [1, 1],
          [0, 1],
          [-1, -1]
        ]
      }
    }
  ],
  currentItem: [],
  timer: 0,
  state: 0,
  angle: 0,
  shape: null,
  score: 0,
  interval: 1000,
  highScore: 0,
  audioUnlocked: false,
};

// Define the public event listeners and getters that
// the views will use to listen for changes and retrieve
// the store
class GridsterStoreClass extends EventEmitter {

  addChangeListener(cb) {
    this.on(CHANGE_EVENT, cb);
  }

  removeChangeListener(cb) {
    this.removeListener(CHANGE_EVENT, cb);
  }

  getGrid() {
    return _store;
  }

}

// Initialize the singleton to register with the
// dispatcher and export for React components
const GridsterStore = new GridsterStoreClass();

// var isUnlocked = false;
// var buffer;
// var source;

const audioCtx = new AudioContext();
// const gainNode = audioCtx.createGain();

// Source: https://chromium.googlecode.com/svn/trunk/samples/audio/wave-tables/Organ_2
var tables = OrganTables;

const c = tables.real.length;
var real = new Float32Array(c);
var imag = new Float32Array(c);
for (let i = 0; i < c; i++) {
  real[i] = tables.real[i];
  imag[i] = tables.imag[i];
}

// sharkfin shape
function sharkFin(x) {
  if (x < 0) return 0;
  x = x * 2 % 2 + 0.05;
  if (x < 1) {
    return 1 + Math.log(x) / 4;
  }
  return Math.pow(-x, -2);
}

var count = 128;
var sharkFinValues = new Array(count);
for (let i = 0; i < count; i++) {
  sharkFinValues[i] = sharkFin(i / count);
}
// console.log(sharkFinValues);

// DFT
var ft = new DFT(sharkFinValues.length);
ft.forward(sharkFinValues);
var lfoTable = audioCtx.createPeriodicWave(ft.real, ft.imag);
// var lfoGain = audioCtx.createGain();
// var hornTable = audioCtx.createPeriodicWave(real, imag);

// create Oscillator and gain node
const oscillator = audioCtx.createOscillator();
var enabled = false;
// const real = new Float32Array([0, 0.4, 0.4, 1, 1, 1, 0.3, 0.7, 0.6, 0.5, 0.9, 0.8]);
// const imag = new Float32Array(real.length);
// console.log(real, real.length, imag);
// const hornTable = audioCtx.createPeriodicWave(real, imag);
// console.log(hornTable);

var lfo = audioCtx.createOscillator();
var lfoGain = audioCtx.createGain();

function play() {

  if (audioCtx.state === 'suspended' && enabled) {
    audioCtx.resume();

  } else if (audioCtx.state === 'suspended') {

    oscillator.frequency.value = 1200;

    lfo.setPeriodicWave(lfoTable);
    lfo.frequency.value = 1 / 0.380;

    //lfogain
    lfoGain.gain.value = 450;

    lfo.connect(lfoGain);
    lfoGain.connect(oscillator.frequency)
    oscillator.connect(audioCtx.destination);

    // oscillator.connect(audioCtx.destination);
    oscillator.start(0);
    lfo.start(0);

    // run once
    enabled = true;
  } else {
    console.log('else', audioCtx.state);

  }
  // let audioCtx = new AudioContext();


  // create Oscillator and gain node
  // let oscillator = audioCtx.createOscillator();
  // let oscillatorNode = new OscillatorNode(audioCtx);
  // let gainNode = audioCtx.createGain();
  // console.log(audioCtx.currentTime);

  // oscillator.connect(gainNode);
  // oscillator.connect(audioCtx.destination);

  // oscillator.type = 'sine';
  // oscillator.frequency.value = 440;
  // oscillator.start();

  // gainNode.gain.value = 0.1;


  audioCtx.onstatechange = function() {
    console.log(audioCtx.state);
  }

  setTimeout(function() {
    audioCtx.suspend();
  }, 1000);
}


// function stop() {
//   osc = window.audioContext.createOscillator();

//   osc.disconnect();
// }

function xcoord(number) {
  return (1 + ((number % _store.columns)));
}

function ycoord(number) {
  return (1 + parseInt(number / _store.columns, 10));
}

/*
 * accepts a an array of @items representing the grid or stage and paints an @item (1 or 0) using the index i
 */
function paintItem(items, i, item) {
  items.splice(i, 1, item);
  return items;
}

// function playTestInstrument() {
//   // playChordNow(instrument, pitches, duration)
//   // this.midiSounds.playChordNow(608, [60], 2.5);
//   //looads array of drums
//   // mSounds.playDrumsNow([0]);
// }

/*
 * accepts a an item from and array of @items representing the grid or stage and paints an @item (0) using the index i
 */
// const removeItem = (items, i) =>
//   items.slice(0, i - 1).concat(items.slice(i, items.length));
/*
 * returns if valus is not in
 */
function checkOutsideColumn(currentValue) {
  if (currentValue % _store.columns !== 0 && (currentValue + 1) % _store.columns !== 0) {
    return currentValue;
  }
}

/*
 * returns the value in not on the inset column i.e. the second and second last columns
 */
function checkColumnInset(currentValue) {
  if ((currentValue - 1) % _store.columns !== 0 && (currentValue + 2) % _store.columns !== 0) {
    return currentValue;
  }
}

/*
 * moves the current item clockwise
 */
function turnClockwise() {
  let shape = _store.shape;
  let angle = _store.angle;
  // lets restrict movement if certain conditions
  // sort curent shape low to high - transform matrix is always calculated form ther first item to the last
  let currentShape = _store.currentItem.sort(function(a, b) { return a - b });
  // console.log(currentShape);
  let tempCurrent = currentShape.map(checkColumnInset);
  // lets remove items that return undefined
  tempCurrent = tempCurrent.filter(function(element) {
    return element !== undefined;
  });
  // if not a pipe in column 1 return
  if (tempCurrent.length <= 0) {
    return;
  }
  // We also check if the shape has 3 elements in the first column
  // if current shape has 3 or more items that are in column 0 return
  tempCurrent = currentShape.map(checkOutsideColumn);
  // remeber all shapes have 4 items
  tempCurrent = tempCurrent.filter(function(element) {
    return element !== undefined;
  });
  if (tempCurrent.length <= 1) {
    return;
  }

  switch (angle) {
    case 0:
      // let transformArray = _store.shapes[shape].transformations.ninety;
      // console.log("transformArray", transformArray);
      // takes the current transform array and adds it to the current array
      let sum = currentShape.map(transformCurrentShapeNinety, {
        shape: shape
      });
      sum = sum.filter(function(element) {
        return element !== undefined;
      });
      _store.angle = 90;
      // need to check if 'new' summed array
      // 2. is on the stage
      // 1. does not match a value that already exists
      // note if exists in current array transform value should be fine
      if (sum.length === 4) {
        moveCurrent(sum);
      }
      break;
    case 90:
      // transformArray = _store.shapes[shape].transformations.oneeighty;
      // console.log("transformArray", transformArray);

      // takes the current transform array and adds it to the current array
      sum = currentShape.map(transformCurrentShapeOneEighty, {
        shape: shape
      });
      // console.log(sum);
      sum = sum.filter(function(element) {
        return element !== undefined;
      });
      _store.angle = 180;
      // need to check if 'new' summed array
      // 2. is on the stage
      // 1. does not match a value that already exists
      // note if exists in current array transform value should be fine
      if (sum.length === 4) {
        moveCurrent(sum);
      }
      break;
    case 180:
      // transformArray = _store.shapes[shape].transformations.twoseventy;
      // takes the current transform array and adds it to the current array
      sum = currentShape.map(transformCurrentShapeTwoSeventy, {
        shape: shape
      });
      // console.log(sum);
      sum = sum.filter(function(element) {
        return element !== undefined;
      });
      _store.angle = 270;
      // need to check if 'new' summed array
      // 2. is on the stage
      // 1. does not match a value that already exists
      // note if exists in current array transform value should be fine
      if (sum.length === 4) {
        moveCurrent(sum);
      }
      break;
    case 270:
      // transformArray = _store.shapes[shape].transformations.threesixty;
      // takes the current transform array and adds it to the current array
      sum = currentShape.map(transformCurrentShapeThreeSixty, {
        shape: shape
      });
      // console.log(sum);
      sum = sum.filter(function(element) {
        return element !== undefined;
      });
      _store.angle = 0;
      // need to check if 'new' summed array
      // 2. is on the stage
      // 1. does not match a value that already exists
      // note if exists in current array transform value should be fine
      if (sum.length === 4) {
        moveCurrent(sum);
      }

      break;
    default:
      _store.angle = 0;

  }
}

/*
 * moves the current item clockwise
 */
function turnAnticlockwise() {
  let shape = _store.shape;
  let angle = _store.angle;
  // lets restrict movement if certain conditions
  // sort curent shape low to high - transform matrix is always calculated form ther first item to the last
  let currentShape = _store.currentItem.sort(function (a, b) { return a - b });
  //  console.log(currentShape);
  let tempCurrent = currentShape.map(checkColumnInset);
  // lets remove items that return undefined
  tempCurrent = tempCurrent.filter(function (element) {
    return element !== undefined;
  });
  // if not a pipe in column 1 return
  if (tempCurrent.length <= 0) {
    return;
  }
  // We also check if the shape has 3 elements in the first column
  // if current shape has 3 or more items that are in column 0 return
  tempCurrent = currentShape.map(checkOutsideColumn);
  // remember all shapes have 4 items
  tempCurrent = tempCurrent.filter(function (element) {
    return element !== undefined;
  });
  if (tempCurrent.length <= 1) {
    return;
  }
  // console.log(angle);
  switch (angle) {
    case 0:
      // let transformArray = _store.shapes[shape].transformations.ninety;
      // takes the current transform array and adds it to the current array
      // opposite for anti
      let sum = currentShape.map(transformCurrentShapeTwoSeventyAnti, {
        shape: shape
      });
      sum = sum.filter(function (element) {
        return element !== undefined;
      });
      _store.angle = 270;
      // need to check if 'new' summed array
      // 2. is on the stage
      // 1. does not match a value that already exists
      // note if exists in current array transform value should be fine
      if (sum.length === 4) {
        moveCurrent(sum);
      }
      break;
    case 90:
      // transformArray = _store.shapes[shape].transformations.oneeighty;
      // takes the current transform array and adds it to the current array
      sum = currentShape.map(transformCurrentShapeThreeSixtyAnti, {
        shape: shape
      });
      // console.log(sum);
      sum = sum.filter(function (element) {
        return element !== undefined;
      });
      _store.angle = 0;
      // need to check if 'new' summed array
      // 2. is on the stage
      // 1. does not match a value that already exists
      // note if exists in current array transform value should be fine
      if (sum.length === 4) {
        moveCurrent(sum);
      }
      break;
    case 180:
      // transformArray = _store.shapes[shape].transformations.twoseventy;
      // takes the current transform array and adds it to the current array
      sum = currentShape.map(transformCurrentShapeNinetyAnti, {
        shape: shape
      });
      // console.log(sum);
      sum = sum.filter(function (element) {
        return element !== undefined;
      });
      _store.angle = 90;
      // need to check if 'new' summed array
      // 2. is on the stage
      // 1. does not match a value that already exists
      // note if exists in current array transform value should be fine
      if (sum.length === 4) {
        moveCurrent(sum);
      }
      break;
    case 270:
      // transformArray = _store.shapes[shape].transformations.threesixty;
      // takes the current transform array and adds it to the current array
      sum = currentShape.map(transformCurrentShapeOneEightyAnti, {
        shape: shape
      });
      // console.log(sum);
      sum = sum.filter(function (element) {
        return element !== undefined;
      });
      _store.angle = 180;
      // need to check if 'new' summed array
      // 2. is on the stage
      // 1. does not match a value that already exists
      // note if exists in current array transform value should be fine
      if (sum.length === 4) {
        moveCurrent(sum);
      }

      break;
    default:
      _store.angle = 0;

  }
}

/*
 * Accepts an number and transforms this based on its shape and position
 * also accept @param shape
 */
function transformCurrentShapeNinety(num, i, array) {
  // console.log(array);
  // console.log("direction", direction)
  let shape = this.shape;
  // let currentShape = array;
  let transformArray = _store.shapes[shape].transformations.ninety;
  // here we can check if transformed array is valid?
  let newNumber = num + transformArray[i];
  // if new number is the same as an existiong current item  return new number is
  if (_store.currentItem.includes(newNumber)) {
    return newNumber;
  } else if (_store.grid[newNumber] === 1) {
    // console.log('not', newNumber);
    return;
  } else if (newNumber > (_store.columns * _store.rows)) {
    // console.log('not > max', newNumber);
    return;
  } else {
    return newNumber;
  }
}

/*
 * Accepts an number and transforms this based on its shape and position
 * also accept @param shape
 */
function transformCurrentShapeNinetyAnti(num, i, array) {
  // console.log(array);
  // console.log("direction", direction)
  let shape = this.shape;
  // let currentShape = array;
  let transformArray = _store.shapes[shape].transformationsa.ninety;
  // here we can check if transformed array is valid?
  let newNumber = num + transformArray[i];
  // if new number is the same as an existiong current item  return new number is
  if (_store.currentItem.includes(newNumber)) {
    return newNumber;
  } else if (_store.grid[newNumber] === 1) {
    // console.log('not', newNumber);
    return;
  } else if (newNumber > (_store.columns * _store.rows)) {
    // console.log('not > max', newNumber);
    return;
  } else {
    return newNumber;
  }
}

/*
 * Accepts an number and transforms this based on its shape and position
 * also accept @param shape
 */
function transformCurrentShapeOneEighty(num, i, array) {
  // console.log(array);
  // console.log("direction", direction)
  let shape = this.shape;
  // let currentShape = array;
  let transformArray = _store.shapes[shape].transformations.oneeighty;
  // here we can check if transformed array is valid?
  let newNumber = num + transformArray[i];
  // if new number is the same as an existiong current item return new number is
  if (_store.currentItem.includes(newNumber)) {
    return newNumber;
  } else if (_store.grid[newNumber] === 1) {
    // console.log('not', newNumber);
    return;
  } else if (newNumber > (_store.columns * _store.rows)) {
    // console.log('not > max', newNumber);
    return;
  } else {
    return newNumber;
  }
}

/*
 * Accepts an number and transforms this based on its shape and position
 * also accept @param shape
 */
function transformCurrentShapeOneEightyAnti(num, i, array) {
  // console.log(array);
  // console.log("direction", direction)
  let shape = this.shape;
  // let currentShape = array;
  let transformArray = _store.shapes[shape].transformationsa.oneeighty;
  // here we can check if transformed array is valid?
  let newNumber = num + transformArray[i];
  // if new number is the same as an existiong current item return new number is
  if (_store.currentItem.includes(newNumber)) {
    return newNumber;
  } else if (_store.grid[newNumber] === 1) {
    // console.log('not', newNumber);
    return;
  } else if (newNumber > (_store.columns * _store.rows)) {
    // console.log('not > max', newNumber);
    return;
  } else {
    return newNumber;
  }
}


/*
 * Accepts an number and transforms this based on its shape and position
 * also accept @param shape
 */
function transformCurrentShapeTwoSeventy(num, i, array) {
  let shape = this.shape;
  // let currentShape = array;
  let transformArray = _store.shapes[shape].transformations.twoseventy;
  // here we can check if transformed array is valid?
  let newNumber = num + transformArray[i];
  // if new number is the same as an existiong current item  return new number is
  if (_store.currentItem.includes(newNumber)) {
    return newNumber;
  } else if (_store.grid[newNumber] === 1) {
    // console.log('not', newNumber);
    return;
  } else if (newNumber > (_store.columns * _store.rows)) {
    // console.log('not > max', newNumber);
    return;
  } else {
    return newNumber;
  }
}

/*
 * Accepts an number and transforms this based on its shape and position
 * also accept @param shape
 */
function transformCurrentShapeTwoSeventyAnti(num, i, array) {
  let shape = this.shape;
  // let currentShape = array;
  let transformArray = _store.shapes[shape].transformationsa.twoseventy;
  // here we can check if transformed array is valid?
  let newNumber = num + transformArray[i];
  // if new number is the same as an existiong current item  return new number is
  if (_store.currentItem.includes(newNumber)) {
    return newNumber;
  } else if (_store.grid[newNumber] === 1) {
    // console.log('not', newNumber);
    return;
  } else if (newNumber > (_store.columns * _store.rows)) {
    // console.log('not > max', newNumber);
    return;
  } else {
    return newNumber;
  }
}

/*
 * Accepts an number and transforms this based on its shape and position
 * also accept @param shape
 */
function transformCurrentShapeThreeSixty(num, i, array) {
  // console.log(array);
  // console.log("direction", direction)
  let shape = this.shape;
  // let currentShape = array;
  let transformArray = _store.shapes[shape].transformations.threesixty;
  // here we can check if transformed array is valid?
  let newNumber = num + transformArray[i];
  // if new number is the same as an existiong current item  return new number is
  if (_store.currentItem.includes(newNumber)) {
    return newNumber;
  } else if (_store.grid[newNumber] === 1) {
    // console.log('not', newNumber);
    return;
  } else if (newNumber > (_store.columns * _store.rows)) {
    // console.log('not > max', newNumber);
    return;
  } else {
    return newNumber;
  }
}

/*
 * Accepts an number and transforms this based on its shape and position
 * also accept @param shape
 */
function transformCurrentShapeThreeSixtyAnti(num, i, array) {
  let shape = this.shape;
  // let currentShape = array;
  let transformArray = _store.shapes[shape].transformationsa.threesixty;
  // here we can check if transformed array is valid?
  let newNumber = num + transformArray[i];
  // if new number is the same as an existiong current item  return new number is
  if (_store.currentItem.includes(newNumber)) {
    return newNumber;
  } else if (_store.grid[newNumber] === 1) {
    // console.log('not', newNumber);
    return;
  } else if (newNumber > (_store.columns * _store.rows)) {
    // console.log('not > max', newNumber);
    return;
  } else {
    return newNumber;
  }
}

/*
 * returns a random number depending on the amount of items in the _store.shapes array
 * stores random number that represents the index of teh shape in the _store.shape field
 */
function chooseRandomShape() {
  let randShape = Math.floor((Math.random() * _store.shapes.length));
  _store.shape = randShape;
  _store.angle = 0;
  return randShape;
}

// function isOdd(num) { return num % 2; }

/*
 * takes a integer representing the array count of the random shape
 * enables look up of shape based on matching array id
 * paints this shape on the canvas
 */
function paintShape(i) {
  let shape = _store.shapes[i].shape;
  let shapeWidth = _store.shapes[i].width;
  let startx = parseInt(_store.columns / 2);
  startx = startx - parseInt(shapeWidth / 2);
  let starty = startx - 1;
  let startz = startx + 1;
  let startxx = startx + 2;

  // stop game if startx is not available
  if (_store.grid[startx] === 1 || _store.grid[starty] === 1 || _store.grid[startz] === 1 || _store.grid[startxx] === 1) {
    stopGame();
    return;
  } else {
    shape.forEach(paintShapeItem, { startx: startx, i: i });
  }
}

/*
 * used by paintShape to Map a random shape @array onto canvas
 * also stores current shape in currentItem
 */
function paintShapeItem(item, index, arr) {
  let startx = this.startx;
  let i = this.i;
  let limit = _store.columns * _store.rows;
  if (index < _store.shapes[i].width) {
    let currentItemIndex = index + startx;
    if (item === 1) {
      if (item < limit) {
        _store.currentItem.push(currentItemIndex);
        paintItem(_store.grid, currentItemIndex, item)
      }
    }
  } else {
    let currentItemIndexSecondLine = _store.columns - _store.shapes[i].width + index + startx;
    if (item === 1) {
      if (item < limit) {
        _store.currentItem.push(currentItemIndexSecondLine);
        paintItem(_store.grid, currentItemIndexSecondLine, item)
      }
    }

  }
}
/*
 * used to update an array from grid or canvas
 * takes and array of items @currentItem - loops through and paints on the canvas
 */
function updatePaintShape(currentItem) {

  currentItem.forEach(updatePaintShapeItem)

  function updatePaintShapeItem(item, index, arr) {
    let limit = _store.columns * _store.rows;
    let lowerLimit = 0;
    if (item < limit && item >= lowerLimit) {
      paintItem(_store.grid, item, 1);
    }
  }

}

/*
 *  accepts an array of values and removes them from the grid - sets to 0
 */
function unPaintShape(currentItem) {
  currentItem.forEach(unPaintShapeItem)
}

function unPaintShapeItem(item, index, arr) {
  // make sure item is positive
  if (item >= 0) {
    paintItem(_store.grid, item, 0);
  }
}

/**
 * This function moves everything on the canvas to the left
 * Updates the state in the store
 */
function moveLeft() {
  if (_store.currentItem.length !== 0) {
    let initialCurrentLength = _store.currentItem.length;
    let sortedCurrentItem = _store.currentItem.sort(function(a, b) { return b - a });
    let tempCurrent = sortedCurrentItem.map(moveLeftCurrent);
    tempCurrent = tempCurrent.filter(function(element) {
      return element !== undefined;
    });
    let processedCurrentLength = tempCurrent.length;
    /*
    // check length of new array is the same as initially set
    // if there is a difference it implies that the current
    // block cannot move so we should stop leave as is and
    // render a new random shape
    */
    if (initialCurrentLength === processedCurrentLength) {
      moveCurrent(tempCurrent);
    }
  }
}

/**
 * This function moves everything on the canvas to the left
 * Updates the state in the store
 */
function moveRight() {
  if (_store.currentItem.length !== 0) {
    let initialCurrentLength = _store.currentItem.length;
    let sortedCurrentItem = _store.currentItem.sort(function(a, b) { return b - a });
    let tempCurrent = sortedCurrentItem.map(moveRightCurrent);
    //remove items where value is undefined
    tempCurrent = tempCurrent.filter(function(element) {
      return element !== undefined;
    });
    let processedCurrentLength = tempCurrent.length;
    /*
    // check length of new array is the same as initially set
    // if there is a difference it implies that the current
    // block cannot move so we should stop leave as is and
    // render a new random shape
    */
    if (initialCurrentLength === processedCurrentLength) {
      moveCurrent(tempCurrent);
    }
  }
}

/*
 * this is where we remove cells from bottom or end
 */
// function removeBottom() {
//   _store.grid.splice((_store.columns * _store.rows) - _store.columns - 1, _store.columns);
// }

/**
 * Adds a row of blanks cells to the start of the _store.grid
 * depending on the amount of columns in the grid
 */
function addTop() {
  let columns = _store.columns;
  for (let i = 0; i < columns; i++) {
    _store.grid.unshift(0);
  }
}

/*
 * moves the _store.currentItem down one
 */
function moveDown() {
  if (_store.currentItem.length !== 0) {
    let initialCurrentLength = _store.currentItem.length;
    let sortedCurrentItem = _store.currentItem.sort(function(a, b) { return b - a });
    let tempCurrent = sortedCurrentItem.map(addGravity);
    //remove items where value is undefined
    tempCurrent = tempCurrent.filter(function(element) {
      return element !== undefined;
    });
    let processedCurrentLength = tempCurrent.length;
    /*
    // check length of new array is the same as initially set
    // if there is a difference it implies that the current
    // block cannot move so we should stop leave as is and
    // render a new random shape
    */
    if (initialCurrentLength === processedCurrentLength) {
      moveCurrent(tempCurrent);
    } else {
      dropNext();
    }
  }
}


/*
 * moves the _store.currentItem down one
 */
function dropDownOne() {
  // if (currentArray.length === 4) {
  // let initialCurrentLength = _store.currentItem.length;
  //sort in reverse numerical order
  let sortedCurrentItem = _store.currentItem.sort(function(a, b) { return b - a });
  // let tempCurrent = sortedCurrentItem.map(addGravity);
  //remove items where value is undefined
  // tempCurrent = tempCurrent.filter(function(element) {
  //   return element !== undefined;
  // });
  let tempCurrent = sortedCurrentItem;


  for (let i = 0; i <= _store.rows; i++) {
    tempCurrent = tempCurrent.map(addGravity);
    tempCurrent = tempCurrent.filter(function(element) {
      return element !== undefined;
    });
    // console.log(tempCurrent);
    if (tempCurrent.length === 4) {
      moveCurrent(tempCurrent);
    } else {
      // dropNext();
      return;
    }
  }

}
// if (tempCurrent.length === 4) {

//   moveCurrent(tempCurrent);

//   sortedCurrentItem = _store.currentItem.sort(function(a, b) { return b - a });
//   tempCurrent = sortedCurrentItem.map(addGravity);
//   //remove items where value is undefined
//   tempCurrent = tempCurrent.filter(function(element) {
//     return element !== undefined;
//   });
//   if (tempCurrent.length === 4) {
//     moveCurrent(tempCurrent);
//     // repeat until length < 4 at which point start agaain
//   }
// }

// // }
// }

/*
 * moves the _store.currentItem down one
 */
function dropDown() {

  if (_store.currentItem.length === 4) {
    dropDownOne();
  } else {
    dropNext();
  }
  // console.log('dropDown');
  // if (_store.currentItem.length === 4) {
  //   // let initialCurrentLength = _store.currentItem.length;
  //   //sort in reverse numerical order
  //   // _store.currentItem.sort(function(a, b) { return b - a });
  //   // let tempCurrent = _store.currentItem.map(addGravity);
  //   //remove items where value is undefined
  //   // tempCurrent = tempCurrent.filter(function(element) {
  //   //   return element !== undefined;
  //   // });
  //   // let tempCurrent = dropDownOne(tempCurrent);
  //   console.log(tempCurrent);
  //   if (_store.currentItem.length === 4) {
  //     dropDownOne(tempCurrent);
  //   } else {
  //     dropNext();
  //   }
  // }
}

/*
 * Used to unpaint current item
 * update the currentItem in the store
 * update the new curreent shape and print on the canvas
 */
function moveCurrent(tempCurrent) {
  unPaintShape(_store.currentItem);
  _store.currentItem = tempCurrent.slice(0);
  updatePaintShape(_store.currentItem);
}

/*
 * start again
 */
function dropNext() {
  // reset current item
  _store.currentItem.length = 0;
  //check for filled rows
  checkRows();
  //choose random shape
  let randShape = chooseRandomShape();
  paintShape(randShape);
}

/*
 * checks for any filled rows
 */
function checkRows() {
  let tempGrid = _store.grid;

  //counts through from high to low
  for (let i = 0; i < _store.rows; i++) {

    let tempLength = tempGrid.length;

    let temp = tempGrid.slice(tempLength - ((_store.columns * i) + _store.columns), tempLength - (_store.columns * i));

    //check each row for alll matching ones
    let count = 0;
    //counts through from high to low
    for (let j = 0; j < _store.columns; j++) {

      let tempj = temp.slice((temp.length - 1) - j)[0];
      if (tempj === 1) {
        count = count + 1;

      }
    }
    /* 1. get the row of items and remove from the
     * 2. insert rows at the top
     */
    if (count === 10) {
      _store.score = _store.score + 10;
      if (_store.score > _store.highScore) {
        _store.highScore = _store.score;
        localStorage.setItem('highScore', _store.highScore);

        console.log('new high score');
      }
      let tempLength2 = _store.grid.length;
      _store.grid.splice(tempLength2 - ((_store.columns * i) + _store.columns), _store.columns);
      // playTestInstrument();
      play();
      addTop();
      decreaseInterval();
      //not sure why we have to start timer again?! after decreasiong interval in order for speed to decrease
      startTimer();
      // not always removing multiple rows ?
    }
  }

}


/*
 * item - should match the index in the stage
 * used by map to add increase each item so that it moves down one row
 */
function addGravity(item, index, arr) {
  let limit = _store.columns * _store.rows;
  if (item < (_store.grid.length - _store.columns)) {
    //add check to see if exists in currentItem, then we don't want to check for 1
    if (_store.currentItem.includes(item + _store.columns)) {
      if (item + _store.columns < limit) {
        return item = item + _store.columns;
      }
    } else {
      if (_store.grid[item + _store.columns] !== 1) {
        if (item + _store.columns < limit) {
          return item = item + _store.columns;
        }
      } else {
        return;
      }
    }
  } else {
    return;
  }
}

/*
 * item - should match the index in the stage
 * used by map to add increase each item so that it moves down one row
 */
function moveLeftCurrent(item, index, arr) {
  // if current shape has an item that is (index) % number_columns == 0
  // then we cannot move left
  //e.g. 0 1 2 3 4 5 6 7 8 9
  //     10 11 12 13 14 15 16 17 18 19 20
  // e.g. 0000111000
  //      0000010000
  // 4, 5, 6, 15 become
  // 3 , 4, 5, 14

  if (_store.currentItem.includes(item - 1)) {
    return item = item - 1;
  } else {
    //check if first column
    if (item % _store.columns !== 0) {
      // need to also check if element already exists in grid
      if (_store.grid[item - 1] !== 1) {
        return item = item - 1;
      } else {
        return;
      }
    } else {
      return;
    }
  }
}

/*
 * item - should match the index in the stage
 * used by map to add increase each item so that it moves across one column
 */
function moveRightCurrent(item, index, arr) {
  if (_store.currentItem.includes(item + 1)) {
    return item = item + 1;
  } else {
    //check if first column
    if ((item + 1) % _store.columns !== 0) {
      // need to also check if element already exists in grid
      if (_store.grid[item + 1] !== 1) {
        return item = item + 1;
      } else {
        return;
      }
    } else {
      return;
    }
  }

}

/*
 * starts game and sets state of game to 1
 */
function startGame() {
  //clear the grid here
  play();
  clearGrid();
  //reset the score
  _store.score = 0;
  //start the game
  _store.state = 1;
  // reset the interval
  setInitialInterval();
  let randShape = chooseRandomShape();
  paintShape(randShape);
}

/*
 * clear grid
 */
function clearGrid() {
  _store.grid = StartGrid.slice(0);
}

/*
 * load local storage including high score
 */
function loadLocalStorage() {
  _store.highScore = localStorage.getItem('highScore') || '0';
}


/*
 * stop game
 */
function stopGame() {
  // if (_store.highscore < _store.state) {
  //   // _store.highscore = _store.state;
  //   console.log('new high score');
  // }
  _store.state = 0;

  console.log('stop game');
}

/*
 * make decreace the applications interval state
 */
function decreaseInterval() {
  _store.interval = _store.interval - (_store.interval * .1);
  // clear on window object
  clearInterval(gameInterval);
}

/*
 * reset decreace the applications interval state
 */
function setInitialInterval() {
  _store.interval = 1000;
  if (_store.timer > 0) {
    clearInterval(gameInterval);
  }
}

//declare in global scope
var gameInterval;
/*
 * start timer
 */
function startTimer() {
  gameInterval = window.setInterval(startTimerCallback, _store.interval);
}

/*
 * start timer calback
 */
function startTimerCallback() {
  if (_store.state === 1) {
    _store.timer = _store.timer + 1;
    moveDown();
    GridsterStore.emit(CHANGE_EVENT);
  } else {
    return;
  }
}

/*
 * map keys to functions
 */
function keyMap(key) {
  switch (key) {
    case 'Space':
      if (_store.state > 0) {
        dropDown();
      }
      break;
    case 'ArrowDown':
      if (_store.state > 0) {
        turnClockwise();
      }
      break;
    case 'ArrowUp':
      if (_store.state > 0) {
        turnAnticlockwise();
      }
      break;
    case 'ArrowLeft':
      if (_store.state > 0) {
        moveLeft();
      }
      break;
    case 'ArrowRight':
      if (_store.state > 0) {
        moveRight();
      }
      break;
    default:
      return;
  }
}

// Register each of the actions with the dispatcher
// by changing the store's data and emitting a
// change
AppDispatcher.register((payload) => {

  const action = payload.action;

  switch (action.actionType) {

    case GridsterConstants.UPDATE_ITEM:

      _store.grid.push(action.value);
      GridsterStore.emit(CHANGE_EVENT);

      break;

    case GridsterConstants.UPDATE_ROW:

      _store.rows = action.value;
      GridsterStore.emit(CHANGE_EVENT);
      break;

    case GridsterConstants.UPDATE_COL:

      _store.columns = action.value;
      GridsterStore.emit(CHANGE_EVENT);
      break;

    case GridsterConstants.UPDATE_GRAVITY:
      // moveDown();
      if (_store.state > 0) {
        dropDown();
      }
      GridsterStore.emit(CHANGE_EVENT);
      break;

    case GridsterConstants.MOVE_RIGHT:
      // call function to update store here = add 10 cells to beginning - remove 10 cells at the end
      if (_store.state > 0) {
        moveRight();
      }
      GridsterStore.emit(CHANGE_EVENT);
      break;

    case GridsterConstants.MOVE_LEFT:
      // call function to update store here = add 10 cells to beginning - remove 10 cells at the end
      if (_store.state > 0) {
        moveLeft();
      }
      GridsterStore.emit(CHANGE_EVENT);
      break;

    case GridsterConstants.MOVE_ANTICLOCKWISE:
      // call function to update store here = add 10 cells to beginning - remove 10 cells at the end
      if (_store.state > 0) {
        turnAnticlockwise();
      }
      GridsterStore.emit(CHANGE_EVENT);
      break;
      
    case GridsterConstants.MOVE_CLOCKWISE:
      // call function to update store here = add 10 cells to beginning - remove 10 cells at the end
      if (_store.state > 0) {
        turnClockwise();
      }
      GridsterStore.emit(CHANGE_EVENT);
      break;

    case GridsterConstants.START_GAME:
      // call function to update store here = add 10 cells to beginning - remove 10 cells at the end
      startGame();
      startTimer();

      GridsterStore.emit(CHANGE_EVENT);
      break;

    case GridsterConstants.GENERATE_GRID:

      let total = _store.columns * _store.rows;

      let newCells = [];

      for (let i = 0; i < total; i++) {
        newCells.push({ 'id': i, 'clicked': "false", 'state': "initial", 'x': xcoord(i), 'y': ycoord(i), 'path': null, 'flag': false, 'counter': Infinity });
      }

      _store.grid = newCells;

      GridsterStore.emit(CHANGE_EVENT);
      break;

    case GridsterConstants.GENERATE_CLICK:

      let clickIndex = _store.grid.findIndex((obj => obj.id === parseInt(action.value, 10)));

      if (_store.grid[clickIndex].clicked === "false" && clickIndex !== _store.start.id && clickIndex !== _store.end.id) {
        _store.grid[clickIndex].clicked = "true";
      } else if (_store.grid[clickIndex].clicked === "true" && clickIndex !== _store.start.id && clickIndex !== _store.end.id) {
        _store.grid[clickIndex].clicked = "false";
        //
      }

      GridsterStore.emit(CHANGE_EVENT);

      break;


    case GridsterConstants.MOUSE_ENTER:

      let enterIndex = _store.grid.findIndex((obj => obj.id === parseInt(action.value, 10)));

      _store.grid[enterIndex].state = "hover";

      GridsterStore.emit(CHANGE_EVENT);

      break;

    case GridsterConstants.MOUSE_EXIT:

      let exitIndex = _store.grid.findIndex((obj => obj.id === parseInt(action.value, 10)));

      _store.grid[exitIndex].state = "initial";

      GridsterStore.emit(CHANGE_EVENT);
      break;

    case GridsterConstants.MOUSE_DOWN:

      // let downIndex = _store.grid.findIndex((obj => obj.id === parseInt(action.value, 10)));

      // _store.grid[downIndex].state = "down";

      GridsterStore.emit(CHANGE_EVENT);
      break;

    case GridsterConstants.KEY_DOWN:
      // console.log(action);

      keyMap(action.key);

      GridsterStore.emit(CHANGE_EVENT);
      break;

    case GridsterConstants.LOCAL_STORAGE:
      // console.log(action);

      loadLocalStorage();

      GridsterStore.emit(CHANGE_EVENT);
      break;


    default:
      return;
  }

});

export default GridsterStore;