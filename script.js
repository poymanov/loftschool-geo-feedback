window.onload = function() {
    // Карту на весь экран
    var map = document.getElementById('map'); 
    map.style = "width: "+window.innerWidth+"px; height: "+window.innerHeight+"px";    
}

ymaps.ready(init);
var myMap, 
    myPlacemark;

function init(){ 
    myMap = new ymaps.Map("map", {
        center: [55.76, 37.64],
        zoom: 17
    }); 
        
    myPlacemark = new ymaps.Placemark([55.76, 37.64], {
        hintContent: 'Москва!',
        balloonContent: 'Столица России'
    });
    
    myMap.geoObjects.add(myPlacemark);
}