<?php
header("Cache-Control: no-cache");
header("Expires: -1");
/********************************* 
 * admin_locais_xml.php          *
 *********************************/

	//error_reporting('ERROR');
	include_once "./inc/lotr_mntxml.inc";
	include_once "./inc/lotr_conectar.inc";
	conectar('PDO'); 

	$level = 0;
	$message = "Não foi possível atualizar os dados!";

/*****************************************************
 * ROTINAS PRINCIPAIS
 *****************************************************/

	$command = (isset($_REQUEST['command'])) ? $_REQUEST['command'] : 'ENTER';

	if ($command=='COMPARE') $command .= '_' . strtoupper($_REQUEST['jogo']);

	$xmlResponseType = 'short';

	if ($command=='ENTER') {

		$xmlResponseType = 'just display the initial page';
		$command = 'enter';
		$result  = 'true';
		$styleSheet = 'admin_locais_xsl.php';

		$attributes = array();
		$encoding='UTF-8';
		$XML  = __xmlHeader('locais', $styleSheet, $encoding);
		$level++;
		$XML .= __writeClosedNode('command', $attributes ,$command);
		$XML .= __writeClosedNode('result', $attributes ,$result);
		$level--;
		$XML .= __xmlFooter('locais');
		header('Content-type: text/xml');
		print utf8_encode($XML);
 
	} else if ($command=='INSERT') {

		$command = 'insert';

		// Site Internet
		$_REQUEST['site']=str_replace('http://','',$_REQUEST['site']);

		$fieldList = "";
		$valueList = "";
		foreach($_REQUEST as $k=>$v) {
			if ($k!='command' && $k!='id_local') {
				$fieldList .= ($fieldList=="") ? "" : ", ";
				$fieldList .= $k;
				$v = "'".utf8_decode(addslashes($v))."'";
				$valueList .= ($valueList=="") ? "" : ", ";
				$valueList .= $v;
			}
		}

		$strSQL = "INSERT INTO site_locais ($fieldList) VALUES ($valueList)";

		if($result=mysql_query($strSQL)) {
			$result   = 'true';
			$id_local = mysql_insert_id();
			$message  = "Novo Local Salvo!";
		} else {
			$result   = 'false';
			$id_local = -1;
			$message  = "Falha no Acesso ao Banco de Dados!";
		};

	} else if ($command=='UPDATE') {

		$command  = 'update';

		$strSQL = "UPDATE site_locais SET
 				id_tipo='".$_REQUEST['id_tipo']."',
 				lat='".$_REQUEST['lat']."',
 				lng='".$_REQUEST['lng']."',
 				zoom='".$_REQUEST['zoom']."',
 				id_timezone='".addslashes($_REQUEST['id_timezone'])."',
 				gmtOffset='".$_REQUEST['gmtOffset']."',
 				nome='".addslashes($_REQUEST['nome'])."',
 				id_pais='".$_REQUEST['id_pais']."',
 				pais='".addslashes($_REQUEST['pais'])."',
 				estado='".addslashes($_REQUEST['estado'])."',
 				cidade='".addslashes($_REQUEST['cidade'])."',
 				bairro='".addslashes($_REQUEST['bairro'])."',
 				endereco='".addslashes($_REQUEST['endereco'])."',
 				cep='".$_REQUEST['cep']."',
 				contato='".addslashes($_REQUEST['contato'])."',
 				telefone='".$_REQUEST['telefone']."',
 				site='".$_REQUEST['site']."',
 				email='".$_REQUEST['email']."',
 				logo='".$_REQUEST['logo']."',
 				mostrar='".$_REQUEST['mostrar']."'
 			WHERE id_local=".$_REQUEST['id_local'];

		if($result=mysql_query($strSQL)) {
			$result   = 'true';
			$message  = "Dados Atualizados!";
		} else {
			$result   = 'false';
			$message  = "Falha no Acesso ao Banco de Dados!";
		};

	} else if ($command=='DELETE') {

		$command  = 'delete';
		$strSQL = "DELETE FROM site_locais WHERE id_local='".$_REQUEST['id']."'";
		$id_local = -1;
		if($result=mysql_query($strSQL)) {
			$result   = 'true';
			$message  = "Local excuído!";
		} else {
			$result   = 'false';
			$message  = "Falha no Acesso ao Banco de Dados!";
		};

	} else if ($command=='SELECT') {


		$xmlResponseType = 'table of addresses';
		$styleSheet = '';
		$attributes = array();
		$encoding =  "UTF-8";
		$XML = __xmlHeader('tblocais', $styleSheet, $encoding);
		$atCountry = '';
		$atState = '';
		$colNr = 0;
		$tbPlace = "<table style=\"width:525px\" cellSpacing=\"5\">\r\n";

		// Brazil ...........
		$strSQL="SELECT site_locais.*,
			        site_localidades.nome AS nome_estado 
			 FROM   site_locais LEFT JOIN site_localidades ON site_locais.estado=site_localidades.estado
			 WHERE  site_locais.id_pais='br'
			 AND    site_localidades.grupo='-1'
			 ORDER BY pais, nome_estado, cidade, nome";

		if($result=mysql_query($strSQL)) {
			$colNr = 0;
			while ($row=mysql_fetch_array($result, MYSQL_ASSOC)) {
				if ($atCountry!=$row['id_pais']) {
					divCountry($row['pais']);
					$atCountry = $row['id_pais'];
					$atState = '';
				}
				if ($atState!=$row['nome_estado']) divState($row['nome_estado']);
				cell($row);
			}
			while ($colNr > 0 && $colNr < 3) {
				$tbPlace .= "\t\t<td class=\"local-empty\">\r\n\t\t</td>\r\n";
				$colNr++;
			}
			$tbPlace .= "\t</tr>\r\n";
		}

		// Other Countries ...........
		$strSQL="SELECT site_locais.*
			 FROM   site_locais
			 WHERE  site_locais.id_pais != 'br'
			 ORDER BY pais, estado, cidade, nome";

		if($result=mysql_query($strSQL)) {
			$atCountry = '';
			$colNr = 0;
			while ($row=mysql_fetch_array($result, MYSQL_ASSOC)) {
				if ($atCountry!=$row['id_pais']) {
					divCountry($row['pais']);
					$atCountry = $row['id_pais'];
					$tbPlace .= "\t<tr>\r\n";
				}
				cell($row);
			}
			while ($colNr > 0 && $colNr < 3) {
				$tbPlace .= "\t\t<td class=\"local-empty\">\r\n\t\t</td>\r\n";
				$colNr++;
			}
			$tbPlace .= "\t</tr>\r\n";
		}

		$tbPlace .= "</table>\r\n";
		$XML .= $tbPlace;
		$XML .= __xmlFooter('tblocais');

		header('Content-type: text/xml');
		print utf8_encode($XML);

	} else if ($command=='QUERY') {

		$xmlResponseType = 'single query';
		$styleSheet = '';
		$attributes = array();
		$encoding='UTF-8';
		$XML = __xmlHeader('query', $styleSheet, $encoding);


		$strSQL =  "SELECT site_locais.*,
				site_paises.language,
				site_paises.currency,
				site_paises.currency_code,
				site_paises.currency_symbol
			FROM  site_locais, site_paises
			WHERE site_locais.id_pais=site_paises.id_country
			AND   id_local='".$_REQUEST['id']."'";

		if($result=mysql_query($strSQL)) {
			if ($row=mysql_fetch_array($result, MYSQL_ASSOC)) {
				$level++;
					foreach($row as $label=>$value) {
						$XML .= __writeClosedNode($label, $attributes ,$value);
					}
				$level--;
			}
		}
		$XML .= __xmlFooter('query');

		header('Content-type: text/xml');
		print utf8_encode($XML);

	} else if ($command=='CONSULTA_CAIXA') {

	// ---------------------------------------------------
	// COMPARA RESULTADOS DA MEGASENA
	// ---------------------------------------------------
	} else if ($command=='COMPARE_MEGASENA') {

		global $dbh;

		$d = explode(":", $_REQUEST['aposta']);
		$inList = '(';
		for ($n=0; $n<count($d); $n++) {
			$inList .= ($inList=='(') ? '' : ', ';
			$inList .= $d[$n]*1;
		}
		$inList .= ')';

		//$dzc  = $_REQUEST['dzc'];
		$ORDER   = " ORDER BY d1, d2, d3, d4, d5, d6";

		$cabCompare  = "<tr><th id=\"conc\"><a href=\"Javascript:void(0);\" onclick=\"ts_resortTable(this, 0);return false;\">Conc.<span class=\"sortarrow\"><img src=\"./img/arrow-none.gif\"/></span></a></th>";
		$cabCompare .= "<th colspan=\"6\"><a href=\"Javascript:void(0);\" onclick=\"ts_resortTable(this, 1);return false;\">Resultado<span class=\"sortarrow\"><img src=\"./img/arrow-none.gif\"/></span></a></th></tr>".PHP_EOL;

		$WHERE_CLAUSE = "";

		for ($n=1; $n<7; $n++) {
			$vr='d'.$n; 
			$WHERE_CLAUSE .= ($WHERE_CLAUSE=="") ? "" : " OR ";
			$WHERE_CLAUSE .= $vr." IN ".$inList;
		}

		$strSQL = "SELECT concurso, d1, d2, d3, d4, d5, d6 FROM megasena WHERE \r\n".$WHERE_CLAUSE.$ORDER;

		$duque = array();
		$terno = array();
		$quadra = array();
		$quina = array();
		$sena = array();

		try {

			foreach ($dbh->query($strSQL) as $rowdata) {


				$dezena = array();
				$dezena[1]=sprintf("%02s", $rowdata['d1']);
				$dezena[2]=sprintf("%02s", $rowdata['d2']); 
				$dezena[3]=sprintf("%02s", $rowdata['d3']); 
				$dezena[4]=sprintf("%02s", $rowdata['d4']); 
				$dezena[5]=sprintf("%02s", $rowdata['d5']); 
				$dezena[6]=sprintf("%02s", $rowdata['d6']);

				$acertos = 0;

				//$numeros = "(";

				for ($n=0; $n<count($d); $n++) {

					if (in_array($d[$n], $dezena)) {
						$dezena = formatnum($d[$n], $dezena);
						$acertos++;
						//$numeros .= ($numeros=="(") ? '' : '-';
						//$numeros .= $d[$n];
					}
					
				}

				for ($n=1; $n<count($dezena)+1; $n++) {
					if (substr($dezena[$n],0,1)!='<') $dezena[$n] = "<td class=\"na ms\">" . $dezena[$n] . "</td>";

				}

				//$numeros .= ")";

				$str = "<tr><td class=\"conc\">" . sprintf("%04s",$rowdata['concurso']) . "</td>" . $dezena[1] . $dezena[2] . $dezena[3] . $dezena[4] . $dezena[5] . $dezena[6] ."</tr>".PHP_EOL;
			
				/*
				if ($acertos==2) $duque[]  = $str;
				else 
				*/
				if ($acertos==3) $terno[]  = $str;
				else if ($acertos==4) $quadra[] = $str;
				else if ($acertos==5) $quina[]  = $str;
				else if ($acertos==6) $sena[]   = $str;

			}

		}  catch (Exception $e) {

				echo $e->getMessage();

		}



		header('Content-type: text/xml');

		$xmlResponseType = 'compare';
		$styleSheet = '';
		$attributes = array();
		$encoding='UTF-8';
		echo utf8_encode(__xmlHeader('compare', $styleSheet, $encoding));

		if (count($sena)>0) {
			echo utf8_encode("<div id=\"ac6\" class=\"acdiv\" onclick=\"showTab('actab6','im6')\"><img id=\"im6\" class=\"acbtn\" src=\"./img/plus.gif\" /><span>Sena em " . count($sena)  ." jogo(s)</span></div>".PHP_EOL);
			echo utf8_encode("<table id=\"actab6\" class=\"actab\" cellSpacing=\"5\" style=\"display:none\">".PHP_EOL);
			echo utf8_encode($cabCompare);
			foreach ($sena as $linha) {
				echo utf8_encode($linha);
			};
			echo utf8_encode("</table>");
		}

		if (count($quina)>0) {
			echo utf8_encode("<div id=\"ac5\" class=\"acdiv\" onclick=\"showTab('actab5','im5')\"><img id=\"im5\" class=\"acbtn\" src=\"./img/plus.gif\" /><span>Quina em " . count($quina)  ." jogo(s)</span></div>".PHP_EOL);
			echo utf8_encode("<table id=\"actab5\" class=\"actab\" cellSpacing=\"5\" style=\"display:none\">".PHP_EOL);
			echo utf8_encode($cabCompare);
			foreach ($quina as $linha) {
				echo utf8_encode($linha);
			};
			echo utf8_encode("</table>");
		}

		if (count($quadra)>0) {
			echo utf8_encode("<div id=\"ac4\" class=\"acdiv\" onclick=\"showTab('actab4','im4')\"><img id=\"im4\" class=\"acbtn\" src=\"./img/plus.gif\" /><span>Quadra em " . count($quadra)  ." jogo(s)</span></div>".PHP_EOL);
			echo utf8_encode("<table id=\"actab4\" class=\"actab\" cellSpacing=\"5\" style=\"display:none\">".PHP_EOL);
			echo utf8_encode($cabCompare);
			foreach ($quadra as $linha) {
				echo utf8_encode($linha);
			};
			echo utf8_encode("</table>");

		}

		if (count($terno)>0) {
			echo utf8_encode("<div id=\"ac3\" class=\"acdiv\" onclick=\"showTab('actab3','im3')\"><img id=\"im3\" class=\"acbtn\" src=\"./img/plus.gif\" /><span>Terno em " . count($terno)  ." jogo(s)</span></div>".PHP_EOL);
			echo utf8_encode("<table id=\"actab3\" class=\"actab\" cellSpacing=\"5\" style=\"display:none\">".PHP_EOL);
			echo utf8_encode($cabCompare);
			foreach ($terno as $linha) {
				echo utf8_encode($linha);
			};
			echo utf8_encode("</table>");

		}
/*
		if (count($duque)>0) {
			echo utf8_encode("<div id=\"ac2\" class=\"acdiv\" onclick=\"showTab('actab2','im2')\"><img id=\"im2\" class=\"acbtn\" src=\"./img/plus.gif\" /><span>2 acertos " . count($duque)  ." jogo(s)</span></div>".PHP_EOL);
			echo utf8_encode("<table id=\"actab2\" class=\"actab\" cellSpacing=\"5\" style=\"display:none\">".PHP_EOL);
			echo utf8_encode($cabCompare);
			foreach ($duque as $linha) {
				echo utf8_encode($linha);
			};
			echo utf8_encode("</table>");

		}
*/
		echo utf8_encode(__xmlFooter('compare'));

	// ---------------------------------------------------
	// COMPARA RESULTADOS DA LOTOFÁCIL
	// ---------------------------------------------------
	}  else if ($command=='COMPARE_LOTOFACIL') {

		global $dbh;

		$comb     = array();
		$comb[0]  = array(0,0,0,0,0);
		$comb[1]  = array(1,0,0,0,0);
		$comb[2]  = array(0,1,0,0,0);
		$comb[3]  = array(1,1,0,0,0);
		$comb[4]  = array(0,0,1,0,0);
		$comb[5]  = array(1,0,1,0,0);
		$comb[6]  = array(0,1,1,0,0);
		$comb[7]  = array(1,1,1,0,0);
		$comb[8]  = array(0,0,0,1,0);
		$comb[9]  = array(1,0,0,1,0);
		$comb[10] = array(0,1,0,1,0);
		$comb[11] = array(1,1,0,1,0);
		$comb[12] = array(0,0,1,1,0);
		$comb[13] = array(1,0,1,1,0);
		$comb[14] = array(0,1,1,1,0);
		$comb[15] = array(1,1,1,1,0);
		$comb[16] = array(0,0,0,0,1);
		$comb[17] = array(1,0,0,0,1);
		$comb[18] = array(0,1,0,0,1);
		$comb[19] = array(1,1,0,0,1);
		$comb[20] = array(0,0,1,0,1);
		$comb[21] = array(1,0,1,0,1);
		$comb[22] = array(0,1,1,0,1);
		$comb[23] = array(1,1,1,0,1);
		$comb[24] = array(0,0,0,1,1);
		$comb[25] = array(1,0,0,1,1);
		$comb[26] = array(0,1,0,1,1);
		$comb[27] = array(1,1,0,1,1);
		$comb[28] = array(0,0,1,1,1);
		$comb[29] = array(1,0,1,1,1);
		$comb[30] = array(0,1,1,1,1);
		$comb[31] = array(1,1,1,1,1);

		$d = explode(":", $_REQUEST['aposta']);

		// Cria array jogo que irá conter 5 grupos de 5 números
		$jogo = array();

		// Coloca 5 colunas em array jogo
		for ($grupo=1;$grupo<6;$grupo++) {
			$jogo = array(1=>0, 2=>0, 3=>0, 4=>0, 5=>0);
		};

		// Calcula a forma compacta do jogo
		foreach ($d as $dzn) {

			$dz = intval($dzn);

			    if ($dz>0  && $dz<6)  { $grupo=1; }
			elseif ($dz>5  && $dz<11) { $grupo=2; $dz=$dz-5;  }
			elseif ($dz>10 && $dz<16) { $grupo=3; $dz=$dz-10; }
			elseif ($dz>15 && $dz<21) { $grupo=4; $dz=$dz-15; }
			elseif ($dz>20)           { $grupo=5; $dz=$dz-20; };

			$jogo[$grupo] +=  pow(2, $dz-1);

		};

		$inList = '(';
		for($grupo=1;$grupo<6;$grupo++) {
			$inList .= ($inList=='(') ? '' : ', ';
			$inList .= $jogo[$grupo]*1;
		}
		$inList .= ')';


		$cabCompare  = "<tr><th id=\"conc\"><a href=\"Javascript:void(0);\" onclick=\"ts_resortTable(this, 0);return false;\">Conc.<span class=\"sortarrow\"><img src=\"./img/arrow-none.gif\"/></span></a></th>";
		$cabCompare .= "<th colspan=\"15\"><a href=\"Javascript:void(0);\" onclick=\"ts_resortTable(this, 1);return false;\">Resultado<span class=\"sortarrow\"><img src=\"./img/arrow-none.gif\"/></span></a></th></tr>".PHP_EOL;

		$WHERE_CLAUSE = "";

		for ($n=1; $n<6; $n++) {
			$vr='grupo'.$n; 
			$WHERE_CLAUSE .= ($WHERE_CLAUSE=="") ? "" : " OR ";
			$WHERE_CLAUSE .= $vr." IN ".$inList;
		}


		$_11acertos = array();
		$_12acertos = array();
		$_13acertos = array();
		$_14acertos = array();
		$_15acertos = array();

		//$strSQL = "SELECT concurso, grupo1, grupo2, grupo3, grupo4, grupo5 FROM lotofacil USE INDEX(SEQUENCIA) WHERE \r\n".$WHERE_CLAUSE;
		//$strSQL = "SELECT concurso, grupo1, grupo2, grupo3, grupo4, grupo5 FROM lotofacil WHERE \r\n". $WHERE_CLAUSE . " \r\n ORDER BY concurso";
		$strSQL = "SELECT concurso, grupo1, grupo2, grupo3, grupo4, grupo5 FROM lotofacil ORDER BY concurso";

		try {

			foreach ($dbh->query($strSQL) as $rowdata) {

				$dezenas = array();
				$dezenas[1]=intval($rowdata['grupo1']);
				$dezenas[2]=intval($rowdata['grupo2']); 
				$dezenas[3]=intval($rowdata['grupo3']); 
				$dezenas[4]=intval($rowdata['grupo4']); 
				$dezenas[5]=intval($rowdata['grupo5']); 

				$acertos = 0;

				$linha = '';

				$n = 0;

				for($grupo=1;$grupo<6;$grupo++) {

					for($col=0; $col<5; $col++) {

						$n++;

						if ($comb[$dezenas[$grupo]][$col]==1) {

							if($comb[$jogo[$grupo]][$col]==1) {

								$num = "<td class=\"ac lf\">".sprintf("%02s", $n)."</td>";
								$acertos++;

							} else {

								$num = "<td class=\"na lf\">".sprintf("%02s", $n)."</td>";

							}

							$linha .= $num;

						} 

					};
					
				}

				$str = "<tr><td class=\"conc\">" . sprintf("%04s",$rowdata['concurso']) . "</td>" . $linha ."</tr>".PHP_EOL;
			
				     if ($acertos==15) $_15acertos[] = $str;
				else if ($acertos==14) $_14acertos[] = $str;
				else if ($acertos==13) $_13acertos[] = $str;
				else if ($acertos==12) $_12acertos[] = $str;
				else if ($acertos==11) $_11acertos[] = $str;

			}

		}  catch (Exception $e) {

				echo $e->getMessage();

		}



		header('Content-type: text/xml');

		$xmlResponseType = 'compare';
		$styleSheet = '';
		$attributes = array();
		$encoding='UTF-8';
		echo utf8_encode(__xmlHeader('compare', $styleSheet, $encoding));

		if (count($_15acertos)>0) {
			echo utf8_encode("<div id=\"ac15\" class=\"acdiv\" onclick=\"showTab('actab15','im15')\"><img id=\"im15\" class=\"acbtn\" src=\"./img/plus.gif\" /><span>15 acertos em " . count($_15acertos)  ." jogo(s)</span></div>".PHP_EOL);
			echo utf8_encode("<table id=\"actab15\" class=\"actab\" cellSpacing=\"5\" style=\"display:none\">".PHP_EOL);
			echo utf8_encode($cabCompare);
			foreach ($_15acertos as $linha) {
				echo utf8_encode($linha);
			};
			echo utf8_encode("</table>");
		}

		if (count($_14acertos)>0) {
			echo utf8_encode("<div id=\"ac14\" class=\"acdiv\" onclick=\"showTab('actab14','im14')\"><img id=\"im14\" class=\"acbtn\" src=\"./img/plus.gif\" /><span>14 acertos em " . count($_14acertos)  ." jogo(s)</span></div>".PHP_EOL);
			echo utf8_encode("<table id=\"actab14\" class=\"actab\" cellSpacing=\"5\" style=\"display:none\">".PHP_EOL);
			echo utf8_encode($cabCompare);
			foreach ($_14acertos as $linha) {
				echo utf8_encode($linha);
			};
			echo utf8_encode("</table>");
		}

		if (count($_13acertos)>0) {
			echo utf8_encode("<div id=\"ac13\" class=\"acdiv\" onclick=\"showTab('actab13','im13')\"><img id=\"im13\" class=\"acbtn\" src=\"./img/plus.gif\" /><span>13 acertos em " . count($_13acertos)  ." jogo(s)</span></div>".PHP_EOL);
			echo utf8_encode("<table id=\"actab13\" class=\"actab\" cellSpacing=\"5\" style=\"display:none\">".PHP_EOL);
			echo utf8_encode($cabCompare);
			foreach ($_13acertos as $linha) {
				echo utf8_encode($linha);
			};
			echo utf8_encode("</table>");
		}

		if (count($_12acertos)>0) {
			echo utf8_encode("<div id=\"ac12\" class=\"acdiv\" onclick=\"showTab('actab12','im12')\"><img id=\"im12\" class=\"acbtn\" src=\"./img/plus.gif\" /><span>12 acertos em " . count($_12acertos)  ." jogo(s)</span></div>".PHP_EOL);
			echo utf8_encode("<table id=\"actab12\" class=\"actab\" cellSpacing=\"5\" style=\"display:none\">".PHP_EOL);
			echo utf8_encode($cabCompare);
			foreach ($_12acertos as $linha) {
				echo utf8_encode($linha);
			};
			echo utf8_encode("</table>");
		}

		if (count($_11acertos)>0) {
			echo utf8_encode("<div id=\"ac11\" class=\"acdiv\" onclick=\"showTab('actab11','im11')\"><img id=\"im11\" class=\"acbtn\" src=\"./img/plus.gif\" /><span>11 acertos em " . count($_11acertos)  ." jogo(s)</span></div>".PHP_EOL);
			echo utf8_encode("<table id=\"actab11\" class=\"actab\" cellSpacing=\"5\" style=\"display:none\">".PHP_EOL);
			echo utf8_encode($cabCompare);
			foreach ($_11acertos as $linha) {
				echo utf8_encode($linha);
			};
			echo utf8_encode("</table>");
		}

		echo utf8_encode(__xmlFooter('compare'));

	}

	unset($dbh);

	if ($xmlResponseType=='short') {
		$attributes = array();
		$XML  = __xmlHeader('sqlResult', '');
		$level++;
		$XML .= __writeClosedNode('command', $attributes ,$command);
		$XML .= __writeClosedNode('result', $attributes ,$result);
		$XML .= __writeClosedNode('id_local', $attributes ,$id_local);
		$XML .= __writeClosedNode('message', $attributes ,$message);
		$XML .= __outputComment($strSQL); 
		$level--;
		$XML .= __xmlFooter('sqlResult');

		header('Content-type: text/xml');
		//print utf8_encode($XML);
	} 


//exit;


function cell($row) {

	global $tbPlace, $colNr;

	$ln1=trim($row['nome']);
	$ln2=trim($row['endereco'] . " " . $row['bairro']);
	$ln3=trim($row['cidade'] . " " . $row['estado']);
	$ln4=trim($row['cep'] . " " . $row['pais']);
	$col =	  "\t\t<td class=\"local-TD\" onclick=\"goPlace(" . $row['id_local'] . ")\">\r\n"
		. "\t\t\t<div class=\"local-link\" onmouseover=\"this.style.color='#ffffff'\" onmouseout=\"this.style.color='#33cccc'\">" . $ln1 . "</div>\r\n"
		. "\t\t\t<div class=\"local-desc\">" . $ln2 . "</div>\r\n"
	 	. "\t\t\t<div class=\"local-desc\">" . $ln3 . "</div>\r\n"
		. "\t\t\t<div class=\"local-desc\">" . $ln4 . "</div>\r\n"
		. "\t\t</td>\r\n"; 

	if ($colNr == 3) {
		$tbPlace .= "\t</tr>\r\n\t<tr>\r\n";
		$colNr=0;
	}
	$tbPlace .= $col;
	$colNr++;
}

function divCountry($pais) {

	global $tbPlace, $colNr, $atCountry;
	if ($atCountry!='') {
		while ($colNr>0 && $colNr < 3) {
			$tbPlace .= "\t\t<td class=\"local-empty\">\r\n\t\t</td>\r\n";
			$colNr++;
		}
		$tbPlace .= "\t</tr>\r\n";
	}
	$div = "\t<tr>\r\n\t\t<td colspan=\"3\" class=\"local-country\">".$pais."</td>\r\n\t</tr>\r\n";
	$tbPlace .= $div;
}

function divState($nome_estado) {

	global $tbPlace, $colNr, $atState;
	if ($atState!='') {
		while ($colNr>0 && $colNr < 3) {
			$tbPlace .= "\t\t<td class=\"local-empty\">\r\n\t\t</td>\r\n";
			$colNr++;
		}
		$tbPlace .= "\t</tr>\r\n";
	}
	$atState = $nome_estado;
	$div = "\t<tr>\r\n\t\t<td colspan=\"3\" class=\"local-state\">".$nome_estado."</td>\r\n\t</tr>\r\n\t<tr>\r\n";
	$tbPlace .= $div;
	$colNr = 0;
}

function formatnum($n, $dezena) {

	switch ($n) {
		case $dezena[1]:
			$dezena[1] = "<td class=\"ac\">".$dezena[1]."</td>";
      			break;
		case $dezena[2]:
			$dezena[2] = "<td class=\"ac\">".$dezena[2]."</td>";
      			break;
		case $dezena[3]:
			$dezena[3] = "<td class=\"ac\">".$dezena[3]."</td>";
      			break;
		case $dezena[4]:
			$dezena[4] = "<td class=\"ac\">".$dezena[4]."</td>";
      			break;
		case $dezena[5]:
			$dezena[5] = "<td class=\"ac\">".$dezena[5]."</td>";
      			break;
		case $dezena[6]:
			$dezena[6] = "<td class=\"ac\">".$dezena[6]."</td>";
      			break;
	}
	return $dezena;
}

?>
