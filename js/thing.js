/* Copyright (c) 2012 Christian Perfect
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var tex_input = document.getElementById('tex');
var size_input = document.getElementById('size');
var output_element = document.getElementById('output');
var link_element = document.getElementById('link');

var state = {
    tex: '',
    size: 5
}

function display() {
    var tex = state.tex = tex_input.value;
    var size = state.size = parseFloat(size_input.value);
    output_element.innerHTML = '';
    output_element.style['font-size'] = size+'em';

    MathJax.texReset();
    var options = MathJax.getMetricsFor(output);
    options.display = true;
    try {
        var html = MathJax.tex2chtml(tex,options);
        output.appendChild(html);
        MathJax.startup.document.clear();
        MathJax.startup.document.updateDocument();
    } catch(e) {
        output.innerHTML = e.message;
    }

    if (!window.location.origin) {
        window.location.origin = window.location.protocol+"//"+window.location.host;
    }
    var searchParams = makeSearchParams(state);
    var url = window.location.origin+window.location.pathname+(tex.length ? '?'+searchParams : '');
    link_element.textContent = url;
    link_element.setAttribute('href',url);
}

function getSearchParams() {
    var search = location.search.slice(1);
    var bits = search.split('&');
    var obj = {};
    var re_component = /^(?:(\w+)=)?(.*)$/;
    for(var i=0;i<bits.length;i++) {
        var m = re_component.exec(bits[i]);
        var name = m[1] || '_query';
        var value = m[2];
        obj[name] = value;
    }
    return obj;
}

function makeSearchParams(obj) {
    var query = [];
    for(var key in obj) {
        query.push(encodeURIComponent(key)+'='+encodeURIComponent(obj[key]));
    }
    return query.join('&');
}

function go() {
    tex_input.addEventListener('input',display);
    size_input.addEventListener('input',display);
    if(location.search.length) {
        var query = getSearchParams();
        var tex = query.tex || query['_query'];
        var size = parseFloat(query.size) || 2;
        tex = unescape(tex.replace(/\+/g,' '));
        tex_input.value = tex;
        size_input.value = size;
    }
    display();
	window.started = true;
}

if(window.MathJax) {
	MathJax.startup.promise.then(function() {
		go();
	});
}
