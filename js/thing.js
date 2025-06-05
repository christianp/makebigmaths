/* Copyright (c) 2012 Christian Perfect
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var input_form = document.getElementById('input');
const tex_input = document.getElementById('tex');
const size_input = document.getElementById('size');
var output_element = document.getElementById('output');
var output_speech_element = document.getElementById('output-speech');
var link_element = document.getElementById('link');

var state = {
    tex: '',
    size: 5
}

function set_display() {
    const fd = new FormData(input_form);
    var size = fd.get('size');
    output_element.style.setProperty('--size',fd.get('size'));
    output_element.style.setProperty('--math-font',fd.get('font'));

    update_link();
}

async function display() {
    const fd = new FormData(input_form);
    const tex = fd.get('tex');
    output_element.innerHTML = '';

    MathJax.texReset();
    var options = MathJax.getMetricsFor(output_element,true);
    if(!options.family) {
        delete options.family;
    }
    try {
        var mml = await MathJax.tex2mmlPromise(tex,options);
        output_element.innerHTML = mml;
        const speech_element = output_element.querySelector('[data-semantic-speech]');
        const speech = speech_element ? speech_element.getAttribute('data-semantic-speech') : '';
        output_speech_element.textContent = speech;

        MathJax.startup.document.clear();
        MathJax.startup.document.updateDocument();
    } catch(e) {
        output_element.innerHTML = e.message;
    }

    if (!window.location.origin) {
        window.location.origin = window.location.protocol+"//"+window.location.host;
    }

    update_link();
}

function update_link() {
    const url = makeSearchParams();
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
    const fd = new FormData(input_form);
    const url = new URL(location);
    fd.entries().forEach(([key,value]) => url.searchParams.set(key,value));
    return url.toString();
}

(async function() {
	await MathJax.startup.promise;
    tex_input.addEventListener('input',display);
    [...document.querySelectorAll('input,select')].forEach(el => el.addEventListener('input',set_display));

    const {searchParams} = new URL(location);
    let tex = searchParams.get('tex');
    if(tex) {
        var size = parseFloat(searchParams.get('size')) || 2;
        tex_input.value = tex;
        size_input.value = size;
    }

    display();
    set_display();
})();
