import _create from "zustand/vanilla";
import { subscribeWithSelector } from "zustand/middleware";
import {
  CellIndex,
  getCleanState,
  getNextLifeState,
  getRandomState,
  getShiftedLifeState,
  toggleCellState,
} from "./rules";

export type State = {
  rowsCount: number;
  colsCount: number;
  life: boolean[][];
  savedLife: boolean[][] | null;
  running: boolean;
  frequency: number;
  age: number;
  randomizeLife: () => void;
  clearLife: () => void;
  evolveLife: () => void;
  toggleCellLife: (cellIndex: CellIndex) => void;
  saveLife: () => void;
  restoreLife: () => void;
  shiftLife: (byX: number, byY: number) => void
};

export const createStore = (rowsCount: number, colsCount: number) => {
  return _create(
    subscribeWithSelector<State>((set) => ({
      rowsCount,
      colsCount,
      life: getCleanState(rowsCount, colsCount),
      savedLife: null,
      running: false,
      frequency: 200,
      age: 0,
      randomizeLife: () =>
        set((prevState) => ({
          life: getRandomState(prevState.rowsCount, prevState.colsCount),
          age: 0,
        })),
      clearLife: () =>
        set((prevState) => ({
          life: getCleanState(prevState.rowsCount, prevState.colsCount),
          age: 0,
        })),
      evolveLife: () =>
        set((prevState) => ({
          life: getNextLifeState(prevState.life),
          age: prevState.age + 1,
        })),
      toggleCellLife: (cellIndex: CellIndex) =>
        set((prevState) => ({
          life: toggleCellState(prevState.life)(cellIndex),
        })),
      saveLife: () => set((prevState) => ({ savedLife: prevState.life })),
      restoreLife: () =>
        set((prevState) =>
          prevState.savedLife != null
            ? {
                life: prevState.savedLife,
                age: 0,
              }
            : {}
        ),
      shiftLife: (byX, byY) => set((prevState) => ({ life: getShiftedLifeState(prevState.life)(byX, byY) }))
    }))
  );
};
