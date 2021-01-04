const app = require('./app')
const port = process.env.PORT

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

// app.use(function(err, req, res, next) {
//     if(err.status !== 404) {
//       return next();
//     }
//     var statusCode = err.status || 404;
//     res.status(statusCode).send(err.message || 'You break Something, check and correct');
//   });