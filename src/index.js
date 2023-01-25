const express = require('express');
const { dirname } = require('path');
const path = require("path");

var http = require('http');

const app = express()
const port = 80
app.set('port', process.env.PORT || 8080);

app.use(require("./routes/index.routes"));


app.use(express.json());             // for application/json
app.use(express.urlencoded());

//Static Files
app.use(express.static(path.join(__dirname, "public")));

// app.listen(port, [" 192.168.43.176", "localhost" ] ,() => {
//   console.log(`Listening to requests on http://localhost:${port}`);
// });





app.listen(app.get('port'), function() {
  console.log("... port %d in %s mode" + app.get("port"));
});