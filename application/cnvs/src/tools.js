//tools

//get the code object from the code Name
function getFromCode(codeName){
	return code.filter(function(el){return el.code === codeName;})[0]
}