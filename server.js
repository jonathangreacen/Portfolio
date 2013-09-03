// node server.js
// This is just for local dev/testing of the portfolio to avoid Cross-origin script access. 
// Not necessary if you use Firefox

var http = require('http'),
	fs = require('fs'),
	path = require('path'),
	numRequests = 0;
	
http.createServer(function (request, response) {     
    var filePath = '.' + request.url;
    if (filePath == './')
        filePath = 'index.html';
         
    var extname = path.extname(filePath),
        contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
    }
     
    path.exists(filePath, function(exists) {
    console.log("FilePath:", filePath);
        if (exists) {
            fs.readFile(filePath, function(error, content) {
                if (error) {
                    response.writeHead(500);
                    response.end();
                }
                else {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                }
            });
        }
        else {
            response.writeHead(404);
            response.end();
        }
    });
     
}).listen(8000);