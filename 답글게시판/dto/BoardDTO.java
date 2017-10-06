package dto;

import java.util.Date;

public class BoardDTO {
	
	private int showNumberSeq;
	
	private int num;
	private int groupNum;
	private int replySeq;
	private int replyLevel;
	private int viewCnt;
	
	private String title;
	private String writer;
	private String contents;
	private Date saveDate;
	
	public BoardDTO() {
		// TODO Auto-generated constructor stub
	}

	public BoardDTO(String title, String writer, String contents) {
		super();
		this.title = title;
		this.writer = writer;
		this.contents = contents.replaceAll("\n", "<br>");
	}
	
	public BoardDTO(int num, String title, String writer, String contents) {
		super();
		this.num = num;
		this.title = title;
		this.writer = writer;
		this.contents = contents.replaceAll("\n", "<br>");
	}
	
	public int getShowNumberSeq() {
		return showNumberSeq;
	}
	public void setShowNumberSeq(int showNumberSeq) {
		this.showNumberSeq = showNumberSeq;
	}
	public int getNum() {
		return num;
	}
	public void setNum(int num) {
		this.num = num;
	}
	public int getGroupNum() {
		return groupNum;
	}
	public void setGroupNum(int groupNum) {
		this.groupNum = groupNum;
	}
	public int getReplySeq() {
		return replySeq;
	}
	public void setReplySeq(int replySeq) {
		this.replySeq = replySeq;
	}

	public int getReplyLevel() {
		return replyLevel;
	}
	public void setReplyLevel(int replyLevel) {
		this.replyLevel = replyLevel;
	}
	public int getViewCnt() {
		return viewCnt;
	}
	public void setViewCnt(int viewCnt) {
		this.viewCnt = viewCnt;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getWriter() {
		return writer;
	}
	public void setWriter(String writer) {
		this.writer = writer;
	}
	public String getContents() {
		return contents;
	}
	public void setContents(String contents) {
		this.contents = contents;
	}
	public Date getSaveDate() {
		return saveDate;
	}
	public void setSaveDate(Date saveDate) {
		this.saveDate = saveDate;
	}
	
}// DTO END
