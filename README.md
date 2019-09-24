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

Expected behavior




    1. `runlocked` returns a promise.
    2. If lock cannot be acquired ( disk error, or more likely, lock already held ) then user code *will not be run*.  The error internal to `runlocked` will be returned via `Promise.reject`.
    3. If lock is acquired then user code *will run*. `runlocked` will return whatever the user code returns ( or throws )
        3.1  If user code completes succesfully, `runlocked` returns the value returned by the user's code
        3.2 If user code errors, `runlocked` will return a promise rejection with the error


