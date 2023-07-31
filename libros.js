// VARIABLES GLOBALES
let list=[];
const nameFilter$$=document.querySelector(".nameInput");
let rangePages$$=document.getElementById("maxPages");
let genreFiler$$=document.getElementById("genre");
const numLibrary$$=document.getElementById("numLibrary");
const numList$$=document.getElementById("numList");
let maxNumPages$$=document.querySelector(".maxNumPages");


// EVENTOS DE PARA FILTROS
nameFilter$$.addEventListener("input",function(){filter()});
genreFiler$$.addEventListener("change",function(){filter()})
rangePages$$.addEventListener("input",function(){showTarget()});
rangePages$$.addEventListener("change",function(){filter()});


/////////// TEMA OSCURO - CLARO /////////////////
const colorSwitch = document.querySelector('#switch input[type="checkbox"]');
// FUNCION PARA CAMBIO DE TEMA DARK O LIGHT
function cambiaTema(ev){
    if(ev.target.checked){
        document.documentElement.setAttribute('tema', 'light');
    } else {
        document.documentElement.setAttribute('tema', 'dark');
    }
}
colorSwitch.addEventListener('change', cambiaTema);





// FUNCION CONTROLA EVENTO INPUT DE BARRA DE NUMERO DE PAGINAS
showTarget = ()=>{
    
    maxNumPages$$.textContent=rangePages$$.value;
}


// FUNCION INICIAL 
startData= async ()=>{
    
    //OBTIENE DATOS DE BOOK.JSON
    const call = await fetch("./books.json");
    const allBooks= await call.json();
    const library = JSON.stringify(allBooks.library);
    // COMPRUEBA SI EXISTEN CLAVES EN LOCALSTORAGE
    if (!localStorage.getItem("library")){
        localStorage.setItem("library",library );
        localStorage.setItem("readingList", list);
          // LLAMA A FUNCION QUE PINTA LOS NODOS EN EL HTML    
        printData(allBooks.library,list);
    }
    else{
        let library = localStorage.getItem("library");
        library=JSON.parse(library);
        let readingList= localStorage.getItem("readingList");
        if (!readingList){
            readingList=[];
        }else{
            readingList=JSON.parse(readingList);
        }
        
        printData(library, readingList);

    }
    
  
}

// FUNCION QUE GESTIONA LOS FILTROS Y REGENERA LISTA A MOSTRAR
filter = ()=>{
    let nameValue=nameFilter$$.value;
    let genreValue=genreFiler$$.value;
    let numPagesValue=rangePages$$.value;
    let tempList=JSON.parse(localStorage.getItem("library"));
    let maxNum=0;
    
    // GENERA LISTA FILTRANDO POR VALOR DE INPUT DE NOMBRE
    tempList = tempList.filter((book) =>{
        if (book.book.title.toLowerCase().includes(nameValue.toLowerCase())){
          return book;
        }
    })
   

    // GENERA LISTA SI SE HA SELECCIONADO ALGUN GENERO DEL NODO SELECT
    if (genreValue != "All"){
        tempList = tempList.filter((book)=>{
            if (book.book.genre.toLowerCase() === genreValue.toLowerCase()){
                return book;
            }
        })
    }
   

    // BUCLE PARA OBTENER LIBRO CON NUMERO MAXIMO DE PAGINAS SEGUN LOS FILTROS YA ESTABLECIDOS
    tempList.forEach((book)=>{
        if (book.book.pages > maxNum){maxNum=book.book.pages}
    })

    
    // GENERA LISTA FILTRANDO POR EL NUMERO MAXIMO DE PAGINAS
    tempList = tempList.filter((book)=>{
        if (book.book.pages <= numPagesValue){
            return book;
        }
    })
   
    let readingList= localStorage.getItem("readingList");
    readingList=JSON.parse(readingList);
    printData(tempList,readingList);
}


// FUNCION QUE PINTA LOS NODOS EN EL HTML
printData = (list,readingList) =>{
   
    // SELECCIONA LAS LISTAS
    const ul$$= document.querySelector(".container__ul");
    let readingUl$$= document.querySelector(".reading__ul");
   
  
    
    // VACIA EL CONTENIDO DE LA LISTA LIBRERIA
    ul$$.innerHTML=``;
    // PINTA NUMERO DE LIBROS TOTAL EN ARRAY LIBRERIA
    numLibrary$$.textContent=list.length;
    
    // OBTENER NUMERO DE PAGINAS MAXIMO DE LOS LIBROS A IMPRIMIR
    let maxNum = 0;
   
    // BUCLE QUE CREA CADA LI (ITEM) DE LA LISTA DE LIBRERIA
    list.forEach(element => {
       if (element.book.pages > maxNum){maxNum=element.book.pages}
       
        let item=document.createElement("li");
        let itemContent=document.createElement("div");
        let button=document.createElement("button");
        item.className="ul__item";
        itemContent.className="div__item";
        // AÑADE EVENTO CLICK Y PASA POR PARAMETRO EL ISBN (USADO COMO ID) DEL LIBRO
        itemContent.addEventListener("click",function(){ detailsModal(element.book)});
        itemContent.innerHTML=`<h3>${element.book.title}</h3>
        <p>Páginas: ${element.book.pages}</p>
        <p>Año: ${element.book.year}</p>
        <img src="${element.book.cover}" alt="${element.book.title}" class="ul__img">
       `;
        item.appendChild(itemContent);
        button.textContent="Añadir a lista lectura";
        button.className="btn__add";
        button.addEventListener("click",function(){ handleList(element.book)});
        item.appendChild(button);

        ul$$.appendChild(item);
        
        
    });

    // SETEA EL INPUT TARGET DEL FILTRO POR NUMERO DE PAGINAS
    rangePages$$.setAttribute("max",maxNum);
    rangePages$$.value=maxNum;
    
    maxNumPages$$.textContent=maxNum;

    
    // PINTA CONTENIDO DE READINGN LIST SI TIENE ALGO 
    if (readingList.length != 0){

    readingUl$$.innerHTML=``;
        
    // PINTA NUMERO DE LIBROS TOTAL EN ARRAY READING LIST
    numList$$.textContent=readingList.length;
    document.getElementById("btnShowList").disabled = false;
    // BUCLE QUE CREA CADA LI (ITEM) DE LA READING LIST
    readingList.forEach(element => {
       
        let item=document.createElement("li");
        let itemContent=document.createElement("div");
        let button=document.createElement("button");
        item.className="readingul__item";
        itemContent.className="div__item";
        // AÑADE EVENTO CLICK Y PASA POR PARAMETRO EL ISBN (USADO COMO ID) DEL LIBRO
        itemContent.addEventListener("click",function(){ detailsModal(element)});
        itemContent.innerHTML=`<h3>${element.title}</h3>
        <h5>Páginas: ${element.pages}</h5>
        <h5>Año: ${element.year}</h5>
        <img src="${element.cover}" alt="${element.title}" class="readingul__img">
       `;
       item.appendChild(itemContent);
       button.textContent="Quitar de la lista";
       button.className="btn__remove";
       button.addEventListener("click", function(){ handleReadingList(element)});
       item.appendChild(button);
       readingUl$$.appendChild(item);
        
        
    });
    }
    else{
        let btn$$=document.getElementById("btnShowList");
       // DESHABILITA BOTON VER LISTA DE LECTURA SI READINGLIST NO TIENE NADA
        btn$$.textContent = "Ver";
        btn$$.disabled = true;
        readingUl$$.innerHTML=``;
        readingUl$$.style.display="none";
        ul$$.style.width="100%";
        numList$$.textContent=0;
    }


}

showReadingList=()=>{
    let readingUl$$= document.querySelector(".reading__ul");
    let btn$$=document.getElementById("btnShowList");
   
    readingUl$$.style.display === "flex" ? readingUl$$.style.display="none" : readingUl$$.style.display="flex";
    btn$$.textContent === "Ver" ? btn$$.textContent = "Ocultar" : btn$$.textContent = "Ver";
    
    
}
 // FUNCION QUE MUESTRA EL DETALLE DEL LIBRO CLICKADO EN UN MODAL
detailsModal = (book)=>{
   
    const modal$$= document.querySelector(".modal");
    modal$$.innerHTML=``;
    modal$$.style.display="block";
    let modal=document.createElement("article");
    modal.className="showmodal";
    modal.innerHTML=`
    <img src="${book.cover}" alt="${book.title}" class="readingul__img">
    <article>
        <h3>${book.title}</h3>
        <h6>Autor: ${book.author.name}</h6>
        <h6>Género: ${book.genre}</h6>
        <h6>Páginas: ${book.pages}</h6>
        <h6>Año: ${book.year}</h6>
        
        <p>${book.synopsis}</p>
    </article>
    <span class="closemodal" onclick="closeModal()">X</span>
    
    `;
    modal$$.appendChild(modal);

}
 // FUNCION PARA CIERRE DEL MODAL DE DESCRIPCION PULSANDO X
closeModal=()=>{
    const modal$$= document.querySelector(".modal");
    modal$$.style.display="none";
}
 // CONTROLA CIERRE DEL MODAL DE DESCRIPCION PULSANDO EN CUALQUIER PARTE DE LA PAGINA
window.onclick = function(event) {
    
    const modal$$= document.querySelector(".modal");
   
    if (event.target == modal$$) {
      modal$$.style.display = "none";
    }
  }


// FUNCION QUE CONTROLA EL CLICK PARA LA LISTA DE LECTURA
handleList=(data)=>{

    //ELIMINA DEL ARRAY LIBRERIA EL ELEMENTO QUE PASA AL ARRAY LISTA DE LECTURA
    let library = localStorage.getItem("library");
    library=JSON.parse(library);
    let newLibrary = library.filter((book) => book.book.ISBN != data.ISBN);
    localStorage.setItem("library",JSON.stringify(newLibrary));
    
    let readingList;
    // CON EL ARRAY LIST ALMACENAMOS ISBN DE LIBROS CLICKADOS 
    if (list.length === 0){
        list.push(data);
        localStorage.setItem("readingList", JSON.stringify(list));
        readingList=list;

    }
    else{
       
        let newList=localStorage.getItem("readingList");
        newList=JSON.parse(newList);
        newList.push(data);
        localStorage.setItem("readingList", JSON.stringify(newList));
        readingList=newList;
        console.log(newList);

    }

  
    printData(newLibrary,readingList);
    nameFilter$$.value="";
    

}

handleReadingList = (book) =>{
    //ACTULIZO ARRAY LIBRERIA CON NUEVO LIBRO QUE SALE DE LA READING LIST
    let library = localStorage.getItem("library");
    library=JSON.parse(library);
    let newBook={"book":book};
    //console.log(newBook);
    library.push(newBook);
    localStorage.setItem("library",JSON.stringify(library));

    // ACTUALIZO ARRAY READING LIST QUITANDO LIBRO QUE VA AL ARRAY LIBRERIA
    let ReadingList=localStorage.getItem("readingList");
    ReadingList=JSON.parse(ReadingList);
    let newReadingList= ReadingList.filter((bookInList)=> bookInList.ISBN != book.ISBN );
    localStorage.setItem("readingList",JSON.stringify(newReadingList));

   
    printData(library, newReadingList);
    nameFilter$$.innerHTML=``;


}

// FUNCION QUE RESETEA LOS FILTRO
resetFilter =()=>{
    nameFilter$$.value="";
    genreFiler$$.value="All";
    let tempList=JSON.parse(localStorage.getItem("library"));
    let maxNum = 0;
    
    tempList.forEach(element => {
       if (element.book.pages > maxNum){maxNum=element.book.pages}
    });
    
    rangePages$$.setAttribute("max",maxNum);
    rangePages$$.value=maxNum;
   
    filter();
}

// ARRANCA LA APP
startData();