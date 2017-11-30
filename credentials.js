module.exports = {
	mongo: {
		development: {
			connectionString: 'mongodb://localhost:27017/edu'	//local db
		},
		production: {
			connectionString: 'mongodb://Carl:588@ds159767.mlab.com:59767/edu'	//local db
		}
	}
};
