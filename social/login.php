<?php
/*
 * test_oauth_client.php
 *
 * @(#) $Id: test_oauth_client.php,v 1.4 2012/10/05 09:22:40 mlemos Exp $
 *
 */

	if (!isset($_REQUEST['snw'])) header('Location: http://www.testesuasorte.com/');

	$network = array();

	/* https://developers.facebook.com/apps */
	$network['Facebook'] = array(
		'client_id'=>'242778645866830',
		'client_secret'=>'178f22f7e370c31f43344057881a2e2d',
		'callUrl'=>'https://graph.facebook.com/me',
		'parameters'=>array('access_token'=>''),
		'options'=>array(),
		'scope'=>'user_photos, email, user_birthday, user_online_presence'
		);

	/* https://code.google.com/apis/console/ */
	$network['Google']   = array(
		'client_id'=>'733502788538.apps.googleusercontent.com',
		'client_secret'=>'NA3OOzfamm_zG2fkJe9Lex1e',
		'callUrl'=>'https://www.googleapis.com/oauth2/v1/userinfo.profile',
		'parameters'=>array(),
		'options'=>array('FailOnAccessError'=>true),
		'scope'=>'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
		); 

	$netName = '';
	foreach ($network as $n=>$v) {
		if( strtolower($n) == strtolower($_REQUEST['snw']) ) {
			$netName = $n;
			break;
		}
	}
	if ($netName=='') header('Location: http://www.testesuasorte.com/');

	$appClientId     = $network[$netName]['client_id'];
	$appClientsecret = $network[$netName]['client_secret'];
	$callUrl         = $network[$netName]['callUrl'];
	$parameters      = $network[$netName]['parameters'];
	$options         = $network[$netName]['options'];
	$scope           = $network[$netName]['scope'];
	$method          = "GET";
	$response        = '';

	require('http.php');
	require('oauth_client.php');
	require('check_user.php');

	/* Create the check user data class */ 
	$user_data = new check_user_class;

	/* Create the OAuth authentication client class */ 
	$client = new oauth_client_class;

	/*
	 * Set to true if you want to make the class dump
	 * debug information to PHP error log
	 */
	$client->debug = true;

	/*
	 * Set to true if you want to make the class also dump
	 * debug output of the HTTP requests it sends.
	 */
	$client->debug_http = true;

	/* OAuth server type name
	 * Setting this variable to one of the built-in supported OAuth servers
	 * will make the class automatically set all parameters specific of that
	 * type of server.
	 * 
	 */
	$client->server = $netName;

	/* OAuth authentication URL identifier
	 * This should be the current page URL without any request parameters
	 * used by OAuth, like state and code, error, denied, etc..
	 */
	//$client->redirect_uri = 'http://'.$_SERVER['HTTP_HOST'] . dirname(strtok($_SERVER['REQUEST_URI'],'?')) . '/login.php';
	$client->redirect_uri = 'http://'.$_SERVER['HTTP_HOST'] . '/perfil.php';

	/* OAuth client identifier
	 * Set this to values defined by the OAuth server for your application
	 */
	$client->client_id = $appClientId;


	/* OAuth client secret
	 * Set this to values defined by the OAuth server for your application
	 */
	$client->client_secret = $appClientsecret;

	/* OAuth client permissions
	 * Set this to the name of the permissions you need to access the
	 * application API
	 */
	$client->scope = $scope;
	
	/* Process the OAuth server interactions */
	if(($success = $client->Initialize()))
	{
		/*
		 * Call the Process function to make the class dialog with the OAuth
		 * server. If you previously have retrieved the access token and set
		 * the respective class variables manually, you may skip this call and
		 * use the CallAPI function directly.
		 */
		$success = $client->Process();

		// Make sure the access token was successfully obtained before making
		// API calls
		
		   if(strlen($client->access_token))
		   {
			if ($callUrl!='') {
				$parameters = array('access_token'=>$client->access_token);
				$success    = $client->CallAPI($callUrl, $method, $parameters, $options, $response);
				if ($success) $user_data->store($response);
			}

		   }
		 
		
		/* Internal cleanup call
		 */
		$success = $client->Finalize($success);
	}
	/*
	 * If the exit variable is true, the script must not output anything
	 * else and exit immediately
	 */
	if($client->exit)
		exit;
	
	if($success)
	{
		/*
		 * The Output function call is here just for debugging purposes
		 * It is not necessary to call it in real applications
		 */

		$client->Output();

		echo '<pre>';
		echo $client->debug_output;
		echo '</pre>';

	}
	else
	{
		/* 
		 * If there was an unexpected error, display to the user
		 * some useful information
		 */
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<title>OAuth client error</title>
</head>
<body>
<h1>OAuth client error</h1>
<pre>Error: <?php echo HtmlSpecialChars($client->error); ?></pre>
</body>
</html>
<?php
	}

?>