import { applyAgeState, applyLifeState, initTable } from "./dom";
import { createStore } from "./state";
import { createTicker } from "./ticker";
import "./style.css";

const root = document.querySelector<HTMLHtmlElement>(":root")!;

const lifeTable = document.querySelector<HTMLTableElement>("#life-table")!;

const startBtn = document.querySelector<HTMLButtonElement>("#start-btn")!;
const stopBtn = document.querySelector<HTMLButtonElement>("#stop-btn")!;
const clearBtn = document.querySelector<HTMLButtonElement>("#clear-btn")!;
const randomBtn = document.querySelector<HTMLButtonElement>("#random-btn")!;
const saveBtn = document.querySelector<HTMLButtonElement>("#save-btn")!;
const restoreBtn = document.querySelector<HTMLButtonElement>("#restore-btn")!;
const ageDisplay = document.querySelector<HTMLElement>("#age-display")!;
const moveLeftBtn = document.querySelector<HTMLButtonElement>("#move-left-btn")!;
const moveRightBtn = document.querySelector<HTMLButtonElement>("#move-right-btn")!;
const moveTopBtn = document.querySelector<HTMLButtonElement>("#move-top-btn")!;
const moveBottomBtn = document.querySelector<HTMLButtonElement>("#move-bottom-btn")!;

const frequencyRng =
  document.querySelector<HTMLInputElement>("#frequency-range")!;

const cellSide = 12;
// set css variable
root.style.setProperty("--cell-side", `${cellSide}`);

const maxRows = Math.floor(lifeTable.clientHeight / cellSide);
const maxCols = Math.floor(lifeTable.clientWidth / cellSide);

// Initialize dom table
const cells = initTable(document)(lifeTable)(maxRows, maxCols);

// Initialize state
const {
  setState,
  getState,
  subscribe: subscribeState,
} = createStore(maxRows, maxCols);
const {
  frequency: initialFrequency,
  age: initialAge,
  randomizeLife,
  clearLife,
  evolveLife,
  toggleCellLife,
  saveLife,
  restoreLife,
  shiftLife,
} = getState();

// Main evolution loop
const tick: FrameRequestCallback = (time) => {
  evolveLife();
};

// Create a frequenced ticker
const ticker = createTicker(initialFrequency, tick);

// On life change, apply on dom
subscribeState((state) => state.life, applyLifeState("alive")(cells));

// On running change, start or stop
subscribeState(
  (state) => state.running,
  (running, prevRunning) => {
    if (running && !prevRunning) {
      ticker.start();
      console.log("Started");
    } else if (!running && prevRunning) {
      ticker.stop();
      console.log("Stopped");
    }
  }
);

// On frequency change, adjust it
subscribeState(
  (state) => state.frequency,
  (frequency) => {
    ticker.setFrequency(frequency);
    root.style.setProperty("--frequency", `${frequency}`);
    console.info(`Adjusted frequency to ${frequency}`);
  }
);

// On age change, display it
subscribeState(
  (state) => state.age,
  (age) => {
    applyAgeState(ageDisplay)(age);
  }
);

// DOM Initial state
frequencyRng.value = `${initialFrequency}`;
root.style.setProperty("--frequency", `${initialFrequency}`);
applyAgeState(ageDisplay)(initialAge)

// DOM event listeners
cells.forEach((row, rowIndex) => {
  row.forEach((cell, colIndex) => {
    cell.addEventListener("click", (evt) => {
      toggleCellLife([rowIndex, colIndex]);
    });
  });
});

startBtn.addEventListener("click", () => {
  setState({ running: true });
});

stopBtn.addEventListener("click", () => {
  setState({ running: false });
});

clearBtn.addEventListener("click", () => {
  clearLife();
  console.info("Cleared");
});

randomBtn.addEventListener("click", () => {
  randomizeLife();
  console.info("Randomized");
});

saveBtn.addEventListener("click", () => {
  saveLife();
  console.info("Saved");
});

restoreBtn.addEventListener("click", () => {
  restoreLife();
  console.info("Restored");
});

moveLeftBtn.addEventListener("click", () => {
  shiftLife(-1, 0);
  console.info(`Shifted life left`);
});

moveRightBtn.addEventListener("click", () => {
  shiftLife(1, 0);
  console.info(`Shifted life right`);
});

moveTopBtn.addEventListener("click", () => {
  shiftLife(0, -1);
  console.info(`Shifted life top`);
});

moveBottomBtn.addEventListener("click", () => {
  shiftLife(0, 1);
  console.info(`Shifted life bottom`);
});

frequencyRng.addEventListener("change", () => {
  const frequency = parseInt(frequencyRng.value);
  setState({ frequency });
});
