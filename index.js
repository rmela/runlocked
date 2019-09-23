const lf = require('proper-lockfile');
const fs = require('fs')
const path = require('path')

function _runUserFunc( func, resolve, reject ) {
    return Promise.resolve()
          .then( () => func() )
          .then( resolve )
          .catch( reject )
}

function runUserFunc( func ) {
   return new Promise( (resolve, reject) => _runUserFunc( func, resolve, reject ) )
}


function Lock( directory, fname ) {
    this.lockDirectory = directory;
    this.lockfilePath = path.join( directory, fname );
    return this;
}


Lock.prototype.runlocked = function( func ) {

    let userResult, userError, release;

    return lf.lock( this.lockDirectory, { lockfilePath: this.lockFilePath } )
        .then( result => release = result )
        .then( function() { 
             return runUserFunc( func ) 
               .then( result => userResult = result )
               .catch( err => userError = err )
        })
        .then( () => release() )
        .then( () => userError ? Promise.reject( userError ) : userResult )
          
}

module.exports.Lock = Lock
