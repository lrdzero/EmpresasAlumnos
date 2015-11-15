'use strict';

// importar
var express = require('express');
var fs = require('fs');
// instanciar
var app = express();
var bodyParser = require('body-parser');
var info='';

var sqlite3 = require('sqlite3').verbose();

var start = Date.now();
	
var db = new sqlite3.Database('./myDataBase.db');

//especificamos el subdirectorio donde se encuentran las páginas estáticas
app.use(express.static(__dirname + '/../public'));

//extended: false significa que parsea solo string (no archivos de imagenes por ejemplo)
app.use(bodyParser.urlencoded({ extended: false }));

var moduloPrueba={};

app.get('/', function(req, res){
 	var pagina='<!doctype html><html><head></head><body>';
      
    pagina += '<a href="/Empresa.html">Retornar</a>';
    pagina += '</body></html>';
    res.send(pagina);
});

// method: hacerClick 
// action: Se encarga de insertar una nueva empresa en la base de datos.
moduloPrueba.comprobacion= function(nombre1,res){
	
	var result =false;
	
	var dato=[];
	db.serialize(function(){
	 db.all("SELECT nombre  from empresa where nombre='"+nombre1+"'",function(err,row){
		dato.push({nom:row.nombre});		
		console.log(row.nombre);
		if(row.length==0){
			res(null,false);
			console.log("Entro en false");
		}
		else{
			res(null,true);
			console.log("Entro en true");
		}
		});
	
});
}	
 
moduloPrueba.insertarEmpresa=function(nombre,valor){
	db.run("Insert into empresa values(?,?2)",{1:nombre,2:valor});
}
  
app.post('/hacerClick', function(req,res){
	var data1 =req.body.numero1;
	var data2 =req.body.numero2;
	var num1 =parseInt(data2);
	result=true;
	comprobacion(data1,function(err,resultado){
		if(!resultado){
			console.log("Insertando");
			insertarEmpresa(data1,num1);
			var pagina='<!doctype html><html><head></head><body>';
     	 		pagina +='<p> Empresa creada.</p>';
        		 pagina += '<a href="Empresa.html">Retornar</a>';
         		pagina += '</body></html>';
         		res.send(pagina);
			
		}
		else{
			console.log("No insertado");
			var pagina='<!doctype html><html><head></head><body>';
     	 		pagina +='<p> Empresa existente en bd.</p>';
        		 pagina += '<a href="Empresa.html">Retornar</a>';
         		pagina += '</body></html>';
         		res.send(pagina);
		}
	});
	
	
	
});

//method: crearClificación
//action: Se encarga de crear una calificación para un alumno dentro de una empresa específica.

app.post('/crearCalificacion', function(req,res){
	var pagina='<!doctype html><html><head></head><body>';
     	 pagina +='<form action=\"nuevaCali\" method=\"post\"> Empresa<input type=\"text" name=\"textoEmp\" size=\"10\"><br> Alumno<input type=\"text\" name=\"textoAl\" size=\"10\"><br>Calificacion<input type=\"text\" name=\"calificacion\" size=\"10\"><br><input type=\"submit\" value=\"Registrar\"></fomr><br>';
         pagina += '<a href="Empresa.html">Retornar</a>';
         pagina += '</body></html>';
         res.send(pagina);	
});

app.post('/nuevaCali',function(req,res){
	var elemento=req.body.textoEmp;
	var elemento2=req.body.textoAl;
	var elemento3 = req.body.calificacion;
	var sqlite3 = require('sqlite3').verbose();
	var start=Date.now();
	var db = new sqlite3.Database('./myDataBase.db');
	var vector =[];
	var parar=false;
	
	db.serialize(function(){
	
			db.each("SELECT nombre1, nombre2 from calificaciones", function(err, row) {
				vector.push({title: row.nombre1, date: row.nombre2})
			},function(){
				for(var i=0;i<vector.length&&!parar;i++){
					if(vector[i].title.localeCompare(elemento)==0&&vector[i].date.localeCompare(elemento2)==0){
							console.log("Encontrado");
							parar=true;
					}
				}
				if(!parar){
					
					db.run("insert into calificaciones(nombre1,nombre2,calificacion) values(?,?2,?3)",{1:elemento,2:elemento2,3:elemento3});
					
					var pagina='<!doctype html><html><head></head><body>';
     	 					pagina +='<form action=\"nuevaCali\" method=\"post\"> Empresa<input type=\"text" name=\"textoEmp\" size=\"10\"><br> Alumno<input type=\"text\" name=\"textoAl\" size=\"10\"><br>Calificacion<input type=\"text\" name=\"calificacion\" size=\"10\"><br><input type=\"submit\" value=\"Registrar\"></fomr><br>';
						pagina +='<p>Alumno registrado correctamente<p>';
         					pagina += '<a href="Empresa.html">Retornar</a>';
         					pagina += '</body></html>';
         					res.send(pagina);
					db.close();
				}
				else{	
						var pagina='<!doctype html><html><head></head><body>';
     	 					pagina +='<form action=\"nuevaCali\" method=\"post\"> Empresa<input type=\"text" name=\"textoEmp\" size=\"10\"><br> Alumno<input type=\"text\" name=\"textoAl\" size=\"10\"><br>Calificacion<input type=\"text\" name=\"calificacion\" size=\"10\"><br><input type=\"submit\" value=\"Registrar\"></fomr><br>';
						pagina +='<p>Alumno ya registrado reintentelo<p>';
         					pagina += '<a href="Empresa.html">Retornar</a>';
         					pagina += '</body></html>';
         					res.send(pagina);	
					db.close();
				}
			});
	});
	
	
});

//method:borrar
//action: Se encarga de borrar una calificación de una empresa introduciendo previamente el nombre del alumno y la empresa.

app.post('/borrar',function(req,res){
	var pagina='<!doctype html><html><head></head><body>';
      pagina +='<form action=\"elimina\" method=\"post\"> Empresa: <input type=\"text" name=\"valor\" size=\"10\">Alumno: <input type=\"text" name=\"aBorrar\" size=\"10\"><input type=\"submit\" value=\"Borra elemento\"></fomr><br>';
    pagina += '<a href="Empresa.html">Retornar</a>';
    pagina += '</body></html>';
    res.send(pagina);
});

app.post('/elimina',function(req,res){
	var elemento=req.body.valor;
	var elemento2=req.body.aBorrar;
	var sqlite3 = require('sqlite3').verbose();
	console.log(elemento);
	var start = Date.now();
	var db = new sqlite3.Database('./myDataBase.db');
	var parar=false;
	var vector=[];
	db.serialize(function(){
	
			db.each("SELECT nombre1, nombre2 from calificaciones", function(err, row) {
				vector.push({empresa: row.nombre1, usuario: row.nombre2})		
			},function(){
				for(var i=0;i<vector.length&&!parar;i++){
					if(vector[i].empresa.localeCompare(elemento)==0&&vector[i].usuario.localeCompare(elemento2)==0){
							console.log("Encontrado");
							parar=true;
					}
				}
				if(!parar){
					var pagina='<!doctype html><html><head></head><body>';
        				pagina +='<form action=\"elimina\" method=\"post\"> Empresa: <input type=\"text" name=\"valor\" size=\"10\">Alumno: <input type=\"text" name=\"aBorrar\" size=\"10\"><input type=\"submit\" value=\"Borra elemento\"></fomr><br>';
					pagina +='<p>Alumno no existe en calificaiones</p>';    	
					pagina += '<a href="Empresa.html">Retornar</a>';
    					pagina += '</body></html>';
    					res.send(pagina);
					db.close();
				}
				else{
					db.run("delete  from calificaciones where nombre2 =(?)",{1:elemento});
					var pagina='<!doctype html><html><head></head><body>';
        				pagina +='<form action=\"elimina\" method=\"post\"> Empresa: <input type=\"text" name=\"valor\" size=\"10\">Alumno: <input type=\"text" name=\"aBorrar\" size=\"10\"><input type=\"submit\" value=\"Borra elemento\"></fomr><br>';
					pagina +='<p>Alumno borrdado de calificaiones</p>';    	
					pagina += '<a href="Empresa.html">Retornar</a>';
    					pagina += '</body></html>';
    					res.send(pagina);
					db.close();
				}
			});
		});
	
	
	
});


//method: verRanking
//action: Se encarga de mostrar en la aplicación web un ranking de empresas por media.

app.post('/verRanking',function(req,res){
	var elemento3 = req.body.calificacion;
	var sqlite3 = require('sqlite3').verbose();
	var start=Date.now();
	var db = new sqlite3.Database('./myDataBase.db');
	res.writeHead(200, {'body-parser':'text/html'});
	res.write('<!doctype html><html><head></head><body>');
	
	res.write('<table>  <tr> <th>Empresa</th> <th>Media</th> </tr>')
	db.serialize(function(){
	
			db.each("select distinct nombre1, (SELECT AVG(calificacion) from calificaciones B where A.nombre1 = B.nombre1) AS med FROM calificaciones A where med>=0 ORDER BY med DESC ", function(err, row) {
				info+='<tr><td>'+row.nombre1+'</td><td>'+row.med+'</td></tr>';
				
		
		
			},function(){
				console.log(info);
				res.write(info);
				res.write('</table>');
				res.write('<a href="Empresa.html">Retornar</a>');
				res.write('</body></html>');
				info="";
				res.end();
			});
		});
	db.close();
});


//method:verLIsta
//action:Método para llamar listar el conjunto de empresas.

app.post('/verLista',function(req,res){
	var pagina='<!doctype html><html><head></head><body>';
      	pagina +='<form action=\"listar\" method=\"post\"> Empresa: <input type=\"text" name=\"valor\" size=\"10\"><br><input type=\"submit\" value=\"Listar calificaciones \"></fomr><br>';
    	pagina += '<a href="Empresa.html">Retornar</a>';
    	pagina += '</body></html>';
    	res.send(pagina);
});


//method:listar
//action:Método para listar.

app.post('/listar',function(req,res){
	var elemento = req.body.valor;
	var sqlite3 = require('sqlite3').verbose();
	
	
	var start = Date.now();
	var db = new sqlite3.Database('./myDataBase.db');


  		
	res.writeHead(200, {'body-parser':'text/html'});
	res.write('<!doctype html><html><head></head><body>');
	res.write('<form action=\"listar\" method=\"post\"> Empresa: <input type=\"text" name=\"valor\" size=\"10\"><br><input type=\"submit\" value=\"Listar calificaciones \"></fomr><br>');
	res.write('<table>  <tr> <th>Alumno</th> <th>Notas</th> </tr>')
		var info="";
			
		db.serialize(function(){
	
			db.each("SELECT nombre2, calificacion from calificaciones where nombre1 =(?)",{1:elemento}, function(err, row) {
				info+='<tr><td>'+row.nombre2+'</td><td>'+row.calificacion+'</td></tr>';
				console.log(row.nombre);
		
		
			},function(){
				console.log(info);
				res.write(info);
				res.write('</table>');
				res.write('<a href="Empresa.html">Retornar</a>');
				res.write('</body></html>');
				res.end();
			});
		});
	console.log(info);
	   	
    	
db.close();
});
 
// escuchar
app.listen(9000);
module.exports = moduloPrueba;
console.log("Servidor Express escuchando en modo %s", app.settings.env);
