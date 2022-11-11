window.addEventListener("DOMContentLoaded", function(){

    // document.getElementById("inp-pret").onchange=function(){
    //     document.getElementById("infoRange").innerHTML=" (" + this.value + " )"
    // }

    iduriProduse = localStorage.getItem("cos_virtual");

    if(iduriProduse){
        iduriProduse =iduriProduse.split(",");
    }
    else
    iduriProduse = [];

    for(let id_p of iduriProduse){
        var ch = document.querySelector(`[value='${id_p}'].select-cos`);
    }


    var btn=document.getElementById("filtrare");
    btn.onclick=function(){
        var articole=document.getElementsByClassName("produs");
        for(let art of articole){

            art.style.display="none";

            /*
            v=art.getElementsByClassName("nume")
            nume=v[0]*/
            var nume=art.getElementsByClassName("val-nume")[0];//<span class="val-nume">aa</span>
            console.log(nume.innerHTML)
            var conditie1=nume.innerHTML.toLowerCase().startsWith(document.getElementById("inp-nume").value.toLowerCase())

            var pret=art.getElementsByClassName("val-pret")[0]
            var conditie3=parseInt(pret.innerHTML) > parseInt(document.getElementById("inp-pret").value);

            var radbtns=document.getElementsByName("gr_rad");
            for (let rad of radbtns){
                if (rad.checked){
                    var valDimensiune=rad.value;//poate fi 1, 2 sau 3
                    break;
                }
            }

            var minDimensiune, maxDimensiune;
            if(valDimensiune != "toate")
            {
                [minDimensiune, maxDimensiune] = valDimensiune.split(":");
                minDimensiune = parseInt(minDimensiune);
                maxDimensiune = parseInt(maxDimensiune);
            }

            else
            {
                minDimensiune = 0;
                maxDimensiune = 100000000000;
            }
            var dimensiuneArt= parseInt(art.getElementsByClassName("val-dimensiune")[0].innerHTML);

            

            let conditie2 = (minDimensiune < dimensiuneArt && dimensiuneArt <= maxDimensiune)

            var valCategorie = document.getElementById("inp-categorie").value;
            
            let categorieArt = art.getElementsByClassName("val-categorie")[0];
            

            let conditie4 = (valCategorie == categorieArt) || (valCategorie == "toate");

            let dataArt = art.getElementsByClassName("val-data")[0].innerHTML;
            if (dataArt.includes("mar")) dataArt = '3'; 
            else if(dataArt.includes("apr")) dataArt = '4';
            else if(dataArt.includes("may")) dataArt = '5';
            else if(dataArt.includes("jun")) dataArt = '6';
            else if(dataArt.includes("jul")) dataArt = '7';
            else if(dataArt.includes("aug")) dataArt = '8';
            else if(dataArt.includes("sep")) dataArt = '9';
            else if(dataArt.includes("oct")) dataArt = '10';
            else if(dataArt.includes("nov")) dataArt = '11';
            else if(dataArt.includes("dec")) dataArt = '12';
            else if(dataArt.includes("jan")) dataArt = '1';
            else if(dataArt.includes("feb")) dataArt = '2';
            console.log(dataArt);
            let valData = document.getElementById("inp-luna").value;
            var selected = [];
            for (var option of document.getElementById('inp-luna').options)
            {
                if (option.selected) {
                    selected.push(option.value);
                }
            }
            console.log(selected);

            let conditie5 = selected.includes(dataArt);
            console.log(conditie5)

            let disccoloratArt = art.getElementsByClassName("val-disc_colorat")[0].innerHTML;
            if (disccoloratArt == "true") disccoloratArt = true;
            else disccoloratArt = false;
            let valDiscColorat = document.getElementById("inp-disc-colorat").checked;
            
            let conditie6 = disccoloratArt == valDiscColorat || valDiscColorat == false;
            console.log(disccoloratArt);
            console.log(valDiscColorat);
            console.log(conditie6);

            // var conditie3=false;
            // switch (valDimensiune){
            //     case "1": conditie3= (dimensiuneArt<=7); break;
            //     case "2": conditie3= (dimensiuneArt>7 && dimensiuneArt<=12); break;
            //     case "3": conditie3= (dimensiuneArt>12); break;
            //     default: conditie3=true;

            // }
            // console.log(conditie3);

            // var selCateg=document.getElementById("inp-categorie");
            // var conditie4= (art.getElementsByClassName("val-categorie")[0].innerHTML == selCateg.value ||  selCateg.value=="toate");

            var desc=art.getElementsByClassName("val-descriere")[0];
            console.log(desc.innerHTML.toLowerCase());
            console.log(document.getElementById("inp-descriere").value.toLowerCase());
            var conditie7=desc.innerHTML.toLowerCase().includes(document.getElementById("inp-descriere").value.toLowerCase().trim()) || document.getElementById("inp-descriere").value.toLowerCase().trim().includes("Introdu descrierea");
            
            console.log(conditie7);

            var genuri = art.getElementsByClassName("val-genuri")[0];
            console.log(genuri.innerHTML.toLowerCase());
            var valGenuri = document.getElementById("input-genuri").value.toLowerCase();
            console.log(valGenuri);
            
            var conditie8 = genuri.innerHTML.toLowerCase().includes(valGenuri);
            console.log(conditie8);


            if(conditie1 && conditie2 && conditie3 && conditie4 && conditie5 && conditie6 && conditie7 && conditie8)
                art.style.display="block";
            
        }
    }
    var rng=document.getElementById("inp-pret");
    rng.onchange=function(){
        var info = document.getElementById("infoRange");//returneaza null daca nu gaseste elementul
        if(!info){
            info=document.createElement("span");
            info.id="infoRange"
            this.parentNode.appendChild(info);
        }
        
        info.innerHTML="("+this.value+")";
    }



    function sorteaza(semn){
        var articole=document.getElementsByClassName("produs");
        var v_articole=Array.from(articole);
        v_articole.sort(function(a,b){
            var nume_a=a.getElementsByClassName("val-artist")[0].innerHTML;
            var nume_b=b.getElementsByClassName("val-artist")[0].innerHTML;
            if(nume_a!=nume_b){
                return semn*nume_a.localeCompare(nume_b);
            }
            else{
                
                var pret_a=parseInt(a.getElementsByClassName("val-pret")[0].innerHTML);
                var pret_b=parseInt(b.getElementsByClassName("val-pret")[0].innerHTML);
                return semn*(pret_a-pret_b);
            }
        });
        for(let art of v_articole){
            art.parentNode.appendChild(art);
        }
    }

    var btn2=document.getElementById("sortCrescNume");
    btn2.onclick=function(){
        
        sorteaza(1)
    }

    var btn3=document.getElementById("sortDescrescNume");
    btn3.onclick=function(){
        sorteaza(-1)
    }


    document.getElementById("resetare").onclick=function(){
        //resetare inputuri
        document.getElementById("i_rad4").checked=true;
        document.getElementById("inp-pret").value=document.getElementById("inp-pret").min;
        document.getElementById("infoRange").innerHTML="("+document.getElementById("inp-pret").min+")";

        //de completat...


        //resetare articole
        var articole=document.getElementsByClassName("produs");
        for(let art of articole){

            art.style.display="block";
        }
    }
    
    // -------------------- selectare produse cos virtual----------------------------------
    /*
        indicatie pentru cand avem cantitati
        fara cantitati: "1,2,3,4" //1,2,3,4 sunt id-uri
        cu cantitati:"1:5,2:3,3:1,4:1" // 5 produse de tipul 1, 3 produse de tipul 2, 1 produs de tipul 3...
        putem memora: [[1,5],[2,3],[3,1],[4,1]]// un element: [id, cantitate]

    */
    ids_produse_init=localStorage.getItem("produse_selectate");
    if(ids_produse_init)
        ids_produse_init=ids_produse_init.split(",");//obtin vectorul de id-uri ale produselor selectate  (din cosul virtual)
    else
        ids_produse_init=[]

    var checkboxuri_cos = document.getElementsByClassName("select-cos");
    for (let ch of checkboxuri_cos){
        if (ids_produse_init.indexOf(ch.value)!=-1)
            ch.checked=true;
        ch.onchange=function(){
            ids_produse=localStorage.getItem("produse_selectate")
            if(ids_produse)
                ids_produse=ids_produse.split(",");
            else
                ids_produse=[]
            console.log("Selectie veche:", ids_produse);
            //ids_produse.map(function(elem){return parseInt(elem)});
            //console.log(ids_produse);
            if(ch.checked){
                ids_produse.push(ch.value);//adaug elementele noi, selectate (bifate)
            }
            else{
                ids_produse.splice(ids_produse.indexOf(ch.value), 1) //sterg elemente debifate
            }
            console.log("Selectie noua:",ids_produse);
            localStorage.setItem("produse_selectate",ids_produse.join(","))
        }
    }
 });


 window.onkeydown=function(e){
    console.log(e);
    if(e.key=="c" && e.altKey==true){
        if(!document.getElementById("psuma")){
            var suma=0;
            var articole=document.getElementsByClassName("produs");
            for(let art of articole){
                if(art.style.display!="none")
                    suma+=parseFloat(art.getElementsByClassName("val-pret")[0].innerHTML);
            }
    
            var pSuma = document.createElement("p");
            pSuma.id = "psuma";
            pSuma.innerHTML="<b>Suma: </b>"+suma;
            var sectiune = document.getElementById("produse");
            sectiune.parentElement.insertBefore(pSuma, sectiune);
            setTimeout(function(){
                let p = document.getElementById("psuma");
                if(p){
                    p.remove();
                }
            }, 5000)
        }
        
    }



    //---------------------cos virtual--------------------

    var checkboxuri = document.getElementsByClassName("select-cos");
for (let ch of checkboxuri) {
    ch.onchange = function() {
        iduriCos = localStorage.getItem("cos_virtual"); // 1, 5, 3
        // hint pentru cantitate "1|20,5|10,..."
        if(!iduriCos)
            iduriCos = [];
        else {
            iduriCos = iduriCos.split(",");
        }

        if (this.checked) {
            iduriCos.push(this.value);
        } else {
            var poz = iduriProduse.indexOf(this.value);
            if (poz != -1)
                iduriProduse.splice(poz, 1);
        }
        localStorage.setItem("cos_virtual", iduriCos.join(","));
    }
}

 }