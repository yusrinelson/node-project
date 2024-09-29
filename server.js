const http = require("http");
const fs = require("fs");
const url = require("url");

const PORT = 8000;
const DATA_FILE = 'data.json';

const server = http.createServer((req, res) => {
    // to GET information
    if (req.method === "GET" && (req.url === "/data" || req.url === "/") ) {
        try {
            const data = fs.readFileSync(DATA_FILE, 'utf-8');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data); //sends the data back to the client
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
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

                parsedData.push(addedData); //adds the new data to end of the existing array

                fs.writeFileSync(DATA_FILE, JSON.stringify(parsedData, null));

                res.writeHead(201, {"Content-Type": "application/json"});

                res.end(JSON.stringify(parsedData));
            }catch(error){
                res.writeHead(400, {"Content-Type": "application/json"});
                res.end(JSON.stringify({error: "failed to add data"}));
            }
        })

        //to PUT information
    } else if (req.method === "PUT" && req.url === "/data") {
        let body = "";

        req.on("data", chunk => {
            body = body + chunk.toString(); // Accumulate incoming data chunks
        });

        req.on("end", () => {
            try {
                const updatedData = JSON.parse(body);
                const parsedData = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));

                const updateId = updatedData.id
                const index = parsedData.findIndex((dataItem) => {
                    dataItem.id === updateId
                })

                if(index !== -1){
                    
                }

            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Failed to update' }));
            }
        });
        
        // to DELETE information
    } else if (req.method === "DELETE" && req.url.startsWith("/data/")) {

       try{

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