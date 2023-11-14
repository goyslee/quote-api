const express = require('express');
const app = express();

const { quotes } = require('./data'); // Importing quotes from data.js
const { getRandomElement } = require('./utils'); // Importing the utility function
const bodyParser = require('body-parser');


const PORT = process.env.PORT || 4001;

app.use(express.static('public'));
app.use(bodyParser.json()); // For parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded


// Route for getting a random quote
app.get('/api/quotes/random', (req, res) => {
    const randomQuote = getRandomElement(quotes);
    res.json({ quote: randomQuote });
});

// Route for getting all quotes or quotes by a specific person
app.get('/api/quotes', (req, res) => {
    if (req.query.person) {
        // Filter quotes by the specified person
        const filteredQuotes = quotes.filter(quote => quote.person === req.query.person);
        res.json({ quotes: filteredQuotes });
    } else {
        // If no person query parameter, return all quotes
        res.json({ quotes: quotes });
    }
});

app.post('/api/quotes', (req, res) => {
    const { quote, person } = req.query; // Getting data from query parameters

    // Check if both quote and person exist
    if (!quote || !person) {
        return res.status(400).json({ error: 'Both quote and person are required' });
    }

    // Add the new quote to the quotes array
    const newQuote = { quote, person };
    quotes.push(newQuote);

    // Send the new quote back in the response
    res.status(201).json({ quote: newQuote }); // Use a 201 status code for successful creation
});


app.listen(PORT, () => { 
    console.log(`Server is running on Port: ${PORT}`) 
});
