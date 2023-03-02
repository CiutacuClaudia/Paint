const foaie = document.getElementById('svg')
const butoane = document.querySelectorAll('.buton')
const butonDownload = document.getElementById('buto')
const cursor = document.querySelector('#cursor')
const colorPicker = document.querySelector('#culoare')
const rangeGrosime = document.getElementById('grosime')
var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
var butonSelectat
var elementSelectat = null
let deseneazaBool = false
let coordonate_actuale, coordonate_initiale
let xStart, yStart
var numarObiecte = localStorage.length

var verificareTerminareDesenare = false
var svgArray = []

//functia care citeste din localStorage obiectele pentru a le afisa cand dam refresh la pagina
function reload() {
	const obiect = JSON.parse(localStorage.getItem('obj'))
	const backgroundColor = JSON.parse(localStorage.getItem('backgroundColor'))
	foaie.innerHTML = obiect
	foaie.style.background = backgroundColor
}
reload()

//functia care preia coordonatele svg-ului
function preluareCoordonateSVG(foaie, e) {
	var coordonateSVG = foaie.getBoundingClientRect()
	return {
		x: e.clientX - coordonateSVG.x,
		y: e.clientY - coordonateSVG.y
	}
}

//functia de desenare elipsa
function desenareElipsa(e) {
	var elipsa = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse')
	let rx = coordonate_actuale.x - coordonate_initiale.x >= 0 ? coordonate_actuale.x - coordonate_initiale.x : coordonate_initiale.x - coordonate_actuale.x
	let ry = coordonate_actuale.y - coordonate_initiale.y >= 0 ? coordonate_actuale.y - coordonate_initiale.y : coordonate_initiale.y - coordonate_actuale.y
	var grosimeLinie = rangeGrosime.value
	var culoareSelectata = colorPicker.value
	elipsa.setAttribute('stroke-width', grosimeLinie / 10)
	elipsa.setAttribute('fill', 'none')
	elipsa.setAttribute('stroke', culoareSelectata)
	elipsa.setAttribute('cx', coordonate_initiale.x + (coordonate_actuale.x - coordonate_initiale.x) / 2)
	elipsa.setAttribute('cy', coordonate_initiale.y + (coordonate_actuale.y - coordonate_initiale.y) / 2)
	elipsa.setAttribute('rx', rx / 2)
	elipsa.setAttribute('ry', ry / 2)
	//adaugarea elipsei desenate in cadrul svg-ului
	svg.appendChild(elipsa)
	//sa nu se deseneze cercul incontinuu
	if (svg.childElementCount > 1) {
		svg.removeChild(svg.firstChild)
	}
}

//functie desenare linie
function desenareLinie(e) {
	var linie = document.createElementNS('http://www.w3.org/2000/svg', 'line')
	let x1 = coordonate_initiale.x
	let y1 = coordonate_initiale.y
	let x2 = coordonate_actuale.x
	let y2 = coordonate_actuale.y
	var culoareSelectata = colorPicker.value
	var grosimeLinie = rangeGrosime.value
	linie.setAttribute('stroke', culoareSelectata)
	linie.setAttribute('stroke-linejoin', 'round')
	linie.setAttribute('stroke-linecap', 'round')
	linie.setAttribute('stroke-width', grosimeLinie / 10)
	if (x1 < x2) {
		linie.setAttribute('x1', x1)
		linie.setAttribute('x2', x2)
		linie.setAttribute('y1', y1)
		linie.setAttribute('y2', y2)
	} else {
		linie.setAttribute('x1', x2)
		linie.setAttribute('x2', x1)
		linie.setAttribute('y1', y2)
		linie.setAttribute('y2', y1)
	}
	svg.appendChild(linie)
	if (svg.childElementCount > 1) {
		svg.removeChild(svg.firstChild)
	}
}

//functie desenare dreptunghi
function desenareDreptunghi(e) {
	var dreptunghi = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
	let x = Math.min(coordonate_initiale.x, coordonate_actuale.x)
	let y = Math.min(coordonate_initiale.y, coordonate_actuale.y)
	let width = coordonate_actuale.x - coordonate_initiale.x >= 0 ? coordonate_actuale.x - coordonate_initiale.x : coordonate_initiale.x - coordonate_actuale.x
	let height = coordonate_actuale.y - coordonate_initiale.y >= 0 ? coordonate_actuale.y - coordonate_initiale.y : coordonate_initiale.y - coordonate_actuale.y
	var culoareSelectata = colorPicker.value
	var grosimeLinie = rangeGrosime.value
	dreptunghi.setAttribute('fill', 'none')
	dreptunghi.setAttribute('stroke', culoareSelectata)
	dreptunghi.setAttribute('x', x)
	dreptunghi.setAttribute('y', y)
	dreptunghi.setAttribute('height', height)
	dreptunghi.setAttribute('width', width)
	dreptunghi.setAttribute('stroke-width', grosimeLinie / 10)
	svg.appendChild(dreptunghi)
	if (svg.childElementCount > 1) {
		svg.removeChild(svg.firstChild)
	}
}

//functia prin intermediul careia se incepe desenarea
function incepereDesen(e) {
	deseneazaBool = true
	var culoareSelectata = colorPicker.value
	var grosime = rangeGrosime.value
	coordonate_initiale = preluareCoordonateSVG(foaie, e)
	//pe butonul de 'mousemove' utilizatorul deseneaza
	//pe butonul de 'mouseup' utilizatorul termina de desenat
	foaie.addEventListener('mousemove', deseneaza)
	foaie.addEventListener('mouseup', finalizareDesen)
	// verificarea butonului selectat
	switch (butonSelectat) {
		//  if (butonSelectat == 'fill') elementSelectat.setAttribute('fill', culoareSelectata)
		case 'trash':
			// for (var i = 0; i < foaie.childNodes.length; i++) {
			// 	if (foaie.childNodes[i].localName === 'svg' && foaie.childNodes[i].childNodes.length == 0) {
			// 		foaie.remove(foaie.childNodes[i])
			// 	}
			// }
			elementSelectat = e.target
			var aux = false
			for (var i = 0; i < foaie.childNodes.length; i++) {
				if (foaie.childNodes[i] == elementSelectat) {
					aux = true
				}
			}
			if (aux == true) {
				if (elementSelectat.localName === 'rect' || elementSelectat.localName === 'line' || elementSelectat.localName === 'ellipse') foaie.removeChild(elementSelectat)
			} else {
				foaie.childNodes[0].removeChild(elementSelectat)
			}

			// if (foaie.childNodes.length == 1) {
			// } else {
			// 	console.log(butonSelectat)
			// 	//verificarea obiectului selectat
			// }
			break
		case 'hand':
			console.log(butonSelectat)
			elementSelectat = e.target
			//verificarea obiectului selectat si a coordonatelor acestora
			if (elementSelectat.localName === 'rect') {
				xStart = parseInt(elementSelectat.getAttribute('x'))
				yStart = parseInt(elementSelectat.getAttribute('y'))
			} else if (elementSelectat.localName === 'ellipse') {
				xStart = parseInt(elementSelectat.getAttribute('cx'))
				yStart = parseInt(elementSelectat.getAttribute('cy'))
			} else if (elementSelectat.localName === 'line') {
				xStart1 = parseInt(elementSelectat.getAttribute('x1'))
				yStart1 = parseInt(elementSelectat.getAttribute('y1'))
				xStart2 = parseInt(elementSelectat.getAttribute('x2'))
				yStart2 = parseInt(elementSelectat.getAttribute('y2'))
				elementSelectat.setAttribute('stroke', culoareSelectata)
			}
			// schimbare culoare contur
			if (elementSelectat.getAttribute('fill') == 'none') {
				elementSelectat.setAttribute('stroke', culoareSelectata)
				//schimbare culoare interior
			} else {
				elementSelectat.setAttribute('fill', culoareSelectata)
			}
			elementSelectat.setAttribute('stroke-width', grosime / 10)
			break
		case 'fill':
			elementSelectat = e.target
			elementSelectat.setAttribute('fill', culoareSelectata)
			elementSelectat.setAttribute('stroke', culoareSelectata)
			// schimbare culoare background
			if (elementSelectat.localName == 'svg') {
				elementSelectat.style.background = culoareSelectata
			}
			break
	}
}

//pe evenimentul de 'mousedown' utilizatorul incepe desenarea
foaie.addEventListener('mousedown', incepereDesen)

function deseneaza(e) {
	if (!deseneazaBool) return
	coordonate_actuale = preluareCoordonateSVG(foaie, e)
	//verificarea butonului selectat si desenarea obiectului aferent butonului
	switch (butonSelectat) {
		case 'ellipse':
			desenareElipsa(e)
			break
		case 'line':
			desenareLinie(e)
			break
		case 'rect':
			desenareDreptunghi(e)
			break
		// functia de mutare a obiectelor
		case 'hand':
			if (elementSelectat.localName === 'rect') {
				elementSelectat.setAttribute('x', xStart + coordonate_actuale.x - coordonate_initiale.x)
				elementSelectat.setAttribute('y', yStart + coordonate_actuale.y - coordonate_initiale.y)
			} else if (elementSelectat.localName === 'line') {
				elementSelectat.setAttributeNS(null, 'x1', xStart1 + coordonate_actuale.x - coordonate_initiale.x)
				elementSelectat.setAttributeNS(null, 'y1', yStart1 + coordonate_actuale.y - coordonate_initiale.y)
				elementSelectat.setAttributeNS(null, 'x2', xStart2 + coordonate_actuale.x - coordonate_initiale.x)
				elementSelectat.setAttributeNS(null, 'y2', yStart2 + coordonate_actuale.y - coordonate_initiale.y)
			} else if (elementSelectat.localName === 'ellipse') {
				elementSelectat.setAttributeNS(null, 'cx', xStart + coordonate_actuale.x - coordonate_initiale.x)
				elementSelectat.setAttributeNS(null, 'cy', yStart + coordonate_actuale.y - coordonate_initiale.y)
			}
	}
	foaie.appendChild(svg)
}

function finalizareDesen(e) {
	deseneazaBool = false
	//de fiecare data cand desenam un obiect, sa nu se stearga precedentul
	if (svg.firstChild !== null) foaie.appendChild(svg.firstChild)
	foaie.removeEventListener('mousemove', deseneaza)
	foaie.removeEventListener('mouseup', finalizareDesen)
	if (typeof Storage !== 'undefined') {
		var svgText = foaie.innerHTML
		//setare cheie+valoare pentru obiectele din localStorage
		localStorage.setItem('obj', JSON.stringify(svgText))
		localStorage.setItem('backgroundColor', JSON.stringify(foaie.style.background))
	}
	//deep copy a foii
	svgArray.push(foaie.cloneNode(true))
	verificareTerminareDesenare = true
}

//atribuire evenimentul de 'click' fiecarui buton
butoane.forEach(btn => {
	btn.addEventListener('click', () => {
		butonSelectat = btn.id
	})
})

function savePNG() {
	//transformarea svg-ului intr-un obiect de tip Blob
	const data = new XMLSerializer().serializeToString(foaie)
	const svgBlob = new Blob([data], {
		type: 'image/svg+xml;charset=utf-8'
	})

	// convertirea obiectului de tip Blob la un obiect de tip Url
	const url = URL.createObjectURL(svgBlob)

	//crearea unei imagini
	const img = new Image()
	img.addEventListener('load', () => {
		const canvas = document.createElement('canvas')
		canvas.width = 1000
		canvas.height = 600
		const context = canvas.getContext('2d')
		context.drawImage(img, 0, 0, canvas.width, canvas.height)
		//crearea unui link temporar
		const a = document.createElement('a')
		a.download = 'image.png'
		document.body.appendChild(a)
		a.href = canvas.toDataURL()
		a.click()
		a.remove()
	})
	img.src = url
}

//functie de curatare canvas
function clearCanvas() {
	//stergerea obiectelor vizibile
	for (let i = 0; i < foaie.childNodes.length; i++) {
		foaie.removeChild(foaie.childNodes[i])
		i--
	}

	//stergerea obiectelor si din localStorage
	var dimensiuneLocalStorage = localStorage.length
	if (dimensiuneLocalStorage > 0) {
		localStorage.removeItem('obj')
		localStorage.removeItem('backgroundColor')
	}
	numarObiecte = 0
	foaie.style.background = 'white'
}

//functie de salvare ca SVG
function saveSVG() {
	var serializer = new XMLSerializer()
	var source = serializer.serializeToString(foaie)

	// transformare svg la o schema de tip uri
	var url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source)

	// setarea url-ului la link-ul de descarcare
	document.getElementById('downloadLink').href = url
}
saveSVG()

function undo() {
	if (verificareTerminareDesenare == true && svgArray.length != 1) {
		svgArray.pop()
		verificareTerminareDesenare = false
	}
	while (foaie.lastChild != null) {
		foaie.removeChild(foaie.lastChild)
	}
	if (svgArray.length > 0) foaie.appendChild(svgArray.pop())

	var svgText = foaie.innerHTML
	localStorage.setItem('obj', JSON.stringify(svgText))
}
