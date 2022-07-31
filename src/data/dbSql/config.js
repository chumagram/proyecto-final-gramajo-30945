const path = require('path');
const SqLite = {
    client: 'sqlite3',
    connection: {filename: path.join(__dirname,'./store-wars.sqlite')},
    useNullAsDefault: true
};

module.exports = SqLite;