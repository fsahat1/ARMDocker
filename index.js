const express = require('express');
const bodyParser = require('body-parser');
const session = require("express-session");
var fs=require('fs');
const { json } = require('express');
const bcrypt = require('bcrypt');
const db = require('./models/baza.js');

const app = express();
 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(session({
    secret: 'neka tajna sifra',
    resave: true,
    saveUninitialized: true
 }));

 db.sequelize.sync().then(() => console.log(""));
 
// pomocna funkcija za provjeru passworda
function comparePassword(plaintextPassword, hash) {
    return bcrypt.compareSync(plaintextPassword,hash);
}

app.get("/predmet.html", async function(req,res) {
    res.sendFile('predmet.html', {root: __dirname+'/public/html'});
    //testiranje
    /*let product = await db.nastavnici.findOne({ where: { id: 1 }})
    console.log(product.username)*/
});

app.get("/prijava.html", function(req,res) {
    res.sendFile('prijava.html', {root: __dirname+'/public/html'});
});

app.get("/prisustvo.html", function(req,res) {
    res.sendFile('prisustvo.html', {root: __dirname+'/public/html'});
});

app.get('/login', async function(req,res) {
    res.sendFile('prijava.html', {root: __dirname+'/public/html'});
});


app.post('/login', async function(req,res) {
    var tijeloZahtjeva = req.body; // ovdje imamo ono sto je korisnik ukucao u formu, a šalje se iz Ajaxa

    var nastavniciBaza = await db.nastavnici.findAll({});
    var predmetiSesija = [];
    for(var i = 0; i < nastavniciBaza.length; i++) {
        //console.log(nastavniciBaza[i].username);
        if(tijeloZahtjeva['username'] === nastavniciBaza[i].username && comparePassword(tijeloZahtjeva['password'], nastavniciBaza[i].password_hash)) {
            if(req.session.username == null) {
                req.session.username = tijeloZahtjeva['username'];
                var predmetiBaza = await db.predmeti.findAll({});
                for(var j = 0; j < predmetiBaza.length; j++) {
                    if(predmetiBaza[j].nastavniciId == nastavniciBaza[i].id){
                        predmetiSesija.push(predmetiBaza[j].naziv);
                    }
                }
                req.session.predmeti = predmetiSesija;
                //console.log(predmetiSesija);
                return res.status(200).json({poruka: "Uspješna prijava" });
            }
        }
    }
    if(req.session.username == null) {
        return res.status(200).json({poruka: "Neuspješna prijava" });
    } else {
        return res.status(200).json({poruka: "Prijavljen korisnik." });
    }

    /*fs.readFile(__dirname + '/data/nastavnici.json', function(err,sadrzaj) {
        if(err) throw err;

        var jsonSadrzaj = JSON.parse(sadrzaj); // parsirani sadrzaj json datoteke nastavnici
        var duzina = Object.keys(jsonSadrzaj).length;
        
        /*console.log("OVO JE METODA KOJOM SE DOBIJE HASH PASSWORDA");
        bcrypt.hash("PASSWORDHASH2", 10)
        .then(hash => {
        console.log('Hash ', hash);
        });*/

        /*for(var i = 0; i< duzina; i++) {
            if(tijeloZahtjeva['username'] === jsonSadrzaj[i]['nastavnik']['username'] && comparePassword(tijeloZahtjeva['password'],jsonSadrzaj[i]['nastavnik']['password_hash']) ) {
                if(req.session.username == null) {
                    req.session.username = tijeloZahtjeva['username'];
                    req.session.predmeti = jsonSadrzaj[i].predmeti;
                    return res.status(200).json({poruka: "Uspješna prijava" });
                } else {
                    return res.status(200).json({poruka: "Prijavljen korisnik." }); // poruka ako je korisnik vec prijavljen
                }
            } 
        }
        if(req.session.username == null) {
            return res.status(200).json({poruka: "Neuspješna prijava" });
        } else {
            return res.status(200).json({poruka: "Prijavljen korisnik." });
        }
    });*/
    
});


var pom = false; // kad se logoutuje onda stavi na false opet ovu globalnu, pomocna varijabla da vidim kada da vratim prozor, a kada se salje get poziv kroz Ajax
app.get('/predmeti', function(req,res) {
    if(req.session.username == null) {
        return res.status(200).json({greska: "Nastavnik nije loginovan"});
    } else{
        if(pom==true) { // ovo tijelo se salje kada ajax pozove get poziv
            pom = false;
            return res.status(200).json({korisnik: req.session.username, predmeti: req.session.predmeti});
        }else { // a ovo tijelo kada kliknemo na login, get poziv koji pozove window.location.href
            res.sendFile('predmeti.html', {root: __dirname+'/public/html'});
            pom = true;
        }   
    }
});  


app.post('/logout', function(req,res) {
    if(req.session.username != null) {
        req.session.username = null;
        req.session.predmeti = null;
        pom = false;
        return res.json({poruka: "Uspješna odjava" });
    } else{
        return res.json({poruka: "Niste prijavljeni" });
    }
});

function ukloniDuplikate(arr) {
    return arr.filter((item,index) => arr.indexOf(item) === index);
}

app.get('/predmet/:naziv', async function(req,res) {
    if(req.session.username == null) {
        return res.status(200).json({greska: "Nastavnik nije loginovan"});
    } else {
        var nazivPredmeta = req.params.naziv;

        var prisustvoBaza = await db.prisustva.findAll({});
        var studentiPris = [];
        var prisustva = '"prisustva":[';         
        var predmetiBaza = await db.predmeti.findAll({});
        var idPredmeta;
        var brojpr, brojvj;
        for(j = 0; j < predmetiBaza.length; j++) {
            if(predmetiBaza[j].naziv === nazivPredmeta) {
                idPredmeta = predmetiBaza[j].id;
                brojpr = predmetiBaza[j].brojPredavanjaSedmicno;
                brojvj = predmetiBaza[j].brojVjezbiSedmicno;
            }
        }
        //{"sedmica":1,"predavanja":2,"vjezbe":1,"index":12345},
        for(var i = 0; i < prisustvoBaza.length; i++) {
            if(prisustvoBaza[i].predmetiId === idPredmeta) {
                prisustva += '{"sedmica":' + prisustvoBaza[i].sedmica + ',"predavanja":'+ prisustvoBaza[i].predavanja;
                prisustva += ',"vjezbe":' + prisustvoBaza[i].vjezbe + ',"index":' + prisustvoBaza[i].studentiIndex + '},';
                studentiPris.push(prisustvoBaza[i].studentiIndex);
            }
        }
        prisustva = prisustva.slice(0,-1);
        prisustva += '],';
        studentiPris = ukloniDuplikate(studentiPris);
        //console.log(studentiPris);

        var bazaStudenti = await db.studenti.findAll({});
        //console.log(bazaStudenti);
        var studenti = '"studenti":[';
        for(var i = 0; i < bazaStudenti.length; i++) {
            if(studentiPris.includes(bazaStudenti[i].index)==true) {
                studenti += '{"ime": "' + bazaStudenti[i].ime + '", "index":' + bazaStudenti[i].index + '},';
            }
        }
        studenti = studenti.slice(0,-1);
        studenti += '],';

        var konacniJSONString = '{'+ studenti + prisustva + '"predmet": "' + nazivPredmeta + '","brojPredavanjaSedmicno":'+ brojpr;
        konacniJSONString += ',"brojVjezbiSedmicno":' + brojvj + '}';

        //console.log(konacniJSONString);
        var jsonObjekat = JSON.parse(konacniJSONString);
        return res.status(200).json(jsonObjekat);

        /*fs.readFile(__dirname + '/data/prisustva.json', function(err,sadrzaj) { // vrati mi prisustva za navedeni predmet
                var jsons = JSON.parse(sadrzaj); // parsirani sadrzaj json datoteke prisustva
                var duzina = Object.keys(jsons).length;
                for(var i = 0; i < duzina; i++) {
                    if(jsons[i].predmet == nazivPredmeta) {
                        return res.status(200).json(jsons[i]); // json objekat prisustva za navedeni predmet
                    }
                }
        });*/
    }
});


app.post('/prisustvo/predmet/:naziv/student/:index', async function(req,res) {
    var zahtjev = req.body; // sedmica pr vj
    var index = Number(req.params.index);
    var predmet = req.params.naziv;
    var jeLiUpisanSedmica = false; // za provjeru da li je ikako upisan u sedmicu za koju mijenjamo prisustvo

    var prisustva = '"prisustva":['; 
    var studenti = '"studenti":[';
    var idPredmeta;
    var predmetiBaza = await db.predmeti.findAll({});
    var brojpr,brojvj;
    for(j = 0; j < predmetiBaza.length; j++) {
        if(predmetiBaza[j].naziv === predmet) {
            idPredmeta = predmetiBaza[j].id;
            brojpr = predmetiBaza[j].brojPredavanjaSedmicno;
            brojvj = predmetiBaza[j].brojVjezbiSedmicno;
        }
    }
    
    var sedmica = zahtjev.sedmica;
    var bazaPrisustva = await db.prisustva.findAll({});
    for(var i = 0; i < bazaPrisustva.length; i++) {
        if(bazaPrisustva[i].predmetiId === idPredmeta && bazaPrisustva[i].sedmica === sedmica && bazaPrisustva[i].studentiIndex === index) {
            jeLiUpisanSedmica = true;
            await db.prisustva.upsert({
                id: bazaPrisustva[i].id,
                predavanja: zahtjev.predavanja,
                vjezbe: zahtjev.vjezbe,
                predmetiId: idPredmeta,
                studentiIndex: index
            });
            //console.log("dobroe");
        }
    }

    if(jeLiUpisanSedmica === false) {
        await db.prisustva.create({
            sedmica: sedmica,
            predavanja: zahtjev.predavanja,
            vjezbe: zahtjev.vjezbe,
            predmetiId: idPredmeta,
            studentiIndex: index
        });
    }

    var studentiPris = [];
    var prisustvoBaza = await db.prisustva.findAll({});
    for(var i = 0; i < prisustvoBaza.length; i++) {
        if(prisustvoBaza[i].predmetiId === idPredmeta) {
            prisustva += '{"sedmica":' + prisustvoBaza[i].sedmica + ',"predavanja":'+ prisustvoBaza[i].predavanja;
            prisustva += ',"vjezbe":' + prisustvoBaza[i].vjezbe + ',"index":' + prisustvoBaza[i].studentiIndex + '},';
            studentiPris.push(prisustvoBaza[i].studentiIndex);
        }
    }
    prisustva = prisustva.slice(0,-1);
    prisustva += '],';
    studentiPris = ukloniDuplikate(studentiPris);
    //console.log(studentiPris);

    var bazaStudenti = await db.studenti.findAll({});
    //console.log(bazaStudenti);
    var studenti = '"studenti":[';
    for(var i = 0; i < bazaStudenti.length; i++) {
        if(studentiPris.includes(bazaStudenti[i].index)==true) {
            studenti += '{"ime": "' + bazaStudenti[i].ime + '", "index":' + bazaStudenti[i].index + '},';
        }
    }
    studenti = studenti.slice(0,-1);
    studenti += '],';

    var konacniJSONString = '{'+ studenti + prisustva + '"predmet": "' + predmet + '","brojPredavanjaSedmicno":'+ brojpr;
    konacniJSONString += ',"brojVjezbiSedmicno":' + brojvj + '}';

    //console.log(konacniJSONString);
    var jsonObjekat = JSON.parse(konacniJSONString);
    return res.status(200).json(jsonObjekat);

    /*fs.readFile(__dirname + '/data/prisustva.json', function(err,sadrzaj) {
        if(err) throw err;

        var jsonSadrzaj = JSON.parse(sadrzaj); 
        var duzina = Object.keys(jsonSadrzaj).length;

        for(var i = 0; i < duzina; i++) {
            if(jsonSadrzaj[i].predmet === predmet) {
                var duzinaPris = Object.keys(jsonSadrzaj[i].prisustva).length;
                jeLiUpisanSedmica = false;
                for(var j = 0; j < duzinaPris; j++) {
                    if(jsonSadrzaj[i].prisustva[j].sedmica === zahtjev.sedmica && jsonSadrzaj[i].prisustva[j].index === index) { // izmjena podataka u prisustva.json
                        jeLiUpisanSedmica = true;
                        jsonSadrzaj[i].prisustva[j].predavanja = zahtjev.predavanja;
                        jsonSadrzaj[i].prisustva[j].vjezbe = zahtjev.vjezbe;
                    }
                }

                if(!jeLiUpisanSedmica) {
                    jsonSadrzaj[i].prisustva.push({
                        "sedmica": zahtjev.sedmica, "predavanja": zahtjev.predavanja,
                        "vjezbe": zahtjev.vjezbe, "index": index });
                }

            }
        }

        fs.writeFile(__dirname + '/data/prisustva.json', JSON.stringify(jsonSadrzaj), (err) => { // upisivanje izmjena
            if (err) {
                console.error(err);
            } else {
                for (var i = 0; i < duzina; i++) {
                    if (jsonSadrzaj[i].predmet === predmet) {
                        return res.status(200).json( jsonSadrzaj[i] ); // vraca nazad json objekat prisustva
                    }
                }
            }

        });


    });*/


});



app.listen(3000);
