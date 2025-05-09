export default class Cart {
  cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;
  }

  addProduct(product) {
    if (!product) return; // Безопасность: пропускаем операцию, если товар не передан

    // Проверяем, есть ли уже аналогичный товар в корзине
    const existingItem = this.cartItems.find(item => item.product.id === product.id);

    if (existingItem) {
      // Если товар уже есть, увеличиваем его количество
      existingItem.count++;
    } else {
      // Если товара еще нет, добавляем его с количеством 1
      this.cartItems.push({ product, count: 1 });
    }

    // Сообщаем иконке корзины о произошедшем изменении
    this.onProductUpdate(existingItem || { product, count: 1 });
  }

  updateProductCount(productId, amount) {
    // Найти соответствующий товар в корзине
    const cartItem = this.cartItems.find(item => item.product.id === productId);

    if (!cartItem) return; // Выход, если товар не найден

    // Обновляем количество товара
    cartItem.count += amount;

    // Удаляем товар из корзины, если его количество достигло нуля
    if (cartItem.count <= 0) {
      this.cartItems.splice(this.cartItems.indexOf(cartItem), 1);
    }

    // Информируем иконку корзины о произошедших изменениях
    this.onProductUpdate(cartItem);
  }

  isEmpty() {
    //Метод для проверки пустоты корзины
    return this.cartItems.length === 0;
  }

  getTotalCount() {
    //Метод для подсчета общего количества товаров в корзине
    return this.cartItems.reduce((sum, item) => sum + item.count, 0);
  }

  getTotalPrice() {
    return this.cartItems.reduce((sum, item) => sum + item.product.price * item.count, 0);
  }

  onProductUpdate(cartItem) {
    // Передаем текущее состояние корзины в компонент иконки
    this.cartIcon.update(this);
  }
}

