import createElement from '../../assets/lib/create-element.js';

export default class RibbonMenu {
  constructor(categories) {
    this.categories = categories;
    this.elem = this.createRibbon();
    this.setupScrollHandlers(); // здесь ставим стрелки в правильное состояние
  }

  createRibbon() {
    const ribbon = createElement('<div class="ribbon"></div>');

    const ribbonInner = createElement('<div class="ribbon__inner"></div>');

    // Наполнение списка категорий
    this.categories.forEach(category => {
      const item = createElement(
        '<a href="#" class="ribbon__item" data-id="' + category.id + '">' +
        category.name +
        '</a>'
      );

      // Обработчик выбора категории
      item.addEventListener('click', event => {
        event.preventDefault(); // Предотвращаем стандартное поведение ссылки
        const selectEvent = new CustomEvent('ribbon-select', {
          detail: category.id,
          bubbles: true
        });
        ribbon.dispatchEvent(selectEvent);
      });

      ribbonInner.appendChild(item);
    });

    ribbon.appendChild(ribbonInner);

    // Добавляем стрелки для прокрутки
    const leftArrow = createElement('<button class="ribbon__arrow ribbon__arrow_left"><img src="/assets/images/icons/angle-icon.svg" alt="previous" /></button>');
    leftArrow.addEventListener('click', () => this.scrollLeft());

    const rightArrow = createElement('<button class="ribbon__arrow ribbon__arrow_right"><img src="/assets/images/icons/angle-icon.svg" alt="next" /></button>');
    rightArrow.addEventListener('click', () => this.scrollRight());

    ribbon.appendChild(leftArrow);
    ribbon.appendChild(rightArrow);

    return ribbon;
  }

  // Прокручивает ленту на 350px влево
  scrollLeft() {
    const ribbonInner = this.elem.querySelector('.ribbon__inner');
    ribbonInner.scrollBy(-350, 0);
  }

  // Прокручивает ленту на 350px вправо
  scrollRight() {
    const ribbonInner = this.elem.querySelector('.ribbon__inner');
    ribbonInner.scrollBy(350, 0);
  }

  // Устанавливает обработчики прокрутки и скрытия кнопок
  setupScrollHandlers() {
    const ribbonInner = this.elem.querySelector('.ribbon__inner');
    const leftArrow = this.elem.querySelector('.ribbon__arrow_left');
    const rightArrow = this.elem.querySelector('.ribbon__arrow_right');

    ribbonInner.addEventListener('scroll', () => {
      this.handleScrollStateChange(leftArrow, rightArrow, ribbonInner);
    });

    // Изначально проверяем состояние стрелок
    setTimeout(() => {
      this.handleScrollStateChange(leftArrow, rightArrow, ribbonInner);
    }, 0);
  }

  // Обновляет видимость стрелок прокрутки
  handleScrollStateChange(leftArrow, rightArrow, ribbonInner) {
    const scrollLeft = ribbonInner.scrollLeft;
    const scrollWidth = ribbonInner.scrollWidth;
    const clientWidth = ribbonInner.clientWidth;
    const scrollRight = scrollWidth - scrollLeft - clientWidth;

    // Показываем стрелку "Назад", если доступна прокрутка влево
    if (scrollLeft > 0) {
      leftArrow.classList.add('ribbon__arrow_visible');
    } else {
      leftArrow.classList.remove('ribbon__arrow_visible');
    }

    // Показываем стрелку "Вперед", если доступна прокрутка вправо
    if (scrollRight > 0) {
      rightArrow.classList.add('ribbon__arrow_visible');
    } else {
      rightArrow.classList.remove('ribbon__arrow_visible');
    }
  }
}