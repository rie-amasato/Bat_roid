class vector2{
	//正規化やら長さ取得やらのベクトルクラス
	constructor(x,y){
		this.x=x;
		this.y=y;
	}
	length(){
		return(Math.pow(Math.pow(this.x,2)+Math.pow(this.y,2),0.5));
	}
	length2(){
		return(Math.pow(this.x,2)+Math.pow(this.y,2));
	}

	normarize(){
		const l=this.length();
		if (l!=0){
			this.x/=l;
			this.y/=l;
		}
	}
}

class batClass{
	//Boidを表現するクラス
	constructor(){
		this.x=Math.floor(Math.random()*100);//bgcanvas.width);
		this.y=Math.floor(Math.random()*100);//bgcanvas.height);
		this.vx=Math.pow(0.5,0.5);
		this.vy=Math.pow(0.5,0.5);
		this.wing=Math.floor(Math.random()*2);

		this.v=3+Math.random();
	}

	calcV(){
		//v(速度)の再計算をやっておきたい箇所
		let PSum=[0,0];//座標合計
		let VSum=[0,0];//	速度合計

		let Avoid=new vector2(0,0);
		bats.map((bat)=>{
			const dvec=new vector2(this.x-bat.x,this.y-bat.y);
			const l=Math.pow(dvec.length(),3)
			if (l!=0 ){
				Avoid.x+=(dvec.x/l);
				Avoid.y+=(dvec.y/l);
			}
		});

		
		const Cohession=new vector2((leaderbat.x-this.x),(leaderbat.y-this.y));
		Cohession.normarize();//リーダーに集まる

		//Avoidが分離の力
		Avoid.normarize();


		//係数との内積で力を決定
		const a=[1,0.4];
		//加わる力ベクトル
		const FVector=new vector2(a[0]*Cohession.x+a[1]*Avoid.x,a[0]*Cohession.y+a[1]*Avoid.y);
		FVector.normarize()

		const VVector=new vector2(this.vx+FVector.x,this.vy+=FVector.y);
		VVector.normarize()
		this.vx=VVector.x;
		this.vy=VVector.y;
	}

	draw(){
		this.x+=this.vx*this.v;
		this.y+=this.vy*this.v;
		//角度はatan2で計算しておけば-πからπまでで360°分表現できる
		const ARG=Math.atan2(this.vy,this.vx)+Math.PI/2;

		//キャンバスをうにうに（移動したり回転したり）して描画
		bgctx.translate(this.x,this.y);
		bgctx.rotate(ARG);
		bgctx.translate(-this.x,-this.y);

		const BatWing=Math.floor(f/5)%2==this.wing?1:0;
		bgctx.drawImage(batImgs[BatWing],this.x,this.y,40,30);

		bgctx.translate(this.x,this.y);
		bgctx.rotate(-ARG);
		bgctx.translate(-this.x,-this.y);

		/*
		//デバッグ用の点だけの表示
		bgctx.beginPath();
		if(Math.floor(f/10)%2==this.wing){
			bgctx.fillStyle="rgba(255,0,255,1)";
		}else{
			bgctx.fillStyle="rgba(255,0,0,1)";
		}
		bgctx.arc(this.x,this.y,2,0,Math.PI*2,true);
		bgctx.fill();
		*/
	}
}

LOOPTIME=800;
LOOPVIRT=2;
LOOPHORIZON=1;
function bgrender(){
	f+=1;
	bgctx.clearRect(0,0,bgcanvas.width,bgcanvas.height);
	
	//リーダー（群れが向かう先）として三角関数でいい感じの幾何学模様を描く
	const leaderX=(((Math.sin((f%(LOOPTIME/LOOPVIRT))/(LOOPTIME/LOOPVIRT)*2*Math.PI)+1)/2))*bgcanvas.width;
	const leaderY=(((Math.sin((f%(LOOPTIME/LOOPHORIZON))/(LOOPTIME/LOOPHORIZON)*2*Math.PI)+1)/2))*bgcanvas.height;
		
	leaderbat.x=leaderX;
	leaderbat.y=leaderY;
	//leaderbat.draw();

	//各Boidに対して速度を計算し、描画する
	bats.map((bat)=>{
		bat.calcV();
		bat.draw();
	});

	window.requestAnimationFrame(bgrender);
}

//フレームを入れる変数
let f=0;

//Boid達の生成
let bats=[];
for (let i=0; i<20; i+=1){
	bats.push(new batClass());
}
const leaderbat=new batClass();

//こっからさきはテンプレっぽくキャンバスの設定
let bgcanvas=document.getElementById("bg");
let bgctx=bgcanvas.getContext("2d");
bgcanvas.width=window.innerWidth;
bgcanvas.height=window.innerHeight;

//画像の用意
const batImgs=[new Image(),new Image()];
batImgs[0].src="img/bat0.png";//翼を広げている
batImgs[1].src="img/bat1.png";//翼を閉じている

batImgs.map((batImg)=>{
	batImg.onload=function(){
		bgctx.drawImage(batImg,0,0);
	};
});


window.addEventListener('resize',function(){
	bgcanvas.width=window.innerWidth;
	bgcanvas.height=window.innerHeight;
	bgctx=bgcanvas.getContext("2d");
});


window.requestAnimationFrame(bgrender);
