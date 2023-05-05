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



if (window.matchMedia("(max-device-width: 320px)").matches && window.matchMedia("(orientation: portrait)").matches) {
    console.log("Mobile, no languages.");
} else {

    document.getElementById("lang-asterisk").innerHTML = "*";

    langs = ["es", "fr", "de", "it", "se", "fi", "dk", "cz", "no"]

    lang_phrases = {
        "es":"Hola",
        "fr":"Bonjour",
        "de":"Hallo",
        "it":"Ciao",
        "se":"Hej",
        "fi":"Hei",
        "dk":"Hej",
        "cz":"Ahoj",
        "no":"Hei",
        "nl":"Hallo",
        "eu":"Kaixo"
    }

    lang_names = {
        "es":"Spanish",
        "fr":"French",
        "de":"German",
        "it":"Italian",
        "se":"Swedish",
        "fi":"Finnish",
        "dk":"Danish",
        "cz":"Czech",
        "no":"Norwegian",
        "nl":"Dutch",
        "eu":"Basque"
    }

    var randomLang = langs[Math.floor(Math.random() * langs.length)];

    var langexplainer = "* That's hello in " + lang_names[randomLang] + "!"
    document.getElementById("lang-explain").innerHTML = langexplainer;

    document.getElementById("hello").innerHTML = lang_phrases[randomLang];
}