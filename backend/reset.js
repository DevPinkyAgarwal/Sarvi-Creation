const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/sarvi-creation').then(() => {
    return mongoose.connection.db.collection('users').updateOne(
        {email: 'admin@sarvicreation.com'}, 
        {$set: {password: '$2b$12$tSrnshK3Fg6jd5bhCJ5oy.TdTrihPYI1XamEqLk7NikC53jtrxrzi'}}
    );
}).then(() => process.exit(0));
