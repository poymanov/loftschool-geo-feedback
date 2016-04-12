window.onload = function() {
    // Карту на весь экран
    var map = document.getElementById('map'); 
    map.style = "width: "+window.innerWidth+"px; height: "+window.innerHeight+"px";    
}



ymaps.ready(init);
var myMap;



function init(){ 
    myMap = new ymaps.Map("map", {
        center: [55.76, 37.64],
        zoom: 17
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

    // Кнопку добавить формы
    var addForm = document.querySelector('.new-review__form-link');

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
    });
    
}