import createElement from '../../assets/lib/create-element.js';

export default class Carousel {
  #slides;
  #currentIndex = 0;
  #elem;

  constructor(slides) {
    this.#slides = slides;
    this.render();
  }

  render() {
    // Формируем общую структуру карусели
    const template = `
      <div class="carousel">
        <div class="carousel__inner"></div>
        <button class="carousel__arrow_left" style="display:none;"><</button>
        <button class="carousel__arrow_right">></button>
      </div>
    `;

    // Создаем DOM-элемент из шаблона
    this.#elem = createElement(template);

    // Заполняем слайды
    const inner = this.#elem.querySelector('.carousel__inner');
    this.#slides.forEach((slideData, index) => {
      const slideTemplate = `
        <div class="carousel__slide" data-index="${index}">
          <img class="carousel__img" src="../../assets/images/carousel/${slideData.image}" alt="${slideData.title}"/>
          <button class="carousel__button" data-slide-id="${slideData.id}">Купить</button>
        </div>
      `;

      // Создаем слайд и добавляем его внутрь контейнера слайдов
      const slideElem = createElement(slideTemplate);
      inner.appendChild(slideElem);

      // Настройка обработчика события на кнопку покупки
      const buyButton = slideElem.querySelector('.carousel__button');
      buyButton.addEventListener('click', () => {
        const customEvent = new CustomEvent('product-add', {
          detail: slideData.id,
          bubbles: true
        });
        buyButton.dispatchEvent(customEvent);
      });
    });

    // Добавляем обработчик стрелок
    const leftArrow = this.#elem.querySelector('.carousel__arrow_left');
    const rightArrow = this.#elem.querySelector('.carousel__arrow_right');

    leftArrow.addEventListener('click', () => this.prevSlide());
    rightArrow.addEventListener('click', () => this.nextSlide());

    // Проставляем начальные стили
    this.updateTransform();
    this.updateArrowsVisibility();
  }

  nextSlide() {
    if (this.#currentIndex >= this.#slides.length - 1) return;
    this.#currentIndex++;
    this.updateTransform();
    this.updateArrowsVisibility();
  }

  prevSlide() {
    if (this.#currentIndex <= 0) return;
    this.#currentIndex--;
    this.updateTransform();
    this.updateArrowsVisibility();
  }

  updateTransform() {
    const slideWidth = this.#elem.offsetWidth;
    const translateValue = -(this.#currentIndex * slideWidth);
    this.#elem.querySelector('.carousel__inner').style.transform = `translateX(${translateValue}px)`;
  }

  updateArrowsVisibility() {
    const leftArrow = this.#elem.querySelector('.carousel__arrow_left');
    const rightArrow = this.#elem.querySelector('.carousel__arrow_right');

    if (this.#currentIndex === 0) {
      leftArrow.style.display = 'none';
    } else {
      leftArrow.style.display = '';
    }

    if (this.#currentIndex === this.#slides.length - 1) {
      rightArrow.style.display = 'none';
    } else {
      rightArrow.style.display = '';
    }
  }

  get elem() {
    return this.#elem;
  }
}