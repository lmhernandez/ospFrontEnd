var uuid = 0;
const LOCAL_MOVIES='movies';
var currentId;
var isNew=true;

class Movie{
    constructor(id, name, date , state){
        this.id = id;
        this.name = name;
        this.date = date;
        this.state = state;
    }
    save(callback,currentId){
        this.id=this.generateUUID(currentId);
        let movies=JSON.parse(window.localStorage.getItem(LOCAL_MOVIES));
        movies.push(this);

        window.localStorage.setItem(LOCAL_MOVIES,JSON.stringify(movies));
        callback();
    }
    update(callback){
        let movies=JSON.parse(window.localStorage.getItem(LOCAL_MOVIES));
        for (var i = 0; i < movies.length; i++) {
            //var element=movies[i];
            if(movies[i].id==this.id){
                movies[i].name=this.name;
                movies[i].date=this.date;
                movies[i].state=this.state;
                break;
            }
        }
        window.localStorage.setItem(LOCAL_MOVIES,JSON.stringify(movies));
        callback();
    }

    delete(callback){ 
        let movies=JSON.parse(window.localStorage.getItem(LOCAL_MOVIES));
        for (var i = 0; i < movies.length; i++) {
            //var element=movies[i];
            if(movies[i].id==this.id){
                movies.splice(i, 1); 
                break;
            }
        }        
        localStorage.setItem(LOCAL_MOVIES, JSON.stringify(movies)); 
        callback();
    }
    generateUUID(currentId) {
        uuid = currentId;
        uuid = Number.parseInt(uuid);
        uuid += 1;
        return uuid;
    };   
}


$(document).ready(function(){
    var fila ="";
    init();
    listMovies();
    /*Resetar titulo*/
    $(".reset_title").click(function(){
        $(".title_new").removeClass("hide")
        $(".title_edit").removeClass("show")
    });
    /*Abrir modal con bootstrap*/
    $(".openModal").click(function(){
        $('.modal').modal('show')
    })
    /*Plugin chosen select que pidieron como plus -> No enviar un link como indicaba el correo*/
    $(".chosen-select").chosen({width: "95%"}); 
    /*Plugin date picker*/
    $('.datepicker').datepicker({
        format: 'dd/mm/yyyy',
        language: 'es'
    });  
    /*Plugin jquery validate para el formulario*/
    $("form").validate({
        rules: {
            name: {required: true},
            status:{required:true},
            date:{required:true}
        }
    });
    /*Efecto del menu laterial izquierda -> enlace activo*/
    $(".list-group").on("click",".list-group-item-action",function(){
        $(".list-group-item-action").removeClass("active");
        $(this).addClass("active");
    })
    

    $(".modalMovie").on("click",".saveMovie", function(){
        let row=  $("tr:last");
        currentId=row.find('td').eq(0).text();
        if(currentId == 0 || currentId == null){
            currentId = 0;
        }
       if($("form").valid()){
            var peli1 = new Movie();
            peli1.date= $(".fecha").val();
            peli1.name=$(".name").val();
            peli1.state=$(".status").val();    
            if(!isNew){
                peli1.id=currentId; 
                peli1.update(listMovies);
            }else{
                peli1.save(listMovies,currentId);
            }
            isNew=true;
            $('form').trigger("reset"); 
            $('.modal').modal('hide');
        }
    })

    $(".movie").on("click",".editMovie", function(){
        $(".title_new").addClass("hide");
        let row=  $(this).parents('tr');
        currentId=row.find('td').eq(0).text();
        isNew=false;
        $(".name").val(row.find('td').eq(1).text());
        $(".fecha").val(row.find('td').eq(2).text());
        $(".status").val(row.find('td').eq(3).text());  
        $('.modal').modal('show');
        $(".title_edit").addClass("show");
    })

    $(".movie").on("click",".deleteMovie", function(){
        let row=  $(this).parents('tr');
        currentId=row.find('td').eq(0).text();
        let movie = new Movie;
        movie.id=currentId;
        movie.delete(listMovies);
    })

    function listMovies(){
        let movies=JSON.parse(window.localStorage.getItem(LOCAL_MOVIES));
        fila='';
        movies.forEach(function(element) {
            fila += `<tr>
                        <td>${element.id}</td>
                        <td>${element.name}</td>
                        <td>${element.date}</td>
                        <td>${element.state}</td>
                        <td>
                <a class="modal-trigger  editMovie" href="#modal1"><span><i class="Small material-icons">edit</i></span></a>
                <a class="deleteMovie"><span><i class="Small material-icons">delete</i></span></a>
                        </td>
                    </tr>`;
                   
        });
        $(".tbody").html($(fila));
    }

    function init(){
        let localData = window.localStorage.getItem(LOCAL_MOVIES);
        let movies = localData!= null && localData.length > 0 ? JSON.parse(localData) :[];
        if(movies.length==0){
            let movie=new Movie(null,'dareDevil','05/11/1900',"Activo");
            movie.id=movie.generateUUID(uuid);
            movies.push(movie);
        }
        window.localStorage.setItem(LOCAL_MOVIES,JSON.stringify(movies))
    }


});
