"use strict";

var graphBegin = "digraph G { \n\tedge [dir = none];\n\tnode [shape = circle, fontname=Helvetica];\n";
graphBegin += "\tsubgraph cluster_0 {\n";
graphBegin += "\t\tstyle=filled;\n";
graphBegin += "\t\tcolor=\"#F5F5F5\"\n";
graphBegin += "\t\tleng1 [label=\"<=14\ndias\", style=filled, color=\"#228b22\", fillcolor=\"#228b22\"];\n";
graphBegin += "\t\tleng2 [label=\"<=21\ndias\", style=filled, color=\"#97be83\", fillcolor=\"#97be83\"];\n";
graphBegin += "\t\tleng3 [label=\"<=28\ndias\", style=filled, color=\"#faf0e6\", fillcolor=\"#faf0e6\"];\n";
graphBegin += "\t\tleng4 [label=\"<=35\ndias\", style=filled, color=\"#f9b9b2\", fillcolor=\"#f9b9b2\"];\n";
graphBegin += "\t\tleng5 [label=\">35\ndias\", style=filled, color=\"#f08080\", fillcolor=\"#f08080\"];\n";
graphBegin += "\t\tleng6 [label=\"ñ def\", style=filled, color=\"gray\", fillcolor=\"gray\"];\n";
graphBegin += "\t\tlabel = \"legenda\";\n";
graphBegin += "\t}\n";
var graphEnd = "}";

var graphStr = null;
var nodes = [];
var edges = [];

if (!String.prototype.format) {
    String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
        return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

function gSheetDoData(json) {
    try {
        var tribe = document.querySelector("#tribe select").value;                
        gSheetCreateNodesAndEdges(json.feed.entry, tribe);
        graphStr = "{0}{1}{2}{3}{4}".format(
            graphBegin,
            gSheetCreateTribeNameStr(tribe),
            gSheetCreateNodesStr(), 
            gSheetCreateEdgesStr(), 
            graphEnd);
        console.log(graphStr);
    }
    catch(err) {
        console.error(err);
        return null;
    }
}

function gSheetGetData() {    
    var i = 0;
    while(!graphStr && i < 100) 
        i++;
    return graphStr;
}

function gSheetCreateTribeNameStr(tribe) {
    return "tribe [label=\"{0}\", shape=plaintext, fontsize=70]".format(tribe);
}

function gSheetCreateNodesStr() {
    var graphNodes = "";
    for(var i = 0; i < nodes.length; i++) {
        graphNodes += gSheetCreateNodeStr(nodes[i]);
    }
    return graphNodes;
}

function gSheetCreateEdgesStr() {
    var graphEdges = "";
    for(var i = 0; i < edges.length; i++) {
        graphEdges += "\t{0} -> {1}; \n".format(edges[i].source.replace('.', ''), edges[i].target.replace('.', ''));
    }
    return graphEdges;
}

function gSheetCreateNodesAndEdges(data, selectedTribe) {
    
    nodes = [];
    edges = [];

    for(var r=4; r<data.length; r+=4) {
        var source = data[r]["gs$cell"]["$t"].toLowerCase();
        var target = data[r+1]["gs$cell"]["$t"].toLowerCase();
        var date = data[r+2]["gs$cell"]["$t"].toLowerCase();
        var tribe = data[r+3]["gs$cell"]["$t"].toLowerCase();

        if (selectedTribe === "dti" || selectedTribe === tribe) {
            gSheetCreateNode(source, target, date);
            gSheetCreateEdge(source, target);        
        }
    }

}

function gSheetCreateNode(source, target, date) {
    if (!nodes.some(n => n.id === source)) {
        nodes.push({ 
            id: source, 
            label: gSheetGetNodeLabel(source),
            color: gSheetGetNodeColor(date)
        });
    }
    else {
        var i = nodes.findIndex(n => n.id === source);                
        if (i) {
            nodes[i].color = gSheetGetNodeColor(date);
        }
    }
    
    if (!nodes.some(n => n.id === target)) {
        nodes.push({ 
            id: target,
            label: gSheetGetNodeLabel(target),
            color: 'gray'
        });
    }
}

function gSheetCreateEdge(source, target) {
    edges.push({source: source, target: target});
}

function gSheetGetNodeLabel(name) {
    var names = name.toUpperCase().split('.');
    if (names.length === 2)
        return names[0][0] + names[1][0];
    return name[0];
}

function gSheetGetNodeColor(date) {
    var date1 = new Date(date);
    var date2 = new Date();
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
    
    if (diffDays <= 14) 
        return '#228b22';
    if (diffDays <= 21)
        return '#97be83';
    if (diffDays <= 28)
        return '#faf0e6';
    if (diffDays <= 35)
        return '#f9b9b2';
    return '#f08080';

}

function gSheetCreateNodeStr(node) {    
    return "\t{0} [style=filled, label=\"{1}\", color=\"{2}\", fillcolor=\"{2}\"]; \n".format(node.id.replace('.', ''), node.label, node.color);
}

function gSheetClear() {
    graphStr = null;
}

// reference: https://gist.github.com/terrywbrady/a03b25fe42959b304b1e