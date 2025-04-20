/**
 * Компонент, который реализует таблицу
 * с возможностью удаления строк
 *
 * Пример одного элемента, описывающего строку таблицы
 *
 *      {
 *          name: 'Ilia',
 *          age: 25,
 *          salary: '1000',
 *          city: 'Petrozavodsk'
 *      }
 *
 */
export default class UserTable {
  constructor(dataRows) {
      this.dataRows = dataRows || [];
      
      // Создание основной структуры таблицы
      const table = document.createElement('table');
      const thead = document.createElement('thead');
      const tbody = document.createElement('tbody');
  
      // Заголовок таблицы
      let rowHead = document.createElement('tr');
      ['Имя', 'Возраст', 'Зарплата', 'Город'].forEach(header => {
          let th = document.createElement('th');
          th.textContent = header;
          rowHead.append(th);
      });
      let buttonCell = document.createElement('th'); // Кнопка удаления
      rowHead.append(buttonCell);  
      thead.append(rowHead);
  
      // Тело таблицы
      for (const item of this.dataRows) {
          let rowBody = document.createElement('tr');
          
          Object.values(item).forEach(value => { // Заполняем ячейки значениями полей
              let cell = document.createElement('td');
              cell.textContent = value;
              rowBody.append(cell);
          });
          
          // Кнопка удаления
          let deleteButton = document.createElement('button');
          deleteButton.textContent = 'X';
          deleteButton.addEventListener('click', () => {
              rowBody.remove(); // Удаляем строку при нажатии кнопки
          });
          let delCell = document.createElement('td');
          delCell.append(deleteButton);
          rowBody.append(delCell);
          
          tbody.append(rowBody);
      }
  
      table.append(thead, tbody);
      this.elem = table; // Прямая ссылка на созданный элемент
  }
}
