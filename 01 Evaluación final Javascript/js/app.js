
/*
  * app.js
	* Script javascript Calculadora
	* Curso Javascript - Next U
	*
*/

/*
	Objeto Calculadora.
	Contiene todo el código propio de la funcionalidad de la Calculadora
*/

var Calculadora = (function(){

	/*************************************************************************
	 * Declaración de funciones
	 * Bloques de código que serán ejecutados por los métodos
	 * especificados en el return. 
	**************************************************************************/

	/**
	 * Función mousePressDown
	 * Se efecuta a causa del evento de hacer clic en algún botón de la calculadora
	 * Reduce tamaño de la tecla para simular que fue presionada
	 * Ejecuta la función accionTecla, esta reconoce la tecla y realiza el proceso
	   correspondiente
	 */
	var mousePressDown = function(event){
		//console.log(event.path[0].id)
		var reducirTecla = document.getElementById(event.path[0].id)
		reducirTecla.style.padding = "1px"
		accionTecla(event.path[0].id)
	};//Cierre mousePressDown

	/**
	 * Dunción mousePressUp
	 * Se ejecuta a causa del evento de soltar el clic sobre un botón de la calculadora
	 * Regresa a la normalidad el tamaño del botón
	 */
	var mousePressUp = function(event){
		//console.log('Tecla soltada');
		var reducirTecla = document.getElementById(event.path[0].id)
		reducirTecla.style.padding = "0px"
	};//Cierre mousePressUp

	/**
	 * Función acciónTecla
	 * Función ejecutada por la acción de hacer clic en un botón de la calculadora
	 * a través de la función mousePressDown.
	 * Toma el id de la tecla para realizar la acción correspondiente, tanto de 
	 * número como de operación aritmetica.
	 * 
	 * Esta función contiene toda las operaciones lógicas de funcionamiento de la
	 * calculadora.
	 */
	var accionTecla = function(idTecla){

		//Obtiene valor presente en pantalla
		var pantallaCalcDom = document.getElementById('display')
		var pantallaCalc = pantallaCalcDom.innerText

		//Limita el número que se escribe en la calculadora a 8 dígitos
		var limitarLongitud = function(){
			pantallaCalcDom.innerText = pantallaCalcDom.innerText.substring(0,8)
			
		}

		//Limita el numero resultado de cualquier operación a 8 dígitos y establece rangos
		//de operación de la calculadora.
		var igualLimitarLongitud = function(){
			if (pantallaCalcDom.innerText < 0.000001 && pantallaCalcDom.innerText > 0) {pantallaCalcDom.innerText = "0"}
			if (pantallaCalcDom.innerText > 99999999 || pantallaCalcDom.innerText < -99999999) {pantallaCalcDom.innerText = "ERROR..."}
			pantallaCalcDom.innerText = pantallaCalcDom.innerText.substring(0,8)			
		}

		//almacena en el sessionStorage el primer número y operación digitados
		//Deja pantalla en blanco a espera del segundo número
		var definirOperacion = function(operacionAritmetica){
			self.operadores = JSON.parse(sessionStorage.getItem('operadores'))
			self.operadores.operador1 = pantallaCalc
			self.operadores.operando = operacionAritmetica
			self.operadores.operador2 = ""
			sessionStorage.setItem('operadores',JSON.stringify(self.operadores))
			pantallaCalcDom.innerText = ""
		}

		//SwitchCas que de acuerdo a la tecla presionada en el evento clic define la acción a realizar
		switch (idTecla) {

			case "0":
				if (!(pantallaCalc == "0")){
					pantallaCalcDom.innerText += "0"
					limitarLongitud()
				}
				break;

			case "punto":
				if (!pantallaCalc.includes(".")) {
					pantallaCalcDom.innerText += "."
					limitarLongitud()
				}
				break;

			case "igual":
				var resultado = 0
				self.operadores = JSON.parse(sessionStorage.getItem('operadores'))
				if (self.operadores.operador2 == "") { self.operadores.operador2 = pantallaCalc }
				switch (self.operadores.operando) {
					case "mas":
						resultado = Number(self.operadores.operador1) + Number(self.operadores.operador2)
						break;
					case "menos":
						resultado = Number(self.operadores.operador1) - Number(self.operadores.operador2)
						break;
					case "por":
						resultado = Number(self.operadores.operador1) * Number(self.operadores.operador2)
						break;
					case "dividido":
						resultado = Number(self.operadores.operador1) / Number(self.operadores.operador2)
						break;				
					default:
						break;
				}
				self.operadores.operador1 = resultado.toString()
				sessionStorage.setItem('operadores',JSON.stringify(self.operadores))
				pantallaCalcDom.innerText = resultado.toString()
				igualLimitarLongitud()
				break;

			case "mas":
				definirOperacion("mas")
				break;

			case "menos":
				definirOperacion("menos")
				break;

			case "por":
				definirOperacion("por")
				break;

			case "dividido":
				definirOperacion("dividido")
				break;

			case "raiz":
				var numeroActual = Number(pantallaCalc)
				if (numeroActual>=0) { numeroActual = Math.sqrt(numeroActual)	}
				pantallaCalcDom.innerText = numeroActual.toString()
				igualLimitarLongitud()
				break;

			case "sign":
				var numeroActual = Number(pantallaCalc)
				numeroActual = -numeroActual
				pantallaCalcDom.innerText = numeroActual.toString()
				break;

			case "on":
				definirOperacion("")
				pantallaCalcDom.innerText = "0"
				break;

			default:
				if (pantallaCalc == "0"){
					pantallaCalcDom.innerText = idTecla
				}else{
					pantallaCalcDom.innerText += idTecla
					limitarLongitud()			
				}
				break;

		}//switch
	};//accionTecla
	/******************************************************************************/


	/******************************************************************************
	 * Return
	 * Retorna el método init junto con los eventos necesarios para
	 * el funcionamiento de la aplicación.
	 * Estos métodos asignan las acciones a los eventos y los listeners
	 * necesarios dentro de la aplicación
	 *******************************************************************************/
	return{

		/*
		- Método init
				Inicialización encargada de ejecutar todas las otras funciones que 
				se deben inicar con la ejecución del programa
		*/
		init: function(){
			this.presionaTecla();
			
			self.operadores = {"operador1":"", "operador2":"", "operando":""}
			sessionStorage.setItem('operadores',JSON.stringify(self.operadores))
			console.log(self.operadores)
		},//cierre método init

		/*
		- Metodo presionaTecla
				Método que reduce tamaño de tecla cuando ésta es presionada y vuelve
				a la normalidad al soltarla
		*/
		presionaTecla: function(){
			var teclas = document.getElementsByClassName('tecla');

			for (let i = 0; i < teclas.length; i++) {
				teclas[i].onmousedown = mousePressDown;
				teclas[i].onmouseup = mousePressUp;
			}//for

		},//Cierre método presionaTecla

	}// Cierre return

})();//Cierre var Calculadora

Calculadora.init();