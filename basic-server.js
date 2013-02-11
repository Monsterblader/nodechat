/* Import node's http module: */
var http = require("http");
var fs = require('fs')
var _ = require('underscore')
var path = require('path')
/* Import our custom Cross-Origin Resource Sharing (CORS) code: */
var defaultCorsHeaders = require("./lib/cors.js").defaultCorsHeaders;
/* This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */

/* This is the callback function that will be called each time a
 * client (i.e.. a web browser) makes a request to our server. */
var requestListener = function (request, response) {

  /* Request is an http.ServerRequest object containing various data
   * about the client request - such as what URL the browser is
   * requesting. */
  console.log("Serving request type " + request.method
              + " for url " + request.url);

  /* "Status code" and "headers" are HTTP concepts that you can 
   * research on the web as and when it becomes necessary. */
  var statusCode = 200;
  /* Without this line, this server wouldn't work.  See the note at
   * the top of this file. */
  var headers = defaultCorsHeaders();
  headers['Content-Type'] = "text/plain";

  /* Response is an http.ServerRespone object containing methods for
   * writing our response to the client. Documentation for both request
   * and response can be found at 
   * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html*/
  response.writeHead(statusCode, headers);
  /* writeHead() tells our server what HTTP status code to send back
   * to the client, and what headers to include on the response. */
  response.end("Hello, World!");
  /* Make sure to always call response.end() - Node will not send
   * anything back to the client until you do. The string you pass to
   * response.end() will be the body of the response - i.e. what shows
   * up in the browser.*/
};

/* Every server needs to listen on a port with a unique number. The
 * standard port for HTTP servers is port 80, but that port is
 * normally already claimed by another server and/or not accessible to
 * user processes, so we'll use a higher port number that is not
 * likely to be taken: */
var port = 8080;

/* For now, since you're running this server on your local machine,
 * we'll have it listen on the IP address 127.0.0.1, which is a
 * special address that always refers to localhost. */
var ip = "127.0.0.1";

/* Use node's http module to create a server and start it listening on
 * the given port and IP. */








var route = function (res, url, method, sentData) {
  var test = crud[method](null, sentData);
  console.log(test);
  return res.end(crud[method](null, sentData))

  // var routes = {
  //   new RegExp('\/classes\/messages\/(\d+)'):function (url) {
  //     var query = url.split('/').pop();
  //     return query
  //   }
  // }
  // var fn = routes[_.find(routes, function (route) { 
  //   return route.test(req.url.slice(1))
  // })] 

  // var query = fn(url)
  // this.end(crud[method](query, sentData))
}

var messages = []

var crud = {
  POST: function (id, sentData){ 
    console.log('HELLOOO' + typeof sentData)
    messages.push(JSON.parse(sentData))
    return 'success!'
  },
  GET: function (id){ 
    // console.log(messages)
    var query = id ?  _.filter(messages, function (m) { return m.id === id }) : messages;
    return JSON.stringify(messages)
  },
  DELETE: function (id) {
    messages = messages.filter(function (item, index) { return item.id !== id })
    return 'success!'
  },
}


var mime = function (url) {
  var types = {
    '.html':'text/html',
    '.js':'text/javascript',
    '.css':'text/css'
   }
    return types[path.extname(url)]
}

http.createServer(function (req, res) {
  var dir = 'chat-client/'
  var url = dir + (req.url.slice(1) || 'index.html')
  console.log(url)
  res.writeHead(200, {'Content-Type': mime(url) })
  if(fs.existsSync(url)) return fs.createReadStream(path.join(__dirname, url)).pipe(res)
  var sentData = '';
  req.on('data', function (chunk) { 

    sentData += chunk.toString()
    console.log(sentData)

     })
  req.on('end', function () {
    route(res, req.url, req.method, sentData)
  })
   
}).listen(8000)

/* To start this server, run:
     node basic-server.js
 *  on the command line.

 * To connect to the server, load http://127.0.0.1:8080 in your web
 * browser.

 * server.listen() will continue running as long as there is the
 * possibility of serving more requests. To stop your server, hit
 * Ctrl-C on the command line. */
