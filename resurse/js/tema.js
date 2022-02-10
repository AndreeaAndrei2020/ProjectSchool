
window.addEventListener("load",function() { 

    let temaSelectata = localStorage.getItem("tema") /*luam itemul tema*/
    if(temaSelectata == "dark") /* vedem daca e null, in caz de e prima data cand intru pe pagina*/
        document.body.classList.add("dark");  /* adaugam clasa dark*/

        document.getElementById("schimbare-tema").onclick = function(){
        document.body.classList.toggle("dark");         /* toogle= daca exista o sterge, daca nu exsita o adauga clasa*/
        
        if(document.body.classList.contains("dark"))  
            localStorage.setItem("tema","dark")  /* memorez in local storage ca are clasa dark*/
        else
            localStorage.setItem("tema","light")
    }

});