export default class StepSlider {
  constructor({ steps, value = 0 }) {
    if (!Number.isInteger(steps)) throw new Error("Steps must be an integer");
    if (!Number.isInteger(value)) throw new Error("Initial value out of range");
    if (value > steps || value < 0) throw new Error("Initial value is invalid");

    this.config = { steps, value };
    this.segments = steps - 1;
    this.renderDOM();
  }

  renderDOM() {
    const sliderRoot = document.createElement('div');
    sliderRoot.classList.add('slider');

    // Ползунок с цифрой
    const thumb = document.createElement('div');
    thumb.classList.add('slider__thumb');
    const valueLabel = document.createElement('span');
    valueLabel.classList.add('slider__value');
    valueLabel.textContent = this.config.value.toString();
    thumb.appendChild(valueLabel);

    // Закрашиваемая область
    const progress = document.createElement('div');
    progress.classList.add('slider__progress');

    // Контейнер шагов
    const stepsContainer = document.createElement('div');
    stepsContainer.classList.add('slider__steps');

    // Рисуем шаги
    for (let i = 0; i < this.config.steps; i++) {
      const stepMarker = document.createElement('span');
      if (i === this.config.value) stepMarker.classList.add('slider__step-active');
      stepsContainer.appendChild(stepMarker);
    }

    // Собираем элементы
    sliderRoot.append(thumb, progress, stepsContainer);
    this.elem = sliderRoot;

    // Привязываем обработчики событий
    this.attachEventListeners();
  }

  attachEventListeners() {
    const thumb = this.elem.querySelector('.slider__thumb');

    // Отключаем стандартный D&D
    thumb.ondragstart = () => false;

    // Начало перетаскивания
    thumb.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      this.elem.classList.add('slider_dragging');

      // Начало перетаскивания
      document.addEventListener('pointermove', this.onPointerMove.bind(this));
      document.addEventListener('pointerup', this.onPointerUp.bind(this));
    });

    // Щёлкнули по слайдеру (не по ползунку)
    this.elem.addEventListener('click', (event) => {
      event.preventDefault();
      const leftRelative = (event.clientX - this.elem.getBoundingClientRect().left) / this.elem.offsetWidth;
      const newValue = Math.round(leftRelative * this.segments);
      this.setValue(newValue);
      this.elem.dispatchEvent(new CustomEvent('slider-change', {
        detail: this.config.value,
        bubbles: true
      }));
    });
  }

  onPointerMove(event) {
    event.preventDefault();

    const rect = this.elem.getBoundingClientRect();
    const xClickPos = event.clientX - rect.left;
    const leftRelative = xClickPos / this.elem.offsetWidth;

    // Ограничиваем ползунок в рамках слайдера
    const boundedRelative = Math.min(Math.max(leftRelative, 0), 1);

    // Позволяем ползунку свободно перемещаться в режиме перетаскивания
    const thumb = this.elem.querySelector('.slider__thumb');
    const progress = this.elem.querySelector('.slider__progress');

    // Положение ползунка и закрашиваемой области
    const percentPosition = boundedRelative * 100;
    thumb.style.left = `${percentPosition}%`;
    progress.style.width = `${percentPosition}%`;

    // Текущее приближённое значение (без округления)
    const approximateValue = boundedRelative * this.segments;
    this.config.value = Math.round(approximateValue);

    // Обновляем цифровое значение на ползунке
    thumb.querySelector('.slider__value').textContent = this.config.value.toString();

    // Обновляем статус шагов
    const steps = this.elem.querySelectorAll('.slider__steps span');
    steps.forEach((el, idx) => el.classList.toggle('slider__step-active', idx === this.config.value));

    // Генерируем событие перемещения
    this.elem.dispatchEvent(new CustomEvent('slider-move', {
      detail: this.config.value,
      bubbles: true
    }));
  }

  onPointerUp(event) {
    event.preventDefault();

    // Получаем последнюю позицию
    const rect = this.elem.getBoundingClientRect();
    const xClickPos = event.clientX - rect.left;
    const leftRelative = xClickPos / this.elem.offsetWidth;

    // Переходим к ближайшему шагу
    const approximateValue = leftRelative * this.segments;
    const newValue = Math.round(approximateValue);

    // Обновляем состояние
    this.setValue(newValue);

    // Убираем обработчики движения и завершения
    document.removeEventListener('pointermove', this.onPointerMove.bind(this));
    document.removeEventListener('pointerup', this.onPointerUp.bind(this));

    // Возвращаем класс в исходное состояние
    this.elem.classList.remove('slider_dragging');

    // Генерируем событие фиксации
    this.elem.dispatchEvent(new CustomEvent('slider-change', {
      detail: this.config.value,
      bubbles: true
    }));
  }

  setValue(newValue) {
    if (newValue !== this.config.value) {
      this.config.value = newValue;

      // Обновляем UI
      const thumb = this.elem.querySelector('.slider__thumb');
      const progress = this.elem.querySelector('.slider__progress');
      const steps = this.elem.querySelectorAll('.slider__steps span');

      // Пересчитываем положение ползунка
      const percentPosition = (newValue / this.segments) * 100;

      // Зафиксированное положение ползунка и ширина закрашиваемой области
      thumb.style.left = `${percentPosition}%`;
      progress.style.width = `${percentPosition}%`;

      // Выбираем активный шаг
      steps.forEach((el, idx) => el.classList.toggle('slider__step-active', idx === newValue));

      // Обновляем текст на ползунке
      thumb.querySelector('.slider__value').textContent = newValue.toString();
    }
  }
}