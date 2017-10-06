package controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Set;
import java.util.TreeMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import dao.QuizstuDAO;

@WebServlet("/hw")
public class QuizstuController extends HttpServlet {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Override
	protected void doGet(HttpServletRequest request, 
							HttpServletResponse response) 
									throws ServletException, IOException {
		this.hwWorks(request, response);
	}
	
	@Override
	protected void doPost(HttpServletRequest request, 
							HttpServletResponse response) 
									throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		this.hwWorks(request, response);
	}
	
	private void hwWorks(HttpServletRequest request, 
							HttpServletResponse response) 
									throws ServletException, IOException {
		response.setCharacterEncoding("UTF-8");
		QuizstuDAO dao = null;
		PrintWriter out = response.getWriter();
		if(request.getParameter("key") != null) {
			dao = new QuizstuDAO();
			String searchParams = request.getParameter("key");
			System.out.println(searchParams);
			ArrayList<String> listc = dao.searchStu(searchParams);
			if(!listc.isEmpty()) {
				for(String each : listc) {
		out.print("<a href='./hw?lalala="+each+"'>"+ each + "</a><br>");
				}
			}
			
		} else if(request.getParameter("lalala") != null) {
			response.setCharacterEncoding("UTF-8");
			dao = new QuizstuDAO();
			String ppp = request.getParameter("lalala");
			System.out.println("lalala");
			TreeMap<String, Object> mapc = dao.showInfo(ppp);
			
			
			if(!mapc.isEmpty()) {
				Set<String> ss = mapc.keySet();
				int num = 0;
				String name = "";
				int kor = 0;
				int eng = 0;
				int math = 0;
				int total = 0;
				double avg = 0.0;
				for(String each : ss) {
					if(each.equalsIgnoreCase("num")) {
						num = (int) mapc.get(each);
					} else if(each.equalsIgnoreCase("name")) {
						name = (String) mapc.get(each);
					} else if(each.equalsIgnoreCase("kor")) {
						kor = (int) mapc.get(each);
					} else if(each.equalsIgnoreCase("eng")) {
						eng = (int) mapc.get(each);
					} else if(each.equalsIgnoreCase("math")) {
						math = (int) mapc.get(each);
					} else if(each.equalsIgnoreCase("total")) {
						total = (int) mapc.get(each);
					} else if(each.equalsIgnoreCase("avg")) {
						avg = (double) mapc.get(each);
					} else {
						break;
					}
				}
			out.print("<table border='1' align='center;' "
					+ "style='text-align=\"center;\"'>"
					+ "<tr><td>번 호</td><td>"+num+"</td></tr>"
					+ "<tr><td>이 름</td><td>"+name+"</td></tr>"
					+ "<tr><td>국어점수</td><td>"+kor+"</td></tr>"
					+ "<tr><td>영어점수</td><td>"+eng+"</td></tr>"
					+ "<tr><td>수학점수</td><td>"+math+"</td></tr>"
					+ "<tr><td>총 점</td><td>"+(kor+eng+math)+"</td></tr>"
		+ "<tr><td>평 균</td><td>"+(kor+eng+math)/3.0+"</td></tr></table>");
			}
			
		}
		
	}
	
}
