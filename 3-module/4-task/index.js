function showSalary(users, age) {
  let validUsers = users.filter(user => user.age <= age);

  let result = validUsers.map(user => `${user.name}, ${user.balance}`).join('\n');

  return result;
}
