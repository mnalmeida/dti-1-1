var aniversarios = [];

(function (document) {
    start();
    var aniversariosData = gSheetGetBirthdayData();
    if (aniversariosData && aniversariosData.length > 0) {
        exibeDados(aniversariosData);
    }
})(document);

function exibeDados(aniversariosData) {
    if(aniversariosData.length > 0) {
        var aniversariosData = aniversariosData.filter(function(elemento){
            return (+elemento.birthday.substring(3, 5)) === ((new Date()).getMonth() + 1)
        });

        var tableEl = document.querySelector('#aniversarios');
        tableEl.innerHTML = '';
        var tamanhoBloco = 100 / aniversariosData.length;

        aniversariosData.forEach(function(elemento){
            var htmlTemplateAniversariante = document.querySelector('#template-aniversariante .bloco-aniversario').cloneNode(true);
            htmlTemplateAniversariante.style.width = tamanhoBloco + '%';
            htmlTemplateAniversariante.querySelector('img').setAttribute("src", elemento.image);
            htmlTemplateAniversariante.querySelector('p.nome').innerHTML = elemento.name;
            htmlTemplateAniversariante.querySelector('p.data').innerHTML = elemento.birthday;
            tableEl.appendChild(htmlTemplateAniversariante);
        });
    }
}

function gSheetGetBirthdayData() {
    var i = 0;
    while(aniversarios.length <= 0 && i < 100) 
        i++;
    return aniversarios;
}

function gSheetGetBirthdays(json) {
    var data = json.feed.entry;
    var r = 15;
    while( r < data.length){
        if (data[r]["gs$cell"]["col"] == "2") {
            var bDayIndex = r;
            while(data[bDayIndex]["gs$cell"]["col"] !== "10") {
                bDayIndex += 1;
            }
            aniversarios.push({
                name: data[r]["gs$cell"]["$t"],
                birthday: data[bDayIndex]["gs$cell"]["$t"],
                image: data[bDayIndex+1]["gs$cell"]["$t"]
            })
            r = bDayIndex + 1;
        }
        r = r + 1;
    }
}

function start() {
    setInterval(function() {
        reload();
    }, 60 * 1000);
  }

  function reload() {
    clear();

    var head = document.querySelector("head");
    var elem = document.querySelector("#gsheetscript");
    var url = elem.src;      
    elem.parentNode.removeChild(elem);

    var newElem = document.createElement("script");
    newElem.id = "gsheetscript";
    newElem.src = url;
    head.appendChild(newElem);

    setTimeout(function() {
      var aniversariosData = gSheetGetBirthdayData();
      if (aniversariosData.length > 0)
        exibeDados(aniversariosData);
      }, 1000);
  }

  function clear() {
    aniversarios = [];
}