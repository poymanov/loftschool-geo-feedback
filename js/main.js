requirejs.config({
  paths: {
    yandex: 'http://api-maps.yandex.ru/2.1/?lang=ru_RU',
    handlebars: 'https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.5/handlebars.min'
  }
});

define(['handlebars','yandex','variables','functions'],function(handlebars,yandex,variables,functions){

	ymaps.ready(init);

	function init(){ 
		var myMap = new ymaps.Map("map", {
				center: [55.76, 37.64],
				zoom: 17
		}); 

		// Определение кластера    
		var clusterer = functions.initClusterer();
			
		// Подключение handlebars helper
		handlebars.registerHelper('formatDate', function(ts) {
			return new Date(ts).toLocaleString();
		});

		// Вывод всех меток полученных с сервера
		functions.renderMarks(myMap,clusterer);

		// Обработка клика по карте
		myMap.events.add('click', function (e) {
			functions.showReviewForm(e);
		});
		
		// Обработка клика по кнопке Добавить
		variables.addForm.addEventListener('click',function(){
			functions.addNewReview(clusterer);
		});

		// Обработка закрытия формы
		variables.closeButton.addEventListener('click',function(e){
				e.preventDefault();
				functions.closeForm();
		});
}
});