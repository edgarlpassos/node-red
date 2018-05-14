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

    function notifyNodeRemoved(node) {
        console.log('Watcher :: Node Removed');
        console.log(node);
    }

    function notifyLinkAdded(newLink) {
        console.log("Watcher :: Link added.");
        console.log(newLink);
    }

    function notifyLinkRemoved(link) {
        console.log('Watcher :: Link Removed');
        console.log(link);
    }

    function addNode(newNode) {
        RED.view.addNode(newNode.type, 50, 50);
    }

    return {
        addNode: addNode,
        init: init,
        notifyNodeAdded: notifyNodeAdded,
        notifyNodeRemoved: notifyNodeRemoved,
        notifyLinkAdded: notifyLinkAdded,
        notifyLinkRemoved: notifyLinkRemoved
    }
})();
