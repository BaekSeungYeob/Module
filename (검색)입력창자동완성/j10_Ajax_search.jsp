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
  <body align="center">
	<%--
		검색 단어에 대한 실시간 키워드 지원
		- onkeyup : 키를 눌렀다가 뗄 때 해당 함수를 실행함. (Listener)
	--%>
	
	<h2>단어 검색</h2>
	
	<div>
		<input type="text" id="search" onkeyup="searchWord()">
		<div id="preView" style="display: ">
			<div id="preViewList"></div>
		</div>
	</div>
	
  </body>
  	<script type="text/javascript">
  		function searchWord() {
  			
//   		[<input type="text" id="search" onkeyup="searchWord()">]
  			var target = document.getElementById("search");
  			
//   		[searchParams : input="text"에 입력한값]
  			var searchParams = target.value.trim();	// trim() : 빈공간 없애기

//   		[nowKeyLength : input="text"에 입력한값의 길이]
  			var nowKeyLength = searchParams.length;
  			var preView = document.getElementById("preView");
  			
//   		[디스플레이를 안보이게끔 하려는 명령을 위한 세팅 (리셋)]
  			preView.style.display = "";
  			
//  		[input="text"에 글씨가 아무것도 없거나 길이가 0일때]
  			if(searchParams == "" || nowKeyLength == 0) {
  				if(nowKeyLength == 0) {
  					preView.style.display = "none";
  				}
  				return;
  			}
  			
//   		[키워드로 파라미터를 날린다]
  			var params = "key=" + searchParams;
  			sendRequest("/Curr11_Ajax_Jquery/j10_DB_Data.jsp"
  						, params, callback, "post");
  		}
  		
  		function callback() {
			if(httpRequest.readyState == 4) {
				if(httpRequest.status == 200) {
					
					var rcvData = httpRequest.responseText;
					var perViewList = 
						document.getElementById("preViewList");
					preViewList.innerHTML = rcvData;
					
				} else {
					alert("*** 실패");
				}
			}
		}
  	</script>
</html>