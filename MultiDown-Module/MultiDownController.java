package spring.mvc.spring13;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import spring.mvc.spring13.module.MultiFileWorks;

@Controller
public class MultiDownController {
	
	@RequestMapping("/multiDown")
	public void multiDown() {}
	
	@Autowired
	private MultiFileWorks multiFileWorks; 
	
	
	@RequestMapping
	public String mdownAction(
			@RequestParam("orgName") String orgName,
			@RequestParam("sysName") String sysName,
			HttpServletResponse response,
			HttpSession session) {
		
		System.out.println("@ mdownAction works : " + orgName + ", " + sysName);
		
		System.out.println("jspWriterOut : " + session.getAttribute("jspWriterOut"));
		
		this.multiFileWorks.downLoad(orgName, sysName, response);
			
		System.out.println("@ mdownAction works");
		
		return "multiDown";
	}
	
}











