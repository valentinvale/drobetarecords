const express = require("express");
const fs = require("fs");
const sharp = require("sharp");
const {Client} = require("pg");
const ejs = require("ejs");
const { render } = require("express/lib/response");
const sass = require("sass");
const formidable = require("formidable");
const crypto = require("crypto");
const session = require("express-session");
const nodemailer = require("nodemailer");

const res = require("express/lib/response");
const { request } = require("http");
//var client = new Client({user:"user_test", password:"parola", database:"drobetarecords", host:"localhost", port:5432});
// var client = new Client({user:"jrkoqjnvfggbwq", password:"bfa56fd6812c9471af90887d606b692e738ef2f46f3c629973b942d8ceb5e714", database:"ddvj3rr7p063md", host:"ec2-3-230-122-20.compute-1.amazonaws.com", port:5432, ssl: {
//     rejectUnauthorized: false
//   }});

const obGlobal = {
    obImagini: null, 
    obErori: null,
    emailServer: "andreiivan9ucv1948@gmail.com",
    sirAlphaNum:"",
    protocol:null,
    numeDomeniu:null
};

  if(process.env.SITE_ONLINE){

    obGlobal.protocol="https://";
    obGlobal.numeDomeniu="ancient-peak-62239.herokuapp.com";

    var client= new Client({

        database:"ddvj3rr7p063md",

        user:"hfhgccizavfjka",

        password:"bfa56fd6812c9471af90887d606b692e738ef2f46f3c629973b942d8ceb5e714",

        host:"ec2-3-230-122-20.compute-1.amazonaws.com",

        port:5432,

        ssl: {

            rejectUnauthorized: false

          }

    });

}

else{

    obGlobal.protocol="http://";
    obGlobal.numeDomeniu="localhost:8080";

    var client= new Client({database:"drobetarecords",

        user:"user_test",

        password:"parola",

        host:"localhost",

        port:5432});



}

client.connect();

client.query("select * from drobetarecords", function(err, rezQuery){
    console.log(rezQuery);
});

app = express();

async function trimiteMail(email, subiect, mesajText, mesajHtml, atasamente=[]){
    var transp= nodemailer.createTransport({
        service: "gmail",
        secure: false,
        auth:{//date login 
            user:obGlobal.emailServer,
            pass:"hawjiqtsbvujhofw"
        },
        tls:{
            rejectUnauthorized:false
        }
    });
    //genereaza html
    await transp.sendMail({
        from:obGlobal.emailServer,
        to:email,
        subject:subiect,//"Te-ai inregistrat cu succes",
        text:mesajText, //"Username-ul tau este "+username
        html: mesajHtml,// `<h1>Salut!</h1><p style='color:blue'>Username-ul tau este ${username}.</p> <p><a href='http://${numeDomeniu}/cod/${username}/${token}'>Click aici pentru confirmare</a></p>`,
        attachments: atasamente
    })
    console.log("trimis mail");
}

app.use(session({
    secret: 'abcdefg',//folosit de express session pentru criptarea id-ului de sesiune
    resave: true,
    saveUninitialized: false
  }));
  
intervaleAscii = [[48, 57],[65, 90], [97, 122]]
sirAlphaNum = "";
for(let interval of intervaleAscii){
    for (let i=interval[0]; i<=interval[1]; i++){
        sirAlphaNum += String.fromCharCode(i);
    }
}
console.log("sirAlphaNum:",sirAlphaNum);

function genereazaToken(n){
    let token = "";
    for(let i=0; i<n; i++)
        token += sirAlphaNum[Math.floor(Math.random()*sirAlphaNum.length)]
    return token;
}

parolaServer = "tehniciweb";
app.post("/inreg", function(req, res){
    var formular = new formidable.IncomingForm();
    formular.parse(req, function(err, campuriText,camouriFisier){
        console.log(campuriText);

        var eroare = "";
        if(campuriText.username == "")
        {
            eroare += "Username necompletat";
        }

        if(!campuriText.username.match(new RegExp("^[A-Za-z0-9]+$"))){
            eroare += "Username-ul nu corespunde pattern-ului";
        }
        if(!eroare){
            queryUtiliz = `select username from utilizatori where username = '${campuriText.username}'`
            client.query(queryUtiliz, function(err, rezUtiliz){
                if(rezUtiliz.rows.length != 0){
                    eroare += "Username-ul mai exista";
                    res.render("pagini/inregistrare", {err: "Eroare: "+eroare});
                }

                else{
                    var parolaCriptata=crypto.scryptSync(campuriText.parola,parolaServer, 64).toString('hex');
                    var token=genereazaToken(100);
                    var comandaInserare=`insert into utilizatori (username, nume, prenume, parola, email, culoare_chat, cod) values ('${campuriText.username}','${campuriText.nume}', '${campuriText.prenume}', '${parolaCriptata}', '${campuriText.email}', '${campuriText.culoare_chat}', '${token}' )`;
                    client.query(comandaInserare, function(err, rezInserare){
                        if(err) {
                            console.log(err);
                            res.render("pagini/inregistrare", {err: "Eroare baza de date"});
                        }
                        else {
                            res.render("pagini/inregistrare", {raspuns: "Datele au fost introduse"});
                            let linkConfirmare = `${obGlobal.protocol}${obGlobal.numeDomeniu}/cod/${campuriText.username}/${token}`;
                            trimiteMail(campuriText.email, "Inregistrare cu succes", "Username-ul tau este " + campuriText.username, `<h1>Salut!</h1><p style='color:blue'>Username-ul tau este ${campuriText.username}.</p><p>Link pentru confirmare: <a href='${linkConfirmare}'>${linkConfirmare}</a></p>`);
                        }
                        });
                    //res.send("RECEBA");
                    
                }
            })
           
        }
        else{
            res.render("pagini/inregistrare", {err: "Eroare: "+eroare});
        }
    }) 
});

app.get("/cod:username/:token", function(req, res){
    var comandaUpdate=`update utilizatori set confirmat_mail=true where username='${req.params.username}'`;
    client.query(comandaUpdate, function(err, rezUpdate){
        if(err){
            console.log(err);
            console.log("pllllllllllllllllllllllllllllllllllllllll");
            randeazaEroare(res, 2);
            
        }
        else{
            console.log("siuuu");
            if(rezUpdate.rowCount==1){
                res.render("pagini/confirmare");
            }
            else{
                randeazaEroare(res,-1, "Mail neconfirmat", "Incercati iar");
            }
        }
    })
});

app.post("/login", function(req, res){
    var formular = new formidable.IncomingForm();
    formular.parse(req, function(err, campuriText, camouriFisier){
        console.log(campuriText);
        var parolaCriptata=crypto.scryptSync(campuriText.parola,parolaServer, 64).toString('hex');
        var comandaInserare=`select * from utilizatori where username = '${campuriText.username}' and parola = '${parolaCriptata}'`;
        client.query(comandaInserare, function(err, rezSelect){
            if(err) console.log(err);
            else
            {
                if(rezSelect.rows.length == 1){
                    req.session.utilizator = {
                        nume:rezSelect.rows[0].nume,
                        prenume:rezSelect.rows[0].prenume,
                        username:rezSelect.rows[0].username,
                        email:rezSelect.rows[0].email,
                        culoare_chat:rezSelect.rows[0].culoare_chat,
                        rol:rezSelect.rows[0].rol,
                        tema_site:rezSelect.rows[0].tema_site,
                        imagine:rezSelect.rows[0].imagine
                    }
                    res.redirect("/index");
                }
            }
        });
    })
});



app.set("view engine", "ejs");

app.use("/resurse", express.static(__dirname+"/resurse"))

console.log("Director proiect:", __dirname);

app.get("*/",function(req, res, next){
    res.locals.propGenerala="POATE NU CUMPERI";
    res.locals.utilizator = req.session.utilizator;
    next();
})

app.get(["/", "/index", "/home"], function(req, res){
    var dimensiuniGal = [2, 3, 4];
    var indiceAleator = Math.floor(Math.random() * dimensiuniGal.length);
    dimAleatoare = dimensiuniGal[indiceAleator];
    res.render("pagini/index", {ip: req.ip, imagini: obGlobal.obImagini.imagini, dimensiune: dimAleatoare});
})

app.get("/viniluri", function(req, res){
    res.render("pagini/viniluri")
})

app.get("/galerie", function(req, res){
    res.render("pagini/galerie", {imagini: obGlobal.obImagini.imagini});
})

app.get("/inreg", function(req, res){
    res.render("pagini/inregistrare")
})

app.get("/logout", function(req, res){
    req.session.destroy();
    res.locals.utilizator=null;
    res.render("pagini/logout");

})

app.get("*/galerie-animata.css", function(req, res){
    var sirScss = fs.readFileSync(__dirname+"/resurse/scss/galerie_animata.scss").toString("utf8");
    var culori = ["Navy", "Black", "Green", "Yellow"];
    var indiceAleator = Math.floor(Math.random()*culori.length);
    var culoareAleatoare = culori[indiceAleator];
    rezScss = ejs.render(sirScss, {culoare: culoareAleatoare})
    console.log(rezScss);
    var caleScss = __dirname + "/temp/galerie_animata.scss";
    fs.writeFileSync(caleScss, rezScss);
    try{
        rezCompilare = sass.compile(caleScss, {SourceMap:true});
        var caleCss = __dirname + "/temp/galerie_animata.css";
        fs.writeFileSync(caleCss, rezCompilare.css);
        res.setHeader("Content-Type", "text/css");
        res.sendFile(caleCss);
    }

    catch(err){
        console.log(err);
        res.send("Eroare");
    }
});

app.get("*/galerie2generata.css", function(req, res){
    var sirScss = fs.readFileSync(__dirname + "/resurse/scss/galerie2generata.scss").toString("utf8");
    

    rezScss = ejs.render(sirScss, {dimensiune: dimAleatoare})
    console.log(rezScss);
    var caleScss = __dirname + "/temp/galerie2generata.scss";
    fs.writeFileSync(caleScss, rezScss);

    try{
        rezCompilare = sass.compile(caleScss, {SourceMap: true});
        var caleCss = __dirname + "/temp/galerie2generata.css";
        fs.writeFileSync(caleCss, rezCompilare.css);
        res.setHeader("Content-Type", "text/css");
        res.sendFile(caleCss);
    }

    catch(err){
        console.log(err);
        res.send("Eroare");
    }

});

app.get("/produse", function(req, res){
    console.log(req.query);
    console.log('sdlasjdask')
    client.query("select * from unnest(enum_range(null::categ_discuri))", function(err, rezCateg){
        var cond_where=req.query.tip ? ` categorie='${req.query.tip}' ` : "1=1"

        client.query("select * from discuri where "+cond_where, function(err, rezQuery){
            console.log(err)
            console.log('bbbbb')
            res.render("pagini/produse", {produse: rezQuery.rows, optiuni: rezCateg.rows});
          console.log('cccccc')

    })
    
    });
  });

app.get("/produs/:id", function(req, res){
    console.log(req.params);
    client.query(`select * from discuri where id= ${req.params.id}`, function(err, rezQuery){
        console.log(err);
        console.log(rezQuery);
        res.render("pagini/produs", {prod: rezQuery.rows[0]});
        console.log("DUPA")
    });
}); 

app.get("/*.ejs", function(req, res){
    randeazaEroare(res, 403, true);
    // res.status(403).render("pagini/403");
});


app.get("/*", function(req, res){
    res.render("pagini"+req.url, function(err, rezRender){
        if (err){
            if(err.message.includes("Failed to lookup view")){
                console.log(err);
                console.log("======");
                randeazaEroare(res, 404, true);
                // res.status(404).render("pagini/404");
            }
            else{
                
                // res.render("pagini/eroare_generala");
                randeazaEroare(res, 1, true);
            }
        }
        else{
            console.log(rezRender);
            res.send(rezRender);
        }
    });
   
    console.log("generala:",req.url);
    res.end();
})



function creeazaImagini(){
    var buf=fs.readFileSync(__dirname+"/resurse/json/galerie.json").toString("utf8");
    obGlobal.obImagini=JSON.parse(buf);//global
    d = new Date();
    //console.log(obImagini);
    for (let imag of obGlobal.obImagini.imagini){
        let nume_imag, extensie;
        [nume_imag, extensie ]=imag.fisier.split(".")// "abc.de".split(".") ---> ["abc","de"]
        let dim_mic=150
        
        imag.mic=`${obGlobal.obImagini.cale_galerie}/mic/${nume_imag}-${dim_mic}.webp` //nume-150.webp // "a10" b=10 "a"+b `a${b}`
        //console.log(imag.mic);
        imag.mare=`${obGlobal.obImagini.cale_galerie}/${imag.fisier}`;
        if (!fs.existsSync(imag.mic))
            sharp(__dirname+"/"+imag.mare).resize(dim_mic).toFile(__dirname+"/"+imag.mic);

        
        let dim_mediu=250
        if (!fs.existsSync(imag.mediu))
            sharp(__dirname+"/"+imag.mare).resize(dim_mediu).toFile(__dirname+"/"+imag.mediu);



    }

}
creeazaImagini();

function creeazaErori(){
    var buf=fs.readFileSync(__dirname+"/resurse/json/erori.json").toString("utf8");
    obGlobal.obErori=JSON.parse(buf);//global

    console.log(obGlobal.obErori);

}

function randeazaEroare(res, identificator, status, titlu, text, imagine){
    var eroare = obGlobal.obErori.erori.find(function(elem){ return elem.identificator == identificator; });
    if(status){
        console.log("!!!!!!!!!!!!!!!!!!", eroare, obGlobal.obErori.erori);
        res.status(identificator).render("pagini/eroare_generala_", {titlu: eroare.titlu, text: eroare.text, imagine: obGlobal.obErori.cale_baza + "/" + eroare.imagine});
    }

    else{
        let titlu = titlu || eroare.titlu;
        let text = text || eroare.text;
        if(eroare) 
            imagine = imagine || obGlobal.obErori.cale_baza+"/"+eroare.imagine;
        else
            imagine="resurse/imagini/erori/lupa.png";
        res.render("pagini/eroare_generala_", {titlu:eroare.titlu, text:eroare.text, imagine:imagine});
    }
}

creeazaErori();

//  var s_port=process.env.PORT || 8080;
//  app.listen(s_port);

app.listen(8080);
console.log("A pornit")