// include my model for this application
var mongoModel = require("../models/user.js")

// Define the routes for this controller
exports.init = function(app) {
  app.get('/', index); // essentially the app welcome page
  /*
   * The :collection parameter maps directly to the mongoDB collection.
   * I've done this to have a very general set of operations to experiment with
   * but this is VERY BAD form for the client to supply the collection name
   * in an actual application.  You don't want to give a potentially malicious
   * client such a direct access into your database.  In your final project,
   * your app should define the collection name and should not get it from the
   * client. That is, just have a "const" variable in your model that defines
   * the collection name. WARNING:  In your final project, points will be lost
   * if the collection name comes from the client.
   */
  app.put('/users/new/:data', doCreate); // CRUD Create
  app.get('/users', doRetrieve); // CRUD Retrieve
  app.post('/users/update/:filter/:data', doUpdate); // CRUD Update
  app.post('/users/destroy/:data', doDestroy); // CRUD Update
  // The CRUD Delete path is left for you to define
}

// No path:  display instructions for use
index = function(req, res) {
  res.render('help', {title: 'MongoDB Test'})
};

/********** CRUD Create *******************************************************
 * Take the object defined in the request body and do the Create
 * operation in mongoModel.
 */
doCreate = function(req, res){

  // if (Object.keys(req.body).length == 0) {
  //   res.render('message', {title: 'Mongo Demo', obj: "No create message body found"});
  //   return;
  // }

  console.log(req.params.data);

  mongoModel.create ( 'users',
	                    JSON.parse(req.params.data),
		                  function(result) {
		                    // result equal to true means create was successful
  		                  var success = (result ? "Create successful" : "Create unsuccessful");
	  	                  res.render('message', {title: 'Mongo Demo', obj: success});
		                  });
}

/********** CRUD Retrieve (or Read) *******************************************
 * Take the object defined in the query string and do the Retrieve
 * operation in mongoModel.
 */

doRetrieve = function(req, res){
  /*
   * Call the model Retrieve with:
   *  - The collection to Retrieve from
   *  - The object to lookup in the model, from the request query string
   *  - As discussed above, an anonymous callback function to be called by the
   *    model once the retrieve has been successful.
   * modelData is an array of objects returned as a result of the Retrieve
   */
  mongoModel.retrieve(
    'users',
    req.query,
		function(modelData) {
		  if (modelData.length) {
        res.render('message',{title: 'Mongo Demo', obj: JSON.stringify(modelData)});
      } else {
        var message = "No documents with "+JSON.stringify(req.query)+
                      " in collection "+'users'+" found.";
        res.render('message', {title: 'Mongo Demo', obj: message});
      }
		});
}

/********** CRUD Update *******************************************************
 * Take the MongoDB update object defined in the request body and do the
 * update.  (I understand this is bad form for it assumes that the client
 * has knowledge of the structure of the database behind the model.  I did
 * this to keep the example very general for any collection of any documents.
 * You should not do this in your project for you know exactly what collection
 * you are using and the content of the documents you are storing to them.)
 */
doUpdate = function(req, res){
  // if there is no filter to select documents to update, select all documents
  var filter = req.params.filter ? JSON.parse(req.params.filter) : {};
  // if there no update operation defined, render an error page.
  if (!req.params.filter) {
    res.render('message', {title: 'Mongo Demo', obj: "No update operation defined"});
    return;
  }
  var update = JSON.parse(req.params.filter);
  /*
   * Call the model Update with:
   *  - The collection to update
   *  - The filter to select what documents to update
   *  - The update operation
   *    E.g. the request body string:
   *      find={"name":"pear"}&amp;update={"$set":{"leaves":"green"}}
   *      becomes filter={"name":"pear"}
   *      and update={"$set":{"leaves":"green"}}
   *  - As discussed above, an anonymous callback function to be called by the
   *    model once the update has been successful.
   */
  mongoModel.update(  'users', filter, update,
		                  function(status) {
              				  res.render('message',{title: 'Mongo Demo', obj: status});
		                  });
}

doDestroy = function(req, res){
  // if there is no filter to select documents to destroy, select all documents
  var filter = req.params.data ? JSON.parse(req.params.data) : {};
  // var destroy = JSON.parse(req.body.destroy);

  mongoModel.destroy( 'users', filter,
                      function(data) {
                        res.render('message',{title: 'Mongo Demo', obj: data});
                      });
}
