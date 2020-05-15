jQuery.sap.declare("sap.ui.veh_pagos.util.Formatter");
jQuery.sap.require("sap.ui.core.format.DateFormat");

sap.ui.veh_pagos.util.Formatter = {
    
	statusText :  function (value) {
		var bundle = this.getModel("i18n").getResourceBundle();
		return bundle.getText("StatusText" + value, "?");
	},
	
	statusState :  function (value) {
		var map = sap.ui.demo.myFiori.util.Formatter._statusStateMap;
		return (value && map[value]) ? map[value] : "None";
	},
	
	quantity :  function (value) {
		try {
			return (value) ? parseFloat(value).toFixed(0) : value;
		} catch (err) {
			return "Not-A-Number";
		}
	},
    money: function(value){
        value = parseFloat(value + "").toFixed(2);
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    },
	time : function (value)
	{
		var oDateFormat = sap.ui.core.format.DateFormat.getInstance({  
		     source:{pattern:"KKmmss"},  
		     pattern: "KK:mm:ss"}  
		);  
		    value = oDateFormat.parse(value);  
			return oDateFormat.format(new Date(value)); 
	},
	fecha : function(fecha){
		if(fecha == null){
			return ""
		}else{
			var valueDate = fecha;
		    var d = new Date(valueDate);
			d.setDate(d.getDate() + 1);
			d = d.toLocaleDateString();
			var parts = d.split('/');
			if(parts[0] < 10) parts[0] = '0' + parts[0];
			if(parts[1] < 10) parts[1] = '0' + parts[1];
			return parts[0] + '.' + parts[1] + '.' + parts[2];	
		}
	},
	dates : function (value) {
		if (value =="00000000"){
		 return ;
		} else{
			var oDateFormat = sap.ui.core.format.DateFormat.getInstance({  
			     source:{pattern:"MM-dd-yyyy"},  
			     pattern: "dd-MM-yyyy"}  
			);  		
	        value = oDateFormat.parse(value);  
			return oDateFormat.format(new Date(value)); 		
		}
	},

	borrar0izalfanumerico: function(valor){
		if(valor != null && valor != undefined && valor != ""){
			var val = valor;
			for (var i = 0; i < valor.length; i++) {
				if(val.substr(0, 1) == 0){
					val=val.substr(1, val.length-1);
				}
			}
			return val;
		}else{
			return valor;
		}
	},
	tcamp: function (value){
		var Tpcamp = value;
		if (Tpcamp == "01"){
			return "INCENTIVO AL JEFE DE VENTAS";
		}else if(Tpcamp == "02"){
			return "INCENTIVO AL VENDEDOR";
		}else if(Tpcamp == "03"){
			return "COMPRA DE CAMPAÑA PEN";
		}else if(Tpcamp == "04"){
			return "COMPRA DE CAMPAÑA USD";
		}else if(Tpcamp == "05"){
			return "INCENTIVO AL DEALER";
		}else if(Tpcamp == "06"){
			return "INCENTIVOS VARIOS";
		}else if(Tpcamp == "07"){
			return "INCENTIVO ICM";
		}else if(Tpcamp == "07"){
			return "INCENTIVO ICM";
		}else{
			return "";
		}
	},
	//Función para quitar los 0
	integer: function(num){
		try {
			return (num) ? parseInt(num) : num;
		} catch (err) {
			return "Not-A-Number";
		}
	},
};