const assert = require("chai").assert
const fs = require('fs')
const Lock = require('../index').Lock

const LOCKDIR  = 'lockdir'
const LOCKFILE = 'myfile'


function sleep( msecs ) {
    return new Promise( resolve => setTimeout( () => resolve(msecs) , msecs ) )
}



function mkdir(done) {
   fs.mkdirSync(LOCKDIR);
   done();
}

function rmdir(done) {
   sleep(500).then( () => {
       fs.rmdirSync(LOCKDIR);
       done()
   })
}
describe( "Lock", function() {

   beforeEach( mkdir )
   afterEach( rmdir )

   it( "it should prevent simultaneous operations within single process ", function(done)  {

      let lock = new Lock( LOCKDIR, LOCKFILE )

      let tstart = Date.now();

      let ran  = false;

      Promise.all( 
          [
             lock.runlocked( () => sleep( 500 ) )
                 .then( result => assert.equal( result, 500 ), 'The first promise to start should have succeeded'  ),

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

