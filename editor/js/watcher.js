/*
 * FEUP ASSO 2017/2018
 * Edgar Passos, José Pedro Monteiro, Maria João Mira Paulo 
 **/
RED.watcher = (function() {

    var settings = {
        protocolId: 'MQIsdp',
        protocolVersion: 3,
        keepalive: 1000, // sec
        lastWillTopic: 'watcher/offline',
        clientId: 'node-red-watcher'
    }

    var client = mqtt.connect('ws://localhost:1080', settings)
    
    client.on('connect', function() {
        client.subscribe('raspberry/all');
    })

    client.on('message', function(topic, message) {
        switch (topic) {
            case 'raspberry/all':
                var parsedMessage = new TextDecoder("utf-8").decode(message);
                var messageInfo = parsedMessage.split(':');
                if (messageInfo[0].trim() === 'RPi connected') {
                    var deviceName = messageInfo[1].trim();
                    deviceConnected(deviceName);
                }
                break;
            default:
                break;
        }
    })

    function init() {
        
    }

    function test() {
        //deviceConnected('127.0.0.1', '3000', '3001');
    }

    // Called when a node is added in the canvas
    function notifyNodeAdded(newNode) {
        console.log("Watcher :: Node added.");
    }

    // Called when a node is removed in the canvas
    function notifyNodeRemoved(node) {
        console.log('Watcher :: Node Removed');
    }

    // Called when a link is added in the canvas
    function notifyLinkAdded(newLink) {
        console.log("Watcher :: Link added.");
    }

    // Called when a link is removed in the canvas
    function notifyLinkRemoved(link) {
        console.log('Watcher :: Link Removed');
    }

    // Adds a new node to the canvas
    function addNode(newNode) {
        var result = RED.view.addNode(newNode.type, 50, 50);
        result.node.x = 50;
        result.node.host = newNode.host;
        result.node.y = 50;
        RED.nodes.add(result.node);
        RED.editor.validateNode(result.node);
        RED.view.redraw(true);
    }

    // Removes a node from the canvas
    function removeNode(newNode) {
        //RED.view.addNode(newNode.type, 50, 50);
    }

    // Called when a new device connects to the message broker
    function deviceConnected(deviceName) {
        addNode({
            'host': 'TO ' + deviceName,
            'type': 'tcp out'
        });

        addNode({
            'host': 'FROM ' + deviceName,
            'type': 'tcp in'
        });
    }

    // Called when a device disconnected from the message broker
    function deviceDisconnected(ip) {
    }

    function getInstance() {
        return RED;
    }

    return {
        addNode: addNode,
        init: init,
        notifyNodeAdded: notifyNodeAdded,
        notifyNodeRemoved: notifyNodeRemoved,
        notifyLinkAdded: notifyLinkAdded,
        notifyLinkRemoved: notifyLinkRemoved,
        removeNode: removeNode,
        test: test,
        getInstance: getInstance
    }
})();
