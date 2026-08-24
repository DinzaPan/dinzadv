document.addEventListener('DOMContentLoaded',function(){

var revealItems=document.querySelectorAll('.reveal');
var revealObserver=new IntersectionObserver(function(entries){
entries.forEach(function(entry){
if(entry.isIntersecting){
entry.target.classList.add('in-view');
revealObserver.unobserve(entry.target);
}
});
},{threshold:0.12});

revealItems.forEach(function(item){
revealObserver.observe(item);
});

initUpcomingModal();

initAntiCopyProtection();

initMinecraftModel();

});

function initUpcomingModal(){
var btnsUpcoming=document.querySelectorAll('.btn-upcoming');
var modalOverlay=document.getElementById('upcoming-modal');
var modalClose=document.getElementById('upcoming-close');

if(!btnsUpcoming.length || !modalOverlay || !modalClose) return;

btnsUpcoming.forEach(function(btn){
btn.addEventListener('click',function(e){
e.preventDefault();
modalOverlay.classList.add('active');
});
});

modalClose.addEventListener('click',function(){
modalOverlay.classList.remove('active');
});

modalOverlay.addEventListener('click',function(e){
if(e.target===modalOverlay){
modalOverlay.classList.remove('active');
}
});
}

function initAntiCopyProtection(){
document.addEventListener('contextmenu',function(e){
e.preventDefault();
});

document.addEventListener('keydown',function(e){
if(e.key==='F12'){
e.preventDefault();
}
if(e.ctrlKey && e.shiftKey && (e.key==='I' || e.key==='i' || e.key==='J' || e.key==='j' || e.key==='C' || e.key==='c')){
e.preventDefault();
}
if(e.ctrlKey && (e.key==='U' || e.key==='u' || e.key==='S' || e.key==='s')){
e.preventDefault();
}
});
}

function initMinecraftModel(){
var container=document.getElementById('mc-model-container');
if(!container) return;

function getDimensions(){
return {
width: container.clientWidth || 260,
height: container.clientHeight || 320
};
}

var dims=getDimensions();
var scene=new THREE.Scene();

var camera=new THREE.PerspectiveCamera(28, dims.width/dims.height, 0.1, 1000);
var renderer=new THREE.WebGLRenderer({alpha:true, antialias:true});
renderer.setSize(dims.width, dims.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

var ambientLight=new THREE.AmbientLight(0xffffff, 0.55);
scene.add(ambientLight);

var dirLight=new THREE.DirectionalLight(0xffffff, 0.35);
dirLight.position.set(-10, 20, 25);
scene.add(dirLight);

var geoData={
"format_version": "1.12.0",
"minecraft:geometry": [
{
"description": {
"identifier": "geometry.unknown",
"texture_width": 64,
"texture_height": 64,
"visible_bounds_width": 3,
"visible_bounds_height": 3.5,
"visible_bounds_offset": [0, 1.25, 0]
},
"bones": [
{"name": "Waist", "pivot": [0, 12, 0]},
{"name": "Head", "parent": "Waist", "pivot": [0, 24, 0], "cubes": [{"origin": [-4, 24, -4], "size": [8, 8, 8], "uv": [0, 0]}, {"origin": [-4, 24, -4], "size": [8, 8, 8], "inflate": 0.5, "uv": [32, 0]}]},
{"name": "Body", "parent": "Waist", "pivot": [0, 24, 0], "cubes": [{"origin": [-4, 12, -2], "size": [8, 12, 4], "uv": [16, 16]}, {"origin": [-4, 12, -2], "size": [8, 12, 4], "inflate": 0.25, "uv": [16, 32]}]},
{"name": "RightArm", "parent": "Waist", "pivot": [-5, 22, 0], "cubes": [{"origin": [-8, 12, -2], "size": [4, 12, 4], "uv": [40, 16]}, {"origin": [-8, 12, -2], "size": [4, 12, 4], "inflate": 0.25, "uv": [40, 32]}]},
{"name": "LeftArm", "parent": "Waist", "pivot": [5, 22, 0], "cubes": [{"origin": [4, 12, -2], "size": [4, 12, 4], "uv": [32, 48]}, {"origin": [4, 12, -2], "size": [4, 12, 4], "inflate": 0.25, "uv": [48, 48]}]},
{"name": "RightLeg", "pivot": [-1.9, 12, 0], "cubes": [{"origin": [-3.9, 0, -2], "size": [4, 12, 4], "uv": [0, 16]}, {"origin": [-3.9, 0, -2], "size": [4, 12, 4], "inflate": 0.25, "uv": [0, 32]}]},
{"name": "LeftLeg", "pivot": [1.9, 12, 0], "cubes": [{"origin": [-0.1, 0, -2], "size": [4, 12, 4], "uv": [16, 48]}, {"origin": [-0.1, 0, -2], "size": [4, 12, 4], "inflate": 0.25, "uv": [0, 48]}]}
]
}
]
};

var textureLoader=new THREE.TextureLoader();
textureLoader.load('img/skin/s1.png', function(texture){
texture.magFilter=THREE.NearestFilter;
texture.minFilter=THREE.NearestFilter;

var material=new THREE.MeshLambertMaterial({
map: texture,
transparent: true,
alphaTest: 0.1
});

var bonesMap={};
var modelGroup=new THREE.Group();

var geomInfo=geoData["minecraft:geometry"][0];
var texW=geomInfo.description.texture_width;
var texH=geomInfo.description.texture_height;

geomInfo.bones.forEach(function(b){
var boneGroup=new THREE.Group();
boneGroup.position.set(b.pivot ? b.pivot[0] : 0, b.pivot ? b.pivot[1] : 0, b.pivot ? b.pivot[2] : 0);

if(b.cubes){
b.cubes.forEach(function(c){
var dx=c.size[0], dy=c.size[1], dz=c.size[2];
if(dx===0||dy===0||dz===0) return;
var inf=c.inflate||0;
var cubeGeo=new THREE.BoxGeometry(dx+inf*2, dy+inf*2, dz+inf*2);

var u=c.uv[0], v=c.uv[1];
var uvs=cubeGeo.attributes.uv;

function setUV(faceIdx, x1, y1, x2, y2){
var u1=x1/texW, v1=1-(y2/texH);
var u2=x2/texW, v2=1-(y1/texH);
var idx=faceIdx*4;
uvs.setXY(idx, u1, v2);
uvs.setXY(idx+1, u2, v2);
uvs.setXY(idx+2, u1, v1);
uvs.setXY(idx+3, u2, v1);
}

setUV(0, u+dz+dx, v+dz, u+dz+dx+dz, v+dz+dy);
setUV(1, u, v+dz, u+dz, v+dz+dy);
setUV(2, u+dz, v, u+dz+dx, v+dz);
setUV(3, u+dz+dx, v, u+dz+dx+dx, v+dz);
setUV(4, u+dz, v+dz, u+dz+dx, v+dz+dy);
setUV(5, u+dz+dx+dz, v+dz, u+dz+dx+dz+dx, v+dz+dy);

uvs.needsUpdate=true;

var mesh=new THREE.Mesh(cubeGeo, material);
var ox=c.origin[0]+dx/2-(b.pivot ? b.pivot[0] : 0);
var oy=c.origin[1]+dy/2-(b.pivot ? b.pivot[1] : 0);
var oz=c.origin[2]+dz/2-(b.pivot ? b.pivot[2] : 0);
mesh.position.set(ox, oy, oz);
boneGroup.add(mesh);
});
}

bonesMap[b.name]=boneGroup;
});

geomInfo.bones.forEach(function(b){
if(b.parent && bonesMap[b.parent]){
var pPivot=geomInfo.bones.find(x=>x.name===b.parent).pivot;
bonesMap[b.name].position.x-=pPivot[0];
bonesMap[b.name].position.y-=pPivot[1];
bonesMap[b.name].position.z-=pPivot[2];
bonesMap[b.parent].add(bonesMap[b.name]);
}else{
modelGroup.add(bonesMap[b.name]);
}
});

if(bonesMap['Waist']){
bonesMap['Waist'].rotation.y=THREE.MathUtils.degToRad(-15);
}
if(bonesMap['Head']){
bonesMap['Head'].rotation.y=THREE.MathUtils.degToRad(8);
}
if(bonesMap['LeftArm']){
bonesMap['LeftArm'].rotation.z=THREE.MathUtils.degToRad(-18);
bonesMap['LeftArm'].rotation.x=THREE.MathUtils.degToRad(12);
bonesMap['LeftArm'].rotation.y=THREE.MathUtils.degToRad(10);
}

var bbox=new THREE.Box3().setFromObject(modelGroup);
var center=bbox.getCenter(new THREE.Vector3());
var size=bbox.getSize(new THREE.Vector3());

modelGroup.position.x=-center.x;
modelGroup.position.y=-center.y;
modelGroup.position.z=-center.z;

scene.add(modelGroup);

function adjustCamera(){
var currentDims=getDimensions();
camera.aspect=currentDims.width/currentDims.height;

var maxDim=Math.max(size.x, size.y, size.z);
var fov=camera.fov*(Math.PI/180);
var cameraZ=Math.abs(maxDim/(2*Math.tan(fov/2)))*1.22;

camera.position.set(0, 0, cameraZ);
camera.lookAt(0, 0, 0);
camera.updateProjectionMatrix();
renderer.setSize(currentDims.width, currentDims.height);
}

adjustCamera();

window.addEventListener('resize', adjustCamera);

var clock=new THREE.Clock();

function easeInOutQuad(t){
return t<0.5 ? 2*t*t : 1-Math.pow(-2*t+2,2)/2;
}

var waveDuration=3;
var transOutDuration=0.6;
var restDuration=2.5;
var transInDuration=0.6;
var cycleLength=waveDuration+transOutDuration+restDuration+transInDuration;
var waveCenter=-130;
var waveAmp=20;
var waveFreq=8;

function animate(){
requestAnimationFrame(animate);

var elapsedTime=clock.getElapsedTime();
var cycleTime=elapsedTime % cycleLength;

if(bonesMap['RightArm']){
var angleDeg=0;

if(cycleTime < waveDuration){
angleDeg=waveCenter + Math.sin(cycleTime * waveFreq) * waveAmp;
}else if(cycleTime < waveDuration + transOutDuration){
var t=(cycleTime - waveDuration) / transOutDuration;
var te=easeInOutQuad(t);
var startAngle=waveCenter + Math.sin(waveDuration * waveFreq) * waveAmp;
angleDeg=startAngle * (1 - te);
}else if(cycleTime < waveDuration + transOutDuration + restDuration){
var restTime=cycleTime - waveDuration - transOutDuration;
angleDeg=Math.sin(restTime * 1.5) * 2;
}else{
var t2=(cycleTime - waveDuration - transOutDuration - restDuration) / transInDuration;
var te2=easeInOutQuad(t2);
angleDeg=waveCenter * te2;
}

bonesMap['RightArm'].rotation.x=THREE.MathUtils.degToRad(angleDeg);
bonesMap['RightArm'].rotation.y=THREE.MathUtils.degToRad(0);
bonesMap['RightArm'].rotation.z=THREE.MathUtils.degToRad(0);
}

renderer.render(scene, camera);
}
animate();
});
}
