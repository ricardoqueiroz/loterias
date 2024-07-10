<?php
/****************************************
 * Cálculo das datas dos sorteios
 ****************************************/
class loteria {

	protected $dbh = null;

	private $jogo;

	private $rows;

	public  $agora;

	private $log = array();

	private $data_inicial;

	public $data_proximo_sorteio;

	public $data_sorteio_anterior;

	public $dias_semana = array ( 0=>'Domingo', 1=>'Segunda', 2=>'Terça', 3=>'Quarta', 4=>'Quinta', 5=>'Sexta', 6=>'Sábado' );
	
	private $meses = array ( 1=>'janeiro', 2=>'fevereiro', 3=>'março', 4=>'abril', 5=>'maio', 6=>'junho', 7=>'jUlho', 8=>'agosto', 9=>'Setembro', 10=>'outubro', 11=>'novembro', 12=>'dezembro' );

	public  $tipo_jogo = array( 'megasena'=>array(3, 6) , 'lotofacil'=>array(1, 3, 5) , 'quina'=>array(1, 2, 3, 4, 5, 6) , 'lotomania'=>array(3, 6) , 'duplasena'=>array(2, 5) );

	// ----------------------------------------------------
	// CONTRUCTOR
	// ----------------------------------------------------
	public function __construct( $PDO_conn=null, $jogo='megasena' ) {

		$this->dbh                     = $PDO_conn; 
		$this->jogo                    = $jogo;
		$this->agora                   = new DateTime ( date ( 'Y/m/d H:i:s' ) );
		$this->data_inicial            = new DateTime ( date ( 'Y/m/d H:i:s' ) );
		$this->data_proximo_sorteio    = new DateTime ( date ( 'Y/m/d').' 20:00:00' );
		$this->data_sorteio_anterior   = new DateTime ( date ( 'Y/m/d').' 20:00:00' );
		$this->proximo_sorteio(); 
		$this->sorteio_anterior();
		setlocale(LC_MONETARY,"pt_BR", "ptb");
	}

	// ----------------------------------------------------
	// SORTEIO ANTERIOR
	// ----------------------------------------------------
	public function sorteio_anterior() {

		while (!$this->dia_do_sorteio('anterior')) {

			$this->data_sorteio_anterior->modify('-1 day');
		};

	}

	// ----------------------------------------------------
	// PROXIMO SORTEIO A PARTIR DE UMA DATA
	// @ $data_inicio => data criada com new DateTime()
	// ----------------------------------------------------
	public function proximo_sorteio() {

		while (!$this->dia_do_sorteio('proximo')) {

			$this->data_proximo_sorteio->modify('+1 day');
		};

	}

	// ----------------------------------------------------
	// Testa se $this->data_inicial é dia de sorteio do jogo atual
	// ----------------------------------------------------
	public function dia_do_sorteio($procurar='proximo') {

		$dia_semana = ($procurar=='anterior') ? $this->data_sorteio_anterior->format('w') : $this->data_proximo_sorteio->format('w'); 

		if (in_array($dia_semana, $this->tipo_jogo[$this->jogo])) {

			if ($procurar=='anterior') {

				if ($this->data_sorteio_anterior->format('U') < $this->agora->format('U') ) return TRUE;

			} else  if ( $this->data_proximo_sorteio->format('U') > $this->data_inicial->format('U') ) return TRUE;

		} 

		return FALSE;	

	}

	// ----------------------------------------------------
	// Retorna dia da semana (0-6) em português
	// 
	// ----------------------------------------------------
	public function dia_semana($dia) {

		if ( is_numeric($dia) && array_key_exists($dia, $this->dias_semana) ) {

			return $this->dias_semana[$dia];

		} else if ( is_object($dia) ) {

			try {
				$auxdate = new DateTime($dia->format('Y/m/d H:i:s'));
				return $this->dias_semana[$auxdate->format('w')];

			} catch (Exception $e) {

				echo $e->getMessage();
			}

		} else  if ( preg_match ("/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/", $dia, $parts) ) {

				if ( checkdate($parts[2],$parts[1],$parts[3]) ) {

					$auxdate = date_create_from_format('d-m-Y', $parts[1].'-'.$parts[2].'-'.$parts[3]);
					return $this->dias_semana[$auxdate->format('w')];

				} else return '..';

		} else return '...';

	}


	// ----------------------------------------------------
	// PRÓXIMOS SORTEIOS
	// ----------------------------------------------------
	public function datas_sorteios ($qtd_sorteios) {

		$sorteios     = array();
		$dia_semana   = $this->data_proximo_sorteio->format('w');
		$tot_sorteios = count($this->tipo_jogo[$this->jogo])-1;
		$num_sorteio  = array_search($dia_semana, $this->tipo_jogo[$this->jogo]); 
		
		for ($nr_sorteio=0; $nr_sorteio<$qtd_sorteios; $nr_sorteio++) {

			$sorteios[$nr_sorteio] = array( 0=>$this->tipo_jogo[$this->jogo][$num_sorteio], 1=>$this->data_proximo_sorteio->format('d'), 2=>$this->data_proximo_sorteio->format('m'), 3=>$this->data_proximo_sorteio->format('Y'), 4=>$this->data_proximo_sorteio->format('H:i') );

			$data_inicial = new DateTime( $this->data_proximo_sorteio->format( 'Y/m/d H:i:s' ) );

			$this->data_proximo_sorteio->modify( '+1 day' );

			$this->proximo_sorteio();

			$num_sorteio++;

			if ($num_sorteio>$tot_sorteios) $num_sorteio = 0;

		}

		$this->data_inicial = new DateTime ( date ( 'Y/m/d H:i:s' ) );

		return $sorteios;
	}

	// ----------------------------------------------------
	// DESENHA O CARTÃO DO JOGO
	// ----------------------------------------------------
	public function montar_cartao() {

		$tabs = "\t\t";

		if ($this->jogo=='megasena') {

			$cartao  = PHP_EOL;
			$cartao .= $tabs.'<img class="logomega" src="img/logomegasena.jpg">'.PHP_EOL;

			// --------------------------------------
			// Botões de Controles
			// --------------------------------------
			$cartao .= $tabs.'	<table id="controls" border="0" cellpadding="0" cellspacing="0" width="100%">' . PHP_EOL;
			$cartao .= $tabs.'		<td align="center"><button class="ctlButton" id="hidden" name="info">Valor da Aposta</button></td>' . PHP_EOL;
			$cartao .= $tabs.'		<td align="center"><button class="ctlButton" id="hidden" name="bolao">Nr.Apostadores</button></td>' . PHP_EOL;
			$cartao .= $tabs.'	</table>' . PHP_EOL;


			$cartao .= $tabs.'<div class="subtitulo1">Selecione as dezenas que deseja jogar</div>'.PHP_EOL;
			$cartao .= $tabs.'<table id="volante" cellspacing="10">'.PHP_EOL;
			$linha  = 1;
			$coluna = 1;
			$dezena = 1;
			for ($i = 0; $i < 60; $i++) {
				if ($coluna>10) {
					$coluna=1;
					$cartao .= '</tr>'.PHP_EOL;
				}
				if ($coluna==1) {
					$cartao .= '<tr>';
				}; 
				$cartao .= '<td class="td_ms" id="dz_'.sprintf("%02d",$dezena).'">'.sprintf("%02d",$dezena).'</td>';
				$dezena++;
				$coluna++;
			}	
			$cartao .= $tabs.'</table>'.PHP_EOL;
			$cartao .= $tabs.'<div class="subtitulo1">Assinale quantos números você está marcando por cartão</div>'.PHP_EOL;
			$cartao .= $tabs.'<table id="apostas" cellspacing="10">'.PHP_EOL;
			$cartao .= $tabs.'<tr><td id="nj_6" style="color:white; background:gray">06</td><td id="nj_7">07</td><td id="nj_8">08</td><td id="nj_9">09</td><td id="nj_10">10</td><td id="nj_11">11</td><td id="nj_12">12</td><td id="nj_13">13</td><td id="nj_14">14</td><td id="nj_15">15</td></tr>'.PHP_EOL;
			$cartao .= $tabs.'</table>'.PHP_EOL.PHP_EOL;
			echo $cartao;

		} else if ($this->jogo=='lotofacil') {

			$cartao  = PHP_EOL;
			$cartao .= $tabs.'<img class="logomega" src="img/logolotofacil.jpg">'.PHP_EOL;

			// --------------------------------------
			// Botões de Controles
			// --------------------------------------
			$cartao .= $tabs.'	<table id="controls" border="0" cellpadding="0" cellspacing="0" width="100%">' . PHP_EOL;
			$cartao .= $tabs.'		<td align="center"><button class="ctlButton" id="hidden" name="info">Valor da Aposta</button></td>' . PHP_EOL;
			$cartao .= $tabs.'		<td align="center"><button class="ctlButton" id="hidden" name="bolao">Nr.Apostadores</button></td>' . PHP_EOL;
			$cartao .= $tabs.'	</table>' . PHP_EOL;

			$cartao .= $tabs.'<div class="subtitulo1">Selecione as dezenas que deseja jogar</div>'.PHP_EOL;
			$cartao .= $tabs.'<table id="volante" cellspacing="15">'.PHP_EOL;
			$linha  = 1;
			$coluna = 1;
			$dezena = 1;
			for ($i = 0; $i < 25; $i++) {
				if ($coluna>5) {
					$coluna=1;
					$cartao .= '</tr>'.PHP_EOL;
				}
				if ($coluna==1) {
					$cartao .= '<tr>';
				}; 
				$cartao .= '<td class="td_lf" id="dz_'.sprintf("%02d",$dezena).'">'.sprintf("%02d",$dezena).'</td>';
				$dezena++;
				$coluna++;
			}
			$cartao .= $tabs.'</table>'.PHP_EOL;
			$cartao .= $tabs.'<div class="subtitulo1">Número máximo de apostas por cartão: 15</div>'.PHP_EOL;
			/*
			$cartao .= $tabs.'<table id="apostas" cellspacing="10">'.PHP_EOL;
			$cartao .= $tabs.'<tr><td id="nj_6" style="color:white; background:gray">06</td><td id="nj_7">07</td><td id="nj_8">08</td><td id="nj_9">09</td><td id="nj_10">10</td><td id="nj_11">11</td><td id="nj_12">12</td><td id="nj_13">13</td><td id="nj_14">14</td><td id="nj_15">15</td></tr>'.PHP_EOL;
			$cartao .= $tabs.'</table>'.PHP_EOL.PHP_EOL;
			*/
			echo $cartao;
		}
	}


	// ----------------------------------------------------
	// DESENHA A TABELA DE VALORES DA APOSTA FEITA
	// ----------------------------------------------------
	public function valores_quantidades() {

		$tabs = "\t\t";
		$tabela  = PHP_EOL;
		$tabela .= $tabs.'<table id="quadro1">'.PHP_EOL;
		//$tabela .= $tabs.'<tr><th colspan="2">Valores e quantidades</th></tr>'.PHP_EOL;
		$tabela .= $tabs.'<tr><td class="titulo">Dezenas Selecionadas:</td><td id="qtddzsel" class="valor">-</td></tr>'.PHP_EOL;
		$tabela .= $tabs.'<tr><td class="titulo">Dezenas por cartão:</td><td id="qtddzctr" class="valor">-</td></tr>'.PHP_EOL;
		$tabela .= $tabs.'<tr><td class="titulo">Apostas por cartão:</td><td id="numapctr" class="valor">-</td></tr>'.PHP_EOL;
		$tabela .= $tabs.'<tr><td class="titulo">Quantidade Cartões:</td><td id="qtdcarts" class="valor">-</td></tr>'.PHP_EOL;
		$tabela .= $tabs.'<tr><td class="titulo">Nº Combinações:</td><td id="nrapostas" class="valor">-</td></tr>'.PHP_EOL;
		$tabela .= $tabs.'<tr><td class="titulo">Valor unitário aposta:</td><td id="vlruapo" class="valor">-</td></tr>'.PHP_EOL;
		$tabela .= $tabs.'<tr><td class="titulo">Valor unitário cartão:</td><td id="vlrpcrt" class="valor">-</td></tr>'.PHP_EOL;
		$tabela .= $tabs.'<tr><td class="titulo">Valor total aposta:</td><td id="vlaposta" class="valor">-</td></tr>'.PHP_EOL;
		$tabela .= $tabs.'<tr><td class="titulo">Numero Apostadores:</td><td id="numpart" class="valor">-</td></tr>'.PHP_EOL;
		$tabela .= $tabs.'<tr><td class="titulo nb">Valor de cada cota:</td><td id="vlcota" class="valor nb">-</td></tr>'.PHP_EOL;
		$tabela .= $tabs.'</table>'.PHP_EOL.PHP_EOL;
		echo $tabela; 

	}

	// ----------------------------------------------------
	// DESENHA A TABELA DE PROBABILIDADES
	// ----------------------------------------------------
	public function probabilidades() {

		if ($this->jogo=='megasena') {

			$tabs = "\t\t";
			$tabela  = PHP_EOL;
			$tabela .= $tabs.'<div class="subtitulo1">Probabilidade de acertos em cartão de <span id="dzpcart">6</span> dezenas</div>'.PHP_EOL;
			$tabela .= $tabs.'<table id="quadro2">'.PHP_EOL;
			$tabela .= $tabs.'<tr><th>Chances</th><th>Sena</th><th>quina</th><th>quadra</th></tr>'.PHP_EOL;
			$tabela .= $tabs.'<tr><td class="titulo nb">1 para...</td><td class="valor nb" id="prbsen">-</td><td class="valor nb" id="prbqui">-</td><td class="valor nb" id="prbqua">-</td></tr>'.PHP_EOL;
			$tabela .= $tabs.'</table>'.PHP_EOL.PHP_EOL;

		} else if ($this->jogo=='lotofacil') {

			$tabs = "\t\t";
			$tabela  = PHP_EOL;
			$tabela .= $tabs.'<div class="subtitulo1">Probabilidade de acertos jogando <span id="dzpcart">15</span> dezenas</div>'.PHP_EOL;
			$tabela .= $tabs.'<table id="quadro2">'.PHP_EOL;
			$tabela .= $tabs.'<tr><th>Chances</th><th>15 pts.</th><th>14 pts.</th><th>13 pts</th></tr>'.PHP_EOL;
			$tabela .= $tabs.'<tr><td class="titulo nb">1 para...</td><td class="valor nb" id="prb15">-</td><td class="valor nb" id="prb14">-</td><td class="valor nb" id="prb13">-</td></tr>'.PHP_EOL;
			$tabela .= $tabs.'<tr><th>Chances</th><th>12 pts.</th><th>11 pts.</th><th> </th></tr>'.PHP_EOL;
			$tabela .= $tabs.'<tr><td class="titulo nb">1 para...</td><td class="valor nb" id="prb12">-</td><td class="valor nb" id="prb11">-</td><td class="valor nb" id="prb10">-</td></tr>'.PHP_EOL;
			$tabela .= $tabs.'</table>'.PHP_EOL.PHP_EOL;

		}

		echo $tabela; 

	}

	// ----------------------------------------------------
	// DESENHA A TABELA DE QUANTIDADE DE PRÊMIOS
	// ----------------------------------------------------
	public function quantidade_premios() {

		if ($this->jogo=='megasena') {

			$tabs = "\t\t";
			$tabela  = PHP_EOL;
			$tabela .= $tabs.'<div class="subtitulo1">Premios por cada cartão acertando...</div>'.PHP_EOL;
			$tabela .= $tabs.'<table id="quadro2">'.PHP_EOL;
			$tabela .= $tabs.'<tr><th>Acertos</th><th>Sena</th><th>quina</th><th>quadra</th></tr>'.PHP_EOL;
			$tabela .= $tabs.'<tr><td class="titulo">6 dzns.</td><td class="valor" id="_6Asen">-</td><td class="valor" id="_6Aqui">-</td><td class="valor" id="_6Aqua">-</td></tr>'.PHP_EOL;
			$tabela .= $tabs.'<tr><td class="titulo">5 dzns.</td><td class="valor" id="_5Asen">-</td><td class="valor" id="_5Aqui">-</td><td class="valor" id="_5Aqua">-</td></tr>'.PHP_EOL;
			$tabela .= $tabs.'<tr><td class="titulo nb">4 dzns.</td><td class="valor nb" id="_4Asen">-</td><td class="valor nb" id="_4Aqui">-</td><td class="valor nb" id="_4Aqua">-</td></tr>'.PHP_EOL;
			$tabela .= $tabs.'</table>'.PHP_EOL.PHP_EOL;

		} else if ($this->jogo=='lotofacil') {

			$tabs = "\t\t";
			$tabela  = PHP_EOL;
			$tabela .= $tabs.'<div class="subtitulo1">Premios por cada cartão acertando...</div>'.PHP_EOL;
			$tabela .= $tabs.'<table id="quadro2">'.PHP_EOL;
			$tabela .= $tabs.'<tr><th>Jogando</th><th>15 pts.</th><th>14 pts.</th><th>13 pts.</th><th>12 pts.</th><th>11 pts.</th></tr>'.PHP_EOL;
			$tabela .= $tabs.'<tr><td class="titulo" id="djc">0 dzns.</td><td class="valor" id="_15A">-</td><td class="valor" id="_14A">-</td><td class="valor" id="_13A">-</td><td class="valor" id="_12A">-</td><td class="valor" id="_11A">-</td></tr>'.PHP_EOL;
			$tabela .= $tabs.'</table>'.PHP_EOL.PHP_EOL;

		}

		echo $tabela; 

	}

	// ----------------------------------------------------
	// INFORMA QUAL FOI O ÚLTIMO SORTEIO
	// ----------------------------------------------------
	public function ultimo_sorteio() {

		if ($this->jogo=='megasena') {

			$tabs = "\t\t";
			$datas     = $this->datas_sorteios ($qtd);
			$tabela  = PHP_EOL;
			$tabela .= $tabs.'<div class="subtitulo1">Próximos Sorteios</div>'.PHP_EOL;
			$tabela .= $tabs.'<table id="quadro2">'.PHP_EOL;
			$tabela .= $tabs.'<tr><th>Dia</th><th>Data</th></tr>'.PHP_EOL;
			foreach ($datas as $data_jogo) {
				print_r($data_jogo);
			}
				$tabela .= $tabs.'<tr><td>'.$this->dias_semana[$data_jogo[0]].'</td><td>'.$data_jogo[1].' de '.$this->meses[$data_jogo[2]].' de '.$data_jogo[3].', as '.$data_jogo[4].'h</td></td>'.PHP_EOL;
			$tabela .= $tabs.'</table>'.PHP_EOL.PHP_EOL;
			echo $tabela; 
		}

	}

	// ----------------------------------------------------
	// DESENHA A TABELA DOS PRÓXIMOS SORTEIOS
	// ----------------------------------------------------
	public function proximos_sorteios($qtd) {

		if ($this->jogo=='megasena') {

			$tabs = "\t\t";
			$datas     = $this->datas_sorteios ($qtd);
			$tabela  = PHP_EOL;
			$tabela .= $tabs.'<div class="subtitulo1">Próximos '.$qtd.' Sorteios</div>'.PHP_EOL;
			$tabela .= $tabs.'<table id="quadro5">'.PHP_EOL;
			$tabela .= $tabs.'<tr><th>Dia</th><th>Data do sorteio</th></tr>'.PHP_EOL;
			$count=0;
			foreach ($datas as $data_jogo) {
				$count++;
				$ps = ($count==1) ? ' ps' : ''; 
				$nb = ($count==$qtd) ? ' nb' : ''; 
				$tabela .= $tabs.'<tr><td class="ds'.$ps.$nb.'">'.$this->dias_semana[$data_jogo[0]].'</td><td class="dt'.$ps.$nb.'">'.$data_jogo[1].' de '.$this->meses[$data_jogo[2]].' de '.$data_jogo[3].', as '.$data_jogo[4].'h</td></td>'.PHP_EOL;
			}
			$tabela .= $tabs.'</table>'.PHP_EOL.PHP_EOL;
			echo $tabela; 
		}
	}


	// ----------------------------------------------------
	// DESENHA A TABELA DO RESULTADO DO CONCURSO
	// ----------------------------------------------------
	private function resultado_sorteio() {


		$tabs = "\t\t";
		$concurso = $this->rows[0];
		$env = (getenv('OS')=='Windows_NT') ? 'windows' : 'linux';

		if ($this->jogo=='megasena') {

			// Dezenas sorteadas..
			$concurso['concurso'] = sprintf("%04s", $concurso['concurso']);
			$concurso['d1'] = sprintf("%02s", $concurso['d1']);
			$concurso['d2'] = sprintf("%02s", $concurso['d2']);
			$concurso['d3'] = sprintf("%02s", $concurso['d3']);
			$concurso['d4'] = sprintf("%02s", $concurso['d4']);
			$concurso['d5'] = sprintf("%02s", $concurso['d5']);
			$concurso['d6'] = sprintf("%02s", $concurso['d6']);

			// Data do sorteio...
			// ---------------------------
			$dia_semana = $this->dias_semana[strftime("%w", strtotime($concurso['data_sorteio']))];
			$concurso['data_sorteio'] = $dia_semana . ', ' . strftime("%d/%m/%Y", strtotime($concurso['data_sorteio'])) ;

			// Acertadores...
			// ---------------------------
			$concurso['arrecadacao'] = ($env=='linux') ? money_format('%n',$concurso['arrecadacao']) : 'R$ '.$concurso['arrecadacao'];
			//$concurso['sena'];
			$concurso['rateio_sena'] = ($env=='linux') ? money_format('%n',$concurso['rateio_sena']) : 'R$ '.$concurso['rateio_sena'];
			//$concurso['quina'];
			$concurso['rateio_quina']  = ($env=='linux') ? money_format('%n',$concurso['rateio_quina']) : 'R$ '.$concurso['rateio_quina'];
			//$concurso['quadra'];
			$concurso['rateio_quadra'] = ($env=='linux') ? money_format('%n',$concurso['rateio_quadra']) : 'R$ '.$concurso['rateio_quadra'];

			// Acumulado...
			// ---------------------------
			$concurso['acumulado'] = ($concurso['acumulado']=='SIM') ? 'ACUMULOU!' : '';
			$exibeAcumulado = ($concurso['acumulado']=='SIM') ? 'inline' : 'none';

			// $exibeAcumulado = 'inline'; // para teste apenas.. exluir..

			// Estimativa próximos concursos...
			// ---------------------------
			$concurso['estimativa'] = ($env=='linux') ? money_format('%n',$concurso['estimativa']) : 'R$ '.$concurso['estimativa'];
			$concurso['acumulado_mega_virada'] = ($env=='linux') ? money_format('%n',$concurso['acumulado_mega_virada']) : 'R$ '.$concurso['acumulado_mega_virada'];

			// Dezenas sorteadas...
			// ---------------------------
			$sorteio1 = '<tr id="sorteio1" style="display:none">';
			$sorteio2 = '<tr id="sorteio2">';
			$sorteios = array($concurso['d1'], $concurso['d2'], $concurso['d3'], $concurso['d4'], $concurso['d5'], $concurso['d6']);
			foreach ($sorteios as $val) $sorteio1 .= '<td class="dsms">' . $val . '</td>';
			asort($sorteios);
			foreach ($sorteios as $val) $sorteio2 .= '<td class="dsms">' . $val . '</td>';
			$sorteio1 .= '</tr>' . PHP_EOL;
			$sorteio2 .= '</tr>' . PHP_EOL;

			// CABECALHO...
			// ---------------------------
			$str  = '<div id="cabecalho" style="background-image:url(http://testesuasorte.com/img/bgcabms.gif)">' . PHP_EOL;
			$str .= '	<div class="cab_left">' . PHP_EOL;
			$str .= '		<span class="titlConcurso">Megasena</span>' . PHP_EOL;
			$str .= '		<span class="titlResultado">Resultado do Concurso nº <span id="span_conc">'.$concurso['concurso'].'</span></span>' . PHP_EOL;
			$str .= '		<span class="titlDataSort">(Data do sorteio: <span id="data_sort">'.$concurso['data_sorteio'].')</span></span>' . PHP_EOL;
			$str .= '		<table class="tabela_jogo" cellspacing="0" cellpadding="0">' . PHP_EOL;
			$str .= '			' . $sorteio1;
			$str .= '			' . $sorteio2;
			$str .= '		</table>' . PHP_EOL;
			$str .= '	</div>' . PHP_EOL;

			$str .= '	<div class="cab_right">' . PHP_EOL;
			$str .= '		<div id="acumulou" style="display:' . $exibeAcumulado . '">' . PHP_EOL;
			$str .= '			<span id="txt_acum">ACUMULOU!'.$concurso['acumulado'].'</span>' . PHP_EOL;
			$str .= '			<span id="vlr_acum">'.$concurso['valor_acumulado'].'</span>' . PHP_EOL;
			$str .= '		</div>' . PHP_EOL;
			$str .= '		<table class="premiados" cellspacing="0" cellpadding="2">' . PHP_EOL;
			$str .= '		<tr>' . PHP_EOL;
			$str .= '			<th colspan="3">Número de acertadores</th>' . PHP_EOL;
			$str .= '		</tr>' . PHP_EOL;
			$str .= '		<tr>' . PHP_EOL;
			$str .= '			<td class="t1">Sena</td>' . PHP_EOL;
			$str .= '			<td class="t1" align="right"><span id="sena">'.$concurso['sena'].'</span></td>' . PHP_EOL;
			$str .= '			<td class="t1" align="right"><span id="premio_sena">'.$concurso['rateio_sena'].'</span></td>' . PHP_EOL;
			$str .= '		</tr>' . PHP_EOL;
			$str .= '		<tr>' . PHP_EOL;
			$str .= '			<td class="t2">Quina</td>' . PHP_EOL;
			$str .= '			<td class="t2" align="right"><span id="quina">'.$concurso['quina'].'</span></td>' . PHP_EOL;
			$str .= '			<td class="t2" align="right"><span id="quina_premio">'.$concurso['rateio_quina'].'</span></td>' . PHP_EOL;
			$str .= '		</tr>' . PHP_EOL;
			$str .= '		<tr>' . PHP_EOL;
			$str .= '			<td class="t2">Quadra</td>' . PHP_EOL;
			$str .= '			<td class="t2" align="right"><span id="quadra"></span>'.$concurso['quadra'].'</td>' . PHP_EOL;
			$str .= '			<td class="t2" align="right"><span id="quadra_premio">'.$concurso['rateio_quadra'].'</span></td>' . PHP_EOL;
			$str .= '		</tr>' . PHP_EOL;
			$str .= '		<tr>' . PHP_EOL;
			$str .= '			<td colspan="3" height="10px"></td>' . PHP_EOL;
			$str .= '		</tr>' . PHP_EOL;
			$str .= '		</table>' . PHP_EOL;

			$str .= '	</div>' . PHP_EOL;

			/*
			$str .= '	<!-- Valor para sorteio de natal-->' . PHP_EOL;
			$str .= '	<div id="valor_sorteio_natal"></div>' . PHP_EOL;
			*/

/*

			$str .= '	<br />' . PHP_EOL;
			$str .= '	<div id="dtitcrescenteDiv" class="link_azul">' . PHP_EOL;
			$str .= '		<table   border="0" width="200" cellspacing="0" cellpadding="0" align="center">' . PHP_EOL;
			$str .= '			<tr>' . PHP_EOL;
			$str .= '				<td class="txtbranco" align="center">' . PHP_EOL;
			$str .= '					<a class="ordem" tabindex="26" href="#" onclick="mostra_sorteio(); return false;" onkeypress="mostra_sorteio(); return false;">Ver números na ordem do sorteio</a>' . PHP_EOL;
			$str .= '				</td>' . PHP_EOL;
			$str .= '			</tr>' . PHP_EOL;
			$str .= '		</table>' . PHP_EOL;
			$str .= '	</div>' . PHP_EOL;


			$str .= '	<div id="dtitsorteioDiv" class="link_azul" style="display:none;">' . PHP_EOL;
			$str .= '		<table border="0" width="200" cellspacing="0" cellpadding="0" align="center">' . PHP_EOL;
			$str .= '			<tr>' . PHP_EOL;
			$str .= '				<td class="txtbranco" align="center">' . PHP_EOL;
			$str .= '					<a class="ordem" tabindex="26" href="#" onclick="mostra_crescente(); return false;" onkeypress="mostra_crescente(); return false;">Ver números em ordem crescente</a>' . PHP_EOL;
			$str .= '				</td>' . PHP_EOL;
			$str .= '			</tr>' . PHP_EOL;
			$str .= '		</table>' . PHP_EOL;
			$str .= '	</div>' . PHP_EOL;


			$str .= '	<div id="titulo_premiacao">' . PHP_EOL;
			$str .= '		<!-- Imagem de fundo do título da premiação -->' . PHP_EOL;
			$str .= '	</div>' . PHP_EOL;
			$str .= '	<span style="font-size: 14px; font-weight: bold;">Estimativa de Prêmio</span><br /><span style="color: rgb(102,102,102); font-size: 24px; font-weight: bold;"> </span> <span style="color: rgb(34,149,81); font-size: 24px; font-weight: bold;">'.$concurso['estimativa'].'</span><br /><span style="font-size: 13px;">*para o próximo concurso, a ser realizado '.$this->data_proximo_sorteio->format( 'Y/m/d H:i' ) .'h</span> <br /><br />' . PHP_EOL;
			$str .= '	<!-- Valor para sorteio de natal-->' . PHP_EOL;
			$str .= '	<div id="valor_sorteio_natal">' . PHP_EOL;
			$str .= '		<span style="color: #666666;">Valor acumulado para o sorteio da Mega da Virada :</span><br /><span style="color: #666; font-size: 14px; font-weight: bold;"> </span></b></b><span style="color: #229551; font-size: 18px;">'.$concurso['acumulado_mega_virada'].'</span>' . PHP_EOL;
			$str .= '	</div>' . PHP_EOL;
			$str .= '	<!--Valor Arrecadado-->' . PHP_EOL;
			$str .= '	<div id="vr_arrecadado">'.$concurso['arrecadacao'].'</div>' . PHP_EOL;
*/
			$str .= '</div>' . PHP_EOL;


		} else if ($this->jogo=='lotofacil') {


			// Dezenas sorteadas..
			$concurso['concurso'] = sprintf("%04s", $concurso['concurso']);
			$concurso['d1'] = sprintf("%02s", $concurso['d1']);
			$concurso['d2'] = sprintf("%02s", $concurso['d2']);
			$concurso['d3'] = sprintf("%02s", $concurso['d3']);
			$concurso['d4'] = sprintf("%02s", $concurso['d4']);
			$concurso['d5'] = sprintf("%02s", $concurso['d5']);
			$concurso['d6'] = sprintf("%02s", $concurso['d6']);
			$concurso['d7'] = sprintf("%02s", $concurso['d7']);
			$concurso['d8'] = sprintf("%02s", $concurso['d8']);
			$concurso['d9'] = sprintf("%02s", $concurso['d9']);
			$concurso['d10'] = sprintf("%02s", $concurso['d10']);
			$concurso['d11'] = sprintf("%02s", $concurso['d11']);
			$concurso['d12'] = sprintf("%02s", $concurso['d12']);
			$concurso['d13'] = sprintf("%02s", $concurso['d13']);
			$concurso['d14'] = sprintf("%02s", $concurso['d14']);
			$concurso['d15'] = sprintf("%02s", $concurso['d15']);

			// Data do sorteio...
			// ---------------------------
			$dia_semana = $this->dias_semana[strftime("%w", strtotime($concurso['data_sorteio']))];
			$concurso['data_sorteio'] = $dia_semana . ', ' . strftime("%d/%m/%Y", strtotime($concurso['data_sorteio'])) ;

			// Acertadores...
			// ---------------------------

			$concurso['arrecadacao'] = ($env=='linux') ? 'R$ '. number_format ( $concurso['arrecadacao'] , 2 , ',' , '.' ) : 'R$ '.$concurso['arrecadacao'];
			//$concurso['rateio_15_numeros'];
			$concurso['rateio_15_numeros'] = ($env=='linux') ? money_format('%n',$concurso['rateio_15_numeros']) : 'R$ '.$concurso['rateio_15_numeros'];
			//$concurso['rateio_14_numeros'];
			$concurso['rateio_14_numeros'] = ($env=='linux') ? money_format('%n',$concurso['rateio_14_numeros']) : 'R$ '.$concurso['rateio_14_numeros'];
			//$concurso['rateio_13_numeros'];
			$concurso['rateio_13_numeros'] = ($env=='linux') ? money_format('%n',$concurso['rateio_13_numeros']) : 'R$ '.$concurso['rateio_13_numeros'];
			//$concurso['rateio_12_numeros'];
			$concurso['rateio_12_numeros'] = ($env=='linux') ? money_format('%n',$concurso['rateio_12_numeros']) : 'R$ '.$concurso['rateio_12_numeros'];
			//$concurso['rateio_11_numeros'];
			$concurso['rateio_11_numeros'] = ($env=='linux') ? money_format('%n',$concurso['rateio_11_numeros']) : 'R$ '.$concurso['rateio_11_numeros'];



			// Acumulado...
			// ---------------------------
			$concurso['acumulado'] = ($concurso['acumulado']>0) ? 'ACUMULOU!' : '';
			$exibeAcumulado = ($concurso['acumulado']=='SIM') ? 'inline' : 'none';

			// $exibeAcumulado = 'inline'; // para teste apenas.. exluir..

			// Estimativa próximos concursos...
			// ---------------------------
			$concurso['estimativa'] = ($env=='linux') ? 'R$ '. number_format ( $concurso['acumulado'] , 2 , ',' , '.' ) : 'R$ '.$concurso['acumulado'];

			// Dezenas sorteadas...
			// ---------------------------
			$sorteio1 = '<tr id="sorteio1" style="display:none">';
			$sorteio2 = '<tr id="sorteio2">';
			$sorteios = array($concurso['d1'], $concurso['d2'], $concurso['d3'], $concurso['d4'], $concurso['d5'], $concurso['d6'], $concurso['d7'], $concurso['d8'], $concurso['d9'], $concurso['d10'], $concurso['d11'], $concurso['d12'], $concurso['d13'], $concurso['d14'], $concurso['d15']);
			foreach ($sorteios as $val) $sorteio1 .= '<td class="dslf">' . $val . '</td>';
			asort($sorteios);
			foreach ($sorteios as $val) $sorteio2 .= '<td class="dslf">' . $val . '</td>';
			$sorteio1 .= '</tr>' . PHP_EOL;
			$sorteio2 .= '</tr>' . PHP_EOL;

			// CABECALHO...
			// ---------------------------
			$str  = '<div id="cabecalho"  style="background-image:url(http://testesuasorte.com/img/bgcablf.gif)">' . PHP_EOL;
			$str .= '	<div class="cab_left">' . PHP_EOL;
			$str .= '		<span class="titlConcurso">Lotofácil</span>' . PHP_EOL;
			$str .= '		<span class="titlResultado">Resultado do Concurso nº <span id="span_conc">'.$concurso['concurso'].'</span></span>' . PHP_EOL;
			$str .= '		<span class="titlDataSort">(Data do sorteio: <span id="data_sort">'.$concurso['data_sorteio'].')</span></span>' . PHP_EOL;
			$str .= '		<table class="tabela_jogo" cellspacing="0" cellpadding="0">' . PHP_EOL;
			$str .= '			' . $sorteio1;
			$str .= '			' . $sorteio2;
			$str .= '		</table>' . PHP_EOL;
			$str .= '	</div>' . PHP_EOL;

			$str .= '	<div class="cab_right">' . PHP_EOL;
			$str .= '		<div id="acumulou" style="display:' . $exibeAcumulado . '">' . PHP_EOL;
			$str .= '			<span id="txt_acum">ACUMULOU!'.$concurso['acumulado'].'</span>' . PHP_EOL;
			$str .= '			<span id="vlr_acum">'.$concurso['estimativa'].'</span>' . PHP_EOL;
			$str .= '		</div>' . PHP_EOL;
			$str .= '		<table class="premiados" cellspacing="0" cellpadding="2">' . PHP_EOL;
			$str .= '		<tr>' . PHP_EOL;
			$str .= '			<th colspan="3">Número de acertadores</th>' . PHP_EOL;
			$str .= '		</tr>' . PHP_EOL;
			$str .= '		<tr>' . PHP_EOL;
			$str .= '			<td class="t1">15 Num.</td>' . PHP_EOL;
			$str .= '			<td class="t1" align="right"><span id="15n">'.$concurso['ganhadores_15_numeros'].'</span></td>' . PHP_EOL;
			$str .= '			<td class="t1" align="right"><span id="premio_15n">'.$concurso['rateio_15_numeros'].'</span></td>' . PHP_EOL;
			$str .= '		</tr>' . PHP_EOL;
			$str .= '		<tr>' . PHP_EOL;
			$str .= '			<td class="t2">14 Num.</td>' . PHP_EOL;
			$str .= '			<td class="t2" align="right"><span id="14n">'.$concurso['ganhadores_14_numeros'].'</span></td>' . PHP_EOL;
			$str .= '			<td class="t2" align="right"><span id="premio_14n">'.$concurso['rateio_14_numeros'].'</span></td>' . PHP_EOL;
			$str .= '		</tr>' . PHP_EOL;
			$str .= '		<tr>' . PHP_EOL;
			$str .= '			<td class="t2">13 Num.</td>' . PHP_EOL;
			$str .= '			<td class="t2" align="right"><span id="13n"></span>'.$concurso['ganhadores_13_numeros'].'</td>' . PHP_EOL;
			$str .= '			<td class="t2" align="right"><span id="premio_13n">'.$concurso['rateio_13_numeros'].'</span></td>' . PHP_EOL;
			$str .= '		</tr>' . PHP_EOL;
			$str .= '		<tr>' . PHP_EOL;
			$str .= '			<td colspan="3" height="10px"></td>' . PHP_EOL;
			$str .= '		</tr>' . PHP_EOL;
			$str .= '		</table>' . PHP_EOL;

			$str .= '	</div>' . PHP_EOL;

			$str .= '</div>' . PHP_EOL;


		}

		// --------------------------------------
		// Botões de Controles
		// --------------------------------------
		$str .= $tabs.'	<table id="controls" border="0" cellpadding="0" cellspacing="0" width="100%">' . PHP_EOL;
		$str .= $tabs.'		<td align="center"><button id="tudo"     name="Tudo"     type="button" class="actButton" title="Selecionar Todos os números">Marcar toda a cartela</button></td>' . PHP_EOL;
		$str .= $tabs.'		<td align="center"><button id="limpar"   name="Limpar"   type="button" class="actButton" title="Limpar a cartela. Apagar jogo atual">Limpar a cartela</button></td>' . PHP_EOL;
		$str .= $tabs.'		<td align="center"><button id="comparar" name="comparar" type="button" class="actButton" title="Comparar  jogo com resultados anteriores">Comparar com resultados passados</button></td>' . PHP_EOL;
		$str .= $tabs.'	</table>' . PHP_EOL;

		echo $str;

	}

	// ----------------------------------------------------
	// RECUPERA O ÚLTIMO CONCURSO
	// ----------------------------------------------------
	public function resultado($nrConc='') {

		if ($nrConc=='') $strSQL = "SELECT * FROM " . $this->jogo . " WHERE data_sorteio >= '".$this->data_sorteio_anterior->format('Y-m-d')."'";
		else $strSQL = "SELECT * FROM " . $this->jogo . " WHERE concurso = '".$nrConc."'";

		$this->AccessDB('SELECT', $strSQL);

		if (array_key_exists ( 'erro' , $this->rows )) {

			echo $this->rows['erro'];
			return;

		} else if (count($this->rows)>0) {

			$this->resultado_sorteio();

		} else {

			$this->acessaCaixa();
		}


	}

	// ----------------------------------------------------
	// RECUPERA O ÚLTIMO CONCURSO DIRETO DO SITE DA CAIXA
	// ----------------------------------------------------
	private function acessaCaixa() {

		if ($this->jogo=='megasena') {

			/* ------------------------------------------------
			   POSIÇÃO DOS CAMPOS NA STRING DE RETORNO DA CAIXA
			   -------------------------------------------------
			$campo[0]	// span_conc (numero sorteio)
			$campo[1]	// valor acumulado
			$campo[2]	// 'num_sorteados'
			$campo[3]	// 'sena'
			$campo[4]	// 'premio_sena'
			$campo[5]	// 'quina'
			$campo[6]	// 'quina_premio'
			$campo[7]	// 'quadra'
			$campo[8]	// 'quadra_premio'
			$campo[9]	// $imagem_anterior
			$campo[10]	// $imagem_posterior
			$campo[11]	// $data_conc
			$campo[12]	// cidade onde foi realizado o sorteio
			$campo[13]	// estado  onde foi realizado o sorteio
			$campo[14]	// $auditorio
			$campo[15]	// 'observacao'
			$campo[16]	// $prx_concurso - Nr. Prox. conc final (zero ou cinco)
			$campo[17]	// (zero ou cinco) = '0' ou = '5'. Tipo do proximo concurso com val. acumulado 
			$campo[18]	// Valor que está acumulado para este concurso (zero ou cinco)
			$campo[19]	// tabela de ganhadores da sena
			$campo[20]	// Numeros sorteados em ordem crescente
			$campo[21]	// Estimativa de Prêmio para o próximo concurso
			$campo[22]	// data do prox. concurso
			$campo[23]	// acumulado para a mega da virada
			$campo[24]	// valor arrecadado
			----------------------------------------------------- */

			$retornoHttp = 'http://www1.caixa.gov.br/loterias/loterias/megasena/megasena_pesquisa_new.asp?f_megasena=';
			try {
				$resultado = @file_get_contents($retornoHttp); 
				if ($resultado !== false) {

					//$resultado = '1433|0,00|<span class="num_sorteio"><ul><li>14</li><li>46</li><li>40</li><li>13</li><li>04</li><li>52</li></ul></span>|1|33.905.517,49|124|26.342,96|9.358|498,66|<a class="btn_conc_ant_megasena" href="javascript:carrega_concurso(1432);" tabindex="27" title="Ver concurso anterior">Ver concurso anterior</a>||13/10/2012|TOLEDO |PR|C||1435|5|13.351.480,35|<div id="ganhadores_novo_modelo">	<table>		<thead>			<tr>				<th class="largura_uf">UF</th>				<th>Nº de Ganhadores</th>			</tr>		</thead>		<tbody>			<tr class="destaca_estado">				<td>CE</td>				<td>1</td>			</tr>			<tr>				<td><span> VIÇOSA DO CEARÁ                                  </span></td>				<td>1</td>			</tr>		</tbody>	</table></div>|<span class="num_sorteio"><ul><li>04</li><li>13</li><li>14</li><li>40</li><li>46</li><li>52</li></ul></span>|2.000.000,00|17/10/2012|42.942.062,39|55.794.726,00';
					$retorno = explode("|", $resultado);
					$campo = $retorno;

					$dz = array();
					for ($i=0; $i<count($campo); $i++) {

						if ($i==2) {
							$dz = preg_split('/<[^>]*[^\/]>/i', $campo[$i], -1, PREG_SPLIT_NO_EMPTY | PREG_SPLIT_DELIM_CAPTURE);

						} else if (preg_match('/^(0[1-9]|[1-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/[0-9]{4}$/', $campo[$i])) { 
							// Conversão data sorteio de dd/mm/aaaa para aaaa-mm-dd
							list($d, $m, $y) = preg_split('/\//', $campo[$i]);
							$campo[$i] = sprintf('%4d-%02d-%02d', $y, $m, $d);
	
						} else if (strpos($campo[$i], '.')>0) {
							// Retira pontos decimais e converte virgula para ponto em valores
							$campo[$i] = str_replace('.', '', $campo[$i]);
							$campo[$i] = str_replace(',', '.', $campo[$i]);

						} else if (strpos($campo[$i], ',')>0) {
							// Retira pontos decimais e converte virgula para ponto em valores
							$campo[$i] = str_replace(',', '.', $campo[$i]);
						}

					}
	
					$acumulou = ($campo[1]!=0.00) ? 'SIM' : 'NÃO';
	
					$strSQL  = "INSERT INTO megasena (concurso, data_sorteio, d1, d2, d3, d4, d5, d6, arrecadacao, sena, rateio_sena, quina, rateio_quina, quadra, rateio_quadra, acumulado, valor_acumulado, estimativa, acumulado_mega_virada) VALUES ";
					$strSQL .= "(";
					$strSQL	.= "'".$campo[0]."', "; 	// concurso mediumint(9) NOT NULL AUTO_INCREMENT
					$strSQL	.= "'".$campo[11]."', ";	// data_sorteio date NOT NULL,
					$strSQL	.= "'".$dz[0]."', ";		// d1 tinyint(4) NOT NULL,
					$strSQL	.= "'".$dz[1]."', ";		// d2 tinyint(4) NOT NULL,
					$strSQL	.= "'".$dz[2]."', ";		// d3 tinyint(4) NOT NULL,
					$strSQL	.= "'".$dz[3]."', ";		// d4 tinyint(4) NOT NULL,
					$strSQL	.= "'".$dz[4]."', ";		// d5 tinyint(4) NOT NULL,
					$strSQL	.= "'".$dz[5]."', ";		// d6 tinyint(4) NOT NULL,
					$strSQL	.= "'".$campo[24]."', ";	// arrecadacao decimal(11,2) NOT NULL,
					$strSQL	.= "'".$campo[3]."', "; 	// sena smallint(6) NOT NULL,
					$strSQL	.= "'".$campo[4]."', "; 	// rateio_sena decimal(11,2) NOT NULL,
					$strSQL	.= "'".$campo[5]."', "; 	// quina smallint(6) NOT NULL,
					$strSQL	.= "'".$campo[6]."', "; 	// rateio_quina decimal(11,2) NOT NULL,
					$strSQL	.= "'".$campo[7]."', "; 	// quadra smallint(6) NOT NULL,
					$strSQL	.= "'".$campo[8]."', "; 	// rateio_quadra decimal(11,2) NOT NULL,
					$strSQL	.= "'".$acumulou."', "; 	// acumulado text NOT NULL,
					$strSQL	.= "'".$campo[1]."', "; 	// valor_acumulado decimal(11,2) NOT NULL,
					$strSQL	.= "'".$campo[21]."', "; 	// estimativa decimal(11,2) NOT NULL,
					$strSQL	.= "'".$campo[23]."');"; 	// acumulado_mega_virada decimal(11,2) NOT NULL,

					$this->AccessDB('INSERT', $strSQL);

					if (array_key_exists ( 'erro' , $this->rows )) {

						if ($this->rows['erro']=='1062') {

							$this->resultado($campo[0]);

						} else {

							echo $this->rows['erro'];

						}

					} else if (count($this->rows)>0) {

						$this->resultado($this->rows[0]);

					}
				}

			}  catch (Exception $e) {

				echo $e->getMessage();

			}

		} else if ($this->jogo=='lotofacil') {

			$retornoHttp = 'http://www1.caixa.gov.br/loterias/loterias/lotofacil/lotofacil_pesquisa_new.asp?f_lotofacil=';
			//$retornoHttp = 'http://www1.caixa.gov.br/loterias/loterias/lotofacil/lotofacil_pesquisa_new.asp?submeteu=sim&opcao=concurso&txtConcurso=883';
			try {
				$resultado = @file_get_contents($retornoHttp); 
				if ($resultado !== false) {

					//884|<a href="javascript:carrega_concurso(883);" tabindex=27><img src="/loterias/_images/button/btn_conc_ant_lotofacil.jpg" alt="Ver concurso anterior" border="0"></a>||01|04|07|08|09|10|12|13|15|17|18|19|20|21|25|1|1.499.202,51|461|1.429,47|17.526|12,50|227.344|5,00|1.270.539|2,50| ...
					$retorno = explode("|", $resultado);
					$campo = $retorno;

					// Cria array jogo que irá conter 5 grupos de 5 números
					$jogo = array();

					// Coloca 5 colunas em array jogo
					for($c=1;$c<6;$c++) $jogo[$c]= array(1=>0, 2=>0, 3=>0, 4=>0, 5=>0);

					for ($i=0; $i<count($campo); $i++) {

						if ($i==2) {
							$dz = preg_split('/<[^>]*[^\/]>/i', $campo[$i], -1, PREG_SPLIT_NO_EMPTY | PREG_SPLIT_DELIM_CAPTURE);

						} else if ($i>2 && $i<18) {

							$dzn = intval($campo[$i]);

							    if ($dzn>0  && $dzn<6)  { $grupo=1; $d=$dzn;    }
							elseif ($dzn>5  && $dzn<11) { $grupo=2; $d=$dzn-5;  }
							elseif ($dzn>10 && $dzn<16) { $grupo=3; $d=$dzn-10; }
							elseif ($dzn>15 && $dzn<21) { $grupo=4; $d=$dzn-15; }
							elseif ($dzn>20)            { $grupo=5; $d=$dzn-20; };

							$jogo[$grupo][$d] = pow(2, $d-1);


						} else if (preg_match('/^(0[1-9]|[1-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/[0-9]{4}$/', $campo[$i])) { 
							// Conversão data sorteio de dd/mm/aaaa para aaaa-mm-dd
							list($d, $m, $y) = preg_split('/\//', $campo[$i]);
							$campo[$i] = sprintf('%4d-%02d-%02d', $y, $m, $d);
	
						} else if (strpos($campo[$i], '.')>0) {
							// Retira pontos decimais e converte virgula para ponto em valores
							$campo[$i] = str_replace('.', '', $campo[$i]);
							$campo[$i] = str_replace(',', '.', $campo[$i]);

						} else if (strpos($campo[$i], ',')>0) {
							// Retira pontos decimais e converte virgula para ponto em valores
							$campo[$i] = str_replace(',', '.', $campo[$i]);
						}

					}

					$linha = array(1=>0, 2=>0, 3=>0, 4=>0, 5=>0);
					$media = 0;
					$maior = 0;
					$menor = 99;

					foreach ($jogo as $grupo => $vals) {
					
						foreach ( $vals as $v ) {
							$linha[$grupo] += $v;
							$media += $v;
						}

						$media = $media/5;

						foreach ( $linha as $v ) {
							if ($v>0) {
								if ($v>$maior) $maior=$v;
								if ($v<$menor) $menor=$v;
							}
						}
					
					}
	
					$acumulou = ($campo[36]!=0.00) ? 'SIM' : 'NÃO';
	
					$strSQL  = "INSERT INTO lotofacil (concurso, data_sorteio, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15, arrecadacao, ganhadores_15_numeros, ganhadores_14_numeros, ganhadores_13_numeros, ganhadores_12_numeros, ganhadores_11_numeros, rateio_15_numeros, rateio_14_numeros, rateio_13_numeros, rateio_12_numeros, rateio_11_numeros, acumulado, estimativa, grupo1, grupo2, grupo3, grupo4, grupo5, maior, menor, media) VALUES " . PHP_EOL ;
					$strSQL .= "(";
					$strSQL	.= "'".$campo[0]."', "; 	// concurso mediumint(9) NOT NULL AUTO_INCREMENT
					$strSQL	.= "'".$campo[34]."', ";	// data_sorteio date NOT NULL,
					$strSQL	.= "'".$campo[3]."', ";		// d1 tinyint(4) NOT NULL,
					$strSQL	.= "'".$campo[4]."', ";		// d2 tinyint(4) NOT NULL,
					$strSQL	.= "'".$campo[5]."', ";		// d3 tinyint(4) NOT NULL,
					$strSQL	.= "'".$campo[6]."', ";		// d4 tinyint(4) NOT NULL,
					$strSQL	.= "'".$campo[7]."', ";		// d5 tinyint(4) NOT NULL,
					$strSQL	.= "'".$campo[8]."', ";		// d6 tinyint(4) NOT NULL,
					$strSQL	.= "'".$campo[9]."', ";		// d7 tinyint(4) NOT NULL,
					$strSQL	.= "'".$campo[10]."', ";	// d8 tinyint(4) NOT NULL,
					$strSQL	.= "'".$campo[11]."', ";	// d9 tinyint(4) NOT NULL,
					$strSQL	.= "'".$campo[12]."', ";	// d10 tinyint(4) NOT NULL,
					$strSQL	.= "'".$campo[13]."', ";	// d11 tinyint(4) NOT NULL,
					$strSQL	.= "'".$campo[14]."', ";	// d12 tinyint(4) NOT NULL,
					$strSQL	.= "'".$campo[15]."', ";	// d13 tinyint(4) NOT NULL,
					$strSQL	.= "'".$campo[16]."', ";	// d14 tinyint(4) NOT NULL,
					$strSQL	.= "'".$campo[17]."', ";	// d15 tinyint(4) NOT NULL,
					$strSQL	.= "'".$campo[55]."', ";	// arrecadacao decimal(11,2) NOT NULL,
					$strSQL	.= "'".$campo[18]."', ";	// ganhadores_15_numeros smallint(6) NOT NULL,
					$strSQL	.= "'".$campo[20]."', ";	// ganhadores_14_numeros smallint(6) NOT NULL,
					$strSQL	.= "'".$campo[22]."', ";	// ganhadores_13_numeros smallint(6) NOT NULL,
					$strSQL	.= "'".$campo[24]."', ";	// ganhadores_12_numeros smallint(6) NOT NULL,
					$strSQL	.= "'".$campo[26]."', ";	// ganhadores_11_numeros smallint(6) NOT NULL,
					$strSQL	.= "'".$campo[19]."', ";	// rateio_15_numeros decimal(11,2) NOT NULL,
					$strSQL	.= "'".$campo[21]."', ";	// rateio_14_numeros decimal(11,2) NOT NULL,
					$strSQL	.= "'".$campo[23]."', ";	// rateio_13_numeros decimal(11,2) NOT NULL,
					$strSQL	.= "'".$campo[25]."', ";	// rateio_12_numeros decimal(11,2) NOT NULL,
					$strSQL	.= "'".$campo[27]."', ";	// rateio_11_numeros decimal(11,2) NOT NULL,
					$strSQL	.= "'".$campo[36]."', ";	// acumulado decimal(11,2) NOT NULL,
					$strSQL	.= "'".$campo[53]."', ";	// estimativa decimal(11,2) NOT NULL,
					$strSQL	.= "'".$linha[1]."', ";		// grupo1 tinyint(4) NOT NULL,
					$strSQL	.= "'".$linha[2]."', ";		// grupo1 tinyint(4) NOT NULL,
					$strSQL	.= "'".$linha[3]."', ";		// grupo1 tinyint(4) NOT NULL,
					$strSQL	.= "'".$linha[4]."', ";		// grupo1 tinyint(4) NOT NULL,
					$strSQL	.= "'".$linha[5]."', ";		// grupo1 tinyint(4) NOT NULL,
					$strSQL	.= "'".$maior."', ";		// grupo1 tinyint(4) NOT NULL,
					$strSQL	.= "'".$menor."', ";		// grupo1 tinyint(4) NOT NULL,
					$strSQL	.= "'".$media."')";		// media decimal(6,2) NOT NULL,

					$this->AccessDB('INSERT', $strSQL);

					if (array_key_exists ( 'erro' , $this->rows )) {

						if ($this->rows['erro']=='1062') {

							$this->resultado($campo[0]);

						} else {

							echo $this->rows['erro'];

						}

					} else if (count($this->rows)>0) {

						$this->resultado($this->rows[0]);

					}

				}

			}  catch (Exception $e) {

				echo $e->getMessage();

			}

		}

	}

	private function listar_resultados() {

		if ($this->jogo=='lotofacil') {


			$strSQL = "SELECT concurso, grupo1, grupo2, grupo3, grupo4, grupo5, maior, menor, media FROM lotofacil WHERE 1";

			$this->AccessDB('SELECT', $strSQL);

			if (array_key_exists ( 'erro' , $this->rows )) {

				echo $this->rows['erro'];
				return;

			} else if (count($this->rows)>0) {

				$this->resultado_sorteio();

			}


		}

	}

	// ----------------------------------------------------
	// EXECUTA SQL NO BANCO DE DADOS E RETORNA RESULTADO
	// ----------------------------------------------------
	private function AccessDB($operation, $strSQL='') {

		$this->rows = array();

		// ----------------------------------------------------
		// RECUPERA O ÚLTIMO SORTEIO GRAVADO NO BANCO DE DADOS
		// ----------------------------------------------------
		if ($operation=='SELECT') {

			try {

				foreach ($this->dbh->query($strSQL) as $row) {

					$this->rows[] = $row;
				}

			}  catch (Exception $e) {

				$this->rows['erro'] = $e->getMessage();

			}

		// ----------------------------------------------------
		// INSERE REGISTROS
		// ----------------------------------------------------
		} else if ($operation=='INSERT') {

			try {

				$this->dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
				$this->dbh->beginTransaction();
				$this->dbh->exec($strSQL);
				$this->rows[0] = $this->dbh->lastInsertId();
				$this->dbh->commit();

			} catch (Exception $e) {

				$this->dbh->rollBack();
				$erro = $this->dbh->errorInfo();
				if ($erro[1]=='1062') $this->rows['erro'] = '1062'; // Duplicate entry key 'PRIMARY' 
				else $this->rows['erro'] = $e->getMessage();
			}

		}

	}

	// ----------------------------------------------------
	// ARMAZENA MENSAGENS DE ERRO
	// ----------------------------------------------------
	public function logerro($er) {

		$this->log[] = date ( 'Y/m/d H:i:s' ) . ' - ' . $er;

	}

	// ----------------------------------------------------
	// GRAVA MENSAGENS DE ERRO
	// ----------------------------------------------------
	public function savelog() {

		$logtxt = PHP_EOL . ' ---------------------------------------------------------------------------------------------------------------------------- ' . PHP_EOL;

		foreach ($this->log as $err) $logtxt .= $err . PHP_EOL;

		$logtxt = PHP_EOL . PHP_EOL . $logtxt;

		$filename = TMP_DIR . 'log.txt';

		if ( $f = fopen($filename, 'a' ) ) {

			if ( ! fwrite ( $f, $logtxt ) ) {

				echo '<pre>' . $loteria->agora->format('d/m/Y H:i:s') . ' - NÃO FOI POSSÍVEL GRAVAR O LOG NO DIRETÓRIO:' . TMP_DIR . PHP_EOL;
				echo PHP_EOL . $logtxt . '</pre>';

			}

			fclose($f);

		}

	}


/* ----------------------------------------------------------- 
  PARA IMPLEMENTAR AINDA
  ------------------------------------------------------------

$intervalo = $loteria->agora->diff ( $loteria->data_proximo_sorteio );
$limite_tempo_frmt = $loteria->data_proximo_sorteio->format ( 'Y/m/d H:i:s' );
$limite_tempo = new DateTime ( $limite_tempo_frmt );
$limite_tempo->modify ( '-1 hour' );
$para_jogar = $loteria->agora->diff ( $limite_tempo );



	echo $loteria->dias_semana[$loteria->agora->format('w')].'-'.$loteria->agora->format('d/m/Y H:i').'h'. PHP_EOL;
	echo 'Último Sorteio: '.$loteria->dias_semana[$loteria->data_sorteio_anterior->format('w')].'-'.$loteria->data_sorteio_anterior->format('d/m/Y H:i').'h'. PHP_EOL;
	echo 'Próximo Sorteio: '.$loteria->dias_semana[$loteria->data_proximo_sorteio->format('w')].'-'.$loteria->data_proximo_sorteio->format('d/m/Y H:i').'h'. PHP_EOL;
	echo 'Faltam '.$intervalo->format('%R%a dia(s), %H:%I hora(s)').' para o próximo sorteio' . PHP_EOL;
	echo 'Você tem '.$para_jogar->format('%R%a dia(s), %H:%I hora(s)').' para jogar' . PHP_EOL;

echo '$intervalo'.PHP_EOL;	
echo 'dias='.$intervalo->days .PHP_EOL;
echo PHP_EOL;
	 
echo '$para_jogar'.PHP_EOL;	
	print_r($para_jogar);
echo PHP_EOL;


*/
} // Class loteria END

?>