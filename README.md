Work in progress

Intended usage:

```javascript
     const Lock = require('runlocked').Lock
     let lockfile = new Lock('./mylockdir', 'mylockname' )

     function myfunc() {
         return "Hi"
     }

     lockfile.runlocked( myfunc )
         .then( console.log ) // Ouputs "Hi"

```

    
