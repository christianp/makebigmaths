/* Copyright (c) 2012 Christian Perfect
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

function display() {
	var tex = $('#input #tex').val();
	var size = getSize();
	var script = document.createElement('script');
	script.setAttribute('type','math/tex');
	script.textContent = tex;
	$('#output').html(script);
	MathJax.Hub.Queue(['Typeset',MathJax.Hub,window.output]);
	if (!window.location.origin) window.location.origin = window.location.protocol+"//"+window.location.host;
	var searchParams = makeSearchParams({
		tex: tex,
		size: size
	});
	var url = window.location.origin+window.location.pathname+(tex.length ? '?'+searchParams : '');
	$('#link').text(url).attr('href',url);
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
	console.log(obj);
	return obj;
}

function makeSearchParams(obj) {
	var query = [];
	for(var key in obj) {
		query.push(encodeURIComponent(key)+'='+encodeURIComponent(obj[key]));
	}
	return query.join('&');
}

var size_scale = 5;
function getSize() {
	return $('#input #size').val()/size_scale;
}
function setSize(size) {
	$('#input #size').val(size*size_scale).change();
}

$(function() {
	$('#input #tex').on('change keyup',display);
	$('#input #size').on('change',function() {
		var size = getSize();
		$('#output').css('font-size',size+'em');
		display();
	});
	display();
	if(location.search.length) {
		var query = getSearchParams();
		var tex = query.tex || query['_query'];
		var size = query.size || 2;
		tex = unescape(tex.replace(/\+/g,' '));
		$('#input #tex').val(tex).change();
		console.log(size);
		setSize(size);
	}
});
