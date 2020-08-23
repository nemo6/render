var http         = require('http')
var fs           = require('fs')
var path         = require('path')
var port         = process.env.PORT

var pug          = require('C:/Users/USERNAME/AppData/Roaming/npm/node_modules/pug')
var sass         = require('C:/Users/USERNAME/AppData/Roaming/npm/node_modules/sass')
var coffeescript = require('C:/Users/USERNAME/AppData/Roaming/npm/node_modules/coffeescript')

http.createServer(function (req, res) {
	
	res.writeHead(200,{'content-type':'text/html'})

	console.log(req.url)
	
	var stream = fs.createReadStream(path.join(__dirname, req.url))
	
    stream.on('error', function() {
		
		fs.readFile('index.html', 'utf-8', function read(err, data) {

			regexSass         = new RegExp('<style>([^]*?)</style>')
			regexPug          = new RegExp('<body>([^]*?)</body>')
			regexCoffeescript = new RegExp('<script.*?>([^]*?)</script>')
				
			string_sass         = data.match(regexSass)[1]
			string_pug          = data.match(regexPug)[1]
			string_coffeescript = data.match(regexCoffeescript)[1]

			renderSass = sass.renderSync( { data: string_sass, indentedSyntax: true } )
			
			renderPug = pug.render( string_pug, { pretty: true } )		
			
			renderCoffeescript = coffeescript.compile( string_coffeescript, { bare: true } );
			
			render = "<style>" + renderSass.css + "</style>" + renderPug + "<script>" + renderCoffeescript + "</script>"
			
			res.end(render)
			
		})
		
    })
	
	stream.pipe(res)
	
}).listen(port)

console.log(`Running at port ${port}`)
