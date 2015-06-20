 $(function () {
    //Converts data into a network
    var createData = function (data) {
        var nodes = {};
        var edges = [];
        var hierarchical = true;
        var hostGroup = true;
        var i;
        for (i = 0; i < data.length; i++) {        
            var from, to, edgePackets, sourceHost, destHost, sourcePackets, destPackets, item = data[i];
            if (item.isDownload) {
                from = item.sourceAddr;
                sourceHost = item.sourceHost;
                sourcePackets = item.totalSourcePackets; 
                to = item.destAddr;
                destHost = item.destHost;
                destPackets = item.totalDestPackets;
            } else {
                from = item.destAddr;
                sourceHost = item.destHost;
                sourcePackets = item.totalDestPackets; 
                to = item.sourceAddr;
                destHost = item.sourceHost;
                destPackets = item.totalSourcePackets;
            }
            edgePackets = item.packets;
            if (nodes[from] && !nodes[from].isClient) {
                hierarchical = false;
            }
            if (nodes[from] && nodes[from].group !== sourceHost) {
                hostGroup = false;
                sourceHost = nodes[from].group + '\n' + sourceHost;
            }
            nodes[from] = {
                id: from,
                isClient: true,
                label: from + "/" + clientMask,
                group: sourceHost,
                value: sourcePackets
            };
            if (nodes[to] && nodes[to].isClient) {
                hierarchical = false;
            }
            if (nodes[to] && nodes[to].group !== destHost) {
                hostGroup = false;
                destHost = nodes[to].group + '\n' + destHost;
            }
            nodes[to] = {
                id: to,
                isClient: false,
                label: to + "/" + serverMask,
                group: destHost,
                value: destPackets
            };
            edges.push({
                from: from,
                to: to,
                value: edgePackets,
                title: from + " to " + to + "<br/ >Packets: " + edgePackets
            });
        }
        if (hierarchical) {
            options.layout.hierarchical = hierarchyOption;
        } else {
            options.layout.hierarchical = noHierarchyOption;
        }

        var finalNodes = [];
        for (var key in nodes) {
            var node = nodes[key];
            if (!hostGroup) {
                delete node.group;
            }
            finalNodes.push(node);
        }
        return {
            nodes: new vis.DataSet(finalNodes),
            edges: new vis.DataSet(edges)
        };
    };

    //Displays the selection in details panel
    var displaySelection = function (selection) {
        var dataItem = details[selection]
        window.alert(selection + "\nHost: " + dataItem.host + "\nAS: " + dataItem.AS + "\nTotal Packets: " + dataItem.totalPackets);
    }
    var data = [
        {
            sourceAddr: '1.1.1.0',
            destAddr: '3.3.0.0',
            isDownload: true,
            sourceHost: 'gatech.edu',
            destHost: 'google.com',
            packets: 1000,
            totalSourcePackets: 2001000,
            totalDestPackets: 4000000
        }, {
            sourceAddr: '1.1.1.0',
            destAddr: '4.4.0.0',
            isDownload: true,
            sourceHost: 'gatech.edu',
            destHost: 'netflix.com',
            packets: 2000000,
            totalSourcePackets: 2001000,
            totalDestPackets: 5000000
        }, {
            sourceAddr: '4.4.0.0',
            destAddr: '2.2.2.0',
            isDownload: false,
            sourceHost: 'netflix.com',
            destHost: 'gatech.edu',
            packets: 1000000,
            totalSourcePackets: 5000000,
            totalDestPackets: 1000000
        }, {
            sourceAddr: '3.3.0.0',
            destAddr: '5.5.5.0',
            isDownload: false,
            sourceHost: 'google.com',
            destHost: 'comcast.com',
            packets: 50000,
            totalSourcePackets: 4000000,
            totalDestPackets: 50000
        }
    ];
    var details = {
        '1.1.1.0': {
            host: 'gatech.edu',
            AS: 1300,
            totalPackets: 2001000
        },
        '2.2.2.0': {
            host: 'gatech.edu',
            AS: 1300,
            totalPackets: 1000000
        },
        '3.3.0.0': {
            host: 'google.com',
            AS: 1500,
            totalPackets: 4000000
        },
        '4.4.0.0': {
            host: 'netflix.com',
            AS: 3100,
            totalPackets: 5000000
        },
        '5.5.5.0': {
            host: 'comcast.com',
            AS: 2500,
            totalPackets: 50000
        }
    }
    var serverMask = 16;
    var clientMask = 24;

    //Options for a graph grouped into client and server
    var hierarchyOption = {
        enabled: true,
        direction: 'LR',
        sortMethod: 'directed',
        levelSeparation: 300
    };

    //Options for a graph not grouped into client and server
    var noHierarchyOption = {
        enabled: false
    }; 

    //Setup network options
    var container = document.getElementById('mynetwork');
    var options = {
        layout: {
            hierarchical: hierarchyOption            
        },
        nodes: {
            scaling: {
                label: {
                    enabled: true
                },
                min: 10,
                max: 50
            }
        }
    };

    var data = createData(data);

    //Create network
    var network = new vis.Network(container, data, options);

    network.on("selectNode", function (params) {
        params.event = "[original event]";
        displaySelection(params.nodes[0]);
    });
});