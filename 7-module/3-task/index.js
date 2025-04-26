export default class StepSlider {
  constructor({ steps, value = 0 }) {
    if (!Number.isInteger(steps)) throw new Error("Steps must be an integer");
    if (!Number.isInteger(value)) throw new Error("Value must be an integer");
    if (value > steps || value < 0) throw new Error("Initial value out of range");

    this.config = { steps, value };
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

    // Рисуем шаги (markers), количество шагов совпадает с конфигом
    for (let i = 0; i < this.config.steps; i++) {
      const stepMarker = document.createElement('span');
      if (i === this.config.value) stepMarker.classList.add('slider__step-active');
      stepsContainer.appendChild(stepMarker);
    }

    // Собираем элементы
    sliderRoot.append(thumb, progress, stepsContainer);
    this.elem = sliderRoot;

    // Привязываем обработчик событий
    this.attachEventListeners();
  }

  attachEventListeners() {
    this.elem.addEventListener('click', (event) => {
      const rect = this.elem.getBoundingClientRect();
      const xClickPos = event.clientX - rect.left;
      const segmentSize = this.elem.offsetWidth / this.config.steps;
      const leftRelative = xClickPos / this.elem.offsetWidth;

      // Получаем приблизительный шаг
      const segments = this.config.steps - 1;
      const approximateValue = leftRelative * segments;
      const targetStep = Math.round(approximateValue);

      // Обновляем значение
      this.updateState(targetStep);
    });
  }

  updateState(newValue) {
    if (newValue !== this.config.value) {
      this.config.value = newValue;

      // Обновляем UI
      const thumb = this.elem.querySelector('.slider__thumb');
      const progress = this.elem.querySelector('.slider__progress');
      const steps = this.elem.querySelectorAll('.slider__steps span');

      // Обновляем цифру на ползунке
      thumb.querySelector('.slider__value').textContent = newValue.toString();

      // Рассчитываем положение ползунка и длину закрашенного участка
      const segments = this.config.steps - 1;
      const percentPosition = (newValue / segments) * 100;

      // Задаем позицию ползунка и ширину закрашенной области
      thumb.style.left = `${percentPosition}%`;
      progress.style.width = `${percentPosition}%`;

      // Включаем активный шаг
      steps.forEach((el, idx) => el.classList.toggle('slider__step-active', idx === newValue));

      // Генерируем событие
      this.elem.dispatchEvent(
        new CustomEvent('slider-change', {
          detail: newValue,
          bubbles: true
        })
      );
    }
  }
}