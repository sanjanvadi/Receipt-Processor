import express, { json } from 'express';
import { v4 as uuidv4 } from 'uuid';
const app = express();
const port = 3000;

app.use(json());
const db = {};

app.get('/receipts/',(req,res)=>{
    const receipts = Object.keys(db).length === 0 ? "No Receipts yet" : db;
    res.status(200).json({receipts:receipts});
})

app.get('/receipts/:id/points', (req, res) => {
    const id = req.params.id;
    const idPattern = /^\S+$/;

    if (!idPattern.test(id)) {
        return res.status(400).json({
            error: 'Bad Request',
            message: 'ID must not contain whitespace characters.',
        });
    }
    const points = db[id];
    if(!points){
        return res.status(404).json({
            error:'Not Found',
            message: "No receipt found for that ID."});
    }
    res.status(200).json({ points });
});

app.post('/receipts/process', (req, res) => {

    try {
        const { retailer, purchaseDate, purchaseTime, items, total } = req.body;
    
        if (!retailer || !purchaseDate || !purchaseTime || !items || !total || typeof retailer !== 'string' || typeof purchaseDate !== 'string' || typeof purchaseTime !== 'string' || !Array.isArray(items) || typeof total !== 'string') {
            throw new Error("The receipt is invalid.");
        }
        const retailerPattern = /^[\w\s\-\&]+$/;
        if (!retailerPattern.test(retailer)) {
            throw new Error("Invalid retailer");
        }
    
        const datePattern = /^\d{4}-\d{2}-\d{2}$/;
        if (!datePattern.test(purchaseDate)) {
            throw new Error("Invalid purchaseDate");
        }

        const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
        if (!timePattern.test(purchaseTime)) {
            throw new Error("Invalid purchaseTime");
        }
        
        const descriptionPattern = /^[\w\s\-]+$/;
        const pricePattern = /^\d+\.\d{2}$/;
        items.forEach(({shortDescription,price})=>{
            if(!descriptionPattern.test(shortDescription.trim())){
                throw new Error("Invalid item desccription");                
            }
            if(!pricePattern.test(price)){
                throw new Error("Invalid item price");           
            }
        })

        if(!pricePattern.test(total)){
            throw new Error("Invalid total price");           
        }
        
        const id  = uuidv4();
        let points = 0;
        const data  = req.body;
       
        //One point for every alphanumeric character in the retailer name.
        points+= retailer.trim().match(/[a-zA-Z0-9]/g).length || 0;
    
        //50 points if the total is a round dollar amount with no cents.
        if(Number(total)%1===0) points+=50;
    
        //25 points if the total is a multiple of 0.25.
        if(Number(total)%0.25===0) points+=25;
    
        //5 points for every two items on the receipt.
        points+=parseInt(items.length/2)*5;
    
        //If the trimmed length of the item description is a multiple of 3,
        //multiply the price by 0.2 and round up to the nearest integer.
        //The result is the number of points earned.
        items.forEach((item) => {
            if (item.shortDescription.trim().length % 3 === 0) {
                points += Math.ceil(Number(item.price) * 0.2);
            }
        });
    
        //6 points if the day in the purchase date is odd.
        const date = new Date(`${purchaseDate}T${purchaseTime}`);
        if((date.getDate()) % 2 !== 0) points+=6
    
        //10 points if the time of purchase is after 2:00pm and before 4:00pm.
        const hours = date.getHours();
        if(hours >= 14 && hours < 16) points+=10;
    
        //store the calculated points into the db
        db[id] = points;
    
        res.json({ id });
    } catch (error) {
        res.status(400).json({
            error: 'Bad Request',
            message: error.message
        });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
