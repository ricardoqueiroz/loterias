//<![CDATA[
/* ----------------------------------------------------------
   nrDznCadaCrt	=> número de dezenas jogadas por cartão   sena        	=> número de dezenas por cartão (padrão)   quina       	=> cinco acertos   quadra      	=> quatro acertos   dznXcart    	=> número de dezenas no cartão    totCombs    	=> total de combinações   qtdCarts    	=> número de cartões gerados   jogo         => array que contém as dezenas jogadas   partic       => número de participantes   valAposta    => valor da aposta   valPorCrt    => valor por cartão   numApsCrt    => número de apostas por cartão   prob         => Probabilidade por dezenas em cada cartão   _6acertos    => Quantas senas, quinas e quadras por cartão   _5acertos    => Quantas senas, quinas e quadras por cartão   _4acertos    => Quantas senas, quinas e quadras por cartão
Mega-Sena, Quina, Dupla Sena, Loteca e Lotofácil (apostas de 16, 17 e 18 números).  
megasena: 100duplasena: 50loteca: 50quina: 25lotofácil: 25 , 17Lotofácil:12, 16input[type=checkbox], input[type=radio]   ------------------------------------------------------- */
$(document).ready(function() {

	// loadXMLDoc('lotr_query.php?command=CONSULTA_CAIXA&aposta=');
	var dzn = ''; // dezena clicada (do jogo ou do nr. dz por cartão)
	// -----------------------	// PARAMETROS DA MEGASENA	// -----------------------
	var megasena = {		nrDznCadaCrt :  6,		sena         :  6,		quina        :  5,		quadra       :  4,		dznXcart     : 60,		totCombs     :  0,		qtdCarts     :  0,		jogo         : [],		partic       :  0,		valAposta    :  2,		valPorCrt    :  2,		numApsCrt    :  0,		prob         : [{'sena':  0, 'quina':  0, 'quadra':  0}],		_6acertos    : [{'sena':'-', 'quina':'-', 'quadra':'-'}],		_5acertos    : [{'sena':'-', 'quina':'-', 'quadra':'-'}],		_4acertos    : [{'sena':'-', 'quina':'-', 'quadra':'-'}]	};
	// -----------------------	// PARAMETROS DA LOTOFACIL	// -----------------------
	var lotofacil = {		nrDznCadaCrt :  15,		_15ac        :  15,		_14ac        :  14,		_13ac        :  13,		_12ac        :  12,		_11ac        :  11,		dznXcart     : 25,		totCombs     :  0,		qtdCarts     :  0,		jogo         : [],		partic       :  0,		valAposta    :  1.25,		valPorCrt    :  1.25,		numApsCrt    :  1,		prob         : [{'_15ac':  0, '_14ac':  0, '_13ac':  0, '_12ac':  0, '_11ac':  0}],		_15acertos   : 0,		_14acertos   : 0,		_13acertos   : 0,		_12acertos   : 0,		_11acertos   : 0	};
	if (tipo_de_jogo == 'megasena') {
		var cartao_aposta = megasena;		var max_acertos = 'sena';
	} else if (tipo_de_jogo == 'lotofacil') {
		var cartao_aposta = lotofacil;		var max_acertos =  '_15ac'
	};
	if (tipo_de_jogo == 'megasena') {
		cartao_aposta['totCombs'] = comb(cartao_aposta['dznXcart'],cartao_aposta[max_acertos]);
		// Calculo de Probabilidades		cartao_aposta['prob']['sena']   = prob(cartao_aposta,'sena', max_acertos);		cartao_aposta['prob']['quina']  = prob(cartao_aposta,'quina', max_acertos);		cartao_aposta['prob']['quadra'] = prob(cartao_aposta,'quadra', max_acertos);
		// quantidade de acertos		cartao_aposta['_6acertos']['sena']   = acertos(cartao_aposta, 'sena', 6, max_acertos);		cartao_aposta['_6acertos']['quina']  = acertos(cartao_aposta, 'quina', 6, max_acertos);		cartao_aposta['_6acertos']['quadra'] = acertos(cartao_aposta, 'quadra', 6, max_acertos);
		cartao_aposta['_5acertos']['sena']   = acertos(cartao_aposta, 'sena', 5, max_acertos);		cartao_aposta['_5acertos']['quina']  = acertos(cartao_aposta, 'quina', 5, max_acertos);		cartao_aposta['_5acertos']['quadra'] = acertos(cartao_aposta, 'quadra', 5, max_acertos);
		cartao_aposta['_4acertos']['sena']   = acertos(cartao_aposta, 'sena', 4, max_acertos);		cartao_aposta['_4acertos']['quina']  = acertos(cartao_aposta, 'quina', 4, max_acertos);		cartao_aposta['_4acertos']['quadra'] = acertos(cartao_aposta, 'quadra', 4, max_acertos);
		$('#nj_6').addClass("selecionado");		$('#numpart').text(cartao_aposta['partic']);		$('#prbsen').text(cartao_aposta['prob']['sena']);		$('#prbqui').text(cartao_aposta['prob']['quina']);		$('#prbqua').text(cartao_aposta['prob']['quadra']);		$('#_6Asen').text(cartao_aposta['_6acertos']['sena']);		$('#_6Aqui').text(cartao_aposta['_6acertos']['quina']);		$('#_6Aqua').text(cartao_aposta['_6acertos']['quadra']);		$('#_5Asen').text(cartao_aposta['_5acertos']['sena']);		$('#_5Aqui').text(cartao_aposta['_5acertos']['quina']);		$('#_5Aqua').text(cartao_aposta['_5acertos']['quadra']);		$('#_4Asen').text(cartao_aposta['_4acertos']['sena']);		$('#_4Aqui').text(cartao_aposta['_4acertos']['quina']);		$('#_4Aqua').text(cartao_aposta['_4acertos']['quadra']);
	} else if (tipo_de_jogo == 'lotofacil') {
		cartao_aposta['totCombs'] = comb(cartao_aposta['dznXcart'],cartao_aposta[max_acertos]);
		// Calculo de Probabilidades
		cartao_aposta['prob']['_15ac'] = prob(cartao_aposta,'_15ac', max_acertos);		cartao_aposta['prob']['_14ac'] = prob(cartao_aposta,'_14ac', max_acertos);		cartao_aposta['prob']['_13ac'] = prob(cartao_aposta,'_13ac', max_acertos);		cartao_aposta['prob']['_12ac'] = prob(cartao_aposta,'_12ac', max_acertos);		cartao_aposta['prob']['_11ac'] = prob(cartao_aposta,'_11ac', max_acertos);
		// quantidade de acertos		cartao_aposta['_15acertos'] = acertos(cartao_aposta, '_15ac', 15, max_acertos);		cartao_aposta['_14acertos'] = acertos(cartao_aposta, '_14ac', 14, max_acertos);		cartao_aposta['_13acertos'] = acertos(cartao_aposta, '_13ac', 13, max_acertos);		cartao_aposta['_12acertos'] = acertos(cartao_aposta, '_12ac', 12, max_acertos);		cartao_aposta['_11acertos'] = acertos(cartao_aposta, '_11ac', 11, max_acertos);
		$('#nj_6').addClass("selecionado");		$('#numpart').text(cartao_aposta['partic']);		$('#prb15').text(cartao_aposta['prob']['_15ac']);		$('#prb14').text(cartao_aposta['prob']['_14ac']);		$('#prb13').text(cartao_aposta['prob']['_13ac']);		$('#prb12').text(cartao_aposta['prob']['_12ac']);		$('#prb11').text(cartao_aposta['prob']['_11ac']);
		$('#_15A').text(cartao_aposta['_15acertos']);		$('#_14A').text(cartao_aposta['_14acertos']);		$('#_13A').text(cartao_aposta['_13acertos']);		$('#_12A').text(cartao_aposta['_12acertos']);		$('#_11A').text(cartao_aposta['_11acertos']);
	}
	calculaAposta();
	// --------------------	// A CLICK	// --------------------
	$("a").click(function() {
		var href = this.getAttribute('open');        var content = href.substr(href.indexOf('#'));		alert(href);
	});

	// --------------------	// TD CLICK	// --------------------
	$("td").click(function() {
		var tbl  = $(this).parent().parent().parent();				if(tbl.get(0).id=='volante' || tbl.get(0).id=='apostas') {
			var idtd = $(this).get(0).id;	// identificação (id) da célula			var tipo = idtd.substr(0,2);	// nj => tabela jogos por cartão, dz => tabela do jogo (id="nj_xx" ou id="dz_xx")			dzn      = $(this).text();	// conteúdo da célula clicada (uma dezena)			idtd     = '#'+idtd;		// identificador da célula para o JQuery
			// Seleção na tabela de número de dezenas por cartão			// Desmarca a seleção anterior e marca a atual			// nj => número de jogos por cartão						if (tipo=='nj') {
				for (var nr=6; nr<16; nr++) {					njtxt = '#nj_' + nr;
					if ($(njtxt).hasClass("selecionado")) {						$(njtxt).removeClass("selecionado");						$(njtxt).css({"color":"#DC143C", "background-color":"white"});						break;
   					}
				}
				cartao_aposta['nrDznCadaCrt'] = dzn*1;			};
			// verifica se a dezena estava selecionada ou não			// retirando ou adicionando a dezena no array jogo
			if ($(idtd).hasClass("selecionado")) {
				$(idtd).removeClass("selecionado");				$(idtd).css({"color":"#DC143C", "background-color":"white"});
				if (tipo=='dz') {
					old = cartao_aposta['jogo'];					cartao_aposta['jogo'] = [];	
					for (nr=0; nr<old.length; nr++) {
						if (old[nr]!=dzn) {							cartao_aposta['jogo'].push(old[nr]);						}
					};
				};
			} else {
				$(idtd).addClass("selecionado");				$(idtd).css({"color":"white", "background-color":"gray"});
				if (tipo=='dz') {
					cartao_aposta['jogo'].push(dzn);					cartao_aposta['jogo'].sort();
				};
			};			// aqui...			var jogada = '';			var dzApostada = 0;			for ( dzApostada=0; dzApostada<cartao_aposta['jogo'].length; dzApostada++) {				var s = frmStr(cartao_aposta['jogo'][dzApostada],2);				var j = frmStr(j,2);				jogada += '<td id="ap_' + j + '" style="color:white; background:gray">' + s + '</td>';			}; 			for (var vazio = dzApostada; vazio<15; vazio++) {				var j = frmStr(vazio,2);				jogada += '<td id="ap_' + j + '" style="color:white; background:gray">&nbsp;&nbsp;&nbsp;</td>';			};			jogada = '<table id="dezenas" cellspacing="10"><tr>' + jogada + '</tr></table>';			$('#centerarea').html(jogada);			
			calculaAposta();
		};
	});

	// --------------------	// BUTTON CLICK	// --------------------
	$("button").click(function() {
		var button_id = $(this).get(0).id;	// identificação do botão

		// COMPARAR JOGOS
		if (button_id=='comparar') {
			if (cartao_aposta['jogo'].length < cartao_aposta['nrDznCadaCrt']) alert ('Selecione no mínimo '+cartao_aposta['nrDznCadaCrt']+' dezenas');
			else if (cartao_aposta['jogo'].length<cartao_aposta['nrDznCadaCrt']) {
				alert ('Você poderá escolher quantas dezenas quizer,\nporém, você escolheu jogar '+cartao_aposta['nrDznCadaCrt']+' dezenas por cartão.\nEntão selecione no mínimo '+cartao_aposta['nrDznCadaCrt']+' dezenas\nou diminua o número de dezenas\npor cartão para '+cartao_aposta['jogo'].length+' (o número de dezenas marcadas).');
			     } else {
				hideOtherPanels('all');
				aposta = ''
				for (var dzap=0; dzap<cartao_aposta['jogo'].length; dzap++) {
					if (cartao_aposta['jogo'][dzap]) {
						aposta += (aposta=='') ? '' : ':';
						aposta += cartao_aposta['jogo'][dzap];
					} else  break;
				}
				loadXMLDoc('lotr_query.php?command=COMPARE&jogo='+tipo_de_jogo+'&aposta='+aposta+'&nrdzcart='+cartao_aposta['nrDznCadaCrt']);
			     };

		// LIMPAR CARTELA
		} else if (button_id=='limpar') {

			var nr_dezenas = (tipo_de_jogo=='megasena') ? 61 : 26;

			$('#tbresult').html('');
			for (var dzap=1; dzap<nr_dezenas; dzap++) {
				njtxt  = '#dz_';
				njtxt += (dzap<10) ? '0' : '';
				njtxt +=  dzap;
				$(njtxt).removeClass("selecionado");
				$(njtxt).css({"color":"#DC143C", "background-color":"white"});
			};

			cartao_aposta['jogo'] = [];	
			calculaAposta();

		// SLECIONAR TODOS OS NÚMEROS DA CARTELA
		} else if (button_id=='tudo') {

			var nr_dezenas = (tipo_de_jogo=='megasena') ? 61 : 26;

			cartao_aposta['jogo'] = [];
			for (var dzap=1; dzap<nr_dezenas; dzap++) {
				njtxt  = '#dz_';
				njtxt += (dzap<10) ? '0' : '';
				njtxt +=  dzap;
				$(njtxt).addClass("selecionado");
				$(njtxt).css({"color":"white", "background-color":"gray"});
				cartao_aposta['jogo'].push(dzap);
			};
				
			calculaAposta();

		// botoes de controle todos tem o mesmo nome: "hidden" e a propriedade "name" correspondente ao painel a ser exibido.
		} else if (button_id=='hidden') {
			if (this.name!='') {

				var panel = '#'+this.name;
				hideOtherPanels(panel);

				if ($(panel).css('display')=='block') {
					$(panel).draggable("destroy");
					$(panel).css({display:"none"});
				} else {
					$(panel).css({position:"absolute", display:"inline"});
					$(panel).draggable({cursor: "move", scroll: true, scrollSensitivity: 1, scrollSpeed: 1 });
				}
			}

		} else if (button_id=='incparticp') {

			if (cartao_aposta['partic']==0) alert('salvar esta aposta?');

		}
	});


	$("img").click(function() {
		var img_id = $(this).get(0).id;

		// 'infclose' é igual em todos o paineis "hidden"
		if (img_id=='infclose') {
			var panel = '#'+$(this).parent().parent().get(0).id;
			$(panel).draggable("destroy");
			$(panel).css({display:"none"});
		} 
	}); 

	function hideOtherPanels(DontHideThis) {
		$('#tbresult').html('');
		var panels = new Array('#bolao','#info');
		for ( var i = 0; i < panels.length; i++ ) {
			if (panels[i]!=DontHideThis) {
				if ($(panels[i]).css('display')=='block') {
					$(panels[i]).draggable("destroy");
					$(panels[i]).css({display:"none"});
				}
			}
		}
	}


	function calculaAposta() {

		// Se dezenas selecionadas igual ou maior que 6
		// Calcula o número de apostas em cada cartão para definir
		// o preço de cada cartão (sena => 6 é a base de cálculo de cada jogo)
		cartao_aposta['numApsCrt'] = comb(cartao_aposta['nrDznCadaCrt'],cartao_aposta[max_acertos]);

		// Calcula o valor de cada cartão
		// valor por cartão (vlcrt) = valor da aposta (vla) * número de apostas por cartão (napc)
		cartao_aposta['valPorCrt'] = 'R$ '+formatNum(cartao_aposta['valAposta']*cartao_aposta['numApsCrt'],2);

		//  calcula nr cartões
		if (cartao_aposta['jogo'].length>=cartao_aposta['nrDznCadaCrt']) {
			cartao_aposta['qtdCarts'] = comb(cartao_aposta['jogo'].length,cartao_aposta['nrDznCadaCrt']);

		} else {

			cartao_aposta['qtdCarts'] = 0;
		};

		if (tipo_de_jogo == 'megasena') {

			// Calculo de Probabilidades
			cartao_aposta['prob']['sena']   = prob(cartao_aposta,'sena', max_acertos);
			cartao_aposta['prob']['quina']  = prob(cartao_aposta,'quina', max_acertos);
			cartao_aposta['prob']['quadra'] = prob(cartao_aposta,'quadra', max_acertos);

			// quantidade de acertos
			cartao_aposta['_6acertos']['sena']   = acertos(cartao_aposta, 'sena', 6, max_acertos);
			cartao_aposta['_6acertos']['quina']  = acertos(cartao_aposta, 'quina', 6, max_acertos);
			cartao_aposta['_6acertos']['quadra'] = acertos(cartao_aposta, 'quadra', 6, max_acertos);

			cartao_aposta['_5acertos']['sena']   = acertos(cartao_aposta, 'sena', 5, max_acertos);
			cartao_aposta['_5acertos']['quina']  = acertos(cartao_aposta, 'quina', 5, max_acertos);
			cartao_aposta['_5acertos']['quadra'] = acertos(cartao_aposta, 'quadra', 5, max_acertos);

			cartao_aposta['_4acertos']['sena']   = acertos(cartao_aposta, 'sena', 4, max_acertos);
			cartao_aposta['_4acertos']['quina']  = acertos(cartao_aposta, 'quina', 4, max_acertos);
			cartao_aposta['_4acertos']['quadra'] = acertos(cartao_aposta, 'quadra', 4, max_acertos);

			// valor total da aposta e valor de cada cota
			vta = 'R$ '+formatNum((cartao_aposta['numApsCrt']*cartao_aposta['qtdCarts'])*cartao_aposta['valAposta'],2);
			if (cartao_aposta['partic']==0) vct = vta;
			else vct = 'R$ '+formatNum((cartao_aposta['numApsCrt']*cartao_aposta['qtdCarts'])*cartao_aposta['valAposta']/cartao_aposta['partic'],2);

			$('#prbsen').text(cartao_aposta['prob']['sena']);		// Probabilidade de acertos na sena (1 em...):
			$('#prbqui').text(cartao_aposta['prob']['quina']);		// Probabilidade de acertos na quina (1 em...):
			$('#prbqua').text(cartao_aposta['prob']['quadra']);		// Probabilidade de acertos na quadra (1 em...):
			$('#_6Asen').text(cartao_aposta['_6acertos']['sena']);
			$('#_6Aqui').text(cartao_aposta['_6acertos']['quina']);
			$('#_6Aqua').text(cartao_aposta['_6acertos']['quadra']);
			$('#_5Asen').text(cartao_aposta['_5acertos']['sena']);
			$('#_5Aqui').text(cartao_aposta['_5acertos']['quina']);
			$('#_5Aqua').text(cartao_aposta['_5acertos']['quadra']);
			$('#_4Asen').text(cartao_aposta['_4acertos']['sena']);
			$('#_4Aqui').text(cartao_aposta['_4acertos']['quina']);
			$('#_4Aqua').text(cartao_aposta['_4acertos']['quadra']);

		} else if (tipo_de_jogo == 'lotofacil') {

			// Calculo de Probabilidades
			cartao_aposta['prob']['_15ac'] = prob(cartao_aposta,'_15ac', max_acertos);
			cartao_aposta['prob']['_14ac'] = prob(cartao_aposta,'_14ac', max_acertos);
			cartao_aposta['prob']['_13ac'] = prob(cartao_aposta,'_13ac', max_acertos);
			cartao_aposta['prob']['_12ac'] = prob(cartao_aposta,'_12ac', max_acertos);
			cartao_aposta['prob']['_11ac'] = prob(cartao_aposta,'_11ac', max_acertos);

			// quantidade de acertos
			cartao_aposta['_15acertos'] = acertos(cartao_aposta, '_15ac', 15, max_acertos);
			cartao_aposta['_14acertos'] = acertos(cartao_aposta, '_14ac', 14, max_acertos);
			cartao_aposta['_13acertos'] = acertos(cartao_aposta, '_13ac', 13, max_acertos);
			cartao_aposta['_12acertos'] = acertos(cartao_aposta, '_12ac', 12, max_acertos);
			cartao_aposta['_11acertos'] = acertos(cartao_aposta, '_11ac', 11, max_acertos);

			// valor total da aposta e valor de cada cota
			vta = 'R$ '+formatNum((cartao_aposta['numApsCrt']*cartao_aposta['qtdCarts'])*cartao_aposta['valAposta'],2);
			if (cartao_aposta['partic']==0) vct = vta;
			else vct = 'R$ '+formatNum((cartao_aposta['numApsCrt']*cartao_aposta['qtdCarts'])*cartao_aposta['valAposta']/cartao_aposta['partic'],2);

			$('#prb15').text(cartao_aposta['prob']['_15ac']);
			$('#prb14').text(cartao_aposta['prob']['_14ac']);
			$('#prb13').text(cartao_aposta['prob']['_13ac']);
			$('#prb12').text(cartao_aposta['prob']['_12ac']);
			$('#prb11').text(cartao_aposta['prob']['_11ac']);

			$('#djc').text(cartao_aposta['jogo'].length+' dzns.');

			$('#_15A').text(cartao_aposta['_15acertos']);
			$('#_14A').text(cartao_aposta['_14acertos']);
			$('#_13A').text(cartao_aposta['_13acertos']);
			$('#_12A').text(cartao_aposta['_12acertos']);
			$('#_11A').text(cartao_aposta['_11acertos']);

		}

		$('#qtddzsel').text(cartao_aposta['jogo'].length);		// Dezenas Selecionadas:
		$('#qtddzctr').text(cartao_aposta['nrDznCadaCrt']);		// Dezenas por cartão:
		$('#numapctr').text(sepPoint(cartao_aposta['numApsCrt']));	// Apostas por cartão:
		$('#qtdcarts').text(formatNum(cartao_aposta['qtdCarts'],0));	// Quantidade Cartões:
		$('#nrapostas').text(formatNum(cartao_aposta['numApsCrt']*cartao_aposta['qtdCarts'],0));	// Número de apostas / combinações:
		$('#vlruapo').text('R$ '+formatNum(cartao_aposta['valAposta'],2));	// Valor unitário aposta:
		$('#vlrpcrt').text(cartao_aposta['valPorCrt']);			// Valor unitário cartão:
		$('#vlaposta').text(vta);				// Valor total aposta:
		$('#numpart').text(cartao_aposta['partic']);			// Numero Participantes:
		$('#vlcota').text(vct);					// Valor de cada cota:
		$('#dzpcart').text(cartao_aposta['nrDznCadaCrt']);

	}

});


/***********************************************
 * CARREGA DADOS
 ***********************************************/

	function xmlFileType() {

		x=req.responseXML.childNodes;
		for (i=0;i<x.length;i++) {
			if (x[i].nodeType==1) return x[i].nodeName;
		}
		alert('Erro carregando informações. Contacte o suporte');
		return null;

	} 

	// Load XML list of states or cities on select object if pais code is BR
	function loadXMLData() {

		var xmlFile = xmlFileType();

		if (xmlFile=='compare') {
	   			xmlTable = req.responseText;
	   			document.getElementById('tbresult').innerHTML=xmlTable;

		} else if (xmlFile=='alterar aqui...') {
	   			xmlTable = req.responseText;
	   			document.getElementById('tbresult').innerHTML=xmlTable;

		} else if (xmlFile=='states') {

			addOption(document.markPoint.id_estado, 'Selecione o Estado', '');
			var states = req.responseXML.getElementsByTagName("state");
			for (var i = 0; i < states.length; i++) {
				var stateCode = states[i].getAttribute("id_state");
				var stateName = states[i].getAttribute("name");
				addOption(document.markPoint.id_estado, stateName, stateCode);
			}

		} else if (xmlFile=='cities') {

			addOption(document.markPoint.id_cidade, 'Selecione a Cidade', '');
			var cities = req.responseXML.getElementsByTagName("city");
			for (var i = 0; i < cities.length; i++) {
				var cityName = cities[i].getAttribute("name");
				addOption(document.markPoint.id_cidade, cityName, '');
			}

		} else if (xmlFile=='sqlResult') {

			var items = req.responseXML.getElementsByTagName('sqlResult');
			var command = getNodeValue('', 'command', items[0], 0);
			var result  = getNodeValue('', 'result', items[0], 0);

			if (result=='true') { 
				if (command=='insert') {
					__id_usuario = getNodeValue('', 'id_usuario', items[0], 0);

				} 
				writeContato();
				gotoNextPanel();

			} else {
				if (command=='insert') {
					clearAuxFields();
				}
				alert(getNodeValue('', 'message', items[0], 0));
			}


		} else if (xmlFile=='checkuser' || xmlFile=='select') {

			var items = req.responseXML.getElementsByTagName(xmlFile);

			__id_usuario = getNodeValue('', 'id_usuario', items[0], 0);

			if (__id_usuario==-1) {
				clearFields();
				changeUser();

			} else {

				__id_tipo_usuario = getNodeValue('', 'id_tipo_usuario', items[0], 0);
				__nome            = getNodeValue('', 'nome', items[0], 0);
				__sobrenome       = getNodeValue('', 'sobrenome', items[0], 0);
				__senha           = getNodeValue('', 'senha', items[0], 0);
				__sexo            = getNodeValue('', 'sexo', items[0], 0);
				__id_pais         = getNodeValue('', 'id_pais', items[0], 0);
				__pais            = getNodeValue('', 'pais', items[0], 0);
				__id_estado       = getNodeValue('', 'id_estado', items[0], 0);
				__estado          = getNodeValue('', 'estado', items[0], 0);
				__cidade          = getNodeValue('', 'cidade', items[0], 0);
				__bairro          = getNodeValue('', 'bairro', items[0], 0);
				__logradouro      = getNodeValue('', 'logradouro', items[0], 0);
				__numero          = getNodeValue('', 'numero', items[0], 0);
				__complemento     = getNodeValue('', 'complemento', items[0], 0);
				__cep             = getNodeValue('', 'cep', items[0], 0);
				__ddd_telefone    = getNodeValue('', 'ddd_telefone', items[0], 0);
				__telefone        = getNodeValue('', 'telefone', items[0], 0);
				__celular         = getNodeValue('', 'celular', items[0], 0);
				__ddd_celular     = getNodeValue('', 'ddd_celular', items[0], 0);
				__email           = getNodeValue('', 'email', items[0], 0);
				__ano_nasc        = getNodeValue('', 'ano_nasc', items[0], 0);
				__mes_nasc        = getNodeValue('', 'mes_nasc', items[0], 0);
				__dia_nasc        = getNodeValue('', 'dia_nasc', items[0], 0);
				__data_nascimento = __ano_nasc+'-'+__mes_nasc+'-'+__dia_nasc;
				__cic             = getNodeValue('', 'cic', items[0], 0);

				writeContato();

				if (currentScript=="login") login();
				else {
					fillForm();
					changeUser();
				};
			}

		} else if (xmlFile=='loginResult') {

			var items  = req.responseXML.getElementsByTagName('loginResult');
			var result = getNodeValue('', 'result', items[0], 0);
			var id_tipo_usuario = getNodeValue('', 'id_tipo_usuario', items[0], 0);
			if (result=='true') {

				/* -------------------------------------
				 * REDIRECT USING
				 * site_tipo_usuario:id_tipo_usuario 
				 * ------------------------------------- */
				 var destPage = '';
				 switch (id_tipo_usuario) {
				 case '1': destPage='brmn_admin_agenda.php'  ; break; // Músico
				 case '2': destPage='brmn_admin_agenda.php'  ; break; // Produtor Musical
				 case '3': destPage='brmn_admin_agenda.php'  ; break; // Prestador de Serviços
				 case '4': destPage='brmn_admin_produtos.php'; break; // Produtos
				 case '5': destPage='brmn_admin_agenda.php'  ; break; // Lojista
				 default : destPage='brmn_admin_agenda.php'  ; break; }

				document.location = destPage;

			} else {
				alert(getNodeValue('', 'message', items[0], 0));
			}

		}

		div_loading.style.visibility = 'hidden';
		initializing = false;

	}

/***********************************************
 * TABELAS
 ***********************************************/
	
	// Exibe ou esconde
	function showTab(tabID, imgID) {
		var tab = document.getElementById(tabID);
		var img = document.getElementById(imgID);
		if (tab.style.display === 'inline') {
			tab.style.display = 'none';
			img.src = './img/plus.gif';
		} else {
			tab.style.display = 'inline';
			img.src = './img/minus.gif';
		}
	}

/***********************************************
 * FUNÇÕES AUXILIARES
 ***********************************************/

function fact(x) {					// Fatorial
  if (x > 0) {for(var i=x-1;i>0;i--) {x*=i;}}
  else if (x==0) {x=1}
  else return false
  return x;
}

function comb(n,x) {
  return Math.round(fact(n)/(fact(n-x)*fact(x)));	// Combinação
}

function prob(cartao_aposta, tipoJogo, max_acertos) {
	var probabilidade = 0;
	var agrupamento = cartao_aposta[max_acertos] - cartao_aposta[tipoJogo];
	probabilidade = comb(cartao_aposta['dznXcart']-cartao_aposta['nrDznCadaCrt'],agrupamento) * comb(cartao_aposta['nrDznCadaCrt'],cartao_aposta[tipoJogo]) / cartao_aposta['totCombs'];
	return sepPoint(Math.round(Math.round(100*1/probabilidade)/100));
}

function acertos(cartao_aposta, tipoJogo, nrAcertos, max_acertos) {

	if (nrAcertos<cartao_aposta[tipoJogo]) return '-';

	// Se tiver mais que 6 acertos é porque não é uma Megasena e sim uma Lotofácil
	// Calcula acertos da Lotofácil
	// ---------------------------------------------------------------------------
	if (nrAcertos>6) {

		qtdAcertos = acertos_lotofacil(cartao_aposta, tipoJogo, nrAcertos, max_acertos);

	// Caso contrário 
	// Calcula acertos da Megasena
	// ---------------------------------------------------------------------------
	} else if (nrAcertos==6) {
		if (tipoJogo=='sena') 	qtdAcertos = 1;
		else if (tipoJogo=='quina') qtdAcertos = (cartao_aposta['nrDznCadaCrt']-6)*6;
		     else {
			if (cartao_aposta['nrDznCadaCrt']-6<2) qtdAcertos = 0;
			else qtdAcertos = comb(cartao_aposta['nrDznCadaCrt']-6,2)*15;
		     }
	} else if (nrAcertos==5) {
		if (tipoJogo=='sena') 	qtdAcertos = '-';
		else if (tipoJogo=='quina') qtdAcertos = cartao_aposta['nrDznCadaCrt']-cartao_aposta['quina'];
		     else {
			if (cartao_aposta['nrDznCadaCrt']-5<2) qtdAcertos = 0;
			else qtdAcertos = (((cartao_aposta['nrDznCadaCrt']-cartao_aposta['quina'])/2)*(cartao_aposta['nrDznCadaCrt']-cartao_aposta[max_acertos]))*5;
		     };
	} else if (tipoJogo!='quadra') 	qtdAcertos = '-';
		else qtdAcertos = (((cartao_aposta['nrDznCadaCrt']-cartao_aposta['quadra'])/4)*(cartao_aposta['nrDznCadaCrt']-cartao_aposta['quina']))*2;

	return qtdAcertos;
}

function acertos_lotofacil(cartao_aposta, tipoJogo, nrAcertos, max_acertos) {

	if ( cartao_aposta['jogo'].length<cartao_aposta[max_acertos] ) totAcertos = '-'

	// else if ( cartao_aposta['qtdCarts'] == 1 ) totAcertos = 1

	else {

		n = cartao_aposta['jogo'].length - nrAcertos;
		p = cartao_aposta['jogo'].length - cartao_aposta[max_acertos];
		totAcertos = fact(n) / (fact(p) * fact(n-p));

		     if (nrAcertos==14) totAcertos = totAcertos - cartao_aposta['_15acertos']
		else if (nrAcertos==13) totAcertos = totAcertos - cartao_aposta['_15acertos'] - cartao_aposta['_14acertos']
		else if (nrAcertos==12) totAcertos = totAcertos - cartao_aposta['_15acertos'] - cartao_aposta['_14acertos'] - cartao_aposta['_13acertos']
		else if (nrAcertos==11) totAcertos = totAcertos - cartao_aposta['_15acertos'] - cartao_aposta['_14acertos'] - cartao_aposta['_13acertos'] - cartao_aposta['_12acertos'];

	}

	return totAcertos;

}

function formatNum(src,ndec){

	src = roundNumber(src,2);

	src=trim(src);

	var tst = (src%2>0) ? Math.floor(src) : src;
	tst=tst.toString();

	if (tst.length>17) {
		return formatNum(Math.round(src/1000000000000000),0)+' Quatrilhões';
	} else if (tst.length>12) { 
		return formatNum(Math.round(src/1000000000000),0)+' Trilhões';
	} else if (tst.length>10) { 
		return formatNum(Math.round(src/1000000000),0)+' Bilhões';
	};

	src=src.toString();
	src=src.replace("\.",",");
	if (!/^\-?([0-9]|\.)*\,{0,1}[0-9]*$/.test(src) || src.charAt(0)==".")  return src;
	var tam=src.length, pDec=src.indexOf(",");
	if(src.length==0) src= "0";
	if(pDec==-1){
		var p=src.indexOf(".");
		if(p!=-1&&p==(tam-ndec-1)) {
			src = src.replace(/\.(\d*)$/,",$1");
		} else {
			if (ndec==0) return sepPoint(removeStr(src,"."));
			else return sepPoint(removeStr(src,"."))+","+repeatNStr("0",ndec);
		}
		pDec=src.indexOf(",");
	}
	src=removeStr(src,".");
	if(pDec==0) return "0"+src+repeatNStr("0",ndec+1-src.length);
	else{
		if(pDec>(tam-ndec-1))src+=repeatNStr("0",pDec-(tam-ndec-1));
		pDec=src.indexOf(",");
		inteiro=sepPoint(src.slice(0,pDec));
		decimal=src.slice(pDec,pDec+ndec+1);
		return (inteiro+decimal);
	}
}
function sepPoint(nr) {

	var fnum=new Array(), n=1;

	var snum=nr.toString().split('');

	snum = snum.reverse();

	for(var i=0;i<snum.length;i++) {

		fnum.push(snum[i]);

		if(n%3==0) {

			if(i<(snum.length-1)) {

				fnum.push(".");

			}
 
		}

		n++;

	}

 	return(fnum.reverse().join(""));

};

function roundNumber(num, dec) {
	var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
	return result;
}
function repeatNStr(vr,n){
	var r="",i;
	for(i=0;i<n;i++)r+=vr;
	return r;
}
function removeStr(src,arg){
	var v=(typeof arg=="string")?[arg]:arg;
	var r="";
	for(var i=0;i<v.length;i++)r=changeStr(src,v[i],"");
	return r;
}
function changeStr(src,from,to) {
	src=String(src);
	var i,li=0,lFrom=from.length,dst="";
	while((i=src.indexOf(from,li))!=-1){
		dst+=src.substring(li,i)+to;
		li=i+lFrom;
	}
	dst+=src.substring(li);
	return dst;
}
function trim(s){return String(s).replace(/^\s+/,"").replace(/\s+$/,"");}
function isNumeric(v){return /^[0-9]+$/.test(v);}
function isUpperAlpha(v){return /^[A-Z]+$/.test(v);}
function justNumbersStr(s){return String(s).replace(/\D*/g,"");}
function onlySameNumber(s){return isNumeric(s)&& (new RegExp("^("+s.charAt(0)+")(\\1)*$")).test(s);}
function invertStr(s){var t="",i; for(i=0;i<s.length;i++)t=s.charAt(i)+t; return t;}
function isCPF(cpf) {
	var OK;
	var SZ_CPF=11;
	cpf= justNumbersStr(trim(cpf));
	if(onlySameNumber(cpf)) return false;
	var size=cpf.length;
	if(size>10) {
		var vr=cpf.substring(0,size-2)
		var resto= getVerificationDigit(vr);
		OK= resto==parseInt(cpf.charAt(size-2));
		if(OK) {
			vr+=resto;
			resto=getVerificationDigit(vr);
			OK= resto==parseInt(cpf.charAt(size-1));
		}
	}
	return OK;
}
function isCNPJ(cnpj) {
	if(cnpj.length==0) return false;
	cnpj= trim(cnpj);
	var digs=[],i;
	for(i=0; i<14; i++)
		digs[i]= parseInt(cnpj.charAt(i),10);
	var sDig=0,soma=0,resto=0,dVer1=-1,dVer2=-1;
	var fat1=[5,4,3,2,9,8,7,6,5,4,3,2];
	var fat2=[6,5,4,3,2,9,8,7,6,5,4,3,2];
	for(var i=0; i<12; i++)
		sDig+= (digs[i]*fat1[i]);
	resto= sDig % 11;
	dVer1= (resto==0)?0:(11 - resto)%10;
	if(digs[12]==dVer1) 
	{
		sDig=resto=0;
		for(i=0;i<13;i++) 
			sDig+= (digs[i]*fat2[i]);
		resto=sDig%11;
		dVer2=(resto==0)?0:(11-resto)%10;
	}
	return digs[12]==dVer1 && digs[13]==dVer2;
}
//
function getVerificationDigit(S) {
	var s=0,i;
	var inv=invertStr(justNumbersStr(S));
	for(i=0;i<inv.length;i++) s+=(i+2)*parseInt(inv.charAt(i));
	s*=10;
	return (s%11)%10;
}
//
function getYear(d) { return (d < 1000) ? d + 1900 : d;}
//
function isDate (year, month, day) {
  month = month - 1; 
  var tempDate = new Date(year,month,day);
  if ( (getYear(tempDate.getYear()) == year) 
  && ( month == tempDate.getMonth()) 
  && (day == tempDate.getDate()) ) return true;
  else return false;
}
//
function frmStr(num,size) {
	var str=String(num),n,dif=size-str.length,aux='';
	for(n=0;n<dif;n++)aux+='0';
	return (aux+str);
}
//
function emailOk (fld) {
	fld.value = trim(fld.value);
	var InpTwo = fld.value;
	var newreg = /@\b/gi;
	if (InpTwo.match(newreg)) {
		newarray=InpTwo.match(newreg);
		if (newarray.length==1) return true;
		else alert ("Email inválido!");
	} else return false;
}
//
function setCookie(c_name,value,expiredays) {
	var exdate=new Date();
	exdate.setDate(exdate.getDate()+expiredays);
	document.cookie=c_name+ "=" +escape(value)+((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
}
//
function checkCookie(varId) {
	var testCookie=getCookie(varId);
	if (testCookie!=null && testCookie!="") return true;
	return false;
}
//
function getCookie(c_name) {
	if (document.cookie.length>0) {
		c_start=document.cookie.indexOf(c_name + "=");
		if (c_start!=-1) {
			c_start=c_start + c_name.length+1;
			c_end=document.cookie.indexOf(";",c_start);
			if (c_end==-1) c_end=document.cookie.length;
			return unescape(document.cookie.substring(c_start,c_end));
		}
	}
	return "";
}
//]]>