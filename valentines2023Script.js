var canvas;
var ctx;
var WIDTH;
var HEIGHT;
var focalLen =  500
var heartQuality = 26;
var heartScale = 80;
var M_PI = Math.PI, M_PI_2 = Math.PI/2.0;
var frame,zBuffer;
var animationID;
var heartAngle = [0,0,0]
var HEART, heartTransform, heartLighting;

var acos23 = Math.acos(2.0/3.0);



function initializeCanvas() {
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
WIDTH = canvas.width;
HEIGHT = canvas.height;
  frame = ctx.getImageData(0,0,WIDTH,HEIGHT);
  zBuffer=Array(HEIGHT);
  for(var j=0;j<HEIGHT;j++){
    zBuffer[j] = Array(WIDTH)
    for(var i=0;i<WIDTH;i++){
      zBuffer[j][i]=9999999999999999;
    }
  }

  HEART = heartTriangles();

  heartTransform = {
  	position: [0,0,0],
	angle: [0,0,0],
	scale: heartScale
  }

  heartLighting = {
	ambient: 0.5,
	lambertian: [2,2,1.6],
	direction: [0.218217890236,-0.872871560944,0.436435780472],
  };
  twoSpheresTest();
  
}

function clearFrame(){
  for(var j=0;j<HEIGHT;j++){
    for(var i=0;i<WIDTH;i++){
      zBuffer[j][i]=9999999999999999;
    }
  }
  
  for(var i=0;i<frame.data.length;i+=4){
    frame.data[i  ]=255;
    frame.data[i+1]=255;
    frame.data[i+2]=180;
    frame.data[i+3]=255;
  }
  ctx.putImageData(frame,0,0);
}



function startAnimation(){
  clearInterval(animationID);
  animationID = setInterval(twoSpheresTest,30);
}

function endAnimation(){
  clearInterval(animationID);
}


 

function twoSpheresTest(){
  

  frame = ctx.getImageData(0,0,WIDTH,HEIGHT); 
  
  
  var r = 150;
  var g = 50;
  var b = 100;
  
  clearFrame();
  
  
	
  for(var i=0;i<HEART.length;i++){
      addTriangle(HEART[i], heartTransform,[r,g,b],heartLighting)
  }
  

  ctx.putImageData(frame,0,0);
	
  //heartAngle[0]+=0.1;
  //heartAngle[1]+=0.1;
  
  heartTransform.angle[2]+=0.1;
  heartTransform.position[0] = 2*heartTransform.scale*Math.sin(heartTransform.angle[2]);
  heartTransform.scale = heartScale*(3+Math.cos(heartTransform.angle[2]/3))/4;

}




function heartTriangles(){
  //add domes on top
  var heart = sphereTriangles(1,0,0,1,0,M_PI*2,0,M_PI/2);
  heart = heart.concat(sphereTriangles(-1,0,0,1,0,M_PI*2,0,M_PI/2));
  
  //add one side
  var heartSide = torusTriangles(2,0,0,3,1,M_PI,M_PI+acos23-M_PI/heartQuality,3*M_PI/2,5*M_PI/2);
  //mirror it and add the other
  var otherSide = torusTriangles(2,0,0,3,1,M_PI,M_PI+acos23-M_PI/heartQuality,3*M_PI/2,5*M_PI/2);
  for(var i=0;i<otherSide.length;i++){
    for(var j=0;j<3;j++){
      otherSide[i][j][0] = -otherSide[i][j][0];
    }
    var temp = otherSide[i][2];
      otherSide[i][2] = otherSide[i][1];
      otherSide[i][1] = temp;
  }
  
  heartSide = heartSide.concat(otherSide)
  heart = heart.concat(heartSide);
  
  //add the smooth part connecting the domes
  heart = heart.concat(torusTriangles(0,0,0,1,1,M_PI,2*M_PI,M_PI/2,3*M_PI/2));
  
  //draw the bottom part of the heart
  heart = heart.concat(bottomCapTriangles(2,0,0,3,1,Math.floor(acos23*heartQuality/M_PI)*M_PI/heartQuality+M_PI,0,0,-Math.sqrt(5)));  
  var cap = bottomCapTriangles(2,0,0,3,1,Math.floor(acos23*heartQuality/M_PI)*M_PI/heartQuality+M_PI,0,0,-Math.sqrt(5))  


  for(var i=0;i<cap.length;i++){
    for(var j=0;j<3;j++){
      cap[i][j][0] = -cap[i][j][0];
    }
    var temp = cap[i][2];
      cap[i][2] = cap[i][1];
      cap[i][1] = temp;
  }
	
  heart = heart.concat(cap);
	
    

  //console.log(heartSide)
  
  //add the flat part of the heart
  var increment = M_PI/heartQuality;
  var flatPart = [],theta; 
var a,b
  for(var i=0;i<heartQuality;i++){
  	a = M_PI+i*(acos23-increment)/heartQuality;
	b = M_PI+i*increment/2;
	flatPart.push([
		[2+3*Math.cos(a),1,3*Math.sin(a)],
		[Math.cos(b),1,Math.sin(b)],
		[2+3*Math.cos(a+increment),1,3*Math.sin(a+increment)]
	]);
	flatPart.push([
		[Math.cos(b),1,Math.sin(b)],	
		[Math.cos(b+increment),1,Math.sin(b+increment)],	
		[2+3*Math.cos(a+increment),1,3*Math.sin(a+increment)],
	]);
	flatPart.push([
		[2+3*Math.cos(a+increment),-1,3*Math.sin(a+increment)],		
		[Math.cos(b),-1,Math.sin(b)],		
		[2+3*Math.cos(a),-1,3*Math.sin(a)]
	]);
	flatPart.push([
		[2+3*Math.cos(a+increment),-1,3*Math.sin(a+increment)],
		[Math.cos(b+increment),-1,Math.sin(b+increment)],
		[Math.cos(b),-1,Math.sin(b)],	
					
	]);

	flatPart.push([
		[-2-3*Math.cos(a),-1,3*Math.sin(a)],
		[-Math.cos(b),-1,Math.sin(b)],
		[-2-3*Math.cos(a+increment),-1,3*Math.sin(a+increment)]
	]);
	flatPart.push([
		[-Math.cos(b),-1,Math.sin(b)],	
		[-Math.cos(b+increment),-1,Math.sin(b+increment)],	
		[-2-3*Math.cos(a+increment),-1,3*Math.sin(a+increment)],
	]);
	flatPart.push([
		[-2-3*Math.cos(a+increment),1,3*Math.sin(a+increment)],		
		[-Math.cos(b),1,Math.sin(b)],		
		[-2-3*Math.cos(a),1,3*Math.sin(a)]
	]);
	flatPart.push([
		[-2-3*Math.cos(a+increment),1,3*Math.sin(a+increment)],
		[-Math.cos(b+increment),1,Math.sin(b+increment)],
		[-Math.cos(b),1,Math.sin(b)],	
					
	]);
  }
  flatPart.push([
		[2+3*Math.cos(a),1,3*Math.sin(a)],
		[0,1,-1],
		[0,1,-Math.sqrt(5)]
	]);
  flatPart.push([
		[2+3*Math.cos(a),-1,3*Math.sin(a)],
		[0,-1,-Math.sqrt(5)],
		[0,-1,-1],
	]);
  flatPart.push([
		[-2-3*Math.cos(a),-1,3*Math.sin(a)],
		[0,-1,-1],
		[0,-1,-Math.sqrt(5)]
	]);
  flatPart.push([
		[-2-3*Math.cos(a),1,3*Math.sin(a)],
		[0,1,-Math.sqrt(5)],
		[0,1,-1],
	]);
  
  heart = heart.concat(flatPart);
  


  return heart
}

/*
  Takes the 3D position and angles of the object and camera and projects the point on a 2D plane
*/
function project(objPos){
    
	//project points onto camera plane and save
    if(objPos[1] != focalLen){
      return [objPos[0]/(1.0-(objPos[1]/focalLen))+WIDTH/2.0,
            HEIGHT/2.0-objPos[2]/(1.0-(objPos[1]/focalLen)),
            -objPos[1]];
    }else{
      return [WIDTH/2.0,
            HEIGHT/2.0,
            -objPos[1]];
    }
}

//returns a list of triangle vertices for a segment of a sphere
function sphereTriangles(x,y,z,r,thetaMin,thetaMax,phiMin,phiMax){
    var increment = M_PI/heartQuality;
    var triangles = [];
    for(var phi=phiMin; phi<phiMax; phi+=increment){
		for(var theta=thetaMin; theta<thetaMax; theta+=increment){
			
			//add vertices for triangle 1
            triangles.push([
                [x+r*Math.sin(phi)*Math.cos(theta),
                 y+r*Math.sin(phi)*Math.sin(theta),
                 z+r*Math.cos(phi)],
              
                [x+r*Math.sin(phi+increment)*Math.cos(theta),
                 y+r*Math.sin(phi+increment)*Math.sin(theta),
                 z+r*Math.cos(phi+increment)],
              
                [x+r*Math.sin(phi)*Math.cos(theta+increment),
                 y+r*Math.sin(phi)*Math.sin(theta+increment),
                 z+r*Math.cos(phi)]
            ]);
			
			//add vertices for triangle 2
			
			triangles.push([
                [x+r*Math.sin(phi+increment)*Math.cos(theta),
                 y+r*Math.sin(phi+increment)*Math.sin(theta),
                 z+r*Math.cos(phi+increment)],
              
                [x+r*Math.sin(phi+increment)*Math.cos(theta+increment),
                 y+r*Math.sin(phi+increment)*Math.sin(theta+increment),
                 z+r*Math.cos(phi+increment)],
              
                [x+r*Math.sin(phi)*Math.cos(theta+increment),
                 y+r*Math.sin(phi)*Math.sin(theta+increment),
                 z+r*Math.cos(phi)],
              
            ]);
          }
	}
    return triangles;
}



//returns a list of triangle vertices for a segment of a sphere
function torusTriangles(x,y,z,c,a,thetaMin,thetaMax,phiMin,phiMax){
    var increment = M_PI/heartQuality;
    var triangles = [];
    for(var phi=phiMin; phi<phiMax; phi+=increment){
		for(var theta=thetaMin; theta<thetaMax; theta+=increment){
			
			//add vertices for triangle 1
            triangles.push([
                [x+(c+a*Math.cos(phi))*Math.cos(theta),
                 y+a*Math.sin(phi),
                 z+(c+a*Math.cos(phi))*Math.sin(theta)],
              
                [x+(c+a*Math.cos(phi+increment))*Math.cos(theta),
                 y+a*Math.sin(phi+increment),
                 z+(c+a*Math.cos(phi+increment))*Math.sin(theta)],
              
                [x+(c+a*Math.cos(phi))*Math.cos(theta+increment),
                 y+a*Math.sin(phi),
                 z+(c+a*Math.cos(phi))*Math.sin(theta+increment)]
                            
            ]);
			
			//add vertices for triangle 2
			
			triangles.push([
                [x+(c+a*Math.cos(phi+increment))*Math.cos(theta),
                 y+a*Math.sin(phi+increment),
                 z+(c+a*Math.cos(phi+increment))*Math.sin(theta)],
              
                [x+(c+a*Math.cos(phi+increment))*Math.cos(theta+increment),
                 y+a*Math.sin(phi+increment),
                 z+(c+a*Math.cos(phi+increment))*Math.sin(theta+increment)],
              
                [x+(c+a*Math.cos(phi))*Math.cos(theta+increment),
                 y+a*Math.sin(phi),
                 z+(c+a*Math.cos(phi))*Math.sin(theta+increment)]
              
                
              
            ]);
          
		}
	}
    return triangles;
}


function bottomCapTriangles(xTorus,yTorus,zTorus,c,r,theta,xBot,yBot,zBot){
    var increment = M_PI/heartQuality;
    var triangles = [];
    for(var phi=-M_PI/2; phi<M_PI/2; phi+=increment){	
	triangles.push([
                [xTorus+(c+r*Math.cos(phi))*Math.cos(theta),
                 yTorus+r*Math.sin(phi),
                 zTorus+(c+r*Math.cos(phi))*Math.sin(theta)],
              
                [xTorus+(c+r*Math.cos(phi+increment))*Math.cos(theta),
                 yTorus+r*Math.sin(phi+increment),
                 zTorus+(c+r*Math.cos(phi+increment))*Math.sin(theta)],
              
                [xBot,
                 yBot+r*Math.cos(phi+3*M_PI/2),
                 zBot+r*Math.sin(phi+3*M_PI/2)]
                            
            ]);
			
			//add vertices for triangle 2
			
			triangles.push([
                [xTorus+(c+r*Math.cos(phi+increment))*Math.cos(theta),
                 yTorus+r*Math.sin(phi+increment),
                 zTorus+(c+r*Math.cos(phi+increment))*Math.sin(theta)],
              
                [xBot,
                 yBot+r*Math.cos(phi+increment+3*M_PI/2),
                 zBot+r*Math.sin(phi+increment+3*M_PI/2)],
		
		[xBot,
                 yBot+r*Math.cos(phi+3*M_PI/2),
                 zBot+r*Math.sin(phi+3*M_PI/2)]
		]);
}
	return triangles;
	
}

function rotate(pos,angle){
    //precalculate sines and cosines
	var cx = Math.cos(angle[0]), cy = Math.cos(angle[1]), cz = Math.cos(angle[2]);
	var sx = Math.sin(angle[0]), sy = Math.sin(angle[1]), sz = Math.sin(angle[2]);
		
	//rotate object
	var xa = cy*(sz*pos[1] + cz*pos[0]) - sy*pos[2];
	var ya = sx*(cy*pos[2] + sy*(sz*pos[1] +cz*pos[0])) + cx*(cz*pos[1] - sz*pos[0]);
	var za = cx*(cy*pos[2] + sy*(sz*pos[1] +cz*pos[0])) - sx*(cz*pos[1] - sz*pos[0]);
  
    return [xa,ya,za]
}

//uses barycentric coordinates (I'm not 100% sure what they are tbh) to find the pixels in a triangle
function getTrianglePixels(triangle){
  
    var x1 = triangle[0][0],y1 = triangle[0][1];
    var x2 = triangle[1][0],y2 = triangle[1][1];
    var x3 = triangle[2][0],y3 = triangle[2][1];
    
    var pixels = [];
  
    //generate bounds of bounding box
	var minX = Math.floor(Math.min(x1,x2,x3)),maxX = Math.floor(Math.max(x1,x2,x3));
	var minY = Math.floor(Math.min(y1,y2,y3)),maxY = Math.floor(Math.max(y1,y2,y3));
	
	var i=0;
		
	//check all pixels in the bounding box to see if they are in the triangle
	for(var y=minY;y<=maxY;y++){
		for(var x=minX;x<=maxX;x++){
			var l1,l2,l3;
			//convert from cartesian to barycentric coordinates	
			//I copied this formula from wikipedia
			l1 = ((y2-y3)*(x-x3)+(x3-x2)*(y-y3))/((y2-y3)*(x1-x3)+(x3-x2)*(y1-y3));
			l2 = ((y3-y1)*(x-x3)+(x1-x3)*(y-y3))/((y2-y3)*(x1-x3)+(x3-x2)*(y1-y3));
			l3 = 1.0-l1-l2;
			//if any of the barycentric coordinates are outside the range [0,1], that point is outside the triangle
			if(0<=l1 && l1<=1 && 0<=l2 && l2<=1 && 0<=l3 && l3<=1){
				pixels.push([x,y]);
			}
		}
	}
	
    return pixels;
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
//adds a triangle to the frame
function addTriangle(triangle, transformation, color, lighting){



var triCopy= triangle.slice()


    
    for(var i=0;i<3;i++){

	//rotate triangles
        triCopy[i] = rotate(triCopy[i],transformation.angle);

	for(var j=0;j<3;j++){
		
		//scale triangles
		triCopy[i][j] *= transformation.scale;

		//translate triangles
		triCopy[i][j] -= transformation.position[j];
	    
	}
    }
    

    

    var x1 = triCopy[0][0],y1 = triCopy[0][1],z1 = triCopy[0][2];
    var x2 = triCopy[1][0],y2 = triCopy[1][1],z2 = triCopy[1][2];
    var x3 = triCopy[2][0],y3 = triCopy[2][1],z3 = triCopy[2][2];
  
	
    //use lambertian reflectance model to get colors 
	//Yes, as you guessed, I went to wikipedia again for this lol
	var crossX = (y2-y1)*(z3-z1) - (z2-z1)*(y3-y1);
	var crossY = (x2-x1)*(z3-z1) - (z2-z1)*(x3-x1);
	var crossZ = (x2-x1)*(y3-y1) - (y2-y1)*(x3-x1);
	var len = Math.sqrt(crossX*crossX + crossY*crossY + crossZ*crossZ);
	crossX/=len; crossY/=len; crossZ/=len; 
  
    var dotProd = (crossX*lighting.direction[0]+crossY*lighting.direction[1]+crossZ*lighting.direction[2]);
	color[0] = Math.floor(clamp((lighting.ambient + (lighting.lambertian[0] * dotProd)) * color[0],0,255));
	color[1] = Math.floor(clamp((lighting.ambient + (lighting.lambertian[1] * dotProd)) * color[1],0,255));
	color[2] = Math.floor(clamp((lighting.ambient + (lighting.lambertian[2] * dotProd)) * color[2],0,255));
    
  
  
	//project triangles onto plane of the screen
	triCopy[0] = project(triCopy[0]);
	triCopy[1] = project(triCopy[1]);
	triCopy[2] = project(triCopy[2]);
	

	//get the pixels
	var triPixels = getTrianglePixels(triCopy);
	var framePixels = frame.data;
	
	//console.log(triPixels)
	//find the pixels that are in the triangle

	for(var i=0;i<triPixels.length;i++){
        //get pixel values
		x = triPixels[i][0]
		y = triPixels[i][1]
		//check if the location is in the bounds of the screen
		if(0<=x && x<=WIDTH && 0<=y && y<= HEIGHT){
			x1 = triCopy[0][0];y1 = triCopy[0][1];z1 = triCopy[0][2];
            x2 = triCopy[1][0];y2 = triCopy[1][1];z2 = triCopy[1][2];
            x3 = triCopy[2][0];y3 = triCopy[2][1];z3 = triCopy[2][2];

          
			//calculate barycentric coordinates
			var l1 = ((y2-y3)*(x-x3)+(x3-x2)*(y-y3))/((y2-y3)*(x1-x3)+(x3-x2)*(y1-y3));
			var l2 = ((y3-y1)*(x-x3)+(x1-x3)*(y-y3))/((y2-y3)*(x1-x3)+(x3-x2)*(y1-y3));
			var l3 = 1.0-l1-l2;

			//only draw pixel if it's the closest
			if(l1*z1 + l2*z2 + l3*z3 < zBuffer[y][x]){
				
				


				//update zbuffer
				zBuffer[y][x] = l1*z1 + l2*z2 + l3*z3;
              
                //get to pixel (x,y) in the data
                var offset = (y*frame.width+x)*4;
              
                //draw the pixel
                frame.data[offset] = color[0];
                frame.data[offset + 1] = color[1];
                frame.data[offset + 2] = color[2];
                frame.data[offset + 3] = 255;
              
			}
		}
	}
}

