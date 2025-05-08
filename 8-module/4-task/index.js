import createElement from '../../assets/lib/create-element.js';
import escapeHtml from '../../assets/lib/escape-html.js';

import Modal from '../../7-module/2-task/index.js';

export default class Cart {
  cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;

    this.addEventListeners();
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

  renderProduct(product, count) {
    return createElement(`
    <div class="cart-product" data-product-id="${
      product.id
    }">
      <div class="cart-product__img">
        <img src="/assets/images/products/${product.image}" alt="product">
      </div>
      <div class="cart-product__info">
        <div class="cart-product__title">${escapeHtml(product.name)}</div>
        <div class="cart-product__price-wrap">
          <div class="cart-counter">
            <button type="button" class="cart-counter__button cart-counter__button_minus">
              <img src="/assets/images/icons/square-minus-icon.svg" alt="minus">
            </button>
            <span class="cart-counter__count">${count}</span>
            <button type="button" class="cart-counter__button cart-counter__button_plus">
              <img src="/assets/images/icons/square-plus-icon.svg" alt="plus">
            </button>
          </div>
          <div class="cart-product__price">€${product.price.toFixed(2)}</div>
        </div>
      </div>
    </div>`);
  }

  renderOrderForm() {
    return createElement(`<form class="cart-form">
      <h5 class="cart-form__title">Delivery</h5>
      <div class="cart-form__group cart-form__group_row">
        <input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Santa Claus">
        <input name="email" type="email" class="cart-form__input" placeholder="Email" required value="john@gmail.com">
        <input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+1234567">
      </div>
      <div class="cart-form__group">
        <input name="address" type="text" class="cart-form__input" placeholder="Address" required value="North, Lapland, Snow Home">
      </div>
      <div class="cart-buttons">
        <div class="cart-buttons__buttons btn-group">
          <div class="cart-buttons__info">
            <span class="cart-buttons__info-text">total</span>
            <span class="cart-buttons__info-price">€${this.getTotalPrice().toFixed(
              2
            )}</span>
          </div>
          <button type="submit" class="cart-buttons__button btn-group__button button">order</button>
        </div>
      </div>
    </form>`);
  }

  renderModal() {
    // Создаем новое модальное окно
    const modal = new Modal();
    modal.setTitle('Your order');
  
    // Создаем верстку корзины
    const modalBody = document.createElement('div');
  
    // Добавляем карточки товаров в модальное окно
    this.cartItems.forEach(item => {
      const productElement = this.renderProduct(item.product, item.count);
      modalBody.append(productElement);
    });
  
    // Добавляем форму заказа
    const orderForm = this.renderOrderForm();
    modalBody.append(orderForm);
  
    // Вставляем верстку в тело модального окна
    modal.setBody(modalBody);
  
    // Добавляем обработчики событий для кнопок +/-
    modalBody.addEventListener('click', (event) => {
      if (event.target.closest('.cart-counter__button_plus')) {
        const productId = event.target.closest('.cart-product').dataset.productId;
        this.updateProductCount(productId, 1);
      }
  
      if (event.target.closest('.cart-counter__button_minus')) {
        const productId = event.target.closest('.cart-product').dataset.productId;
        this.updateProductCount(productId, -1);
      }
    });
  
    // Добавляем обработчик события submit на форму
    modalBody.querySelector('.cart-form').addEventListener('submit', (event) => {
      event.preventDefault(); // Предотвращаем перезагрузку страницы
      this.onSubmit(event);
    });
  
    // Открываем модальное окно
    modal.open();
  }
  
  onProductUpdate(cartItem) {
    this.cartIcon.update(this); // Обновляем иконку корзины

    if (document.body.classList.contains('is-modal-open')) { // Проверяем, открыто ли модальное окно
        const productId = cartItem.product.id;
        const modalBody = document.querySelector('.modal__body-inner'); // Получаем корневой элемент тела модального окна

        // Обновляем количество товара в модальном окне
        let productCount = modalBody.querySelector(`[data-product-id="${productId}"] .cart-counter__count`);
        let productPrice = modalBody.querySelector(`[data-product-id="${productId}"] .cart-product__price`);
        let infoPrice = modalBody.querySelector(`.cart-buttons__info-price`);

        if (cartItem.count > 0) {
            productCount.innerHTML = cartItem.count; // Обновляем количество товара

            const totalPriceForProduct = (cartItem.product.price * cartItem.count).toFixed(2);
            productPrice.innerHTML = `€${totalPriceForProduct}`; // Обновляем цену товара

            const totalCartPrice = this.getTotalPrice().toFixed(2);
            infoPrice.innerHTML = `€${totalCartPrice}`; // Обновляем общую стоимость корзины
        } else {
            // Если товара больше нет, удаляем элемент из модального окна
            const productElement = modalBody.querySelector(`[data-product-id="${productId}"]`);
            if (productElement) {
                productElement.remove(); // Удаляем элемент из DOM
            }

            // Проверяем, остались ли другие товары в корзине
            const remainingItemsCount = this.cartItems.reduce((count, item) => count + item.count, 0);

            if (remainingItemsCount === 0) {
                // Если товаров больше нет, закрываем модальное окно
                const modal = document.querySelector('.modal');
                if (modal) {
                    document.body.classList.remove('is-modal-open');
                    modal.remove(); // Закрываем модальное окно
                }
            } else {
                // Если остались товары, просто обновляем интерфейс
                infoPrice.innerHTML = `€${this.getTotalPrice().toFixed(2)}`; // Обновляем общую стоимость корзины
            }
        }
    }
}
  
  async onSubmit(event) {
    const submitButton = event.target.querySelector('[type="submit"]');
    
    submitButton.classList.add('is-loading'); // Добавляем класс загрузки
  
    try {
      const formData = new FormData(event.target); // Создаем FormData из формы
  
      const response = await fetch('https://httpbin.org/post', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) { 
        const result = await response.json(); 
        
        // Заменяем заголовок на 'Success!'
        const modalTitle = document.querySelector('.modal__title');
        modalTitle.innerHTML = 'Success!';
  
        // Очищаем корзину
        this.cartItems.length = 0;
  
        // Заменяем содержимое тела модального окна на сообщение об успешном заказе
        const successMessage = `
          <div class="modal__body-inner">
            <p>
              Order successful! Your order is being cooked :) <br>
              We’ll notify you about delivery time shortly.<br>
              <img src="/assets/images/delivery.gif">
            </p>
          </div>`;
        
        document.querySelector('.modal__body-inner').innerHTML = successMessage;
        
      } else {
        console.error('Ошибка при отправке данных:', response.statusText);
      }
      
    } catch (error) {
      console.error('Ошибка:', error);
      
    } finally {
      submitButton.classList.remove('is-loading'); // Убираем класс загрузки после завершения запроса
    }
}

addEventListeners() {
  this.cartIcon.elem.onclick = () => this.renderModal();
}
}