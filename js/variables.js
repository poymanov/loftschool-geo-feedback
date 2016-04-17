define('variables',['handlebars','yandex'],function(handlebars,yandex){

	// Невозвращаемые переменные

	// Шаблон отзывов в окне нового отзыва
	var source = document.getElementById('reviews-list').innerHTML;

	return {
		// Форма нового отзыва 
		form: document.querySelector('.new-review'),
		// Заголовок формы
		formTitle: document.querySelector('.new-review__header-title'),
		// Заголовок формы
		formTitle: document.querySelector('.new-review__header-title'),
		// Имя автора
		formName: document.querySelector('.new-review input[name=name]'),
		// Место отзывы
		formPlace: document.querySelector('.new-review input[name=place]'),
		// Текст отзыва
		formReview: document.querySelector('.new-review textarea[name=text]'),
		// Кнопка "Добавить"
		addForm: document.querySelector('.new-review__form-link'),
		// Кнопка "Закрыть"
		closeButton: document.querySelector('.new-review__header-close'),
		// Область в форме для вывода списка отзывов
		reviewsBlock: document.querySelector('.new-review__wrapper'),
		// Скомпилированный шаблон handlebars
		templateFn: handlebars.compile(source)
	}
});