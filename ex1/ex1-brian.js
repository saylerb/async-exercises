var store = {}

function fakeAjax(url,cb) {
  var fake_responses = {
    "file1": "The first text",
    "file2": "The second text",
    "file3": "The third text",
    "file4": "The fourth text"
  };
  var randomDelay = (Math.round(Math.random() * 1E4) % 8000) + 1000;

  console.log("Requesting: " + url);

  setTimeout(function(){
    cb(fake_responses[url]);
  },randomDelay);
}

function output(text) {
  console.log(text);
}


function render(text, target) {
  var node = document.createElement("LI")
  var content = document.createTextNode(text)
  node.appendChild(content)

  var list = document.getElementById(target)
  list.appendChild(node)
}

function renderJSON(text, target) {
  var node = document.createElement("LI")
  var pre =  document.createElement('pre')
  var content = document.createTextNode(text)
  pre.appendChild(content)
  node.appendChild(pre)

  var list = document.getElementById(target)
  list.appendChild(node)
}

// **************************************
// The old-n-busted callback way
//
function getFile(file) {
  // set the state of the file that was requested

  store[file] = {
    rendered: false,
    received: false,
    contents: ""
  }

  render("Request for " + file + ":", 'store')
  renderJSON(JSON.stringify(store, undefined, 2), 'store')
  //console.log('Store before request: ', store)
  fakeAjax(file, function(text){
    handleResponse(file, text)
  })
}

function handleResponse(filename, contents) {
    // add file to store if store doesn't have it yet

    store[filename].received = true
    store[filename].contents = contents

    render("Response for " + filename + "Received:", 'store')
    renderJSON(JSON.stringify(store, undefined, 2), 'store')
    // iterate over the files expected to come back

    var filesToRender = Object.keys(store)

    for (let i = 0; i < filesToRender.length; i++) {
      var fileOfInterest = store[filesToRender[i]]
      // if file to render is in the store (already retrieved)
      // let's check to see if it's time to render it
      if (fileOfInterest.received) {
        if (!fileOfInterest.rendered) {
          output("Output: " + fileOfInterest.contents) // render the string
          render(fileOfInterest.contents, "list")
          fileOfInterest.rendered = true // and mark it as rendered
        }
      } else {
        // the file is not in the store yet, so we don't need to check
        // if it needs to be rendered
        return false
      }
    }
    // if all the files are in the store, the function will not
    // early return and it will print this line
    output("Complete")
}

// request all files at once in "parallel"
store = {}
getFile("file1");
getFile("file2");
getFile("file3");
getFile("file4");
