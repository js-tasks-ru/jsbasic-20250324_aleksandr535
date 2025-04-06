function getMinMax(str) {
  let arr = str.split(' ');

  let numbers = arr
        .map(part => {
            const parsed = parseFloat(part);
            return isFinite(parsed) ? parsed : null;
        })
        .filter(Boolean);

    let minValue = Math.min(...numbers);
    let maxValue = Math.max(...numbers);

    return { min: minValue, max: maxValue };
}
