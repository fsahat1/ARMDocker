var trenutnasedmica = -1;
let TabelaPrisustvo = function (divRef, podaci) {

    divRef.innerHTML = "";  //brise sav prethodni sadrzaj stranice
    //validacija podataka
    let sadrzajstr = ""; //inicijalizacija stringa za inner html
    
    podaci.prisustva.sort(function(a,b){return a.sedmica - b.sedmica}); // sortiranje elemenata prisustva da bude poredan po broju sedmica
    //pomocna funkcija za pronalazak duplikata u nizu
    function imaLiDuplikata(arr) {
        return new Set(arr).size !== arr.length;
    }
    //uklanjanje duplikata iz niza
    function ukloniDuplikate(arr) {
        return arr.filter((item,index) => arr.indexOf(item) === index);
    }
    //gotova funkcija sa interneta koja vraća rimski zapis broja
    function romanize (num) {
        if (isNaN(num))
            return NaN;
        var digits = String(+num).split(""),
            key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
                   "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
                   "","I","II","III","IV","V","VI","VII","VIII","IX"],
            roman = "",
            i = 3;
        while (i--)
            roman = (key[+digits.pop() + (i * 10)] || "") + roman;
        return Array(+digits.join("") + 1).join("M") + roman;
    }

    //ima li studenata sa istim indexom
    var duzina = Object.keys(podaci.studenti).length;
    var indeksi = [];
    for (var i = 0; i < duzina; i++) {
        indeksi.push(podaci.studenti[i].index);
    }
    if(imaLiDuplikata(indeksi)) {
        sadrzajstr += "<h1>Podaci o prisustvu nisu validni!</h1>";
        divRef.innerHTML = sadrzajstr;
        return;
    }

    //provjera validnosti prisustva
    var len = Object.keys(podaci.prisustva).length;
    var uneseni = [];
    var sedmice = [];
    var sadsedmica = 0;
    for(var i = 0; i < len; i++){
        sedmice.push(podaci.prisustva[i].sedmica);
        if(uneseni.length == 0)
            sadsedmica = sedmice[sedmice.lastIndexOf(podaci.prisustva[i].sedmica)];
    
        if(podaci.prisustva[i].predavanja < 0 || podaci.prisustva[i].vjezbe < 0 || podaci.prisustva[i].predavanja > podaci.brojPredavanjaSedmicno || podaci.prisustva[i].vjezbe > podaci.brojVjezbiSedmicno || podaci.prisustva[i].sedmice < 1 || podaci.prisustva[i].sedmice > 15) {
            sadrzajstr += "<h1>Podaci o prisustvu nisu validni!</h1>";
            divRef.innerHTML = sadrzajstr;
            return;
        }
        if(podaci.prisustva[i].sedmica == sadsedmica && i != len-1) {
            uneseni.push(podaci.prisustva[i].index);

        }else {
            if(i == len - 1 && podaci.prisustva[i].sedmica == sadsedmica) {
                uneseni.push(podaci.prisustva[i].index);
                i++;
            }
            if(imaLiDuplikata(uneseni)) {
                sadrzajstr += "<h1>Podaci o prisustvu nisu validni!</h1>";
                divRef.innerHTML = sadrzajstr;
                return;
            }
            if(!(uneseni.every(elem => indeksi.includes(elem)))) {
                sadrzajstr += "<h1>Podaci o prisustvu nisu validni!</h1>";
                divRef.innerHTML = sadrzajstr;
                return;
            }
            i--;
            uneseni = [];
        }
    }

    sedmice = ukloniDuplikate(sedmice);
    for(var i = 0; i < sedmice.length; i++) {   // provjera da nije unesena neka medjusedmica (ovako je rasparčano zbog preglednosti uslova)
        if(sedmice.length > 1) {
            if(i == 0 && sedmice[i + 1] != (sedmice[i] + 1)) {
                sadrzajstr += "<h1>Podaci o prisustvu nisu validni!</h1>";
                divRef.innerHTML = sadrzajstr;
                return;
            }
            if (i == (sedmice.length - 1) && sedmice[i-1] != (sedmice[i] - 1)) {
                sadrzajstr += "<h1>Podaci o prisustvu nisu validni!</h1>";
                divRef.innerHTML = sadrzajstr;
                return;
            } 
            if(i!=0 && i!=sedmice.length -1 && (sedmice[i-1] != (sedmice[i] - 1) || sedmice[i+1]!= (sedmice[i] + 1))) {
                sadrzajstr += "<h1>Podaci o prisustvu nisu validni!</h1>";
                divRef.innerHTML = sadrzajstr;
                return;
            }
        }
    }
    if(trenutnasedmica == -1){
        trenutnasedmica = sedmice[sedmice.length - 1]; // sacuvamo trenutnu sedmicu
    }

    //pisemo osnovne informacije o predmetu za kojeg gledamo prisustvo
    sadrzajstr += "<h1 id=naslov>Prisustvo na predmetu </h1>";
    sadrzajstr += "<div id=infodiv><div class=bold>Predmet:&nbsp</div><div>";
    sadrzajstr += podaci.predmet + "</div>";
    //sadrzajstr += "<div class=bold>Ciklus:&nbsp</div><div>BCs</div><div class=bold>Godina studija:&nbsp</div><div>3 godina</div><div class=bold>Odsjek:&nbsp</div><div>Računarstvo i informatika</div>";
    sadrzajstr += "<div class=bold>Broj predavanja sedmično:&nbsp</div><div>" + podaci.brojPredavanjaSedmicno + "</div><div class=bold>Broj vježbi sedmično:&nbsp</div><div>" + podaci.brojVjezbiSedmicno + "</div></div>";
    
    //tabela
 
    
    var uneseniusedmicu = [];
    sadrzajstr += "<table id=tabelapris><tr><th>Ime i prezime</th><th>Index</th>";
    for(var j = sedmice[0]; j <= sedmice[sedmice.length -1]; j++) {
        sadrzajstr += "<th>" + romanize(j) + "</th>";
    }
    if(sedmice[sedmice.length - 1] != 15) {
        if(sedmice[sedmice.length - 1] != 14) {
            sadrzajstr += "<th colspan=" + (15 - sedmice[sedmice.length-1]) + ">" + romanize(sedmice[sedmice.length - 1] + 1) + "-" + romanize(15) + "</th>" + "</tr>";
        }else{
            sadrzajstr += "<th colspan=" + (15 - sedmice[sedmice.length-1]) + ">" + romanize(15) + "</th>" + "</tr>";
        }
    } 
    for(var i = 0; i < duzina; i++) {
        sadrzajstr += "<tr> <td>" + podaci.studenti[i].ime + "</td><td>" + podaci.studenti[i].index + "</td>";
        uneseniusedmicu = [];
        for(var j = 0; j < len; j++) {
            if(j!=0 && podaci.prisustva[j-1].sedmica != podaci.prisustva[j].sedmica)
                uneseniusedmicu = [];
            for(var k = 0; k<len; k++) {
                if(podaci.prisustva[k].sedmica == podaci.prisustva[j].sedmica) {
                    uneseniusedmicu.push(podaci.prisustva[k].index);
                }
            }
            if(podaci.prisustva[j].sedmica != trenutnasedmica ) {
                if(uneseniusedmicu.includes(podaci.studenti[i].index) == false) {
                    sadrzajstr += "<td> </td>";
                    uneseniusedmicu.push(podaci.studenti[i].index);
                    continue;
                } 
                if (uneseniusedmicu.includes(podaci.studenti[i].index) == true && podaci.prisustva[j].index == podaci.studenti[i].index) {
                    sadrzajstr += "<td>" + ((podaci.prisustva[j].predavanja + podaci.prisustva[j].vjezbe)/(podaci.brojPredavanjaSedmicno+podaci.brojVjezbiSedmicno))*100 + "%"+"</td>";
                }
            } 
            if(podaci.prisustva[j].sedmica == trenutnasedmica) {
                if(uneseniusedmicu.includes(podaci.studenti[i].index) == false) {
                    sadrzajstr += "<td>";
                    sadrzajstr += "<table class=subtabela><tr>";
                    for(var pr = 1; pr <= podaci.brojPredavanjaSedmicno; pr++) {
                        sadrzajstr += "<th>" + "P" + pr + "</th>";
                    }
                    for (var vj = 1; vj <= podaci.brojVjezbiSedmicno; vj++) {
                        sadrzajstr += "<th>" + "V" + vj + "</th>";
                    }
                    sadrzajstr += "</tr><tr>";
                    for(var up = 0; up < (podaci.brojPredavanjaSedmicno + podaci.brojVjezbiSedmicno); up++) {
                        sadrzajstr += "<td><button class=neupisan onclick=\"promijeniPrisustvo();\"></button></td>";
                    }
                    sadrzajstr += "</tr>";
                    sadrzajstr += "</table>";
                    sadrzajstr += "</td>";
                    uneseniusedmicu.push(podaci.studenti[i].index);
                    continue;
                } 
                
                if (uneseniusedmicu.includes(podaci.studenti[i].index) == true && podaci.prisustva[j].index == podaci.studenti[i].index) {
                    sadrzajstr += "<td>";
                    sadrzajstr += "<table class=subtabela><tr>";
                    for(var pr = 1; pr <= podaci.brojPredavanjaSedmicno; pr++) {
                        sadrzajstr += "<th>" + "P" + pr + "</th>";
                    }
                    for (var vj = 1; vj <= podaci.brojVjezbiSedmicno; vj++) {
                        sadrzajstr += "<th>" + "V" + vj + "</th>";
                    }
                    sadrzajstr += "</tr><tr>";
                    for(var pr = 0; pr < podaci.prisustva[j].predavanja; pr++) {
                        sadrzajstr += "<td><button class=prisutan onclick=\"promijeniPrisustvo();\"></button></td>";
                    }
                    var razlika = podaci.brojPredavanjaSedmicno - podaci.prisustva[j].predavanja;
                    for(var pr = 0; pr < razlika; pr++){
                        sadrzajstr += "<td><button class=odsutan onclick=\"promijeniPrisustvo();\"></button></td>";
                    }
                    for(var vj = 0; vj < podaci.prisustva[j].vjezbe; vj++) {
                        sadrzajstr += "<td><button class=prisutan onclick=\"promijeniPrisustvo();\"></button></td>";
                    }
                    razlika = podaci.brojVjezbiSedmicno - podaci.prisustva[j].vjezbe;
                    for(var vj = 0; vj < razlika; vj++){
                        sadrzajstr += "<td><button class=odsutan onclick=\"promijeniPrisustvo();\"></button></td>";
                    }
                    sadrzajstr += "</tr>";
                    sadrzajstr += "</table>";
                    sadrzajstr += "</td>";
                }
            }

        }
        for(var prazni = 0; prazni < 15 - sedmice[sedmice.length - 1]; prazni++) {
            sadrzajstr +="<td class=izbaci></td>";
        }
        sadrzajstr += "</tr>";
    }
    

    sadrzajstr += "</table>";
    sadrzajstr+= "<div id=strelice>";
    sadrzajstr += "<button onclick=\"prethodnaSedmica();\"><i class=\"fa-solid fa-arrow-left\" style=\"font-size:36px;\"></i></button>";
    sadrzajstr += "<button onclick=\"sljedecaSedmica();\"><i class=\"fa-solid fa-arrow-right\" style=\"font-size:36px;\" ></i></button>";
    sadrzajstr += "</div>";

    divRef.innerHTML = sadrzajstr;


    //implementacija metoda
    let sljedecaSedmica = function () {
        if(trenutnasedmica == sedmice[sedmice.length-1])
            return;
        trenutnasedmica++;
        
    }
    
    let prethodnaSedmica = function () {
        if(trenutnasedmica==sedmice[0])
            return;
        trenutnasedmica--;
        
    }
    
    
    return {
        sljedecaSedmica: sljedecaSedmica,
        prethodnaSedmica: prethodnaSedmica
    }

    

    
};
