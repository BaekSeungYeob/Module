<?php if( ! defined('BASEPATH')) exit('No direct script access allowed');

//////////////////////////////////////////////////////////////////////////////////////////////////
function spacing($text,$size) {
	for ($i=0; $i<$size; $i++) $text.=" ";
	$text = substr($text,0,$size);
	return $text;
}

//////////////////////////////////////////////////////////////////////////////////////////////////
function cut_char($word, $cut) {
	$word=substr($word,0,$cut);						// 필요한 길이만큼 취함.
	for ($k=$cut-1; $k>1; $k--) {	 
		if (ord(substr($word,$k,1))<128) break;		// 한글값은 160 이상.
	}
	$word=substr($word,0,$cut-($cut-$k+1)%2);
	return $word;
}

//////////////////////////////////////////////////////////////////////////////////////////////////
function CheckCommonType($dest, $rsvTime) {
	$dest=preg_replace("/[^0-9]/i","",$dest);
	if (strlen($dest)<10 || strlen($dest)>11) return "휴대폰 번호가 틀렸습니다";
	$CID=substr($dest,0,3);
	if ( preg_match("/[^0-9]/i",$CID) || ($CID!='010' && $CID!='011' && $CID!='016' && $CID!='017' && $CID!='018' && $CID!='019') ) return "휴대폰 앞자리 번호가 잘못되었습니다";
	$rsvTime=preg_replace("/[^0-9]/i","",$rsvTime);
	if ($rsvTime) {
		if (!checkdate(substr($rsvTime,4,2),substr($rsvTime,6,2),substr($rsvTime,0,4))) return "예약날짜가 잘못되었습니다";
		if (substr($rsvTime,8,2)>23 || substr($rsvTime,10,2)>59) return "예약시간이 잘못되었습니다";
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////
function Check_Date($resYear, $c_resYear, $resMonth, $c_resMonth, $resDay, $c_resDay, $resHour, $c_resHour) {
	if ($resYear < $c_resYear || $resMonth < $c_resMonth || $resDay < $c_resDay || $resHour < $c_resHour) {
		echo "
			<script language='javascript'>
			<!--//
				alert('예약시간이 현재 시간 이전입니다. 예약시간을 다시 설정해주세요');
				history.go(-1);
			//-->
			</script>
		";
		exit();
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////
// SMS 클래스
class SMS {
	var $ID;
	var $PWD;
	var $SMS_Server;
	var $port;
	var $SMS_Port;
	var $Data = array();
	var $Result = array();
	var $fp;

	public function test_function() {
		$rand_num = sprintf('%04d',rand(0000,9999));
		return $rand_num;
	}

	//////////////////////////////////////////////////////////////////////////////////////////////////
	// 초기 설정 값
	function SMS() {
		$this->ID="dmitri_sub";			// *****계약 후 지정 사용자가 입력 ( 10자리 미만 )*****
		$this->PWD="rhksflwk1!";	// *****계약 후 지정 사용자가 입력 ( 10자리 미만 )*****
		$this->SMS_Server="210.109.111.38";
		$this->SMS_Port="7296";
		$this->ID = spacing($this->ID,10);
		$this->PWD = spacing($this->PWD,10);
		$this->fp="";
	}

	//////////////////////////////////////////////////////////////////////////////////////////////////
	// 결과값 지우기
	function Init() {
		$this->Data = "";
		$this->Result = "";
	}

	//////////////////////////////////////////////////////////////////////////////////////////////////
	// 번호별 메세지 입력
	function Add($dest, $callBack, $Caller, $msg, $rsvTime) {
		// 내용 검사 1
		$Error = CheckCommonType($dest, $rsvTime);
		if ($Error) return $Error;
		// 내용 검사 2
		if ( preg_match("/[^0-9]/i",$callBack) ) return "회신 전화번호가 잘못되었습니다";
		$msg=cut_char($msg,80); // 80자 제한
		// 보낼 내용을 배열에 집어넣기
		$dest = spacing($dest,11);
		$callBack = spacing($callBack,11);
		$Caller = spacing($Caller,10);
		$rsvTime = spacing($rsvTime,12);
		$msg = spacing($msg,80);
		$this->Data[] = '01144 '.$this->ID.$this->PWD.$dest.$callBack.$Caller.$rsvTime.$msg;
		return "";
	}

	//////////////////////////////////////////////////////////////////////////////////////////////////
	// socket 열기
	function Open() {
		$this->fp=fsockopen($this->SMS_Server,$this->SMS_Port);
		if (!$this->fp) { return false; }
		return true;
	}

	//////////////////////////////////////////////////////////////////////////////////////////////////
	// socket 닫기
	function Close() {
		fclose($this->fp);
	}

	/////////////////////////////////////////////////////////////////////////////////////////////////
	// SMS 보내기
	function Send() {
		set_time_limit(300);
		foreach($this->Data as $key => $puts) {
			$gets = "";
			// echo "puts:". $puts ."<br>";
			$dest = substr($puts,26,11);
			// echo "dest:". $dest ."<br>";

			fputs($this->fp,$puts);
			while(!$gets) { $gets=fread($this->fp,29); }
			// echo "gets:". $gets ."<br>";

			if (substr($gets,0,8)=="0223  00") $this->Result[]=$dest.":".substr($gets,19,10);
			else $this->Result[$dest]=$dest.":Error";
			$gets="";
		}
		$this->Data="";
		return true;
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////
// MySQL 클래스
class MySQL {
	var $HOST;
	var $DB_NAME;
	var $ID;
	var $PWD;
	var $MySQL;

	//////////////////////////////////////////////////////////////////////////////////////////////////
	// 초기 설정 값
	function MySQL() {
		$this->HOST="SMS가 연결할 데이터베이스 호스트명";	// *****사용자가 입력*****
		$this->DB_NAME="SMS가 사용할 데이터베이스";			// *****사용자가 입력*****
		$this->ID="데이터베이스 사용자";									// *****사용자가 입력*****
		$this->PWD="데이터베이스 사용자 암호";						// *****사용자가 입력*****
		$this->SQL="";
	}

	//////////////////////////////////////////////////////////////////////////////////////////////////
	// MySQL 열기
	function Open() {
		$this->SQL = mysql_connect($this->HOST,$this->ID,$this->PWD) or die("데이터베이스 서버연결에 실패하였습니다.");
		mysql_select_db($this->DB_NAME) or die("데이터베이스 선택에 실패하였습니다.");
	}

	//////////////////////////////////////////////////////////////////////////////////////////////////
	// MySQL 값 입력
	function Insert($strCallNo, $strCallBack, $strMsg, $rsvDate, $rsvTime) {

		// 내용 검사 1
		$Error = CheckCommonType($strCallNo, $rsvDate.$rsvTime);
		if (!$Error) {
			$strSQL = "INSERT INTO SMS_DATA(CALL_TO, CALL_FROM, MSG_TXT, RSV_DATE, RSV_TIME) ";
			$strSQL = $strSQL." VALUES('$strCallNo', '$strCallBack', '$strMsg', '$rsvDate', '$rsvTime')";
			$result = mysql_query($strSQL, $this->SQL);
			$strSQL = "";
		} else {
			$result ="";
		}
		return $result;
	}

	//////////////////////////////////////////////////////////////////////////////////////////////////
	// MySQL 닫기
	function Close() {
		mysql_close($this->SQL);
	}
}
?>