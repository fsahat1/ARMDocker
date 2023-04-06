const { predmeti } = require('./models/baza.js');
const db = require('./models/baza.js');


db.sequelize.sync({force:true}).then(function(){
    inicializacija().then(function(){
        console.log("Gotovo kreiranje tabela i ubacivanje pocetnih podataka!");
        process.exit();
    });
});

function inicializacija(){

    var nastavniciListaPromisea=[];
    var predmetiListaPromisea=[];
    var studentiListaPromisea=[];
    var prisustvaListaPromisea=[];

    return new Promise(function(resolve,reject){


    /*nastavniciListaPromisea.push(db.nastavnici.create({username:'nastavnik1', password_hash: '$2b$10$ExgBJF2MHs0xctC22aZKtuFzS8j4RpjUeiIh48rbyvwhAm9y.3ZRq'}));
    nastavniciListaPromisea.push(db.nastavnici.create({username:'nastavnik2', password_hash: '$2b$10$lYvQr9L4VmG1NcFY.DMpgOI.FPL9dXEb9h/sO.kij32mweo0fDMDW'}));
    
    studentiListaPromisea.push(db.studenti.create({ime: 'Student 1', index: '12345'}));
    studentiListaPromisea.push(db.studenti.create({ime: 'Student 2', index: '12346'}));
    studentiListaPromisea.push(db.studenti.create({ime: 'Student 3', index: '12347'}));*/ 
        
        // Matematika
        prisustvaListaPromisea.push(db.prisustva.create({sedmica: 1, predavanja: 2, vjezbe: 1}));
        prisustvaListaPromisea.push(db.prisustva.create({sedmica: 1, predavanja: 2, vjezbe: 1}));
        prisustvaListaPromisea.push(db.prisustva.create({sedmica: 2, predavanja: 2, vjezbe: 1}));
        prisustvaListaPromisea.push(db.prisustva.create({sedmica: 2, predavanja: 2, vjezbe: 1}));  
        prisustvaListaPromisea.push(db.prisustva.create({sedmica: 3, predavanja: 2, vjezbe: 1}));

        // Fizika
        prisustvaListaPromisea.push(db.prisustva.create({sedmica: 1, predavanja: 2, vjezbe: 1}));
        prisustvaListaPromisea.push(db.prisustva.create({sedmica: 1, predavanja: 2, vjezbe: 1}));
        prisustvaListaPromisea.push(db.prisustva.create({sedmica: 2, predavanja: 2, vjezbe: 1}));
        prisustvaListaPromisea.push(db.prisustva.create({sedmica: 2, predavanja: 2, vjezbe: 1}));

        // Historija
        prisustvaListaPromisea.push(db.prisustva.create({sedmica: 1, predavanja: 2, vjezbe: 1}));
        prisustvaListaPromisea.push(db.prisustva.create({sedmica: 1, predavanja: 2, vjezbe: 1}));
        prisustvaListaPromisea.push(db.prisustva.create({sedmica: 2, predavanja: 2, vjezbe: 1}));
        prisustvaListaPromisea.push(db.prisustva.create({sedmica: 2, predavanja: 2, vjezbe: 1}));

         // Geografija
        prisustvaListaPromisea.push(db.prisustva.create({sedmica: 1, predavanja: 2, vjezbe: 1}));
        prisustvaListaPromisea.push(db.prisustva.create({sedmica: 1, predavanja: 2, vjezbe: 1}));
        prisustvaListaPromisea.push(db.prisustva.create({sedmica: 2, predavanja: 2, vjezbe: 1}));
        prisustvaListaPromisea.push(db.prisustva.create({sedmica: 2, predavanja: 2, vjezbe: 1}));




        Promise.all(prisustvaListaPromisea).then(function (prisustva){
            // prisustva za matematiku po sedmicama
            var pm1 = prisustva.filter(function(k){return k.sedmica === 1})[0];
            var pm2 = prisustva.filter(function(k){return k.sedmica === 1})[1];
            var pm3 = prisustva.filter(function(k){return k.sedmica === 2})[0];
            var pm4 = prisustva.filter(function(k){return k.sedmica === 2})[1];
            var pm5 = prisustva.filter(function(k){return k.sedmica === 3})[0];

            // prisustva za fiziku po sedmicama
            var pf1 = prisustva.filter(function(k){return k.sedmica === 1})[2];
            var pf2 = prisustva.filter(function(k){return k.sedmica === 1})[3];
            var pf3 = prisustva.filter(function(k){return k.sedmica === 2})[2];
            var pf4 = prisustva.filter(function(k){return k.sedmica === 2})[3];

            // prisustva za historiju po sedmicama
            var ph1 = prisustva.filter(function(k){return k.sedmica === 1})[4];
            var ph2 = prisustva.filter(function(k){return k.sedmica === 1})[5];
            var ph3 = prisustva.filter(function(k){return k.sedmica === 2})[4];
            var ph4 = prisustva.filter(function(k){return k.sedmica === 2})[5];

            // prisustva za geografiju po sedmicama
            var pg1 = prisustva.filter(function(k){return k.sedmica === 1})[6];
            var pg2 = prisustva.filter(function(k){return k.sedmica === 1})[7];
            var pg3 = prisustva.filter(function(k){return k.sedmica === 2})[6];
            var pg4 = prisustva.filter(function(k){return k.sedmica === 2})[7];


            // UNOS STUDENATA
            studentiListaPromisea.push(
                db.studenti.create({ime: 'Student 1', index: 12345}).then(function(n){
                    n.setStudentindex([pm1,pm3,pf1,pf3,pg1,pg3,ph1,ph3,pm5]);
                    return new Promise(function(resolve,reject) {resolve(n)});
                })
            );   

            studentiListaPromisea.push(
                db.studenti.create({ime: 'Student 2', index: 12346}).then(function(n){
                    n.setStudentindex([pm2,pm4,pf2,pf4,pg2,pg4,ph2,ph4]);
                    return new Promise(function(resolve,reject) {resolve(n)});
                })
            );
            
            // UNOS PREDMETA
            predmetiListaPromisea.push(
                db.predmeti.create({naziv: 'Matematika', brojPredavanjaSedmicno: 3, brojVjezbiSedmicno: 2}).then(function(n){
                    n.setPredmet([pm1,pm2,pm3,pm4,pm5]);
                    return new Promise(function(resolve,reject) {resolve(n)});
                })
            );   

            predmetiListaPromisea.push(
                db.predmeti.create({naziv: 'Fizika', brojPredavanjaSedmicno: 3, brojVjezbiSedmicno: 2}).then(function(n){
                    n.setPredmet([pf1,pf2,pf3,pf4]);
                    return new Promise(function(resolve,reject) {resolve(n)});
                })
            ); 
            predmetiListaPromisea.push(
                db.predmeti.create({naziv: 'Historija', brojPredavanjaSedmicno: 3, brojVjezbiSedmicno: 2}).then(function(n){
                    n.setPredmet([ph1,ph2,ph3,ph4]);
                    return new Promise(function(resolve,reject) {resolve(n)});
                })
            ); 

            predmetiListaPromisea.push(
                db.predmeti.create({naziv: 'Geografija', brojPredavanjaSedmicno: 3, brojVjezbiSedmicno: 2}).then(function(n){
                    n.setPredmet([pg1,pg2,pg3,pg4]);
                    return new Promise(function(resolve,reject) {resolve(n)});
                })
            ); 
            

            // UNOS NASTAVNIKA
            Promise.all(predmetiListaPromisea).then(function(predmeti){

                var prvi_predmet = predmeti.filter(function(k){return k.naziv === 'Matematika'})[0];
                var drugi_predmet = predmeti.filter(function(k){return k.naziv === 'Fizika'})[0];
                nastavniciListaPromisea.push(
                    db.nastavnici.create({username: 'nastavnik1', password_hash: '$2b$10$ExgBJF2MHs0xctC22aZKtuFzS8j4RpjUeiIh48rbyvwhAm9y.3ZRq'}).then(function(n){
                        n.setNastavnik([prvi_predmet,drugi_predmet]);
                        return new Promise(function(resolve,reject) {resolve(n)});
                    })
                );
                
                var treci_predmet = predmeti.filter(function(k){return k.naziv === 'Historija'})[0];
                var cetvrti_predmet = predmeti.filter(function(k){return k.naziv === 'Geografija'})[0];
                nastavniciListaPromisea.push(
                    db.nastavnici.create({username: 'nastavnik2', password_hash: '$2b$10$lYvQr9L4VmG1NcFY.DMpgOI.FPL9dXEb9h/sO.kij32mweo0fDMDW'}).then(function(n){
                        n.setNastavnik([treci_predmet,cetvrti_predmet]);
                        return new Promise(function(resolve,reject) {resolve(n)});
                    })
                );
    
            }).catch(function(err){console.log(err)}); 

        });


        //NE VALJA
        /*predmetiListaPromisea.push(db.predmeti.create({naziv: 'Matematika', brojPredavanjaSedmicno: 3, brojVjezbiSedmicno: 2}));
        predmetiListaPromisea.push(db.predmeti.create({naziv: 'Fizika', brojPredavanjaSedmicno: 3, brojVjezbiSedmicno: 2}));
        predmetiListaPromisea.push(db.predmeti.create({naziv: 'Historija', brojPredavanjaSedmicno: 2, brojVjezbiSedmicno: 2}));
        predmetiListaPromisea.push(db.predmeti.create({naziv: 'Geografija', brojPredavanjaSedmicno: 3, brojVjezbiSedmicno: 2}));*/


       /* Promise.all(predmetiListaPromisea).then(function(predmeti){

            var prvi_predmet = predmeti.filter(function(k){return k.naziv === 'Matematika'})[0];
            var drugi_predmet = predmeti.filter(function(k){return k.naziv === 'Fizika'})[0];
            nastavniciListaPromisea.push(
                db.nastavnici.create({username: 'nastavnik1', password_hash: '$2b$10$ExgBJF2MHs0xctC22aZKtuFzS8j4RpjUeiIh48rbyvwhAm9y.3ZRq'}).then(function(n){
                    n.setNastavnik([prvi_predmet,drugi_predmet]);
                    return new Promise(function(resolve,reject) {resolve(n)});
                })
            );
            
            var treci_predmet = predmeti.filter(function(k){return k.naziv === 'Historija'})[0];
            var cetvrti_predmet = predmeti.filter(function(k){return k.naziv === 'Geografija'})[0];
            nastavniciListaPromisea.push(
                db.nastavnici.create({username: 'nastavnik1', password_hash: '$2b$10$ExgBJF2MHs0xctC22aZKtuFzS8j4RpjUeiIh48rbyvwhAm9y.3ZRq'}).then(function(n){
                    n.setNastavnik([treci_predmet,cetvrti_predmet]);
                    return new Promise(function(resolve,reject) {resolve(n)});
                })
            );

        }).catch(function(err){console.log(err)});  */


    }); 
}
