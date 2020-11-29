canvas = document.getElementById('myCanvas');
gridHeight = 500;
gridWidth = 500;
theGrid = createArray(gridHeight, gridWidth);
mirrorGrid = createArray(gridHeight, gridWidth);
var colors = [];
for(var i = 0 ; i < 100000 ; i++)colors[i] = getRandomColor();
var iter = 1;
var stop = false;
var frameCount = 0;
var fps, fpsInterval, startTime, now, then, elapsed;

var isFinishedCA = false;
var isRunning = true;
var isFinishedMC = false;
var updatedMC = 0;

fillArray(); //create the starting state for the grid by filling it with cells

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function Refresh(){
	if(gridHeight !== document.getElementById('height').value ||
	    gridWidth !== document.getElementById('width').value)
		RefreshCanvas();
	else{
		clearGrid();
		drawGrid();
	}
	//location.reload()
}

function RefreshCanvas(){
	gridHeight = document.getElementById('height').value;
	gridWidth = document.getElementById('width').value;
	canvas.height = gridHeight;
	canvas.width = gridWidth;
	theGrid = createArray(gridHeight, gridWidth);
	mirrorGrid = createArray(gridHeight, gridWidth);
}

function Execute() { //main loop
	if(document.getElementById("brzeg").value === 'default' &&
		document.getElementById("zarodkowanie").value === 'default') 
		alert('Wybierz warunek brzegowy i rodzaj zarodkowania!');
	else if(document.getElementById("brzeg").value === 'default') alert('Wybierz warunek brzegowy!');
	else if(document.getElementById("zarodkowanie").value === 'default') alert('Wybierz rodzaj zarodkowania!');
	
	else{ 
		isFinishedCA = false;
		isRunning = true;
		isFinishedMC = false;
		animate();
	}
}

function togglePause() {
	
  // toggle the value of isRunning
	isRunning = !isRunning;
  
	var element = document.getElementById("pause");
	if(isRunning === false){
	element.innerHTML = "Continue";
	}
	else element.innerHTML = " Pause ";

  // call animate() if working
	if (isRunning) {
		animate();
	}
}

function animate() {
	
	if(isFinishedCA === true) console.log('Algorytm CA zakończył pracę!');
	else{
		if (isRunning) {
			requestAnimationFrame(animate);

			// draw stuff here
			drawGrid();
			updateGrid();	
		}
	}
}

function createArray(rows, columns){ //creates a 2 dimensional array of required height
  var arr = new Array(rows);
  for (var i = 0; i < columns; i++) {
    arr[i] = new Array(columns);
  }
  return arr;
}

function clearGrid(){
	for (var j = 0; j < gridHeight; j++) { //iterate through rows
		for (var k = 0; k < gridWidth; k++) { //iterate through columns
			theGrid[j][k] = 0;
			mirrorGrid[j][k] = 0;
		}
	}
}

function fillArray(){ 
	var val = 1;
	
	clearGrid();
	
	x = document.getElementById("zarodkowanie").value;
	
	switch(x){//fill the grid
	
        case 'jednorodne': 
			//alert('Jednorodne!')
			var countX = prompt("Podaj ilość po wierszach:", "");
			var countY = prompt("Podaj ilość po kolumnach:", "");
			x = parseInt(gridHeight/countX);
			y = parseInt(gridWidth/countY);
			for (var j = parseInt(x/2); j < gridHeight; j += x) { //iterate through rows
				for (var k = parseInt(y/2); k < gridWidth; k += y) { //iterate through columns
//					console.log('[' + j + ', ' + k + ']')
					theGrid[j][k] = val;
					val++;
				}
			}
			drawGrid();
            break;
			
		
        case 'promien':
			//alert('Promien!')
			var radius = prompt("Podaj promień:", "");
			var count = prompt("Podaj ilość:", "");
			var min = Math.ceil(0);
			var maxHeight = Math.floor(gridHeight-1);
			var maxWidth = Math.floor(gridWidth-1);
			var miss = 0;
			if (radius != null) {
				do{
					randRow = parseInt(Math.floor(Math.random() * (maxHeight - min + 1)) + min,10);
					randColumn = parseInt(Math.floor(Math.random() * (maxWidth - min + 1)) + min,10);
					if (theGrid[randRow][randColumn] !== -1) {
						console.log("x: " + randRow+ "y: " + randColumn);
						
						theGrid[randRow][randColumn] = val;
						val++;
						
						centerX = randRow;
						centerY = randColumn;
						for(var degree = 0 ; degree < 360 ; degree++){
							
							var radians = degree * Math.PI/180;
							var x = parseInt(centerX + radius * Math.cos(radians),10);
							var y = parseInt(centerY + radius * Math.sin(radians),10);
							
							for (var j = 0; j < gridHeight; j++) { //iterate through rows
								for (var k = 0; k < gridWidth; k++) { //iterate through columns
								
									if(	j !== centerX && k !== centerY){
									
										if((j >= centerX && j < x) && (k >= centerY && k < y) || 
										   (j <= centerX && j > x) && (k >= centerY && k < y) ||
										   (j <= centerX && j > x) && (k <= centerY && k > y) ||
										   (j >= centerX && j < x) && (k <= centerY && k > y))
										    theGrid[j][k] = -1;
									}
								}
							}
						}	
						
					}
					else{miss++;}			
				}while(val <= count && miss < 100);
				if(val != count)alert('Nie ma miejsca dla tylu punktów!');
			}
			else alert('Podano zły promień!')

			for (var j = 0; j < gridHeight; j++) { //iterate through rows
				for (var k = 0; k < gridWidth; k++) { //iterate through columns
					if(theGrid[j][k] === -1) theGrid[j][k] = 0;
				}
			}

			drawGrid();
			break;
			
        case 'losowe': 
		
			//alert('Losowe!')
			
			var min = Math.ceil(0);
			var maxHeight = Math.floor(gridHeight-1);
			var maxWidth = Math.floor(gridWidth-1);		
			var count = prompt("Podaj ilość:", "");
			do{
				randRow = parseInt(Math.floor(Math.random() * (maxHeight - min + 1)) + min,10);
				randColumn = parseInt(Math.floor(Math.random() * (maxWidth - min + 1)) + min,10);
				theGrid[randRow][randColumn] = val;
				val++;
			}while(val <= count)
			drawGrid();
			break;
			
		case 'wyklikanie':
		
			//alert('Wyklikane!')
			 
			canvas = document.querySelector('canvas');
			canvas.addEventListener('mousedown', function(e) {
				getCursorPosition(canvas, e, val);
				val++;
				drawGrid();
			})
			
            break;
	}
}
function getCursorPosition(canvas, event, val) {
    const rect = canvas.getBoundingClientRect()
    const x = parseInt(event.clientX - rect.left);
    const y = parseInt(event.clientY - rect.top);
	console.log("[" + x + ", " + y + "]");
	theGrid[x][y] = val;
}

function drawGrid(){ //draw the contents of the grid
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, gridWidth, gridHeight); //clear the canvas ahead of each redraw
	
	for (var j = 0; j < gridHeight; j++) { //iterate through rows
		for (var k = 0; k < gridWidth; k++) { //iterate through columns

			if (theGrid[j][k] !== 0) {
				
				col = theGrid[j][k] - 1;
				ctx.fillStyle = colors[col];
				ctx.fillRect(j, k, 1, 1);
			}
		}
	}
}

function MonteCarlo(){
	updatedMC = 0;
	if(isFinishedCA === false) alert('Przed zastosowanem algorymu Monte Carlo należy wypełnić siatkę algorytmem CA!!!');
	else{
		if(isFinishedMC === true) console.log('Nastąpił koniec algorytmu MC!')
		else{
			carloArray = [];
			let nr = 0;
			neighValues = [];
				for (var j = 0 ; j < gridHeight; j++){ //iterate through rows
					for (var k = 0; k < gridWidth; k++){ //iterate through columns
						if (calcEnergy(j,k, theGrid[j][k]) !== 0){	
						
							carloArray[nr] = [j,k];
							nr++;
						}
					}
				}
	//		console.log('Przed przemieszaniem: ' + carloArray[0] + ', ' + carloArray[1])		
			shuffle(carloArray);
	//		console.log('Po przemieszaniu: ' + carloArray[0] + ', ' + carloArray[1])		
			console.log('Razem pikseli: ' + gridWidth*gridHeight)
			console.log('Brzegowych pikseli: ' + carloArray.length);

			for(let a = 0; a < carloArray.length ; a++ ){
					
				neighValues = takeValues(carloArray[a][0],carloArray[a][1]);
				shuffle(neighValues);
					
				for(let b = 0 ; b < neighValues.length ; b++){
					
					currentEnergy = calcEnergy(carloArray[a][0], carloArray[a][1], theGrid[carloArray[a][0]][carloArray[a][1]]);
					nextEnergy = calcEnergy(carloArray[a][0], carloArray[a][1], neighValues[b]);
				
//					console.log("Czy "+ theGrid[carloArray[a][0]][carloArray[a][1]] + " jest większe niż "+ neighValues[b] +"?")
					
					if( nextEnergy < currentEnergy){
						mirrorGrid[carloArray[a][0]][carloArray[a][1]] = neighValues[b];
//						console.log("podmieniono");
						updatedMC++;
					}
				}
				carloArray.slice(1);
			}
			console.log("Podstawiono: " + updatedMC );
			if (updatedMC === 0) isFinishedMC = true;
			
			for (var j = 0; j < gridHeight; j++) { //iterate through rows
				for (var k = 0; k < gridWidth; k++) { //iterate through columns
					theGrid[j][k] = mirrorGrid[j][k];
				}
			}
			
			requestAnimationFrame(MonteCarlo);
			drawGrid();
		
		}	
	
	}
}



function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
function takeValues(j,k){
	let nValues = [];
	let nv = 0;

	if (theGrid[(j - 1 + gridHeight)%gridHeight][(k - 1 + gridWidth)%gridWidth] !== theGrid[j][k]){ 
	
		nValues[nv] = theGrid[(j - 1 + gridHeight)%gridHeight][(k - 1 + gridWidth)%gridWidth];
		nv++;
	}; 

	if (theGrid[(j - 1 + gridHeight)%gridHeight][k] !== theGrid[j][k] && 
		!nValues.includes(theGrid[(j - 1 + gridHeight)%gridHeight][k])){  
		
		nValues[nv] = theGrid[(j - 1 + gridHeight)%gridHeight][k];
		nv++;
	}; 
	
	if (theGrid[(j - 1 + gridHeight)%gridHeight][(k + 1 + gridWidth)%gridWidth] !== theGrid[j][k] && 
		!nValues.includes(theGrid[(j - 1 + gridHeight)%gridHeight][(k + 1 + gridWidth)%gridWidth])){
			
		nValues[nv] = theGrid[(j - 1 + gridHeight)%gridHeight][(k + 1 + gridWidth)%gridWidth];
		nv++;
	}; 						

	//left
	
	if (theGrid[j][(k - 1 + gridWidth)%gridWidth] !== theGrid[j][k] && 
		!nValues.includes(theGrid[j][(k - 1 + gridWidth)%gridWidth])){
		
		nValues[nv] = theGrid[j][(k - 1 + gridWidth)%gridWidth][k];
		nv++;
	}
	
	//right
	
	if (theGrid[j][(k + 1 + gridWidth)%gridWidth] !== theGrid[j][k] &&
		!nValues.includes(theGrid[j][(k + 1 + gridWidth)%gridWidth])){ 
	
		nValues[nv] = theGrid[j][(k + 1 + gridWidth)%gridWidth];
		nv++;
	}
	
	//bottom 
	
	if (theGrid[(j + 1 + gridHeight)%gridHeight][(k - 1 + gridWidth)%gridWidth] !== theGrid[j][k] &&
		!nValues.includes(theGrid[(j + 1 + gridHeight)%gridHeight][(k - 1 + gridWidth)%gridWidth])){ 
	
		nValues[nv] = theGrid[(j + 1 + gridHeight)%gridHeight][(k - 1 + gridWidth)%gridWidth];
		nv++;
	}
	
	if (theGrid[(j + 1 + gridHeight)%gridHeight][k] !== theGrid[j][k] &&
		!nValues.includes(theGrid[(j + 1 + gridHeight)%gridHeight][k])){ 
	
		nValues[nv] = theGrid[(j + 1 + gridHeight)%gridHeight][k];
		nv++;
	}
	
	if (theGrid[(j + 1 + gridHeight)%gridHeight][(k + 1 + gridWidth)%gridWidth] !== theGrid[j][k] &&
		!nValues.includes(theGrid[(j + 1 + gridHeight)%gridHeight][(k + 1 + gridWidth)%gridWidth])){ 
	
		nValues[nv] = theGrid[(j + 1 + gridHeight)%gridHeight][(k + 1 + gridWidth)%gridWidth];
		nv++;
	}
	
	return nValues
}
	
function calcEnergy(j, k, val){
	
	let en = 0;
	
	//top

	if (theGrid[(j - 1 + gridHeight)%gridHeight][(k - 1 + gridWidth)%gridWidth] !== val) {  
		en++;
	}; 

	if (theGrid[(j - 1 + gridHeight)%gridHeight][k] !== val) {  
		en++;
	}; 
	
	if (theGrid[(j - 1 + gridHeight)%gridHeight][(k + 1 + gridWidth)%gridWidth] !== val){
		en++;
	}; 						

	//left
	
	if (theGrid[j][(k - 1 + gridWidth)%gridWidth] !== val){
		en++;
	}
	
	//right
	
	if (theGrid[j][(k + 1 + gridWidth)%gridWidth] !== val){ 
		en++;
	}
	
	//bottom 
	
	if (theGrid[(j + 1 + gridHeight)%gridHeight][(k - 1 + gridWidth)%gridWidth] !== val){ 
		en++;
	}
	
	if (theGrid[(j + 1 + gridHeight)%gridHeight][k] !== val){ 
		en++;
	}
	
	if (theGrid[(j + 1 + gridHeight)%gridHeight][(k + 1 + gridWidth)%gridWidth] !== val){ 
		en++;
	}
	return en;
}

function updateGrid() { //perform one iteration of grid update

	//alert('Iteracja #'+ iter)
	var brzeg = document.getElementById("brzeg").value;
	var sasiedztwo = document.getElementById("sasiedztwo").value;
	
	if(sasiedztwo === 'VonNeuman'){
		var updated = 0;
		if(brzeg === 'absorb'){
			for (var j = 1; j < gridHeight - 1; j++) { //iterate through rows
				for (var k = 1; k < gridWidth - 1; k++) { //iterate through columns
					var n = 0;
					var q = 0;
					if(theGrid[j][k] === 0){
						
						//top
						
						if (theGrid[j - 1][k] !== 0) {  
							q = theGrid[j - 1][k];
							n++;
						}; 

						//left
						
						if ((theGrid[j][k - 1] !== 0) && (theGrid[j][k - 1] > q )){
							q = theGrid[j][k - 1]; 
							n++;
						}
						
						//right
						
						if ((theGrid[j][k + 1] !== 0) && (theGrid[j][k + 1] > q )){ 
							q = theGrid[j][k + 1]; 
							n++;
						}
						
						//bottom 
						
						if ((theGrid[j + 1][k] !== 0) && (theGrid[j + 1][k] > q )){ 
							q = theGrid[j + 1][k]; 
							n++;
						}
						
						// updating
					  
						if(n !== 0){
							if(theGrid[j - 1][k] === 0) {mirrorGrid[j - 1][k] = q; updated++}
							if(theGrid[j][k] === 0) {mirrorGrid[j][k] = q; updated++}
							if(theGrid[j][k - 1] === 0) {mirrorGrid[j][k - 1] = q; updated++}
							if(theGrid[j][k + 1] === 0) {mirrorGrid[j][k + 1] = q; updated++}
							if(theGrid[j + 1][k] === 0) {mirrorGrid[j + 1][k] = q; updated++}		
					  }
				  }
				}
			}
			for (var j = 0; j < gridHeight; j++) { //iterate through rows
				for (var k = 0; k < gridWidth; k++) { //iterate through columns
					theGrid[j][k] = mirrorGrid[j][k];
				}
			}
			console.log('Updated: ' + updated);
			if(updated === 0) isFinishedCA = true;
		}
		else{
			for (var j = 0; j < gridHeight; j++) { //iterate through rows
				for (var k = 0; k < gridWidth; k++) { //iterate through columns
		
					var n = 0;
					var q = 0;
					if(theGrid[j][k] === 0){
						
						// top
						
						if ((j === 0) && (theGrid[gridHeight-1][k] !== 0)){
							q = theGrid[gridHeight-1][k];
							n++;
						}				
						if ((j !== 0) && (theGrid[j - 1][k] !== 0)) { 
							q = theGrid[j - 1][k];
							n++;
						} 
						
						// left
						
						if ((k === 0) && (theGrid[j][gridWidth-1] !== 0) && (theGrid[j][gridWidth-1] > q )){ 
							q = theGrid[j][gridWidth-1]; 
							n++;
						}
						if((k !== 0) && (theGrid[j][k - 1] !== 0) && (theGrid[j][k - 1] > q )){ 
							q = theGrid[j][k - 1]; 
							n++;
						}
						
						// right
						
						if ((k === gridWidth-1) && (theGrid[j][0] !== 0) && (theGrid[j][0] > q)){ 
							q = theGrid[j][0]; 
							n++;
						}
						if((k !== gridWidth-1) && (theGrid[j][k + 1] !== 0) && (theGrid[j][k + 1] > q )){ 
							q = theGrid[j][k + 1]; 
							n++;
						}
						
						// bottom
						
						if((j=== gridHeight-1) && (theGrid[0][k] !== 0) && (theGrid[0][k] > q )){
							q = theGrid[0][k]; 
							n++;
						}
						if((j !== gridHeight-1) && (theGrid[j + 1][k] !== 0) && (theGrid[j + 1][k] > q )){ //bottom 
							q = theGrid[j + 1][k]; 
							n++;
						}
						
					  // updating
						if(n !== 0){
							if(j === 0 && (theGrid[gridHeight-1][k] === 0)){mirrorGrid[gridHeight-1][k] = q; updated++}
							else if( j !== 0 && theGrid[j - 1][k] === 0) {mirrorGrid[j - 1][k] = q; updated++}
							if(k == 0 && (theGrid[j][gridWidth-1] === 0)){mirrorGrid[j][gridWidth-1] = q; updated++}
							else if( k !== 0 &&theGrid[j][k - 1] === 0) {mirrorGrid[j][k - 1] = q; updated++}
							if(k === gridWidth-1 && (theGrid[j][0] === 0)){mirrorGrid[j][0] = q; updated++}
							else if( k !== gridWidth-1 && theGrid[j][k + 1] === 0) {mirrorGrid[j][k + 1] = q; updated++}
							if(j === gridHeight-1 && (theGrid[0][k] === 0)){mirrorGrid[0][k] = q; updated++}
							else if( j!== gridHeight-1 && theGrid[j + 1][k] === 0) {mirrorGrid[j + 1][k] = q; updated++}	
							if(theGrid[j][k] === 0) {mirrorGrid[j][k] = q; updated++}
						}
					}

				}
			}
			
			for (var j = 0 ; j < gridHeight; j++) { //iterate through rows
				for (var k = 0 ; k < gridWidth; k++) { //iterate through columns
					theGrid[j][k] = mirrorGrid[j][k];
				}
			}
			if(updated === 0) isFinishedCA = true;			
		}	
	}
	else if(sasiedztwo === 'Moore'){
		let updated = 0;
		console.log('Moore')
		if(brzeg === 'absorb'){
			for (var j = 1; j < gridHeight - 1; j++) { //iterate through rows
				for (var k = 1; k < gridWidth - 1; k++) { //iterate through columns
					var n = 0;
					var q = 0;
					if(theGrid[j][k] === 0){
						
						//top
						
						if (theGrid[j - 1][k - 1] !== 0) {  
							q = theGrid[j - 1][k - 1];
							n++;
						}; 

						if (theGrid[j - 1][k] !== 0 && (theGrid[j - 1][k] > q )) {  
							q = theGrid[j - 1][k];
							n++;
						}; 
						
						if (theGrid[j - 1][k + 1] !== 0 && (theGrid[j - 1][k + 1] > q )) {  
							q = theGrid[j - 1][k + 1];
							n++;
						}; 						


						//left
						
						if ((theGrid[j][k - 1] !== 0) && (theGrid[j][k - 1] > q )){
							q = theGrid[j][k - 1]; 
							n++;
						}
						
						//right
						
						if ((theGrid[j][k + 1] !== 0) && (theGrid[j][k + 1] > q )){ 
							q = theGrid[j][k + 1]; 
							n++;
						}
						
						//bottom 
						
						if ((theGrid[j + 1][k - 1] !== 0) && (theGrid[j + 1][k - 1] > q )){ 
							q = theGrid[j + 1][k - 1]; 
							n++;
						}
						
						if ((theGrid[j + 1][k] !== 0) && (theGrid[j + 1][k] > q )){ 
							q = theGrid[j + 1][k]; 
							n++;
						}
						
						if ((theGrid[j + 1][k + 1] !== 0) && (theGrid[j + 1][k + 1] > q )){ 
							q = theGrid[j + 1][k + 1]; 
							n++;
						}						
						// updating
					  
						if(n !== 0){
							if(theGrid[j - 1][k - 1] === 0) {mirrorGrid[j - 1][k - 1] = q; updated++}
							if(theGrid[j - 1][k] === 0) {mirrorGrid[j - 1][k] = q; updated++}
							if(theGrid[j - 1][k + 1] === 0) {mirrorGrid[j - 1][k + 1] = q; updated++}
							if(theGrid[j][k] === 0) {mirrorGrid[j][k] = q; updated++}
							if(theGrid[j][k - 1] === 0) {mirrorGrid[j][k - 1] = q; updated++}
							if(theGrid[j][k + 1] === 0) {mirrorGrid[j][k + 1] = q; updated++}
							if(theGrid[j + 1][k - 1] === 0) {mirrorGrid[j + 1][k - 1] = q; updated++}	
							if(theGrid[j + 1][k] === 0) {mirrorGrid[j + 1][k] = q; updated++}
							if(theGrid[j + 1][k + 1] === 0) {mirrorGrid[j + 1][k + 1] = q; updated++}								
					  }
				  }
				}
			}
			for (var j = 0; j < gridHeight; j++) { //iterate through rows
				for (var k = 0; k < gridWidth; k++) { //iterate through columns
					theGrid[j][k] = mirrorGrid[j][k];
				}
			}
			if(updated === 0) isFinishedCA = true;
		}
		else{
			for (var j = 0; j < gridHeight; j++) { //iterate through rows
				for (var k = 0; k < gridWidth; k++) { //iterate through columns
		
					var n = 0;
					var q = 0;
					if(theGrid[j][k] === 0){
						
						if (theGrid[(j - 1 + gridHeight)%gridHeight][(k - 1 + gridWidth)%gridWidth] !== 0) {  
								q = theGrid[(j - 1 + gridHeight)%gridHeight][(k - 1 + gridWidth)%gridWidth];
								n++;
							}; 

							if (theGrid[(j - 1 + gridHeight)%gridHeight][k] !== 0 && (theGrid[(j - 1 + gridHeight)%gridHeight][k] > q )) {  
								q = theGrid[(j - 1 + gridHeight)%gridHeight][k];
								n++;
							}; 
							
							if (theGrid[(j - 1 + gridHeight)%gridHeight][(k + 1 + gridWidth)%gridWidth] !== 0 && (theGrid[(j - 1 + gridHeight)%gridHeight][(k + 1 + gridWidth)%gridWidth] > q )) {  
								q = theGrid[(j - 1 + gridHeight)%gridHeight][(k + 1 + gridWidth)%gridWidth];
								n++;
							}; 						


							//left
							
							if ((theGrid[j][(k - 1 + gridWidth)%gridWidth] !== 0) && (theGrid[j][(k - 1 + gridWidth)%gridWidth] > q )){
								q = theGrid[j][(k - 1 + gridWidth)%gridWidth]; 
								n++;
							}
							
							//right
							
							if ((theGrid[j][(k + 1 + gridWidth)%gridWidth] !== 0) && (theGrid[j][(k + 1 + gridWidth)%gridWidth] > q )){ 
								q = theGrid[j][(k + 1 + gridWidth)%gridWidth]; 
								n++;
							}
							
							//bottom 
							
							if ((theGrid[(j + 1 + gridHeight)%gridHeight][(k - 1 + gridWidth)%gridWidth] !== 0) &&
								(theGrid[(j + 1 + gridHeight)%gridHeight][(k - 1 + gridWidth)%gridWidth] > q )){ 
								q = theGrid[(j + 1 + gridHeight)%gridHeight][(k - 1 + gridWidth)%gridWidth]; 
								n++;
							}
							
							if ((theGrid[(j + 1 + gridHeight)%gridHeight][k] !== 0) && (theGrid[(j + 1 + gridHeight)%gridHeight][k] > q )){ 
								q = theGrid[(j + 1 + gridHeight)%gridHeight][k]; 
								n++;
							}
							
							if ((theGrid[(j + 1 + gridHeight)%gridHeight][(k + 1 + gridWidth)%gridWidth] !== 0) &&
								(theGrid[(j + 1 + gridHeight)%gridHeight][(k + 1 + gridWidth)%gridWidth] > q )){ 
								q = theGrid[(j + 1 + gridHeight)%gridHeight][(k + 1 + gridWidth)%gridWidth]; 
								n++;
							}						
							// updating
						  
							if(n !== 0){
								if(theGrid[(j - 1 + gridHeight)%gridHeight][(k - 1 + gridWidth)%gridWidth] === 0) {
									mirrorGrid[(j - 1 + gridHeight)%gridHeight][(k - 1 + gridWidth)%gridWidth] = q;
									updated++
								}
								if(theGrid[(j - 1 + gridHeight)%gridHeight][k] === 0) {
									mirrorGrid[(j - 1 + gridHeight)%gridHeight][k] = q;
									updated++;
								}
								if(theGrid[(j - 1 + gridHeight)%gridHeight][(k + 1 + gridWidth)%gridWidth] === 0) {
									mirrorGrid[(j - 1 + gridHeight)%gridHeight][(k + 1 + gridWidth)%gridWidth] = q; updated++
								}
								if(theGrid[j][k] === 0) {mirrorGrid[j][k] = q; updated++}
								if(theGrid[j][(k - 1 + gridWidth)%gridWidth] === 0) {
									mirrorGrid[j][(k - 1 + gridWidth)%gridWidth] = q;
									updated++
								}
								if(theGrid[j][(k + 1 + gridWidth)%gridWidth] === 0) {
									mirrorGrid[j][(k + 1 + gridWidth)%gridWidth] = q;
									updated++;
								}
								if(theGrid[(j + 1 + gridHeight)%gridHeight][(k - 1 + gridWidth)%gridWidth] === 0) {
									mirrorGrid[(j + 1 + gridHeight)%gridHeight][(k - 1 + gridWidth)%gridWidth] = q;
									updated++;
								}	
								if(theGrid[(j + 1 + gridHeight)%gridHeight][k] === 0) {
									mirrorGrid[(j + 1 + gridHeight)%gridHeight][k] = q;
									updated++;
								}
								if(theGrid[(j + 1 + gridHeight)%gridHeight][(k + 1 + gridWidth)%gridWidth] === 0) {
									mirrorGrid[(j + 1 + gridHeight)%gridHeight][(k + 1 + gridWidth)%gridWidth] = q; 
									updated++;
								}								
						  }	
				
					}

				}
			}
			for (var j = 0; j < gridHeight; j++) { //iterate through rows
				for (var k = 0; k < gridWidth; k++) { //iterate through columns
					theGrid[j][k] = mirrorGrid[j][k];
				}
			}
			if(updated === 0) isFinishedCA = true;
		}
	}
	else if(sasiedztwo === 'PentagonalneP'){
		PentagonalneP(brzeg);
	}
	else if(sasiedztwo === 'PentagonalneL'){
		PentagonalneL(brzeg);
	}
	else if(sasiedztwo === 'PentagonalneG'){
		PentagonalneG(brzeg);
	}
	else if(sasiedztwo === 'PentagonalneD'){
		PentagonalneD(brzeg);
	}
	else if(sasiedztwo === 'PentagonalneLSE'){
		var random = Math.floor(Math.random() * 4)
		switch(random){
			case 0:
				PentagonalneP(brzeg);
				break;
			case 1:
				PentagonalneL(brzeg);
				break;			
			case 2:
				PentagonalneG(brzeg);
				break;			
			case 3:
				PentagonalneD(brzeg);
				break;			
		}
		
	}
	else if(sasiedztwo === 'HeksagonalneL'){
		HeksagonalneL(brzeg);
	}
	else if(sasiedztwo === 'HeksagonalneP'){
		HeksagonalneP(brzeg);
	}	
	else if(sasiedztwo === 'HeksagonalneLSE'){
		var r = Math.floor(Math.random() * 2);
		switch(r){
			case 0:
				HeksagonalneP(brzeg);
				break;
			case 1:
				HeksagonalneL(brzeg);
				break;	
		}				
	}
		//console.log('Iteracja nr' + iter + ' | Zaktualizowano: '+ updated + ' Punktów!')
		iter++;
}
function PentagonalneP(brzeg){
	var updated = 0;
	console.log("PentagonalneP");
	if(brzeg === 'absorb'){
		for (var j = 1; j < gridHeight - 1; j++) { //iterate through rows
			for (var k = 1; k < gridWidth - 1; k++) { //iterate through columns
				var n = 0;
				var q = 0;
				if(theGrid[j][k] === 0){
					
					//top
					
					if (theGrid[j - 1][k] !== 0 && (theGrid[j - 1][k] > q )) {  
						q = theGrid[j - 1][k];
						n++;
					}; 
					
					if (theGrid[j - 1][k + 1] !== 0 && (theGrid[j - 1][k + 1] > q )) {  
						q = theGrid[j - 1][k + 1];
						n++;
					}; 						

					//right
					
					if ((theGrid[j][k + 1] !== 0) && (theGrid[j][k + 1] > q )){ 
						q = theGrid[j][k + 1]; 
						n++;
					}
					
					//bottom 
					
					if ((theGrid[j + 1][k] !== 0) && (theGrid[j + 1][k] > q )){ 
						q = theGrid[j + 1][k]; 
						n++;
					}
					
					if ((theGrid[j + 1][k + 1] !== 0) && (theGrid[j + 1][k + 1] > q )){ 
						q = theGrid[j + 1][k + 1]; 
						n++;
					}						
					// updating
				  
					if(n !== 0){
						if(theGrid[j - 1][k] === 0) {mirrorGrid[j - 1][k] = q; updated++}
						if(theGrid[j - 1][k + 1] === 0) {mirrorGrid[j - 1][k + 1] = q; updated++}
						if(theGrid[j][k] === 0) {mirrorGrid[j][k] = q; updated++}
						if(theGrid[j][k + 1] === 0) {mirrorGrid[j][k + 1] = q; updated++}
						if(theGrid[j + 1][k] === 0) {mirrorGrid[j + 1][k] = q; updated++}
						if(theGrid[j + 1][k + 1] === 0) {mirrorGrid[j + 1][k + 1] = q; updated++}								
				  }
			  }
			}
		}
		for (var j = 0; j < gridHeight; j++) { //iterate through rows
			for (var k = 0; k < gridWidth; k++) { //iterate through columns
				theGrid[j][k] = mirrorGrid[j][k];
			}
		}
		if(updated === 0) isFinishedCA = true;
	}
	else{
			for (var j = 0; j < gridHeight; j++){ //iterate through rows
				for (var k = 0; k < gridWidth; k++){ //iterate through columns
		
					var n = 0;
					var q = 0;
					if(theGrid[j][k] === 0){
						
						//top				

							if (theGrid[(j - 1 + gridHeight)%gridHeight][k] !== 0 && (theGrid[(j - 1 + gridHeight)%gridHeight][k] > q )) {  
								q = theGrid[(j - 1 + gridHeight)%gridHeight][k];
								n++;
							}; 
							
							if (theGrid[(j - 1 + gridHeight)%gridHeight][(k + 1 + gridWidth)%gridWidth] !== 0 && (theGrid[(j - 1 + gridHeight)%gridHeight][(k + 1 + gridWidth)%gridWidth] > q )) {  
								q = theGrid[(j - 1 + gridHeight)%gridHeight][(k + 1 + gridWidth)%gridWidth];
								n++;
							}; 						
							
							//right
							
							if ((theGrid[j][(k + 1 + gridWidth)%gridWidth] !== 0) && (theGrid[j][(k + 1 + gridWidth)%gridWidth] > q )){ 
								q = theGrid[j][(k + 1 + gridWidth)%gridWidth]; 
								n++;
							}
							
							//bottom 			
							
							if ((theGrid[(j + 1 + gridHeight)%gridHeight][k] !== 0) && (theGrid[(j + 1 + gridHeight)%gridHeight][k] > q )){ 
								q = theGrid[(j + 1 + gridHeight)%gridHeight][k]; 
								n++;
							}
							
							if ((theGrid[(j + 1 + gridHeight)%gridHeight][(k + 1 + gridWidth)%gridWidth] !== 0) &&
								(theGrid[(j + 1 + gridHeight)%gridHeight][(k + 1 + gridWidth)%gridWidth] > q )){ 
								q = theGrid[(j + 1 + gridHeight)%gridHeight][(k + 1 + gridWidth)%gridWidth]; 
								n++;
							}						
							// updating
						  
							if(n !== 0){
								if(theGrid[(j - 1 + gridHeight)%gridHeight][k] === 0) {
									mirrorGrid[(j - 1 + gridHeight)%gridHeight][k] = q;
									updated++;
								}
								if(theGrid[(j - 1 + gridHeight)%gridHeight][(k + 1 + gridWidth)%gridWidth] === 0) {
									mirrorGrid[(j - 1 + gridHeight)%gridHeight][(k + 1 + gridWidth)%gridWidth] = q; updated++
								}
								if(theGrid[j][k] === 0) {mirrorGrid[j][k] = q; updated++}
								if(theGrid[j][(k + 1 + gridWidth)%gridWidth] === 0) {
									mirrorGrid[j][(k + 1 + gridWidth)%gridWidth] = q;
									updated++;
								}
								if(theGrid[(j + 1 + gridHeight)%gridHeight][k] === 0) {
									mirrorGrid[(j + 1 + gridHeight)%gridHeight][k] = q;
									updated++;
								}
								if(theGrid[(j + 1 + gridHeight)%gridHeight][(k + 1 + gridWidth)%gridWidth] === 0) {
									mirrorGrid[(j + 1 + gridHeight)%gridHeight][(k + 1 + gridWidth)%gridWidth] = q; 
									updated++;
								}								
						  }	
				
					}

				}
			}
			for (var j = 0; j < gridHeight; j++) { //iterate through rows
				for (var k = 0; k < gridWidth; k++) { //iterate through columns
					theGrid[j][k] = mirrorGrid[j][k];
				}
			}
			if(updated === 0) isFinishedCA = true;
	}
	
}
function PentagonalneL(brzeg){
	var updated = 0;	
	console.log("PentagonalneL");
	if(brzeg === 'absorb'){
		for (var j = 1; j < gridHeight - 1; j++) { //iterate through rows
			for (var k = 1; k < gridWidth - 1; k++) { //iterate through columns
				var n = 0;
				var q = 0;
				if(theGrid[j][k] === 0){
					
					//top
					
					if (theGrid[j - 1][k - 1] !== 0) {  
						q = theGrid[j - 1][k - 1];
						n++;
					}; 
					
					if (theGrid[j - 1][k] !== 0 && (theGrid[j - 1][k] > q )) {  
						q = theGrid[j - 1][k];
						n++;
					}; 

					//left
					
					if ((theGrid[j][k - 1] !== 0) && (theGrid[j][k - 1] > q )){
						q = theGrid[j][k - 1]; 
						n++;
					}
					
					//bottom 
					
					if ((theGrid[j + 1][k - 1] !== 0) && (theGrid[j + 1][k - 1] > q )){ 
						q = theGrid[j + 1][k - 1]; 
						n++;
					}
					
					if ((theGrid[j + 1][k] !== 0) && (theGrid[j + 1][k] > q )){ 
						q = theGrid[j + 1][k]; 
						n++;
					}
					
					// updating
				  
					if(n !== 0){
						if(theGrid[j - 1][k - 1] === 0) {mirrorGrid[j - 1][k - 1] = q; updated++}
						if(theGrid[j - 1][k] === 0) {mirrorGrid[j - 1][k] = q; updated++}
						if(theGrid[j][k] === 0) {mirrorGrid[j][k] = q; updated++}
						if(theGrid[j][k - 1] === 0) {mirrorGrid[j][k - 1] = q; updated++}
						if(theGrid[j + 1][k - 1] === 0) {mirrorGrid[j + 1][k - 1] = q; updated++}	
						if(theGrid[j + 1][k] === 0) {mirrorGrid[j + 1][k] = q; updated++}							
				  }
			  }
			}
		}
		for (var j = 0; j < gridHeight; j++) { //iterate through rows
			for (var k = 0; k < gridWidth; k++) { //iterate through columns
				theGrid[j][k] = mirrorGrid[j][k];
			}
		}
		if(updated === 0) isFinishedCA = true;
	}
	else{
			for (var j = 0; j < gridHeight; j++) { //iterate through rows
				for (var k = 0; k < gridWidth; k++) { //iterate through columns
		
					var n = 0;
					var q = 0;
					if(theGrid[j][k] === 0){
						
						//top
						
						if (theGrid[(j - 1 + gridHeight)%gridHeight][(k - 1 + gridWidth)%gridWidth] !== 0) {  
								q = theGrid[(j - 1 + gridHeight)%gridHeight][(k - 1 + gridWidth)%gridWidth];
								n++;
							}; 

							if (theGrid[(j - 1 + gridHeight)%gridHeight][k] !== 0 && (theGrid[(j - 1 + gridHeight)%gridHeight][k] > q )) {  
								q = theGrid[(j - 1 + gridHeight)%gridHeight][k];
								n++;
							}; 					

							//left
							
							if ((theGrid[j][(k - 1 + gridWidth)%gridWidth] !== 0) && (theGrid[j][(k - 1 + gridWidth)%gridWidth] > q )){
								q = theGrid[j][(k - 1 + gridWidth)%gridWidth]; 
								n++;
							}
							
							//bottom 
							
							if ((theGrid[(j + 1 + gridHeight)%gridHeight][(k - 1 + gridWidth)%gridWidth] !== 0) &&
								(theGrid[(j + 1 + gridHeight)%gridHeight][(k - 1 + gridWidth)%gridWidth] > q )){ 
								q = theGrid[(j + 1 + gridHeight)%gridHeight][(k - 1 + gridWidth)%gridWidth]; 
								n++;
							}
							
							if ((theGrid[(j + 1 + gridHeight)%gridHeight][k] !== 0) && (theGrid[(j + 1 + gridHeight)%gridHeight][k] > q )){ 
								q = theGrid[(j + 1 + gridHeight)%gridHeight][k]; 
								n++;
							}
					
							// updating
						  
							if(n !== 0){
								if(theGrid[(j - 1 + gridHeight)%gridHeight][(k - 1 + gridWidth)%gridWidth] === 0) {
									mirrorGrid[(j - 1 + gridHeight)%gridHeight][(k - 1 + gridWidth)%gridWidth] = q;
									updated++
								}
								if(theGrid[(j - 1 + gridHeight)%gridHeight][k] === 0) {
									mirrorGrid[(j - 1 + gridHeight)%gridHeight][k] = q;
									updated++;
								}
								if(theGrid[j][k] === 0) {mirrorGrid[j][k] = q; updated++}
								if(theGrid[j][(k - 1 + gridWidth)%gridWidth] === 0) {
									mirrorGrid[j][(k - 1 + gridWidth)%gridWidth] = q;
									updated++
								}
								if(theGrid[(j + 1 + gridHeight)%gridHeight][(k - 1 + gridWidth)%gridWidth] === 0) {
									mirrorGrid[(j + 1 + gridHeight)%gridHeight][(k - 1 + gridWidth)%gridWidth] = q;
									updated++;
								}	
								if(theGrid[(j + 1 + gridHeight)%gridHeight][k] === 0) {
									mirrorGrid[(j + 1 + gridHeight)%gridHeight][k] = q;
									updated++;
								}								
						  }	
				
					}

				}
			}
			for (var j = 0; j < gridHeight; j++) { //iterate through rows
				for (var k = 0; k < gridWidth; k++) { //iterate through columns
					theGrid[j][k] = mirrorGrid[j][k];
				}
			}	
			if(updated === 0) isFinishedCA = true;			
	}
}
		
function PentagonalneG(brzeg){
	var updated = 0;
	console.log("PentagonalneG");
	if(brzeg === 'absorb'){
		for (var j = 1; j < gridHeight - 1; j++) { //iterate through rows
			for (var k = 1; k < gridWidth - 1; k++) { //iterate through columns
				var n = 0;
				var q = 0;
				if(theGrid[j][k] === 0){
					
					//top
					
					if (theGrid[j - 1][k - 1] !== 0) {  
						q = theGrid[j - 1][k - 1];
						n++;
					}; 
					
					if (theGrid[j - 1][k] !== 0 && (theGrid[j - 1][k] > q )) {  
						q = theGrid[j - 1][k];
						n++;
					}; 
					
					if (theGrid[j - 1][k + 1] !== 0 && (theGrid[j - 1][k + 1] > q )) {  
						q = theGrid[j - 1][k + 1];
						n++;
					}; 						


					//left
					
					if ((theGrid[j][k - 1] !== 0) && (theGrid[j][k - 1] > q )){
						q = theGrid[j][k - 1]; 
						n++;
					}
					
					//right
					
					if ((theGrid[j][k + 1] !== 0) && (theGrid[j][k + 1] > q )){ 
						q = theGrid[j][k + 1]; 
						n++;
					}
			
					// updating
				  
					if(n !== 0){
						if(theGrid[j - 1][k - 1] === 0) {mirrorGrid[j - 1][k - 1] = q; updated++}
						if(theGrid[j - 1][k] === 0) {mirrorGrid[j - 1][k] = q; updated++}
						if(theGrid[j - 1][k + 1] === 0) {mirrorGrid[j - 1][k + 1] = q; updated++}
						if(theGrid[j][k] === 0) {mirrorGrid[j][k] = q; updated++}
						if(theGrid[j][k - 1] === 0) {mirrorGrid[j][k - 1] = q; updated++}
						if(theGrid[j][k + 1] === 0) {mirrorGrid[j][k + 1] = q; updated++}							
				  }
			  }
			}
		}
		for (var j = 0; j < gridHeight; j++) { //iterate through rows
			for (var k = 0; k < gridWidth; k++) { //iterate through columns
				theGrid[j][k] = mirrorGrid[j][k];
			}
		if(updated === 0) isFinishedCA = true;
		}
	}
	else{
			for (var j = 0; j < gridHeight; j++) { //iterate through rows
				for (var k = 0; k < gridWidth; k++) { //iterate through columns
		
					var n = 0;
					var q = 0;
					if(theGrid[j][k] === 0){
						
						if (theGrid[(j - 1 + gridHeight)%gridHeight][(k - 1 + gridWidth)%gridWidth] !== 0) {  
								q = theGrid[(j - 1 + gridHeight)%gridHeight][(k - 1 + gridWidth)%gridWidth];
								n++;
							}; 

							if (theGrid[(j - 1 + gridHeight)%gridHeight][k] !== 0 && (theGrid[(j - 1 + gridHeight)%gridHeight][k] > q )) {  
								q = theGrid[(j - 1 + gridHeight)%gridHeight][k];
								n++;
							}; 
							
							if (theGrid[(j - 1 + gridHeight)%gridHeight][(k + 1 + gridWidth)%gridWidth] !== 0 && (theGrid[(j - 1 + gridHeight)%gridHeight][(k + 1 + gridWidth)%gridWidth] > q )) {  
								q = theGrid[(j - 1 + gridHeight)%gridHeight][(k + 1 + gridWidth)%gridWidth];
								n++;
							}; 						


							//left
							
							if ((theGrid[j][(k - 1 + gridWidth)%gridWidth] !== 0) && (theGrid[j][(k - 1 + gridWidth)%gridWidth] > q )){
								q = theGrid[j][(k - 1 + gridWidth)%gridWidth]; 
								n++;
							}
							
							//right
							
							if ((theGrid[j][(k + 1 + gridWidth)%gridWidth] !== 0) && (theGrid[j][(k + 1 + gridWidth)%gridWidth] > q )){ 
								q = theGrid[j][(k + 1 + gridWidth)%gridWidth]; 
								n++;
							}
												
							// updating
						  
							if(n !== 0){
								if(theGrid[(j - 1 + gridHeight)%gridHeight][(k - 1 + gridWidth)%gridWidth] === 0) {
									mirrorGrid[(j - 1 + gridHeight)%gridHeight][(k - 1 + gridWidth)%gridWidth] = q;
									updated++
								}
								if(theGrid[(j - 1 + gridHeight)%gridHeight][k] === 0) {
									mirrorGrid[(j - 1 + gridHeight)%gridHeight][k] = q;
									updated++;
								}
								if(theGrid[(j - 1 + gridHeight)%gridHeight][(k + 1 + gridWidth)%gridWidth] === 0) {
									mirrorGrid[(j - 1 + gridHeight)%gridHeight][(k + 1 + gridWidth)%gridWidth] = q; updated++
								}
								if(theGrid[j][k] === 0) {mirrorGrid[j][k] = q; updated++}
								if(theGrid[j][(k - 1 + gridWidth)%gridWidth] === 0) {
									mirrorGrid[j][(k - 1 + gridWidth)%gridWidth] = q;
									updated++
								}
								if(theGrid[j][(k + 1 + gridWidth)%gridWidth] === 0) {
									mirrorGrid[j][(k + 1 + gridWidth)%gridWidth] = q;
									updated++;
								}								
						  }	
				
					}

				}
			}
			for (var j = 0; j < gridHeight; j++) { //iterate through rows
				for (var k = 0; k < gridWidth; k++) { //iterate through columns
					theGrid[j][k] = mirrorGrid[j][k];
				}
			}
			if(updated === 0) isFinishedCA = true;			
	}		
}

function PentagonalneD(brzeg){
	var updated = 0;
	console.log("PentagonalneD");
	if(brzeg === 'absorb'){
		for (var j = 1; j < gridHeight - 1; j++) { //iterate through rows
			for (var k = 1; k < gridWidth - 1; k++) { //iterate through columns
				var n = 0;
				var q = 0;
				if(theGrid[j][k] === 0){

					//left
					
					if ((theGrid[j][k - 1] !== 0) && (theGrid[j][k - 1] > q )){
						q = theGrid[j][k - 1]; 
						n++;
					}
					
					//right
					
					if ((theGrid[j][k + 1] !== 0) && (theGrid[j][k + 1] > q )){ 
						q = theGrid[j][k + 1]; 
						n++;
					}
					
					//bottom 
					
					if ((theGrid[j + 1][k - 1] !== 0) && (theGrid[j + 1][k - 1] > q )){ 
						q = theGrid[j + 1][k - 1]; 
						n++;
					}
					
					if ((theGrid[j + 1][k] !== 0) && (theGrid[j + 1][k] > q )){ 
						q = theGrid[j + 1][k]; 
						n++;
					}
					
					if ((theGrid[j + 1][k + 1] !== 0) && (theGrid[j + 1][k + 1] > q )){ 
						q = theGrid[j + 1][k + 1]; 
						n++;
					}						
					// updating
				  
					if(n !== 0){
						if(theGrid[j][k] === 0) {mirrorGrid[j][k] = q; updated++}
						if(theGrid[j][k - 1] === 0) {mirrorGrid[j][k - 1] = q; updated++}
						if(theGrid[j][k + 1] === 0) {mirrorGrid[j][k + 1] = q; updated++}
						if(theGrid[j + 1][k - 1] === 0) {mirrorGrid[j + 1][k - 1] = q; updated++}	
						if(theGrid[j + 1][k] === 0) {mirrorGrid[j + 1][k] = q; updated++}
						if(theGrid[j + 1][k + 1] === 0) {mirrorGrid[j + 1][k + 1] = q; updated++}								
				  }
			  }
			}
		}
		for (var j = 0; j < gridHeight; j++) { //iterate through rows
			for (var k = 0; k < gridWidth; k++) { //iterate through columns
				theGrid[j][k] = mirrorGrid[j][k];
			}
		}
		if(updated === 0) isFinishedCA = true;
	}
	else{
			for (var j = 0; j < gridHeight; j++) { //iterate through rows
				for (var k = 0; k < gridWidth; k++) { //iterate through columns
		
					var n = 0;
					var q = 0;
					if(theGrid[j][k] === 0){

							//left
							
							if ((theGrid[j][(k - 1 + gridWidth)%gridWidth] !== 0) && (theGrid[j][(k - 1 + gridWidth)%gridWidth] > q )){
								q = theGrid[j][(k - 1 + gridWidth)%gridWidth]; 
								n++;
							}
							
							//right
							
							if ((theGrid[j][(k + 1 + gridWidth)%gridWidth] !== 0) && (theGrid[j][(k + 1 + gridWidth)%gridWidth] > q )){ 
								q = theGrid[j][(k + 1 + gridWidth)%gridWidth]; 
								n++;
							}
							
							//bottom 
							
							if ((theGrid[(j + 1 + gridHeight)%gridHeight][(k - 1 + gridWidth)%gridWidth] !== 0) &&
								(theGrid[(j + 1 + gridHeight)%gridHeight][(k - 1 + gridWidth)%gridWidth] > q )){ 
								q = theGrid[(j + 1 + gridHeight)%gridHeight][(k - 1 + gridWidth)%gridWidth]; 
								n++;
							}
							
							if ((theGrid[(j + 1 + gridHeight)%gridHeight][k] !== 0) && (theGrid[(j + 1 + gridHeight)%gridHeight][k] > q )){ 
								q = theGrid[(j + 1 + gridHeight)%gridHeight][k]; 
								n++;
							}
							
							if ((theGrid[(j + 1 + gridHeight)%gridHeight][(k + 1 + gridWidth)%gridWidth] !== 0) &&
								(theGrid[(j + 1 + gridHeight)%gridHeight][(k + 1 + gridWidth)%gridWidth] > q )){ 
								q = theGrid[(j + 1 + gridHeight)%gridHeight][(k + 1 + gridWidth)%gridWidth]; 
								n++;
							}						
							// updating
						  
							if(n !== 0){
								if(theGrid[j][k] === 0) {mirrorGrid[j][k] = q; updated++}
								if(theGrid[j][(k - 1 + gridWidth)%gridWidth] === 0) {
									mirrorGrid[j][(k - 1 + gridWidth)%gridWidth] = q;
									updated++
								}
								if(theGrid[j][(k + 1 + gridWidth)%gridWidth] === 0) {
									mirrorGrid[j][(k + 1 + gridWidth)%gridWidth] = q;
									updated++;
								}
								if(theGrid[(j + 1 + gridHeight)%gridHeight][(k - 1 + gridWidth)%gridWidth] === 0) {
									mirrorGrid[(j + 1 + gridHeight)%gridHeight][(k - 1 + gridWidth)%gridWidth] = q;
									updated++;
								}	
								if(theGrid[(j + 1 + gridHeight)%gridHeight][k] === 0) {
									mirrorGrid[(j + 1 + gridHeight)%gridHeight][k] = q;
									updated++;
								}
								if(theGrid[(j + 1 + gridHeight)%gridHeight][(k + 1 + gridWidth)%gridWidth] === 0) {
									mirrorGrid[(j + 1 + gridHeight)%gridHeight][(k + 1 + gridWidth)%gridWidth] = q; 
									updated++;
								}								
						  }	
				
					}

				}
			}
			for (var j = 0; j < gridHeight; j++) { //iterate through rows
				for (var k = 0; k < gridWidth; k++) { //iterate through columns
					theGrid[j][k] = mirrorGrid[j][k];
				}
			}	
			if(updated === 0) isFinishedCA = true;			
	}		
}
function HeksagonalneP(brzeg){
	var updated = 0;
	console.log("HeksagonalneP");
	if(brzeg === 'absorb'){
		for (var j = 1; j < gridHeight - 1; j++) { //iterate through rows
			for (var k = 1; k < gridWidth - 1; k++) { //iterate through columns
				var n = 0;
				var q = 0;
				if(theGrid[j][k] === 0){
					
					//top
					
					if (theGrid[j - 1][k - 1] !== 0) {  
						q = theGrid[j - 1][k - 1];
						n++;
					}; 
					
					if (theGrid[j - 1][k] !== 0 && (theGrid[j - 1][k] > q )) {  
						q = theGrid[j - 1][k];
						n++;
					}; 

					//left
					
					if ((theGrid[j][k - 1] !== 0) && (theGrid[j][k - 1] > q )){
						q = theGrid[j][k - 1]; 
						n++;
					}
					
					//right
					
					if ((theGrid[j][k + 1] !== 0) && (theGrid[j][k + 1] > q )){ 
						q = theGrid[j][k + 1]; 
						n++;
					}
					
					//bottom 
					
					if ((theGrid[j + 1][k] !== 0) && (theGrid[j + 1][k] > q )){ 
						q = theGrid[j + 1][k]; 
						n++;
					}
					
					if ((theGrid[j + 1][k + 1] !== 0) && (theGrid[j + 1][k + 1] > q )){ 
						q = theGrid[j + 1][k + 1]; 
						n++;
					}						
					// updating
				  
					if(n !== 0){
						if(theGrid[j - 1][k - 1] === 0) {mirrorGrid[j - 1][k - 1] = q; updated++}
						if(theGrid[j - 1][k] === 0) {mirrorGrid[j - 1][k] = q; updated++}
						if(theGrid[j][k] === 0) {mirrorGrid[j][k] = q; updated++}
						if(theGrid[j][k - 1] === 0) {mirrorGrid[j][k - 1] = q; updated++}
						if(theGrid[j][k + 1] === 0) {mirrorGrid[j][k + 1] = q; updated++}
						if(theGrid[j + 1][k] === 0) {mirrorGrid[j + 1][k] = q; updated++}
						if(theGrid[j + 1][k + 1] === 0) {mirrorGrid[j + 1][k + 1] = q; updated++}	
				  }
			  }
			}
		}
		for (var j = 0; j < gridHeight; j++) { //iterate through rows
			for (var k = 0; k < gridWidth; k++) { //iterate through columns
				theGrid[j][k] = mirrorGrid[j][k];
			}
		}
		if(updated === 0) isFinishedCA = true;
	}
	else{
			for (var j = 0; j < gridHeight; j++) { //iterate through rows
				for (var k = 0; k < gridWidth; k++) { //iterate through columns
		
					var n = 0;
					var q = 0;
					if(theGrid[j][k] === 0){
						
						if (theGrid[(j - 1 + gridHeight)%gridHeight][(k - 1 + gridWidth)%gridWidth] !== 0) {  
								q = theGrid[(j - 1 + gridHeight)%gridHeight][(k - 1 + gridWidth)%gridWidth];
								n++;
							}; 

							if (theGrid[(j - 1 + gridHeight)%gridHeight][k] !== 0 && (theGrid[(j - 1 + gridHeight)%gridHeight][k] > q )) {  
								q = theGrid[(j - 1 + gridHeight)%gridHeight][k];
								n++;
							}; 					

							//left
							
							if ((theGrid[j][(k - 1 + gridWidth)%gridWidth] !== 0) && (theGrid[j][(k - 1 + gridWidth)%gridWidth] > q )){
								q = theGrid[j][(k - 1 + gridWidth)%gridWidth]; 
								n++;
							}
							
							//right
							
							if ((theGrid[j][(k + 1 + gridWidth)%gridWidth] !== 0) && (theGrid[j][(k + 1 + gridWidth)%gridWidth] > q )){ 
								q = theGrid[j][(k + 1 + gridWidth)%gridWidth]; 
								n++;
							}
							
							//bottom 
							
							if ((theGrid[(j + 1 + gridHeight)%gridHeight][k] !== 0) && (theGrid[(j + 1 + gridHeight)%gridHeight][k] > q )){ 
								q = theGrid[(j + 1 + gridHeight)%gridHeight][k]; 
								n++;
							}
							
							if ((theGrid[(j + 1 + gridHeight)%gridHeight][(k + 1 + gridWidth)%gridWidth] !== 0) &&
								(theGrid[(j + 1 + gridHeight)%gridHeight][(k + 1 + gridWidth)%gridWidth] > q )){ 
								q = theGrid[(j + 1 + gridHeight)%gridHeight][(k + 1 + gridWidth)%gridWidth]; 
								n++;
							}						
							// updating
						  
							if(n !== 0){
								if(theGrid[(j - 1 + gridHeight)%gridHeight][(k - 1 + gridWidth)%gridWidth] === 0) {
									mirrorGrid[(j - 1 + gridHeight)%gridHeight][(k - 1 + gridWidth)%gridWidth] = q;
									updated++
								}
								if(theGrid[(j - 1 + gridHeight)%gridHeight][k] === 0) {
									mirrorGrid[(j - 1 + gridHeight)%gridHeight][k] = q;
									updated++;
								}
								if(theGrid[j][k] === 0) {mirrorGrid[j][k] = q; updated++}
								if(theGrid[j][(k - 1 + gridWidth)%gridWidth] === 0) {
									mirrorGrid[j][(k - 1 + gridWidth)%gridWidth] = q;
									updated++
								}
								if(theGrid[j][(k + 1 + gridWidth)%gridWidth] === 0) {
									mirrorGrid[j][(k + 1 + gridWidth)%gridWidth] = q;
									updated++;
								}
								if(theGrid[(j + 1 + gridHeight)%gridHeight][k] === 0) {
									mirrorGrid[(j + 1 + gridHeight)%gridHeight][k] = q;
									updated++;
								}
								if(theGrid[(j + 1 + gridHeight)%gridHeight][(k + 1 + gridWidth)%gridWidth] === 0) {
									mirrorGrid[(j + 1 + gridHeight)%gridHeight][(k + 1 + gridWidth)%gridWidth] = q; 
									updated++;
								}								
						  }	
				
					}

				}
			}
			for (var j = 0; j < gridHeight; j++) { //iterate through rows
				for (var k = 0; k < gridWidth; k++) { //iterate through columns
					theGrid[j][k] = mirrorGrid[j][k];
				}
			}	
			if(updated === 0) isFinishedCA = true;			
	}
	
}
function HeksagonalneL(brzeg){
	var updated = 0;
	console.log("HeksagonalneL");
	if(brzeg === 'absorb'){
		for (var j = 1; j < gridHeight - 1; j++) { //iterate through rows
			for (var k = 1; k < gridWidth - 1; k++) { //iterate through columns
				var n = 0;
				var q = 0;
				if(theGrid[j][k] === 0){
					
					//top						
					
					if (theGrid[j - 1][k] !== 0 && (theGrid[j - 1][k] > q )) {  
						q = theGrid[j - 1][k];
						n++;
					}; 
					
					if (theGrid[j - 1][k + 1] !== 0 && (theGrid[j - 1][k + 1] > q )) {  
						q = theGrid[j - 1][k + 1];
						n++;
					}; 						


					//left
					
					if ((theGrid[j][k - 1] !== 0) && (theGrid[j][k - 1] > q )){
						q = theGrid[j][k - 1]; 
						n++;
					}
					
					//right
					
					if ((theGrid[j][k + 1] !== 0) && (theGrid[j][k + 1] > q )){ 
						q = theGrid[j][k + 1]; 
						n++;
					}
					
					//bottom 
					
					if ((theGrid[j + 1][k - 1] !== 0) && (theGrid[j + 1][k - 1] > q )){ 
						q = theGrid[j + 1][k - 1]; 
						n++;
					}
					
					if ((theGrid[j + 1][k] !== 0) && (theGrid[j + 1][k] > q )){ 
						q = theGrid[j + 1][k]; 
						n++;
					}
					
					// updating
				  
					if(n !== 0){
						if(theGrid[j - 1][k] === 0) {mirrorGrid[j - 1][k] = q; updated++}
						if(theGrid[j - 1][k + 1] === 0) {mirrorGrid[j - 1][k + 1] = q; updated++}
						if(theGrid[j][k] === 0) {mirrorGrid[j][k] = q; updated++}
						if(theGrid[j][k - 1] === 0) {mirrorGrid[j][k - 1] = q; updated++}
						if(theGrid[j][k + 1] === 0) {mirrorGrid[j][k + 1] = q; updated++}
						if(theGrid[j + 1][k - 1] === 0) {mirrorGrid[j + 1][k - 1] = q; updated++}	
						if(theGrid[j + 1][k] === 0) {mirrorGrid[j + 1][k] = q; updated++}							
				  }
			  }
			}
		}
		for (var j = 0; j < gridHeight; j++) { //iterate through rows
			for (var k = 0; k < gridWidth; k++) { //iterate through columns
				theGrid[j][k] = mirrorGrid[j][k];
			}
		}
		if(updated === 0) isFinishedCA = true;
	}
	else{
			for (var j = 0; j < gridHeight; j++) { //iterate through rows
				for (var k = 0; k < gridWidth; k++) { //iterate through columns
		
					var n = 0;
					var q = 0;
					if(theGrid[j][k] === 0){
						
							//top
							if (theGrid[(j - 1 + gridHeight)%gridHeight][k] !== 0 && (theGrid[(j - 1 + gridHeight)%gridHeight][k] > q )) {  
								q = theGrid[(j - 1 + gridHeight)%gridHeight][k];
								n++;
							}; 
							
							if (theGrid[(j - 1 + gridHeight)%gridHeight][(k + 1 + gridWidth)%gridWidth] !== 0 && (theGrid[(j - 1 + gridHeight)%gridHeight][(k + 1 + gridWidth)%gridWidth] > q )) {  
								q = theGrid[(j - 1 + gridHeight)%gridHeight][(k + 1 + gridWidth)%gridWidth];
								n++;
							}; 						


							//left
							
							if ((theGrid[j][(k - 1 + gridWidth)%gridWidth] !== 0) && (theGrid[j][(k - 1 + gridWidth)%gridWidth] > q )){
								q = theGrid[j][(k - 1 + gridWidth)%gridWidth]; 
								n++;
							}
							
							//right
							
							if ((theGrid[j][(k + 1 + gridWidth)%gridWidth] !== 0) && (theGrid[j][(k + 1 + gridWidth)%gridWidth] > q )){ 
								q = theGrid[j][(k + 1 + gridWidth)%gridWidth]; 
								n++;
							}
							
							//bottom 
							
							if ((theGrid[(j + 1 + gridHeight)%gridHeight][(k - 1 + gridWidth)%gridWidth] !== 0) &&
								(theGrid[(j + 1 + gridHeight)%gridHeight][(k - 1 + gridWidth)%gridWidth] > q )){ 
								q = theGrid[(j + 1 + gridHeight)%gridHeight][(k - 1 + gridWidth)%gridWidth]; 
								n++;
							}
							
							if ((theGrid[(j + 1 + gridHeight)%gridHeight][k] !== 0) && (theGrid[(j + 1 + gridHeight)%gridHeight][k] > q )){ 
								q = theGrid[(j + 1 + gridHeight)%gridHeight][k]; 
								n++;
							}
												
							// updating
						  
							if(n !== 0){
								if(theGrid[(j - 1 + gridHeight)%gridHeight][k] === 0) {
									mirrorGrid[(j - 1 + gridHeight)%gridHeight][k] = q;
									updated++;
								}
								if(theGrid[(j - 1 + gridHeight)%gridHeight][(k + 1 + gridWidth)%gridWidth] === 0) {
									mirrorGrid[(j - 1 + gridHeight)%gridHeight][(k + 1 + gridWidth)%gridWidth] = q; updated++
								}
								if(theGrid[j][k] === 0) {mirrorGrid[j][k] = q; updated++}
								if(theGrid[j][(k - 1 + gridWidth)%gridWidth] === 0) {
									mirrorGrid[j][(k - 1 + gridWidth)%gridWidth] = q;
									updated++
								}
								if(theGrid[j][(k + 1 + gridWidth)%gridWidth] === 0) {
									mirrorGrid[j][(k + 1 + gridWidth)%gridWidth] = q;
									updated++;
								}
								if(theGrid[(j + 1 + gridHeight)%gridHeight][(k - 1 + gridWidth)%gridWidth] === 0) {
									mirrorGrid[(j + 1 + gridHeight)%gridHeight][(k - 1 + gridWidth)%gridWidth] = q;
									updated++;
								}	
								if(theGrid[(j + 1 + gridHeight)%gridHeight][k] === 0) {
									mirrorGrid[(j + 1 + gridHeight)%gridHeight][k] = q;
									updated++;
								}								
						  }	
				
					}

				}
			}
			for (var j = 0; j < gridHeight; j++) { //iterate through rows
				for (var k = 0; k < gridWidth; k++) { //iterate through columns
					theGrid[j][k] = mirrorGrid[j][k];
				}
			}
			if(updated === 0) isFinishedCA = true;			
	}
	
}
