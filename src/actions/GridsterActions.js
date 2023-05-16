// Gridster actions
import AppDispatcher from '../dispatcher/AppDispatcher';
import { GridsterConstants } from '../constants/GridsterConstants';

export function updateColumn(value) {
  AppDispatcher.handleViewAction({
    actionType: GridsterConstants.UPDATE_COL,
    value: value
  });
}

export function updateRow(value) {
  AppDispatcher.handleViewAction({
    actionType: GridsterConstants.UPDATE_ROW,
    value: value
  });
}

export function updateGrid() {
  AppDispatcher.handleViewAction({
    actionType: GridsterConstants.UPDATE_GRID
  });
}

export function generateGrid() {
  AppDispatcher.handleViewAction({
    actionType: GridsterConstants.GENERATE_GRID
  });
}

export function generateClick(value) {
  AppDispatcher.handleViewAction({
    actionType: GridsterConstants.GENERATE_CLICK,
    value: value
  });
}

export function mouseEnter(value) {
  AppDispatcher.handleViewAction({
    actionType: GridsterConstants.MOUSE_ENTER,
    value: value
  });
}

export function mouseExit(value) {
  AppDispatcher.handleViewAction({
    actionType: GridsterConstants.MOUSE_EXIT,
    value: value
  });
}

export function mouseDown(value) {
  AppDispatcher.handleViewAction({
    actionType: GridsterConstants.MOUSE_DOWN,
    value: value
  });
}

export function generateStart() {
  AppDispatcher.handleViewAction({
    actionType: GridsterConstants.GENERATE_START
  });
}

export function generateEnd() {
  AppDispatcher.handleViewAction({
    actionType: GridsterConstants.GENERATE_END
  });
}

export function updateGravity() {
  AppDispatcher.handleViewAction({
    actionType: GridsterConstants.UPDATE_GRAVITY
  });
}

export function moveRight() {
  AppDispatcher.handleViewAction({
    actionType: GridsterConstants.MOVE_RIGHT
  });
}

export function moveLeft() {
  AppDispatcher.handleViewAction({
    actionType: GridsterConstants.MOVE_LEFT
  });
}

export function moveClockwise() {
  AppDispatcher.handleViewAction({
    actionType: GridsterConstants.MOVE_CLOCKWISE
  });
}

export function moveAnticlockwise() {
  AppDispatcher.handleViewAction({
    actionType: GridsterConstants.MOVE_ANTICLOCKWISE
  });
}

export function startGame() {
  AppDispatcher.handleViewAction({
    actionType: GridsterConstants.START_GAME
  });
}

export function keyDown(key) {
  AppDispatcher.handleViewAction({
    actionType: GridsterConstants.KEY_DOWN,
    key: key
  });
}

export function loadLocalStorage() {
  AppDispatcher.handleViewAction({
    actionType: GridsterConstants.LOCAL_STORAGE
  });
}