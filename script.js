ymaps.ready(init);


function init(){ 
    var myMap = new ymaps.Map("map", {
        center: [55.76, 37.64],
        zoom: 17
    }); 

    var clusterer = new ymaps.Clusterer({
      preset: 'islands#invertedVioletClusterIcons',
      groupByCoordinates: false,
      clusterDisableClickZoom: true,
      clusterHideIconOnBalloonOpen: false,
      geoObjectHideIconOnBalloonOpen: false
    });
    
    renderMarks();

    // Подключение handlebars helper

    Handlebars.registerHelper('formatDate', function(ts) {
    	return new Date(ts).toLocaleString();
		});

    // Форма нового отзыва    
    var form = document.querySelector('.new-review');

    // Заголовок формы
    var formTitle = document.querySelector('.new-review__header-title');

    // Имя автора
    var formName = document.querySelector('.new-review input[name=name]');

    // Место отзывы
    var formPlace = document.querySelector('.new-review input[name=place]');

    // Текст отзыва
    var formReview = document.querySelector('.new-review textarea[name=text]');

    // Кнопка "Добавить"
    var addForm = document.querySelector('.new-review__form-link');

    // Кнопка "Закрыть"
    var closeButton = document.querySelector('.new-review__header-close');

    // Шаблон отзывов в окне нового отзыва
    var source = document.getElementById('reviews-list').innerHTML;

    // Скомпилированный шаблон
    var templateFn = Handlebars.compile(source);

    // Область в форме для вывода списка отзывов
    var reviewsBlock = document.querySelector('.new-review__wrapper');

    // Процедуры закрытия формы
    function closeForm() {
    	// Скрываем форму
    	form.style.display = "none";

    	// Очищаем координаты
    	form.dataset.cordX = "";
    	form.dataset.cordY = "";

    	// Очищаем заголовок формы
    	formTitle.innerText = "";

    	// Очищаем имя автора
    	formName.value = "";

    	// Очищаем место отзыва
    	formPlace.value = "";

    	// Очищаем текст отзыва
    	formReview.value = "";    	
    }

    // Вывод всех меток полученных с сервера
    function renderMarks(){

    	// Получение данных с сервера
    	allData = {"op":"all"};
    	allData = JSON.stringify(allData);

    	var xhr = new XMLHttpRequest();
      xhr.open('POST', 'http://localhost:3000', true);
      xhr.send(allData);

      xhr.onreadystatechange = function() {
    	if (xhr.readyState != 4) return;
    	allMarks = JSON.parse(xhr.response);

    	// Удаляем все метки

    	var geoObjects = [];

    	// Выводим все метки
    	for (key in allMarks) {
				allMarks[key].forEach(function(item){
					var cordX = item.coords.x;
					var cordY = item.coords.y;
					geoObjects.push(new ymaps.Placemark([cordX, cordY]));
				});
			}

			clusterer.add(geoObjects);
			myMap.geoObjects.add(clusterer);

      }
    }

    // Вывод всех отзывов по адресу в форме
    function getReviewsAddress(address) {
  	  getData = {"op": "get", "address": address}
      var xhr = new XMLHttpRequest();
      xhr.open('POST', 'http://localhost:3000', true);
      getData = JSON.stringify(getData);
      xhr.send(getData);

      xhr.onreadystatechange = function() {
          if (xhr.readyState != 4) return;

          // Передаем ответ сервера в шаблонизатора
          allReviews = JSON.parse(xhr.response);
          template = templateFn({list: allReviews});
					reviewsBlock.innerHTML = template;
      };
    }

    // Обработка клика по карте
    myMap.events.add('click', function (e) {
        //При клике на карте открываем форму добавления нового отзыва
        var coords = e.get('coords');
        form.style.display = "block";

        // Координаты клика на экране
        var pagePixels = e.get('pagePixels');
        form.style.left = pagePixels[0]+"px";
        form.style.top = pagePixels[1]+"px";

        // Координаты клика по карте
        form.dataset.cordX = coords[0];
        form.dataset.cordY = coords[1];

        ymaps.geocode(coords).then(function (res) {
          var firstGeoObject = res.geoObjects.get(0);
          var address = firstGeoObject.properties.get('name')+", "+firstGeoObject.properties.get('description');

          // Устанавливаем заголовок окна формы            
          formTitle.innerText = address;

          // Выводим отзывы по текущему адресу
      		getReviewsAddress(address);
        });
    });
    
    // Обработка клика по кнопке Добавить
    addForm.addEventListener('click',function(){
        // Данные для отправки на сервер
        var cordX = form.dataset.cordX;
        var cordY = form.dataset.cordY;
        var address = formTitle.innerText;
        var name = formName.value;
        var place = formPlace.value;
        var review = formReview.value;
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

        // Добавляем метку на карту
				clusterer.add(new ymaps.Placemark([cordX, cordY]));
	    	myMap.geoObjects.add(clusterer);

	    	// Получаем все отзывы по данному адресу 
	    	getReviewsAddress(address);
    });

    // Обработка закрытия формы
    closeButton.addEventListener('click',function(e){
        e.preventDefault();
        closeForm();
    });
}