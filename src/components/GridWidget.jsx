import React, { Component } from 'react';

import GridsterStore from '../stores/GridsterStore.js';
import Button from './Button';
// import Input from './Input';
import Grid from './Grid';
import { updateRow, updateColumn, generateGrid, generateStart, generateEnd, updateGravity, moveClockwise, moveAnticlockwise, startGame, moveRight, moveLeft, keyDown, loadLocalStorage} from '../actions/GridsterActions.js';
// import { EventEmitter } from 'events';

function inputValidation(value) {
  //check for number input
  if(typeof value === 'number') {
  //check value is <= || 20 > 0
    if(value <= 20 && value > 0){
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

export default class GridWidget extends Component {

  constructor(props) {
    super(props);
    this._onChangeCols = this._onChangeCols.bind(this);
    this._onChangeRows = this._onChangeRows.bind(this);
    this._onChange = this._onChange.bind(this);
    this._onGenerateGrid = this._onGenerateGrid.bind(this);
    this._onGravity = this._onGravity.bind(this);
    this._onRight = this._onRight.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.xDown = null;
    this.yDown = null;
    this.xPos = null;
    this.yPos = null;
    this.state = {
      columns: 10,
      rows: 20,
      grid: [],
      timerOn: false,
      timerStart: 0,
      timerTime: 0
    };
    loadLocalStorage();
    document.addEventListener("keydown", this._onKeyDown.bind(this));
    document.addEventListener('touchstart', this.handleTouchStart.bind(this), false);
    document.addEventListener('touchmove', this.handleTouchMove.bind(this), false);
    // remove window listener - scrolls window
    window.addEventListener("keydown", function(event) {
      // space and arrow keys
      if([32, 37, 38, 39, 40].indexOf(event.keyCode) > -1) {
        event.preventDefault();
      }
    }, false);
  //   window.addEventListener("touchmove", function( event ) {
  //     event.preventDefault();
  //     console.log('window touch')
  //     return;
  //     // console.log('window touch')
  //     // let touch = event.touches[ 0 ];
  //     // console.log(touch);
  //     // let oldX = this.xPos;
  //     // let oldY = this.yPos;
  //     // this.xPos = touch.pageX;
  //     // // console.log(this.xPos)
  //     // this.yPos = touch.pageY;
  //     // console.log(this.yPos)

  //     // if ( oldX == null && oldY == null ) {
  //     //   console.log('false 1');
  //     //   event.preventDefault();

  //     //     return false;
  //     // }
  //     // else {
  //     //   console.log('false 2');

  //     //     if ( Math.abs( oldX-this.xPos ) > 0 || Math.abs( oldY-this.yPos ) > 0 ) {
  //     //       console.log('false 22');

  //     //         event.preventDefault();
  //     //         return false;
  //     //     }
  //     // }
  // } );
  }

  componentDidMount() {
    GridsterStore.addChangeListener(this._onChange);
    this.setState(GridsterStore.getGrid());
  }

  componentWillUnmount() {
      document.removeEventListener("keydown", this._onKeyDown.bind(this));
      document.removeEventListener("touchstart", this.handleTouchStart.bind(this));
      document.removeEventListener("touchmove", this.handleTouchMove.bind(this));
    // restore remove window listener - scrolls window
      window.removeEventListener("keydown", function(e) {
        // space and arrow keys
        if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    }, false);
    GridsterStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState(GridsterStore.getGrid());
  }

  _onChangeRows(event) {
    let value = parseInt(event.target.value, 10);
    if (inputValidation(value)) {
      this.setState({
        rows: value
      });
   }
  }

  handleTouchStart(event) {
    event.preventDefault();
    // console.log('handleTouchStart');
    this.xDown =  event.touches[0].clientX;
    this.yDown = event.touches[0].clientY;
}

 handleTouchMove(event) {
  // console.log('handleTouchMove');
  event.preventDefault();

  if ( ! this.xDown || ! this.yDown ) {
      return;
  }

  this.xUp = event.touches[0].clientX;
  this.yUp = event.touches[0].clientY;

  this.xDiff = this.xDown - this.xUp;
  this.yDiff = this.yDown - this.yUp;

  if ( Math.abs( this.xDiff ) > Math.abs( this.yDiff ) ) {/*most significant*/
      if ( this.xDiff > 0 ) {
          /* left swipe */
          // console.log('swipe left')
          this._onLeft()

      } else {
          /* right swipe */
          // console.log('swipe right')
          this._onRight()
      }
  } else {
      if ( this.yDiff > 0 ) {
          /* up swipe */
          // console.log('swipe up')
          this._onRotateClockwise();

      } else {
          /* down swipe */
          // console.log('swipe down')
          this._onGravity();
      }
  }
  /* reset values */
  this.xDown = null;
  this.yDown = null;
}

  _onChangeCols(event) {
    let value = parseInt(event.target.value, 10);
    if (inputValidation(value)) {
    this.setState({
      columns: value
    });
   }
  }

  _onGenerateGrid() {
    updateColumn(this.state.columns);
    updateRow(this.state.rows);
    generateGrid();
    generateStart();
    generateEnd();
  }

  _onGravity() {
    updateGravity();
  }

  _onRight() {
    moveRight();
  }

  _onLeft() {
    moveLeft();
  }

  _onRotateClockwise() {
    moveClockwise();
  }
  
  _onRotateAnticlockwise() {
    moveAnticlockwise();
  }

  _startGame() {
    startGame();
  }

  _onKeyDown(e) {
    keyDown(e.code);
  }

  render() {
    const enabled = this.state.state < 1;
    return (
      <div className="container" >
        <div className="inner-container" >
          <span className="score">Score: {this.state.score} </span>
          <span className="score--high">High Score: {this.state.highScore}</span>
          <form className="form-container">
            <Button text="Left" onclick={this._onLeft} />
            <Button text="Right" onclick={this._onRight} />
            <Button text="Down" onclick={this._onGravity} />
            <Button text="Clockwise" onclick={this._onRotateClockwise} />
            <Button text="Anticlockwise" onclick={this._onRotateAnticlockwise} />

            <Button text="Start" disabled={!enabled} onclick={this._startGame} />

          </form>
        </div>
        <div className="inner-container" >
        {/* <span>{this.state.audioUnlocked ? 'unlocked' : 'locked'}</span> */}

          <Grid
            grid={this.state.grid} columns="10" rows="15"
          />
        </div>
    </div>
    );
  }

}

