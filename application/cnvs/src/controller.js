

var canvas = document.getElementById("canvas"),
	ctx = canvas.getContext("2d"),
	progress = document.getElementById("progress");
	
var actionProgress = (function(){
	var nextStep = 0;
	return function(data,s){
		if(typeof s === "number"){
			nextStep = s;
		}
		
		switch(nextStep){
			case 0 : //affichage de l'image
				progress.value = 0;
				nextStep = 2;
				progress.parentNode.className = "displayMask";
				loadImage(data);
			case 1 : //réduction de l'image
				break;
			case 2 : //pre-traitement de l'image
				progress.value = 200;
				nextStep = 6;
				wk.postMessage({source:ctx.getImageData(0,0,w,h).data,option:{
					dependance:document.getElementById("dependance").checked,
					number:document.getElementById("optnumber").value
				}});
			case 3: //changement de palette
				
			case 5: //post-traitement de l'image
				break;
			case 6: //affichage
				nextStep = 7;
				progress.value = 600;
				displayDMC(data);
				break;
			case 7: //fin
				nextStep = 0;
				progress.value = 700;
				progress.parentNode.className = "hideMask";
				break;
			default:
				nextStep = 0;
		}
	}
})();


document.getElementById("source").onchange = function(e){
	var file = e.target.files[0];
	actionProgress(file,0);
};


var wk;
if(window.Worker){
	wk = new Worker("./src/canvas.js");
	wk.onmessage = readMessage;
}else{
	console.log("mode sans worker");
	wk = document.createElement("script");
	wk.src = "./src/canvas.js";
	document.body.appendChild(wk);
	document.body.removeChild(wk);
	
	wk = {};
	window.postMessage = function(data){
		readMessage({data:data});
	};
	wk = {postMessage : function(img){
			processImage(img);
		},
		terminate : function(){
			
		}
	};
	
}

function readMessage(e){
	switch(typeof e.data){
		case "number":
			progress.value = e.data;
			break;
		case "object":
			if(e.data.debug === true){
				console.log(e.data.message);
				console.debug(e.data);
				debug = e.data;
				return false;
			}
			actionProgress(e.data);
			break;
		default : 
			console.warn("unknown syntax");
	}
}



function loadImage(file){
	var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (function(theFile) {
        return function(e) {
			progress.value = 100;
			var img = new Image();
			img.onload = function(){
				progress.value = 150;
				ctx.drawImage(img,0,0,w-1,h-1);
				actionProgress();
			};
			img.src = e.target.result;
        };
      })(file);

	  
      // Read in the image file as a data URL.
      reader.readAsDataURL(file);
	  progress.value = 50;
}
	
function displayDMC(img){	
	//DEBUG
	var container = document.createElement("div"),
		canvas = document.createElement("canvas"),
		ctx2 = canvas.getContext("2d"),i,j,c,
		l = 500,
		li = l/w,
		lj = l/h,
		histogramme = {length:0};
		
	canvas.width = l;
	canvas.height = l;
	canvas.style.width = l+"px";
	canvas.style.height = l+"px";
	canvas.style.border = "1px solid black";
	
	container.appendChild(canvas);
	document.getElementById("result").appendChild(container);
	
	var idata = ctx2.createImageData(1,1),d = idata.data;
	d[3] = 0.7;
	
	ctx2.strokeStyle = "rgb(0,0,0)";
	ctx2.lineWidth = 1;
	
	for(i=0;i<w-1;i++){
		for(j=0;j<h-1;j++){
			c = getFromCode(img[i][j]);
			if(typeof histogramme[c.code] === "undefined"){
				histogramme.length++;
				c.nb=1;
				histogramme[c.code] = c;
			}
			c.nb++;
			/*
			d[0]   = c.r;
			d[1]   = c.g;
			d[2]   = c.b;
			ctx.putImageData( idata, i, j );
			*/
			
			ctx2.beginPath();
			ctx2.rect(i*li, j*lj, li, lj);
			ctx2.fillStyle = "rgb("+c.r+","+c.g+","+c.b+")";
			ctx2.fill();
			ctx2.stroke();
	  
		}
	}
	actionProgress();
	
	/*DEBUG*/
	console.log("histogramme",histogramme.length,histogramme);
	
	var options = document.createElement("details"),
		details = document.createElement("summary"),
		HTMLhistogramme = "<details><summary>histogramme</summary><p>",
		Ahist = [];
	for(var x in histogramme){
		if(typeof histogramme[x] === "object") Ahist.push(histogramme[x]);
	}
	console.log(Ahist);
	Ahist = Ahist.sort(function(a,b){
		console.log({code:a.code,nb:a.nb},{code:b.code,nb:b.nb},a.nb<b.nb);
		return a.nb-b.nb;
	});
	console.log(Ahist);
	Ahist.forEach(function(v){HTMLhistogramme+=v.code+" : "+v.nb+' <span style="background-color:'+v.color+';width:2em;">&nbsp; &nbsp;</span>'+v.color+'<br>';});
	HTMLhistogramme+="</p></details>";
	
	details.textContent = "h: "+histogramme.length;
	options.appendChild(details);
	details = document.createElement("p");
	details.innerHTML = "#color: "+histogramme.length +
		"<br>"+HTMLhistogramme +
		"<br>dependance:" + document.getElementById("dependance").checked +
		"<br>number: "+document.getElementById("optnumber").value;
	options.appendChild(details);
	container.appendChild(options);
	/*
	for(i in histogramme){
		j = histogramme[i];
		if(j.nb && j.nb < 20){
			//console.log(j.code,j.nb);
			console.count("<20");
		}
	}
	*/
}
