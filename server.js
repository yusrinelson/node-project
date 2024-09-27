const http = require("http");
const fs = require("fs");
const url = require("url");

const PORT = 8000;
const DATA_FILE = 'data.json';


// const readData = () => {
//     return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8', (err, data) => {
//         if (err) {
//             fs.writeHead(500, { 'Content-Type': 'application/json' });
//             return fs.end(JSON.stringify({ error: 'Failed to read data' }));
//         }
//         fs.writeHead(200, { 'Content-Type': 'application/json' });
//         fs.end(data);
//     }));
// };

// const writeItems = (dataItems) => {
//     fs.writeFileSync(fileName, JSON.stringify(dataItems, 2));
// };

const server = http.createServer((req, res) => {
    // to GET information
    if (req.method === "GET" && req.url === "/") {
        try {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to read data' }));
        }
    } else if (req.method === "POST" && req.url === "/data") {
        
    } else {
        // 404 Not Found
        res.writeHead(404);
        res.end(JSON.stringify({ message: "Not Found" }));
    }
});

// This code will run my server
server.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
})