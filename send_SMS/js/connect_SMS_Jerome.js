$(function() {
	// 인증번호 재호출
	$('#request_sms').click(function() {
		// alert("인증번호를 다시 전송하였습니다.");
		var get_number = $('.sms_number').text();
		get_countryCodeNphoneNum_Jerome(get_number);
		clearInterval(t1);
		document.getElementById("count_sms1").innerHTML = "인증번호 입력 유효시간까지";
		document.getElementById("count_sms2").innerHTML = "03분 00초";
		document.getElementById("count_sms3").innerHTML = "남았습니다.";
		sms_timer_start();
	});

	// 문자인증 호출
	$('#sms_confirm').click(function() {
		$('#mask').hide();
		$('#sms_popup').hide();
		$('#profile-sms').hide();
		$('#profile-sms2').show();
		var get_number = $('.sms_number').text();
		get_countryCodeNphoneNum_Jerome(get_number);
	});

	$("#btn_select_type4").on('click', function() {
		var input_num = document.getElementById('sms-input').value;
		var check_num = document.getElementById('sms-check').value;
		if(input_num == check_num) {
			// alert("인증이 완료되었습니다.");
			$('#profile-sms2').hide();
			$('#profile-select-type').show();
		} else if(input_num == "") {
			// alert("인증 번호를 입력해주세요.");
		} else {
			// alert("인증 번호를 다시 확인 후 입력해주세요.");
			document.getElementById('sms-input').value = "";
			document.getElementById('sms-input').focus();
		}
	});

	$("#btn_select_type3").click(function() {
		var data = $('.sms_data').val();
		$('.sms_number').text(data);
		$('.sms_number_confirm').text(data);
		$('#mask').show();
		$('#sms_popup').center().show();
	});
			
});

function get_countryCodeNphoneNum_Jerome(response_data) {
	document.getElementById('sms-check').value = "!@#$%";
	var temp_array = response_data.split(")");
	var country_number = temp_array[0];
	var phone_num = temp_array[1];
	/* 문자 전송 연동 소스 */
	send_SMS_Jerome(phone_num);	
	
	/* test 진행 소스 
	document.getElementById('sms-check').value = 1234;
	document.getElementById('sms-input').value = "";
	document.getElementById('sms-input').focus();
	sms_timer_start();
	*/
}

function send_SMS_Jerome(phone_num) {
	if(phone_num != "" || phone_num != null || phone_num != undefined || phone_num != NAN) {
		// alert("send_SMS_Jerome 접근 성공.");
		 var data = {};
		 data.phone_num = phone_num;
		 data = JSON.stringify(data);
		 $.ajax({
		 	type: 'POST',
		 	url: '../Sms_socket_utf8',
		 	data: "data="+data,
		 	success:function(data) {
		 		// alert(data);
		 		// console.log(data);
		 		document.getElementById('sms-check').value = data;
		 		document.getElementById('sms-input').value = data;
		 		document.getElementById('sms-input').focus();
		 		sms_timer_start();
		 	},
		 	error:function(request,status,error) {
		 		alert(error);
		 	}
		 });

	} else {
		// alert("send_SMS_Jerome 접근 실패.");
		alert("올바른 휴대폰 번호가 아닙니다.");
	}
}


function sms_timer_start() {
	tcounter = 180;	// 3분설정
	t1 = setInterval(Timer, 1000);
}

function Timer() {
	tcounter=tcounter-1;	// 1초씩 감소
	temp=Math.floor(tcounter/60);	// 분 두자리 계산 mm
	if( Math.floor(tcounter/60) < 10) {
		temp = '0' + temp;
	}
	temp = temp + "분 ";
	if( (tcounter%60) < 10 ) {
		temp = temp + '0';
	}
	temp = temp + (tcounter%60);
	document.getElementById("count_sms2").innerHTML = temp + "초";
	if(tcounter < 0) sms_timer_stop();
}

function sms_timer_stop() {
	clearInterval(t1);
	document.getElementById("count_sms1").innerHTML = "인증번호 입력 유효시간이 지났습니다.";
	document.getElementById("count_sms2").innerHTML = "";
	document.getElementById("count_sms3").innerHTML = "다시 전송 후 입력해주세요.";
	document.getElementById('sms-input').value = "";
	document.getElementById('sms-check').value = "!@#$%";
}
