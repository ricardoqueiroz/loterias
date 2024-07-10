	// global flag
	var isIE = false;

	// global request and XML document objects
	var req;

	// retrieve XML document (reusable generic function);
	// parameter is URL string (relative or complete) to
	// an .xml file whose Content-Type is a valid XML
	// type, such as text/xml; XML source must be from
	// same domain as HTML file
	function loadXMLDoc(dest) {

		document.body.style.cursor = 'wait';
		if (div_loading) div_loading.style.visibility='visible';

		var p      = dest.indexOf("?");
		var url    = dest.slice(0,p);
		var params = dest.slice(p+1);

		// branch for native XMLHttpRequest object
		if (window.XMLHttpRequest) {
			req = new XMLHttpRequest();
			req.onreadystatechange = processReqChange;
			req.open("POST", url, true);
			req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			req.setRequestHeader("Content-length", params.length);
			req.setRequestHeader("Connection", "close");
			req.send(params);

		// branch for IE/Windows ActiveX version
		} else if (window.ActiveXObject) {
			isIE = true;
			req = new ActiveXObject("Microsoft.XMLHTTP");
			if (req) {
				req.onreadystatechange = processReqChange;
				req.open("POST", url, true);
				req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				req.setRequestHeader("Content-length", params.length);
				req.setRequestHeader("Connection", "close");
				req.send(params);
			}
		}
	}

	// handle onreadystatechange event of req object
	function processReqChange() {
		// only if req shows "loaded"
		if (req.readyState == 4) {
			// only if "OK"
			if (req.status == 200) {
				loadXMLData();
			} else {
				alert("There was a problem retrieving the XML data:\n"+req.statusText);
			}

			document.body.style.cursor = 'default';
			if (div_loading) div_loading.style.visibility = 'hidden';
		}
	}

	// retrieve text of an XML document element, including elements using namespaces
	function getNodeValue(prefix, local, parentElem, index) {

		var result = "";
		if (prefix && isIE) {
			// IE/Windows way of handling namespaces
			result = parentElem.getElementsByTagName(prefix + ":" + local)[index];
		} else {
			// Safari and Mozilla
			result = parentElem.getElementsByTagName(local)[index];
		}
		if (result) {
			// get text, accounting for possible whitespace (carriage return) text nodes 
			if (result.childNodes.length > 1) {
				return result.childNodes[1].nodeValue;
			} else if (result.firstChild) {
				return result.firstChild.nodeValue;
				
			} else  return "";
		} else {
			return "n/a";
		}
	}