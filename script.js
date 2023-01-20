
    const scene = new THREE.Scene();

	const ambientLight = new THREE.AmbientLight(0xffffff, 3);
	scene.add( ambientLight );

	const drligt = new THREE.DirectionalLight(0xffffff, 2);
	scene.add( drligt );

			
	const camera = new THREE.Camera();
	scene.add(camera);

	const canvas = document.querySelector("#canvas");

	const renderer = new THREE.WebGLRenderer({
		canvas,
		antialias : true,
		alpha: true
	});
	renderer.setClearColor(new THREE.Color('lightgrey'), 0)
	renderer.setSize( 640, 480 );
	renderer.domElement.style.position = 'absolute'
	renderer.domElement.style.top = '0px'
	renderer.domElement.style.left = '0px'
	document.body.appendChild( renderer.domElement );

	const clock = new THREE.Clock();
	let deltaTime = 0;
	let totalTime = 0;
	
	

	const arToolkitSource = new THREEx.ArToolkitSource({
		sourceType : 'webcam',
	});

	function onResize()
	{
		arToolkitSource.onResize()	
		arToolkitSource.copySizeTo(renderer.domElement)	
		if ( arToolkitContext.arController !== null )
		{
			arToolkitSource.copySizeTo(arToolkitContext.arController.canvas)	
		}	
	}

	arToolkitSource.init(function onReady(){
		onResize()
	});

	window.addEventListener('resize', function(){
		onResize()
	});
	
	const arToolkitContext = new THREEx.ArToolkitContext({
		cameraParametersUrl: 'data/camera_para.dat',
		detectionMode: 'mono'
	});
	
	arToolkitContext.init( function onCompleted(){
		camera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() );
	});

	const markerRoot1 = new THREE.Group();
	scene.add(markerRoot1);
	let markerControls1 = new THREEx.ArMarkerControls(arToolkitContext, markerRoot1, {
		type: 'pattern', patternUrl: "data/kanji.patt",
	})
	
	function onProgress(xhr) { console.log( (xhr.loaded / xhr.total * 100) + '% loaded' ); }
	function onError(xhr) { console.log( 'An error happened' ); }


	const assetLoader = new THREE.GLTFLoader();

assetLoader.load("Footman.glb", function (gltf) {
  const model = gltf.scene;
  markerRoot1.add(model);
//   model.position.set(-12, -50, -100);
  model.scale.set(0.7, 0.7, 0.7);

  model.traverse(function(node) {
    if(node.isMesh)
    {node.castShadow = true;}
  });
});




const plane1geo = new THREE.PlaneGeometry(1.5, 1.5, 1.5);
// const plane1png = new URL ("Picture1.png", import.meta.url );
const plane1texture = new THREE.TextureLoader().load("Picture1.png")
const plane1Mat = new THREE.MeshBasicMaterial({
	map : plane1texture,
	side : THREE.DoubleSide
});
const plane1 = new THREE.Mesh(plane1geo, plane1Mat);
// markerRoot1.add(plane1);
plane1.position.set(2, 0.3, -0.5);

const plane2geo = new THREE.PlaneGeometry(2.5, 1.5, 1.5);
const plane2texture = new THREE.TextureLoader().load("Picture3.png")
const plane2Mat = new THREE.MeshBasicMaterial({
	map : plane2texture,
	side : THREE.DoubleSide
});
const plane2 = new THREE.Mesh(plane2geo, plane2Mat);
// markerRoot1.add(plane2);
plane2.position.set(0, 3, -0.5);

const plane3geo = new THREE.PlaneGeometry(2.5, 1.5, 1.5);
const plane3texture = new THREE.TextureLoader().load("Picture3.png")
const plane3Mat = new THREE.MeshBasicMaterial({
	map : plane3texture,
	side : THREE.DoubleSide
});
const plane3 = new THREE.Mesh(plane3geo, plane3Mat);
// markerRoot1.add(plane3);
plane3.position.set(-2, 0.3, -0.5);



function update()
{
	if ( arToolkitSource.ready !== false )
		arToolkitContext.update( arToolkitSource.domElement );
}


function render()
{
	renderer.render( scene, camera );
}


function animate()
{
	function loopObjects() {
		markerRoot1.add(plane1);
		new TWEEN.Tween({ opacity: 1 })
			.to({ opacity: 0 }, 50)
			.onUpdate(function () {
				plane1.material.opacity = this.opacity;
			})
			.onComplete(function () {
				markerRoot1.remove(plane1);
				markerRoot1.add(plane2);
				new TWEEN.Tween({ opacity: 0 })
					.to({ opacity: 1 }, 50)
					.onUpdate(function () {
						plane2.material.opacity = this.opacity;
					})
					.onComplete(function () {
						new TWEEN.Tween({ opacity: 1 })
						.to({ opacity: 0 }, 50)
						.onUpdate(function () {
							plane2.material.opacity = this.opacity;
						})
						.onComplete(function () {
							markerRoot1.remove(plane2);
							markerRoot1.add(plane3);
							new TWEEN.Tween({ opacity: 0 })
							.to({ opacity: 1 }, 50)
							.onUpdate(function () {
								plane3.material.opacity = this.opacity;
							})
							// .onComplete(function () {
							// 	markerRoot1.remove(plane3);
							// markerRoot1.add(plane1);
							// 	new TWEEN.Tween({ opacity: 1 })
							// 	.to({ opacity: 0 }, 500)
							// 	.onUpdate(function () {
							// 		plane3.material.opacity = this.opacity;
							// 	})
								.start();
								})
								.start();
								})
								.start();
								})
								// .start();
								// })
							}

setInterval(loopObjects, 2500);


TWEEN.update();
	requestAnimationFrame(animate);
	deltaTime = clock.getDelta();
	totalTime += deltaTime;
	update();
	render();
}


animate();