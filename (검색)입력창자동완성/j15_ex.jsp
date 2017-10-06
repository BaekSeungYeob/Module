<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8"> <title>Insert title here</title>
	<c:set var="httpRequest_js" 
    		value="/Curr11_Ajax_Jquery/files_js/httpRequest.js"/>
    <script type="text/javascript"
    	src="${ httpRequest_js }">
    </script>
  </head>
  <body>
	
	<div>
		<h2>이름 검색</h2>
		<input type="text" id="search" onkeyup="searchWord()">
		<div id="preView" style="display: ">
			<div id="preViewList"></div>
		</div>
		<div id="aa" style="margin-left: 100px;"></div>
	</div>
  </body>
  	<script type="text/javascript">
  		function searchWord() {
  			
  			var target = document.getElementById("search");
  			var searchParams = target.value.replace(/\s/g, "");
  			
  			var nowKeyLength = searchParams.length;
  			
  			var preView = document.getElementById("preView");
  			
  			preView.style.display = "";
  			
  			if(searchParams == "" || nowKeyLength == 0) {
  				if(nowKeyLength == 0) {
  					preView.style.display = "none";
  				}
  				return;
  			}
  			var params = "key=" + searchParams;
  			sendRequest("/Curr11_Ajax_Jquery/hw"
  						, params, callback, "post");
  		}
  		function callback() {
			if(httpRequest.readyState == 4) {
				if(httpRequest.status == 200) {
					
					var rcvData = httpRequest.responseText;
						var preViewList = 
							document.getElementById("preViewList");
						var aa = document.getElementById("aa");
					if(rcvData.search("table") > 0) {
						aa.innerHTML = rcvData;
					} else {
						preViewList.innerHTML = rcvData;
					}
				} else {
					alert("*** 실패");
				}
			}
		}
  	</script>
</html>