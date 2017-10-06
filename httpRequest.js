/**
 * 
 */
	
	function jstest() {
		alert("js test OK");
	}
//		httprequest(XMLHttpRequest) 객체의 대표 함수
//		- onreadystatechange :
//			이벤트를 처리하는 핸들러 역할(callback 함수에서 구현)
//		- open : 요청 정보 설정 메소드 - method와 url은 필수 요소
//		- send : 요청을 지정한 url로 전송하는 명령

//	=============================================================================
	
	var httpRequest = null;
	
	function getXMLHttpRequest() {
		if(window.ActiveXObject) {
			try {
				return new ActiveXObject("Msxml12.XMLHTTP");
			} catch(e) {
				try {
					return new ActiveXObject("Microsoft.XMLHTTP");
				} catch(e1) {
					return null;
				}
			}
		} else if(window.XMLHttpRequest) {
			return new XMLHttpRequest();
		} else {
			return null;
		}
	}
	
//	var target = null;
	
	function sendRequest(url, params, callback, method) {
//		1. httpRequest 객체 획득
		httpRequest = getXMLHttpRequest();
		
		if(method != null) {
			method = method.toUpperCase();	// 대문자로 바꾸기
		}
		
//		[method가 null이아니면 받는 방식을 사용하고 아니면 무조건 GET방식으로 세팅]
		var httpMethod = method != null ? method : "GET";
		
//		[오타 혹은 null값들어올때 get방식으로 설정하겠다.]
    	if(httpMethod != "GET" && httpMethod != "POST") {
    		httpMethod = "GET";
    	}
    	
//    	[파라미터세팅]
    	var httpParams = (params == null || params == "") ? null : params;
    	
//    	[URL 세팅]
    	var httpUrl = url;
    	if(httpMethod == "GET" && httpParams != null) {
    		httpUrl = httpUrl + "?" + httpParams;
    	}
    	
//    	2. httpRequest 이벤트 리스너 설정
//			- 다시 돌아온 httpRequest를 받아 처리할
//				핸들러(callback)함수를 지정해야 함.
//			- 데이터 수신 시 사용
    	httpRequest.onreadystatechange = callback;
    	
//    	3. 요청 작업 내용 설정 : method, url, 파라미터정보 등
    	httpRequest.open(httpMethod, httpUrl, true);
//    	- 비동기(true) / 동기(false) 방식 설정
//			- 비동기 방식인 경우, (날려놓고 나몰라라 진행~ !!)
//				send() 실행 후 기다리지 않고 다음 명령을 계속 실행
//			- 동기 방식인 경우,
//				서버와의 통신이 완전히 완료된 후 이후 명령 실행
    	httpRequest.setRequestHeader(
    			"Content-Type", "application/x-www-form-urlencoded"
    	);
    	
    	httpRequest.send(httpMethod == "POST" ? httpParams : null)
    }

//	=============================================================================
	
//	function callback() {
		// 받을려고 대기하는 함수
//			if(httpRequest.readyState == 4) {
//					- readyState : XMLHttpRequest의 객체 상태 확인
//					- 4 : 서버로부터의 응답 성공(전체 데이터 수신 성공)
				
//				if(httpRequest.status == 200) {
//						- status : 서버로부터 응답받은 http 상태 코드
//						- 200 : 요청에 대한 서버의 처리한 작업이 성공적임
//								(모든 작업이 순조로웠음을 의미)
//						- 403 : 서버에 대한 접근 거부 (서버에서 안받겠다고 함)
//						- 404 : URL에 지정된 대상 없음
//						- 500 : 서버 작업 중 오류 발생

//						[방법 1.]
//					var rcvData = httpRequest.responseText;
//					alert("도착한 데이터 : " + rcvData);
//						- 서버로부터 응답된 데이터
//						- responseText : 단순 텍스트
//						- responseXML : XML 형식

//						##참고##
//						** 공백 제거 함수 : replace(/\s/g, "");
//					var editData = rcvData.replace(/\s/g, "");
//					alert(editData)
//					
//					
//				} else {
//					alert("실패 : " + httpRequest.status)
//				}
//			}	
//		}
	