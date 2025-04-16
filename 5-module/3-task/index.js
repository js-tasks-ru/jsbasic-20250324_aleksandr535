function initCarousel() {
  const carouselInner = document.querySelector('.carousel__inner');
  const slides = Array.from(document.querySelectorAll('.carousel__slide'));
  const arrowRight = document.querySelector('.carousel__arrow_right');
  const arrowLeft = document.querySelector('.carousel__arrow_left');

  arrowLeft.style.display = 'none';

  let currentSlideIndex = 0;
  // Определяем размер слайда, выраженный в пикселях, игнорируя единицы измерения и любые посторонние символы
  const slideWidth = parseInt(getComputedStyle(slides[0]).width.replace(/[^-\d\.]/g, ''));

  // Обработчик клика по правой стрелке
  arrowRight.addEventListener('click', () => {
    if (currentSlideIndex >= slides.length - 1) return; // Последний слайд достигнут

    currentSlideIndex++;
    carouselInner.style.transform = `translateX(${-currentSlideIndex * slideWidth}px)`;

    // Показываем стрелку назад
    arrowLeft.style.display = '';

    // Скрываем правую стрелку, если достигли последнего слайда
    if (currentSlideIndex === slides.length - 1) {
      arrowRight.style.display = 'none';
    }
  });

  // Обработчик клика по левой стрелке
  arrowLeft.addEventListener('click', () => {
    if (currentSlideIndex <= 0) return; // Первый слайд достигнут

    currentSlideIndex--;
    carouselInner.style.transform = `translateX(${-currentSlideIndex * slideWidth}px)`;

    // Показываем стрелку вперед
    arrowRight.style.display = '';

    // Скрываем левую стрелку, если вернулись к первому слайду
    if (currentSlideIndex === 0) {
      arrowLeft.style.display = 'none';
    }
  });
}
