"use strict";

var graphBegin = "digraph G { \n\tedge [dir = none];\n\tnode [shape = circle, fontname=Helvetica];\n";
var graphEnd = "}";

var graphStr = null;
var nodes = [];
var edges = [];
var COLOR_DELAYED = '#ED1E2E';

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
        var selectedTribe = 'Camaleão';                
        gSheetCreateNodesAndEdges(json.feed.entry, selectedTribe);
        graphStr = "{0}{1}{2}{3}".format(
            graphBegin,
            //gSheetCreateTribeNameStr(selectedTribe),
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

function getTableData() {
    if (nodes.some(n => n.color === COLOR_DELAYED)) {
        var delayedNodes = nodes.filter(n => n.color === COLOR_DELAYED);
        return delayedNodes.reduce(function(html, n) {
            return html + ('<tr><td>{0}</td><td>{1}</td><td>{2}</td></tr>'.format(n.source, n.target, n.date));
        }, '');
    }
    return '';
}

function gSheetCreateTribeNameStr(tribe) {
    return "\ttribe [label=\"{0}\", shape=plaintext, fontsize=70];\n".format(tribe);
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
            edges[i].source.replace(' ', ''),
            edges[i].target.replace(' ', ''),
            gSheetGetEdgeColor(),
            selectedTribe === 'dti' ? '3' : '1'
        );
    }
    return graphEdges;
}

function gSheetCreateNodesAndEdges(data, selectedTribe) {
    
    nodes = [];
    edges = [];

    var r = 15;
    while( r < data.length){
        if (data[r]["gs$cell"]["col"] == "2") {
            var source = data[r]["gs$cell"]["$t"].toLowerCase();
            var target = data[r+1]["gs$cell"]["col"] == "3" ? data[r+1]["gs$cell"]["$t"].toLowerCase() : '';
            var date = data[r+2]["gs$cell"]["col"] == "4" ? data[r+2]["gs$cell"]["$t"].toLowerCase() : '';
            var tribe = 'Camaleão';
    
            if (target !== '' && date !== '') {
                gSheetCreateNode(source, target, date);
                gSheetCreateEdge(source, target, tribe);        
            }
            r = r + 4;
        }
        r = r + 1;
    }
}

function gSheetCreateNode(source, target, date) {
    if (!nodes.some(n => n.id === source)) {
        nodes.push({ 
            id: source, 
            label: gSheetGetNodeLabel(source),
            color: gSheetGetNodeColor(date),
            source: source,
            target: target,
            date: date
        });
    }
    else {
        var i = nodes.findIndex(n => n.id === source);                
        if (i) {
            nodes[i].color = gSheetGetNodeColor(date);
            nodes[i].source = source;
            nodes[i].target = target;
            nodes[i].date = date;
        }
    }
    
    if (!nodes.some(n => n.id === target)) {
        nodes.push({ 
            id: target,
            label: gSheetGetNodeLabel(target),
            color: 'gray',
            source: source,
            target: target,
            date: date
        });
    }
}

function gSheetCreateEdge(source, target, tribe) {
    edges.push({source: source, target: target, tribe: tribe});
}

function gSheetGetNodeLabel(name) {
    var names = name.toUpperCase().split(' ');
    if (names.length === 2)
        return names[0][0] + names[1][0];
    return name[0];
}

function gSheetGetNodeColor(date) {
    var dateParts = date.split("/");
    var date1 = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]); 
    var date2 = new Date();
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
    
    if (diffDays <= 28) 
        return '#93E247';
    else if (diffDays >=  28 && diffDays <= 30)
        return '#FFC239';
    if (diffDays >= 31)
        return COLOR_DELAYED;
}

function gSheetGetEdgeColor() {
    return '#4D499D';
}

function gSheetCreateNodeStr(node) {    
    return "\t{0} [style=filled, label=\"{1}\", color=\"{2}\", fillcolor=\"{2}\"]; \n".format(node.id.replace(' ', ''), node.label, node.color);
}

function gSheetClear() {
    graphStr = null;
}

// reference: https://gist.github.com/terrywbrady/a03b25fe42959b304b1e