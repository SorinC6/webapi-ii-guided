const express = require('express');
const routes = express.Router();

const Hubs = require('./hubs/hubs-model.js');

routes.use(express.json());

routes.get('/', (req, res) => {
	res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome to the Lambda Hubs API</p>
  `);
});

// routes.get('/api/hubs', async (req, res) => {
// 	try {
// 		const hubs = await Hubs.find(req.query);
// 		res.status(200).json(hubs);
// 	} catch (error) {
// 		// log error to database
// 		console.log(error);
// 		res.status(500).json({
// 			message: 'Error retrieving the hubs'
// 		});
// 	}
// });

routes.get('/api/hubs', (req, res) => {
	Hubs.find(req.query)
		.then((hubs) => {
			res.status(200).json(hubs);
		})
		.catch((err) => {
			res.status(500).json({ message: 'Error retriving the hubs' });
		});
});

routes.get('/api/hubs/:id', async (req, res) => {
	try {
		const hub = await Hubs.findById(req.params.id);

		if (hub) {
			res.status(200).json(hub);
		} else {
			res.status(404).json({ message: 'Hub not found' });
		}
	} catch (error) {
		// log error to database
		console.log(error);
		res.status(500).json({
			message: 'Error retrieving the hub'
		});
	}
});

routes.post('/api/hubs', async (req, res) => {
	try {
		const hub = await Hubs.add(req.body);
		res.status(201).json(hub);
	} catch (error) {
		// log error to database
		console.log(error);
		res.status(500).json({
			message: 'Error adding the hub'
		});
	}
});

routes.delete('/api/hubs/:id', async (req, res) => {
	try {
		const count = await Hubs.remove(req.params.id);
		if (count > 0) {
			res.status(200).json({ message: 'The hub has been nuked' });
		} else {
			res.status(404).json({ message: 'The hub could not be found' });
		}
	} catch (error) {
		// log error to database
		console.log(error);
		res.status(500).json({
			message: 'Error removing the hub'
		});
	}
});

routes.put('/api/hubs/:id', async (req, res) => {
	try {
		const hub = await Hubs.update(req.params.id, req.body);
		if (hub) {
			res.status(200).json(hub);
		} else {
			res.status(404).json({ message: 'The hub could not be found' });
		}
	} catch (error) {
		// log error to database
		console.log(error);
		res.status(500).json({
			message: 'Error updating the hub'
		});
	}
});

routes.get('/api/hubs/:id/messages', (req, res) => {
	const idHub = req.params;

	Hubs.findHubMessages(idHub.id)
		.then((mess) => {
			if (mess.length > 0) {
				res.json(mess);
			} else {
				res.status(404).json({ messsage: 'TheHub id is not there' });
			}
		})
		.catch((err) => res.status(500).json({ error: 'error getting the messages' }));
});

routes.post('/api/hubs/:id/messages', async (req, res) => {
	const text = req.body.text;
	const sender = req.body.sender;
	const id = req.params.id;
	try {
		const mess = await Hubs.addMessage({
			hub_id: id,
			text: text,
			sender: sender
		});
		res.status(201).json(mess);
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong' });
	}
});

module.exports = routes;
