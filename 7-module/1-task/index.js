import createElement from '../../assets/lib/create-element.js';

export default class RibbonMenu {
  constructor(categories) {
    this.categories = categories;
    this.elem = this.createRibbon();
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
    const leftArrow = createElement('<button class="ribbon__arrow ribbon__arrow_left"><img src="/assets/images/icons/angle-left-icon.svg" alt="previous" /></button>');
    leftArrow.addEventListener('click', () => this.scrollLeft());

    const rightArrow = createElement('<button class="ribbon__arrow ribbon__arrow_right"><img src="/assets/images/icons/angle-icon.svg" alt="next" /></button>');
    rightArrow.addEventListener('click', () => this.scrollRight());

    ribbon.appendChild(leftArrow);
    ribbon.appendChild(rightArrow);

    return ribbon;
  }

  //Прокручивает ленту на 350px влево
  scrollLeft() {
    const ribbonInner = this.elem.querySelector('.ribbon__inner');
    ribbonInner.scrollBy(-350, 0);
  }

  //Прокручивает ленту на 350px вправо
  scrollRight() {
    const ribbonInner = this.elem.querySelector('.ribbon__inner');
    ribbonInner.scrollBy(350, 0);
  }

  selectCategory(link) {
    // Удаляем активность у предыдущих элементов
    const activeItem = this.elem.querySelector('.ribbon__item_active');
    if (activeItem) {
      activeItem.classList.remove('ribbon__item_active');
    }

    // Активируем новую категорию
    link.classList.add('ribbon__item_active');

    // Генерируем событие выбора категории
    const selectedCategoryID = link.dataset.id;
    const event = new CustomEvent('ribbon-select', {
      detail: selectedCategoryID,
      bubbles: true
    });
    this.elem.dispatchEvent(event);
  }

  //Устанавливает обработчики прокрутки и скрытия кнопок
  setupScrollHandlers() {
    const ribbonInner = this.elem.querySelector('.ribbon__inner');
    const leftArrow = this.elem.querySelector('.ribbon__arrow_left');
    const rightArrow = this.elem.querySelector('.ribbon__arrow_right');

    ribbonInner.addEventListener('scroll', () => {
      this.handleScrollStateChange(leftArrow, rightArrow, ribbonInner);
    });

    // Сразу проверяем положение прокрутки
    this.handleScrollStateChange(leftArrow, rightArrow, ribbonInner);
  }

  /**
   * Проверяет текущее состояние прокрутки и управляет видимостью стрелок
   *
   * @param {HTMLElement} leftArrow Кнопка прокрутки влево
   * @param {HTMLElement} rightArrow Кнопка прокрутки вправо
   * @param {HTMLElement} ribbonInner Внутренняя лента меню
   */
  handleScrollStateChange(leftArrow, rightArrow, ribbonInner) {
    const scrollLeft = ribbonInner.scrollLeft;
    const scrollWidth = ribbonInner.scrollWidth;
    const clientWidth = ribbonInner.clientWidth;
    const scrollRight = scrollWidth - scrollLeft - clientWidth;

    // Скрыть стрелку назад, если находимся в самом начале
    if (scrollLeft > 0 && !leftArrow.classList.contains('ribbon__arrow_visible')) {
      leftArrow.classList.add('ribbon__arrow_visible');
    } else if (scrollLeft === 0 && leftArrow.classList.contains('ribbon__arrow_visible')) {
      leftArrow.classList.remove('ribbon__arrow_visible');
    }

    // Скрыть стрелку вперёд, если дошли до конца ленты
    if (scrollRight < 1 && rightArrow.classList.contains('ribbon__arrow_visible')) {
      rightArrow.classList.remove('ribbon__arrow_visible');
    } else if (scrollRight > 0 && !rightArrow.classList.contains('ribbon__arrow_visible')) {
      rightArrow.classList.add('ribbon__arrow_visible');
    }
  }
}