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

    myMap.events.add('click', function (e) {        
        var coords = e.get('coords');
        console.log(coords);
    });
}