type Row = {
  el: HTMLTableRowElement;
  cells: Cell[];
};

type Cell = {
  el: HTMLTableCellElement;
};

export const initTable = (document: Document) => (table: HTMLTableElement) => (rowsCount: number, colsCount: number) => {
  const rows = initRows(document)(rowsCount, colsCount);

  rows.forEach((row) => {
    row.cells.forEach((cell) => {
      row.el.appendChild(cell.el);
    });
    table.appendChild(row.el);
  });

  const cells = rows.map((row) => {
    return row.cells.map((cell) => cell.el);
  });

  return cells;
}

export const initRows = (document: Document) => (rowsCount: number, colsCount: number) => {
  const rows = new Array(rowsCount).fill(null).map((_r, rowIndex) => {
    const row = initRow(document)(rowIndex, colsCount)
    return row;
  });

  return rows;
}

export const initRow = (document: Document) => (rowIndex: number, colsCount: number) => {
  const rowEl = document.createElement("tr");
  rowEl.classList.add("row");
  rowEl.dataset.index = `${rowIndex}`;

  const cells = initCells(document)(rowIndex, colsCount);

  const row: Row = {
    el: rowEl,
    cells,
  };

  return row;
}

export const initCells = (document: Document) => (rowIndex: number, colsCount: number) => {
  const cells = new Array(colsCount).fill(null).map((_c, colIndex) => {
    const cell = initCell(document)(rowIndex, colIndex)
    return cell;
  });

  return cells
}

export const initCell = (document: Document) => (rowIndex: number, colIndex: number) => {
  const cellEl = document.createElement("td");
  cellEl.classList.add("cell");
  cellEl.dataset.rowIndex = `${rowIndex}`;
  cellEl.dataset.index = `${colIndex}`;

  const cell: Cell = {
    el: cellEl,
  };

  return cell;
}

export const applyLifeState =
  (aliveClass: string) => (cells: HTMLTableCellElement[][]) => (lifeState: boolean[][]) => {
    cells.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const alive = lifeState[rowIndex][colIndex];
        if (alive) {
          cell.classList.add("alive");
        } else {
          cell.classList.remove("alive");
        }
      });
    });
  };

export const applyAgeState =
  (el: HTMLElement) => (ageState: number) => {
    el.innerHTML = `${ageState}`
  };
