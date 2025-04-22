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

    // Картинка продукта
    const img = document.createElement('img');
    img.classList.add('card__image');
    img.src = `/assets/images/products/${this.#product.image}`;
    img.alt = `${this.#product.name}`;
    card.append(img);

    // Название продукта
    const title = document.createElement('h3');
    title.classList.add('card__title');
    title.textContent = this.#product.name;
    card.append(title);

    // Цена продукта
    const price = document.createElement('p');
    price.classList.add('card__price');
    price.textContent = `€${this.#product.price.toFixed(2)}`;
    card.append(price);

    // Кнопка добавления в корзину
    const btn = document.createElement('button');
    btn.classList.add('card__button');
    btn.textContent = 'Add to Cart';
    btn.addEventListener('click', () => {
      const customEvent = new CustomEvent('product-add', {
        detail: this.#product.id,
        bubbles: true
      });
      card.dispatchEvent(customEvent);
    });
    card.append(btn);

    this.#elem = card;
  }

  get elem() {
    return this.#elem;
  }
}