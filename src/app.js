const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

console.log(__dirname)
console.log(path.join(__dirname, '../public'))

const app = express()
const port = process.env.PORT || 3000

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialPaths = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
// inform express to set handlebar and hbs wants all the files to be stored in views folder in the root directory
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialPaths)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

// now we need to use views folder for hbs, hbs will automatically identify views folder
app.get('', (req, res) => {
    res.render('index', {
        title: 'Hbs training',
        name: 'Ruth'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Ruth'
    }) // file name
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text',
        title: 'Help',
        name: 'Ruth'
    })
})


// NOW WE SET UP A SERVER TO TELL WHAT TO HAPPEN IF USER GOES TO THE SPECIFIED URL
// WE WILL REMOVE THIS DEFAULT SINCE IT IS HANDLED IN INDEX.HTML
// app.get('', (req, res) => {
//     res.send('<h1>Weather</h1>')
// })

// WE WILL BE REMOVING THE ROUTES for about and help, BECAUSE APP.USE(EXPRESS.STATIC(DIR NAME) IS POINTING TO PUBLIC, AND IT WILL TAKE THE RESPECTIVE FILES) 


app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            'error': 'you must provide an address'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({
                error
            })
        }
        forecast(latitude, longitude, (error, data) => {
            if (error) {
                return res.send({
                    error
                })
            }

            res.send({
                location,
                forecast: data,
                address: req.query.address
            })
        })
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            'error': 'You must provide a search term'
        })
    }
    console.log(req.query)
    res.send({
        'products': []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        errorMessage: 'Help article not found',
        name: 'Ruth'
    })
})


app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        errorMessage: 'Page not found',
        name: 'Ruth'
    })
})


// USE LISTEN TO START UP THE SERVER
app.listen(port, () => {
    console.log('Server is up on port' + port)
})
