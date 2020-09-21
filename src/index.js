const express = require('express')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.get('/test', (req, res)=>{
    console.log(req.body)
    res.send('IT WORKS!', req.body)
})

app.listen(port, () =>{
    console.log('Testing ... testing ...')
})
