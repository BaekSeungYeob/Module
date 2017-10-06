<%@page import="dao.BoardDAO"%>
<%@page import="dto.BoardDTO"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8"> <title>Insert title here</title>
  </head>
  <body>
	<%
		request.setCharacterEncoding("UTF-8");
		String title = request.getParameter("title");
		String writer = request.getParameter("writer");
		String contents = request.getParameter("contents");
		
		BoardDTO dto = new BoardDTO(title, writer, contents);
		
		int res = new BoardDAO().insertOne(dto);
		String msg = res > 0 ? "저장 완료" : "저장 실패";
	%>
	<script type="text/javascript">
		alert("<%= msg %>");
		location.href="/Curr05_FilePage/j09_selectList.jsp";
	</script>
  </body>
</html>