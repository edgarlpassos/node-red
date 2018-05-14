/*
 * FEUP ASSO 2017/2018
 * Edgar Passos, Maria João Mira Paulo, José Pedro Monteiro
 **/

const watcher = (function() {
    return {
        init: function() {},
        notifyNewNode: function (newNode) {
            console.log("Node added.");
            console.log(newNode);
        },
        notifyNewLink: function (newLink) {
            console.log("Link added.");
            console.log(newLink);
        }
    }
});

module.exports = watcher;
