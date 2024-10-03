const http = require("http");
const fs = require("fs");

const PORT = 8000;
const DATA_FILE = 'data.json';

const server = http.createServer((req, res) => {
    // to GET information
    if (req.method === "GET" && req.url === "/data") {
        try {
            const data = fs.readFileSync(DATA_FILE, 'utf-8'); // checks the existing data
            
            res.writeHead(200, { 'Content-Type': 'application/json' });//200 is OK
            res.end(data); //sends the data back to the client
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' }); //
            res.end(JSON.stringify({ error: 'Failed to read data' }));
        }

        //to POST information
    } else if (req.method === "POST" && req.url === "/data") {

        let body = "";

        //collects incoming data from HTTP requests
        req.on("data", chunk => {
            body = body + chunk.toString() //converting binary buffer to string and adding it to body
        })

        req.on("end", () => {
            try{
                const addedData = JSON.parse(body); //pass the JSON-formatted string into a JavaScript object accumulated in the body 
                const parsedData = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));

                const highestId = parsedData.length > 0 ? Math.max(...parsedData.map(item => item.id)) : 0;
                addedData.id = highestId + 1;
                
                parsedData.push(addedData); //adds the new data to end of the existing array

                fs.writeFileSync(DATA_FILE, JSON.stringify(parsedData, null));
                res.writeHead(201, {"Content-Type": "application/json"}); //201 is created
                res.end(JSON.stringify(parsedData));
            }catch(error){
                res.writeHead(400, {"Content-Type": "application/json"}); //400 is bad request
                res.end(JSON.stringify({error: "failed to add data"}));
            }
        })

        //to PUT information
    } else if (req.method === "PUT" && req.url === "/data") {
        let body = "";
    
        req.on("data", chunk => {
            body += chunk.toString(); // Accumulate incoming data chunks
        });
        
        req.on("end", () => {
            try {
                const updatedData = JSON.parse(body);
                const parsedData = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    
                const updateId = updatedData.id;
                const index = parsedData.findIndex((dataItem) => {
                    return dataItem.id === updateId
                })
                // Check if the id exists
                if (index !== -1) {
                    parsedData[index] = { ...parsedData[index], ...updatedData };//copies the existing object and updates the properties
    
                    fs.writeFileSync(DATA_FILE, JSON.stringify(parsedData, null));
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(parsedData));
                }else{
                    res.writeHead(404, { 'Content-Type': 'application/json' }); //404 is not found
                    res.end(JSON.stringify({ error: 'ID not found' }));
                }
    
            } catch (error) {
                console.error('Error updating data:', error);
                res.writeHead(400, { 'Content-Type': 'application/json' }); //400 is bad request
                res.end(JSON.stringify({ error: 'Failed to update: Invalid data' }));
            }
        });
        //to DELETE information
    } else if (req.method === "DELETE" && req.url.startsWith("/data")) {
        
        const deleteId = req.url.split("?id=").pop();  //converts to array and deletes the last element
       
        try{
        const parsedData = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8")); // reads existing data

        const index = parsedData.findIndex((dataItem) => {
            return dataItem.id == deleteId
        })
        // Check if the id exists
        if (index !== -1) {
            parsedData.splice(index, 1); // removes the specified data from the array
            
            fs.writeFileSync(DATA_FILE, JSON.stringify(parsedData, null));
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(parsedData));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'ID not found' }));
        }

       }catch(error){
           res.writeHead(500, { 'Content-Type': 'application/json' });
           res.end(JSON.stringify({ error: 'Failed to delete' }));
       }


    }else {
        // 404 Not Found
        res.writeHead(404);
        res.end(JSON.stringify({ message: "Not Found" }));
    }
});

// This code will run my server
server.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});