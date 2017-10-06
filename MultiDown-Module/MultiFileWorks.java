package spring.mvc.spring13.module;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.URLEncoder;
import java.nio.channels.Channels;
import java.nio.channels.ReadableByteChannel;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FileUtils;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.view.AbstractView;

@Component
public class MultiFileWorks {

	private String filesPath = 
		"J:\\YJ_Works_BD\\Spring_Works\\Spring13_SMVC_JDBC_FileUpDown\\src\\main\\webapp\\resources\\files";
	
	public void downLoad(
		String orgName, String sysName, HttpServletResponse response) {
		
		try {
			System.out.println("AAAAAAAA");
			
			System.out.println("downLoad : " + sysName + " start");
			
			byte[] fileByte = FileUtils.readFileToByteArray(
								new File(filesPath + "\\" + sysName));
			
			String encOrgName = URLEncoder.encode(orgName, "UTF-8");

			response.setContentType("application/octet-stream");
			response.setHeader("Cache-control","private");
			response.setHeader("Pragma", "no-cache;");
			response.setHeader("Expires", "-1;");
		    response.setContentLength(fileByte.length);
		    response.setHeader("Content-Disposition", 
		    					"attachment; fileName=" + encOrgName); 
		    response.setHeader("Content-Transfer-Encoding", "binary");
		    
		    OutputStream output = response.getOutputStream();
		    File file = new File(filesPath + "\\" + sysName);
		    FileUtils.copyFile(file, output);
	        output.close();
		    
			System.out.println("BBBBBBBBBB");
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}








