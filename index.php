<?phpsession_start();
print_r($_SESSION);	include './inc/lotr_resources.inc.php';
	include_once './inc/lotr_conectar.inc.php';
	$dbh = conectar('PDO');
	$tipos_jogos = array('megasena','lotofacil');
	if (isset($_REQUEST['j'])) {
		$tipo_jogo = (in_array( $_REQUEST['j'] , $tipos_jogos )) ? $_REQUEST['j'] : 'megasena';
	} else {		$_REQUEST['j'] = 'megasena';
		$tipo_jogo = 'megasena';
	};
	$loteria = new loteria($dbh, $tipo_jogo);
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<title><?php echo strtoupper($_REQUEST['j']); ?></title>
  <meta charset="utf-8">
  <link rel="stylesheet" type="text/css" href="./css/style.css" />
  <!--link rel="stylesheet" type="text/css" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/base/jquery-ui.css" /-->
  <!--script src="http://ajax.googleapis.com/ajax/libs/jquery/1.5/jquery.min.js"></script-->
  <script src="./js/jquery-1.8.2.js"></script>
  <script src="./js/jquery-ui.js"></script>
  <script src="./js/lotr_global.js"></script>
  <script src="./js/lotr_xmlreq.js"></script>
  <script src="./js/lotr_sortable.js"></script>
</head>
<body>
<script> var tipo_de_jogo = '<?php echo $_REQUEST['j'] ?>'; </script>
<div id="div_loading" style="position:absolute; top:0; left:0; Display:none">
	<table border="0" width="100%" height="100%" style="BACKGROUND:transparent">
		<tr><td align="center" valign="middle"><img src="./img/loading.gif" alt=""/><br/><div id='divLoading'>Carregando...</div></td></tr>
	</table>
</div>
<div id="topBar">
	<div class="contentWrapper">
		<div class="logo">
			<a href="http://testesuasorte.com"><img src="./img/logo_tst.gif" /></a>
			<a href="index.php?j=megasena"><img src="./img/btmegasena.jpg" /></a>
			<a href="index.php?j=lotofacil"><img src="./img/btlotofacil.jpg" /></a>
		</div>
		<div>
		<ul id="top">
			<li><a href='#' open='test-1.html'>log In</a></li>
			<li><a href='#' open='test-2.html'>Valores</a></li>
			<li><a href='#' open='test-3.html'>Outro</a></li>
			<li><a href='#' open='test-4.html'>Mais outro</a></li>
		</ul>
		</div>
	</div>
</div>

<div id="principal" align="center">
   <?php $loteria->resultado() ?>
   <div id="leftarea">
	<div id="cartao">
		<?php $loteria->montar_cartao(); ?>
	</div>
	<div id="tbresult">
	</div>
   </div>

   <div id="centerarea">
   </div>
   <div id="rightarea">
   </div>
   <div class="clear"></div>

   <!-- VALORES E QUANTIDADES -->
   <div id="info" style="display:none">
	<div id="infheader"><span id="inftitle">Valor do jogo atual</span><img id="infclose" src="./img/close.gif"></div>
	<?php $loteria->valores_quantidades(); ?>
	<?php $loteria->probabilidades(); ?>
	<?php $loteria->quantidade_premios(); ?>
	<?php //$loteria->proximos_sorteios(10); ?>
   </div>
   <div class="clear"></div>
   <!-- APOSTADORES -->
   <div id="bolao" style="display:none">
	<div id="apsheader"><span id="inftitle">Apostadores neste jogo</span><img id="infclose" src="./img/close.gif"></div>
	<div class="apsinput">
		<table cellpadding="0" cellspacing="0">
		<tr><td class="l">Número Cotas: <select tabIndex="1" name="cotas"><option>01</option><option>01</option><option>01</option><option>01</option><option>01</option><option>01</option><option>01</option><option>01</option><option>01</option><option>01</option></select></td>
		<td class="r"><button id="incparticp">Incluir Apostador</button></td></tr>
		</table>
	</div>
	<div id="tbcotascroll">
		<table id="tbcotas">
		<tr><th>Nº</th><th>Nome</th><th>cotas</th><th>valor (R$)</th></tr>
		<tr id="ap_1"><td class="nr">001</td><td class="nm">Apostador 1</td><td class="ct">10</td><td class="vl">999.000.000,00</td></tr>
		<tr id="ap_1"><td class="nr">002</td><td class="nm">Apostador 2</td><td class="ct">10</td><td class="vl">999.000.000,00</td></tr>
		<tr id="ap_1"><td class="nr">003</td><td class="nm">Apostador 3</td><td class="ct">10</td><td class="vl">999.000.000,00</td></tr>
		<tr id="ap_1"><td class="nr">004</td><td class="nm">Apostador 4</td><td class="ct">10</td><td class="vl">999.000.000,00</td></tr>
		<tr id="ap_1"><td class="nr">005</td><td class="nm">Apostador 5</td><td class="ct">10</td><td class="vl">999.000.000,00</td></tr>
		<tr id="ap_1"><td class="nr">006</td><td class="nm">Apostador 6</td><td class="ct">10</td><td class="vl">999.000.000,00</td></tr>
		<tr id="ap_2"><td class="nr">007</td><td class="nm">Apostador 7</td><td class="ct">10</td><td class="vl">999.000.000,00</td></tr>
		<tr id="ap_1"><td class="nr">008</td><td class="nm">Apostador 8</td><td class="ct">10</td><td class="vl">999.000.000,00</td></tr>
		<tr id="ap_1"><td class="nr">009</td><td class="nm">Apostador 9</td><td class="ct">10</td><td class="vl">999.000.000,00</td></tr>
		<tr id="ap_1"><td class="nr">010</td><td class="nm">Apostador 10</td><td class="ct">10</td><td class="vl">999.000.000,00</td></tr>
		<tr id="ap_1"><td class="nr">011</td><td class="nm">Apostador 11</td><td class="ct">10</td><td class="vl">999.000.000,00</td></tr>
		<tr id="ap_1"><td class="nr">012</td><td class="nm">Apostador 12</td><td class="ct">10</td><td class="vl">999.000.000,00</td></tr>
		<tr id="ap_1"><td class="nr">013</td><td class="nm">Apostador 13</td><td class="ct">10</td><td class="vl">999.000.000,00</td></tr>
		<tr id="ap_1"><td class="nr">014</td><td class="nm">Apostador 14</td><td class="ct">10</td><td class="vl">999.000.000,00</td></tr>
		<tr id="ap_1"><td class="nr">015</td><td class="nm">Apostador 15</td><td class="ct">10</td><td class="vl">999.000.000,00</td></tr>
		<tr id="ap_1"><td class="nr">016</td><td class="nm">Apostador 16</td><td class="ct">10</td><td class="vl">999.000.000,00</td></tr>
		<tr id="ap_1"><td class="nr">017</td><td class="nm">Apostador 17</td><td class="ct">10</td><td class="vl">999.000.000,00</td></tr>
		<tr id="ap_1"><td class="nr">018</td><td class="nm">Apostador 18</td><td class="ct">10</td><td class="vl">999.000.000,00</td></tr>
		<tr id="ap_1"><td class="nr">019</td><td class="nm">Apostador 19</td><td class="ct">10</td><td class="vl">999.000.000,00</td></tr>
		<tr id="ap_1"><td class="nr">020</td><td class="nm">Apostador 20</td><td class="ct">10</td><td class="vl">999.000.000,00</td></tr>
		<tr id="ap_1"><td class="nr">011</td><td class="nm">Apostador 11</td><td class="ct">10</td><td class="vl">999.000.000,00</td></tr>
		<tr id="ap_1"><td class="nr">012</td><td class="nm">Apostador 12</td><td class="ct">10</td><td class="vl">999.000.000,00</td></tr>
		<tr id="ap_1"><td class="nr">013</td><td class="nm">Apostador 13</td><td class="ct">10</td><td class="vl">999.000.000,00</td></tr>
		<tr id="ap_1"><td class="nr">014</td><td class="nm">Apostador 14</td><td class="ct">10</td><td class="vl">999.000.000,00</td></tr>
		<tr id="ap_1"><td class="nr">015</td><td class="nm">Apostador 15</td><td class="ct">10</td><td class="vl">999.000.000,00</td></tr>
		<tr id="ap_1"><td class="nr">016</td><td class="nm">Apostador 16</td><td class="ct">10</td><td class="vl">999.000.000,00</td></tr>
		<tr id="ap_1"><td class="nr">017</td><td class="nm">Apostador 17</td><td class="ct">10</td><td class="vl">999.000.000,00</td></tr>
		<tr id="ap_1"><td class="nr">018</td><td class="nm">Apostador 18</td><td class="ct">10</td><td class="vl">999.000.000,00</td></tr>
		<tr id="ap_1"><td class="nr">019</td><td class="nm">Apostador 19</td><td class="ct">10</td><td class="vl">999.000.000,00</td></tr>
		<tr id="ap_1"><td class="nr">011</td><td class="nm">Apostador 11</td><td class="ct">10</td><td class="vl">999.000.000,00</td></tr>
		<tr id="ap_1"><td class="nr">012</td><td class="nm">Apostador 12</td><td class="ct">10</td><td class="vl">999.000.000,00</td></tr>
		<tr id="ap_1"><td class="nr">013</td><td class="nm">Apostador 13</td><td class="ct">10</td><td class="vl">999.000.000,00</td></tr>
		<tr id="ap_1"><td class="nr">014</td><td class="nm">Apostador 14</td><td class="ct">10</td><td class="vl">999.000.000,00</td></tr>
		<tr id="ap_1"><td class="nr">015</td><td class="nm">Apostador 15</td><td class="ct">10</td><td class="vl">999.000.000,00</td></tr>
		<tr id="ap_1"><td class="nr">016</td><td class="nm">Apostador 16</td><td class="ct">10</td><td class="vl">999.000.000,00</td></tr>
		<tr id="ap_1"><td class="nr">017</td><td class="nm">Apostador 17</td><td class="ct">10</td><td class="vl">999.000.000,00</td></tr>
		<tr id="ap_1"><td class="nr">018</td><td class="nm">Apostador 18</td><td class="ct">10</td><td class="vl">999.000.000,00</td></tr>
		<tr id="ap_1"><td class="nr">019</td><td class="nm">Apostador 19</td><td class="ct">10</td><td class="vl">999.000.000,00</td></tr>
		</table>
	</div>
   </div>

   <div class="clear"></div>
   <!-- INFORMAÇÃO: SALVAR JOGO -->
   <!--
   <div id="msg" style="display:inline">
	<div id="msgheader"><span id="msgtitle">Salvar sua aposta</span><img id="msgclose" src="./img/close_msg.gif"></div>
	<div class="area">
		<span id='txt'>Para salvar o jogo você deve se conectar. Você poderá optar em receber por e-mail o resultado do seu jogo. Poderá também fazer bolões e incluir seus amigos dividindo seu bolão em cotas. Todos os participantes poderão também receber um e-mail com o os números apostados e resultado da aposta após o sorteio.</span>
	</div>
   </div>
   -->
</div>
<div class="clear"></div>
    <div id="footer">
        <div class="ftarea">
            <div class="footerLinksSpaced">
                <p>
                    <a href="/about">about</a> <a href="http://blog.stackexchange.com">blog</a> <a href="/legal">legal</a> <a href="/legal/privacy-policy">privacy policy</a> <a href="/about/contact">contact us</a> <a href="http://meta.stackoverflow.com">feedback always welcome</a>
                    <a href="https://plus.google.com/101120115153580954446" class="google-plus-icon" title="follow us on Google+"></a>
                    <a href="http://www.facebook.com/stackexchange" class="facebook-icon" title="like us on Facebook"></a>
                    <a href="http://twitter.com/stackexchange" class="twitter-icon" title="follow us on Twitter"></a>
                </p>
            </div>
            <p>site design / logo &copy; 2012 stack exchange, inc; user contributions licensed under <a href="http://creativecommons.org/licenses/by-sa/3.0/" rel="license">cc-wiki</a> with <a href="http://blog.stackoverflow.com/2009/06/attribution-required/" rel="license">attribution required</a></p>
            <div class="footer-meta-info">
                2012.10.17.452
            </div>

        </div>
    </div>
</body>
</html>