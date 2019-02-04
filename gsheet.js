"use strict";

var graphBegin = "digraph G { \n\tedge [dir = none];\n\tnode [shape = circle, fontname=Helvetica];\n";
graphBegin += "\tsubgraph cluster_0 {\n";
graphBegin += "\t\tstyle=filled;\n";
graphBegin += "\t\tcolor=\"#F5F5F5\"\n";
graphBegin += "\t\tleng1 [label=\"<=14d\", style=filled, color=\"#09AA51\", fillcolor=\"#09AA51\"];\n";
graphBegin += "\t\tleng2 [label=\"<=21d\", style=filled, color=\"#93E247\", fillcolor=\"#93E247\"];\n";
graphBegin += "\t\tleng3 [label=\"<=28d\", style=filled, color=\"#FFC239\", fillcolor=\"#FFC239\"];\n";
graphBegin += "\t\tleng4 [label=\"<=35d\", style=filled, color=\"#EA7439\", fillcolor=\"#EA7439\"];\n";
graphBegin += "\t\tleng5 [label=\">35d\", style=filled, color=\"#ED1E2E\", fillcolor=\"#ED1E2E\"];\n";
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
        var selectedTribe = document.querySelector("#tribe select").value;                
        gSheetCreateNodesAndEdges(json.feed.entry, selectedTribe);
        graphStr = "{0}{1}{2}{3}{4}".format(
            graphBegin,
            gSheetCreateTribeNameStr(selectedTribe),
            gSheetCreateNodesStr(), 
            gSheetCreateEdgesStr(selectedTribe), 
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
    return "\ttribe [label=\"{0}\", shape=plaintext, fontsize=70]\n".format(tribe);
}

function gSheetCreateNodesStr() {
    var graphNodes = "";
    for(var i = 0; i < nodes.length; i++) {
        graphNodes += gSheetCreateNodeStr(nodes[i]);
    }
    return graphNodes;
}

function gSheetCreateEdgesStr(selectedTribe) {
    var graphEdges = "";
    for(var i = 0; i < edges.length; i++) {
        graphEdges += "\t{0} -> {1} [color=\"{2}\", penwidth={3}]; \n".format(
            edges[i].source.replace('.', ''), 
            edges[i].target.replace('.', ''),
            gSheetGetEdgeColor(edges[i].tribe),
            selectedTribe === 'dti' ? '3' : '1'
        );
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
            gSheetCreateEdge(source, target, tribe);        
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

function gSheetCreateEdge(source, target, tribe) {
    edges.push({source: source, target: target, tribe: tribe});
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
        return '#09AA51';
    if (diffDays <= 21)
        return '#93E247';
    if (diffDays <= 28)
        return '#FFC239';
    if (diffDays <= 35)
        return '#EA7439';
    return '#ED1E2E';
}

function gSheetGetEdgeColor(tribe) {
    if (tribe === 'dti')
        return '#514C9F';
    if (tribe === 'balboa')
        return '#3B8CC6';
    if (tribe === 'camaleao')
        return '#46DF81';
    if (tribe === 'curingas')
        return '#15992C';
    if (tribe === 'gc')
        return '#2CB6C3';
    if (tribe === 'javalis')
        return '#D4DB26';
    if (tribe === 'origami')
        return '#00A3AF';
    if (tribe === 'rackers')
        return '#00A3AF';
    if (tribe === 'rubix')
        return '#F54F4F';
    if (tribe === 'triforce')
        return '#123A73';

    return '#000000';
}

function gSheetCreateNodeStr(node) {    
    return "\t{0} [style=filled, label=\"{1}\", color=\"{2}\", fillcolor=\"{2}\"]; \n".format(node.id.replace('.', ''), node.label, node.color);
}

function gSheetClear() {
    graphStr = null;
}

// reference: https://gist.github.com/terrywbrady/a03b25fe42959b304b1e