/**
 * Vis 1 Task 1 Framework
 * Copyright (C) TU Wien
 *   Institute of Visual Computing and Human-Centered Technology
 *   Research Unit of Computer Graphics
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are not permitted.
 *
 * Main script for Vis1 exercise. Loads the volume, initializes the scene, and contains the paint function.
 *
 * @author Manuela Waldner
 * @author Laura Luidolt
 * @author Diana Schalko
 */
let renderer, camera, scene, orbitCamera;
let canvasWidth, canvasHeight = 0;
let container = null;
let volume = null;
let fileInput = null;
let testShader = null;

let myShader = null;
let isoValues = [0.2, 0.5, 0.9];
let colors = [new THREE.Vector3(1.0, 1.0, 1.0), new THREE.Vector3(1.0, 1.0, 1.0), new THREE.Vector3(1.0, 1.0, 1.0)];
let opacities = [1.0, 1.0, 1.0];

/**
 * Load all data and initialize UI here.
 */
function init() {
    // volume viewer
    container = document.getElementById("viewContainer");
    canvasWidth = window.innerWidth * 0.7;
    canvasHeight = window.innerHeight * 0.7;

    // WebGL renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( canvasWidth, canvasHeight );
    container.appendChild( renderer.domElement );

    // read and parse volume file
    fileInput = document.getElementById("upload");
    fileInput.addEventListener('change', readFile);

    // dummy shader gets a color as input
    //testShader = new TestShader([255.0, 255.0, 0.0]);
}

/**
 * Handles the file reader. No need to change anything here.
 */
function readFile(){
    let reader = new FileReader();
    reader.onloadend = function () {
        console.log("data loaded: ");

        let data = new Uint16Array(reader.result);
        volume = new Volume(data);

        resetVis();
    };
    reader.readAsArrayBuffer(fileInput.files[0]);
}

/**
 * Construct the THREE.js scene and update histogram when a new volume is loaded by the user.
 *
 * Currently renders the bounding box of the volume.
 */
async function resetVis(){
    // create new empty scene and perspective camera
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, canvasWidth / canvasHeight, 0.1, 1000 );

    // If volume data is loaded send it to shader and draw histogram
    if(volume != null){
        boundDim = new THREE.Vector3(volume.width, volume.height, volume.depth);
        
        // Find min and max values using a loop
        let minVoxel = volume.voxels[0];
        let maxVoxel = volume.voxels[0];

        for (let i = 1; i < volume.size; i++) {
            if (volume.voxels[i] < minVoxel) minVoxel = volume.voxels[i];
            if (volume.voxels[i] > maxVoxel) maxVoxel = volume.voxels[i];
        }

        let voxelsNorm = volume.voxels.map((x) => (x - minVoxel) / (maxVoxel - minVoxel));
        let texture3D = new THREE.Data3DTexture(voxelsNorm, volume.width, volume.height, volume.depth);
        texture3D.format = THREE.RedFormat;
        texture3D.type = THREE.FloatType;
        texture3D.minFilter = THREE.LinearMipmapLinearFilter;
        texture3D.magFilter = THREE.LinearFilter;
        //texture3D.wrapS = texture3D.wrapT = texture3D.wrapR = THREE.RepeatWrapping;
        texture3D.unpackAligment = 1;
        texture3D.needsUpdate = true;
        myShader = new MyShader(texture3D, camera.position, boundDim, canvasWidth, canvasHeight);
        
        // ############## define histogram #################
        let oldHistogram = d3.select("svg");
        if (!oldHistogram.empty()) {
            // Animation: Fade out the old histogram
            oldHistogram.transition()
            .duration(500)
            .style("opacity", 0)
            .remove()
        .on("end", function(){
            addNewHistogram();
        });
        } else {
            addNewHistogram();
        }
        


        // creates an intensity-density histogram and adds it to the page
        function addNewHistogram(){

            let svg = d3.select("#histogram")
                .append("svg")
                    .attr("width", 350)
                    .attr("height", 330)
                .append("g")
                    .attr("transform", "translate(30,10)");

            let x_label = d3.select("svg").append("text")
                .attr("class", "label")
                .attr("text-anchor", "end")
                .attr("x", 350)
                .attr("y", 330 - 30)
                .attr("fill", "white")
                .text("Density");        

            let y_label = d3.select("svg").append("text")
                .attr("class", "label")
                .attr("text-anchor", "end")
                .attr("y", 40)
                .attr("dy", ".75em")
                .attr("transform", "rotate(-90)")
                .attr("fill", "white")
                .text("Intensity");    

            let x = d3.scaleLinear()
                .domain([0.0, 1.0])
                .range([0, 300]);
            svg.append("g")
                .attr("transform", "translate(0, 300)")
                .call(d3.axisBottom(x));

            let y = d3.scaleLinear()
                .domain([1.0, 0.0])
                .range([0, 300]);
            svg.append("g")
                .call(d3.axisLeft(y));

            let binFunc = d3.histogram()
                .domain(x.domain())
                .thresholds(x.ticks(100));

            let bins = binFunc(volume.voxels);
            let binSizes = [];
            
            // create array with amount of density values per intensity
            for (let i = 0; i != bins.length; i++) {
                binSizes.push(bins[i].length / volume.voxels.length);
            }

            // map values to range [0,1]
            let minSize = Math.min(...binSizes);
            let maxSize = Math.max(...binSizes);
            //let scaleFunction = function(n) { return (n - minSize) / (maxSize - minSize); };
            //console.log(scaleFunction(0.43));
            let scaleFunction = function(n) {
                // Apply square root transformation to n
                const sqrtScaled = Math.sqrt(n);
                // Normalize the square root values to range from 0 to 1
                return sqrtScaled / Math.sqrt(maxSize);
            };
            
            
            // add data to histogram
            svg.selectAll("rect")
                .data(bins)
                .enter()
                .append("rect")
                    .attr("x", 2)
                    .attr("transform", function(d) { return "translate(" + x(d.x0) + ", " + y(scaleFunction(d.length / volume.voxels.length)) + ")"; })
                    .attr("width", function(d) { return x(d.x1) - x(d.x0) - 1; })
                    .attr("height", function(d) { return 300 - y(scaleFunction(d.length / volume.voxels.length)); })
                    .style("fill", "#ff0000") // Start with a different color for the bars
                    .transition() // this animation does not play?
                        .duration(1500) 
                        .delay((d, i) => i * 10) // Add a delay to stagger the animation of each bar
                        .ease(d3.easeExpOut) // smoother animation
                        .attr("height", function(d) { return 300 - y(scaleFunction(d.length / volume.voxels.length)); })
                        .style("fill", "#cc2222"); 
        }
    }

    // dummy scene: we render a box and attach our color test shader as material
    const testCube = new THREE.BoxGeometry(volume.width, volume.height, volume.depth);
    const testMaterial = myShader.material;
    await myShader.load(); // this function needs to be called explicitly, and only works within an async function!
    const testMesh = new THREE.Mesh(testCube, testMaterial);
    scene.add(testMesh);
    
    // our camera orbits around an object centered at (0,0,0)
    orbitCamera = new OrbitCamera(camera, new THREE.Vector3(0,0,0), 2*volume.max, renderer.domElement);

    // init paint loop
    requestAnimationFrame(paint);
}

// slider for isoValue for iso surface 0
function onSliderInput(val) {
    isoValues[0] = parseFloat(val);

    if (myShader != null) {
        myShader.updateISO(isoValues);
        requestAnimationFrame(paint);
    }
}

// slider for color for iso surface 0
function onColorChange(val) {
    let parts = val.split(' ');
    let r = parseFloat(parts[0]) / 255.0;
    let g = parseFloat(parts[1]) / 255.0;
    let b = parseFloat(parts[2]) / 255.0;

    let a = 1.0; // TODO: make opacity changable in editor for each iso surface independently. probably need own function onOpacityChange()
    
    colors[0] = new THREE.Vector3(r,g,b);
    opacities[0] = a; // TODO: move this to onOpacityChange() for first opacity picker (iso surface 0)

    if (myShader != null) {
        myShader.updateColor(colors);
        myShader.updateOpacity(opacities);
        requestAnimationFrame(paint);
    }
}

/**
 * Render the scene and update all necessary shader information.
 */
function paint(){
    if (volume) {

        renderer.render(scene, camera);
    }
}
