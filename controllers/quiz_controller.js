var models = require('../models/models.js');

//GET/quizes/question
exports.question = function(req,res){
    models.Quiz.findAll().success(function(quiz){
      res.render('quizes/question',{pregunta:quiz[0].pregunta});
    })
   // res.render('quizes/question',{pregunta:'Capital de Italia'});
};

//GET/quizes/answers
exports.answer=function(req,res){
   //if (req.query.respuesta === 'Roma'){
  models.Quiz.findAll().success(function(quiz){
    if (req.query.respuesta===quiz[0].respuesta){
 
      res.render('quizes/answer',{respuesta: 'Correcto'});
    } else{
      res.render('quizes/answer',{respuesta: 'Incorrecta'});
    } 
  })
};