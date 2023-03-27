Mousetrap.bind('up up down down left right left right b a enter', function() {
    alert("Hello world!")
});

AOS.init({
    disable: window.matchMedia('(prefers-reduced-motion: reduce)')["matches"]
});

function disableTilt() {
    var tiltable = document.querySelectorAll(".tiltable");
    for (var i = 0; i < tiltable.length; i++) {
        VanillaTilt.init(tiltable[i])
        tiltable[i].vanillaTilt.destroy();
    }
}