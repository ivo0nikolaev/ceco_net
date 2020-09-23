const express = require('express')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.get('/test', (req, res)=>{
    console.log(req.body)
    res.send('IT WORKS!', req.body)
})

app.post("/users", (req, res) => {
    const user = new User(req.body);
    console.log("Req: ", req.body);
    console.log(user);
    user
      .save()
      .then(() => {
        res.status(201).send(user);
      })
      .catch((error) => {
        res.status(400).send(error);
      });
  });
  
app.listen(port, () =>{
    console.log('Testing ... testing ...')
})
