const express = require('express')
const mongoose = require('mongoose')
const { Product, Books, Restaurant } = require('./models/productModel')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))


mongoose.set("strictQuery", false)
//mongodb://localhost:27017
mongoose.
    connect('mongodb://localhost:27017')
    .then(() => {
        console.log('connected to MongoDB')
        app.listen(3000, () => {
            console.log(`Node API app is running on port 3000`)
        });
    }).catch((error) => {
        console.log(error)
    })

//routes
// Question from below link
//https://www.w3resource.com/mongodb-exercises/

app.get('/', (req, res) => {
    res.send('Hello NODE API')
})

app.get('/getData', async (req, res) => {
    try {
        const data = await Restaurant.find();
        res.status(200).send(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('AnError');
    }
});

app.get('/2', async (req, res) => {
    try {
        //Mongo Way
        const data = await Restaurant.find({}, { restaurant_id: 1, name: 1, cuisine: 1, borough: 1, _id: 0 });
        //JS Way - 1
        const ans = data.map(({ name, cuisine, borough }) => ({ name, cuisine, borough }));
        //JS way - 2 
        const ans1 = data.map((d) => {
            return {
                restaurant_id: d.restaurant_id,
                name: d.name,
                cuisine: d.cuisine,
                borough: d.borough
            }
        });
        res.status(200).send(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('AnError');
    }
});

app.get('/4', async (req, res) => {
    const data = await Restaurant.find({}, { "restaurant_id": 1, "name": 1, "borough": 1, "address.zipcode": 1, "_id": 0 });
    res.status(200).send(data);
});

app.get('/5', async (req, res) => {
    const data = await Restaurant.find({ "borough": "Bronx" });
    const data1 = await Restaurant.find({ "borough": "Bronx" }).limit(2);
    res.status(200).send(data1);
});

app.get('/7', async (req, res) => {
    const data = await Restaurant.find({ "borough": "Bronx" }).skip(1).limit(3);
    //JS way 
    const ans = data.filter((d, i) => {
        if (i >= 1) return true;
        else return false;
    });
    //  const data1 = await Restaurant.find({"borough":"Bronx"}).limit(2);
    res.status(200).send(data);
});

app.get('/8', async (req, res) => {
    //Mongo way
    const data1 = await Restaurant.find({ grades: { $elemMatch: { "score": { $gte: 15 } } } });
    //JS WAY
    const data = await Restaurant.find();
    const ans = data.filter((d) => {
        if (d.grades.some((i) => i.score >= 15)) return true;
        else false;
    });
    res.status(200).send(data1);
});

app.get('/9', async (req, res) => {
    //Mongo way
    const data1 = await Restaurant.find({ grades: { $elemMatch: { "score": { $gte: 5, $lte: 7 } } } });
    //JS WAY
    const data = await Restaurant.find();
    const ans = data.filter((d) => {
        if (d.grades.some((i) => i.score >= 5 && i.score <= 7)) return true;
        else false;
    });
    res.status(200).send(ans);
});

// db.collection.find({
//     "a.b": { $elemMatch: { $gt: 30 } }
//   });
//   { "a": { "b": [1, 32, 3, 4] } }// any value gt 30 
//-----------------
// [
//     { a: { b: [1, 25, 3, 4] } },
//     { a: { b: [1, 32, 3, 4] } },
//     { a: { b: [1, 12, 3, 4] } },
//     { a: { b: [1, 22, 3, 4] } }
//   ]
// db.collection.find({
//     "a.b.2": { $gte: 22 }
//   });


app.get('/10', async (req, res) => {
    //Mongo way
    const data1 = await Restaurant.find({ "address.coord.0": { $lte: -74.056077 } });
    //JS WAY
    const data = await Restaurant.find();
    const ans = data.filter((d) => {
        if (d.address.coord[0] <= -73.856077) return true;
        else return false;
    });
    res.status(200).send(data1);
});

app.get('/11', async (req, res) => {
    //Mongo way
    const data1 = await Restaurant.find(
        {
            "cuisine": { $ne: 'American' },
            "grades": { $elemMatch: { "score": { $gt: 14 } } },
            "address.coord": { $elemMatch: { $lt: -65.754168 } }
        });
    //JS WAY
    const data = await Restaurant.find();
    const ans = data.filter((d) => {
        if (d.cuisine !== 'American' && d.grades.some((i) => i.score > 14) && d.address.coord[0] < -65.754168) return true;
        return false;
    });

    res.status(200).send(ans);
});

app.get('/13', async (req, res) => {
    //Mongo way
    const data1 = await Restaurant.find(
        {
            "cuisine": { $ne: 'American' },
            "grades": { $elemMatch: { "grade": { $eq: "A" } } },
            "borough": { $ne: "Brooklyn" }
        }).sort({ "cuisine": -1 });
    //JS WAY
    const data = await Restaurant.find();
    const ans = data.filter((d) => {
        if (d.cuisine !== 'American' && d.grades.some((i) => i.grade === 'A') && d.borough !== 'Brooklyn') return true;
        return false;
    });
    const fans = ans.sort((a, b) => a.cuisine > b.cuisine ? -1 : 1);
    res.status(200).send(fans);
});

app.get('/14', async (req, res) => {
    //Mongo way
    const data = await Restaurant.find({ name: /^Tac/ }, {
        restaurant_id: 1, name: 1, borough: 1, cuisine: 1, _id: 0
    });
    //JS Way
    const data1 = await Restaurant.find();
    const ans = data1.filter((d) => d.name.startsWith('Tac'))
        .map(({ restaurant_id, name, borough, cuisine }) => ({ restaurant_id, name, borough, cuisine }));
    res.status(200).send(data);
});

app.get('/15', async (req, res) => {
    //Mongo way
    const data = await Restaurant.find({ name: /ces$/ }, {
        restaurant_id: 1, name: 1, borough: 1, cuisine: 1, _id: 0
    });
    //JS Way
    const data1 = await Restaurant.find();
    const ans = data1.filter((d) => d.name.endsWith('ces'))
        .map(({ restaurant_id, name, borough, cuisine }) => ({ restaurant_id, name, borough, cuisine }));
    res.status(200).send(data);
});

app.get('/16', async (req, res) => {
    //Mongo way
    const data = await Restaurant.find({ name: /.*Reg.*/ }, {
        restaurant_id: 1, name: 1, borough: 1, cuisine: 1, _id: 0
    });
    //JS Way
    const data1 = await Restaurant.find();
    const ans = data1.filter((d) => d.name.contains('Reg'))
        .map(({ restaurant_id, name, borough, cuisine }) => ({ restaurant_id, name, borough, cuisine }));
    res.status(200).send(data);
});

app.get('/17',async(req,res)=>{
    //Mongo way
    const data = await Restaurant.find({"borough":"Bronx",
    $or:[{"cuisine":"American"},{"cuisine":"Chienes"}]});
   //JS Way
   const data1 = await Restaurant.find();
    const ans = data1.filter(d=>d.borough==="Bronx" && (d.cuisine==="American" || d.cuisine==="Chines"));
    res.status(200).send(data);
});

app.get('/18',async(req,res)=>{
    //Mongo way
    const data = await Restaurant.find({
        borough:{$in:["Staten Island","Queens","Bronx","Brooklyn"]}//this is same as or operator
    });
   //JS Way
   const data1 = await Restaurant.find();
    const ans = data1.filter(d=>d.borough==="Brooklyn" || d.borough==="Bronx" || d.borough==="Queens" || d.borough==="Staten Island");
    res.status(200).send(data);
});

app.get('/19',async(req,res)=>{
    //Mongo way
    const data = await Restaurant.find({
        borough:{$nin:["Staten Island","Queens","Bronx","Brooklyn"]}//this is same as or operator
    });
   //JS Way
   const data1 = await Restaurant.find();
    const ans = data1.filter(d=>d.borough!=="Brooklyn" && d.borough!=="Bronx" && d.borough!=="Queens" && d.borough!=="Staten Island");
    res.status(200).send(data);
});

app.post('/addData', async (req, res) => {
    try {
        const restaurantData = req.body;
        await Restaurant.create(restaurantData);
        res.status(201).send('Restaurant data inserted successfully.');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred.');
    }
});
