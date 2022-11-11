window.addEventListener("DOMContentLoaded", function(){
    localStorage.setItem("tema", "light");
    var tema = localStorage.getItem("tema");
    if(!tema)
        localStorage.setItem("tema", "light");
    else
        if(tema == "dark"){
            document.body.classList.add("dark");
        }

    btn = document.getElementById("btn_tema");
    if(btn){
        btn.onclick = function(){
            document.body.classList.toggle("dark");
            if(document.body.classList.contains("dark"))
                {
                    localStorage.setItem("tema", "dark");
                    document.getElementById("pic_tema").classList.remove('fas fa-sun');
                    document.getElementById("pic_tema").classList.add('fas fa-moon');
                }
            else
            {
                localStorage.setItem("tema", "light");
                document.getElementById("pic_tema").classList.remove('fas fa-moon');
                document.getElementById("pic_tema").classList.add('fas fa-sun');
            }
        }
    }   
        
    
});