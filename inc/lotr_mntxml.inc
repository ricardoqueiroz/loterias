<?php
/*****************************************************
 * XML FUNCTIONS 
 *****************************************************/
$crlf      = "\r\n";
$tab       = "\t";
define('OPENED', TRUE);
define('CLOSED', FALSE);
/*****************************************************
 * XML header
 *
 * @param   string      Header label
 * @param   string      Stylesheet name
 * @param   string      encoding (defult:NULL => ommit encoding type)
 * @return  string      XML and header labels
 * 
 */
function __xmlHeader($label, $styleSheet='', $encoding=NULL) {

	global $crlf;
	$encoding = ($encoding==NULL) ? '' : 'encoding="'.$encoding.'" ';
	$header   = '<?xml version="1.0" '.$encoding.'?>' . $crlf;
	$header  .= ($styleSheet=='') ? '' : '<?xml-stylesheet type="text/xsl" href="'.$styleSheet.'"?>' . $crlf;
	$header  .= '<'. $label . '>' . $crlf ;
	return $header; 

}
/*****************************************************
 * XML footer
 *
 * @param   string      Foot label
 * @return  string      Node closed
 *
 */
function __xmlFooter($label) {
	return '</'. $label . '>';
}
/*****************************************************
 * Open node
 *
 * @param   bolean      Let node opened?
 * @param   string      Node label
 * @param   array       Node attributes
 * @return  string      Opened node 
 *
 */
function __openNode($opened, $label, $attributes = array()) {

	global $level, $crlf, $tab;
	$node =  ($level > 0) ? str_repeat($tab,$level) : '';
	$node .= '<' . $label;
	foreach ($attributes as $attr_name => $attr_value) {
		if (!is_null($attr_value)) {
			$node .= ' ' . $attr_name . '="' . $attr_value . '"';
		}
	}
	$node .= ($opened) ? '>' :  '/>' ;
	$node .= $crlf;
	return $node;
}
/****************************************************
 * Write node
 *
 * @param   string      Node label
 * @param   array       Node attributes
 * @param   string      Node value
 * @return  string      Node closed
 */
function __writeClosedNode($label, $attributes = array(), $nodeValue = '') {
	global $crlf, $level, $tab;
	$node = ($level > 0) ? str_repeat($tab,$level) : '';
	$node .= '<' . $label;
	foreach ($attributes as $attr_name => $attr_value) {
		if (!is_null($attr_value)) {
			$node .= ' ' . $attr_name . '="' . $attr_value . '"';
		}
	}
	$node .= ($nodeValue=='') ? '/>' : '>' . $nodeValue . '</' . $label . '>';
	$node .= $crlf;
	return $node;
}
/****************************************************
 * Close node
 *
 * @param   string      Node label to be closed
 * @return  string      Close node
 *
 */
function __closeNode($label) {
	global $crlf, $level, $tab;
	$node = ($level > 0) ? str_repeat($tab,$level) : '';
	$node .= '</' . $label . '>' . $crlf;
	return $node;
}
/*****************************************************
 * Outputs comment
 *
 * @param   string      Text of comment
 * @return  string      Comment node
 *
 */
function __outputComment($text) {
	global $crlf, $level, $tab;
	$tabs = ($level > 0) ? str_repeat($tab,$level) : '';
	return  $tabs . '<!-- ' . $text . ' -->' . $crlf;
}
?>