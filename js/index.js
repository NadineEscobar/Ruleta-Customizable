const ruleta = document.getElementById("ruleta");
let ganador = "";
const root = document.documentElement;
let sorteando = false;
const ganadorTexto = document.getElementById("ganadorTexto");
let animacionCarga;
const modal = document.querySelector("dialog");
const formContainer = document.getElementById("formContainer");
const porcentaje = document.getElementById("porcentaje");
const botonAceptar = document.getElementById("aceptar");

let opcionesContainer;

document.getElementById("sortear").addEventListener("click", ()=> sortear());

const uno = {
    nombre: "Uno",
    probabilidad: 25
}

const dos = {
    nombre: "Dos",
    probabilidad: 25
}

const tres = {
    nombre: "Tres",
    probabilidad: 10
}

const cuatro = {
    nombre: "Cuatro",
    probabilidad: 40
}

let conceptos= [uno, dos, tres, cuatro];

const colores = ["#126253", "#134926", "#C78446", "#5D9B9B", "#8673A1", "#100000", "#4C9141", "#8E402A", "#231A24", "#424632", "#1F3438", 
    "#025669", "#008F39", "#763C28"];


function ajustarRuleta() {
	if(opcionesContainer) ruleta.removeChild(opcionesContainer);
    opcionesContainer = document.createElement("div");
    opcionesContainer.id = "opcionesContainer";
    ruleta.appendChild(opcionesContainer);
    let pAcumulada = 0;
    conceptos.forEach((concepto, i) =>{
        //Crear los triangulos de colores
        const opcionElement = document.createElement("div");
        opcionElement.classList.add("opcion");
        opcionesContainer.appendChild(opcionElement);
        opcionElement.style = `background-color: ${colores[i]};
        transform:rotate(${probabilidadAGrados(pAcumulada)}deg);
        ${getPosicionParaProbabilidad(concepto.probabilidad)}`

        pAcumulada += concepto.probabilidad
        const separador = document.createElement("div");
        separador.classList.add("separador");
        separador.style = `
        transform:rotate(${probabilidadAGrados(pAcumulada)}deg);`

        opcionesContainer.appendChild(separador);
		opcionElement.addEventListener("click", ()=>{
			modal.showModal();
			Array.from(formContainer.children).forEach(element =>{
				formContainer.removeChild(element);
			})
			conceptos.forEach(concepto => {
				agregarConfiguracionProbabilidad(concepto);
			});
		});
    });
};

function agregarConfiguracionProbabilidad(concepto = undefined){
	const opcionContainer = document.createElement("div");
	const opcionInput = document.createElement("input");
	opcionInput.type = "number";
	
	opcionInput.addEventListener("change", () => verificarValidezFormulario());
	const borrar = document.createElement("button");
	borrar.textContent = "X"
	if(concepto){
		const opcionLabel = document.createElement("label");
		opcionLabel.textContent = concepto.nombre;
		opcionContainer.appendChild(opcionLabel);
		opcionInput.value = concepto.probabilidad;
	} else{
		const nombreInput = document.createElement("input");
		opcionContainer.appendChild(nombreInput);
		opcionInput.value = 0;
	}
	opcionContainer.appendChild(opcionInput);
	opcionContainer.appendChild(borrar);
	formContainer.appendChild(opcionContainer);
	borrar.addEventListener("click", (event) => {
		formContainer.removeChild(event.target.parentNode);
		verificarValidezFormulario();
	})
}


function getPosicionParaProbabilidad(probabilidad){
	if(probabilidad === 100){
		return ''
	}
	if(probabilidad >= 87.5){
		const x5 = Math.tan(probabilidadARadianes(probabilidad))*50+50;
		return `clip-path: polygon(50% 0%, 100% 0, 100% 100%, 0 100%, 0 0, ${x5}% 0, 50% 50%)`
	}
	if(probabilidad >= 75){
		const y5 = 100 - (Math.tan(probabilidadARadianes(probabilidad-75))*50+50);
		return `clip-path: polygon(50% 0%, 100% 0, 100% 100%, 0 100%, 0% ${y5}%, 50% 50%)`
	}
	if(probabilidad >= 62.5){
		const y5 = 100 - (0.5 - (0.5/ Math.tan(probabilidadARadianes(probabilidad))))*100;
		return `clip-path: polygon(50% 0%, 100% 0, 100% 100%, 0 100%, 0% ${y5}%, 50% 50%)`
	}
	if(probabilidad >= 50){
		const x4 = 100 - (Math.tan(probabilidadARadianes(probabilidad))*50+50);
		return `clip-path: polygon(50% 0, 100% 0, 100% 100%, ${x4}% 100%, 50% 50%)`
	}
	if(probabilidad >= 37.5){
		const x4 = 100 - (Math.tan(probabilidadARadianes(probabilidad))*50+50);
		return `clip-path: polygon(50% 0, 100% 0, 100% 100%, ${x4}% 100%, 50% 50%)`
	}
	if(probabilidad >= 25){
		const y3 = Math.tan(probabilidadARadianes(probabilidad-25))*50+50;
		return `clip-path: polygon(50% 0, 100% 0, 100% ${y3}%, 50% 50%)`
	}
	if(probabilidad >= 12.5){
		const y3 = (0.5 - (0.5/ Math.tan(probabilidadARadianes(probabilidad))))*100;
		return `clip-path: polygon(50% 0, 100% 0, 100% ${y3}%, 50% 50%)`
	}
	if(probabilidad >= 0){
		const x2 = Math.tan(probabilidadARadianes(probabilidad))*50 + 50;
		return `clip-path: polygon(50% 0, ${x2}% 0, 50% 50%)`
	}
}

function sortear(){
	if(sorteando) return; 
	sorteando = true;
	ganadorTexto.textContent = ".";
	animacionCarga = setInterval( ()=>{
		switch (ganadorTexto.textContent){
			case ".":
				ganadorTexto.textContent = "..";
				break;
			case "..":
			  ganadorTexto.textContent = "...";
			  break;
			default:
			  ganadorTexto.textContent = ".";
			  break;
		}
	} ,  500)
	nSorteo = Math.random();
	let pAcumulada = 0;
	ruleta.classList.toggle("girar", true);
	conceptos.forEach(concepto =>{
		if(nSorteo*100 >= pAcumulada && nSorteo*100 < pAcumulada+concepto.probabilidad){
			ganador = concepto.nombre;
			//console.log("Ganador", nSorteo*100, concepto.nombre, "porque esta entre", pAcumulada, "y", pAcumulada+concepto.probabilidad)
		}
		pAcumulada += concepto.probabilidad;
	})
	const giroRuleta = 10*360 + (1-nSorteo) * 360;
	root.style.setProperty("--giroRuleta", giroRuleta+"deg")
}

ruleta.addEventListener("animationend", ()=>{
	ruleta.style.transform = "rotate(" + getCurrentRotation(ruleta) +"deg)"
	sorteando = false;
	ruleta.classList.toggle("girar", false);
	ganadorTexto.textContent = ganador;
	clearInterval(animacionCarga);
})

document.getElementById("cancelar").addEventListener("click", () => modal.close());
document.getElementById("aceptar").addEventListener("click", () =>{
	conceptos = [];
	Array.from(formContainer.children).forEach(opcion =>{
		const nuevaProbabilidad = {
		 nombre : opcion.children[0].tagName === "LABEL" ? opcion.children[0].textContent : opcion.children[0].value,
		 probabilidad: parseFloat(opcion.children[1].value)
		}
		conceptos.push(nuevaProbabilidad);
	})
	modal.close();
	ajustarRuleta();

});

document.getElementById("agregar").addEventListener("click", () =>{
	agregarConfiguracionProbabilidad();
});

function verificarValidezFormulario(){
	let suma = 0;
	Array.from(formContainer.children).forEach(opcion =>{
		suma += parseFloat(opcion.children[1].value)
		});
		porcentaje.textContent = suma;
		if(suma === 100){
			botonAceptar.disabled = false;
		} else {
			botonAceptar.disabled = true;
		}
}

ajustarRuleta();