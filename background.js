// save the url so that it's accessible everywhere
var url = null;

// return a handler to notify the user of a success
function getSuccessNotificationHandler() {
  return function() {
    console.log("Successfully removed " + url + " from browser history.");

    var opt = {
      type: "basic",
      iconUrl: "bluify-48.png",
      title: "bluifyed!",
      message: "Successfully removed " + url + " from history."
    };

    chrome.notifications.create(opt);
  };
}

// return a handler to delete browser data for a given url
function getBrowserDataDeletionHandler() {
  return function() {
    // a url can include more elements than the origin url
    let pathArr = url.split("/");
    let protocol = pathArr[0];
    let host = pathArr[2];
    let originUrl = protocol + "//" + host;

    chrome.browsingData.remove(
      {
        origins: [originUrl]
      },
      {
        cacheStorage: true,
        cookies: true,
        fileSystems: true,
        indexedDB: true,
        localStorage: true,
        pluginData: true,
        serviceWorkers: true,
        webSQL: true
      },
      getSuccessNotificationHandler()
    );
  };
}

// return a handler to search for instances of that url in the browser's history
function getHistoryDeletetionHandler(del) {
  if (del) {
    return function(visits_arr) {
      console.log("Found " + visits_arr.length + " visits to " + url + ".");

      // delete history only if any url visits found
      if (visits_arr.length > 0) {
        console.log("Attempting to remove " + url + " from browser history.");
        chrome.history.deleteUrl({ url: url }, getBrowserDataDeletionHandler());
      } else {
        // notify the user that no url visits were found
        var opt = {
          type: "basic",
          iconUrl: "bluify-48.png",
          title: "None found",
          message: "No vists to " + url + " found in history."
        };

        chrome.notifications.create(opt);
      }
    };
  } else {
    return function(visits_arr) {
      console.log("Found " + visits_arr.length + " visits to " + url + ".");

      // delete history only if any url visits found
      if (visits_arr.length > 0) {
        console.log("Attempting to remove " + url + " from browser history.");
        chrome.history.deleteUrl({ url: url }, getSuccessNotificationHandler());
      } else {
        // notify the user that no url visits were found
        var opt = {
          type: "basic",
          iconUrl: "bluify-48.png",
          title: "None found",
          message: "No vists to " + url + " found in history."
        };

        chrome.notifications.create(opt);
      }
    };
  }
}

// return a handler to delete the address from the browser history
function getClickHandler(del) {
  return function(info, tab) {
    url = info.linkUrl;

    // find any visits to the given url first
    chrome.history.getVisits({ url: url }, getHistoryDeletetionHandler(del));
  };
}

// create a context menu for links
chrome.contextMenus.create(
  {
    title: "Forget this link",
    type: "normal",
    contexts: ["link"],
    onclick: getClickHandler(False)
  },
  {
    title: "Forget this link and delete data",
    type: "normal",
    contexts: ["link"],
    onclick: getClickHandler(True)
  }
);
