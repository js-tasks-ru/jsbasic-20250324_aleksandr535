function sumSalary(salaries) {
  let totalSum = 0;

    for (let key in salaries) {
        if (typeof salaries[key] === 'number' && 
            !isNaN(salaries[key]) && 
            isFinite(salaries[key])) {
                totalSum += salaries[key];
        }
    }

    return totalSum;
}
