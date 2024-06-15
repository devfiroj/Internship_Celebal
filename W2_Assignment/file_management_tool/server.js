const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const requestHandler = (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const filePath = path.join(__dirname, url.pathname);

    if (req.method === 'GET') {
        // Read file
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    res.statusCode = 404;
                    res.end('File not found');
                } else {
                    res.statusCode = 500;
                    res.end('Internal Server Error');
                }
            } else {
                res.statusCode = 200;
                res.end(data);
            }
        });
    } else if (req.method === 'POST') {
        // Create file
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            fs.writeFile(filePath, body, err => {
                if (err) {
                    res.statusCode = 500;
                    res.end('Internal Server Error');
                } else {
                    res.statusCode = 201;
                    res.end('File created');
                }
            });
        });
    } else if (req.method === 'DELETE') {
        // Delete file
        fs.unlink(filePath, err => {
            if (err) {
                if (err.code === 'ENOENT') {
                    res.statusCode = 404;
                    res.end('File not found');
                } else {
                    res.statusCode = 500;
                    res.end('Internal Server Error');
                }
            } else {
                res.statusCode = 200;
                res.end('File deleted');
            }
        });
    } else {
        res.statusCode = 405;
        res.end('Method Not Allowed');
    }
};

const server = http.createServer(requestHandler);

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});


/* To create file
curl -X POST -d "This is the content of the file" http://localhost:3000/testfile.txt

To read file: 
curl http://localhost:3000/testfile.txt

To delete file:
curl -X DELETE http://localhost:3000/testfile.txt

OR

1.	Create a File:
	•	Method: POST
	•	URL: http://localhost:3000/filename
	•	Body: Content of the file
2.	Read a File:
	•	Method: GET
	•	URL: http://localhost:3000/filename
3.	Delete a File:
	•	Method: DELETE
	•	URL: http://localhost:3000/filename

    */