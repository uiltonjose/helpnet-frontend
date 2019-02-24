var TIPO_ERROR = "Erro";
var TIPO_SUCCESS = "Sucesso";


function showAlert(tipo, msg){
	if (tipo == TIPO_ERROR){
		$('#alert').attr('class', ('alert alert-danger alert-dismissible fade show visible center')).text(msg);
	}else if (tipo == TIPO_SUCCESS){
		alert($('#alert'));
		$('#alert').attr('class', ('alert alert-success alert-dismissible fade show visible center')).text(msg);

	}
}

