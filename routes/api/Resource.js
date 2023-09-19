const express= require('express');
const router=express.Router();
const Resource = require('../../models/Resource');
// const json2csv = require('json2csv').Parser;
const fs = require("fs");
const jsonexport = require('jsonexport');

router.get('/:howMuch',(req,res)=>{
    const howMuch = req.params.howMuch.toString();
    if(howMuch === "more"){
        Resource.find().sort({$natural:-1}).limit(100).then(resource=>res.json(resource)).catch(err=>res.status(500).send('Something went wrong!'))
    }else if(howMuch === "less"){
        Resource.find().sort({$natural:-1}).limit(50).then(resource=>res.json(resource)).catch(err=>res.status(500).send('Something went wrong!'))
    }else{
        Resource.find().then(resource=>res.json(resource)).catch(err=>res.status(500).send('Something went wrong!'))
    }
    // Resource.find().then(resource=>res.json(resource))
});
router.get('/all',(req,res)=>{
    const from = parseFloat(req.query.from);
    let to = parseFloat(req.query.to);

    if (isNaN(from) || isNaN(to)) {
        Resource.find().then(resource=>res.json(resource)).catch(err=>res.status(500).send('Something went wrong!'));
    }else{
        Resource.find().skip(from).limit(to).then(resource=>res.json(resource)).catch(err=>res.status(500).send('Something went wrong!'));
    }

});
router.get('/',(req,res)=>{
    Resource.find().then(resource=>res.json(resource)).catch(err=>res.status(500).send('Something went wrong!'))
});

router.get('/download-csv',(req,res)=>{
    console.log("download csv")
    // let resources = []
    Resource.find().then(resource=> {

        if(resource){
            try {
                const transformedJsonData = resource.map(item => {
                    return {
                        "TIMESTAMP": item.TIMESTAMP,
                        "CPU_PERCENTAGE": item.CPU_PERCENTAGE,
                        "RAM_PERCENTAGE": item.RAM_PERCENTAGE,
                        "DISK_PERCENTAGE": item.DISK_PERCENTAGE,
                        "IS_ANOMALY": item.IS_ANOMALY
                    };
                });
                // Convert JSON to CSV
                // const csvParser = new json2csv();
                // const csvData = csvParser.parse(resources);
                console.log("resources ", transformedJsonData )
                jsonexport(transformedJsonData, function(err, csvData) {
                    if (err) return console.error(err);

                    console.log("csv ", csvData)
                    // Define the file name and path
                    const fileName = 'data.csv';
                    const filePath = `${__dirname}/${fileName}`;

                    // Write the CSV data to a file
                    fs.writeFileSync(filePath, csvData);

                    // Set the response headers for downloading
                    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
                    res.setHeader('Content-Type', 'text/csv');

                    // Send the file as a response
                    const fileStream = fs.createReadStream(filePath);
                    fileStream.pipe(res);

                    // Delete the temporary CSV file after sending
                    fileStream.on('end', () => {
                        fs.unlinkSync(filePath);
                    });
                })
                //     .then((csv)=>{
                //
                // }).catch(err=>{
                //
                // });

            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }).catch(err=>res.status(500).send('Something went wrong!'))



});

router.post('/',(req,res)=>{

    console.log("POST")
    const newResource = new Resource({
        TIMESTAMP: req.body["TIMESTAMP"],
        CPU_PERCENTAGE: req.body["CPU_PERCENTAGE"],
        RAM_PERCENTAGE: req.body["RAM_PERCENTAGE"],
        DISK_PERCENTAGE: req.body["DISK_PERCENTAGE"],
        IS_ANOMALY: req.body["IS_ANOMALY"]
    });
    newResource.save().then(resource=>res.json(resource)).catch(err => res.send(`Error is ${err}`));
});


router.post('/update-is-anomaly',(req,res)=>{

    console.log("Update Anomaly")
    Resource.updateOne( { TIMESTAMP: req.body["TIMESTAMP"] },
        {
            $set: {
                IS_ANOMALY: req.body["IS_ANOMALY"]
            }

        }).then(r => res.send("Updated"))
        .catch(err => res.send("Error"))
});

router.delete('/', (req, res) => {
    console.log("Delete data")
    Resource.deleteMany({}).then(r => res.send("OK")).catch(err =>res.send("Error"));
})




module.exports = router;