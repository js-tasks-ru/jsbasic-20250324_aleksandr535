import createElement from '../../assets/lib/create-element.js';

export default class Modal {
    constructor() {
        this.modalElement = null;
        this.isOpen = false;
        this.titleBuffer = ''; // Буфер для временного хранения заголовка
        this.bodyBuffer = null; // Буфер для временного хранения тела
    }

    open() {
        if (!this.isOpen) {
            const modalHtml = `
                <div class="modal">
                    <div class="modal__overlay"></div>
                    <div class="modal__inner">
                        <div class="modal__header">
                            <button type="button" class="modal__close">
                                <img src="/assets/images/icons/cross-icon.svg" alt="close-icon" />
                            </button>
                            <h3 class="modal__title"></h3>
                        </div>
                        <div class="modal__body">
                            <div class="modal__body-inner"></div>
                        </div>
                    </div>
                </div>
            `;

            this.modalElement = createElement(modalHtml);
            document.body.appendChild(this.modalElement);
            document.body.classList.add("is-modal-open");

            this._applyBuffers(); // Применяем сохранённые значения из буферов

            this._addEventListeners();
            this.isOpen = true;
        }
    }
    // Вынес проверку наличия класса is-modal-open в отдельную функцию
    _isModalOpen() {
        return (
            this.modalElement &&
            document.body.contains(this.modalElement) &&
            document.body.classList.contains("is-modal-open")
        );
    }

    close() {
        if (this._isModalOpen()) {
            document.body.removeChild(this.modalElement);
            document.body.classList.remove("is-modal-open");
            this._removeEventListeners();
            this.isOpen = false;
        }
    }

    setTitle(title) {
        this.titleBuffer = title; // Сохраняем заголовок в буфер
        if (this.isOpen) {
            this._updateTitle(); // Если окно открыто, применяем немедленно
        }
    }

    setBody(node) {
        this.tempBodyNode = node; // Переименовал переменную tempBodyNode для улучшения понимания её назначения
        if (this.isOpen) {
            this._updateBody(); // Если окно открыто, применяем немедленно
        }
    }

    _updateTitle() {
        if (this.modalElement) {
            const titleElement = this.modalElement.querySelector('.modal__title');
            if (titleElement) {
                titleElement.textContent = this.titleBuffer || '';
            }
        }
    }

    _updateBody() {
        if (this.modalElement) {
            const bodyInnerElement = this.modalElement.querySelector('.modal__body-inner');
            if (bodyInnerElement) {
                bodyInnerElement.innerHTML = ''; // Упрощено удаление содержимого элемента

                if (this.tempBodyNode instanceof Node) {
                    bodyInnerElement.append(this.tempBodyNode); // Используем append без cloneNode()
                } else if (typeof this.tempBodyNode === 'string') {
                    bodyInnerElement.innerHTML = this.tempBodyNode;
                }
            }
        }
    }

    _applyBuffers() {
        if (this.modalElement) {
            this._updateTitle(); // Применение заголовка
            this._updateBody(); // Применение тела
        }
    }

    _addEventListeners() {
        const closeButton = this.modalElement.querySelector('.modal__close');
        closeButton.addEventListener('click', () => this.close());

        document.addEventListener('keydown', (event) => {
            if (event.code === 'Escape') {
                this.close();
            }
        });
    }

    _removeEventListeners() {
        const closeButton = this.modalElement.querySelector('.modal__close');
        closeButton.removeEventListener('click', () => this.close());

        document.removeEventListener('keydown', (event) => {
            if (event.code === 'Escape') {
                this.close();
            }
        });
    }
}