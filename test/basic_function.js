const assert = require("chai").assert
const Lock = require('../index').Lock

const ERROR_MESSAGE = 'aw, snap!'
const SIMPLE_MESSAGE = 'Okie Dokie!'

/**
* Test promise function 
*    * if err provided, rejects error *    * if err not provided, resolves msec sleep value
*/


const LOCKDIR = '.'
const LOCKFILE = 'foolock'

function sleep( msecs ) {
    return new Promise( resolve => setTimeout( () => resolve(msecs) , msecs ) )
}

function reject() {
    return Promise.reject( new Error( ERROR_MESSAGE ) );
}

function simplefunc() {
    return SIMPLE_MESSAGE
}

function throwfunc() {
    throw new Error( ERROR_MESSAGE )
}

function syntaxError() {
    return x * y;
}

describe( "Lock", function() {

   it( "basic acquire", function(done)  {

      let lock = new Lock( LOCKDIR, LOCKFILE )

      let tstart = Date.now();
      lock.runlocked( () => sleep( 500 ) )
         .then( result => {
             let elapsed = Date.now() - tstart;
             assert.equal( result, 500, 'user function should resolve to 500' )
             assert.isBelow( result, elapsed ,'elapsed time should be consistent with sleep time' )
             done()
         })
         .catch( done )
       
   })

   it( 'should capture user reject',  function(done) {
       let lock = new Lock( LOCKDIR, LOCKFILE )

       lock.runlocked( reject )
          .then( result => assert.fail( 'should not reach this point' ) )
          .catch( err => {
              assert.equal( err.message, ERROR_MESSAGE );
              done();
          })
          .catch( done )

   })

   it( 'should return syntax error exceptions', function(done) {
       let lock = new Lock( LOCKDIR, LOCKFILE )
       lock.runlocked( syntaxError )
           .then( () => assert.fail( "user code with syntax errors should not resolve to a value" ) )
           .catch( function(err) {
               assert.equal( err.message,  'x is not defined', 'Syntax error in user coulde should be returned' )
               done()
           })
           .catch( done )
   })

   it( 'should capture simple function output', function(done) {
       let lock = new Lock( LOCKDIR, LOCKFILE )

       lock.runlocked( simplefunc )
          .then( msg => {
              assert.equal( msg, SIMPLE_MESSAGE )
              done();
          })
          .catch( done )
   })

   it( 'should capture user throw', function(done) {

       let lock = new Lock( LOCKDIR, LOCKFILE )

       lock.runlocked( throwfunc )
          .then( result => assert.fail( 'should not reach this point' ) )
          .catch( err => {
              assert.equal( err.message, ERROR_MESSAGE );
              done();
          })
          .catch( done )

   })


})

