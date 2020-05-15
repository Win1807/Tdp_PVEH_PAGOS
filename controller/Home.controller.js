jQuery.sap.require("sap.ui.veh_pagos.util.Formatter");
jQuery.sap.require("sap/ui/model/json/JSONModel");
jQuery.sap.require("sap/m/MessageToast");
jQuery.sap.require("sap/m/Table");
// jQuery.sap.require("sap/m/semantic");

sap.ui.define([
   "sap/ui/veh_pagos/controller/BaseController",
   "sap/m/MessageBox",
   "sap/ui/model/json/JSONModel",
   "sap/ui/model/Filter",
   "sap/ui/model/FilterOperator",
   "sap/ui/veh_pagos/util/Formatter",
   'sap/m/Token',
], function (BaseController, MessageBox, JSONModel,Filter,FilterOperator,formatter, Token) {
    "use strict";
    var File;
    var urlGlobal = sessionStorage.urlGlobal;
    var click = 1;
    var clk_m = 1;
    var clk_t = 1;
    var tableuse;
    var tbOCuse;
    var clk_moc = 1;
    var clk_toc = 1;
    var clickoc = 1;
    var urlGlobalRS = "/DEV_TO_ODVIATICOS/odata/SAP/ZSCP_VEHICULOS_SRV";
    var urlGlobal2 = "/ODATA_Repuestos/odata/SAP/ZSCP_REPUESTOS_SRV/";
	var oModelRS;
	var ReadyTableOC;
	var isMobile;
    return BaseController.extend("sap.ui.veh_pagos.controller.Home", {
    	formatter: formatter,
		onInit : function () {
        var thes = this;
        ReadyTableOC = false;
      	var myModel = this.getOwnerComponent().getModel();
    		myModel.setSizeLimit(99999);
		isMobile = sap.ui.Device.system.phone;
        this.getView().byId("frgReporte--ST_REPORTE1").getTable().setMode("SingleSelectLeft");
    		// Configurando Multi Input de Serie
        var oMultiInput1 = thes.getView().byId("frgReporteSolicitud--serie");
        oMultiInput1.addValidator(function(args){
            var text = args.text;
            return new Token({key: text, text: text});
        });
        // Configurando Multi Input de Versión
        var oMultiInput3 = thes.getView().byId("frgReporteSolicitud--material");
        oMultiInput3.addValidator(function(args){
            var text = args.text;
            return new Token({key: text, text: text});
        });
        
        // // Configurando Multi Input de Serie
        // var oMultiInput2 = thes.getView().byId("frgReporteSolicitud--serie2");
        // oMultiInput2.addValidator(function(args){
        //     var text = args.text;
        //     return new Token({key: text, text: text});
        // });
        // // Configurando Multi Input de Versión
        // var oMultiInput4 = thes.getView().byId("frgReporteSolicitud--material2");
        // oMultiInput4.addValidator(function(args){
        //     var text = args.text;
        //     return new Token({key: text, text: text});
        // });
        if (isMobile) {
          tableuse = "frgReporteSolicitud--tblVisualizarM";
          thes.getView().byId("frgReporteSolicitud--tblVisualizarT").setVisible(false);
          thes.getView().byId("frgReporteSolicitud--tblVisualizarM").setVisible(true);
        }else{
          tableuse = "frgReporteSolicitud--tblVisualizarT";
          thes.getView().byId("frgReporteSolicitud--tblVisualizarT").setVisible(true);
          thes.getView().byId("frgReporteSolicitud--tblVisualizarM").setVisible(false);
          thes.getView().byId("frgReporteSolicitud--botonVolver").setVisible(false);
        }
        // Configuración de visualización de Smarttables segun device
        if(sap.ui.Device.system.phone){
          tbOCuse = "frgReporte--ST_REPORTE2";
          thes.getView().byId("frgReporte--ST_REPORTE1").setVisible(false);
          thes.getView().byId("frgReporte--ST_REPORTE2").setVisible(true);
         }else{
          tbOCuse = "frgReporte--ST_REPORTE1";
          thes.getView().byId("frgReporte--ST_REPORTE1").setVisible(true);
          thes.getView().byId("frgReporte--ST_REPORTE2").setVisible(false);
          thes.getView().byId("frgReporte--botonVolver").setVisible(false);
        }
        
		//Llenando Tipo de Campaña
		oModelRS = new sap.ui.model.odata.v2.ODataModel(urlGlobalRS, true);
		var Filter = [];
		var Filter1 = [];
		Filter = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, "25");
		Filter1.push(Filter);
        sap.ui.core.BusyIndicator.show(0);
		oModelRS.read("/PRC_VEHICULOSSet",{
			method: "GET",
			filters: Filter1,
			urlParameters: {"search" : "GET"},
			success: function(result, status, xhr){
				var result = JSON.parse(result.results[0].Json);
				var tcamp = result;
				var ListaCamp = new JSONModel({
				"tipocampa": tcamp
				});
				// thes.getView().byId("frgReporteSolicitud--idATipoCampania").setModel(ListaCamp, "tcamp");
				thes.getView().byId("frgReporteSolicitud--idTipoCampania").setModel(ListaCamp, "tcamp");
			},
			error: function(error){
			}
		});
		//Llenando Marca
		oModelRS = new sap.ui.model.odata.v2.ODataModel(urlGlobalRS, true);
		var Filter = [];
		var Filter1 = [];
		Filter = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, "23");
		Filter1.push(Filter);
        sap.ui.core.BusyIndicator.show(0);
		oModelRS.read("/PRC_VEHICULOSSet",{
			method: "GET",
			filters: Filter1,
			urlParameters: {"search" : "GET"},
			success: function(result, status, xhr){
				var result = JSON.parse(result.results[0].Json);
				var tmarca = result;
				var ListaMarca = new JSONModel({
				"tipomarca": tmarca
				});
				thes.getView().byId("frgReporteSolicitud--idMarca").setModel(ListaMarca, "tmar");
			},
			error: function(error){
			}
		});
        //Llenando datos en la tabla "Campañas Disponibles"
        var Filter = [];
		var Filter1 = [];
		Filter = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, "10");
		Filter1.push(Filter);
        oModelRS.read("/PRC_VEHICULOSSet",{
			filters: Filter1, 
			urlParameters: {"search" : "GET"},
			success: function(result, status, xhr){
				var inicio = result.results[0].Json;
				if (inicio !== "X"){
					var result = JSON.parse(result.results[0].Json)
					var TBCampania = thes.getView().byId("frgGestion--TableCD");
					for (var i = 0; i < result.length; i++) {
						var monto1 = parseFloat(result[i].netwr).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
						var monto2 = parseFloat(result[i].netwr2).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
						// var models = parseFloat(result[i].models).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); //Israel-Intelecta
						
						var finicio = thes.FormatDate(result[i].inicio);
						var ffin = thes.FormatDate(result[i].final);
						
						var Column_1 = new sap.m.Input({value: result[i].txcamp, enabled:false});
						var Column_2 = new sap.m.Input({value: finicio, enabled:false});
						var Column_3 = new sap.m.Input({value: ffin, enabled:false});
						var Column_4 = new sap.m.Input({value: monto1, enabled:false, textAlign: sap.ui.core.TextAlign.End});
						var Column_5 = new sap.m.Input({value: monto2, enabled:false, textAlign: sap.ui.core.TextAlign.End});
						var Column_6 = new sap.m.Input({value: result[i].waerk, enabled:false});
						var Column_7 = new sap.m.Input({value: result[i].models, enabled:false});
						
						var Items = new sap.m.ColumnListItem({cells:[Column_1,Column_2,Column_3,Column_4,Column_5,Column_6,Column_7]});
						TBCampania.addItem(Items);
					}
				}
        		sap.ui.core.BusyIndicator.hide();
			},
			error: function(error){
				sap.ui.core.BusyIndicator.hide();
			}
		});
	},
      FormatDate: function(date){
        var fec = date;
        var anio = fec.substr(0, 4);
        var mes = fec.substr(4, 2);
        var dia = fec.substr(6, 2);
        return dia + "." + mes + "." + anio;
      },
      onChange: function(oEvent) {
        File = oEvent.getParameter("files") && oEvent.getParameter("files")[0];
      },
      monto: function(thes){
        var id=thes.sId;
            
        var vista = thes;
        var texto = vista.getValue();
        if(texto != "" && texto != null && texto != undefined){
          vista.setValue(parseFloat(texto).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        }else{
          vista.setValue(texto);
        }
      },
      onExportExcel: function(){
        if(File != undefined){
          var file = File;
          var thes = this;
          if(file && window.FileReader){
            var reader = new FileReader();
            var result = {};
            var data;
            var roa;
            reader.onload = function(e) {
              if(thes.getView().byId("frgGestion--TBVehiculos").getItems().length > 0){
                thes.getView().byId("frgGestion--TBVehiculos").removeAllItems();
              }

              if(thes.getView().byId("frgGestion--TBLog").getItems().length > 0){
                thes.getView().byId("frgGestion--TBLog").removeAllItems();
              }
              data = e.target.result;
              var wb = XLSX.read(data, {type: 'binary'});
              wb.Sheets.Hoja1.A1 = {t: "s", v: "VHCLE", r: "<t>VHCLE</t>", h: "VHCLE", w: "VHCLE"};
              wb.Sheets.Hoja1.B1 = {t: "s", v: "MATNR", r: "<t>MATNR</t>", h: "MATNR", w: "MATNR"};
              wb.Sheets.Hoja1.C1 = {t: "s", v: "FFAB", r: "<t>FFAB</t>", h: "FFAB", w: "FFAB"};
              wb.Sheets.Hoja1.D1 = {t: "s", v: "MONT1", r: "<t>MONT1</t>", h: "MONT1", w: "MONT1"};
              wb.Sheets.Hoja1.E1 = {t: "s", v: "MONT2", r: "<t>MONT2</t>", h: "MONT2", w: "MONT2"};
              wb.Sheets.Hoja1.F1 = {t: "s", v: "OBSERV", r: "<t>OBSERV</t>", h: "OBSERV", w: "OBSERV"};
              wb.SheetNames.forEach(function(sheetName) {
                  roa = XLSX.utils.sheet_to_row_object_array(wb.Sheets[sheetName]);
                  var table = thes.getView().byId("frgGestion--TBVehiculos");
                  for (var i = 0; i < roa.length; i++) {
                    if(roa[i].FFAB != undefined){
                      var FFAB = parseInt(roa[i].FFAB);
                    }else{
                      var FFAB = "";
                    }

                    if(roa[i].VHCLE != undefined){
                      var VHCLE = thes.borrar0izalfanumerico(roa[i].VHCLE);
                    }else{
                      var VHCLE = "";
                    }

                    if(roa[i].MATNR != undefined){
                      var MATNR = parseInt(roa[i].MATNR);
                    }else{
                      var MATNR = "";
                    }

                    if(roa[i].MONT1 != undefined){
                      var MONT1 = parseFloat(roa[i].MONT1).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    }else{
                      var MONT1 = "";
                    }

                    if(roa[i].MONT2 != undefined){
                      var MONT2 = parseFloat(roa[i].MONT2).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    }else{
                      var MONT2 = "";
                    }
                    var Column_0 = new sap.m.Input({value: FFAB, editable: false});
                    var Column_1 = new sap.m.Input({value: "", editable: false});
                    var Column_2 = new sap.m.Input({value: VHCLE});
                    var Column_3 = new sap.m.Input({value: MATNR, editable: false});
                    var Column_4 = new sap.m.Input({value: "", editable: false});
                    var Column_5 = new sap.m.Input({value: "", editable: false});
                    var Column_6 = new sap.m.Input({value: "", editable: false});
                    var Column_7 = new sap.m.Input({value: MONT1, textAlign: sap.ui.core.TextAlign.End, change: function(e){
                                        sap.ui.controller("sap.ui.veh_pagos.controller.Home").validaNumberM(this);
                                        sap.ui.controller("sap.ui.veh_pagos.controller.Home").monto(this);}
                    });
                    var Column_8 = new sap.m.Input({value: MONT2, textAlign: sap.ui.core.TextAlign.End, change: function(e){
                                        sap.ui.controller("sap.ui.veh_pagos.controller.Home").validaNumberM(this);
                                        sap.ui.controller("sap.ui.veh_pagos.controller.Home").monto(this);}
                    });
                    var Column_11 = new sap.m.Input({value: "", editable: false});
                    var Column_9 = new sap.m.Input({value: roa[i].OBSERV});
                    var Column_10 = new sap.m.Input({value: "", editable: false});

                    var oTableItems = new sap.m.ColumnListItem({cells:[Column_0,Column_1,Column_2,Column_3,Column_4,Column_5,Column_6,Column_7,Column_8,Column_11,Column_9,Column_10]});
                    table.addItem(oTableItems);
                  }
              });
              return result;
            }
            reader.readAsBinaryString(file);
          }else{
              sap.ui.core.BusyIndicator.hide();
          }
        }else{
          sap.m.MessageBox.error("Por favor eliga un archivo Excel.");
        }
      },
      onDeleteLine: function(){
        var oView = this.getView().byId("frgGestion--TBVehiculos");
        var oSelectedItems = oView.getSelectedItems();

        $.each(oSelectedItems, function(index, item){
            oView.removeItem(item);
        });
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
      onPrecesarDatos: function(){
        sap.ui.core.BusyIndicator.show(0); // mostrando la barra de Busy
    		var thes = this;
    		var Datos = [];
        var error = 0;
    		var Table = thes.getView().byId("frgGestion--TBVehiculos").getItems();
    		$.each(Table, function(key, item){
      		var oCells = item.mAggregations.cells;
      		var Elementos = {
            'ZANO_FAB': oCells[0].mProperties.value,
      			'KUNNR': oCells[1].mProperties.value,
      			'VHCLE': oCells[2].mProperties.value,
      			'MATNR': oCells[3].mProperties.value,
      			'MAKTX': oCells[4].mProperties.value,
      			'FKDAT': oCells[5].mProperties.value,
      			'FKMEN': oCells[6].mProperties.value,
      			'MONT1': oCells[7].mProperties.value.replace(/,/gi, ""),
      			'MONT2': oCells[8].mProperties.value.replace(/,/gi, ""),
      			'CLIFINAL': oCells[9].mProperties.value,
      			'OBSERV': oCells[10].mProperties.value,
      			'LOG': oCells[11].mProperties.value
      		};
          if(thes.validaNumberV(sap.ui.getCore().byId(oCells[7].sId))){
            error=1;
          }
          if(thes.validaNumberV(sap.ui.getCore().byId(oCells[8].sId))){
            error=1;
          }
    		  Datos.push(Elementos);
    		});

        if(!error){
      		var Data = {Datos};
      		var TablaLog = thes.getView().byId("frgGestion--TBLog");
              
      		var Filter1 = [];
      		var Filter = [];
      		
      		Filter = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, "03");
      		Filter1.push(Filter);
      		Filter = new sap.ui.model.Filter("Data", sap.ui.model.FilterOperator.EQ, JSON.stringify(Data));
          	Filter1.push(Filter);
            
          oModelRS.read("/PRC_VEHICULOSSet",{
    			filters: Filter1,
    			urlParameters: {"search" : "POST"},
      			success: function(result, status, xhr){
      				var result = JSON.parse(result.results[0].Json);
      				//Cambiando datos Series en Lista de Vehículos
      				var Table = thes.getView().byId("frgGestion--TBVehiculos");
      				var series = result.series;
      				if(series.length > 0){
      					thes.getView().byId("frgGestion--TBVehiculos").removeAllItems();
      					for (var i = 0; i < series.length; i++) {
      					    var fTDP = thes.FormatDate(series[i].fkdat);
      					    var fDLR = thes.FormatDate(series[i].fkmen);
      					    var monto1 = parseFloat(series[i].mont1).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      					    var monto2 = parseFloat(series[i].mont2).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      					    var kunnr = thes.getNumber(series[i].kunnr);
      					    var matnr = thes.getNumber(series[i].matnr);
                    var serie = thes.borrar0izalfanumerico(series[i].vhcle);
                    var zano_fab = series[i].zano_fab;
      					    
      					    var Column_0 = new sap.m.Input({value: zano_fab, enabled: false});
                    var Column_1 = new sap.m.Input({value: kunnr, enabled: false});
      					    var Column_2 = new sap.m.Input({value: serie});
      					    var Column_3 = new sap.m.Input({value: matnr, enabled: false});
      					    var Column_4 = new sap.m.Input({value: series[i].maktx, enabled: false});
      					    var Column_5 = new sap.m.Input({value: fTDP, enabled: false});
      					    var Column_6 = new sap.m.Input({value: fDLR, enabled: false});
      					    var Column_7 = new sap.m.Input({value: monto1, textAlign: sap.ui.core.TextAlign.End});
      					    var Column_8 = new sap.m.Input({value: monto2, textAlign: sap.ui.core.TextAlign.End});
      					    var Column_10 = new sap.m.Input({value: series[i].clifinal, enabled: false});
      					    var Column_9 = new sap.m.Input({value: series[i].observ});
      					    var Column_11 = new sap.m.Input({value: series[i].log, enabled: false});
      					
      					    var Items = new sap.m.ColumnListItem({cells:[Column_0,Column_1,Column_2,Column_3,Column_4,Column_5,Column_6,Column_7,Column_8,Column_10,Column_9,Column_11]});
      					    Table.addItem(Items);
      					}
      				}
      				//Mostrando em nesaje Returns
      				var mensaje = result.return;
      				if(mensaje.length > 0){
      					sap.m.MessageBox.error(mensaje[0].message);
      				}
      				//Llenado datos en tabla LOG
      				var log = result.log;
      				var TableLog = thes.getView().byId("frgGestion--TBLog");
      				if(log.length > 0){
      					thes.getView().byId("frgGestion--TBLog").removeAllItems();
      					for (var i = 0; i < log.length; i++) {
      					    var Column_1 = new sap.m.Input({value: log[i].vhcle, enabled: false});
      					    var Column_2 = new sap.m.Input({value: log[i].usnam, enabled: false});
      					    var Column_3 = new sap.m.Input({value: log[i].log1, enabled: false});
      					
      					    var ItemsLog = new sap.m.ColumnListItem({cells:[Column_1,Column_2,Column_3]});
      					    TableLog.addItem(ItemsLog);
      					}
      				}
                      sap.ui.core.BusyIndicator.hide();
      			},
      			error: function(error){
      				sap.ui.core.BusyIndicator.hide();
      			}
  		    });
        }else{
          sap.m.MessageBox.error("Solo se debe ingresar números en los campos Montos.");
          sap.ui.core.BusyIndicator.hide();
        }
       
        // $.ajax({
        //     url: url, 
        //     cache: false,
        //     type: "POST",
        //     data: JSON.stringify(Data),
        //     success: function(result,status,xhr){
        //       //Cambiando datos Series en Lista de Vehículos
        //       var Table = thes.getView().byId("frgGestion--TBVehiculos");
        //       var series = result.series;
        //       if(series.length > 0){
        //         thes.getView().byId("frgGestion--TBVehiculos").removeAllItems();
        //         for (var i = 0; i < series.length; i++) {
        //             var fTDP = thes.FormatDate(series[i].fkdat);
        //             var fDLR = thes.FormatDate(series[i].fkmen);
        //             var monto1 = parseFloat(series[i].mont1).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        //             var monto2 = parseFloat(series[i].mont2).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        //             var kunnr = thes.getNumber(series[i].kunnr);
        //             var matnr = thes.getNumber(series[i].matnr);
                    
        //             var Column_1 = new sap.m.Input({value: kunnr, enabled: false});
        //             var Column_2 = new sap.m.Input({value: series[i].vhcle});
        //             var Column_3 = new sap.m.Input({value: matnr, enabled: false});
        //             var Column_4 = new sap.m.Input({value: series[i].maktx, enabled: false});
        //             var Column_5 = new sap.m.Input({value: fTDP, enabled: false});
        //             var Column_6 = new sap.m.Input({value: fDLR, enabled: false});
        //             var Column_7 = new sap.m.Input({value: monto1, textAlign: sap.ui.core.TextAlign.End});
        //             var Column_8 = new sap.m.Input({value: monto2, textAlign: sap.ui.core.TextAlign.End});
        //             var Column_10 = new sap.m.Input({value: series[i].clifinal, enabled: false});
        //             var Column_9 = new sap.m.Input({value: series[i].observ});
        //             var Column_11 = new sap.m.Input({value: series[i].log, enabled: false});

        //             var Items = new sap.m.ColumnListItem({cells:[Column_1,Column_2,Column_3,Column_4,Column_5,Column_6,Column_7,Column_8,Column_10,Column_9,Column_11]});
        //             Table.addItem(Items);
        //         }
        //       }
        //       //Mostrando em nesaje Returns
        //       var mensaje = result.return;
        //       if(mensaje.length > 0){
        //         sap.m.MessageBox.error(mensaje[0].message);
        //       }
        //       //Llenado datos en tabla LOG
        //       var log = result.log;
        //       var TableLog = thes.getView().byId("frgGestion--TBLog");
        //       if(log.length > 0){
        //         thes.getView().byId("frgGestion--TBLog").removeAllItems();
        //         for (var i = 0; i < series.length; i++) {
        //             var Column_1 = new sap.m.Input({value: series[i].vhcle});
        //             var Column_2 = new sap.m.Input({value: series[i].kunnr});
        //             var Column_3 = new sap.m.Input({value: series[i].log1});

        //             var ItemsLog = new sap.m.ColumnListItem({cells:[Column_1,Column_2,Column_3]});
        //             TableLog.addItem(ItemsLog);
        //         }
        //       }
        //     },
        //     error: function(xhr,status,error){
        //         sap.m.MessageBox.error("Error al Guardar");
        //     },
        //     complete: function (data) {
        //         sap.ui.core.BusyIndicator.hide();
        //     }
        // });
      },
	  getNumber:function (value) {
		try {
			return (value) ? parseFloat(value).toFixed(0) : value;
		} catch (err) {
			return "Not-A-Number";
		}
	},
      handleUploadComplete: function(oEvent) {
        var sResponse = oEvent.getParameter("response");
        if (sResponse) {
          var sMsg = "";
          var m = /^\[(\d\d\d)\]:(.*)$/.exec(sResponse);
          if (m[1] == "200") {
              sMsg = "Return Code: " + m[1] + "\n" + m[2], "SUCCESS", "Upload Success";
              oEvent.getSource().setValue("");
          } else {
              sMsg = "Return Code: " + m[1] + "\n" + m[2], "ERROR", "Upload Error";
          }

          MessageToast.show(sMsg);
        }
      },
      //Función para retroceder
      onNavBack: function(){
        window.history.back();
      },
      //Función para limpiar todos los campos
      onDecline: function(){
        this.getView().byId("frgReporte--txtNumeroOc").setValue("");
        this.getView().byId("frgReporte--txtFechaInicio").setValue("");
        this.getView().byId("frgReporte--txtFechaFinal").setValue("");
      },
      // --------------------------------------------REPORTE SOLICITUD
      onPressItem: function(){
        tableuse = "frgReporteSolicitud--tblVisualizarT";

        this.getView().byId("frgReporteSolicitud--tblVisualizarT").setVisible(true);
        this.getView().byId("frgReporteSolicitud--botonVolver").setVisible(true);
        this.getView().byId("frgReporteSolicitud--tblVisualizarM").setVisible(false);

        click = clk_t;
        this.goTo(click);

        if(click == 1) this.getView().byId("frgReporteSolicitud--btnAnterior").setEnabled(false);
        else this.getView().byId("frgReporteSolicitud--btnAnterior").setEnabled(true);
         
      },

      onVolver: function(){
        tableuse = "frgReporteSolicitud--tblVisualizarM";

        this.getView().byId("frgReporteSolicitud--tblVisualizarT").setVisible(false);
        this.getView().byId("frgReporteSolicitud--botonVolver").setVisible(false);
        this.getView().byId("frgReporteSolicitud--tblVisualizarM").setVisible(true);

        click = clk_m;
        this.goTo(click);

        if(click == 1) this.getView().byId("frgReporteSolicitud--btnAnterior").setEnabled(false);
        else this.getView().byId("frgReporteSolicitud--btnAnterior").setEnabled(true);
      },

      onShow: function(oEvent){
        click = 1;
        this.goTo(click);
      },

      onLoadM: function(oEvent){ //Evento se activa cuando trae data el smart table mobile
        sap.ui.core.BusyIndicator.hide();
        var tblcant = this.getView().byId(tableuse).getTable().getItems().length;

        if(tblcant == 0){

        this.getView().byId("frgReporteSolicitud--btnSiguiente").setEnabled(false);
        this.getView().byId("frgReporteSolicitud--btnAnterior").setEnabled(false);

        }else{
        this.getView().byId("frgReporteSolicitud--btnSiguiente").setEnabled(true);
        this.getView().byId("frgReporteSolicitud--btnAnterior").setEnabled(true);
        }

        this.goTo(click);

        if(click == 1) this.getView().byId("frgReporteSolicitud--btnAnterior").setEnabled(false);
        else this.getView().byId("frgReporteSolicitud--btnAnterior").setEnabled(true);
      },

      onLoadT: function(oEvent){ //Evento se activa cuando trae data el smart table desktop
        sap.ui.core.BusyIndicator.hide();
        var tblcant = this.getView().byId(tableuse).getTable().getItems().length;
        if(tblcant == 0){

        this.getView().byId("frgReporteSolicitud--btnSiguiente").setEnabled(false);
        this.getView().byId("frgReporteSolicitud--btnAnterior").setEnabled(false);

        }else{

        this.getView().byId("frgReporteSolicitud--btnSiguiente").setEnabled(true);
        this.getView().byId("frgReporteSolicitud--btnAnterior").setEnabled(true);

        }

        this.goTo(click);

        if(click == 1) this.getView().byId("frgReporteSolicitud--btnAnterior").setEnabled(false);
        else this.getView().byId("frgReporteSolicitud--btnAnterior").setEnabled(true);
      },
      range: function(oInit, oEnd, oData){
        $.each(oData, function(key, item){
            var sId = item.sId;

            if(key >= oInit && key <= oEnd){
             sap.ui.getCore().byId(sId).setVisible(true);
            }else{                    
             sap.ui.getCore().byId(sId).setVisible(false);
            }
        });
      },

      goTo: function(oClick){
        var oSelectItem = this.getView().byId("frgReporteSolicitud--sShow").getSelectedKey();
        var oTable =  this.getView().byId(tableuse).getTable().getItems();
        var oTotal = oTable.length;
        var oShow = Math.ceil(oTotal / oSelectItem);

        if(oClick <= oShow){

           if(oShow == oClick){
              this.getView().byId("frgReporteSolicitud--btnSiguiente").setEnabled(false);
           }else{
              this.getView().byId("frgReporteSolicitud--btnSiguiente").setEnabled(true);
           }
           
           this.range(oSelectItem * (oClick - 1), (oSelectItem * oClick) - 1, oTable);
        }

        if(oClick <= 1){
          this.getView().byId("frgReporteSolicitud--btnAnterior").setEnabled(false);
        }    
      },

      goNext: function(){
        this.goTo(click += 1); 

        if(tableuse == "frgReporteSolicitud--tblVisualizarM") clk_m = click;
        else clk_t = click;

        if(click != 0){
            this.getView().byId("frgReporteSolicitud--btnAnterior").setEnabled(true);
        }else{
            this.getView().byId("frgReporteSolicitud--btnAnterior").setEnabled(false);
        }
      },
      goPrevious: function(){
        this.goTo(click -= 1);

        if(tableuse == "frgReporteSolicitud--tblVisualizarM") clk_m = click;
        else clk_t = click;

        if(click <= 1){
            this.getView().byId("frgReporteSolicitud--btnAnterior").setEnabled(false);
        }else{
            this.getView().byId("frgReporteSolicitud--btnAnterior").setEnabled(true);
        }
      },
      onBuscarDatos: function(){
      	var FecSolicitud = this.getView().byId("frgReporteSolicitud--idFecSolicitud").getValue();
		    var AFecSolicitud = this.getView().byId("frgReporteSolicitud--idAFecSolicitud").getValue();
        if(FecSolicitud != "" || AFecSolicitud != ""){
          if (isMobile) {
            this.getView().byId("frgReporteSolicitud--tblVisualizarM").rebindTable();
            this.getView().byId("frgReporteSolicitud--tblVisualizarT").rebindTable();
          }else{
            this.getView().byId("frgReporteSolicitud--tblVisualizarT").rebindTable();
          }

        }else{
        	sap.m.MessageBox.error("Indique una selección en el campo de Fecha de Solicitud");
        }
      },
      onBeforeTBLRS: function(oEvent){
        sap.ui.core.BusyIndicator.show(0);
    		var serie = this.getView().byId("frgReporteSolicitud--serie").getTokens();
    		// var serie2 = this.getView().byId("frgReporteSolicitud--serie2").getTokens();
        var version = this.getView().byId("frgReporteSolicitud--material").getTokens();
        // var version2 = this.getView().byId("frgReporteSolicitud--material2").getTokens();
        
        var TipoCampania = this.getView().byId("frgReporteSolicitud--idTipoCampania").getSelectedKey();
        // var ATipoCampania = this.getView().byId("frgReporteSolicitud--idATipoCampania").getSelectedKey();
        var Marca = this.getView().byId("frgReporteSolicitud--idMarca").getSelectedKey();
        var Estado = this.getView().byId("frgReporteSolicitud--idEstado").getSelectedKey();
        var FecSolicitud = this.getView().byId("frgReporteSolicitud--idFecSolicitud").getValue();
        var AFecSolicitud = this.getView().byId("frgReporteSolicitud--idAFecSolicitud").getValue();

        var FormattedDate1 = new Date(FecSolicitud +" 05:00");
        var FormattedDate2 = new Date(AFecSolicitud +" 05:00");

        var aFilter = [];
		
		    var serietmp = serie.map(function(c) {
          return c.getKey();
        });
              
        // Esctructura de numeros de serie
        $.each(serietmp, function(index, item){
          aFilter.push(
            new Filter("Vhcle", FilterOperator.EQ, item)
          );
        });

        var versiontmp = version.map(function(c) {
          return c.getKey();
        });
         
        var thot = this;
        // Esctructura de numeros de version
        $.each(versiontmp, function(index, item){
    		item = thot.onCompleteFormat(item,18);
          aFilter.push(
            new Filter("Matnr", FilterOperator.EQ, item)
          );
        });
        // var serieTmp2 = serie2.map(function(c){
        // 	return c.getKey();	
        // });           
        // var versionTmp2 = version2.map(function(c){
        // 	return c.getKey();	
        // });
		// if(serie.length != 0 && serie2.length != 0){
		// 	if(serie.length == serie2.length){
		// 		for(var i = 0; i < serie.length; i++){
		// 			aFilter.push(new Filter("Vhcle", FilterOperator.BT, serieTmp[i], serieTmp2[i]));	
		// 		}
		// 	}else{
		// 		var rango = serie.length - serie2.length;
		// 		rango++;
		// 		for(var i = 0; i < rango; i++){
		// 			aFilter.push(new Filter("Vhcle", FilterOperator.BT, serieTmp[i], serieTmp2[i]));	
		// 		}
		// 		var range = rango;
		// 		for(var i = range; i < serie.length; i++){
		// 			aFilter.push(new Filter("Vhcle", FilterOperator.EQ, serieTmp[i]));
		// 		}
		// 	}
		// }else if(serie.length != 0) {
  //         for(var i = 0; i < serie.length; i++){
		// 		aFilter.push(new Filter("Vhcle", FilterOperator.EQ, serieTmp[i]));	
		// 	}
  //       }
		
		// if(version.length != 0 && version2.length != 0){
		// 	if(version.length == version2.length){
		// 		for(var i = 0; i < version.length; i++){
		// 			aFilter.push(new Filter("Matnr", FilterOperator.BT, versionTmp[i], versionTmp2[i]));	
		// 		}
		// 	}else{
		// 		var rango = version.length - version2.length;
		// 		rango++;
		// 		for(var i = 0; i < rango; i++){
		// 			aFilter.push(new Filter("Matnr", FilterOperator.BT, versionTmp[i], versionTmp2[i]));	
		// 		}
		// 		var range = rango;
		// 		for(var i = range; i < version.length; i++){
		// 			aFilter.push(new Filter("Matnr", FilterOperator.EQ, versionTmp[i]));
		// 		}
		// 	}
		// }else if(version.length != 0) {
  //         for(var i = 0; i < version.length; i++){
  //   				aFilter.push(new Filter("Matnr", FilterOperator.EQ, versionTmp[i]));	
  //   			}
  //       }
        
        // if (version.length != 0 && version.length != 0) {
        //   aFilter.push(
        //     new Filter("Matnr", FilterOperator.BT, versionTmp, versionTmp2)
        //   );
        // }else if(version.length != 0){
        //   aFilter.push(
        // 	new Filter("Matnr", FilterOperator.EQ, versionTmp)	
        //   )
        // }
		
        // if (TipoCampania != "" && ATipoCampania != "") {
        //   aFilter.push(
        //     new Filter("Tpcamp", FilterOperator.BT, TipoCampania, ATipoCampania)
        //   );
        // }else if (TipoCampania != ""){
        // 	aFilter.push(
        //     new Filter("Tpcamp", FilterOperator.EQ, TipoCampania)
        //   );
        // }

        if (TipoCampania != "") {
          if (TipoCampania != "*") {
            aFilter.push(
              new Filter("Tpcamp", FilterOperator.EQ, TipoCampania)
            );
          }
        }

        if (Marca != "") {
          if (Marca == "*") {
            aFilter.push(
              new Filter("Prdha", FilterOperator.Contains, Marca)
            );
          }else{
    				aFilter.push(
    					new Filter("Prdha", FilterOperator.EQ, Marca)
    				);
          }
        }

        if (Estado != "") {
          aFilter.push(
            new Filter("Estado", FilterOperator.EQ, Estado)
          );
        }

        if(FecSolicitud != "" && AFecSolicitud != ""){
          aFilter.push(
            new Filter("Erdat", FilterOperator.BT,FormattedDate1,FormattedDate2)
          );
        }else if(FecSolicitud != ""){
          aFilter.push(
            new Filter("Erdat", FilterOperator.EQ,FormattedDate1)
          );	 
        }
        // var oList = this.getView().byId("frgReporteSolicitud--tblVisualizarT").getTable();
        // var oBinding = oList.getBinding("items");
        // oBinding.filter(aFilter);
        console.log(aFilter);
        oEvent.mParameters.bindingParams.filters = aFilter;
      },
      onReporteS: function(){
		var oRouter = this.getOwnerComponent().getRouter();
		oRouter.navTo("reportes");
      },
		
		//Abrir ventana de la busqueda de Serie**********************************************************************
		buscaSerie: function(){
			this._oDialog9 = sap.ui.xmlfragment("diagSerie", "sap.ui.veh_pagos.popup.Serie", this);
			this._oDialog9.open();
		},
		BuscarSerie: function() {
		sap.ui.core.BusyIndicator.show(0); // mostrando la barra de Busy
		
		var tokenSeries = sap.ui.getCore().byId("diagSerie--codigo").getTokens();
		var material = sap.ui.getCore().byId("diagSerie--material").getValue();
		var descripcion = sap.ui.getCore().byId("diagSerie--descripcion").getValue();
		var nreg = sap.ui.getCore().byId("diagSerie--cantidad").getSelectedKey();
		var PI_SERIE = [];
		var filter = [];
		var filterPar;
		
		var serieTmp = tokenSeries.map(function(c) {
		  return c.getKey();
		});
		
		// Esctructura de numeros de serie
		$.each(serieTmp, function(index, item) {
		  var elemento = {
		    'SIGN': 'I',
		    'OPTION': "EQ",
		    'LOW': item
		  };
		  PI_SERIE.push(elemento);
		});
		
		// Esctructura de materiales
		if (material != "") {
		  var PI_MATNR = [{
		    'SIGN': 'I',
		    'OPTION': "EQ",
		    'LOW': material
		  }];
		} else {
		  var PI_MATNR = [];
		}
		
		// Estructura a enviar en servicio
		var datos = {
		  '|PI_MAKTX': descripcion,
		  '|PI_NREG': nreg,
		  '|PI_SERIE': PI_SERIE,
		  '|PI_MATNR': PI_MATNR
		};
		
		filterPar = new sap.ui.model.Filter("Parametros", sap.ui.model.FilterOperator.EQ, JSON.stringify(datos));
		filter.push(filterPar);
		
		var filterId = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, "06");
		      filter.push(filterId);
		      
		// Obteniendo los datos del servicio odata
		var oModel = new sap.ui.model.odata.v2.ODataModel(urlGlobalRS, true);
		
		//EntitySet es el entityset del metadata 
		oModel.read("/PRC_VEHICULOSSet" ,{
		  method: "GET",
		  filters: filter,
		  success: function(result, status, xhr){
		    var rpta = JSON.parse(result.results[0].Json);
		    
		    var oModel = new JSONModel(rpta);
		    var oTable = sap.ui.getCore().byId("diagSerie--tbBusqueda");
		    oTable.setModel(oModel);
		      
		    sap.ui.core.BusyIndicator.hide();
		  },
		  error: function(error){
		    sap.ui.core.BusyIndicator.hide();
		  },
		  urlParameters: {
		    search: "POST"
		  }
		
		});
		},
		//Seleccionar serie de la búsqueda
		seleccionarSerie: function(){
		  var oTable = sap.ui.getCore().byId("diagSerie--tbBusqueda");
		  var tokenTmp = [];
		  var contexts = oTable.getSelectedContexts();
      var thes = this;
		
		  if(contexts.lenght != 0){
		      var items = contexts.map(function(c) {
		          return c.getObject();
		      }); 
		
		      var oView = this.getView();
		      var oMultiInput1 = oView.byId("frgReporteSolicitud--serie");
		      
		      $.each(items, function(index, item){
		          oMultiInput1.addToken(new Token({text: thes.borrar0izalfanumerico(item.vhcle), key: thes.borrar0izalfanumerico(item.vhcle)}));
		      });
		
		      this._oDialog9.destroy();
		  }
		  else{
		      sap.m.MessageBox.error("Debe seleccionar por lo menos una serie");
		  }
		},
		//Cerrar ventana de la busqueda de serie
		cancelarBuscarSerie: function(){
		this._oDialog9.destroy();
		},
		//****************************************************Abrir ventana de la busqueda de Modelo
		buscaModelo: function() {
			this._oDialog3 = sap.ui.xmlfragment("diagModelo", "sap.ui.veh_pagos.popup.Modelo", this);
			this._oDialog3.open();
	
			// var oModel = new JSONModel(Modelo);
			// var oTable = sap.ui.getCore().byId("diagModelo--tbBusqueda");
			// oTable.setModel(oModel);
	
			// var oMultiInput1 = sap.ui.getCore().byId("diagModelo--codigo");
			// //*** add checkbox validator
			// oMultiInput1.addValidator(function(args) {
			// 	var text = args.text;
	
			// 	return new Token({
			// 		key: text,
			// 		text: text
			// 	});
			// });
		},
		//Seleccionar Material de la búsqueda
		seleccionarModelo: function() {
			var oTable = sap.ui.getCore().byId("diagModelo--tbBusqueda");
			var tokenTmp = [];
			var contexts = oTable.getSelectedContexts();
			
			if (contexts.lenght != 0) {
				var items = contexts.map(function(c) {
					return c.getObject();
				});
	
				var oView = this.getView();
				var oMultiInput1 = oView.byId("frgReporteSolicitud--material");
	
				// Agregar nuevas tokens. Si se quiere reemplaza, utilizar setTokens
				//tokenTmp.push(new Token({text: item.qmtxt, key: item.qmart}));
	
				$.each(items, function(index, item) {
					oMultiInput1.addToken(new Token({
						text: item.matnr,
						key: item.matnr
					}));
				});
	
				this._oDialog3.destroy();
			} else {
				sap.m.MessageBox.error("Debe seleccionar por lo menos un materia");
			}
		},
	
		//Cerrar ventana de la busqueda de Serie
		cancelarModelo: function() {
			this._oDialog3.destroy();
		},
	
		BuscarModelo: function() {
			sap.ui.core.BusyIndicator.show(0); // mostrando la barra de Busy
	
			// var tokenSeries = sap.ui.getCore().byId("diagModelo--codigo").getTokens();
			var material = sap.ui.getCore().byId("diagModelo--material").getValue();
			var descripcion = sap.ui.getCore().byId("diagModelo--descripcion").getValue();
			var nreg = sap.ui.getCore().byId("diagModelo--cantidad").getSelectedKey();
			var PI_SERIE = [];
			var filter = [];
			var filterPar;
	
			// var serieTmp = tokenSeries.map(function(c) {
			// 	return c.getKey();
			// });
	
			// Esctructura de numeros de serie
			// $.each(serieTmp, function(index, item) {
				var elemento = {
					'SIGN': 'I',
					'OPTION': "EQ",
					'LOW': "VEHI"
				};
				PI_SERIE.push(elemento);
			// });
	
			// Estructura a enviar en servicio
			var datos = {
				'PI_NOMBRE': descripcion,
				'PI_CANTIDAD': nreg,
				'PI_MATNR': material
			};
			filterPar = new sap.ui.model.Filter("Parametros", sap.ui.model.FilterOperator.EQ, JSON.stringify(datos));
			filter.push(filterPar);
			
			filterPar = new sap.ui.model.Filter("Data", sap.ui.model.FilterOperator.EQ, JSON.stringify(PI_SERIE));
			filter.push(filterPar);
			
			var filterId = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, "26");
	        filter.push(filterId);
	        
	        // Obteniendo los datos del servicio odata
			var oModel = new sap.ui.model.odata.v2.ODataModel(urlGlobalRS, true);
			
			//EntitySet es el entityset del metadata 
			oModel.read("/PRC_VEHICULOSSet" ,{
				method: "GET",
				filters: filter,
				success: function(result, status, xhr){
					var rpta = JSON.parse(result.results[0].Json);
					var oModel = new JSONModel(rpta);
					var oTable = sap.ui.getCore().byId("diagModelo--tbBusqueda");
					oTable.setModel(oModel);
					sap.ui.core.BusyIndicator.hide();
				},
				error: function(error){
					sap.ui.core.BusyIndicator.hide();
				},
				urlParameters: {
	                search: "GET"
	            }
	
			});
		},
		
		//Abrir ventana de la busqueda de Serie22222222222222*********
		// buscaSerie2: function(){
		// 	this._oDialog10 = sap.ui.xmlfragment("diagSerie2", "sap.ui.veh_pagos.popup.Serie2", this);
		// 	this._oDialog10.open();
		// },
		// BuscarSerie2: function() {
		// sap.ui.core.BusyIndicator.show(0); // mostrando la barra de Busy
		
		// var tokenSeries = sap.ui.getCore().byId("diagSerie2--codigo").getTokens();
		// var material = sap.ui.getCore().byId("diagSerie2--material").getValue();
		// var descripcion = sap.ui.getCore().byId("diagSerie2--descripcion").getValue();
		// var nreg = sap.ui.getCore().byId("diagSerie2--cantidad").getSelectedKey();
		// var PI_SERIE = [];
		// var filter = [];
		// var filterPar;
		
		// var serieTmp = tokenSeries.map(function(c) {
		//   return c.getKey();
		// });
		
		// // Esctructura de numeros de serie
		// $.each(serieTmp, function(index, item) {
		//   var elemento = {
		//     'SIGN': 'I',
		//     'OPTION': "EQ",
		//     'LOW': item
		//   };
		//   PI_SERIE.push(elemento);
		// });
		
		// // Esctructura de materiales
		// if (material != "") {
		//   var PI_MATNR = [{
		//     'SIGN': 'I',
		//     'OPTION': "EQ",
		//     'LOW': material
		//   }];
		// } else {
		//   var PI_MATNR = [];
		// }
		
		// // Estructura a enviar en servicio
		// var datos = {
		//   '|PI_MAKTX': descripcion,
		//   '|PI_NREG': nreg,
		//   '|PI_SERIE': PI_SERIE,
		//   '|PI_MATNR': PI_MATNR
		// };
		
		// filterPar = new sap.ui.model.Filter("Parametros", sap.ui.model.FilterOperator.EQ, JSON.stringify(datos));
		// filter.push(filterPar);
		
		// var filterId = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, "06");
		//       filter.push(filterId);
		      
		// // Obteniendo los datos del servicio odata
		// var oModel = new sap.ui.model.odata.v2.ODataModel(urlGlobalRS, true);
		
		// //EntitySet es el entityset del metadata 
		// oModel.read("/PRC_VEHICULOSSet" ,{
		//   method: "GET",
		//   filters: filter,
		//   success: function(result, status, xhr){
		//     var rpta = JSON.parse(result.results[0].Json);
		    
		//     var oModel = new JSONModel(rpta);
		//     var oTable = sap.ui.getCore().byId("diagSerie2--tbBusqueda");
		//     oTable.setModel(oModel);
		      
		//     sap.ui.core.BusyIndicator.hide();
		//   },
		//   error: function(error){
		//     sap.ui.core.BusyIndicator.hide();
		//   },
		//   urlParameters: {
		//     search: "POST"
		//   }
		
		// });
		// },
		// seleccionarSerie2: function(){
		//   var oTable = sap.ui.getCore().byId("diagSerie2--tbBusqueda");
		//   var tokenTmp = [];
		//   var contexts = oTable.getSelectedContexts();
  //     var thes = this;
		
		//   if(contexts.lenght != 0){
		//       var items = contexts.map(function(c) {
		//           return c.getObject();
		//       }); 
		
		//       var oView = this.getView();
		//       var oMultiInput1 = oView.byId("frgReporteSolicitud--serie2");
		      
		//       $.each(items, function(index, item){
		//           oMultiInput1.addToken(new Token({text: thes.borrar0izalfanumerico(item.vhcle), key: thes.borrar0izalfanumerico(item.vhcle)}));
		//       });
		
		//       this._oDialog10.destroy();
		//   }
		//   else{
		//       sap.m.MessageBox.error("Debe seleccionar por lo menos una serie");
		//   }
		// },
		// cancelarBuscarSerie2: function(){
		// 	this._oDialog10.destroy();
		// },
		//Abrir ventana de la busqueda de Versión2222***************
		// onMaterial: function(){
		// 	this._oDialog11 = sap.ui.xmlfragment("xmlFilterMaterial2","sap.ui.veh_pagos.popup.FiltroMaterial2", this);
		// 	this._oDialog11.open();
		// },
		// onSearchMat2: function(){
		// 	var desc = sap.ui.getCore().byId("xmlFilterMaterial2--desc").getValue();
		// 	var material = sap.ui.getCore().byId("xmlFilterMaterial2--material").getValue();
		// 	var range1 = sap.ui.getCore().byId("xmlFilterMaterial2--range1").getValue();
		// 	var range2 = sap.ui.getCore().byId("xmlFilterMaterial2--range2").getValue();
		// 	var cant = sap.ui.getCore().byId("xmlFilterMaterial2--CantMat").getValue();
		// 	var filters = [];
		// 	var filter;
			
		// 	var datajs = [];
		// 	var datasend = "";
		// 	var typeFilter = "EQ";
			
		// 	if(cant == "" || cant == 0 || cant.includes("e")) {
		// 	  sap.ui.getCore().byId("xmlFilterMaterial2--CantMat").setValue("500");
		// 	  cant = 500;
		// 	}
			            
		// 	if(range1 != "" && range2 != ""){
		// 	    typeFilter = "BT";
		// 	    range1 = range1;
		// 	    range2 = range2;
		// 	}else if(material != ""){
		// 	    if(material.includes("*")){
		// 	        typeFilter = "CP"; 
		// 	        range1 = material;
		// 	    }else{
		// 	        range1 = material;    
		// 	        typeFilter = "EQ";
		// 	    }
		// 	        range2 = "";
		// 	}else if(desc == ""){
		// 	    MessageBox.information("Ingrese los filtros");
		// 	    return;
		// 	}
			
		// 	if(range1 != "" || range2 != "")
		// 	datajs = [{"SIGN":"I","OPTION":typeFilter,"LOW": range1,"HIGH":range2}];
		// 	datasend = JSON.stringify(datajs);
			
			
		// 	sap.ui.core.BusyIndicator.show();
			
		// 	filters = [];
			
		// 	filter = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, "06");
			
		// 	filters.push(filter);
			
		// 	filter = new sap.ui.model.Filter("Data", sap.ui.model.FilterOperator.EQ, datasend);
			
		// 	filters.push(filter);
			
		// 	var oModel = new sap.ui.model.odata.v2.ODataModel(urlGlobal2, true);
		// 	oModel.read("/ODATASet", 
		// 	    {
		// 	      filters: filters,
		// 	      urlParameters: {
		// 	         "search": desc + "," +cant
		// 	      },
		// 	      success: function (result, status, xhr) {
		// 	        result = JSON.parse(result.results[0].Json);
			        
		// 	        if(result[0].type === undefined){
		// 	            var oModelJson = new sap.ui.model.json.JSONModel(result);
		// 	            sap.ui.getCore().byId("xmlFilterMaterial2--tbFilterMaterial").setModel(oModelJson);
		// 	        }else{
		// 	          MessageBox.information(result[0].message);
		// 	            sap.ui.getCore().byId("xmlFilterMaterial2--tbFilterMaterial").setModel(new JSONModel());
		// 	        }
			        
		// 	        sap.ui.core.BusyIndicator.hide();
		// 	      },
		// 	      error: function (xhr, status, error) {
		// 	          sap.ui.core.BusyIndicator.hide();
		// 	          MessageBox.error(xhr.statusText);
		// 	      }
			      
		// 	  });
		// },
		// onAcceptMat2: function(){
		//   var oTable = sap.ui.getCore().byId("xmlFilterMaterial2--tbFilterMaterial");
		//   var tokenTmp = [];
		//   var contexts = oTable.getSelectedContexts();
		
		//   if(contexts.lenght != 0){
		//       var items = contexts.map(function(c) {
		//           return c.getObject();
		//       });
		
		//       var oView = this.getView();
		//       var oMultiInput1 = oView.byId("frgReporteSolicitud--material2");
		      
		//       $.each(items, function(index, item){
		//           oMultiInput1.addToken(new Token({text: item.matnr, key: item.matnr}));
		//       });
		
		//       this._oDialog11.destroy();
		//   }
		//   else{
		//       sap.m.MessageBox.error("Debe seleccionar por lo menos un material");
		//   }
		// },
		// oEscape2: function() {
		//   this._oDialog11.destroy();
		// },
      // ########################################################################################
      // ##################   Reporte OC
      onBeforeTBL: function(oEvent){
        sap.ui.core.BusyIndicator.show(0);
        var aFilter = [];
        
        var OC = this.getView().byId("frgReporte--txtNumeroOc").getValue();
        var FEC_INI = this.getView().byId("frgReporte--txtFechaInicio").getValue();
        var FEC_FIN = this.getView().byId("frgReporte--txtFechaFinal").getValue();
          
        var currentFormattedDate1 = new Date(FEC_INI+" 05:00");
        var currentFormattedDate2 = new Date(FEC_FIN+" 05:00");
    
        if (OC != "") {
          aFilter.push(
            new Filter("Ebeln", FilterOperator.EQ, OC)
          );
        }

        if(FEC_INI != "" && FEC_FIN != ""){
          aFilter.push(
            new Filter("Bedat", FilterOperator.BT, currentFormattedDate1, currentFormattedDate2)
          );
        }
      
        oEvent.mParameters.bindingParams.filters = aFilter;
      },
        
      buscarReporte: function(oEvent) {
    	ReadyTableOC = true;
          if (isMobile){
            this.getView().byId("frgReporte--ST_REPORTE1").rebindTable();
            this.getView().byId("frgReporte--ST_REPORTE2").rebindTable();
          }else{
            this.getView().byId("frgReporte--ST_REPORTE1").rebindTable();

          }

      },
      onVolverOC: function(){
      	tbOCuse = "frgReporte--ST_REPORTE2";

        this.getView().byId("frgReporte--ST_REPORTE1").setVisible(false);
        this.getView().byId("frgReporte--botonVolver").setVisible(false);
        this.getView().byId("frgReporte--ST_REPORTE2").setVisible(true);

        clickoc = clk_moc;
        this.goToOC(clickoc);

        if(clickoc == 1) this.getView().byId("frgReporte--btnAnterior").setEnabled(false);
        else this.getView().byId("frgReporte--btnAnterior").setEnabled(true);
      },
      onLoadTOC: function(oEvent){
        sap.ui.core.BusyIndicator.hide();
    		var tblcant = this.getView().byId(tbOCuse).getTable().getItems().length;
    		if(tblcant == 0){
    		
    		this.getView().byId("frgReporte--btnSiguiente").setEnabled(false);
    		this.getView().byId("frgReporte--btnAnterior").setEnabled(false);
    		
    		}else{
    		
    		this.getView().byId("frgReporte--btnSiguiente").setEnabled(true);
    		this.getView().byId("frgReporte--btnAnterior").setEnabled(true);
    		
    		}
		
    		this.goToOC(clickoc);
    		
    		if(clickoc == 1) this.getView().byId("frgReporte--btnAnterior").setEnabled(false);
    		else this.getView().byId("frgReporte--btnAnterior").setEnabled(true);
    		//Validación cuando no hay datos
    		if(ReadyTableOC == true){
    			if(tblcant == 0){
    				sap.m.MessageBox.error("No existen datos a Mostrar");
    			}
    		}
      },
      onLoadMOC: function(oEvent){
        sap.ui.core.BusyIndicator.hide();
    		var tblcant = this.getView().byId(tbOCuse).getTable().getItems().length;
    		
    		if(tblcant == 0){
    		
    		this.getView().byId("frgReporte--btnSiguiente").setEnabled(false);
    		this.getView().byId("frgReporte--btnAnterior").setEnabled(false);
    		
    		}else{
    		this.getView().byId("frgReporte--btnSiguiente").setEnabled(true);
    		this.getView().byId("frgReporte--btnAnterior").setEnabled(true);
    		}
    		
    		this.goToOC(clickoc);
    		
    		if(clickoc == 1) this.getView().byId("frgReporte--btnAnterior").setEnabled(false);
    		else this.getView().byId("frgReporte--btnAnterior").setEnabled(true);
      },
      onPressItemOC: function(){
        tbOCuse = "frgReporte--ST_REPORTE1";

        this.getView().byId("frgReporte--ST_REPORTE1").setVisible(true);
        this.getView().byId("frgReporte--botonVolver").setVisible(true);
        this.getView().byId("frgReporte--ST_REPORTE2").setVisible(false);

        clickoc = clk_toc;
        this.goToOC(clickoc);

        if(clickoc == 1) this.getView().byId("frgReporte--btnAnterior").setEnabled(false);
        else this.getView().byId("frgReporte--btnAnterior").setEnabled(true);
         
      },
		  onVolverOC: function(){
        tbOCuse = "frgReporte--ST_REPORTE2";

        this.getView().byId("frgReporte--ST_REPORTE1").setVisible(false);
        this.getView().byId("frgReporte--botonVolver").setVisible(false);
        this.getView().byId("frgReporte--ST_REPORTE2").setVisible(true);

        clickoc = clk_moc;
        this.goToOC(clickoc);

        if(clickoc == 1) this.getView().byId("frgReporte--btnAnterior").setEnabled(false);
        else this.getView().byId("frgReporte--btnAnterior").setEnabled(true);
      },
      onShowOC: function(oEvent){
        clickoc = 1;
        this.goToOC(clickoc);
      },
      rangeOC: function(oInit, oEnd, oData){
        $.each(oData, function(key, item){
            var sId = item.sId;

            if(key >= oInit && key <= oEnd){
             sap.ui.getCore().byId(sId).setVisible(true);
            }else{                    
             sap.ui.getCore().byId(sId).setVisible(false);
            }
        });
      },
      goToOC: function(oClick){
        var oSelectItem = this.getView().byId("frgReporte--sShow").getSelectedKey();
        var oTable =  this.getView().byId(tbOCuse).getTable().getItems();
        var oTotal = oTable.length;
        var oShow = Math.ceil(oTotal / oSelectItem);

        if(oClick <= oShow){

           if(oShow == oClick){
              this.getView().byId("frgReporte--btnSiguiente").setEnabled(false);
           }else{
              this.getView().byId("frgReporte--btnSiguiente").setEnabled(true);
           }
           
           this.rangeOC(oSelectItem * (oClick - 1), (oSelectItem * oClick) - 1, oTable);
        }

        if(oClick <= 1){
          this.getView().byId("frgReporte--btnAnterior").setEnabled(false);
        }    
      },
      goNextOC: function(){
        this.goToOC(clickoc += 1); 

        if(tbOCuse == "frgReporte--ST_REPORTE2") clk_moc = clickoc;
        else clk_toc = clickoc;

        if(clickoc != 0){
            this.getView().byId("frgReporte--btnAnterior").setEnabled(true);
        }else{
            this.getView().byId("frgReporte--btnAnterior").setEnabled(false);
        }
      },
      goPreviousOC: function(){
        this.goToOC(clickoc -= 1);

        if(tbOCuse == "frgReporte--ST_REPORTE2") clk_moc = clickoc;
        else clk_toc = clickoc;

        if(clickoc <= 1){
            this.getView().byId("frgReporte--btnAnterior").setEnabled(false);
        }else{
            this.getView().byId("frgReporte--btnAnterior").setEnabled(true);
        }
      },

      validaNumberM: function(thes){
        var id=thes.sId;
            
        var vista = thes;
        var texto = vista.getValue();
        
        if(parseFloat(texto) != texto && texto != ""){
          vista.setValueState("Error");
          vista.setValueStateText("Sólo se permite el ingreso de números");
          return true;
        }else{
          vista.setValueState("None");
          vista.setValueStateText("");
          return false;
        }
      },

      // Código de validación de dato tipo texto sin números y sin espacios
      validaNumberV: function(e){
        var texto = e.getValue().replace(/,/gi, "");
        
        if(parseFloat(texto) != texto && texto != ""){
          e.setValueState("Error");
          e.setValueStateText("Sólo se permite el ingreso de números");
          return true;
        }else{
          e.setValueState("None");
          e.setValueStateText("");
          return false;
        }
      },

      imprimir: function(){
        var seleccion = "";
        var selec = this.getView().byId("frgReporte--tbl_reporte1")._aSelectedPaths;

        var seleccion = this.getView().byId("frgReporte--tbl_reporte1").getModel().getProperty(selec[0]);

        if (selec.length != 1) {
          var dialog = new Dialog({
            title: 'Aviso',
            type: 'Message',
            state: 'Warning',
            content: new Text({
              text: 'Debe seleccionar un registro para descargar el PDF.'
            }),
            beginButton: new Button({
              text: 'OK',
              press: function () {
                dialog.close();
              }
            }),
            afterClose: function() {
              dialog.destroy();
            }
          });

          dialog.open();

        } else {
          sap.ui.core.BusyIndicator.show(0);
          delete seleccion.__metadata;
          var thes = this;
          var filter = [];
          var filterPar = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, "70");
              filter.push(filterPar);

          var filterPar = new sap.ui.model.Filter("Parametros", sap.ui.model.FilterOperator.EQ, seleccion.Ebeln);
              filter.push(filterPar);

          // Obteniendo los datos del servicio odata
          var oModel = new sap.ui.model.odata.v2.ODataModel(urlGlobalRS, true);

          //EntitySet es el entityset del metadata 
          oModel.read("/PRC_VEHICULOSSet" ,{
          method: "GET",
          filters: filter,
            success: function(result, status, xhr){
              console.log(result);
              if(JSON.parse(result.results[0].Json).type == undefined || JSON.parse(result.results[0].Json).type != 'E'){
                var data =  thes.hexToBase64(result.results[0].Json);
                thes.download(data, "Reporte", "application/pdf");
              }else{
                sap.m.MessageBox.error(result[0].message);
              }
              sap.ui.core.BusyIndicator.hide();
            },
            error: function(xhr,status,error){
              sap.m.MessageBox.error(xhr.statusText);
              sap.ui.core.BusyIndicator.hide();
            },
            urlParameters: {
              search: "GET"
            }
          });
        }
      },

      //Convertir hexagesimal a base64
      hexToBase64: function(hexstring) {
        return btoa(hexstring.match(/\w{2}/g).map(function(a) {
          return String.fromCharCode(parseInt(a, 16));
        }).join(""));
      },


      //Decargar PDF
      download: function(base64, codigo, type) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:' + type +';base64,' + base64);
        element.setAttribute('download', codigo);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
      },
      onCompleteFormat: function(txt, cant) {
			var rtn = "";
			var cycles = cant - txt.length;
			for (var i = 0; i < cycles; i++) {
				rtn += "0";
			}
			return rtn + txt;
		},
      // ########################################################################################
      // ##################  FIN Reporte OC     
//{@WVF001 Metodo de descarga de archivos excel
    onBeforeExportoc: function(oEvt) {
            var mExcelSettings = oEvt.getParameter("exportSettings");
            // GW export
            if (mExcelSettings.url) {
                return;
            }
            // For UI5 Client Export --> The settings contains sap.ui.export.SpreadSheet relevant settings that be used to modify the output of excel

            // Disable Worker as Mockserver is used in explored --> Do not use this for real applications!
            mExcelSettings.worker = false;
            
            //Modificar formato de las columnas 
             mExcelSettings.workbook.columns[2].type = "Date";        
        },
    onBeforeExportsp: function(oEvt) {
            var mExcelSettings = oEvt.getParameter("exportSettings");
            // GW export
            if (mExcelSettings.url) {
                return;
            }
            // For UI5 Client Export --> The settings contains sap.ui.export.SpreadSheet relevant settings that be used to modify the output of excel

            // Disable Worker as Mockserver is used in explored --> Do not use this for real applications!
            mExcelSettings.worker = false;
            
            //Modificar formato de las columnas    
             mExcelSettings.workbook.columns[2].type = "Date";         
             mExcelSettings.workbook.columns[6].type = "Date"; 
    
        },
        //}@WVF001 Metodo de descarga de archivos excel
                                 
  });
});
