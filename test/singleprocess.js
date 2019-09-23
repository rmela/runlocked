const assert = require("chai").assert
const Lock = require('../index').Lock

const LOCKDIR  = '.'
const LOCKFILE = 'myfile'


function sleep( msecs ) {
    return new Promise( resolve => setTimeout( () => resolve(msecs) , msecs ) )
}

describe( "Lock", function() {

   it( "it should prevent simultaneous operations within single process ", function(done)  {

      let lock = new Lock( LOCKDIR, LOCKFILE )

      let tstart = Date.now();

      let ran  = false;

      Promise.all( 
          [
             lock.runlocked( () => sleep( 1000 ) )
                 .then( result => assert.equal( result, 1000 ), 'The first promise to start should have succeeded'  ),

             lock.runlocked( () => ran = true )
                .catch( err => {
                      assert.equal( err.code, 'ELOCKED', 'The second promise should have failed to acquire the lock' )
                      assert.isFalse( ran, 'Code in second promise should not have run' )
                })
         ])
         .then( () => done() )
         .catch( done )
   })

})

