function display() {
	var tex = $('#input #tex').val();
	$('#output').html('\\['+tex+'\\]');
	MathJax.Hub.Queue(['Typeset',MathJax.Hub]);
	var url = window.location.origin+window.location.pathname+'?'+tex;
	$('#link').text(url).attr('href',url);
}

$(function() {
	$('#input #tex').on('change keyup',display);
	$('#input #size').on('change',function() {
		var size = parseFloat($(this).val())/5;
		$('#output').css('font-size',size+'em');
		display();
	});
	if(location.search.length)
		$('#input #tex').val(unescape(location.search.slice(1))).change();
});
