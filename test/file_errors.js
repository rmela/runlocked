const assert = require("chai").assert
const Lock = require('../index').Lock

describe( "Lock", function() {

   it( "foo", function(done)  {

      let userCodeRan = false

      lock = new Lock('nosuchdir', 'nosuchfile' )

      lock.runlocked( () => ran = true )
         .catch( err => {
             assert.equal( err.code, 'ENOENT', "Error should be that directory doesn't exist" )
             assert.isFalse( userCodeRan, "User code should not have been run" )
             done();
         })
         .catch( done )
   })

})

