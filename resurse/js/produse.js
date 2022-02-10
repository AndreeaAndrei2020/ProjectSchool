
window.addEventListener("load",function() {

    /* pt afisarea valorii la range*/
     var slider = document.getElementById("id-pret");
     var output = document.getElementById("demo");
     output.innerHTML = slider.value;
     slider.oninput = function() {
        output.innerHTML = this.value;
        }
        

   /*Filtrare*/
    let nrproduse=0;

    let btn = document.getElementById("filtrare");
    btn.onclick = function() {

        let elemInput = document.getElementById("id-pret");
        let pretMax = elemInput.value;   /*aici iau valoarea pretului*/



        /*preiau datele din checkbox urile bifate*/
        var checkboxes=document.getElementsByName("culoare");		
        var sir=[]; 
        for(let ch of checkboxes){    /// iau pe rand fiecare checkboxes
            if(ch.checked)           ///verific daca e bifat
                sir.push(ch.value);  /// si il bag in array
        }
        

        //preluarea datelor din checkboxurile bifate multiple */
		var optiuni=document.getElementById("categorie").options;		
		sir1=[];
		for(let opt of optiuni){
			if(opt.selected)
				sir1.push(opt.value);
		}
       /// console.log("sir categorie: " ,sir1);
  
     
         //preluarea datelor din checkboxurile bifate  simple */
		var materiale=document.getElementById("materiale").options;		
		sir2=[];
		for(let opt of materiale){
			if(opt.selected)
				sir2.push(opt.value);
		}
       // console.log("sir: " ,sir2);
  

       //preluarea datelor din radiobutton-urile bifate
		var radiobuttons=document.getElementsByName("vaucher1");		
		sir4=[];
		for(let rad of radiobuttons){
			if(rad.checked){
				sir4.push(rad.value);
			}
		}
        console.log( sir4, "sir4")

        let textare = document.getElementById("id-textarea").value;   /* pt cautare*/
        textare = textare.split(",");
        
        
        let text = document.getElementById("id-nume").value;  /* pt cautarea dupa nume*/
        

        let produse = document.getElementsByClassName("produs");

        for (let prod of produse) {  /* verificam fiecare produs daca se potriveste conform filtrelor*/
            prod.style.display = "none"; ///fac produsul invizibil aici, ca apoi sa l fac vizibil
          
            let culoare = prod.getElementsByClassName("val-culoare")[0].innerHTML;
            let pret = parseInt(prod.getElementsByClassName("val-pret")[0].innerHTML);  ///convertesc la intreg si iau 0 pt ca getelement returneaza o colectie
           
            let conditie2 = pret <= pretMax;  ///produsele cu pretul mai mic sau egal cu cel selectat de noi pe pagina
            let conditie1 = sir.includes(culoare);
           
            let descriere = prod.getElementsByClassName("val-descriere")[0].innerHTML;
            let ok=0;
            for ( let i of textare)   /* verificam fiecare cuvant din CAUTARE daca e inclus in descrierea produsului*/
            { 
                if(descriere.includes(i))
                  ok=1;
                
            }
          /// console.log(textare)
            
            let conditie3 = ( ok == 1 );
            if (textare.length == 0)
                 conditie3 = true;

            let numegeanta = prod.getElementsByClassName("numegeanta")[0].innerHTML;
            let conditie4 = (text == numegeanta )
            if(text.length == 0)
            conditie4 = true;
           
            
          
            let vaucher = prod.getElementsByClassName("val-vaucher")[0].innerHTML;
            let categorie = prod.getElementsByClassName("categorieGenti")[0].innerHTML;
            let material = prod.getElementsByClassName("val-materiale")[0].innerHTML;
       
            if(sir2[0] == 'toate') /* pt materiale*/
                conditie6 = true;
            else
                conditie6 = material.includes(sir2[0])
           // console.log( " sir2 " , sir2 , " material ",material)
            
          // console.log( sir1, "categorie ", categorie)
            
            let conditie5 = true;
            if (sir1.length == 0)
            conditie5 = true;

            if (sir1.length > 0)
             conditie5 = ( categorie == sir1[0] );
       
           
            let conditie7 = (sir4[0]== vaucher)
            if(sir4.length == 0)
                conditie7 = true;
           // if(sir4[0]== vaucher)
                //console.log(sir4[0], " si ", vaucher , sir4[0]== vaucher)
           
            let conditieTotala = conditie1 &&  conditie2 && conditie3 && conditie4 &&  conditie5 && conditie6 && conditie7;        
          
            if(conditieTotala)
            {
                nrproduse = nrproduse+1; 
                prod.style.display="block";
            }
        } 


          if(nrproduse == 0)  ///daca nu avem niciun produs, afisam nu exista filtru 
            {
                alert("NU EXISTA NICIUN PRODUS CU ACEST FILTRU.");
            } 
          
    }
  

   





    /* CRESC / DESCRESC*/  
    function sortArticole(factor) {

        var produse = document.getElementsByClassName("produs");
        let arrayProduse = Array.from(produse);
        arrayProduse.sort(function(art1, art2) {
            let nume1 = art1.getElementsByClassName("numegeanta")[0].innerHTML;
            let nume2 = art2.getElementsByClassName("numegeanta")[0].innerHTML;
            let pret1 = art1.getElementsByClassName("val-pret")[0].innerHTML;
            let pret2 = art2.getElementsByClassName("val-pret")[0].innerHTML;
            let rez = factor * nume1.localeCompare(nume2)
            if (rez == 0)
                return factor * (pret1 - pret2);
            return rez;   /* daca e negativ, art1 e sortat dupa art2 */
        });
         

        for (let prod of arrayProduse) {
            prod.parentNode.appendChild(prod);
          
        }
       
    }

    btn = document.getElementById("sortCrescNume");
    btn.onclick = function() {
        sortArticole(1);
    }
    btn = document.getElementById("sortDescrescNume");
    btn.onclick = function() {
        sortArticole(-1);
    }









    /*  RESETARE */ 
 
            btn = document.getElementById("resetare");
            btn.onclick = function() {

                let produse = document.getElementsByClassName("produs"); 
                for (let prod of produse) {
                    prod.style.display = "block";
                }
            }





      

/*MEDIA*/   
        btn = document.getElementById("medie");
        btn.onclick = function() {
            var produse = document.getElementsByClassName("produs");
            let arrayProduse = Array.from(produse);
            let suma = 0;
            let nr = 0;
            arrayProduse.forEach(element => {
                let price = parseInt(element.getElementsByClassName("val-pret")[0].innerHTML);
                suma += price;
                nr++;
            });
            let medie = suma / nr;
            medie = Math.round(medie * 100) / 100;
             
            let mediaProd = document.getElementById("mediaProd");
            mediaProd.style.display = "block";
            mediaProd.innerHTML = `Media preturilor este: ${medie}`;
           
            /* setez sa stea 2 sec*/+
            setTimeout(function() {
                mediaProd.style.display = "none";
            }, 2000);
            return;
                            }
});
