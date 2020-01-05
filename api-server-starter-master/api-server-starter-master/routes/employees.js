
const userRoutes = (app, fs) => {

    // variables
    const dataPath = './data/employees.json';

    // helper methods
    const readFile = (callback, returnJson = false, filePath = dataPath, encoding = 'utf8') => {
        fs.readFile(filePath, encoding, (err, data) => {
            if (err) {
                throw err;
            }

            callback(returnJson ? JSON.parse(data) : data);
        });
    };
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    const writeFile = (fileData, callback, filePath = dataPath, encoding = 'utf8') => {

        fs.writeFile(filePath, fileData, encoding, (err) => {
            if (err) {
                throw err;
            }

            callback();
        });
    };

    // READ
    app.get('/employees', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            res.send(JSON.parse(data));
        });
    });

    // CREATE
    app.post('/employees', (req, res) => {

        readFile(data => {
            const newUserId = data.length + 1;

            // add the new user
            req.body.id = newUserId
            data.push(req.body);

            writeFile(JSON.stringify(data, null, 2), () => {
                message = 
                        {message: 'new user added'}
                res.status(200).send(message);
            });
        },
            true);
    });


    // UPDATE
    app.post('/employees/:id', (req, res) => {

        readFile(data => {

            // add the new user
            const userId = parseInt(req.params["id"]);
            for (i = 0; i < data.length; i++) {
                console.log(data[i].id)
                if (data[i].id === userId) {
                    req.body.id = userId
                    data[i] = req.body
                }
            }
           
            writeFile(JSON.stringify(data, null, 2), () => {
                message = 
                        {message: `users id:${userId} updated`}
                
                res.status(200).send(message);
            });
        },
            true);
    });


    // DELETE
    app.delete('/employees/:id', (req, res) => {

        readFile(data => {

            // add the new user
            const userId = req.params["id"];
            delete data[userId];

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`users id:${userId} removed`);
            });
        },
            true);
    });
};

module.exports = userRoutes;