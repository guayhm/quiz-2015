var models = require('../models/models.js');

// Autoload para rutas con parámetro quizId
exports.load = function(req, res,  next, quizId) {
	models.Quiz.find(quizId).then(
		function(quiz) {
			if (quiz) {
				req.quiz = quiz;
				next();
			} else {
				next(new Error('No existe pregunta con id ' + quizId));
			}
		}
	).catch(function(error) {next(error);});
};

// GET /quizes y  /quizes?search
exports.index = function(req, res) {
if (req.query.search){
 	 var search = '%' + (req.query.search).replace(/ /g,'%') + '%';
	 models.Quiz.findAll({where:["pregunta like ?",search], order: 'pregunta ASC'}).then(function(quizes){
 	 res.render('quizes/index', {quizes: quizes, errors: []});
 	}).catch(function(error) {next(error);})
}
else {
	models.Quiz.findAll().then(
		function(quizes) {
		res.render('quizes/index.ejs', {quizes: quizes, errors: []});
	   }
   ).catch(function(error){next(error);});
  }
};


// GET /quizes/:quizId
exports.show = function(req, res) {
	res.render('quizes/show', {quiz: req.quiz, errors: []});
};

// DELETE /quizes/:quizId
exports.destroy = function(req, res) {
	req.quiz.destroy().then( function() {
		res.redirect('/quizes');
	}).catch(function(error){next(error)});
}; 

// GET /quizes/:quizId/answer
exports.answer = function(req, res) {
	var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta) {
		resultado = 'Correcto';
	}
	res.render('quizes/answer', 
	{quiz: req.quiz, 
	respuesta: resultado, 
	errors: []});
};



// GET /quizes/new
exports.new = function(req, res) {
	// crea objeto enlazado a base de datos 
	// para guardar posteriormente con save()
	var quiz = models.Quiz.build(
		{pregunta: "Pregunta", respuesta: "Respuesta", tema: "Tema"});
	
	res.render('quizes/new', {quiz: quiz, errors: []});	
};

 // POST /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build(req.body.quiz);

	var errors = quiz.validate();
	
	if (errors) {
		var i=0; var errores = new Array();//se convierte en [] con la propiedad message por compatibilidad con layout
		for (var prop in errors) {
			errores[i++] = { message: errors[prop] };
		}
		res.render('quizes/new', {quiz: quiz, errors: errores});
	} else {
		quiz.save({fields: ["pregunta", "respuesta","tema"]}).then( function() {
			res.redirect('/quizes');
		});
	}
};


//GET/ quizes/:id/edit
exports.edit = function(req, res) {
	var quiz = req.quiz;
	res.render('quizes/edit', {quiz: quiz, errors: []});
};


//PUT/quizes/:id
exports.update = function(req, res) {
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;

	var errors = req.quiz.validate();
	
	if (errors) {
		var i=0; var errores = new Array();//se convierte en [] con la propiedad message por compatibilidad con layout
		for (var prop in errors) {
			errores[i++] = { message: errors[prop] };
		}
		res.render('quizes/edit', {quiz: req.quiz, errors: errores});
	} else {
		req.quiz.save({fields: ["pregunta", "respuesta","tema"]}).then( function() {
			res.redirect('/quizes');
		});
	}
 }; 