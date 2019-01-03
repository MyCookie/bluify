// save the url so that it's accessible everywhere
var url = null;

// return a handler to notify the user of a success
function getSuccessNotificationHandler() {
    return function() {
        var opt = {
            type : "basic",
            iconUrl : "bluify-48.png",
            title : "Success",
            message : "Successfully removed " + url + " from history."
        }

        chrome.notifications.create({
            options : opt
        });
    };
};

// return a handler to search for instances of that url in the browser's history
function getHistoryDeletetionHandler() {
    return function(url_arr) {
        console.log("Found " + url_arr.length + " visits to URL.");

        // delete history only if any url visits found
        if (url_arr > 0) {
            chrome.history.deleteUrl({
                url : url,
                callback : getSuccessNotificationHandler()
            });
        } else { // notify the user that no url visits were found
            var opt = {
                type : "basic",
                iconUrl : "bluify-48.png",
                title : "None found",
                message : "No vists to " + url + " found in history."
            }

            chrome.notifications.create({
                options : opt
            });
        }
    }
}

// return a handler to delete the address from the browser history
function getClickHandler() {
    return function(info, tab) {
        url = info.linkUrl;
        console.log("Attempting to remove " + url + " from browser history.");

        // find any visits to the given url first
        var opt = {
            url : info.linkUrl
        }

        chrome.history.getVisits({
            details : opt,
            callback : getHistoryDeletetionHandler()
        });
    };
};

// create a context menu for links
chrome.contextMenus.create ({
    "title" : "Forget this link",
    "type" : "normal",
    "contexts" : ["link"],
    "onClick" : getClickHandler()
});