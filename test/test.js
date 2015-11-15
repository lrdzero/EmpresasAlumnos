'use strict';

var prueba = require('../lib/server');
var assert = require("assert");


describe("TEST",function(){
it('Creación de empresas', function(done) {
    prueba.insertarEmpresa("EMPRESA01",12); 
    prueba.comprobacion("EMPRESA01",function(err,resultado){
			assert.equal(resultado, true)});
    done();
  });
});
