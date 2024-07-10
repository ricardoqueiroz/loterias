<?php
class check_user_class
{

	protected $dbh = null;

	private $necessary_tables = array ('oauth_clients', 'oauth_client_endpoints', 'oauth_sessions', 'oauth_scopes', 'oauth_session_scopes');

	private $rows;

	private $log = array();

	private $user_info = array();

	private $user_array_key = array();

	private  $user_array_key_deep = -1;

	// ----------------------------------------------------
	// CONTRUCTOR
	// ----------------------------------------------------
	public function __construct() {

		if ($_SERVER["SERVER_NAME"]=='localhost') {
			$DBn = "brmusic1";
			$Hst = "127.0.0.1";
			$Usr = "root";
			$Psw = "r140361q";

		} else {
			$DBn = "brmusic1";
			$Hst = "200.234.202.115";
			$Usr = "brmusic1";
			$Psw = "r140361q";
		};

		try {
			$this->dbh = new PDO("mysql:host=$Hst;dbname=$DBn", $Usr, $Psw);

		} catch (PDOException $e) {

			output_error ( 'Error!: ' . $e->getMessage() . '<br/>');
			die('Falha na conexão com o banco de dados');
		}

		if (!$this->Tables_Ok()) exit;

	}

	// ----------------------------------------------------
	// VERIFICA SE AS TABELAS EXISTEM
	// ----------------------------------------------------
	private function Tables_Ok() {

		$strSQL = "SHOW TABLES LIKE '%oauth%'";

		$this->AccessDB('SELECT', $strSQL);

		if (array_key_exists ( 'erro' , $this->rows )) {

			echo $this->rows['erro'];
			return false;

		} 

		foreach ($this->rows as $k=>$table_name) {
			if (!in_array ( $table_name , $this->necessary_tables )) {
				if (!$this->create_table( $table_name )) {
					$this->output_error ( 'A tabela <B>' . $table_name . '</B> não existe no banco de dados e não foi possível criá-la!' );
					return false;
				}
			}
			
		}

		return true;		

	}

	// ----------------------------------------------------
	// CRIA AS TABELAS NECESSÁRIAS
	// ----------------------------------------------------
	private function create_table ($table) {

		switch($table)
		{
			case 'oauth_clients':

				$strSQL = 
					  "CREATE TABLE oauth_clients ("
					. "  id varchar(40) NOT NULL DEFAULT \'\',"
					. "  secret varchar(40) NOT NULL DEFAULT \'\',"
					. "  name varchar(255) NOT NULL DEFAULT \'\',"
					. "  auto_approve tinyint(1) NOT NULL DEFAULT \'0\',"
					. "  PRIMARY KEY (id)"
					. ") ENGINE=InnoDB DEFAULT CHARSET=utf8;";
					break;

			case 'oauth_client_endpoints':

				$strSQL = 
					  "CREATE TABLE oauth_client_endpoints ("
					. "  id int(11) unsigned NOT NULL AUTO_INCREMENT,"
					. "  client_id varchar(40) NOT NULL DEFAULT \'\',"
					. "  redirect_uri varchar(255) DEFAULT NULL,"
					. "  PRIMARY KEY (id),"
					. "  KEY client_id (client_id),"
					. "  CONSTRAINT oauth_client_endpoints_ibfk_1 FOREIGN KEY (client_id) REFERENCES oauth_clients (id) ON DELETE CASCADE ON UPDATE CASCADE"
					. ") ENGINE=InnoDB DEFAULT CHARSET=utf8;";
					break;

			case 'oauth_sessions':

				$strSQL = 
					  "CREATE TABLE oauth_sessions ("
					. "  id int(11) unsigned NOT NULL AUTO_INCREMENT,"
					. "  client_id varchar(40) NOT NULL DEFAULT \'\',"
					. "  redirect_uri varchar(250) DEFAULT \'\',"
					. "  owner_type enum(\'user\',\'client\') NOT NULL DEFAULT \'user\',"
					. "  owner_id varchar(255) DEFAULT \'\',"
					. "  auth_code varchar(40) DEFAULT \'\',"
					. "  access_token varchar(40) DEFAULT \'\',"
					. "  refresh_token varchar(40) DEFAULT \'\',"
					. "  access_token_expires int(10) DEFAULT NULL,"
					. "  stage enum(\'requested\',\'granted\') NOT NULL DEFAULT \'requested\',"
					. "  first_requested int(10) unsigned NOT NULL,"
					. "  last_updated int(10) unsigned NOT NULL,"
					. "  PRIMARY KEY (id),"
					. "  KEY client_id (client_id)"
					. ") ENGINE=InnoDB DEFAULT CHARSET=utf8;";
					break;

			case 'oauth_scopes':

				$strSQL = 
					  "CREATE TABLE oauth_scopes ("
					. "  id int(11) unsigned NOT NULL AUTO_INCREMENT,"
					. "  scope varchar(255) NOT NULL DEFAULT \'\',"
					. "  name varchar(255) NOT NULL DEFAULT \'\',"
					. "  description varchar(255) DEFAULT \'\',"
					. "  PRIMARY KEY (id),"
					. "  UNIQUE KEY scope (scope)"
					. ") ENGINE=InnoDB DEFAULT CHARSET=utf8; ";
					break;

			case 'oauth_session_scopes':

				$strSQL = 
					  "CREATE TABLE oauth_session_scopes ("
					. "  id int(11) unsigned NOT NULL AUTO_INCREMENT,"
					. "  session_id int(11) unsigned NOT NULL,"
					. "  scope_id int(11) unsigned NOT NULL,"
					. "  PRIMARY KEY (id),"
					. "  KEY session_id (session_id),"
					. "  KEY scope_id (scope_id),"
					. "  CONSTRAINT oauth_session_scopes_ibfk_5 FOREIGN KEY (scope_id) REFERENCES oauth_scopes (id) ON DELETE CASCADE,"
					. "  CONSTRAINT oauth_session_scopes_ibfk_4 FOREIGN KEY (session_id) REFERENCES oauth_sessions (id) ON DELETE CASCADE"
					. ") ENGINE=InnoDB DEFAULT CHARSET=utf8; ";
					break;
			default:
			break;

		}

		$this->AccessDB('INSERT', $strSQL);

		if (array_key_exists ( 'erro' , $this->rows )) {

			$this->output_error( $this->rows['erro'] );
			return false;

		} 

		return true;


	}

	// ----------------------------------------------------
	// EXECUTA SQL NO BANCO DE DADOS E RETORNA RESULTADO
	// ----------------------------------------------------
	private function AccessDB($operation, $strSQL='') {

		$this->rows = array();

		// ----------------------------------------------------
		// SELECIONA E RETORNA REGISTROS DO BANCO DE DADOS
		// ----------------------------------------------------
		if ($operation=='SELECT') {

			try {


		echo '<pre>';
		echo "\$strSQL=>" . $strSQL . PHP_EOL;
		echo '</pre>';

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
	// EXIBE MENSAGENS DE ERRO NA TELA
	// ----------------------------------------------------
	private function output_error($str) {

		echo '<pre>';
		echo $str . PHP_EOL;
		echo '</pre>';
	}

	// ----------------------------------------------------
	// ORGANIZA AS INFORMAÇÕES DO USUÁRIO RECEBIDAS
	// ----------------------------------------------------
	public function store($info) {

		$this->inspect_object($info);
		echo '<pre>';
		print_r($info);
		echo print_r($this->user_info) . PHP_EOL;
		echo '</pre>';

	}


	// ----------------------------------------------------
	// INSPECIONA OBJETO
	// ----------------------------------------------------
	private function inspect_object($obj) {	

		if (is_object($obj)) {

			foreach(get_object_vars($obj) as $field=>$value) {

				if (is_string ($value) || is_numeric ($value) || is_bool($value)) {
					$key = '';
					for ($i=0;$i<=$this->user_array_key_deep;$i++) $key .= is_numeric($this->user_array_key[$i]) ? '' : $this->user_array_key[$i] . '_';
					$key .= $field;
					$this->user_info[$key] = $value;

				} else {

					$this->user_array_key_deep++;
					$this->user_array_key[$this->user_array_key_deep] = $field;
					$this->inspect_object($value);
				}
			}

			$this->user_array_key_deep--;
			$dummy = array_pop($this->user_array_key);


		} else if (is_array($obj)) {

			foreach($obj as $field=>$value) {

				if (is_string ($value) || is_numeric ($value) || is_bool($value)) {
					$key = '';
					for ($i=0;$i<=$this->user_array_key_deep;$i++) $key .= is_numeric($this->user_array_key[$i]) ? '' : $this->user_array_key[$i] . '_';
					$key .= $field;
					$this->user_info[$key] = $value;

				} else {
					$this->user_array_key_deep++;
					$this->user_array_key[$this->user_array_key_deep] = $field;
					$this->inspect_object($value);
				}

			}

			$this->user_array_key_deep--;
			$dummy = array_pop($this->user_array_key);

		}

	}


}
?>