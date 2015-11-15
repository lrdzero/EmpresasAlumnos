'use strict';

var prueba = require('../lib/server');
var assert = require("assert");



    prueba.comprobacion("EMPRESA01",function(err,resultado){
				if(!resultado){
					prueba.insertarEmpresa("EMPRESA01",12);
				}
				else{
					prueba.comprobacion("EMPRESA01",function(err,resultado){
						assert.equal(resultado, true);
						console.log("Assert pasados");	
					});
				}
				}); 
    



