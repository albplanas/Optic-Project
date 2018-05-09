/***********************Plane Geometry *************/
//Data {Points, Vectors,Lines,Figures}
var Data=(function(){
    
   var Searcher=function(tag,id){
        for(var i=0;i<Store[tag].length;i++){
            if(id===Store[tag][i].id){
               return Store[tag][i];
            }
        }
   }

    //constructor for cartesian points
    var Pto=function(x,y,id){
        this.id=id;
        this.x=x;
        this.y=y;
    }

    //constructor for Vectors
     var Vector=function(id1,id2,id){

         this.id=id;

         //Buscar los puntos por su id
         var a=Searcher("Puntos",id1);
         var b=Searcher("Puntos",id2);
        if(a.x===b.x){
            this.slope=Infinity;
            this.cero=a.x
        }
        else{
        this.slope=(a.y-b.y)/(a.x-b.x);
        this.inter=a.y-this.slope*a.x;
        if(this.slope!==0){
        this.cero=-1*this.inter/this.slope;
        }
        }
    }
 
    var Device={
        //constructor for a mirrror
    //a and b is the border of the mirror , R is curvature, Vector directional  
         Mirror: function(R,a,b,sig){
            this.r=R;
            this.a=a;
            this.b=b;
            this.sig=sig;
        }
    };

    var Source={
        //constructor for a source
    //punto ,slope,signe and id  
        Haz:function(id1,slope,sig,id){
            this.id=id;
            this.slope=slope;
            this.sig=sig;
            this.pto=Searcher("Puntos",id1);
        }
    };
    var Store={
        Puntos:[],
        Vectors:[],
        Devices:[],
        Sources:[]
    };
    
    return{
        addPto: function(x,y){
                var ID,newItem;
                //create a new id
                if(Store.Puntos.length===0){
                    ID=0;
                }
                else{
                   ID=Store.Puntos[Store.Puntos.length-1].id+1;  
                } 
                //create the item
                newItem=new Pto(x,y,ID);
                //push the new item
                Store.Puntos.push(newItem);
                   return newItem;
           },

           addVect: function(id1,id2){
            var ID,newItem;
            //create a new id
            if(Store.Vectors.length===0){
                ID=0;
            }
            else{
               ID=Store.Vectors[Store.Vectors.length-1].id+1;  
            } 
            //create the item
            newItem=new Vector(id1,id2,ID);
            //push the new item
            Store.Vectors.push(newItem);
               return newItem;
       },
        //parametros pmtrs=[id del punto,slope,signo]
       addSource: function(tag,pmtrs){
        var ID,newItem;
        //create a new id
        if(Store.Sources.length===0){
            ID=0;
        }
        else{
           ID=Store.Sources[Store.Sources.length-1].id+1;  
        } 
        //create the item
        newItem=new Source[tag](pmtrs[0],pmtrs[1],pmtrs[2],ID);
        //push the new item
        Store.Sources.push(newItem);
           return newItem;
   },
           
           getElem: function(type,id){
              return Searcher(type,id);
           }
        }
}());

/************************ Modulo  Methods ************************** */

var Methods={
    /***********Methos para los elementos del plano */
     Maths:{

        //Para calcular el angulo menor entre dos rectas;
        Ang_between : function (v1,v2){
            return Math.atan(v2.slope)-Math.atan(v1.slope);
        },

        //Distancia entre dos puntos
        Dist_between:function(p1,p2){
                return Math.pow(Math.pow(p1.x-p2.x,2)+Math.pow(p1.y-p2.y,2),0.5);
        },

        // To Know the intersertion between two lines
        Inter_between:function (v1,v2){
            var int=new Pto();
            //rectas paralelas
            if(v1.slope===v2.slope){return undefined;}
            //rectas de pendiente infinitas
            if(v2.slope===Infinity)
            {
            int.x=v2.cero;
            int.y=v1.slope*int.x+v1.inter;
            }
            else if(v1.slope===Infinity)
            {
            int.x=v1.cero;
            int.y=v2.slope*int.x+v2.inter;
            }
            //caso generico
            else{
            int.x=-1*(v2.inter-v1.inter)/(v2.slope-v1.slope);
            int.y=v2.slope*int.x+v2.inter;
            }
        return int;
    }
    
    },

    /*********************** Methods for light's rays*************/
   
     Light:{
        //this superficie is defined by a vector
        Reflection: function (vect,Vect_normal,point){
            //calcule to slope
            var Vect_Ref={slope:0,inter:0,cero:0};
            //angulo entre los vectores
            var alpha=Ang_between(vect,Vect_normal);
            var omega=Math.atan(Vect_normal.slope);
            //calculo de Vector reflejado
            Vect_Ref.slope=Math.tan(omega+alpha);
            if(Vect_Ref===Infinity){Vect_Ref.cero=point.x;}
            else if(Vect_Ref===0){Vect_Ref.inter=point.y;}
            else{
                Vect_Ref.inter=point.y-Vect_Ref.slope*point.x;
                Vect_Ref.cero=-1*Vect_Ref.inter/Vect_Ref.slope;
            }
            return Vect_Ref;
       },

       Cut_path:function(id_haz){

        var Pt_intercep=[];   
        var hz=Data.getElem("Sources",id_haz);

           var Intersection={ 
            Intersection_Device:function(id_device){
                var elem= Data.getElem("Devices",id_device);
                if(elem.type="mirror")
            },


            Intersection_border:function(){
                var X_border=850;
                var Y_border=850;

                if(hz.slope===0){
                    var p1=Data.addPto(0,hz.pto.y);
                    var p2=Data.addPto(X_border,hz.pto.y);
                   return [p1,p2];
                }
                if(hz.slope===Infinity){
                    var p1=Data.addPto(hz.pto.x,0);
                    var p2=Data.addPto(hz.pto.x,Y_border);
                    return [p1,p2];
                }
                var n_hz=hz.pto.y-hz.pto.x*hz.slope;
                var p1=Data.addPto(0,n_hz);
                var p2=Data.addPto((-1*n_hz/hz.slope),0);
                var p3=Data.addPto(X_border,hz.slope*X_border+n_hz);
                var p4=Data.addPto((Y_border-n_hz)/(hz.slope),Y_border);
                return [p1,p2,p3,p4];
            }

           };

           Pt_intercep=Pt_intercep.concat(Intersection.Intersection_border(id_haz)); 

        return Pt_intercep;


       }

}
    
};

/******************DISPLAY MODULE CONTROLLER****************/

var DrawController=(function(){
    var canvas,ctx;
    var main=function(){  
        canvas=document.getElementById('base');

        if(canvas.getContext('2d')){
            ctx=canvas.getContext('2d');
        }
        else{
            alert("esto no corre en este browser");
        }
    };
    var pointSet=[30, 30, 50, 50];

    var Rectangle=function(pointSet){
        ctx.fillStyle = 'rgba(0,0,200,0.5)';
        ctx.strokeRect(pointSet[0], pointSet[1], pointSet[2], pointSet[3]);
    };
   var Line=function(a,b){
           // Stroked triangle
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x,b.y);
            ctx.stroke();
        };
   
   var Arc=function(O,r, startAngle, endAngle, rotation){
    ctx.beginPath();
    ctx.arc(O.x, O.y, r, startAngle, endAngle, rotation);
    ctx.stroke();
   }
   var Conic=function(type,a,b,c,d,e){
//funcion parametrica pero todavia no se la relacion entre los coeficientes


   };

        return{
            getContextCanvas:function(){
                main();
            },
            get_draw_ray:function(id_haz){   //tengo que buscar cual es el primer punto en el que choca
               
            },  
            get_draw_mirror:function(id_mirror){

            }  
        }    
  }());

var DisplayController= (function(){

 var DOMstrings={
     Create:".Create",
     inputX: 'x-axis',
     inputY:'y-axis',
     inputSlope: 'Slope'
  };

  

  return {
      getDOMstrs:function(){
          return DOMstrings;
      },

      getInput:function(){
  
        return {
            
            x_axis: document.getElementById(DOMstrings.inputX).value-0 ,
            y_axis: document.getElementById(DOMstrings.inputY).value-0 ,
            inp_slope:document.getElementById(DOMstrings.inputSlope).value  
         };
     }
  }
  }()); 

/*****************Global aap controller**********************/

var Controller= (function(DrawCtrl,DispCtrl,dat){
  //Interacction between all of modules
 var IDs=DispCtrl.getDOMstrs();
  

 //Context Menu
    var ShowContextmenu=function(event){
        window.onclick=hideMenu;
        window.onkeydown=listenKeys;

    var contextMenu=document.getElementById('contextMenu');

            contextMenu.style.display="block";
            contextMenu.style.left=event.clientX+"px";
            contextMenu.style.top=event.clientY+"px";

            function hideMenu(){
                contextMenu.style.display="none";
            }
            
            function listenKeys(event){
                var keyCode=event.which || event.keyCode;
                if(keyCode===27){
                    contextMenu.style.display="none";
                }
                
            }

        return false; 
    };
    
    var CascadingMenu=function(event){ 

        var subMenu1=document.getElementById('subMenu1');
        var subMenu2=document.getElementById('subMenu2');
        var subMenu3=document.getElementById('subMenu3');
        
        document.addEventListener("click", function(event){
            var target=event.target.parentNode.id;

            if(target==='Create' || target==='Remove'||target==='Edit'){
                subMenu1.style.display="block";
                subMenu1.style.left=event.clientX+"px";
                subMenu1.style.top=event.clientY+"px";
            } 
            else{
                subMenu1.style.display="none";
            }
            
            if(target==="Source"){
            subMenu2.style.display="block";
            subMenu2.style.left=(event.clientX)+"px";
            subMenu2.style.top=event.clientY+"px";
           } 
           else{
            subMenu2.style.display="none";
           }
           if(target==="Device"){
            subMenu3.style.display="block";
            subMenu3.style.left=(event.clientX)+"px";
            subMenu3.style.top=event.clientY+"px";
           }
           else{
                 subMenu3.style.display="none";
           }
           
         }); 
   
    };

     var updateScreen=function(event){
        document.addEventListener("click", function(event){
            var target=event.target.parentNode.id;
            var type="Haz"
            if(target===type){
                var screen=document.getElementById('board-'+type);
                screen.style.display="block";
            }
        });
    }

    var newItem=function(event,type){
    
        document.addEventListener("click", function(event){
            var target=event.target.parentNode.id;
            if(target==='done'){
            //get input
            var input=DispCtrl.getInput();
            if(input.inp_slope==='Infinity')
            {
                input.inp_slope=Infinity;
            }
            else{
                input.inp_slope=input.inp_slope-0;
            }


            if(isNaN(input.x_axis) || isNaN(input.y_axis) || isNaN(input.inp_slope)){
                console.log(input);
                alert("Incompleted Fields");
            }
            else{
                console.log(input);
                AddNewItem(type,input);
            }
        }
        if(target==='cancel'){
            var screen=document.getElementById(event.target.parentNode.parentNode.id);
            screen.style.display='none';
        }
            
        });
       

    };

    var AddNewItem=function(type,input){
        if(type==="Haz"){
            var Pto=dat.addPto(input.x_axis,input.y_axis);
            var sig="+";                        //Esto hay que arreglarlo el signo esta out of service
            var parametros=[Pto.id,input.inp_slope,sig];
            dat.addSource(type,parametros);
        }

    }
    
    
       

       
 
  
  
    return {
    getContextMenu: function(){
       return ShowContextmenu(event);
    },

    init: function(){
        console.log("Application has started.");
        DrawCtrl.getContextCanvas();
        CascadingMenu(event);
        newItem(event,"Haz");
        updateScreen(event);
    }
};

}(DrawController,DisplayController,Data)); 

Controller.init();

var a=Data.addPto(100,100);
var b=Data.addPto(650,650);
var c=Data.addPto(100,300);
var d=Data.addPto(350,450);
var h=Data.addSource("Haz",[a.id,0.5,"+"]);
console.log(h);
console.log(Methods.Light.Cut_path(h.id));
