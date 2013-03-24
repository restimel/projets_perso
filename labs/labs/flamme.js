function flammeAnimate(divID,divVent){
	var flamme=document.getElementById(divID), //élément représentant la base de la flamme
		t = 0, //variable pour les oscillations
		animation=null, //fonction devant être appelée pour gérer l'animation actuelle
		timer=0, //timer d'animation de l'allumette
		timer2=0, //timer de modification du vent
		vent=0, //valeur actuelle du vent
		elemVent=document.getElementById(divVent), //input où est situé la valeur du vent affectant la flamme
		oPos=0;// position original pour des éléments proches
		
	//fonctions de calcul
	function calc(amp,freq,resistance){
		freq=freq||1;
		resistance=resistance||1;
		return (oPos+=Math.cos(freq*t)*amp+vent/resistance);
	}
	function calc2(y,amp,freq){
		var i=(freq||1)*t;
		return Math.sin(2*i)*Math.cos(i)*amp+y;
	}
	function monte1(y,amp,freq,offset){
		var i=((freq||0.75)*(t+(offset||0))) % (Math.PI/2);
		return Math.sin(i)*amp+y;
	}
	
	//fonctions d'affichage
	function burn(){
		var 
			c=[	
				"inset #993010 0px 0px 10px "+calc2(4,2,0.4)+"px, ", //intérieur de l'allumette
				"#102525 0px 2px 18px 5px, ", //contact avec l'allumette
				"#e8f8ff "+(oPos=0,calc(4,1,0.4))+"px -40px  12px -9px, ", //flamme blanche
				"#ffffff "+calc(4,1,0.5)+"px -50px  10px -12px, ",
				"#ffffe0 "+calc(1,1,1.2)+"px -55px  10px -14px, ",
				"#ffffc0 "+calc(2,1,2)+"px -60px  10px -20px, ",
				"#ffffa0 "+calc(2,2,2)+"px -62px  10px -22px, ",
				"#ffff80 "+calc(2,3,3)+"px -64px  10px -24px, ",
				"#ffff40 "+(oPos=0)+"px 0px 15px 4px, ", //flamme jaune orange
				"#ffff30 "+calc(1,1)+"px -10px  13px 6px, ",
				"#ffff20 "+calc(1,1)+"px -20px  12px 8px, ",
				"#ffff10 "+calc(1.5,1.1,0.9)+"px -30px  11px 6px, ",
				"#ffff00 "+calc(1,1)+"px -40px  10px 4px, ",
				"#fff000 "+calc(2,1)+"px -50px  10px 2px, ",
				"#ffe000 "+calc(2,1)+"px -60px  10px 0px, ",
				"#ffd000 "+calc(2,2)+"px -70px  10px -4px, ",
				"#ffc000 "+calc(1,1)+"px -80px  10px -6px, ",
				"#ffa000 "+calc(2,1)+"px -90px  10px -10px, ",
				"#ff8000 "+calc(1,1.2,1.5)+"px -100px 10px -14px, ",
				"#ff6000 "+calc(2,1.5,2)+"px -110px 10px -16px, ",
				"#ff5000 "+calc(1,2,3)+"px -115px 10px -18px, ",
				"#ff4000 "+calc(2,2.5,1.5)+"px -120px 10px -20px, ",
				"#ff3000 "+calc(2,3,1.5)+"px -122px 9px -21px, ",
				"#ff2000 "+calc(1,3.25,2)+"px -124px 8px -22px, ",
				"#ff0000 "+calc(2,3.4,3)+"px -127px 7px -23px, ",
				"#dd0000 "+calc(2,3.5,4)+"px -130px 5px -25px, ",
				"#aa0000 "+calc(0.5,3.4,6)+"px -134px 4px -26px "
			],
			texte=c.join('');
		flamme.style.MozBoxShadow=texte;
		flamme.style.WebkitBoxShadow=texte;
		flamme.style.boxShadow=texte;
		t+=Math.PI/7;
	}
	function smoke(){
		var 
			c=[	
				"inset #200000 0px 6px 28px 15px, ", //intérieur de l'allumette "inset #806040 0 0 10px 2px, "
				"#202525 0px -2px 18px 1px, ", //contact avec l'allumette
				"#d0e0f0 "+(oPos=0)+"px -35px 20px -20px, ", //fumée bleu/grise
				"#a0c0e0 "+calc(5,2.5)+"px "+calc2(-40,5,1)+"px  25px -22px, ",
				"#303050 "+calc(2,2.5)+"px "+calc2(-45,15,5)+"px  35px -10px, ", //tache sombre
				"#80a0d0 "+calc(3,3)+"px -50px  20px -22px, ",
				"#7080c0 "+calc(1,1)+"px -60px  20px -22px, ",
				"#6070b0 "+calc(1,1.5)+"px -70px  35px -22px, ",
				"#5060a0 "+calc(1,4)+"px "+calc2(-80,5,1.3)+"px  25px -22px, ",
				"#405090 "+calc(1,1.5)+"px -90px  30px -22px, ",
				"#404080 "+calc(1,2)+"px -100px  30px -22px, ",
				"#303070 "+calc(2,1)+"px -110px  25px -22px, ",
				"#202060 "+calc(2,5)+"px -120px  25px -22px, ",
				"#101050 "+calc(2,1)+"px -130px  30px -22px, ",
				"#101040 "+calc(1,0.9)+"px -135px  35px -22px, ",
				"rgb("+Math.round(monte1(250,-249))+","+Math.round(monte1(254,-252))+","+Math.round(monte1(254,-252))+") "+monte1(0,vent*11.5)+"px "+monte1(-10,-160)+"px  15px -20px, ", //fumée
				"rgb("+Math.round(monte1(230,-230,0.89,1))+","+Math.round(monte1(230,-230,0.89,1))+","+Math.round(monte1(254,-240,0.89,1))+") "+(monte1(0,vent*11.8,0.89,1)+calc2(1,20))+"px "+monte1(-20,-150,0.89,1)+"px  15px -21px, ",
				"rgb("+Math.round(monte1(230,-230,0.89,1))+","+Math.round(monte1(230,-230,0.89,1))+","+Math.round(monte1(254,-240,0.89,1))+") "+(monte1(0,vent*11.8,0.89,1)+calc2(1,20)-0.5*vent)+"px "+monte1(-7,-137,0.89,1)+"px  16px -21px, ",
				"rgb("+Math.round(monte1(230,-230,0.89,1))+","+Math.round(monte1(230,-230,0.89,1))+","+Math.round(monte1(254,-240,0.89,1))+") "+(monte1(0,vent*11.8,0.89,1)+calc2(1,20)+1.5*vent)+"px "+monte1(-32,-160,0.89,1)+"px  15px -21px, ",
				"rgb("+Math.round(monte1(230,-230,0.89,0.75))+","+Math.round(monte1(230,-230,0.89,0.75))+","+Math.round(monte1(254,-240,0.89,0.75))+") "+(monte1(0,vent*11.8,0.89,0.75)+calc2(1,20)-0.5*vent)+"px "+monte1(-7,-137,0.89,0.75)+"px  16px -22px, ",
				"rgb("+Math.round(monte1(230,-230,0.89,0.55))+","+Math.round(monte1(230,-230,0.89,0.55))+","+Math.round(monte1(254,-240,0.89,0.55))+") "+(monte1(0,vent*11.8,0.89,0.55)+calc2(1,20)-0.5*vent)+"px "+monte1(-7,-137,0.89,0.55)+"px  16px -23px, ",
				
				"rgb("+Math.round(monte1(220,-199,0.9,1))+","+Math.round(monte1(210,-200,0.9,1))+","+Math.round(monte1(214,-200,0.9,1))+") "+(monte1(0,vent*12.1,0.9,1)+calc2(1,15,2.5))+"px "+monte1(-12,-150,0.9,1)+"px  16px -21px, ",
				"rgb("+Math.round(monte1(210,-199,0.9,1.5))+","+Math.round(monte1(210,-200,0.9,1.5))+","+Math.round(monte1(210,-200,0.9,1.5))+") "+(monte1(0,vent*12.2,0.9,1.5)+calc2(1,15,2.5))+"px "+monte1(-12,-155,0.9,1.5)+"px  18px -22px, ",
				"rgb("+Math.round(monte1(200,-199,0.923,1.5))+","+Math.round(monte1(200,-199,0.923,1.5))+","+Math.round(monte1(200,-199,0.923,1.5))+") "+(monte1(2,vent*12.3,0.923,1.5)+calc2(1,12,2))+"px "+monte1(-12,-158,0.923,1.5)+"px  20px -21px, ",
				"rgb("+Math.round(monte1(200,-199,0.923,0.1))+","+Math.round(monte1(200,-199,0.923,0.1))+","+Math.round(monte1(200,-199,0.923,0.1))+") "+(monte1(-2,vent*12.3,0.923,0.1)+calc2(1,13,1.4))+"px "+monte1(-12,-148,0.923,0.1)+"px  21px -21px, ",
				"rgb("+Math.round(monte1(200,-199,0.923,2.3))+","+Math.round(monte1(200,-199,0.923,2.3))+","+Math.round(monte1(200,-199,0.923,2.3))+") "+(monte1(0,vent*12.25,0.923,2.3)+calc2(1,14,1.1))+"px "+monte1(-12,-138,0.923,2.3)+"px  21px -22px, ",

				"rgb("+Math.round(monte1(200,-189,0.955,0.3))+","+Math.round(monte1(200,-189,0.955,0.3))+","+Math.round(monte1(200,-189,0.955,0.3))+") "+(monte1(0,vent*12.24,0.955,0.3)+calc2(1,9,1.4))+"px "+monte1(-12,-158,0.955,0.3)+"px  22px -19px, ",
				"rgb("+Math.round(monte1(200,-189,0.955,2.5))+","+Math.round(monte1(200,-189,0.955,2.5))+","+Math.round(monte1(200,-189,0.955,2.5))+") "+(monte1(0,vent*12.22,0.955,2.5)+calc2(1,12,1.1))+"px "+monte1(-15,-158,0.955,2.5)+"px  21px -19px, ",
				"rgb("+Math.round(monte1(200,-189,0.955,1.3))+","+Math.round(monte1(200,-189,0.955,1.3))+","+Math.round(monte1(200,-189,0.955,1.3))+") "+(monte1(0,vent*12.21,0.955,1.3)+calc2(1,11,1.1))+"px "+monte1(-12,-154,0.955,1.3)+"px  19px -19px, ",
				"rgb("+Math.round(monte1(200,-189,0.955,1.3))+","+Math.round(monte1(200,-189,0.955,1.3))+","+Math.round(monte1(200,-189,0.955,1.3))+") "+(monte1(0,vent*12.21,0.955,1.3)+calc2(-5,11,1.1))+"px "+monte1(-11,-154,0.955,1.3)+"px  19px -19px, ",
				
				"rgb("+Math.round(monte1(200,-189,0.46,2.3))+","+Math.round(monte1(200,-189,0.46,2.3))+","+Math.round(monte1(200,-189,0.46,2.3))+") "+(monte1(0,vent*12.21,0.46,2.3)+calc2(-1,8,2.9))+"px "+monte1(-10,-138,0.46,2.3)+"px  25px -20px, ",
				"rgb("+Math.round(monte1(200,-189,0.46,0.3))+","+Math.round(monte1(200,-189,0.46,0.3))+","+Math.round(monte1(200,-189,0.46,0.3))+") "+(monte1(0,vent*12.21,0.46,0.3)+calc2(2,9,2.9))+"px "+monte1(-12,-142,0.46,0.3)+"px  25px -19px, ",
				
				"rgb(50,50,60) "+monte1(0,vent*11,0.92,0.5)+"px "+monte1(-15,-120,0.92,0.5)+"px  15px -22px "
			],
			texte=c.join('');
			//console.log(texte);
		flamme.style.MozBoxShadow=texte;
		flamme.style.WebkitBoxShadow=texte;
		flamme.style.boxShadow=texte;
		t+=Math.PI/17;
		//clearInterval(timer);
	}
	
	//fonctions d'interaction
	this.autoVent=function(active){
		clearInterval(timer2);
		iddle();
		if(active){
			elemVent.disabled=true;
			timer2=setInterval(function(){changeVent((Math.random()*2-1));},1000);
		}else{
			elemVent.disabled=false;
		}
	}
	
	var mouvement=(function(){
		//fonction gérant les perturbations de la souris (expérimental)
		var elem=document.getElementById("flamme");
		var limitX2=elem.offsetWidth,limitY2=elem.offsetHeight;
		var offset=[elem.offsetLeft,elem.offsetTop];
		while((elem=elem.parentNode)!==document){
			offset[0]+=elem.offsetLeft-elem.scrollLeft;
			offset[1]+=elem.offsetTop-elem.scrollTop;
		}
		var limitX1=offset[0],limitY1=offset[1];
		limitX2+=limitX1;
		limitY2+=limitY1;

		limitX1-=5;
		limitX2+=5;
		limitY1-=250;
		var oldx,oldy;

		return function (event){
			var x=event.clientX;
			var y=event.clientY;			
			if(oldx || oldy){
				var x1=Math.min(x,oldx),x2=Math.max(x,oldx),y1=Math.min(y,oldy),y2=Math.max(y,oldy);
				if(x1<limitX2 && x2>limitX1 && y1<limitY2 && y2>limitY1){
					var dx=x-oldx;
					var dy=y-oldy;
					var a=dy/dx,b=y-a*x;
					if(x1<limitX1){x1=limitX1;y1=a*x1+b;}
					if(x2>limitX2){x2=limitX2;y2=a*x2+b;}

					if(animation===burn && y2>offset[1] && (dx*dx+dy*dy > 800)){
						animation=smoke;
						clearInterval(timer);
						timer=setInterval(animation,200);
					}
					//TODO perturbation dans la flamme/fumée
				}
			}
			oldx=x;
			oldy=y;
		}
	})();

	this.sourisVent=function(active){
		//active ou désactive les perturbations souris
		if(active){
			document.body.addEventListener("mousemove",mouvement,false);
		}else{
			document.body.removeEventListener("mousemove",mouvement,false);
		}
	}
	
	function changeVent(force){
		if(typeof force === "undefined"){
			iddle();
			force=elemVent.value-vent;
		}
		vent+=force;
		if(vent>10){
			vent=10;
			if(animation===burn){
				animation=smoke;
				clearInterval(timer);
				timer=setInterval(animation,200);
			}
		}
		if(vent<-10){
			vent=-10;
			if(animation===burn){
				animation=smoke;
				clearInterval(timer);
				timer=setInterval(animation,200);
			}
		}
		elemVent.value=vent;
	}
	this.changeVent=changeVent;
	
	var iddle = (function(){
	//permet de cacher/afficher le message d'aide si l'utilisateur ne fait rien
		var timerIddle, //timer d'iddle
			iddleTime=30000, //temps d'attente avant de considérer la page en iddle
			displayElement=document.querySelector("aside"); //élément à afficher
		
		display();
		
		function display(){
			displayElement.style.opacity=1;
		}
		
		function hidden(){
			clearTimeout(timerIddle);
			displayElement.style.opacity=0;
			timerIddle=setTimeout(display,iddleTime);
		}
		
		return hidden;
	})();
	
	function allume(){
		//gère l'allumage de l'allumette
		iddle();
		if(animation===burn){
			alert("Ouch!\nÇa brûle!");
			iddle();
		}else{
			animation=burn;
			clearInterval(timer);
			timer=setInterval(animation,200);
		}
	}
	flamme.onclick=allume;
	changeVent(0);
}

var allumette=new flammeAnimate("flamme","vent");
