export default class ProductCard {
  #product;
  #elem;

  constructor(product) {
    this.#product = product;
    this.render();
  }

  render() {
    const card = document.createElement('div');
    card.classList.add('card');

    // Верхний блок карточки (для изображения и цены)
    const topSection = document.createElement('div');
    topSection.classList.add('card__top');

    // Картинка продукта
    const img = document.createElement('img');
    img.classList.add('card__image');
    img.src = `/assets/images/products/${this.#product.image}`;
    img.alt = `${this.#product.name}`;
    topSection.appendChild(img);

    // Блок с ценой
    const priceBlock = document.createElement('span');
    priceBlock.classList.add('card__price');
    priceBlock.textContent = `€${this.#product.price.toFixed(2)}`;
    topSection.appendChild(priceBlock);

    // Нижний блок карточки (для названия и кнопки)
    const bodySection = document.createElement('div');
    bodySection.classList.add('card__body');

    // Название продукта
    const title = document.createElement('h3');
    title.classList.add('card__title');
    title.textContent = this.#product.name;
    bodySection.appendChild(title);

    // Кнопка добавления в корзину
    const addButton = document.createElement('button');
    addButton.classList.add('card__button');

    // Создаем иконку и добавляем её в кнопку
    const icon = document.createElement('img');
    icon.src = '/assets/images/icons/plus-icon.svg';
    icon.alt = 'icon';
    addButton.appendChild(icon);

    // Устанавливаем обработчик события клика
    addButton.addEventListener('click', () => {
      const event = new CustomEvent('product-add', {
        detail: this.#product.id,
        bubbles: true
      });
      card.dispatchEvent(event);
    });

    // Добавляем кнопку в тело карточки
    bodySection.appendChild(addButton);

    // Собираем всё вместе
    card.append(topSection, bodySection);
    this.#elem = card;
  }

  get elem() {
    return this.#elem;
  }
}