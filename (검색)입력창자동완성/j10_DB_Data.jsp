<%@page import="java.util.ArrayList"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8"> <title>Insert title here</title>

  </head>
  <body>
	<%
		ArrayList<String> listc = new ArrayList();
		listc.add("스프링 @Component");
		listc.add("스프링 @Service");
		listc.add("스프링 @Repository");
		listc.add("스프링 마이바티스DB");
		listc.add("스프링 DB DAO");
		listc.add("스프링 JDBC");
		listc.add("스프링 AOP");
		listc.add("스프링 자바 JSP");
		listc.add("JSP Service");
		listc.add("JSP DB DAO");
		listc.add("JSP 레스트풀 MVC");
		listc.add("자바 프로그램");
		listc.add("스프링 @MVC");
		listc.add("자바 미니프로젝트");
		listc.add("스프링 메인프로젝트");
		listc.add("자바");
		listc.add("스프링");
		
		request.setCharacterEncoding("UTF-8");
		
		String keyWord = request.getParameter("key");
		
		for(String each : listc) {
			if(each.contains(keyWord)) {
				
// 				out.print(each + "<br>");

				out.print("<a href='https://"
							+ "search.naver.com/search.naver?"
							+ "where=nexearch&query="
							+ each
							+ "&sm=top_hty&fbm=1&ie=utf8'>" 
							+ each 
							+ "</a><br>");
			}
		}
	%>
  </body>
</html>