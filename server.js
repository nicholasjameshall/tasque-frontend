var express = require('express');
let app = express();

app.use(express.static('./src/'));

app.get('/*', function(req, res) {
  res.sendFile('app.component.html', {root: 'src/app/'}
);
});

app.listen(process.env.PORT || 8080);
