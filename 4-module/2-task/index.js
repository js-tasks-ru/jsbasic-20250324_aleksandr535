function makeDiagonalRed(table) {
  const rows = table.rows;

  for (let i = 0; i < rows.length; i++) {
    const rowCells = rows[i]. cells;
    rowCells[i].style.backgroundColor = 'red';
  }
}
