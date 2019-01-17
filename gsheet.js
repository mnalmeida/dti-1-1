"use strict";

if (!String.prototype.format) {
    String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
        return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

const graphBegin = "digraph G {";
const graphEnd = "}"

var graphFullStr = null;

function gSheetDoData(json) {

    var data = json.feed.entry;
    var graphStr = "";
    
    for(var r=3; r<data.length; r+=3) {

        var source = data[r]["gs$cell"]["$t"].toLo;
        var target = data[r+1]["gs$cell"]["$t"];
        var date = data[r+2]["gs$cell"]["$t"];

        source = source.replace(".", "");
        target = target.replace(".", "");

        graphStr += "{0} -> {1};".format(source, target);

    }

    graphFullStr = "{0}{1}{2}".format(graphBegin, graphStr, graphEnd);
    console.log(graphFullStr);
}

function gSheetGetData() {    
    while(!graphFullStr) 
        void 0;
    return graphFullStr;
}

// reference: https://gist.github.com/terrywbrady/a03b25fe42959b304b1e