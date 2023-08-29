Mousetrap.bind('up up down down left right left right b a enter', function() {
    // alert("Hello world!")
    document.getElementById("body").className = "secret";
});

Mousetrap.bind('0 1 1 8 9 9 9 8 8 1 9 9 9 1 1 9 7 2 5 3', function() {
    // alert("Hello world!")
    document.getElementById("body").className = "secret";
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

if (window.matchMedia('(prefers-reduced-motion: reduce)')["matches"] == true) {
    disableTilt();
}

if (window.matchMedia("(max-device-width: 534px)").matches && window.matchMedia("(orientation: portrait)").matches) {
    console.log("Mobile, no languages.");
} else {

    document.getElementById("lang-asterisk").innerHTML = "*";

    langs = ["es", "fr", "de", "it", "se", "fi", "dk", "cz", "no", "nl", "eu", "eo", "hr", "ha", "kw", "gv", "mt", "mi", "sz", "cs", "wy"]

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
        "eu":"Kaixo",
        "eo":"Saluton",
        "hr":"Zdravo",
        "ha":"Aloha",
        "kw":"Dydh da",
        "gv":"Moghrey mie",
        "mt":"Bongu",
        "mi":"Kia ora",
        "sz":"Witej",
        "cs":"Witéj",
        "wy":"Sgiöekumt"
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
        "eu":"Basque",
        "eo":"Esperanto",
        "hr":"Croatian",
        "ha":"Hawaiian",
        "kw":"Cornish",
        "gv":"Manx",
        "mt":"Maltese",
        "mi":"Māori",
        "sz":"Silesian",
        "cs":"Kashubian",
        "wy":"Wymysorys"
    }

    var randomLang = langs[Math.floor(Math.random() * langs.length)];

    var langexplainer = "* That's hello in " + lang_names[randomLang] + "!"
    document.getElementById("lang-explain").innerHTML = langexplainer;

    document.getElementById("hello").innerHTML = lang_phrases[randomLang];
    // document.getElementById("hello").style.fontWeight = 800;
}