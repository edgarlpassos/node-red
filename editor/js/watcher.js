/*
 * FEUP ASSO 2017/2018
 * Edgar Passos, José Pedro Monteiro, Maria João Mira Paulo 
 **/
RED.watcher = (function() {
    function init() {}

    function notifyNodeAdded(newNode) {
        console.log("Watcher :: Node added.");
        console.log(newNode);
    }

    function notifyLinkAdded(newLink) {
        console.log("Watcher :: Link added.");
        console.log(newLink);
    }

    return {
        init: init,
        notifyNodeAdded: notifyNodeAdded,
        notifyLinkAdded: notifyLinkAdded
    }
})();
