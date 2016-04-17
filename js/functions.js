define('functions',['variables','yandex'],function(variables,yandex){

	return {
		// Функция закрытия формы
		closeForm: function () {
			// Скрываем форму
			variables.form.style.display = "none";

			// Очищаем координаты
			variables.form.dataset.cordX = "";
			variables.form.dataset.cordY = "";

			// Очищаем заголовок формы
			variables.formTitle.innerText = "";	
		},
		// Обнуление значение поле формы
		clearForm: function () {

				// Очищаем имя автора
				variables.formName.value = "";

				// Очищаем место отзыва
				variables.formPlace.value = "";

				// Очищаем текст отзыва
				variables.formReview.value = ""; 
		},
		// Вывод всех отзывов по адресу в форме
		getReviewsAddress: function(address) {
			getData = {"op": "get", "address": address}
			var xhr = new XMLHttpRequest();
			xhr.open('POST', 'http://localhost:3000', true);
			getData = JSON.stringify(getData);
			xhr.send(getData);

			xhr.onreadystatechange = function() {
					if (xhr.readyState != 4) return;

					// Передаем ответ сервера в шаблонизатора
					allReviews = JSON.parse(xhr.response);
					template = variables.templateFn({list: allReviews});
					variables.reviewsBlock.innerHTML = template;
			};
		},
		// Инициализация кластера
		initClusterer: function() {

			var customItemContentLayout = ymaps.templateLayoutFactory.createClass(
				'<h2 class=ballon_header>{{ properties.balloonContentHeader|raw }}</h2>' +
				'<div class=ballon_body>{{ properties.balloonContentBody|raw }}</div>' +
				'<div class=ballon_footer>{{ properties.balloonContentFooter|raw }}</div>'
			);

			var clusterer = new ymaps.Clusterer({
				preset: 'islands#invertedVioletClusterIcons',
				groupByCoordinates: false,
				clusterBalloonContentLayout: 'cluster#balloonCarousel',
				clusterBalloonItemContentLayout: customItemContentLayout,
				clusterDisableClickZoom: true,
				clusterHideIconOnBalloonOpen: false,
				geoObjectHideIconOnBalloonOpen: false
			});

			return clusterer;
		},
		// Вывод всех меток полученных с сервера
		renderMarks: function(map,clusterer) {
			// Получение данных с сервера
			var allData = {"op":"all"};
			allData = JSON.stringify(allData);

			var xhr = new XMLHttpRequest();
			xhr.open('POST', 'http://localhost:3000', true);
			xhr.send(allData);

			xhr.onreadystatechange = function() {
			if (xhr.readyState != 4) return;
			allMarks = JSON.parse(xhr.response);

			var geoObjects = [];

			// Выводим все метки
			for (key in allMarks) {
				allMarks[key].forEach(function(item){
					var cordX = item.coords.x;
					var cordY = item.coords.y;

					// Формируем описание для карусели кластера
					var placemark = new ymaps.Placemark([cordX, cordY], {
						balloonContentHeader: item.name,
						balloonContentBody: item.text,
						balloonContentFooter: new Date(item.date).toLocaleString()
					});

					geoObjects.push(placemark);
				});
			}

			clusterer.add(geoObjects);
			map.geoObjects.add(clusterer);

			}
		},
		// Обработка клика по карте
		showReviewForm: function(event) {
			var coords = event.get('coords');
			variables.form.style.display = "block";

			// Координаты клика на экране
			var pagePixels = event.get('pagePixels');
			variables.form.style.left = pagePixels[0]+"px";
			variables.form.style.top = pagePixels[1]+"px";

			// Координаты клика по карте
			variables.form.dataset.cordX = coords[0];
			variables.form.dataset.cordY = coords[1];

			ymaps.geocode(coords).then(function (res) {
				var firstGeoObject = res.geoObjects.get(0);
				var address = firstGeoObject.properties.get('name')+", "+firstGeoObject.properties.get('description');

				// Устанавливаем заголовок окна формы            
				variables.formTitle.innerText = address;

				// Очищаем поля формы
				require('functions').clearForm();

				// Выводим отзывы по текущему адресу
				require('functions').getReviewsAddress(address);
			});
		},
		// Обратка кнопки Добавить в форме нового отзыва
		addNewReview: function(clusterer) {
			// Данные для отправки на сервер
			var cordX = variables.form.dataset.cordX;
			var cordY = variables.form.dataset.cordY;
			var address = variables.formTitle.innerText;
			var name = variables.formName.value;
			var place = variables.formPlace.value;
			var review = variables.formReview.value;
			var date = new Date();

			// Объект для отправки на сервер
			var addData = {"op": "add",
					"review": {
							"coords": {"x": cordX, "y": cordY},
							"address": address,
							"name": name,
							"place": place,
							"text": review,
							"date": date}
			};

			addData = JSON.stringify(addData);

			// Передача данных на сервер
			var xhr = new XMLHttpRequest();
			xhr.open('POST', 'http://localhost:3000', true);
			xhr.send(addData);

			// Добавляем метку на карту и описание для кластера
			var placemark = new ymaps.Placemark([cordX, cordY], {
				balloonContentHeader: name,
				balloonContentBody: review,
				balloonContentFooter: new Date(date).toLocaleString()
			});

			clusterer.add(placemark);

			// Очищаем значения полей формы
			require('functions').clearForm();

			// Получаем все отзывы по данному адресу 
			require('functions').getReviewsAddress(address);
		}
	}
});