package dto;

public class PageDTO {
	
	private int nowPage;				// 보고자 하는 선택된 페이지번호
	
	private int startPage;				// 전체 글에 대한 첫 페이지 숫자(1)
	private int endPage;				// 전체 글에 대한 마지막 페이지 숫자
	private int recordDegree;			// 페이지당 보여줄 글 수
	
	private int countAllRecord;			// 전체 글 갯수
	
	private int startNum;				// 하나의 페이지에서 시작되는 글번호
	private int endNum;					// 하나의 페이지에서 끝나는 글번호
	
	private int showPageNumberDegree;	// 페이지 당 보여줄 선택권 갯수
	private int showPageNumberBegin;	// 페이지 당 노출할 페이지숫자 시작번호
	private int showPageNumberEnd;		// 페이지 당 노출할 페이지숫자 끝번호
	
	public PageDTO() {
		// TODO Auto-generated constructor stub
		this.nowPage = 1;				// 기본적으로 보여줄 페이지 번호 지정
		this.recordDegree = 3;			// 한 페이지당 보여줄 글 갯수 지정
		this.showPageNumberDegree = 5;	// 선택권 갯수 지정
	}// con END
	
//	페이지 당 보여줄 글(recordDegree) 수 설정에 따른 값의 계산
//	- 5개로 설정한 경우
//		현재 1페이지 (nowPage) => 1번글 ~ 5번글
//		현재 2페이지 (nowPage) => 6번글 ~ 10번글
//		현재 3페이지 (nowPage) => 11번글 ~ 15번글
//	- 선택된 페이지의 시작 글번호(startNum)
//		startNum = (pageNum*recordDegree) - (recordDegree-1)
//	- 선택된 페이지의 끝 글번호(endNum)
//		endNum = (pageNum*recordDegree)
//		=> 단, 전체글 갯수가 끝번호보다 작은 경우, 
//			endNum=전체글 갯수
	
//	전체 글에 대한 마지막 페이지(endPage) 계산
//	=> 전체글 / 페이지당 보여줄 글 수(recordDegree)
//		단, 전체글 갯수 % 페이지당 보여줄 글 수의 결과가 0이 아니면
//		(전체글 / 페이지당 보여줄 글 수) + 1
	
	public void sCountRecord(int cntAllRecord) {
		
		this.countAllRecord = cntAllRecord;
		
//		선택된 페이지에서 보여줄 글의 시작과 끝 번호 계산
		startNum = (nowPage*recordDegree)-(recordDegree-1);
		endNum = nowPage*recordDegree;
		if(endNum > countAllRecord) {
			endNum = countAllRecord;
		}
		System.out.println("현재 페이지에서 보여줘야 할 레코드 시작/끝 :" 
								+ startNum + "/" + endNum);
//		전체 레코드에 대한 페이징 숫자 설정
		startPage = 1;
		endPage = countAllRecord / recordDegree;
		if(countAllRecord % recordDegree != 0)
		{
//			endPage++;
			endPage+=1;
		}
		showPageNumberBegin = nowPage - (showPageNumberDegree-1)/2;
		showPageNumberEnd = nowPage + (showPageNumberDegree-1)/2;
		
		if(showPageNumberEnd > endPage)
		{
			showPageNumberEnd = endPage;
			showPageNumberBegin = showPageNumberEnd - showPageNumberDegree + 1;
		}
		
		if(showPageNumberBegin < 1) {
			showPageNumberBegin = 1;
			showPageNumberEnd = showPageNumberDegree;
			
			if(recordDegree*showPageNumberDegree > countAllRecord) {
				showPageNumberEnd = endPage;
			}
		}
	}
	
	

	public int getNowPage() {
		return nowPage;
	}

	public void setNowPage(int nowPage) {
		this.nowPage = nowPage;
	}

	public int getStartPage() {
		return startPage;
	}

	public void setStartPage(int startPage) {
		this.startPage = startPage;
	}

	public int getEndPage() {
		return endPage;
	}

	public void setEndPage(int endPage) {
		this.endPage = endPage;
	}

	public int getRecordDegree() {
		return recordDegree;
	}

	public void setRecordDegree(int recordDegree) {
		this.recordDegree = recordDegree;
	}

	public int getCountAllRecord() {
		return countAllRecord;
	}

	public void setCountAllRecord(int countAllRecord) {
		this.countAllRecord = countAllRecord;
	}

	public int getStartNum() {
		return startNum;
	}

	public void setStartNum(int startNum) {
		this.startNum = startNum;
	}

	public int getEndNum() {
		return endNum;
	}

	public void setEndNum(int endNum) {
		this.endNum = endNum;
	}

	public int getShowPageNumberDegree() {
		return showPageNumberDegree;
	}

	public void setShowPageNumberDegree(int showPageNumberDegree) {
		this.showPageNumberDegree = showPageNumberDegree;
	}

	public int getShowPageNumberBegin() {
		return showPageNumberBegin;
	}

	public void setShowPageNumberBegin(int showPageNumberBegin) {
		this.showPageNumberBegin = showPageNumberBegin;
	}

	public int getShowPageNumberEnd() {
		return showPageNumberEnd;
	}

	public void setShowPageNumberEnd(int showPageNumberEnd) {
		this.showPageNumberEnd = showPageNumberEnd;
	}
	
}// class END
