const express = require('express'); //imi incarca un modul ( 'adica express)
const fs = require('fs'); //include<fstream>
const path = require('path');
const pg = require('pg');
const sharp = require('sharp');  /* pt redimensionare*/


const { Client } = require('pg');

const client = new Client({
    host: 'localhost',
    user: 'postgres',
    password: 'andreea2000',
    database: 'TW',
    port: 5432
});

client.connect();




var app = express(); //am creat serverul, obiectul server
let vectorCai=[];
let vectorAnimat=[];
app.set("view engine", "ejs"); /*sistem de templetizare*/



/* daca */
app.use("/resurse", express.static(__dirname + "/resurse")); /* ma asigur ca toate img video etc sunt accesibile si il fac static*/
console.log("Proiectul se afla la",__dirname);



//START BUN 

function verificaImagini(){
  
    var textFisier=fs.readFileSync("resurse/json/galerieStatica.json");  //citeste fisieru/   
    
    var jsi=JSON.parse(textFisier);  /// transforma siru/stringu/ intr un obiect /
    let   vectorCai = [];
    var caleGalerie=jsi.cale_galerie; ///am accesat "cale_galerie   "  -  "resurse/imagini/galerieStatic",
    var imaginiFiltrare = filtruImaginiAnotimp(jsi.imagini);   //jsi.imagini=accesez imaginilie, apoi le trec prin filtru
    
    for(let im of imaginiFiltrare){  
        var imVeche = path.join(caleGalerie, im.cale_fisier); //concateneaza /resurse.blabla./gucci1.jpg   -calea catre imaginea mare
 
        var ext = path.extname(im.cale_fisier); //obtine extensia imaginii  jpg
        
        var numeFisier = path.basename(im.cale_fisier,ext); //obtine numele fisierului fara extensie  (  numele imaginilor" 1,2,3)
         
        let imNoua=path.join(caleGalerie+"/mic/", numeFisier+"-mic"+".webp");
        
        vectorCai.push({mare:"/"+imVeche,mic:"/"+imNoua,descrieree:im.text_descriere});

        if(!fs.existsSync(imNoua))
                sharp(imVeche)
                    .resize(250) //dam width ul imaginii,daca nu specificam inaltimea va pastra  proportiile
                    .toFile(imNoua, function(err)
                    {   
                         console.log("eroare conversie",imVeche,"->",imNoua,err);

                    });
    }
    
   
    if(vectorCai.length>13)
    {
       return vectorCai.slice(0,10);
    }
    return vectorCai;
}

function filtruImaginiAnotimp(imaginis){
     const anotimpuri ={
                iarna : [0,1,2],
                primavara : [3,4,5], 
                vara: [6,7,8],
                toamna: [9,10,11]
     };
     const lunaCurenta = new Date().getMonth();
     console.log("luna",lunaCurenta)
     const imaginiFiltrare=[];
     for(let im of imaginis )
     {
           
           if(anotimpuri[im.anotimp].indexOf(lunaCurenta) !== -1)
              {
                  imaginiFiltrare.push(im);
              } 

     }
    console.log(555,imaginiFiltrare);
     return imaginiFiltrare;
           
}


///STOP BUN

function verificaImaginiAnimate(){
        
    var textFisier=fs.readFileSync("resurse/json/galerie.json");  //citeste fisieru
    var jsi=JSON.parse(textFisier);  // transforma siru/stringu/ intr un obiect 
    var caleGalerie=jsi.cale_galerie; //accesez cale_galerie
    for(let im of jsi.imagini){  
        var imVeche = path.join(caleGalerie, im.cale_fisier);
        var ext = path.extname(im.cale_fisier); //obtine extensia imaginii
        var numeFisier = path.basename(im.cale_fisier,ext); //obtine numele fisierului fara extensie
        let imNoua=path.join(caleGalerie+"/mic/", numeFisier+"-mic"+".webp");

        vectorAnimat.push({mare:"/"+imVeche,mic:"/"+imNoua,descriere:im.text_descriere});

        if(!fs.existsSync(imNoua))
                sharp(imVeche)
                    .resize(150) //dam width ul imaginii,daca nu specificam inaltimea va pastra  proportiile
                    .toFile(imNoua, function(err)
                    {    
                       //  console.log("eroare conversie",imVeche,"->",imNoua,err);

                    });
    }

   // console.log(444,vectorAnimat);
    
    return vectorAnimat;
}

app.get(["/","/index"], function(req, res) {    /* sa putem accesa si cu localhost si cu /index*/
    let vectorAnimat = verificaImaginiAnimate(); 
    let vectorCai =  verificaImagini();
  
    res.render("pagini/index", {imaginile1:vectorAnimat,imaginile:vectorCai});
  
});



app.get("/", function(req, res) {

    res.render("pagini/index");  //executa functille <%- include... din index.ejs

});

app.get("/reduceri", function(req, res) {
  
    res.render("pagini/reduceri");         /* pt reduceri*/ 
});






app.get("/produse", function(req, rez) {

    /*console.log("eu sunt calea: ",req.url);    eu sunt calea:  /produse?categ=ocazie */
   /* console.log("Q:",req.query);       Q: { categ: 'ocazie' }*/
   var conditie= req.query.categ ?  " where categorie='"+req.query.categ+"'" : "";//daca am parametrul categorie in cale (categorie=ocazie, de exemplu) adaug conditia pentru a selecta doar produsele de acel tip, daca nu ramane siru vid

   client.query("select * from genti"+conditie,function(err,res){
    
        rez.render("pagini/produse",{produse:res.rows});        /* transmit datele catre pagina  cand se termina queri ul*/ 
    });
    
   
});




/* pt pagina produsului individual*/ 
app.get("/produs/:id", function(req, rez) {   /* in id va intra valoarea id ului din req.params.id*/
    
console.log("hello",req.params);
    const rezultat = client.query("select * from genti where id="+req.params.id,function(err,res){  
        console.log(res.rows);  
        rez.render("pagini/produs",{prod:res.rows[0]});         
    });
    
   
});




app.get("/", function(req, res) {
    console.log("rez.ip",req.ip)
    res.render("pagini/index", { ip:req.ip, imagini: vectorCai });
});



app.get("/galerie", function(req, res) {
    console.log("URL",req.url)
    res.render("pagini" + req.url, function(err, rezultat) {
        if (err) {
            if (err.message.includes("Failed to lookup view")) {
                res.status(403).render("pagini/403");
            }
             else {
                throw err;
            }
        } 
        else {
            res.send(rezultat);
        }

    });


});


/* 404 */
app.get("/*", function(req, res) {
    
    res.render("pagini" + req.url, function(err, rezultatRender) {
        if (err) {
            if (err.message.includes("Failed to lookup view")) {
                res.status(404).render("pagini/404");
            }
             else {
                throw err;
            }
        } 
        else {
            res.send(rezultatRender);
        }

    });

});


console.log("Dam start la server");
app.listen(8080);
console.log("Serverul a pornit!");




/*
app.get("/produse",function(req, res){
    //console.log("Url:",req.url);
    //console.log("Query:", req.query.tip);
    // conditie_booleana? val_true : val_false
    let conditie= req.query.tip ?  " and tip_produs='"+req.query.tip+"'" : "";//daca am parametrul tip in cale (tip=cofetarie, de exemplu) adaug conditia pentru a selecta doar produsele de acel tip
    console.log("select id, nume, pret, gramaj, calorii, categorie, imagine from prajituri where 1=1"+conditie);
    client.query("select id, nume, pret, gramaj, calorii, categorie, imagine from prajituri where 1=1"+conditie, function(err,rez){
        console.log(err, rez);
        //console.log(rez.rows);
        client.query("select unnest(enum_range( null::categ_prajitura)) as categ", function(err,rezCateg){//selectez toate valorile posibile din enum-ul categ_prajitura

            console.log(rezCateg);
            res.render("pagini/produse", {produse:rez.rows, categorii:rezCateg.rows});//obiectul {a:10,b:20} poarta numele locals in ejs  (locals["a"] sau locals.a)
            });
        
       
    });

    
});
*/

