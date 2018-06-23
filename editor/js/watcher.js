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

        // Get the direction of the flow (into the device or from the device)
        var source = newLink.source;
        var sourceHost =  source.host.split(' ');
        var sourceDirection = sourceHost[0];
        var sourceName = sourceHost[1];

        var target = newLink.target;
        var targetHost =  target.host.split(' ');
        var targetDirection = targetHost[0];
        var targetName = targetHost[1];

        // Invalid cases (FROM to FROM or TO to TO)
        // Should be blocked by the canvas
        if (sourceDirection === targetDirection) {
            return;
        }

        // Get the name of the device that will subscribe to the other's topic
        var subscriberName;
        var publisherName;

        if (sourceDirection === 'TO') {
            subscriberName = sourceName;
            publisherName = targetName;
        } else {
            subscriberName = targetName;
            publisherName = sourceName; 
        }

        // And publish a message telling him to subscribe to the other device
        publish('raspberry/all', 'SUBSCRIBE ' + subscriberName + ' ' + publisherName);
    }

    // Called when a link is removed in the canvas
    function notifyLinkRemoved(link) {
        console.log('Watcher :: Link Removed');
    }

    // Adds a new node to the canvas
    function addNode(newNode) {

        // Create a Node Red Node
        var result = RED.view.addNode(newNode.type, 50, 50);

        result.node.x = 50;
        result.node.y = 50;
        result.node.host = newNode.host;

        // Add it to the Node-Red node list
        RED.nodes.add(result.node);
        RED.editor.validateNode(result.node);

        // Make it appear on the canvas
        RED.view.redraw(true);
    }

    // Removes a node from the canvas
    function removeNode(newNode) {
        //RED.view.addNode(newNode.type, 50, 50);
    }

    // Invoked when a new device connects to the message broker
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
        getInstance: getInstance
    }
})();
