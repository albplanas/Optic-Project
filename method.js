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
       
           testing: function(){
              console.log(Store);
           }
        }
}());

/************************ Modulo  Methods ************************** */

var Methods=(function(){
    /***********Methos para los elementos del plano */
    var Maths={

        //Para calcular el angulo menor entre dos rectas;
        Ang_between : function (v1,v2){
            return Math.atan(v2.slope)-Math.atan(v1.slope);
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
            console.log(int.x);
            int.y=v2.slope*int.x+v2.inter;
            }
        return int;
    }
    
    }

    /*********************** Methods for light's rays*************/
   
    var Light={
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
       }

}
    
}());





//Global aap controller
var Controller= (function(dat,met){
    //Bottons and Clicks events


    document.addEventListener('contextmenu',function ShowContextMenu(event){
          
        contextMenu.style.display="block";
        contextMenu.style.left=event.clientX+"px";
        contextMenu.style.top=event.clientY+"px";
        return false;
});

}(Data,Methods)); 




Data.addPto(3,3);
Data.addPto(3,4);
Data.addVect(0,1);

