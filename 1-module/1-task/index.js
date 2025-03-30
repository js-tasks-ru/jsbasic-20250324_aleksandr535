function factorial(n) {
  if ( n === 0 ) {
    n = 1;
  }
  let val = n;

  let i = 1;
  while ( i < n ) {
    val *= i;
    i++;
  }

  return val;
}
