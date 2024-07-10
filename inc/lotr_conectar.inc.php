<?php
$host = "www.testesuasorte.com.br";
$nome_suporte = "Ricardo Queiroz";
$email_suporte = "ricardo.queiroz@brmusic.com.br";
$companhia = "Brazilian Music Network";
$contato = "Ricardo Queiroz, Rio de Janeiro, Brazil\nPhone: +55(21) 9551-2964";
$default_language = 'pt-br';
$db_prefix = "site";
$dbh = null;
/****************************************
 * CONECTA AO BANCO DE DADOS
 ****************************************/
function conectar($drive='') {

	global $dbh;
	
	if ($_SERVER["SERVER_NAME"]=='localhost') {
		$Hst = "127.0.0.1";
		$Usr = "root";
		$Psw = "iL299WOR@**";

	} else {
		$Hst = "200.234.202.115";
		$Usr = "brmusic1";
		$Psw = "r140361q";

	};

	$DBn = "brmusic1";

	// Conecta com PDO
	// ---------------------------------
	if ($drive='PDO') {

		try {
			$dbh = new PDO("mysql:host=$Hst;dbname=$DBn", $Usr, $Psw);
			return $dbh;

		} catch (PDOException $e) {
			print "Error!: " . $e->getMessage() . "<br/>";
			die('Falha na conexão com o banco de dados');
		}

	} else {

	// Conecta com MySQL
	// ---------------------------------
		$Cnx = mysql_connect($Hst, $Usr, $Psw) or die("Falha na Conexão ao Banco de dados");
		mysql_select_db($DBn, $Cnx) or die("Falha na Seleção do Banco de dados");

	}
}
?>