const exress = require('express')''
const myRouter = require('./routes/router');
const app = express();

const app.use(exress.json());

const app.use(myRouter);

app.listen(3000, ()=> console.log(server is running))