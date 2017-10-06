<%@page import="dto.PageDTO"%>
<%@page import="dao.BoardDAO"%>
<%@page import="dto.BoardDTO"%>
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
		PageDTO pageDto = new PageDTO();
	
		if(request.getParameter("nowPage") != null) {
			int nowPage = Integer.parseInt(request.getParameter("nowPage"));
			pageDto.setNowPage(nowPage);
		}
		
		ArrayList<BoardDTO> listc = new BoardDAO().selectList(pageDto);
	%>
	<h2>자유게시판 전체 보기</h2>
	
	<table border="1" style="text-align: center;">
		<tr>
			<td colspan="10">
				<a href="/Curr05_FilePage/j07_insertForm.jsp">
					글쓰기
				</a>
			</td>
		</tr>
		<tr>
			<td>글 번호</td>
			<td>P.K 번호</td>
			<td>제 목</td>
			<td>그룹번호</td>
			<td>답글Seq</td>
			<td>답글Level</td>
			<td>작성자</td>
			<td>내 용</td>
			<td>조회수</td>
			<td>&nbsp;</td>
		</tr>
		<%
			if(listc != null)
				for(BoardDTO each : listc)
				{
		%>
				<tr>
					<td><%= each.getShowNumberSeq() %></td>
					<td><%= each.getNum() %></td>
					<%
						if(each.getReplyLevel() == 0)
						{
					%>
						<td align="left">
							<%= each.getTitle() %>
						</td>
					<%
						} else {
					%>
						<td align="left">
							<%
								for(int i=0; i<each.getReplyLevel(); i++)
								{
							%>
									&nbsp;
							<%
								}
							%>
							ㄴ<%= each.getTitle() %>
						</td>
					<%
						}
					%>
					<td><%= each.getGroupNum() %></td>
					<td><%= each.getReplySeq() %></td>
					<td><%= each.getReplyLevel() %></td>
					<td><%= each.getWriter() %></td>
					<td><%= each.getContents() %></td>
					<td><%= each.getViewCnt() %></td>
					<td>
						<a href="/Curr05_FilePage/j10_replyForm.jsp
									?num=<%= each.getNum() %>">
							답글쓰기
						</a>
					</td>
				</tr>
		<%
				}
		%>
		<tr>
			<td colspan="10">
			<%
				if(pageDto.getShowPageNumberBegin() != 1) 
				{
			%>
				<a onclick="location.href='?nowPage=1'">◀◀</a> &nbsp;
				<a onclick="location.href='?nowPage=<%= pageDto.getNowPage()-1 %>'">◀</a>
			<%
				}
			%>
			
			<%
				for(int i=pageDto.getShowPageNumberBegin(); i<=pageDto.getShowPageNumberEnd(); i++)
				{
					if(pageDto.getNowPage() == i)
					{
			%>
						[<%= i %>]
			<%
					} else {
			%>
						<a href="?nowPage=<%= i %>">[<%= i %>]</a>
			<%
					}
				}
			%>
			
			<%
				if(pageDto.getShowPageNumberEnd() != pageDto.getEndPage())
				{
			%>
				<a onclick="location.href='?nowPage=<%= pageDto.getNowPage()+1 %>'">▶</a>&nbsp;
				<a onclick="location.href='?nowPage=<%= pageDto.getEndPage() %>'">▶▶</a>
			<%
				}
			%>
			</td>
		</tr>
	</table>
  </body>
</html>