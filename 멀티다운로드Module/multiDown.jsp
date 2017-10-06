<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
<spring:url value="/resources/files_js/httpRequest.js"
	var="httpRequest_js" />
<spring:url value="/resources/files_js/jquery-3.1.1.min.js" var="min_js" />
<script src="${ httpRequest_js }"></script>
<script src="${ min_js }"></script>
</head>
<body>

	<h2>멀티 파일 다운로드</h2>
	
	<a href="javascript:downloadAll()">다운로드 시작</a>
	<script type="text/javascript">
		var orgName = ["배경화면.jpg", "고선생.jpg", "내사진.jpg"];
		var sysName = ["배경화면.jpg","고선생.jpg", "내사진.jpg"];
		var downIndex = 0;
		
		function downloadAll() {
		    location.href = "mdownAction?orgName=" + orgName[downIndex] + "&sysName=" + sysName[downIndex];
			if(downIndex == orgName.length - 1) {
				clearTimeout();
				downIndex = 0;
				return;
			}
			setTimeout("downloadAll()", 1000);
			downIndex = downIndex + 1;
		}
	</script>
	<hr>

</body>
</html>










