
if (process.env.NODE_ENV === 'production'){
    //This is for the production environment
    module.exports = require('./prod')
}else{
    //This is for development environment
    module.exports = require('./dev')
}