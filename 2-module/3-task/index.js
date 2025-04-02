let calculator = {
  read() {
    this.a = null; //+prompt('Введите первое число:', '');
    this.b = null; //+prompt('Введите второе число:', '');
  },
  sum() {
    return this.a + this.b;
  },
  mul() {
    return this.a * this.b;
  }
};

// НЕ УДАЛЯТЬ СТРОКУ, НУЖНА ДЛЯ ПРОВЕРКИ
window.calculator = calculator; // делает ваш калькулятор доступным глобально
