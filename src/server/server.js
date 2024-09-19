const http = require( 'http' );
const fs = require( 'fs' );
const { loadEnvFile } = require( 'process' );
const port = 8080

const server = http.createServer( ( req, res ) => {
  const url = req.url;
  let filePath = `..${url}`;
  
  if ( url == "/" ) {
      filePath = '../index.html';
    
  }

  fs.readFile( filePath, ( err, data ) => {
    if ( err ) {
      res.statusCode = 404;
      res.end( `${err}` );
    } else {
      res.statusCode = 200;
      res.end( data );
    }
  });
});

server.listen( port, () => {
  console.log( `Server started on port ${port}` );
});