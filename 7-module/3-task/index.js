export default class StepSlider {
  constructor({ steps, value = 0 }) {
    if (!Number.isInteger(steps)) throw new Error("Steps must be an integer");
    if (!Number.isInteger(value)) throw new Error("Value must be an integer");
    if (value > steps || value < 0) throw new Error("Initial value out of range");

    this.config = { steps, value };
    this.renderDOM();
  }

  renderDOM() {
    // Создаем основную структуру с помощью innerHTML
    this.elem = document.createElement('div');
    this.elem.innerHTML = `
      <div class="slider">
        <div class="slider__thumb">
          <span class="slider__value">${this.config.value}</span>
        </div>
        <div class="slider__progress"></div>
        <div class="slider__steps">
          ${Array.from({ length: this.config.steps }).map((_, index) =>
            `<span class="${index === this.config.value ? 'slider__step-active' : ''}"></span>`
          ).join('')}
        </div>
      </div>
    `;

    // Сохраняем основной элемент
    this.elem = this.elem.firstElementChild;

    // Присоединение обработчиков событий
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