
self.onmessage = function(e){
	option = e.data.option;
	processImage(e.data.source);
}

if(self.importScripts){
	importScripts("./config.js");
	importScripts("./tools.js");
}

var filterAvg = [
	[1/10,1/10,1/10],
	[1/10,1/5,1/10],
	[1/10,1/10,1/10]
];

var filterAvg = [
	[0,1/4,0],
	[1/4,1/5,1/4],
	[0,1/4,0]
];

var option = {numer:20};//to debug with different options

function processImage(source){
	var out = source; //source est un tableau à 1 dimension
	out = applyFilter(out,filterAvg,200); 
	out = convertPixels(out,300); 
	//out est maintenant à 2D
	limitHistogram(out,400);
	self.postMessage(500);
	self.postMessage(out);
}

function convertPixels(pixels,iMsg){
	var codes = new Array(w),
		i,j,ind;
	
	for(i=0; i<w; i++){
		self.postMessage(iMsg+i);
		codes[i] = new Array(h);
		for(j=0; j<h; j++){
			ind=(j*w+i)*4;
			if(typeof pixels[ind] === "undefined"){
				console.warn("i:"+i+" j:"+j+" index:"+ind+" l:"+pixels.length);
			}
			
			codes[i][j] = convertPixel([pixels[ind],pixels[ind+1],pixels[ind+2]]);
		}
	}
	
	return codes;
}

function applyFilter(img,filter,base){
	var ix,iy, maxix = w, maxiy = h,
		fx,fy, maxfx = filter.length, maxfy = filter[0].length,
		sum = new Array(3), offsetX = Math.floor(maxfx/2), offsetY = Math.floor(maxfy/2),
		indexX,indexY,i,f,
		inc = 100 / maxix,
		out = new Array(maxix*maxiy*4);
	
	for( ix=0; ix<maxix; ix++){
		self.postMessage(base+ix*inc);
		//out[ix] = new Array(maxiy);
		for( iy=0; iy<maxiy; iy++){
			
			sum[0] = 0;
			sum[1] = 0;
			sum[2] = 0;
			
			for( fx=0; fx<maxfx; fx++){
				indexX = fx+ix-offsetX;
				if( indexX < 0 || indexX >= maxix){
					continue;
				}
				for( fy=0; fy<maxfy; fy++){
					indexY = fy+iy-offsetY;
					if( indexY >= 0 && indexY < maxiy ){
						f = filter[fx][fy];
						i = (indexX + indexY*maxix)*4;
						sum[0] += img[i] * f;
						sum[1] += img[i+1] * f;
						sum[2] += img[i+2] * f;
					}
				}
			}
			i = (ix + iy*maxix)*4;
			out[i] = sum[0];
			out[i+1] = sum[1];
			out[i+2] = sum[2];
			out[i+3] = 1;
			
		}
	}
	return out;
}

function convertPixel(rgba){
	var d = Infinity, r,
		c = null,
		i = code.length;
	
	rgba = RGBtoHSV(rgba);
	
	while(i--){
		r = distColorCode(rgba,code[i]);
		if(r<d){
			d = r;
			c = code[i];
		}
	}
	
	return c;
}

function limitHistogram(img,iMsg){
	var histogram = [],
		item,value,
		histo = [],
		i,j;
	//TODO real histogram then limitation
	
	var dbgC1=0,dbgC2=0;
	
	for(i=0;i<w;i++){
		self.postMessage(iMsg+i);
		for(j=0;j<h;j++){
			value = img[i][j];
			item = histogram.filter(function(v){return v.code === value.code;});
			if(item.length){
				item[0].nb++;
				dbgC1++;
			}else{
				histogram.push({
					code:value.code,
					object:value,
					nb:1
				});
				dbgC2++;
			}
		}
	}
	
	//ordonne l'histogramme du plus fréquent au moins fréquent
	self.postMessage({debug:true,message:"histogramme non trié",histogram:histogram,i:i,j:j,w:w,h:h,dbgC1:dbgC1,dbgC2:dbgC2});
	histogram = histogram.sort(function(a,b){return b.nb - a.nb;});
	self.postMessage({debug:true,message:"histogramme trié",histogram:histogram});
	
	/*
	TODO analyser la distance entre tous les points d'histogramme en partant des moins fréquents
	et les associer a des points existant plus gros.
	Garder les points trop distants
	
	=> réduire l'histogramme
	*/
	reduceHistogram(histogram);
	self.postMessage({debug:true,message:"histogramme réduit",histogram:histogram});
	
	iMsg += 100;
	for(i=0;i<w;i++){
		self.postMessage(iMsg+i);
		for(j=0;j<h;j++){
			img[i][j] = getCloseHistogram(img[i][j],histogram).code;
		}
	}
	
	//img[i][j] = getCloseHistogram(img[i][j],histogram).code
	return img;
}

/**
 * reduce the histogramme by removing some points
 **/
function reduceHistogram(histogram){
	var jCode = histogram.length,
		i,c,
		d = Infinity,
		cde = null,
		nbMax = histogram[0].nb, //nombre de couleur correspondant à la couleur la plus représentée
		dst;
	
	//c = getFromCode(codes);
	while(jCode--){
		if(!jCode) break;
		
		i = jCode;
		d = Infinity;
		//cde = null;
		cde = i;
		c = histogram[jCode];
		
		while(i--){
			
			if(c.code === histogram[i].code){
				continue;
			}
			dst = distColorCode( c.object.hsv, histogram[i].object);
			if(dst < d){ //TODO vérifier les éventuelles dépendance 
				d = dst;
				//cde = histogram[i];
				cde = i;
			}
		}
		//360*360 = 129600
		//180*180 = 32400
		if(d>option.number * nbMax / c.nb){//TODO chercher quelle valuer est la meilleure (à la place de 2)
			//histogram.push(c);
		}else{
			if(option.dependance){
				histogram[cde].nb += c.nb; //add to dependance
				if(histogram[cde].nb > nbMax) {nbMax=histogram[cde].nb;}
			}
			histogram.splice(jCode,1); //TODO créer une dépendance
		}
	}
	
	return c;
}

function getCloseHistogram(c,histogram){
	var i = histogram.length,
		d = Infinity,
		cde = null,
		dst;
	
	//c = getFromCode(codes);
	while(i--){
		if(c.code === histogram[i].code){
			continue;
		}
		dst = distColorCode( c.hsv, histogram[i].object);
		if(dst < d){
			d = dst;
			cde = histogram[i].object;
		}
	}
	/*
	if(d>300){
		histogram.push(c);
	}else{
		c = cde;
	}
	*/
	
	return cde;
}


function distColorCode(hsv,code){
	if(typeof code.hsv === "undefined"){
		code.hsv = RGBtoHSV([code.r,code.g,code.b])
	}
	//307800
	//129600
	return dist(hsv,code.hsv,[2,0.5,1]);
}

function dist(a1,a2,p){
	p = p || [1,1,1];
	var dstH = a1[0]-a2[0];
	if(dstH > 180){
		dstH = 360 - dstH;
	}
	return (dstH)*(dstH)*p[0] + (a1[1]-a2[1])*(a1[1]-a2[1])*p[1] + (a1[2]-a2[2])*(a1[2]-a2[2])*p[2];
}

/**
 * H	0 -> 360
 * S	0 -> 180
 * V	0 -> 180 
 **/
function RGBtoHSV(rgb){
	var R = rgb[0]/255,
		G = rgb[1]/255,
		B = rgb[2]/255,
		M = Math.max(R,G,B),
		m = Math.min(R,G,B),
		C = M-m,
		H_ = C===0?0: M===R?((G-B)/C)%6: M===G?((B-R)/C+2): (R-G)/C+4,
		H = 60*H_,
		L = M,
		S = C===0?0:C/L;
		
		/* H -> [-60,300]
		 * S -> [0,1]
		 * V -> [0,1]
		 */
	return [H+60,S*180,L*180];
}