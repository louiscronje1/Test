const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

const readJsonFileSync = (filepath) => {
    const file = fs.readFileSync(filepath, 'utf8');
    return JSON.parse(file);
};

const filterData = (data, ids, key) => {
    if (!ids || ids.length === 0) return data;
    return data.filter(item => ids.includes(item[key]));
};

const parseIds = (idStr) => {
    return idStr ? idStr.split(',').map(Number).filter(Number.isFinite) : [];
};

/////POST////


const filterTasksByResource = (nodes, resourceIds) => {
    const filteredNodes = [];
    nodes.forEach(node => {
        if (node.children) {
            const filteredChildren = filterTasksByResource(node.children, resourceIds);
            if (filteredChildren.length > 0) {
                filteredNodes.push({ ...node, children: filteredChildren });
            }
        } else {
            if (resourceIds.includes(node.resource)) {
                filteredNodes.push(node);
            }
        }
    });
    return filteredNodes;
};


app.post('/FilteredClients', (req, res) => {
    const { ProjectID, SprintID, ResourceID } = req.body;
    let clients = readJsonFileSync(path.join(__dirname, '/Public/Clients.json'));
    clients.data = filterData(clients.data, parseIds(ProjectID), 'ProjectID');
    clients.data = filterData(clients.data, parseIds(SprintID), 'SprintID');
    clients.data = filterData(clients.data, parseIds(ResourceID), 'ResourceID');
    res.json(clients);
});

app.post('/FilteredProjects', (req, res) => {
    const { ClientID, SprintID, ResourceID } = req.body;
    let projects = readJsonFileSync(path.join(__dirname, '/Public/Projects.json'));
    projects.data = filterData(projects.data, parseIds(ClientID), 'ClientID');
    projects.data = filterData(projects.data, parseIds(SprintID), 'SprintID');
    projects.data = filterData(projects.data, parseIds(ResourceID), 'ResourceID');
    res.json(projects);
});

app.post('/FilteredSprints', (req, res) => {
    const { ClientID, ProjectID, ResourceID } = req.body;
    let sprints = readJsonFileSync(path.join(__dirname, '/Public/Sprints.json'));
    sprints.data = filterData(sprints.data, parseIds(ClientID), 'ClientID');
    sprints.data = filterData(sprints.data, parseIds(ProjectID), 'ProjectID');
    sprints.data = filterData(sprints.data, parseIds(ResourceID), 'ResourceID');
    res.json(sprints);
});

app.post('/FilteredResources', (req, res) => {
    const { ClientID, ProjectID, SprintID } = req.body;
    let resources = readJsonFileSync(path.join(__dirname, '/Public/Resources.json'));
    resources.data = filterData(resources.data, parseIds(ClientID), 'ClientID');
    resources.data = filterData(resources.data, parseIds(ProjectID), 'ProjectID');
    resources.data = filterData(resources.data, parseIds(SprintID), 'SprintID');
    res.json(resources);
}); 


app.post('/FilteredData', (req, res) => {
    const { ResourceID } = req.body;
    let resourceIds = parseIds(ResourceID);

    let data = readJsonFileSync(path.join(__dirname, '/Public/InitialData.json'));

    // Check if resourceIds array is empty
    if (resourceIds.length === 0) {
        // If no resource IDs are provided, return all data
        res.json(data);
    } else {
        // Only apply filtering if there are resource IDs
        data.data = data.data.map(client => {
            const filteredProjects = filterTasksByResource(client.children, resourceIds);
            return { ...client, children: filteredProjects };
        }).filter(client => client.children.length > 0);
        res.json(data);
    }
});



/////GET/////

app.get('/InitialData', (req, res) => {
    res.sendFile(path.join(__dirname, '/Public/InitialData.json'));
});

app.get('/Assignments', (req, res) => {
    res.sendFile(path.join(__dirname, '/Public/Assignments.json'));
});

app.get('/Clients', (req, res) => {
    res.sendFile(path.join(__dirname, '/Public/Clients.json'));
});

app.get('/Projects', (req, res) => {
    res.sendFile(path.join(__dirname, '/Public/Projects.json'));
});

app.get('/Sprints', (req, res) => {
    res.sendFile(path.join(__dirname, '/Public/Sprints.json'));
});

app.get('/Resources', (req, res) => {
    res.sendFile(path.join(__dirname, '/Public/Resources.json'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
