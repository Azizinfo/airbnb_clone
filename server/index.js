const express =require('express');
const mongoose = require('mongoose');
const config = require('./config');
const FakeDb = require('./fake-db');
const bodyParser = require('body-parser');
const path = require('path');

const rentalRoutes = require('./routes/rentals'),
      userRoutes = require('./routes/users'),
      bookingRoutes = require('./routes/bookings');
mongoose.connect(config.DB_URL, {useUnifiedTopology: true, useNewUrlParser: true })
 .then(()=>{
    if(process.env.NODE_ENV !=="production"){   
        const fakeDb = new FakeDb();
        //fakeDb.seedDb();
    }
});

const PORT = process.env.PORT || 3001;

const app = express();
app.use(bodyParser.json());

app.use('/api/v1/rentals',rentalRoutes);
app.use('/api/v1/users',userRoutes);
app.use('/api/v1/bookings',bookingRoutes);

if(process.env.NODE_ENV ==="production"){
    const appPath = path.join(__dirname, '..', 'build');
    app.use(express.static(appPath));
    
    app.get('*', function(req, res){
       res.sendFile(path.resolve(appPath, 'index.html'));
    })
}

app.listen(PORT,function(){
    console.log('====================================')
    console.log('i\'m running');
    console.log('====================================')
});
