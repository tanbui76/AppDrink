import express from 'express';
import initAPIRoutes from './route/api';
import bodyParser from 'body-parser';

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

initAPIRoutes(app);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
