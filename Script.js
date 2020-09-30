
let POGI_URL = 'https://www.-.com:7000' // Insert your Pogi server URL here
let user_ID = "" // Insert your Pogi user ID here
let password = "" // Insert your Pogi password here
let newTag = "000000000000000000000000"  // Tag that will be added
let zone = "" // Inventory location where tag will be saved and edited


async function getVersion() {
    response = await fetch(POGI_URL + '?op=get-version', { method: 'GET' }); // Send GET request to Pogi for its v
    json = await response.json(); // Grab JSON response
    var str = JSON.stringify(json, undefined, 2); // Preformat JSON output with spacing level = 2
    document.getElementById("output").innerHTML = str; // Display output in webpage
}

async function getToken() {
    // Assemble request body containing login credentials
    let getTokenParams = {
        "op":"token-get",
        "userId": user_ID,
        "password": password
    }
    response = await fetch(POGI_URL, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(getTokenParams)}); // Fetch data from Pogi
    json = await response.json(); // Grab JSON response
    var str = JSON.stringify(json, undefined, 2); // Preformat JSON output with spacing level = 2 
    document.getElementById("output").innerHTML = str; // Display output in webpage
    currentToken = json.token; // Get new token for use with API calls requiring Authentication
    localStorage.setItem("loginToken", currentToken); // Store token for next use
    //console.log(currentToken);
}

async function getHistory() {
    let currentToken = localStorage.getItem("loginToken"); // get stored token from storage
    
    // Assemble request body
    let historyparams = {
        "token" : currentToken,
        "op" : "history",
        "fromDate" : "2020-01-01",
        "fromTime" : "00:00:00",
        "toDate" :"2020-12-31",
        "toTime" : "12:00:00",
        "limit" : 5,
        "offset" : 0,
        "orderDirection" : "DESC" 
    }

    response = await fetch(POGI_URL, { method: 'POST', headers: {'Content-Type': 'application/json'} , body: JSON.stringify(historyparams)}); // Request History from Pogi
    json = await response.json(); // Grab JSON response
    var str = JSON.stringify(json, undefined, 3); // Preformat JSON output with spacing level = 3 
    document.getElementById("output").innerHTML = str; // Display output in webpage
}

async function getLocation() {
    let currentToken = localStorage.getItem("loginToken"); // get stored token from storage
    
    // Assemble request body
    let locationparams = {
        "token" : currentToken,
        "op" : "zone-list"
    }

    response = await fetch(POGI_URL, { method: 'POST', headers: {'Content-Type': 'application/json'} , body: JSON.stringify(locationparams)}); // Request Zone list from Pogi
    json = await response.json(); // Grab JSON response
    var str = JSON.stringify(json, undefined, 3); // Preformat JSON output with spacing level = 3 
    document.getElementById("output").innerHTML = str; // Display output in webpage
}

async function addTag() {   
    let currentToken = localStorage.getItem("loginToken"); // get stored token from storage

    // 1. Delete Tag
    // Assemble JSON body for deleting tag ID
    let deletetagparams = {
        "op":"id-delete",
        "token" : currentToken,
        "tagId": newTag
    }
    response = await fetch(POGI_URL, { method: 'POST', headers: {'Content-Type': 'application/json'} , body: JSON.stringify(deletetagparams)}); // Request tag delete from Pogi
    json = await response.json(); // Grab JSON response
    document.getElementById("deletetagOutput").innerHTML = JSON.stringify(json, undefined, 3); // Display output in webpage

    // 2. Check if deleted Tag still exists
    // Assemble JSON body for querying tag ID existence
    let checktagparams = {
        "op":"id-exists",
        "token" : currentToken,
        "tagId": newTag
    }   

    response = await fetch(POGI_URL, { method: 'POST', headers: {'Content-Type': 'application/json'} , body: JSON.stringify(checktagparams)}); // Check if Tag exists in Pogi
    json = await response.json(); // Grab JSON response
    var str = JSON.stringify(json, undefined, 3); // Preformat JSON output with spacing level = 3 
    document.getElementById("checktagOutput").innerHTML = str; // Display output in webpage

    // 3. Check if tag has deleted state
    // Assemble JSON body to check if tag ID is still in deleted state
    let deletedtagparams = {
        "op":"id-deleted",
        "token" : currentToken,
        "tagId": newTag
    }  

    response = await fetch(POGI_URL, { method: 'POST', headers: {'Content-Type': 'application/json'} , body: JSON.stringify(deletedtagparams)}); // Check if Tag is still in deleted state
    json = await response.json(); // Grab JSON response
    var str = JSON.stringify(json, undefined, 3); // Preformat JSON output with spacing level = 3 
    document.getElementById("deletedtagOutput").innerHTML = str; // Display output in webpage

    // 4. Remove Tag deleted state
    // Assemble JSON body to remove tag from deleted state
    let undeletetagparams = {
        "op":"id-undelete",
        "token" : currentToken,
        "tagId": newTag
    } 

    response = await fetch(POGI_URL, { method: 'POST', headers: {'Content-Type': 'application/json'} , body: JSON.stringify(undeletetagparams)}); // Remove tag from its deleted state
    json = await response.json(); // Grab JSON response
    var str = JSON.stringify(json, undefined, 3); // Preformat JSON output with spacing level = 3 
    document.getElementById("undeletetagOutput").innerHTML = str; // Display output in webpage 

    // 5. Add Tag
    // Assemble JSON body for containing the tag information
    let addtagparams = {
        "op":"id-add",
        "token": currentToken,
        "tagId": newTag,
        "external_id":"Bag Tag",
        "description":"Bag Tag",
        "model_number":"Hanging tag",
        "name":"Bag Tag 1",
        "owner":"Admin",
        "part_number": "0000",
        "serial_number": "0000",
        "zone": zone
    } 

    response = await fetch(POGI_URL, { method: 'POST', headers: {'Content-Type': 'application/json'} , body: JSON.stringify(addtagparams)}); // Push add tag request to Pogi
    json = await response.json(); // Grab JSON response
    var str = JSON.stringify(json, undefined, 3); // Preformat JSON output with spacing level = 3 
    document.getElementById("addtagOutput").innerHTML = str; // Display output in webpage
   
    // 6. Show tag information to confirm
    // Assemble JSON body for requesting tag information from pogi
    let gettagparams = {
        "op":"id-get",
        "token" : currentToken,
        "tagId": newTag
    } 

    response = await fetch(POGI_URL, { method: 'POST', headers: {'Content-Type': 'application/json'} , body: JSON.stringify(gettagparams)}); // Request for tag information from Pogi
    json = await response.json(); // Grab JSON response
    var str = JSON.stringify(json, undefined, 3); // Preformat JSON output with spacing level = 3 
    document.getElementById("gettagOutput").innerHTML = str; // Display output in webpage
}

async function editTag() {   
    let currentToken = localStorage.getItem("loginToken"); // get stored token from storage

    // 1. Edit Tag
    // Assemble JSON body to update tag information
    let edittagparams = {
        "op":"id-update",
        "token": currentToken,
        "tagId": newTag,
        "external_id":"Package Tag",
        "description":"Package Tag",
        "model_number":"Sticker tag",
        "name":"Package Tag 1",
        "owner":"Admin",
        "part_number": "0001",
        "serial_number": "0001",
        "zone": zone
    } 

    response = await fetch(POGI_URL, { method: 'POST', headers: {'Content-Type': 'application/json'} , body: JSON.stringify(edittagparams)}); // Push new tag information to Pogi
    json = await response.json(); // Grab JSON response
    var str = JSON.stringify(json, undefined, 3); // Preformat JSON output with spacing level = 3 
    document.getElementById("edittagOutput").innerHTML = str; // Display output in webpage


    // 2. Show tag information to confirm
    // Assemble JSON body for requesting tag information from pogi
    let gettagparams = {
        "op":"id-get",
        "token" : currentToken,
        "tagId": newTag
    }   

    response = await fetch(POGI_URL, { method: 'POST', headers: {'Content-Type': 'application/json'} , body: JSON.stringify(gettagparams)}); // Request for tag information from Pogi
    json = await response.json(); // Grab JSON response
    var str = JSON.stringify(json, undefined, 3); // Preformat JSON output with spacing level = 3 
    document.getElementById("gettagOutput").innerHTML = str; // Display output in webpage
}
