
var dugmeLogin = document.getElementById("loginButton");
dugmeLogin.addEventListener("click", function(event) { 
    event.preventDefault();
    clickLogin();
});

function clickLogin() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    PoziviAjax.postLogin(username,password, function(err,data) {    //data mi je u biti je li uspjesno ili neuspjesno logovan
        if(err) throw err;
        var poruka = JSON.parse(data).poruka;
        if(poruka === "Uspješna prijava") {
            if(document.getElementById("opomene").style.display == "block" ) {
                document.getElementById("opomene").style.display = "none";
            }
            window.location.href = 'http://localhost:3000/predmeti';
        } else if(poruka === "Neuspješna prijava"){
            if(document.getElementById("opomene").style.display = "none")
                document.getElementById("opomene").style.display = "block";
            document.getElementById("opomene").innerHTML = "Neuspješna prijava, pogrešan username ili password.";
            document.getElementById("username").value = "";
            document.getElementById("password").value = "";
        }else{
            if(document.getElementById("opomene").style.display = "none")
                document.getElementById("opomene").style.display = "block";
            document.getElementById("opomene").innerHTML = "Korisnik već prijavljen.";
            document.getElementById("username").value = "";
            document.getElementById("password").value = "";
        }
    });
}