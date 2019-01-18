"use strict";

if (!String.prototype.format) {
    String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
        return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

const graphBegin = "digraph G { \nedge [dir = none]\nnode [shape = circle]\n";
const graphEnd = "}"

var graphStr = null;

function getNodeLabel(name) {
    var names = name.toUpperCase().split('.');
    if (names.length === 2)
        return names[0][0] + names[1][0];
    return name[0];
}

function getNodeColor(date) {
    var date1 = new Date(date);
    var date2 = new Date();
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
    
    if (diffDays < 15)
        return "green";
    else if (diffDays < 30)
        return "orange";
    else
        return "red";
}

function createNode(node) {    
    return "{0} [style=filled, label=\"{1}\", color={2}, fillcolor={2}]; \n".format(node.id.replace('.', ''), node.label, node.color);
}

function gSheetDoData(json) {

    try {

        var data = json.feed.entry;
        var graphNodes = "";
        var graphEdges = "";

        var nodes = [];
        var edges = [];
        
        for(var r=3; r<data.length; r+=3) {
            var source = data[r]["gs$cell"]["$t"].toLowerCase();
            var target = data[r+1]["gs$cell"]["$t"].toLowerCase();
            var date = data[r+2]["gs$cell"]["$t"].toLowerCase();

            if (!nodes.some(n => n.id === source)) {
                nodes.push({ 
                    id: source, 
                    label: getNodeLabel(source),
                    color: getNodeColor(date)
                });
            }
            else {
                var i = nodes.findIndex(n => n.id === source);                
                if (i) {
                    nodes[i].color = getNodeColor(date);
                }
            }
            
            if (!nodes.some(n => n.id === target)) {
                nodes.push({ 
                    id: target,
                    label: getNodeLabel(target),
                    color: 'gray'
                });
            }

            edges.push({source: source, target: target});
        }

        for(var i = 0; i < nodes.length; i++) {
            graphNodes += createNode(nodes[i]);
        }

        for(var i = 0; i < edges.length; i++) {
            graphEdges += "{0} -> {1}; \n".format(edges[i].source.replace('.', ''), edges[i].target.replace('.', ''));
        }

        graphStr = "{0}{1}{2}{3}".format(graphBegin, graphNodes, graphEdges, graphEnd);
        console.log(graphStr);

    }
    catch(err) {
        console.log(err);
        return null;
    }
}

function gSheetGetData() {    
    var i = 0;
    while(!graphStr && i < 100) 
        i++;
    return graphStr;
}

function gSheetClear() {
    graphStr = null;
}

// reference: https://gist.github.com/terrywbrady/a03b25fe42959b304b1e