var downloadURL = function downloadURL(url) {
	var hiddenIFrameID = 'hiddenDownloader',
		iframe = document.getElementById(hiddenIFrameID);
	if (iframe === null) {
		iframe = document.createElement('iframe');
		iframe.id = hiddenIFrameID;
		iframe.style.display = 'none';
		document.body.appendChild(iframe);
	}
	iframe.src = url;
};

var saveData = function saveData(text) {
	var blob = new Blob([text],{type: 'download/JSON'});
	var url = URL.createObjectURL(blob);
	downloadURL(url);
};

