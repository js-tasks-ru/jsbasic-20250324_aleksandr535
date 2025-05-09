import createElement from '../../assets/lib/create-element.js';
import ProductCard from '../../6-module/2-task/index.js';

export default class ProductGrid {
  constructor(products) {
    this.products = products;
    this.filters = {};

    // Генерация HTML-кода сетки товаров
    this.elem = createElement(`
      <div class="products-grid">
        <div class="products-grid__inner"></div>
      </div>
    `);

    // Рендер всех товаров при создании компонента
    this.renderProducts(this.products);
  }

  // Метод обновления фильтров
  updateFilter(newFilters) {
    Object.assign(this.filters, newFilters); // объединение старых и новых фильтров
    let filteredProducts = this.filterProducts(); // получение отфильтрованных товаров
    this.renderProducts(filteredProducts); // повторный рендер списка товаров
  }

  // Функция фильтрации товаров
  filterProducts() {
    return this.products.filter((product) => {
      // Проверка на отсутствие орехов (если активирован соответствующий фильтр)
      if (this.filters.noNuts && product.nuts) return false;

      // Проверка на исключительно вегетарианские блюда
      if (this.filters.vegeterianOnly && !product.vegeterian) return false;

      // Проверка на максимальный уровень остроты
      if (this.filters.maxSpiciness !== undefined && product.spiciness > this.filters.maxSpiciness) return false;

      // Проверка соответствия конкретной категории
      if (this.filters.category && product.category !== this.filters.category) return false;

      return true; // Товар прошел проверку всех фильтров
    });
  }

  // Рендеринг товаров в сетке
  renderProducts(filteredProducts) {
    const innerDiv = this.elem.querySelector(".products-grid__inner");
    innerDiv.innerHTML = ""; // очистка содержимого контейнера

    // Генерируем карточки товаров
    for (const product of filteredProducts) {
      const productCard = new ProductCard(product).elem;
      innerDiv.appendChild(productCard);
    }
  }
}
