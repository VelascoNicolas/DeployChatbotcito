//Funcion que concatena los mesajes de error de las validaciones
export function getZodMessages(data: string | any[]) {
	let output = "";
	for (let index = 0; index < data.length; index++) {
		output += data[index].message + ". ";
	}
	return output;
}
