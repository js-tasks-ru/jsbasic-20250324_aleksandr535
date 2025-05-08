import createElement from '../../assets/lib/create-element.js';

export default class CartIcon {
  constructor() {
    this.render();

    this.addEventListeners();
  }

  render() {
    this.elem = createElement('<div class="cart-icon"></div>');
  }

  update(cart) {
    if (!cart.isEmpty()) {
      this.elem.classList.add('cart-icon_visible');

      this.elem.innerHTML = `
        <div class="cart-icon__inner">
          <span class="cart-icon__count">${cart.getTotalCount()}</span>
          <span class="cart-icon__price">€${cart.getTotalPrice().toFixed(2)}</span>
        </div>`;

      this.updatePosition();

      this.elem.classList.add('shake');
      this.elem.addEventListener('transitionend', () => {
        this.elem.classList.remove('shake');
      }, {once: true});

    } else {
      this.elem.classList.remove('cart-icon_visible');
    }
  }

  addEventListeners() {
    document.addEventListener('scroll', () => this.updatePosition());
    window.addEventListener('resize', () => this.updatePosition());
  }

  updatePosition() {
    if (!this.elem.offsetHeight || !this.elem.offsetWidth) return;

    // Ширина окна
    const windowWidth = window.innerWidth;

    // Определим первую координату, от которой начинаем движение
    if (!this.initialTopCoord) {
        this.initialTopCoord = this.elem.getBoundingClientRect().top + window.pageYOffset;
    }

    // Мобильные устройства имеют другой режим позиционирования
    if (windowWidth <= 767) {
        this.elem.style.position = '';
        this.elem.style.top = '';
        this.elem.style.left = '';
        this.elem.style.zIndex = '';
        return;
    }

    // Координаты страницы
    const currentScroll = window.pageYOffset;

    // Проверяем, прокрутил ли пользователь страницу вниз
    if (currentScroll >= this.initialTopCoord) {
        // Устанавливаем фиксированное позиционирование
        const containerRight = document.querySelector('.container').getBoundingClientRect().right;
        
        // Вычисляем доступное пространство между правым краем контейнера и правым краем окна
        const availableSpace = windowWidth - containerRight - 10; // 10px отступ

        // Если доступного пространства недостаточно для иконки, смещаем её влево
        if (availableSpace < this.elem.offsetWidth) {
            Object.assign(this.elem.style, {
                position: 'fixed',
                top: '50px',
                zIndex: 1000,
                right: '10px',
                left: `${windowWidth - this.elem.offsetWidth - 25}px`, // Смещение влево на 10px
            });
        } else {
            Object.assign(this.elem.style, {
                position: 'fixed',
                top: '50px',
                zIndex: 1000,
                right: '10px',
                left: `${containerRight + 20}px`, // Позиция относительно контейнера
            });
        }
    } else {
        // Вернули иконку назад к исходному положению
        Object.assign(this.elem.style, {
            position: '',
            top: '',
            left: '',
            zIndex: '',
        });
    }
}
}
