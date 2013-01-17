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
	$('#output').html('\\['+tex+'\\]');
	MathJax.Hub.Queue(['Typeset',MathJax.Hub]);
	if (!window.location.origin) window.location.origin = window.location.protocol+"//"+window.location.host;
	var url = window.location.origin+window.location.pathname+(tex.length ? '?'+encodeURIComponent(tex) : '');
	$('#link').text(url).attr('href',url);
}

$(function() {
	$('#input #tex').on('change keyup',display);
	$('#input #size').on('change',function() {
		var size = parseFloat($(this).val())/5;
		$('#output').css('font-size',size+'em');
		display();
	});
	display();
	if(location.search.length) {
		var tex = location.search.slice(1);
		tex = unescape(tex.replace(/\+/g,' '));
		$('#input #tex').val(tex).change();
	}
});
