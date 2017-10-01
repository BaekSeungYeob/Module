$(function() {
	$("#DRIVING_img").on('click', function() {
		// alert("자동차 버튼 클릭");
		if(document.getElementById("DRIVING_img").style.opacity != 1) {
			getLeadTime_Jerome(origin_location, destination_location, "DRIVING");
		}
	});
	
	$("#TRANSIT_img").on('click', function() {
		// alert("대중교통 버튼 클릭");
		if(document.getElementById("TRANSIT_img").style.opacity != 1) {
			getLeadTime_Jerome(origin_location, destination_location, "TRANSIT");
		}
	});
	
	$("#WALKING_img").on('click', function() {
		// alert("보행자 버튼 클릭");
		if(document.getElementById("WALKING_img").style.opacity != 1) {
			getLeadTime_Jerome(origin_location, destination_location, "WALKING");
		}
	});
});

// 시간계산 값 넘겨주는 예시 - <2017-09-18 Jerome>

//var origin = {lat: 55.93, lng: -3.118};
//var destination = {lat: 50.087, lng: 14.421};
// var origin = {lat: 37.495874, lng: 126.906361};
// var destination = {lat: 37.515622, lng: 127.118271};
// getLeadTime_Jerome(origin, destination, 'DRIVING');
// getLeadTime_Jerome(origin, destination, 'TRANSIT');
// getLeadTime_Jerome(origin, destination, 'WALKING');




// 검색 국가 확인 후 이동시간 계산 - <2017-09-16 Jerome>
function getLeadTime_Jerome(origin, destination, transport) {
	// origin - 출발지 ( 좌표 값 )
	// destination - 목적지 ( 좌표 값 )
	// transport - 이동수단 ( DRIVING - 자동차 , TRANSIT - 대중교통, WALKING - 도보 )
	
	// console.log(origin);
	// console.log(destination);
	// console.log(transport);
	
	var console_Transport;
	if(transport == "DRIVING") { 
		
		document.getElementById("DRIVING_img").style.opacity = 1;
		document.getElementById("TRANSIT_img").style.opacity = 0.3;
		document.getElementById("WALKING_img").style.opacity = 0.3;
		
		console_Transport = "자동차";
		
	} else if(transport == "TRANSIT") { 
		
		document.getElementById("DRIVING_img").style.opacity = 0.3;
		document.getElementById("TRANSIT_img").style.opacity = 1;
		document.getElementById("WALKING_img").style.opacity = 0.3;
		
		console_Transport = "대중교통";	
		
	} else if(transport == "WALKING") { 
		
		
		document.getElementById("DRIVING_img").style.opacity = 0.3;
		document.getElementById("TRANSIT_img").style.opacity = 0.3;
		document.getElementById("WALKING_img").style.opacity = 1;
		
		console_Transport = "보행자"; 
		
	} else { 
		
		document.getElementById("DRIVING_img").style.opacity = 0.3;
		document.getElementById("TRANSIT_img").style.opacity = 0.3;
		document.getElementById("WALKING_img").style.opacity = 0.3;
		
		console_Transport = "이동수단을 확인할 수 없습니다."; 
		
	}
	// console.log(console_Transport);
	
	var origin_check;
	var destination_check;
	
	var geocoder = new google.maps.Geocoder;
	geocoder.geocode({
		'location' : origin
	}, function(results, status) {
		if(status === "OK") {
			for(var i=0; i<results.length; i++) {
				if(results[i].formatted_address.indexOf('대한민국') != -1) {
					origin_check = "korea";
					break;
				} else {
					origin_check = "not korea";
				}
			}
			
			geocoder.geocode({
      			'location' : destination
      		}, function(results, status) {
      			if(status === "OK") {
      				for(var i=0; i<results.length; i++) {
      					if(results[i].formatted_address.indexOf('대한민국') != -1) {
      						destination_check = "korea";
      						break;
      					} else {
      						destination_check = "not korea";
      					}
      				}
      				// console.log(origin_check);
      				// console.log(destination_check);
      				var check_countries_result = check_countries_Jerome(origin_check, destination_check, transport);
      				// console.log(check_countries_result);
      				if(check_countries_result == "T MAP 실행") {
      					getLeadTime_TMAP_Jerome(origin, destination, transport);
      					Korea_Map_ConnectionApp_Jerome(transport);
      				} else if(check_countries_result == "GOOGLE MAP 실행") {
      					if(destination_check == "korea") {
      						getLaedTime_GOOGLE_Jerome(origin, destination, transport);
      						Korea_Map_ConnectionApp_Jerome(transport);
      					} else {
      						getLaedTime_GOOGLE_Jerome(origin, destination, transport);
      						Not_Korea_Map_ConnectionApp_Jerome(transport);
      					}
      				} else {
      					alert(check_countries_result);
      				}
      			}
      		});
		}
});
	
}

function check_countries_Jerome(origin_check, destination_check, transport) {
	// console.log(origin_check);
	// console.log(destination_check);
	var result;
	if(origin_check == destination_check) {
		if(origin_check == "korea" && transport != "TRANSIT") {
			result = "T MAP 실행"; 
		} else {
			result = "GOOGLE MAP 실행";
		}
	} else {
		if(origin_check == "korea") {
			result = "다른 나라를 식별할 수 없습니다.";
		} else {
			result = "Unable to identify other countries.";
		}
	}
	return result;
}
	
// 이동시간 계산 ( Google ) - <2017-09-16 Jerome>
function getLaedTime_GOOGLE_Jerome(origin, destination, transport) {
	
	var geocoder = new google.maps.Geocoder;
	var service = new google.maps.DistanceMatrixService;
	
	service.getDistanceMatrix({
		origins: [origin],
		destinations: [destination],
		travelMode: transport,
		unitSystem: google.maps.UnitSystem.METRIC,
		avoidHighways: false,
		avoidTolls: false,
	}, function(response, status) {
		if(status !== 'OK') {
//			alert('Error was : ' + status);
			if(transport == "DRIVING") {
				NavigationResult("길찾기 결과 없음 - 자동차");
    			
    			document.getElementById("navi-goal-time").innerHTML = "-";
    			document.getElementById("navi-end-time").innerHTML = "-";
    			
			} else if(transport == "TRANSIT") {
				NavigationResult("길찾기 결과 없음 - 대중교통");
    			
    			document.getElementById("navi-goal-time").innerHTML = "-";
    			document.getElementById("navi-end-time").innerHTML = "-";
    			
			} else {
				var temp_text = "에러가 발생하였습니다.<br>해당 코드로 관리자에게 문의하세요.<br>"+status;
				document.getElementById("navigation-result").innerHTML = temp_text;
				document.getElementById("navi-goal-time").innerHTML = "-";
				document.getElementById("navi-end-time").innerHTML = "-";
			}
			
		} else {
			// console.log(response);
			
			// console.log(response.originAddresses);
			var originList = response.originAddresses;
			// console.log(originList[0]);
			
			var destinationList = response.destinationAddresses;
			// console.log(destinationList[0]);
			
			var results = response.rows[0].elements;
			
			// console.log("출발지 : " + originList[0] + "\n" 
			// 			+ "목적지 : " + destinationList[0] + "\n"
			// 			+ "이동거리 : " + results[0].distance.text + "\n"
			// 			+ "소요시간 : " + results[0].duration.text );
			// console.log("상세 거리 : " + results[0].distance.value);
			// console.log("상세 시간 : " + results[0].duration.value);
			
			var distance_total_time_num = results[0].duration.value;
            // console.log(distance_total_time_num);
			var distance_total_distance_num = results[0].distance.value;
			var check_walking_30km = Math.floor(distance_total_distance_num / 1000);
            if(transport == "WALKING" && check_walking_30km > 30) {
            	NavigationResult("30km이상에서 도보");
    			
    			document.getElementById("navi-goal-time").innerHTML = "-";
    			document.getElementById("navi-end-time").innerHTML = "-";
            } else {
            	// 상점 마감시간 확인 함수 실행 - <2017-09-17 Jerome>
            	getStoreFinishedTime_Jerome(distance_total_time_num, distance_total_distance_num);
            }
		}
	});
}
	
// 이동시간 계산 ( TMAP ) - <2017-09-16 Jerome>
function getLeadTime_TMAP_Jerome(origin, destination, transport) {
//		console.log(origin);
//		console.log(origin.lat);
//		console.log(origin.lng);
//		console.log(destination);
//		console.log(destination.lat);
//		console.log(destination.lng);
	if(transport == "DRIVING") {
	$(function(){
        // console.log("자동차 경로안내 API 요청 시작");
        $.ajax({
            method: "POST",
            url: "https://apis.skplanetx.com/tmap/routes?version=1",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "appKey": "b9cc3c71-cdbe-351e-a2fe-1c992bdd9ee3"
            },
            data: "startX="+origin.lng+"&startY="+origin.lat+"&endX="+destination.lng+"&endY="+destination.lat+"&reqCoordType=WGS84GEO&resCoordType=WGS84GEO",
            success: function(result){
            	// console.log(result);
                // console.log("totalDistance(단위: m) :" + result.features[0].properties.totalDistance);
                // console.log("totalTime(단위: 초) :" + result.features[0].properties.totalTime);
                
                var distance_total_time_num = result.features[0].properties.totalTime;
                // console.log(distance_total_time_num);
                var distance_total_distance_num = result.features[0].properties.totalDistance;
                
  				// 상점 마감시간 확인 함수 실행 - <2017-09-17 Jerome>
  				getStoreFinishedTime_Jerome(distance_total_time_num, distance_total_distance_num);
  				
            }
        });
    });
	} else if(transport == "WALKING") {
		$(function(){
            // console.log("보행자 경로안내 API 요청 시작");
            $.ajax({
                method: "POST",
                url: "https://apis.skplanetx.com/tmap/routes/pedestrian?version=1",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "appKey": "b9cc3c71-cdbe-351e-a2fe-1c992bdd9ee3"
                },
                data: "startX="+origin.lng+"&startY="+origin.lat+"&endX="+destination.lng+"&endY="+destination.lat+"&reqCoordType=WGS84GEO&resCoordType=WGS84GEO&startName=시작지점&endName=끝지점",
                success: function(result){
                	// console.log(result);
                    // console.log("totalDistance(단위: m) :" + result.features[0].properties.totalDistance);
                    // console.log("totalTime(단위: 초) :" + result.features[0].properties.totalTime);
                    
                    var distance_total_time_num = result.features[0].properties.totalTime;
                    // console.log(distance_total_time_num);
                    var distance_total_distance_num = result.features[0].properties.totalDistance;
                    var check_walking_30km = Math.floor(distance_total_distance_num / 1000);
                    if(check_walking_30km > 30) {
                    	NavigationResult("30km이상에서 도보");
            			
            			document.getElementById("navi-goal-time").innerHTML = "-";
            			document.getElementById("navi-end-time").innerHTML = "-";
                    } else {
                    	// 상점 마감시간 확인 함수 실행 - <2017-09-17 Jerome>
                    	getStoreFinishedTime_Jerome(distance_total_time_num, distance_total_distance_num);
                    	
                    }
                }
            });
        });
		
		
	} else {
		alert("이동수단이 제대로 설정되지 않음.");
	}
}

// 상점 마감 시간 확인 - <2017-09-17 Jerome>
function getStoreFinishedTime_Jerome(distance_total_time_num, distance_total_distance_num) {
	
	var now_date = new Date();
	var now_year = now_date.getYear() + 1900;
	// console.log(now_year + " 년");
	var now_month = now_date.getMonth() + 1;
	// console.log(now_month + " 월");
	var now_day = now_date.getDate();
	// console.log(now_day + " 일");
	var now_hour = now_date.getHours();
//	 console.log(now_hour + " 시");
	var now_minutes = now_date.getMinutes();
//	 console.log(now_minutes + " 분");
	var now_seconds = now_date.getSeconds();
//	 console.log(now_seconds + " 초");
	var now_total_time_num = (now_hour * 60 * 60) + (now_minutes * 60) + now_seconds;
	// console.log(now_total_time_num);
	var now_total_time_str = secondsToTime_Jerome(now_total_time_num);
	// console.log(now_total_time_str);

	var day_last_time_num = (23 * 60 * 60) + (59 * 60) + 59;
	// console.log("하루의 마지막 시간 (단위: 초) : " + day_last_time_num);

	var day_last_time_str = secondsToTime_Jerome(day_last_time_num);
	// console.log("하루의 마지막 시간 (00:00:00) : " + day_last_time_str);
	
	var week = new Array('sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat');
	var now_week_num = now_date.getDay();
	var now_week = week[now_date.getDay()];
	// console.log(now_week_num);
	// console.log(now_week);
	
	// console.log("현재 시간 : "
	// 			+ now_year + " 년 "
	// 			+ now_month + " 월 "
	// 			+ now_day + " 일 - "
	// 			+ now_hour + " 시 "
	// 			+ now_minutes + " 분 "
	// 			+ now_seconds + " 초 "
	// 			+ "(" + now_week + ")");
	
	// console.log("현재 시간 (단위: 초) : " + now_total_time_num);
	// console.log("현재 시간 (00:00:00) : " + now_total_time_str);
	
	
	// console.log("상점 마감시간 확인 함수 실행");
	
	// console.log(click_find_location_value);
	// console.log(distance_total_time_num);
	// console.log(now_total_time_num);
	
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 상점 시간 설정 - <2017-09-19 Jerome>
	
	// 상점 오픈시간 (초)단위로 변환 - <2017-09-19 Jerome>
	var store_opentime_str = now_week+"-opentime";
	var store_opentime_num = timeToSeconds_Jerome(store_opentime_str);
	
	// 상점 마감시간 (초)단위로 변환 - <2017-09-19 Jerome>
	var store_closetime_str = now_week+"-closetime";
	var store_closetime_num = timeToSeconds_Jerome(store_closetime_str);
	
	// 상점 추가 오픈시간 (초)단위로 변환 - <2017-09-19 Jerome>
	var add_opentime_str = "add-opentime";
	var add_opentime_num = timeToSeconds_Jerome(add_opentime_str);
	
	// 상점 추가 마감시간 (초)단위로 변환 - <2017-09-19 Jerome>
	var add_closetime_str = "add-closetime";
	var add_closetime_num = timeToSeconds_Jerome(add_closetime_str);
	
	// 상점 총 오픈시간(초) - <2017-09-19 Jerome>
	store_opentime_num += add_opentime_num;
	
	// 상점 총 마감시간(초) - <2017-09-19 Jerome>
	store_closetime_num += add_closetime_num;
	
	// UI에 보여주기 위한 시간 변경(open / close) (ex "00:00:00") - <2017-09-19 Jerome>
	store_opentime_str = secondsToTime_Jerome(store_opentime_num);
	store_closetime_str = secondsToTime_Jerome(store_closetime_num);
	
//----------------------------------------------------------------------------------------------------------------	
	
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// 시간 계산 테스트
//	var a = 55000;
//	
//	var hour = (a / 60) / 60;
//	var minutes = (a / 60) % 60;
//	var seconds = a % 60;
//	
//	console.log(Math.floor(hour) + "(시)");
//	console.log(Math.floor(minutes) + "(분)");
//	console.log(Math.floor(seconds) + "(초)");
//	
//	console.log((hour*60*60) + (minutes*60) + (seconds));
//----------------------------------------------------------------------------------------------------------------
	
	
	
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// 도착 예상시간 설정 - <2017-09-19 Jerome>
	var goal_total_time_num = now_total_time_num + distance_total_time_num;
	if(goal_total_time_num > 86399) {
		goal_total_time_num += (day_last_time_num + 1);
	}
	// console.log(goal_total_time_num);
	var goal_total_time_str = secondsToTime_Jerome(goal_total_time_num);
	
	// 계산된 소요 시간 - <2017-0919 Jerome>
	// console.log(distance_total_time_num);
	var distance_total_time_str = secondsToTime_Jerome(distance_total_time_num);
	// console.log("소요 시간 = " + distance_total_time_str);
	
	// 소요 거리 - <2017-09-19 Jerome>
	var goal_total_distance_num = Math.floor(distance_total_distance_num / 1000);
	var goal_total_distance_str = goal_total_distance_num + "km";
	// console.log("소요 거리 = " + goal_total_distance_str);
	
	
//----------------------------------------------------------------------------------------------------------------
	
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// start_break_time 계산 - <2017-09-19 Jerome>
	var start_breaktime_str = "start_breaktime";
	if(start_breaktime_str.indexOf(":") != -1) {
		var start_breaktime_num = timeToSeconds_Jerome(start_breaktime_str);
	} else {
		var start_breaktime_num = 0;
	}
	// console.log("break_time 시작 : " + start_breaktime_num);
	
	// end_break_time 계산 - <2017-09-19 Jerome>
	var end_breaktime_str = "end_breaktime";
	if(end_breaktime_str.indexOf(":") != -1) {
		var end_breaktime_num = timeToSeconds_Jerome(end_breaktime_str);
	} else {
		var end_breaktime_num = 0;
	}
	// console.log("break_time 끝 : " + end_breaktime_num);
	
	// start_break_time2 계산 - <2017-09-19 Jerome>
	var start_breaktime2_str = "start_breaktime2";
	if(start_breaktime2_str.indexOf(":") != -1) {
		var start_breaktime2_num = timeToSeconds_Jerome(start_breaktime2_str);
	} else {
		var start_breaktime2_num = 0;
	}
	// console.log("break_time2 시작 : " + start_breaktime2_num);
	
	// end_break_time2 계산 - <2017-09-19 Jerome>
	var end_breaktime2_str = "end_breaktime2";
	if(end_breaktime2_str.indexOf(":") != -1) {
		var end_breaktime2_num = timeToSeconds_Jerome(end_breaktime2_str);
	} else {
		var end_breaktime2_num = 0;
	}
	// console.log("break_time2 끝 : " + end_breaktime2_num);
	
	// now_opentime 계산 - <2017-09-19 Jerome>
	var now_opentime_str = "now_opentime";
	if(now_opentime_str.indexOf(":") != -1) {
		var now_opentime_num = timeToSeconds_Jerome(now_opentime_str);
	} else {
		var now_opentime_num = 0;
	}
	// console.log("now_opentime : " + now_opentime_num);
	
	// last_ordertime 계산 - <2017-09-19 Jerome>
	var last_ordertime_str = "last_ordertime";
	if(last_ordertime_str.indexOf(":") != -1) {
		var last_ordertime_num = timeToSeconds_Jerome(last_ordertime_str);
	} else {
		var last_ordertime_num = 0;
	}
	// console.log("last_ordertime : " + last_ordertime_num);
	
	
//----------------------------------------------------------------------------------------------------------------

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// 거리 계산 
	
	
//----------------------------------------------------------------------------------------------------------------
	// console.log("도착 예정 시간 (초 단위) = " + goal_total_time_num);
	// console.log("도착 예정 시간 (00:00:00) = " + goal_total_time_str);
	
	
	// 상황 별 안내 메시지 제공 - <2017-09-19 Jerome>
	
	// 24시 영업인지 아닌지 판별
	if(store_opentime_num == 0 && store_closetime_num == 0) {
		
		if(goal_total_time_num >= start_breaktime_num && goal_total_time_num <= end_breaktime_num) {	
			NavigationResult("브레이크 타임");
			
			document.getElementById("navi-goal-time").innerHTML = goal_total_time_str;
			document.getElementById("navi-end-time").innerHTML = store_closetime_str;
			
		} else if(goal_total_time_num >= start_breaktime2_num && goal_total_time_num <= end_breaktime2_num) {
			NavigationResult("브레이크 타임");
			
			document.getElementById("navi-goal-time").innerHTML = goal_total_time_str;
			document.getElementById("navi-end-time").innerHTML = store_closetime_str;
			
		} else {
			NavigationResult("24시간 영업");
			
			document.getElementById("navi-goal-time").innerHTML = goal_total_time_str;
			document.getElementById("navi-end-time").innerHTML = store_closetime_str;
		}
		
	} else {
		// 영업 마감시간이 다음날로 넘어가는 경우 - <2017-09-19 Jerome>
		if(store_closetime_num < store_opentime_num) {
			store_closetime_num += (day_last_time_num + 1);
		}
			
		// 브레이크 타임이 다음날로 넘어가는 경우 - <2017-09-19 Jerome>
		if(end_breaktime_num < start_breaktime_num) {
			end_breaktime_num += (day_last_time_num + 1);
		}
		// 브레이크 타임2가 다음날로 넘어가는 경우 - <2017-09-19 Jerome>
		if(end_breaktime2_num < start_breaktime2_num) {
			end_breaktime2_num += (day_last_time_num + 1);
		}
		// 라스트오더 타임이 다음날로 넘어가는 경우 - <2017-09-19 Jerome>
		if(last_ordertime_num < store_opentime_num) {
			last_ordertime_num += (day_last_time_num + 1);
		}
		
		if(goal_total_time_num >= start_breaktime_num && goal_total_time_num <= end_breaktime_num) {	
			NavigationResult("브레이크 타임");
			
			document.getElementById("navi-goal-time").innerHTML = goal_total_time_str;
			document.getElementById("navi-end-time").innerHTML = store_closetime_str;
			
		} else if(goal_total_time_num >= start_breaktime2_num && goal_total_time_num <= end_breaktime2_num) {
			NavigationResult("브레이크 타임");
			
			document.getElementById("navi-goal-time").innerHTML = goal_total_time_str;
			document.getElementById("navi-end-time").innerHTML = store_closetime_str;
			
		} else if(goal_total_time_num >= last_ordertime_num && goal_total_time_num <= store_closetime_num) {
			NavigationResult("라스트 오더");
			
			document.getElementById("navi-goal-time").innerHTML = goal_total_time_str;
			document.getElementById("navi-end-time").innerHTML = store_closetime_str;
			
		} else if(store_closetime_num - goal_total_time_num < 3600) {
			NavigationResult("마감 30분 전");
			
			document.getElementById("navi-goal-time").innerHTML = goal_total_time_str;
			document.getElementById("navi-end-time").innerHTML = store_closetime_str;
			
		} else if(goal_total_time_num >= store_closetime_num) {
			NavigationResult("도착하면 영업종료");
			
			document.getElementById("navi-goal-time").innerHTML = goal_total_time_str;
			document.getElementById("navi-end-time").innerHTML = store_closetime_str;
			
		} else {
			NavigationResult("성공");
			
			document.getElementById("navi-goal-time").innerHTML = goal_total_time_str;
			document.getElementById("navi-end-time").innerHTML = store_closetime_str;
			
		}
			
			
	}
	
	
	
	if(document.getElementById("navigation-popup").style.display != "block") {
		$("#navigation-popup").show();
	}
	
}



// "00:00" 시간 -> (초)단위 시간 변경 - <2017-09-19 Jerome>
function timeToSeconds_Jerome(get_String_Time) {	
	
	if(click_find_location_value[get_String_Time].indexOf(":") != -1) {
		
		var time_array = click_find_location_value[get_String_Time].split(":");
		
		// (시) -> (초)
		if(time_array[0] != null || time_array[0] != undefined) {
			var hours = parseInt(time_array[0]);
			hours = hours * 60 * 60;
		} else {
			var hours = 00;
		}
		
		// (분) -> (초)
		if(time_array[1] != null || time_array[1] != undefined) {
			var minutes = parseInt(time_array[1]);
			minutes = minutes * 60;
		} else {
			var minutes = 00;
		}
		
		// seconds(초)
		if(time_array[2] != null || time_array[2] != undefined) {
			var seconds = parseInt(time_array[2]);
		} else {
			var seconds = 00;
		}
		
		var number_time = hours + minutes + seconds;
	} else {
		var number_time = click_find_location_value[get_String_Time];
	}
	return number_time;
}


//(초)단위 시간 -> "00:00:00" 시간 변경 - <2017-09-19 Jerome>
function secondsToTime_Jerome(get_Number_Time) {
	if(get_Number_Time != null || get_Number_Time != undefined) {
		if(get_Number_Time < 60) {
			var seconds = get_Number_Time;
			var minutes = 00;
			var hours = 00;
		} else if(get_Number_Time >= 60 && get_Number_Time < 3600) {
			var seconds = Math.floor((get_Number_Time % 60));
			var minutes = Math.floor(((get_Number_Time / 60) % 60));
			var hours = 00;
		} else if(get_Number_Time >= 3600 && get_Number_Time < 86400) {
			var seconds = Math.floor((get_Number_Time % 60));
			var minutes = Math.floor(((get_Number_Time / 60) % 60));
			var hours = Math.floor(((get_Number_Time / 60) / 60));
		} else if(get_Number_Time >= 86400) {
			// alert("시간이 24시간 넘어감");
			var seconds = 00;
			var minutes = 00;
			var hours = 00;
		} else {
			// alert("상황 계산 대기 중..");
			var seconds = 00;
			var minutes = 00;
			var hours = 00;
		}
		
		if(seconds < 1) {
			seconds = "00";
		} else if(seconds >= 1 && seconds < 10) {
			seconds = "0" + seconds;
		} else if(seconds >= 10 && seconds < 60) {
			seconds = "" + seconds;
		} else if(seconds >= 60) {
			minutes += Math.floor((seconds / 60));
			seconds = Math.floor((seconds % 60));
		} else {
//			alert("(초) 설정이 잘못 되었습니다. : " + seconds);
			seconds = "00";
		}
		
		if(minutes < 1) {
			minutes = "00";
		} else if(minutes >= 1 && minutes < 10) {
			minutes = "0" + minutes;
		} else if(minutes >= 10 && minutes < 60) {
			minutes = "" + minutes;
		} else if(minutes >= 60 && minutes < 70) {
			hours += Math.floor((minutes / 60));
			minutes = "0" + Math.floor((minutes % 60));
		} else if(minutes >= 70) {
			hours += Math.floor((minutes / 60));
			minutes = Math.floor((minutes % 60));
		} else {
//			alert("(분) 설정이 잘못 되었습니다. : " + minutes);
			minutes = "00";
		}
		
		if(hours < 1) {
			hours = "00";
		} else if(hours >= 1 && hours < 10) {
			hours = "0" + hours;
		} else if(hours >= 10 && hours < 24) {
			hours = "" + hours;
		} else if(hours >= 24 && hours < 48) {
			hours = "" + Math.floor((hours % 24));
		} else {
//			alert("(시) 설정이 잘못 되었습니다. : " + hours);
			hours = "00";
		}
		
		var string_time = hours + ":" + minutes + ":" + seconds;
	} else {
		var string_time = "전달받은 시간 값이 없습니다.";
	}
	return string_time;
}


function Korea_Map_ConnectionApp_Jerome(transport) {
	document.getElementById("install-app-popup").innerHTML = "";
	document.getElementById("install-app-popup").innerHTML = 
		'<table id="install-app-table" class="reset table margin-all-auto">'
		+ '<tr id="install-kakao" class="runApp bg-white" data-type="kakao" trans-type="'+transport+'" height="45%">'
		+ '<td>kakao navi</td>'
		+ '</tr>'
		+ '<tr height="10%"><td></td></tr>'
		+ '<tr id="install-tmap" class="runApp bg-white" data-type="tmap" trans-type="'+transport+'" height="45%">'
		+ '<td>T-map</td>'
		+ '</tr>'
		+ '</table>';
}


function Not_Korea_Map_ConnectionApp_Jerome(transport) {
	document.getElementById("install-app-popup").innerHTML = "";
	document.getElementById("install-app-popup").innerHTML = 
		'<table id="install-app-table" class="reset table margin-all-auto">'
		+ '<tr id="install-MAPSme" class="runApp bg-white" data-type="MAPSME" trans-type="'+transport+'" height="45%">'
		+ '<td>Maps.Me</td>'
		+ '</tr>'
		+ '<tr height="10%"><td></td></tr>'
		+ '<tr id="install-SYGIC" class="runApp bg-white" data-type="SYGIC" trans-type="'+transport+'" height="45%">'
		+ '<td>SYGIC</td>'
		+ '</tr>'
		+ '</table>';
}