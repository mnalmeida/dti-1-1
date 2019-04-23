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

        var segundaLinha = document.querySelector('#aniversarios');
        segundaLinha.innerHTML = '';
        var primeiraLinha = document.querySelector('#aniversarios-titulo');
        primeiraLinha.innerHTML = '';
        document.querySelector('.titulo-wrapper .titulo').style.width = aniversariosData.length > 4 ? '50%' : '100%';
        document.querySelector('body').style.background = aniversariosData.length > 4 ? 'linear-gradient(180deg, #4C4489 75%, #FF1478 50%)' : 'linear-gradient(180deg, #4C4489 50%, #FF1478 50%);'

        aniversariosData.forEach(function(elemento, index) {
            var htmlTemplateAniversariante = document.querySelector('#template-aniversariante .bloco-aniversario').cloneNode(true);
            htmlTemplateAniversariante.querySelector('img').setAttribute("src", elemento.image);
            htmlTemplateAniversariante.querySelector('p.nome').innerHTML = elemento.name;
            htmlTemplateAniversariante.querySelector('p.data').innerHTML = elemento.birthday;
            
            if(aniversariosData.length == 5 && index < 1) {
                htmlTemplateAniversariante.style.width = '50%';
                primeiraLinha.appendChild(htmlTemplateAniversariante);
            }
            else if (aniversariosData.length == 6 && index < 2) {
                htmlTemplateAniversariante.style.width = '25%';
                primeiraLinha.appendChild(htmlTemplateAniversariante);
            }
            else {
                var tamanhoBloco = aniversariosData.length > 4 ? 25 : (100 / aniversariosData.length);
                htmlTemplateAniversariante.style.width = tamanhoBloco + '%';
                segundaLinha.appendChild(htmlTemplateAniversariante);
            }
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
            while(data[bDayIndex]["gs$cell"]["col"] !== "11") {
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
