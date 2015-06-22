 $(function () {
    //Creates static data
    var data2014 = [
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

    var data2013 = [
        {
            sourceAddr: '10.10.0.0',
            destAddr: '6.6.6.0',
            isDownload: false,
            sourceHost: 'facebook.com',
            destHost: 'gamefaqs.com',
            packets: 1000000,
            totalSourcePackets: 25000000,
            totalDestPackets: 1500000
        }, {
            sourceAddr: '10.10.0.0',
            destAddr: '7.7.7.0',
            isDownload: false,
            sourceHost: 'facebook.com',
            destHost: 'cnn.com',
            packets: 2000000,
            totalSourcePackets: 25000000,
            totalDestPackets: 2000000
        }, {
            sourceAddr: '8.8.8.0',
            destAddr: '10.10.0.0',
            isDownload: true,
            sourceHost: 'wikipedia.org',
            destHost: 'facebook.com',
            packets: 5000000,
            totalSourcePackets: 8000000,
            totalDestPackets: 25000000
        }, {
            sourceAddr: '9.9.9.0',
            destAddr: '10.10.0.0',
            isDownload: true,
            sourceHost: 'youtube.com',
            destHost: 'facebook.com',
            packets: 10000000,
            totalSourcePackets: 10000000,
            totalDestPackets: 25000000
        }
    ];

    var details2014 = {
        '1.1.1.0': {
            host: 'gatech.edu',
            AS: 1300,
            totalPackets: 1500000
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
    };

    var details2013 = {
        '6.6.6.0': {
            host: 'gamefaqs.com',
            AS: 22000,
            totalPackets: 2000000
        },
        '7.7.7.0': {
            host: 'cnn.com',
            AS: 15000,
            totalPackets: 2000000
        },
        '8.8.8.0': {
            host: 'wikipedia.org',
            AS: 19000,
            totalPackets: 8000000
        },
        '9.9.9.0': {
            host: 'youtube.com',
            AS: 1500,
            totalPackets: 10000000
        },
        '10.10.0.0': {
            host: 'facebook.com',
            AS: 10000,
            totalPackets: 25000000
        }
    };
	
	var hops = 3;
	var selectedNode = "";

    //Converts data into a network
    var createData = function (data) {
        var nodes = {};
        var edges = [];
		var addedNodes = {};
		addedNodes[selectedNode] = true;
        var hierarchical = true;
        var hostGroup = true;
        var i;
		var hop;
		for (hop = 0; hop < hops; hop++) {
			var currentNodes = {};
			for (var key in addedNodes) {
				currentNodes[key] = true;
			}
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
				if (selectedNode === "" || addedNodes[from] || addedNodes[to]) {
					currentNodes[from] = true;
					currentNodes[to] = true;
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
			}
			for (var key in currentNodes) {
				addedNodes[key] = true;
			}
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
        var dataItem = currentDetails[selection];
	    $("#detailsHost").text(dataItem.host);
	    $("#detailsAS").text(dataItem.AS);
	    $("#detailsIpPrefix").text(selection);
	    $("#detailsPackets").text(dataItem.totalPackets + " Packets");
    };

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

    var currentDataset = data2014;
    var currentDetails = details2014;

    var data = createData(currentDataset);

    //Create network
    var network = new vis.Network(container, data, options);
    
    //Create sliders

    network.on("selectNode", function (params) {
		selectedNode = params.nodes[0];
        displaySelection(params.nodes[0]);
		network.setData(createData(currentDataset));
    });
	
	$("#1Hop").click(function () {
		hops = 1;
		console.log("1 Hop");
		network.setData(createData(currentDataset));
		$("#hopDropdown").html('1 Hop <span class="caret"></span>');
	});
		
	$("#2Hops").click(function () {
		hops = 2;
		console.log("2 Hops");
		network.setData(createData(currentDataset));
		$("#hopDropdown").html('2 Hops <span class="caret"></span>');
	});
		
	$("#3Hops").click(function () {
		hops = 3;
		console.log("3 Hops");
		network.setData(createData(currentDataset));
		$("#hopDropdown").html('3 Hops <span class="caret"></span>');
	});

    $("#2013Dataset").click(function () {
        currentDataset = data2013;
        currentDetails = details2013;
		selectedNode = "";
        network.setData(createData(currentDataset));
		$("#datasetDropdown").html('2013 Dataset <span class="caret"></span>');
    });

    $("#2014Dataset").click(function () {
        currentDataset = data2014;
        currentDetails = details2014;
		selectedNode = "";
        network.setData(createData(currentDataset));
		$("#datasetDropdown").html('2014 Dataset <span class="caret"></span>');
    });
});
