

function dajPredmete() {
    PoziviAjax.getPredmeti(function(err,data) {
        var user = JSON.parse(data).korisnik;
        var predmeti = JSON.parse(data).predmeti;
        document.getElementById("ime").innerHTML = user;
        var popisPredmeta = "";
        var len = predmeti.length;
        for(var i = 0; i<len; i++) {
            popisPredmeta += "<div class=predmet><button class=predmetDugme>" + predmeti[i] + "</button></div>";
        }
        document.getElementById("gridpredmeti").innerHTML = popisPredmeta;
    });
}

window.onload = dajPredmete();

var dugmeLogout = document.getElementById("logOutButton");
dugmeLogout.addEventListener("click", function(event) { 
    event.preventDefault();
    clickLogOut();
});

function clickLogOut() {
    PoziviAjax.postLogout(function(err,data) {
        var poruka = JSON.parse(data).poruka;
        if(poruka === "Uspješna odjava") {
            window.location.href = 'http://localhost:3000/login';
        }
    });
}


var kliknutiPredmet = "";
document.getElementById("gridpredmeti").addEventListener('click', function(evt) {
    let element = evt.target;
    kliknutiPredmet = element.textContent;
    clickDajPrisustvo();
});

let prisustvo;
let div = document.getElementById("tabela");
function clickDajPrisustvo() {
        PoziviAjax.getPredmet(kliknutiPredmet, function(err,data) {
        if(err) throw err;

        div = document.getElementById("tabela");
        var pris = JSON.parse(data);
        podaci = pris;
        trenutnasedmica = -1;
        prisustvo = TabelaPrisustvo(div, podaci);
    });
}

function prethodnaSedmica() {
    prisustvo.prethodnaSedmica();
    prisustvo = TabelaPrisustvo(div,podaci);
}
function sljedecaSedmica() {
    prisustvo.sljedecaSedmica();
    prisustvo = TabelaPrisustvo(div,podaci);
}

var kliknutoDugme ="";
var tacnoDugme; // objekat dugmeta koji je kliknut
document.getElementById("tabela").addEventListener('click', function(event) {
    tacnoDugme = event.target;
    kliknutoDugme = tacnoDugme.className; // kliknutoDugme je klasa dugmeta (prisutan,odsutan,neupisan)
    promijeniPrisustvo();
});



function promijeniPrisustvo() {

    if(tacnoDugme != null) {
        
        if(kliknutoDugme != "" && kliknutoDugme != "fa-solid fa-arrow-right" && kliknutoDugme != "fa-solid fa-arrow-left" ) {

            var brPr = 0;
            var brVj = 0;
            var prisPr = 0;
            var prisVj = 0;
            var indexPromjene = "";
            var PorV = "";        

            var cijelaTabela = document.getElementById("tabelapris");
            var goal = tacnoDugme.getBoundingClientRect()['y'];
            var nizY = [];
            var redKlika;
            for(var i = 1; i < cijelaTabela.rows.length; i++) {
                var celije = cijelaTabela.rows.item(i).cells;
                nizY.push(celije.item(1).getBoundingClientRect()['y']); // subtabela mi se nalazi na trenutna + 1 indeksu

            }
            const closest = nizY.reduce((prev, curr) => {
                return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
            });
            for(var i = 1; i < cijelaTabela.rows.length; i++) {
                var celije = cijelaTabela.rows.item(i).cells;
                if(celije.item(1).getBoundingClientRect()['y'] == closest) {
                    indexPromjene = celije.item(1).innerText;
                    redKlika = i;
                }
            }

            //var celijaSaSubtabelom = cijelaTabela.rows.item(redKlika).cells.item(trenutnasedmica+1).innerHTML;

            var subtabele = cijelaTabela.getElementsByClassName('subtabela');
                var odabranaSubtabela = subtabele[redKlika-1];
                //var celije = odabranaSubtabela.rows.item(0).cells;  
                var objCells = odabranaSubtabela.rows.item(0).cells;
                for(var i = 0; i < objCells.length; i++) { // kolone sa P i V
                    var celije = objCells.item(i); 
                    //console.log(celije.textContent); // ovdje mi izadju P1 P2 V1 V3...
                    if(celije.getBoundingClientRect()['x'] == tacnoDugme.getBoundingClientRect()['x']) {
                        PorV = celije.textContent.charAt(0); // nasla sam je li P ili V 
                    }
                    if(celije.textContent.charAt(0) == 'P') {
                        brPr++;
                    }
                    if(celije.textContent.charAt(0) == 'V') {
                        brVj++;
                    }

                } 

                var objCells = odabranaSubtabela.rows.item(1).cells;
                for(var i = 0; i < objCells.length; i++) { 
                    var celije = objCells.item(i); 
                    if(celije.firstChild.className == "prisutan" && i < brPr) {
                        prisPr++;
                    }
                    if(celije.firstChild.className == "prisutan" && i >= brPr) {
                        prisVj++;
                    }

                }
                
                if(kliknutoDugme != "" && PorV === "P" || PorV ==="V") {
                        //prisustvo ima oblik {sedmica:N,predavanja:P,vjezbe:V}
                        var prisustvoString = '{"sedmica":' + trenutnasedmica;

                        if(kliknutoDugme === "prisutan" && PorV === "P") {
                            prisPr--;
                            prisustvoString += ',"predavanja":'+ prisPr + ',"vjezbe":' + prisVj + '}';
                        } else if(kliknutoDugme === "odsutan" && PorV === "P") {
                            prisPr++;
                            prisustvoString += ',"predavanja":'+ prisPr + ',"vjezbe":' + prisVj + '}';
                        } else if(kliknutoDugme === "prisutan" && PorV === "V") {
                            prisVj--;
                            prisustvoString += ',"predavanja":'+ prisPr + ',"vjezbe":' + prisVj + '}';
                        } else if (kliknutoDugme === "odsutan" && PorV === "V") {
                            prisVj++;
                            prisustvoString += ',"predavanja":'+ prisPr + ',"vjezbe":' + prisVj + '}';
                        } else if (kliknutoDugme === "neupisan" && PorV === "P") {
                            prisPr++; prisVj = 0;
                            prisustvoString += ',"predavanja":'+ prisPr + ',"vjezbe":' + prisVj + '}';
                        } else if(kliknutoDugme === "neupisan" && PorV === "V") {
                            prisVj++; prisPr = 0;
                            prisustvoString += ',"predavanja":'+ prisPr + ',"vjezbe":' + prisVj + '}';
                        }

                        var prisustvoJSON = JSON.parse(prisustvoString);
                        //console.log(prisustvoJSON);

                        /*console.log("klasa: " + kliknutiPredmet);
                        console.log("index: " +indexPromjene);
                        console.log("prisustvo: " + prisustvoString);
                        console.log("P ili V: " + PorV);
                        console.log("kliknuto " + kliknutoDugme);*/
                        
                        PoziviAjax.postPrisustvo(kliknutiPredmet, Number(indexPromjene) , prisustvoJSON, function(err,data) {
                            if(err) throw err;

                            div = document.getElementById("tabela");
                            var pris = JSON.parse(data);
                            podaci = pris;
                            prisustvo = TabelaPrisustvo(div, podaci);
                        });

            }

        }

    }


}



//fa-solid fa-arrow-right da ignorise i lijevu isto i ovu i da ignorise prazni string

