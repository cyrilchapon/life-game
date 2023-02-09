export type CellIndex = [number, number];

export const getSiblingsIndexes =
  (rowsCount: number, colsCount: number) => (cellIndex: CellIndex) => {
    const [cellRowIndex, cellColIndex] = cellIndex;

    const isTop = cellRowIndex === 0;
    const isBottom = cellRowIndex === rowsCount - 1;
    const isLeft = cellColIndex === 0;
    const isRight = cellColIndex === colsCount - 1;

    const isTopOrLeft = isTop || isLeft;
    const isTopOrRight = isTop || isRight;
    const isBottomOrLeft = isBottom || isLeft;
    const isBottomOrRight = isBottom || isRight;

    return [
      ...(!isTop ? [[cellRowIndex - 1, cellColIndex]] : []),
      ...(!isBottom ? [[cellRowIndex + 1, cellColIndex]] : []),
      ...(!isLeft ? [[cellRowIndex, cellColIndex - 1]] : []),
      ...(!isRight ? [[cellRowIndex, cellColIndex + 1]] : []),
      ...(!isTopOrLeft ? [[cellRowIndex -1 , cellColIndex - 1]] : []),
      ...(!isTopOrRight ? [[cellRowIndex - 1, cellColIndex + 1]] : []),
      ...(!isBottomOrLeft ? [[cellRowIndex + 1, cellColIndex - 1]] : []),
      ...(!isBottomOrRight ? [[cellRowIndex + 1, cellColIndex + 1]] : []),
    ] as CellIndex[];
  };

export const isAlive = (lifeState: boolean[][]) => (cellIndex: CellIndex) => {
  const [cellRowIndex, cellColIndex] = cellIndex;

  const alive = !!lifeState[cellRowIndex][cellColIndex]

  return alive
}

export const shouldLive = (lifeState: boolean[][]) => (cellIndex: CellIndex, siblings: CellIndex[]) => {
  const alive = isAlive(lifeState)(cellIndex)
  const aliveSiblings = siblings.filter(isAlive(lifeState))

  return (
    (alive && (aliveSiblings.length === 2 || aliveSiblings.length === 3)) ||
    (!alive && aliveSiblings.length === 3)
  )
}

export const getNextLifeState = (lifeState: boolean[][]) => {
  const rowsCount = lifeState.length
  const colsCount = lifeState[0].length
  const _getSiblingsIndexes = getSiblingsIndexes(rowsCount, colsCount)

  const nextState = lifeState.map((rowState, rowIndex) => (
    rowState.map((_cellState, colIndex) => {
      const cellIndex: CellIndex = [rowIndex, colIndex]
      const siblings = _getSiblingsIndexes([rowIndex, colIndex])
      const willLive = shouldLive(lifeState)(cellIndex, siblings)
      return willLive
    })
  ))

  return nextState
}

export const getShiftedLifeState = (lifeState: boolean[][]) => (byX: number, byY: number) => {
  const nextState = [
    ...lifeState.slice(-byY),
    ...lifeState.slice(0, -byY)
  ].map(
    row => [
      ...row.slice(-byX),
      ...row.slice(0, -byX)
    ]
  )

  return nextState
}

export const toggleCellState = (lifeState: boolean[][]) => (cellIndex: CellIndex) => {
  const [rowIndex, colIndex] = cellIndex

  const nextState = [
    ...lifeState.slice(0, rowIndex),
    [
      ...lifeState[rowIndex].slice(0, colIndex),
      !lifeState[rowIndex][colIndex],
      ...lifeState[rowIndex].slice(colIndex + 1),
    ],
    ...lifeState.slice(rowIndex + 1)
  ]

  return nextState
}

export const getCleanState = (rowsCount: number, colsCount: number) => {
  const cleanState = new Array(rowsCount).fill(null).map(row => {
    return new Array(colsCount).fill(null).map(cell => false)
  })

  return cleanState
}

export const getRandomState = (rowsCount: number, colsCount: number) => {
  const lifeFactor = 0.05

  const cleanState = new Array(rowsCount).fill(null).map(row => {
    return new Array(colsCount).fill(null).map(cell => Math.random() < lifeFactor)
  })

  return cleanState
}
