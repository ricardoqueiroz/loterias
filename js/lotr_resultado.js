$(document).ready(function() {


function carrega_concurso(no_concurso){

	document.getElementById("carregando1").style.display = "block";
	
	if (!no_concurso)
	{
		//Abre a url
		v_d = new Date();
		_dadoNull = v_d.getTime();
		xmlhttp.open("GET", "megasena_pesquisa_new.asp?f_megasena=" + _dadoNull,true);
	}
	else
	{
		//Abre a url
		xmlhttp.open("GET", "megasena_pesquisa_new.asp?submeteu=sim&opcao=concurso&txtConcurso="+no_concurso,true);
	}

    //Executada quando o navegador obtiver o código
    xmlhttp.onreadystatechange=function() {

		if (xmlhttp.readyState==4)
		{
			//Lê o texto
            var texto=xmlhttp.responseText;

            //Desfaz o urlencode
			texto = texto.split("|");
			
			var inner_conc = "";
			var inner_acumulou = "";
			var inner_menu = "";
			var imagem_anterior = texto[9];
			var imagem_posterior = texto[10];
			var auditorio = texto[14];
			var inner_menu_dt = "";
			var data_conc= texto[11];
			var loca_data = "";
			var valor_prx = texto[18];
			var prx_concurso = texto[16];
			var valor_prx_concurso = "";
			var valor_sorteio_natal = "";
			

			if (texto[0] == "")
			{
				//alert ('Não existe concurso!');
				document.getElementById("span_conc").innerHTML = texto[1];
				document.getElementById("tabela_jogo").style.display = "none";
				document.getElementById("titulo_premiacao").style.display = "none";
				document.getElementById("tabela_premiacao").style.display = "none";
				document.getElementById("acumulou_resultado").style.display = "none";
				document.getElementById("texto").style.display = "none";
				document.getElementById("observacao").style.display = "none";
				document.getElementById("observacao").style.borderBottom = "none";
				document.getElementById("observacao").innerHTML = "";
				document.getElementById("menu_conc_nav").style.display = "none";
				document.getElementById("msg_concurso").style.display = "block";
				document.getElementById("msg_concurso").innerHTML = "<div id=\"div_msg_concurso\">Não existe concurso!</div>";
				document.getElementById("tabela_ganhadores").style.display = "none";
				document.getElementById("valor_prx_concurso").style.display = "none";
				document.getElementById("valor_sorteio_natal").style.display = "none";
				document.getElementById("vr_arrecadado").style.display = "none";

			//06.09.2006
			document.getElementById("dtitcrescenteDiv").style.display = "none";
			document.getElementById("dtitsorteioDiv").style.display = "none";


			}else{
				if(texto[2] == ""){
					//alert('naum exite registro de concurso');
					document.getElementById("span_conc").innerHTML = texto[0];
					document.getElementById("tabela_jogo").style.display = "none";
					document.getElementById("titulo_premiacao").style.display = "none";
					document.getElementById("tabela_premiacao").style.display = "none";
					document.getElementById("acumulou_resultado").style.display = "none";
					document.getElementById("msg_concurso").style.display = "none";
					document.getElementById("texto").style.display = "none";
					document.getElementById("tabela_ganhadores").style.display = "none";
					document.getElementById("observacao").style.display = "block";
					document.getElementById("observacao").innerHTML = texto[15];
					document.getElementById("vr_arrecadado").style.display = "none";
					loca_data = "";
				}else{
					//alert('cheio');
					//Input
					document.getElementById("tabela_jogo").style.display = "block";
					document.getElementById("titulo_premiacao").style.display = "block";
					document.getElementById("tabela_premiacao").style.display = "block";
					document.getElementById("acumulou_resultado").style.display = "block";
					document.getElementById("msg_concurso").style.display = "none";
					document.getElementById("menu_conc_nav").style.display = "block";
					document.getElementById("texto").style.display = "block";
					document.getElementById("data_conc").value = data_conc;
					document.getElementById("num_sorteados").value = texto[2];
					document.getElementById("acumulou").value = texto[1];
					//Numero do concurso
					document.getElementById("span_conc").innerHTML = texto[0];
					
					//[Inicio] data e local
					var local_sort = ""
					if (auditorio == "A"){
						local_sort = "Auditório da CAIXA";
					}else{
						 if(auditorio == "C"){
							 local_sort = "Caminhão da Sorte";
						 }else{
							 local_sort = "";
						 }
						
					}
					
					loca_data += "<div id=\"menu_concurso_bt_data\">"
					loca_data += "<a href=\"#\" class=\"tooltip\"><b>"+ data_conc+"</b> (" + local_sort.substring(0,9) + "...)";
					
					if (texto[12] != ""){
						//loca_data += "&nbsp;<b>Realizado em " + texto[12].substring(0,1) + ".../" + texto[13] + "</b>";
						loca_data += "<br /><b>Realizado em " + texto[12].substring(0,5) + "../" + texto[13] + "</b>";
					}
					loca_data += "<br/><span><b>"+ data_conc+"</b> " + local_sort;
					
					if (texto[12] != ""){
						loca_data += "<br /> Realizado em " + texto[12] + "/" + texto[13] + "</span></a>";
					}
					
					loca_data += "</a></div>"
					

					//[Fim   ] data e local
					
					//Verifica ganhadores por estado
					var img_ganhadores = "<br><img src=\"/loterias/_images/title/tit_megasena_ganhadores_estado.jpg\" border=\"0\"/>"
					if (texto[19] == ""){
						document.getElementById("tabela_ganhadores").style.display = "none";
					}else{
						var tabela_ganhadores = img_ganhadores + texto[19];
						document.getElementById("tabela_ganhadores").style.display = "block";
						document.getElementById("tabela_ganhadores").innerHTML = tabela_ganhadores;
					}

					//detalhes_acumulou e Estimativa do premio
					if ((texto[21] == "") || (texto[21] == "0,00")) {
						if ((texto[1] == "0,00") || (texto[1] == "")){
							document.getElementById("acumulou_resultado").style.display = "none";
						}else{
							document.getElementById("acumulou_resultado").style.display = "block";
							inner_acumulou += "<div id=\"detalhes_resultado\">";
							inner_acumulou += "<strong class=\"img_acumulou\" style=\"font-size:20px;\">Acumulou</strong><br /><br />";
							inner_acumulou += "Valor acumulado: <br/>";
							inner_acumulou += "<span style=\"color:#666; font-size:18px; font-weight: bold;\">R$ </span> <span style=\"color:#229551; font-size:24px; padding-bottom:550px; \">"+ texto[1] +"</span><br />&nbsp;";
							inner_acumulou += "</div>";
							
							document.getElementById("acumulou_resultado").innerHTML = inner_acumulou;
						}
					}else{
						if ((texto[1] == "0,00") || (texto[1] == "")){
							document.getElementById("acumulou_resultado").style.display = "block";
							inner_acumulou += "<div id=\"detalhes_resultado\">";
							inner_acumulou += "<span style=\"font-size: 14px; font-weight: bold;\">Estimativa de Prêmio</span><br />";
							inner_acumulou += "<span style=\"color: rgb(102, 102, 102); font-size: 24px; font-weight:bold;\">R$</span> <span style=\"font-size: 24px; color: rgb(34, 149, 81); font-weight: bold;\">" + texto[21] + "</span><br />";
							inner_acumulou += "<span style=\"font-size: 13px;\">*para o próximo concurso, a ser realizado "+ texto[22] +"</span> <br /><br />";
							inner_acumulou += "</div>";
							
							document.getElementById("acumulou_resultado").innerHTML = inner_acumulou;
						}else{
							document.getElementById("acumulou_resultado").style.display = "block";
							inner_acumulou += "<div id=\"detalhes_resultado\">";
							inner_acumulou += "<strong class=\"img_acumulou\" style=\"font-size:20px;\">Acumulou</strong><br /><br />";
							inner_acumulou += "<span style=\"font-size: 16px; font-weight: bold;\">Estimativa de Prêmio</span><br />";
							inner_acumulou += "<span style=\"color: rgb(102, 102, 102); font-size: 20px; font-weight:bold;\">R$</span> <span style=\"font-size: 26px; color: rgb(34, 149, 81); font-weight: bold;\">" + texto[21] + "</span><br />";
							inner_acumulou += "<span style=\" font-size:13px;\">*para o próximo concurso, a ser realizado "+ texto[22] +"</span><br /><br />";
							inner_acumulou += "<div id=\"valor_acumulado\">";
							inner_acumulou += "Valor acumulado: <br/>";
							inner_acumulou += "<span style=\"color:#666; font-size:18px; font-weight: bold;\">R$ </span> <span style=\"color:#229551; font-size:20px; padding-bottom:550px; \">"+ texto[1] +"</span>";
							inner_acumulou += "</div>";
							inner_acumulou += "</div>";
							
							document.getElementById("acumulou_resultado").innerHTML = inner_acumulou;
						}
					}
					
					//Resultados
					//document.getElementById("observacao").innerHTML = texto[15]; //Observacao

					document.getElementById("sorteio1").innerHTML = texto[2];	//Numeros sorteados

					//alert(texto[20]);	// 05.09.2006
					document.getElementById("sorteio2").innerHTML = texto[20];	//Numeros sorteados - ordem crescente
					//06.09.2006
					//mostra_sorteio()
					mostra_crescente()

					
					document.getElementById("sena").innerHTML = texto[3];		//Sena
					document.getElementById("premio_sena").innerHTML = texto[4];

					document.getElementById("quina").innerHTML = texto[5];		//Quina
					document.getElementById("quina_premio").innerHTML = texto[6];

					document.getElementById("quadra").innerHTML = texto[7];		//Quadra
					document.getElementById("quadra_premio").innerHTML = texto[8];

					//Valor Arrecadado 
					if ((texto[24] == "") || (parseInt(texto[24]) == 0))
					
					{
					
						document.getElementById("vr_arrecadado").style.display = "none";
					
					}else{
					
						document.getElementById("vr_arrecadado").style.display = "block";
					
						document.getElementById("vr_arrecadado").innerHTML = "<span style=\"font-size:14px; font-weight: bold;\">Arrecadação Total:</span> <span style=\"color: rgb(102, 102, 102); font-size: 18px; font-weight:bold;\"> R$</span> <span style=\"font-size: 18px; color:green; font-weight: bold;\">" + texto[24] + "</span>";
					
					}


				}



				//Monta o menu
				if(imagem_posterior == ""){
					inner_menu += "<div id=\"menu_concurso_bt_ant\">" + imagem_anterior + "</div>";
					inner_menu += loca_data;
					inner_menu += "<div id=\"menu_concurso_bt_prx\"><span class=\"btn_off_prx_conc\"></span></div>";
				}else{
					if(imagem_anterior == ""){
						inner_menu += "<div id=\"menu_concurso_bt_ant\"><span class=\"btn_off_ant_conc\"><span></div>"
						inner_menu += loca_data;
						inner_menu += "<div id=\"menu_concurso_bt_prx\">"+ imagem_posterior +"</div>"
					} else{
						inner_menu += "<div id=\"menu_concurso_bt_ant\">" + imagem_anterior + "</div>"
						inner_menu += loca_data;
						inner_menu += "<div id=\"menu_concurso_bt_prx\">"+ imagem_posterior +"</div>"
					}
				}
				document.getElementById("menu_conc_nav").style.display = "block";
				document.getElementById("menu_conc_nav").innerHTML = inner_menu;

				//FINAL 5 e 0

				valor_prx_concurso += "<span style=\"color: #666666;\">Valor acumulado para o pr&oacute;ximo concurso de final ";
				if ((texto[18] == "0,00") || (texto[18] == ""))
				{
					valor_prx_concurso = "";
					document.getElementById("valor_prx_concurso").style.display = "none";
					document.getElementById("valor_prx_concurso").innerHTML = "";
				}
				else
				{
					if (texto[17] == 5)
					{
						valor_prx_concurso += " cinco ";
					}
					else
					{
						valor_prx_concurso += " zero ";
					}

					valor_prx_concurso += "(" + texto[16] + "):</span><br />";
					valor_prx_concurso += "<span style = \"color: #666; font-size: 14px; font-weight: bold;\">R$ </span> </b><span style=\"color :#229551; font-size: 18px;\">" + texto[18] + "</span><br /><br />";

					document.getElementById("valor_prx_concurso").style.display = "block";
					document.getElementById("valor_prx_concurso").innerHTML = valor_prx_concurso;
				}

				//valor sorteio especial de natal SISOL00283200				
				//valor_sorteio_natal = "<span style=\"color: #666666;\">Valor acumulado para o sorteio especial de Natal ";
				//valor sorteio especial de natal SISOL00283200				
				// Alterado em: 17/02/2009 - F541785;
				valor_sorteio_natal = "<span style=\"color: #666666;\">Valor acumulado para o sorteio da Mega da Virada ";
				if ((texto[23] == '0,00') || (texto[23] == ''))
				{
					valor_sorteio_natal = "";
					document.getElementById("valor_sorteio_natal").style.display = "none";
					document.getElementById("valor_sorteio_natal").innerHTML = "";
				}
				else
				{
					valor_sorteio_natal += ":</span><br />";
					valor_sorteio_natal += "<span style = \"color: #666; font-size: 14px; font-weight: bold;\">R$ </span> </b><span style=\"color :#229551; font-size: 18px;\">" + texto[23] + "</span>";
					document.getElementById("valor_sorteio_natal").innerHTML = valor_sorteio_natal;
				}

				//OBSERVACAO
				if (texto[15] == "")
				{
					document.getElementById("observacao").style.display = "none";
					document.getElementById("observacao").style.borderBottom = "none";
				}else{
					document.getElementById("observacao").style.display = "block";
					document.getElementById("observacao").style.borderBottom = "#CCC 1px solid";
					document.getElementById("observacao").innerHTML = texto[15];
				}

			}
		}
		document.getElementById("carregando1").style.display = "none";
	}
	xmlhttp.send(null);
	if (!no_concurso){
		document.getElementById('destaque_publicitario').innerHTML = document.getElementById('flashpublicidade').value;
	}
}

function carrega_impressao(no_concurso){
	
	if (!no_concurso)
	{
		//Abre a url
		xmlhttpimpressao.open("GET", "megasena_pesquisa_new.asp",true);
	}
	else
	{
		//Abre a url
		xmlhttpimpressao.open("GET", "megasena_pesquisa_new.asp?submeteu=sim&opcao=concurso&txtConcurso="+no_concurso,true);
	}

	//Executada quando o navegador obtiver o código
	xmlhttpimpressao.onreadystatechange=function() {

		if (xmlhttpimpressao.readyState==4)
		{
			//Lê o texto
			var texto=xmlhttpimpressao.responseText;

			//Desfaz o urlencode
			texto = texto.split("|");

			var valor_prx_concurso = "";
			var inner_acumulou = "";
			var valor_sorteio_natal = "";
			
			//data do concurso
			document.getElementById("data_concurso").innerHTML = texto[11];
			//sorteio
			//Resultados
			document.getElementById("sorteio1").innerHTML = texto[2];	//Numeros sorteados
			document.getElementById("sorteio2").innerHTML = texto[20];	//Numeros sorteados
			document.getElementById("sena").innerHTML = texto[3];		//Sena
			document.getElementById("premio_sena").innerHTML = texto[4];
			document.getElementById("quina").innerHTML = texto[5];		//Quina
			document.getElementById("premio_quina").innerHTML = texto[6];
			document.getElementById("quadra").innerHTML = texto[7];		//Quadra
			document.getElementById("premio_quadra").innerHTML = texto[8];

			//detalhes_acumulou
			//detalhes_acumulou e Estimativa do premio
			if ((texto[21] == "") || (texto[21] == "0,00")) {
				if ((texto[1] == "0,00") || (texto[1] == "")){
					document.getElementById("acumulou").style.display = "none";
				}else{
					document.getElementById("acumulou").style.display = "block";
					inner_acumulou += "<div id=\"detalhes_resultado\">";
					inner_acumulou += "<span style=\"font-size: 12px; font-weight: bold;\">Estimativa de Prêmio</span><br />";
					inner_acumulou += "Valor acumulado: <br/>";
					inner_acumulou += "<span style=\"color:#666; font-size:18px; font-weight: bold;\">R$ </span> <span style=\"color:#229551; font-size:24px; padding-bottom:550px; \">"+ texto[1] +"</span><br />&nbsp;";
					inner_acumulou += "</div>";
					
					document.getElementById("acumulou").innerHTML = inner_acumulou;
				}
			}else{
				if ((texto[1] == "0,00") || (texto[1] == "")){
					document.getElementById("acumulou").style.display = "block";
					inner_acumulou += "<div id=\"detalhes_resultado\">";
					inner_acumulou += "<span style=\"font-size: 12px; font-weight: bold;\">Estimativa de Prêmio</span><br />";
					inner_acumulou += "<span style=\"color: rgb(102, 102, 102); font-size: 22px; font-weight:bold;\">R$</span> <span style=\"font-size: 22px; color: rgb(34, 149, 81); font-weight: bold;\">" + texto[21] + "</span><br />";
					inner_acumulou += "*para o próximo concurso, a ser realizado "+ texto[22] +" <br /><br />";
					inner_acumulou += "</div>";
					
					document.getElementById("acumulou").innerHTML = inner_acumulou;
				}else{
					document.getElementById("acumulou").style.display = "block";
					inner_acumulou += "<div id=\"detalhes_resultado\">";
					inner_acumulou += "<img src=\"/loterias/_images/img_acumulou.jpg\" width=\"229\" height=\"35\" /><br /><br />";
					inner_acumulou += "<span style=\"font-size: 12px; font-weight: bold;\">Estimativa de Prêmio</span><br />";
					inner_acumulou += "<span style=\"color: rgb(102, 102, 102); font-size: 22px; font-weight:bold;\">R$</span> <span style=\"font-size: 22px; color: rgb(34, 149, 81); font-weight: bold;\">" + texto[21] + "</span><br />";
					inner_acumulou += "*para o próximo concurso, a ser realizado "+ texto[22] +" <br /><br />";
					inner_acumulou += "<div id=\"valor_acumulado\">";
					inner_acumulou += "Valor acumulado: <br/>";
					inner_acumulou += "<span style=\"color:#666; font-size:16px; font-weight: bold;\">R$ </span> <span style=\"color:#229551; font-size:18px; padding-bottom:550px; \">"+ texto[1] +"</span>";
					inner_acumulou += "</div>";
					inner_acumulou += "</div>";
					
					document.getElementById("acumulou").innerHTML = inner_acumulou;
				}
			}
			
			//FINAL 5 e 0
			valor_prx_concurso += "<span style=\"color: #666666;\">Valor acumulado para o pr&oacute;ximo concurso de final ";
			if ((texto[18] == "0,00") || (texto[18] == ""))
			{
				valor_prx_concurso = "";
				document.getElementById("valor_prx_concurso").style.display = "none";
				document.getElementById("valor_prx_concurso").innerHTML = "";
			}
			else
			{
				if (texto[17] == 5)
				{
					valor_prx_concurso += " cinco ";
				}
				else
				{
					valor_prx_concurso += " zero ";
				}

				valor_prx_concurso += "(" + texto[16] + "):</span><br />";
				valor_prx_concurso += "<span style = \"color: #666; font-size: 14px; font-weight: bold;\">R$ </span> </b><span style=\"color :#229551; font-size: 18px;\">" + texto[18] + "</span><br />";
				document.getElementById("valor_prx_concurso").innerHTML = valor_prx_concurso;
				//Verifica ganhadores por estado
				if (texto[19] == ""){
					document.getElementById("tabela_ganhadores").style.display = "none";
				}else{
					var cabecalho = "<div id=\"titulo_premiacao\"><span style=\"font-size:12px; font-weight:bold;\">GANHADORES POR ESTADO</span></div><br />"
					document.getElementById("tabela_ganhadores").style.display = "block";
					document.getElementById("tabela_ganhadores").innerHTML = cabecalho + texto[19];
				}
			}
			//valor sorteio especial de natal SISOL00283200				
			//valor_sorteio_natal = "<span style=\"color: #666666;\">Valor acumulado para o sorteio especial de Natal ";
			//valor sorteio especial de natal SISOL00317338				
			// Alterado em: 31/03/2009 - F541785
			valor_sorteio_natal = "<span style=\"color: #666666;\">Valor acumulado para o sorteio da Mega da Virada ";
			if ((texto[23] == '0,00') || (texto[23] == ''))
			{
				valor_sorteio_natal = "";
				document.getElementById("valor_sorteio_natal").style.display = "none";
				document.getElementById("valor_sorteio_natal").innerHTML = "";
			}
			else
			{
				valor_sorteio_natal += ":<br />";
				valor_sorteio_natal += "<span style = \"color: #666; font-size: 14px; font-weight: bold;\">R$ </span> </b><span style=\"color :#229551; font-size: 18px;\">" + texto[23] + "</span></span>";
				document.getElementById("valor_sorteio_natal").innerHTML = valor_sorteio_natal;
			}
			
			//Valor Arrecadado 
			if ((texto[24] == "") || (texto[24] == "0,00"))
			{
				document.getElementById("vr_arrecadado").style.display = "none";
			}else{
				document.getElementById("vr_arrecadado").style.display = "block";
				document.getElementById("vr_arrecadado").innerHTML = "<span style=\"font-size:12px; font-weight: bold;\">Arrecadação Total:</span> <span style=\"color: rgb(102, 102, 102); font-size: 16px; font-weight:bold;\"> R$</span> <span style=\"font-size: 16px; color:green; font-weight: bold;\">" + texto[24] + "</span>";
			}

			
		}
	}
	xmlhttpimpressao.send(null);

}


function submete_div(concurso) {
	document.frmPortal1.submeteu.value = "sim"
	document.frmPortal1.opcao.value = "concurso"
	document.frmPortal1.txtConcurso.value = concurso
	document.frmPortal1.submit()
}

function mostra_sorteio() {
//sorteio1 - sorteio2
//dtitcrescenteDiv - dtitsorteioDiv
	//06.09.2006
	document.getElementById("sorteio2").style.display = "none";
	document.getElementById("dtitcrescenteDiv").style.display = "none";
		document.getElementById("sorteio1").style.display = "";
		document.getElementById("dtitsorteioDiv").style.display = "";
	
	//document.getElementById("dtitcrescenteDiv").style.display = "none";
	//document.getElementById("dtitsorteioDiv").style.display = "block";
	//document.getElementById("dsorteioDiv").style.display = "none";
	//document.getElementById("dordemsorteioDiv").style.display = "block";
}
	

function mostra_crescente() {
//sorteio1 - sorteio2
//dtitcrescenteDiv - dtitsorteioDiv
	//06.09.2006
	document.getElementById("sorteio1").style.display = "none";
	document.getElementById("dtitsorteioDiv").style.display = "none";
	document.getElementById("sorteio2").style.display = "";
	document.getElementById("dtitcrescenteDiv").style.display = "";

	//document.getElementById("dtitsorteioDiv").style.display = "none";
	//document.getElementById("dtitcrescenteDiv").style.display = "block";
	//document.getElementById("dordemsorteioDiv").style.display = "none";
	//document.getElementById("dsorteioDiv").style.display = "block";
}

		

function imprimir_quina()
{
	var numero_concurso = document.getElementById("span_conc").innerHTML;
	
	//window.open('/loterias/loterias/megasena/megasena_impressao.asp?nu_conc='+numero_concurso+'&dt_conc='+data_concurso+'&resultado='+num_sorteados+'&acumulou='+acumulou+'&sena='+sena+'&sena_premio='+sena_premio+'&quina='+quina+'&quina_premio='+quina_premio+'&quadra='+quadra+'&quadra_premio='+quadra_premio+'&valor_prx='+valor_prx+'&prx_concurso='+prx_concurso,"", 'width=800,height=600');
	window.open('/loterias/loterias/megasena/megasena_impressao_new.asp?submeteu=sim&opcao=concurso&txtConcurso='+numero_concurso ,"", 'width=800,height=620,scrollbars=1');
}

