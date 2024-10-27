function setUpTrigger() {
  ScriptApp.newTrigger('sendPostRequest')
    .forForm(FormApp.getActiveForm())
    .onFormSubmit()
    .create();
}

function sendPostRequest(e) {
  var responses = e.response.getItemResponses();
  console.log(e.response);
  var sendData = [];
  var files =[];
  var allresponses=[];
  var name ="";
 
   for (var k = 0; k < responses.length; k++) {
    var newTemp = responses[k];
    var key = newTemp.getItem().getTitle().toString();
    var val = newTemp.getResponse();
    var keyVal = [key] + ':'+val;
    allresponses.push(keyVal);
    if(key == "Name of Prospective Tenant"){
      name = val;
    }
  }
  sendData.push({"responses":allresponses});
  

  // Handle file uploads
  var fileResponses = e.response.getItemResponses().filter(function(response) {
    return response.getItem().getType() === FormApp.ItemType.FILE_UPLOAD;
  });

 for (var i = 0; i < fileResponses.length; i++) {
    var file = fileResponses[i].getResponse();
    for (var j = 0; j < file.length; j++) {
      var fileId = file[j];
      var fileName = fileResponses[i].getItem().getTitle();


      // Set file permission to be viewable by anyone with the link
      DriveApp.getFileById(fileId).setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      
      var fileData = {
        "fileName": fileName,
        "fileUrl": fileId
      };
      files.push(fileData);
    }
  }
  sendData.push({"files":files});
  sendData.push({"name":name});
  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(sendData),
    'muteHttpExceptions': true
  };
  Logger.log(JSON.stringify(sendData));
  var myResponse = UrlFetchApp.fetch('https://prod-29.westeurope.logic.azure.com:443/workflows/0ad0e5580519426db66f0f5ca50aa151/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=MglEpvEhIcVXnSbOTDHeUTStp4O97hP1gtx7llK7RHM', options); // Replace with your Power Automate HTTP trigger URL
  Logger.log(myResponse.getContentText()); 
}