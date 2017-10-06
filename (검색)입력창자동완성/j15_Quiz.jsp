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
	<%--
		페이지 구성 : j15_Quiz.jsp - controller - dao
		
		문제 : 학생 정보 검색 및 상세보기
		
		상단의 검색 창에 학생의 이름을 입력하면
		하단에 입력한 글자가 포함된 학생들의 이름 목록이 뜨고,
		그 중 하나를 클릭하면
		해당 학생 정보의 상세 정보가 출력되도록 작성
		(단, 페이지 이동은 없다.)
		
	--%>
	
	<div style="margin-left: 100px; margin-top: 200px;">
	<span style="display: inline-block;
 					width: 300px;
 					height: 30px;
 					margin-left: 200px;
					border: 3px solid #2db400;">
	<input type="text" id="search" onkeyup="searchWord()" 
				style="width: 250px; 
 						height: 18px;
 						margin: 6px 0 3px 6px;
						border: 0;
						font-family: 배달의민족 주아;
						font-size: 16px;
						color: black;
					outline: none;"
				>
		<div id="preView" style="display: ">
			<div id="preViewList"></div>
		</div>
	</span>
	</div>
  </body>
	<script type="text/javascript">
		function searchWord() {
			var target = document.getElementById("search");
			var searchParams = target.value.trim();
			var searchLength = searchParams.length;
			var preView = document.getElementById("preView");
			
			preView.style.display = "";
			
			if(searchParams == "" || searchLength == 0) {
				if(searchLength == 0) {
					preView.style.display = "none";
				}
				return;
			}
// 			var kkk = "key=" + searchParams
			sendRequest("/Curr11_Ajax_Jquery/hw?kk="+searchParams
							, null, callback, "post");
		}
		
		function callback() {
			if(httpRequest.readyState == 4) {
				if(httpRequest.status == 200) {
					
					var rcvData = httpRequest.responseText;
					var perViewList = 
						document.getElementById("preViewList");
					preViewList.innerHTML = rcvData;
					
				} else {
					alert("*** 실패" + httpRequest.status);
				}
			}
		}
	
	
	
	
	
	
	</script>
</html>