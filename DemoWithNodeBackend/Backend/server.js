const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.use(express.json());


/////POST/////

app.post('/FilteredClients', (req, res) => {
    const { ProjectID, SprintID, ResourceID } = req.body;
    res.sendFile(__dirname + '/Public/Clients.json');
});

app.post('/FilteredProjects', (req, res) => {
    res.sendFile(__dirname + '/Public/Projects.json');
});

app.post('/FilteredSprints', (req, res) => {
    res.sendFile(__dirname + '/Public/Sprints.json');
});

app.post('/FileredResources', (req, res) => {
    res.sendFile(__dirname + '/Public/Resources.json');
});

app.post('/FilteredData', (req, res) => {
    res.sendFile(__dirname + '/Public/InitialData.json');
});


/////GET/////


app.get('/InitialData', (req, res) => {
    res.sendFile(__dirname + '/Public/InitialData.json');
});

app.get('/Assignments', (req, res) => {
    res.sendFile(__dirname + '/Public/Assignments.json')
});

app.get('/Clients', (req, res) => {
    res.sendFile(__dirname + '/Public/Clients.json')
});

app.get('/Projects', (req, res) => {
    res.sendFile(__dirname + '/Public/Projects.json')
});

app.get('/Sprints', (req, res) => {
    res.sendFile(__dirname + '/Public/Sprints.json')
});

app.get('/Resources', (req, res) => {
    res.sendFile(__dirname + '/Public/Resources.json')
});





app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});