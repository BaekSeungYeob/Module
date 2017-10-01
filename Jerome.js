$(function() {

	// 현재 위치 불러오기 이벤트
	$("#my-location").click(function() {
		//alert("버튼 클릭");
		// alert(kindOfMap);
		if(kindOfMap == "") {
			// alert("map1");
			Geolocation_ramNjerome(0);
		} else {
			// alert("map3");
			Geolocation_ramNjerome(2, detailLocation_Jerome);
		}
	});

	if ($("#bottom-list").css("display") == "block") {
		liveClusterClicked = 0;
	}

	// 상세화면 맵 클릭 시 다시 메인 페이지로 retuen - <2017-08-04 Jerome>

	// 맵이 두번 클릭되는 현상이 있어서 강제적으로 처리 해 놓은 상황입니다.
	// 아마 이 부분으로 paging 처리가 가능하지 않을까 생각은 해보지만
	// 그것은 해봐야 결론이 나기 때문에 확답은 못하겠습니다.
	$('#detail-map').on('click', function() {
		datail_Map_Click++;
		if (datail_Map_Click == 2) {
			$("#detail-popup").hide();
			datail_Map_Click = 0;
		}
	});

});

function getSelectMyLocation(addr) {
	var myAddress = addr.split("#$%^&");
	var myLat = parseFloat(myAddress[0]);
	var myLng = parseFloat(myAddress[1]);
	var myLatLng = new google.maps.LatLng(myLat, myLng);
	var shape = {
		coords : [ 1, 1, 1, 20, 18, 20, 18, 1 ],
		type : 'poly'
	};
	// map.panTo(myLatLng, 2000);
	$("#my-location").trigger("click");
	map.setZoom(13);
}

// 주소값으로 위도 경도 가져오기 (Geocoding) - <jerome>
function getLatLng_Jerome(place) {
	// 내위치주변 찾기 클릭으로 페이지 이동 아닌 경우 - <Jerome>
	if (place != "myLocation") {
		geocoder = new google.maps.Geocoder();
		geocoder.geocode({
			address : place,
			region : 'ko'
		}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				var bounds = new google.maps.LatLngBounds();
				for ( var r in results) {
					if (results[r].geometry) {
						var latlng = results[r].geometry.location;
						bounds.extend(latlng);
						var address = results[r].formatted_address;

					}
				}
				map.fitBounds(bounds);
				map.setZoom(13);
			} else if (status == google.maps.GeocoderStatus.ERROR) {
				alert("통신중 에러발생！");
			} else if (status == google.maps.GeocoderStatus.INVALID_REQUEST) {
				alert("요청에 문제발생！geocode()에 전달하는GeocoderRequest확인！");
			} else if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
				alert("단시간에 쿼리 과다송신！");
			} else if (status == google.maps.GeocoderStatus.REQUEST_DENIED) {
				alert("이 페이지에는 지오코더 이용 불가! 왜??");
			} else if (status == google.maps.GeocoderStatus.UNKNOWN_ERROR) {
				alert("서버에 문제가 발생한거 같아요. 다시 한번 해보세요.");
			} else if (status == google.maps.GeocoderStatus.ZERO_RESULTS) {
				alert("존재하지 않습니다.");
			} else {
				alert("??");
			}
		});
	}
}

// 상세보기 맵 & Marker - <Jerome>
function setSelectOneMarker(map2, kindOfMenu, lat, lng) {
	var myLat = lat;
	var myLng = lng;
	var markerImage = setMarkerImage_Jerome(kindOfMenu);
	var myLatLng = new google.maps.LatLng(myLat, myLng);
	var shape = {
		coords : [ 1, 1, 1, 20, 18, 20, 18, 1 ],
		type : 'poly'
	};
	var type = type;
	selectOneMarker = new google.maps.Marker({
		position : {
			lat : myLat,
			lng : myLng
		},
		map : map2,
		icon : markerImage,
		shape : shape,
		title : type,
		zIndex : 5,
		draggable : false
	});
	// console.log(kindOfMenu["address"]);
	var detail_address = kindOfMenu["address"];

	var infowindow = new google.maps.InfoWindow({
		content : detail_address,
		maxWidth : $("#detail-map").width() - 20
	});
	selectOneMarker.addListener('click', function() {
		$("#detailmap-popup .header-title").html(kindOfMenu.name);
		$("#detailmap-popup").css("left","0px");
		$("#detail-header").hide();
		$("#detail-footer").hide();
		$("#my-location").css("z-index","1006");
		// $("#live-store").show();
		// $("#live-store").css("z-index","1006");
	});
	selectOneMarker.setMap(map2);

	map2.panTo(myLatLng, 2000);
	map2.setZoom(17);
	infowindow.open(map2, selectOneMarker);
}

// 상세보기 -> 지도 클릭 - <2017-09-20 Jerome>
function setSelectOneMarker3(map3, kindOfMenu, lat, lng) {
	// console.log(kindOfMenu);

	var myLat = lat;
	var myLng = lng;
	var markerImage = setMarkerImage_detail_Jerome(kindOfMenu);
	var myLatLng = new google.maps.LatLng(myLat, myLng);
	var shape = {
		coords : [ 1, 1, 1, 20, 18, 20, 18, 1 ],
		type : 'poly'
	};
	var type = type;
	selectOneMarker = new google.maps.Marker({
		position : {
			lat : myLat,
			lng : myLng
		},
		map : map3,
		icon : markerImage,
		shape : shape,
		title : type,
		zIndex : 5,
		draggable : false
	});
	// console.log(kindOfMenu["address"]);
	selectOneMarker.setMap(map3);

	map3.panTo(myLatLng, 2000);
	map3.setZoom(13);
	$("#detailmap-popup").css("left","-10000px");
}


function getResult(addr) {
	var myAddress = addr.split("#$%^&");
	var myLat = myAddress[0];
	var myLng = myAddress[1];

	sessionStorage.setItem('lat', myLat);
	sessionStorage.setItem('lng', myLng);

	$('.currLat').val(myLat);
	$('.currLng').val(myLng);
}

//// 검색 위치 이동 & Marker - <Jerome>
//function searchLocation_Jerome()

// 현재위치 이동 & Marker - <Jerome>
var myLat = "", myLng = "";
function detailLocation_Jerome(addr) {
	var myAddress = addr.split("#$%^&");
	// alert(kindOfMap);
	// test용 현재위치 - <Jerome>
	var detailLat = parseFloat(myAddress[0]);
	var detailLng = parseFloat(myAddress[1]);
	var detailLatLng = new google.maps.LatLng(parseFloat(detailLat), parseFloat(detailLng));

	var shape = {
		coords : [ 1, 1, 1, 20, 18, 20, 18, 1 ],
		type : 'poly'
	};
	var type = "nowLocation";
	detailMarker = new google.maps.Marker({
		position : {
			lat : detailLat,
			lng : detailLng
		},
		map : map3,
		icon : setMarkerImageSize_Jerome(type, 30, 30),
		shape : shape,
		title : "nowLocation",
		zIndex : 10,
		draggable : false,
		optimized : false
	});
	// alert(JSON.stringify(map3));
	detailMarker.setMap(map3);
	// alert("AA");
	map3.panTo(detailLatLng, 2000);
	// alert("BB");
	map3.setZoom(11);
	// alert("CC");
}


function myLocation_Jerome(addr,ryan) {
	myLocCheck = true;
	// 주석 절대 지우지 말것! - <Jerome>
	var myAddress = addr.split("#$%^&");
	// alert(kindOfMap);
	// test용 현재위치 - <Jerome>
	var myLatLng = new google.maps.LatLng(myLat, myLng);
	origin_location = {lat: myLat, lng: myLng};
	// 기존위치에서 위치이동이 있을때에만 내위치를 다시 찍어줌.
	if(myLat!=myAddress[0]||myLng!=myAddress[1]){
		myLat = parseFloat(myAddress[0]);
		myLng = parseFloat(myAddress[1]);
		
		var shape = {
			coords : [ 1, 1, 1, 20, 18, 20, 18, 1 ],
			type : 'poly'
		};
		// alert("cc");
		// 현재 위치값 MAP setting
		var type = "nowLocation";
		if(nowMarker != "") nowMarker.setMap(null);
		nowMarker = new google.maps.Marker({
			position : {
				lat : myLat,
				lng : myLng
			},
			map : map,
			icon : setMarkerImageSize_Jerome(type, 30, 30),
			shape : shape,
			title : "nowLocation",
			zIndex : 10,
			draggable : false,
			optimized : false
		});
		nowMarker.setMap(map);
	}
	if(ryan==0){
		map.panTo(myLatLng, 2000);
		map.setZoom(13);	
		// 업종활성화 갯수체크
		var statusCnt = 0;
		$(".swipe-table").each(function(){
			var statusCheck = $(this).children().find(".swipe-image td").attr("data-status");
			if(statusCheck=="on") statusCnt++;
		});
		if(statusCnt>=1){
			Get_Store(swipe_items,"menu");
		}
	}
	
	/*
	if (state == 0) {
		if(searchMarker != "") searchMarker.setMap(null);
		nowMarker = new google.maps.Marker({
			position : {
				lat : myLat,
				lng : myLng
			},
			map : map,
			icon : setMarkerImageSize_Jerome(type, 30, 30),
			shape : shape,
			title : "nowLocation",
			zIndex : 10,
			draggable : false,
			optimized : false
		});
		nowMarker.setMap(map);
		state = 1;
		map.panTo(myLatLng, 2000);
		map.setZoom(13);
		
		// 업종활성화 갯수체크
		var statusCnt = 0;
		$(".swipe-table").each(function(){
			var statusCheck = $(this).children().find(".swipe-image td").attr("data-status");
			if(statusCheck=="on") statusCnt++;
		});
		if(statusCnt>=1){
			Get_Store(swipe_items,"menu");
		}
	} else if(state == 1) {
		nowMarker.setMap(null);
		nowMarker = "";
		state = 0;
	} else if(state == 2) {
		if(nowMarker != "") nowMarker.setMap(null);
		searchMarker = new google.maps.Marker({
			position : {
				lat : myLat,
				lng : myLng
			},
			map : map,
			icon : setMarkerImageSize_Jerome(type, 30, 30),
			shape : shape,
			title : "nowLocation",
			zIndex : 10,
			draggable : false,
			optimized : false
		});
		nowMarker.setMap(map);
		state = 3;
		map.panTo(myLatLng, 2000);
		map.setZoom(13);
	} else {
		searchMarker.setMap(null);
		searchMarker = "";
		state = 0;
	}
	*/
	
}

// setting Marker in Map - <Jerome>
function setMarkers_Jerome(map) {
	// console.log("setMarkers_Jerome 호출 성공");
	if (stores_data.length !== 0) {
		if (map != undefined || map != null) {
			clearMarker_Jerome();
			var shape = {
				coords : [ 1, 1, 1, 20, 18, 20, 18, 1 ],
				type : 'poly'
			};
			$("#contents-list").html("");
			$("#bottom-data").html("");
			
			if (Live_state == "Live On") 
			{
				for (var i = 0; i < stores_data.length; i++) 
				{
					if (stores_data[i].open == "o") 
					{
						if (parseFloat(startLat) <= parseFloat(stores_data[i].latitude)
								&& parseFloat(startLng) <= parseFloat(stores_data[i].longitude)
								&& parseFloat(endLat) >= parseFloat(stores_data[i].latitude)
								&& parseFloat(endLng) >= parseFloat(stores_data[i].longitude)) {
							var markerImage = setMarkerImage_Jerome(stores_data[i]);
							store = stores_data[i];
							var oneMarker = addMarker_Jerome(store, map, markerImage,
									shape);
							markerList_live.push(oneMarker);
							oneMarker.setMap(map);
						}
					}
				}
				
				// Selected Marker Show
				markerList_live.forEach(function(element, index, array) {
					if (selected_marker === -1)
						return;
					else {
						if (selected_marker.lng === element.position.lng()
								&& selected_marker.lat === element.position.lat()) 
						{
							markerEvenet_ChangeImage_Jerome(index, "");
						}
					}
				});
				
				
				if (markerCluster != null)
					markerCluster.clearMarkers();
				if (markerCluster_live != null)
					markerCluster_live.clearMarkers();
				var clusterOption_live = setMarkerClusterOption_live_Jerome();
				markerCluster_live = new MarkerClusterer(map, markerList_live, clusterOption_live);
				
			} else {
				
				for (var i = 0; i < stores_data.length; i++) 
				{
					
					if (parseFloat(startLat) <= parseFloat(stores_data[i].latitude)
							&& parseFloat(startLng) <= parseFloat(stores_data[i].longitude)
							&& parseFloat(endLat) >= parseFloat(stores_data[i].latitude)
							&& parseFloat(endLng) >= parseFloat(stores_data[i].longitude)) {
						var markerImage = setMarkerImage_Jerome(stores_data[i]);
						store = stores_data[i];
						var oneMarker = addMarker_Jerome(store, map, markerImage,
								shape);
						markerList.push(oneMarker);
						oneMarker.setMap(map);
					}
					
				}
				// Selected Marker Show
				markerList.forEach(function(element, index, array) {
					if (selected_marker === -1)
						return;
					else {
						if (selected_marker.lng === element.position.lng()
								&& selected_marker.lat === element.position.lat()) 
						{
							markerEvenet_ChangeImage_Jerome(index, "");
						}
					}
				});
				
				
				if (markerCluster != null)
					markerCluster.clearMarkers();
				if (markerCluster_live != null)
					markerCluster_live.clearMarkers();
				var clusterOption = setMarkerClusterOption_Jerome();
				markerCluster = new MarkerClusterer(map, markerList, clusterOption);
			}
		} else {
			 // console.log("setMarkers_Jerome 호출 실패");
		}
	} else {
		clearMarker_Jerome();
		selected_marker = -1
	}
	statusOfClickEventFunction_Jerome(map);
	 
}

// MAP 시작 / 끝 위치 (위도,경도)값 저장하기 함수 - <2018-08-10 Jerome>
function mapRangeCall_Jerome(map, origin_location, search_status) {
//	console.log("mapRangeCall_Jerome 호출 성공");
	if(EXECUTE_LOCATION!=1&&EXECUTE_LOCATION!=3){
		if(search_status == true) {
			startLat = parseFloat(37.4950603 - 0.0625);
			startLng = parseFloat(127.12225190000004 - 0.0625);
			endLat = parseFloat(37.4950603 + 0.0625);
			endLng = parseFloat(127.12225190000004 + 0.0625);
		} else {
			startLat = map.getBounds().getSouthWest().lat();
			startLng = map.getBounds().getSouthWest().lng();
			endLat = map.getBounds().getNorthEast().lat();
			endLng = map.getBounds().getNorthEast().lng();
		}
	}else{
		if(search_status == true) {
			startLat = parseFloat(origin_location.lat - 0.0625);
			startLng = parseFloat(origin_location.lng - 0.0625);
			endLat = parseFloat(origin_location.lat + 0.0625);
			endLng = parseFloat(origin_location.lng + 0.0625);
		} else {
			startLat = map.getBounds().getSouthWest().lat();
			startLng = map.getBounds().getSouthWest().lng();
			endLat = map.getBounds().getNorthEast().lat();
			endLng = map.getBounds().getNorthEast().lng();
		}
	}
//	alert(startLat);
//	alert(startLng);
//	alert(endLat);
//	alert(endLat);
//	console.log("현재 보여지는 지도 범위 저장");
}

// MAP marker 지우기 - <Jerome>
function clearMarker_Jerome() {
	clearMarkers();
	markerList = [];
	markerList_live = [];
	markerNumber = 0;
	if (markerCluster != null)	markerCluster.clearMarkers();
	if (markerCluster_live != null)	markerCluster_live.clearMarkers();
	markerCluster = null;
	markerCluster_live = null;
}
function clearMarkers() {
	setMapOnAll(null);
}
function setMapOnAll(map) {
	for (var i = 0; i < markerList.length; i++) {
		markerList[i].setMap(map);
	}
}

// MAP marker 추가하기 - <Jerome>
function addMarker_Jerome(store, map, markerImage, shape) {
	var ZZindex;
	var big_type = store.big_type;
	var sid = store.sid;
	if (store.open == "o") {
		ZZindex = 8;
	} else {
		ZZindex = 2;
	}

	var marker = new google.maps.Marker({
		position : {
			lat : parseFloat(store.latitude),
			lng : parseFloat(store.longitude)
		},
		map : map,
		icon : markerImage,
		shape : shape,
		title : store.name,
		zIndex : ZZindex,
		number : markerNumber,
		sid : sid,
		open : store.open,
		fid : store.fid,
		draggable : false,
		'status_text' : store.status_text,
		'status_text2' : store.status_text2,
		'status_time' : store.status_time,
		'mon-closetime' : store['mon-closetime'],
		'tue-closetime' : store['tue-closetime'],
		'wed-closetime' : store['wed-closetime'],
		'thu-closetime' : store['thu-closetime'],
		'fri-closetime' : store['fri-closetime'],
		'sat-closetime' : store['sat-closetime'],
		'sun-closetime' : store['sun-closetime'],
		img_0 : store.img_0,
		img_1 : store.img_1,
		img_2 : store.img_2,
		img_3 : store.img_3,
		img_4 : store.img_4,
		img_5 : store.img_5,
		img_6 : store.img_6,
		img_7 : store.img_7,
		img_8 : store.img_8,
		img_9 : store.img_9
	});

	markerNumber++;
	// 마커 클릭 이벤트 적용 - <2017-08-01 Jerome>
	marker.addListener('click', function() {
		// console.log(swipe_items);
		// console.log(searchMode);

		// var nn = map.getProjection().getVisibleRegion().nearRight;
		// var ff = map.getProjection().getVisibleRegion().farLeft;
//		clusterClickEvent = "Off";
//		mapClickEvent = "Off";
		if (selected_marker === -1) {
			selected_marker = {};
		}
		
		// 선택한 마커 정보 저장 - <2017-08-01 Jerome>
		selected_marker.idx = marker["number"];
		selected_marker.lat = marker.position.lat();
		selected_marker.lng = marker.position.lng();
		
		if(mapClickEvent == "On") {
			mapClickEvent = "Off";
		}
		
		
		
		
		
		if(clusterClickEvent != "On") {
			var checkNum = parseInt(marker["number"]);
			if (sliderTarget[0] != "") {
				$(sliderTarget[0]).html(sliderHtml[0]);
				$(sliderTarget[1]).html(sliderHtml[1]);
			}
			var firstTag = $("#bottom-list-" + sliderNumber).html();
			var changeTag = $("#bottom-list-" + checkNum).html();
			$("#bottom-list-" + sliderNumber).html(changeTag);
			$("#bottom-list-" + checkNum).html(firstTag);
			
			sliderTarget[0] = "#bottom-list-" + sliderNumber;
			sliderHtml[0] = firstTag;
			sliderTarget[1] = "#bottom-list-" + checkNum;
			sliderHtml[1] = changeTag;
			$(".bottom-list-table .bottom-list-image").css("filter","grayscale(100%)");
			$(".bottom-list-table .bottom-list-image").eq(sliderNumber).css("filter","grayscale(0%)");
		}
	
		// 선택한 마커 이미지 바꾸기 실행 - <2017-08-01 Jerome>
		if (markerClickEvent == "On") {
			// 현재 선택한 마커가 이전에 선택한 마커와 같을 경우 - <2017-08-01 Jerome>
			if (markerClick_changeList == selected_marker.idx) {
				selected_marker = -1;
				markerClick_changeList = null;
//				
//				if(swipe_items != '' && searchMode==false){
//					var get_CenterLat = map.getCenter().lat();
//				 	var get_CenterLng = map.getCenter().lng();
//				 	origin_location = {lat: get_CenterLat, lng: get_CenterLng};
//				 	mapRangeCall_Jerome(map, origin_location, searchMode);
//				 	Get_Store(swipe_items,"menu");
////				 	mapEvent_LoadMapRange_Jerome(map, origin_location, searchMode);
//					
//				} else if(searchMode==true){
//				 	Geolocation_ramNjerome(2,originLocations);
//				 	var searchData = $("#search-contents-bar").val();
//				 	mapRangeCall_Jerome(map, origin_location, searchMode);
//				 	Get_Store(searchData,"keyword");
////				 	mapEvent_LoadMapRange_Jerome(map, origin_location, searchMode);
//				}
				// console.log(clusterClickEvent);
				
				// markerEvenet_ChangeImage_Jerome(marker["number"], "");

				clusterClickEvent = "Off";
				// 마커 클릭 해제 상태 저장 - <2017-08-01 Jerome>
				markerClickEvent = "Off";
				statusOfClickEventFunction_Jerome(map);
			// 현재 선택한 마커가 이전에 선택한 마커와 다를 경우 - <2017-08-01 Jerome>
			} else {
				var selected_Center = kindOfZoomClickMarker(map.getZoom());
				map.panTo(selected_Center, 2000);

				// markerEvenet_ChangeImage_Jerome(marker["number"], "no");
				markerClick_changeList = marker["number"];
				
				

				// 마커 클릭 현재 상태 유지 - <2017-08-01 Jerome>
				markerClickEvent = "On";
				clusterClickEvent = "Off";
			 	statusOfClickEventFunction_Jerome(map);
			}

			// 마커 클릭 확인용 console - <2017-08-01 Jerome>
//			 console.log("MARKER 클릭해제");
//			 console.log("마커 클릭이벤트 상태 = " + markerClickEvent);
//			 console.log("클릭해제된 마커 이미지 url = " + marker.icon.url);

			// 마커 클릭상태가 "Off"일 경우 - <2017-08-01 Jerome>
			 // console.log(markerClickEvent);
		} else {
			// 마커 선택했을 때 마커 위치 중앙으로 변경하기 - <2017-08-01 Jerome>
			var selected_Center = kindOfZoomClickMarker(map.getZoom());
			map.panTo(selected_Center, 2000);
			// markerEvenet_ChangeImage_Jerome(marker["number"], "no");
			markerClick_changeList = marker["number"];
			
			if(clusterClickEvent == "On") {
				if(swipe_items != '' && searchMode==false){
					var get_CenterLat = map.getCenter().lat();
					var get_CenterLng = map.getCenter().lng();
					origin_location = {lat: get_CenterLat, lng: get_CenterLng};
					mapRangeCall_Jerome(map, origin_location, searchMode);
					Get_Store(swipe_items,"menu");
					mapEvent_LoadMapRange_Jerome(map, origin_location);
					markerClickEvent = "Off";
					mapClickEvent = "Off";
					clusterClickEvent = "Off";
					
				}else if(searchMode==true){
					Geolocation_ramNjerome(2,originLocations);
					var searchData = $("#search-contents-bar").val();
					mapRangeCall_Jerome(map, origin_location, searchMode);
					Get_Store(searchData,"keyword");
					mapEvent_LoadMapRange_Jerome(map, origin_location);
					markerClickEvent = "Off";
					mapClickEvent = "Off";
					clusterClickEvent = "Off";
				}
				
				setTimeout(function(){
					if(Live_state != "Live On") {
						for(var i in markerList) {
							if(marker["sid"] == markerList[i].sid) {
								var checkNum = i;
								var firstTag = $("#bottom-list-" + sliderNumber).html();
								var changeTag = $("#bottom-list-" + checkNum).html();
								$("#bottom-list-" + sliderNumber).html(changeTag);
								$("#bottom-list-" + checkNum).html(firstTag);
								sliderTarget[0] = "#bottom-list-" + sliderNumber;
								sliderHtml[0] = firstTag;
								sliderTarget[1] = "#bottom-list-" + checkNum;
								sliderHtml[1] = changeTag;
								$(".bottom-list-table .bottom-list-image").css("filter","grayscale(100%)");
								$(".bottom-list-table .bottom-list-image").eq(sliderNumber).css("filter","grayscale(0%)");
//							console.log("티많이나는거 = " + i);
								break;
							}
						}
					} else {
						for(var i in markerList_live) {
							if(marker["sid"] == markerList_live[i].sid) {
								var checkNum = i;
								var firstTag = $("#bottom-list-" + sliderNumber).html();
								var changeTag = $("#bottom-list-" + checkNum).html();
								$("#bottom-list-" + sliderNumber).html(changeTag);
								$("#bottom-list-" + checkNum).html(firstTag);
								sliderTarget[0] = "#bottom-list-" + sliderNumber;
								sliderHtml[0] = firstTag;
								sliderTarget[1] = "#bottom-list-" + checkNum;
								sliderHtml[1] = changeTag;
								$(".bottom-list-table .bottom-list-image").css("filter","grayscale(100%)");
								$(".bottom-list-table .bottom-list-image").eq(sliderNumber).css("filter","grayscale(0%)");
//							console.log("티많이나는거 = " + i);
								break;
							}
						}
					}
				},100);
			}
			// 마커 클릭 상태 저장 - <2017-08-01 Jerome>
			markerClickEvent = "On";
			clusterClickEvent = "Off";
			statusOfClickEventFunction_Jerome(map);
//			if($("#bottom-list").css('display') == "none") {
//				$("#contents").css("height", w_height * (searchMode==false?54:64) + "px");
//			 	$("#live-store").hide();
//				$("#bottom-list").show();
//			}
			// 마커 클릭 확인용 console - <2017-08-01 Jerome>
//			console.log("MARKER 클릭");
//			console.log("마커 클릭이벤트 상태 = " + markerClickEvent);
//			console.log("클릭된 마커 이미지 url = " + marker.icon.url);
		}
	});
	return marker;
}
function pad(n, width) {
	n = n + '';
	return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}

// 구글맵 작업 전용 script - <Jerome>

// Setting MAP Marker Basic Icon - <Jerome>
var mapImageBaseUrl = 'http://dmitridavinci.cafe24.com/static/img/';

var icons = {
	nowLocation : {
		icon : mapImageBaseUrl + "052.gif"
	},
	cluster : {
		icon : mapImageBaseUrl + "058-1.png"
	},
	mart : {
		icon : mapImageBaseUrl + "055.png"
	},
	foodTruck : {
		icon : mapImageBaseUrl + "055.png"
	},
	gassStation : {
		icon : mapImageBaseUrl + "055.png"
	},
	toilet : {
		icon : mapImageBaseUrl + "055.png"
	},
	cafe : {
		icon : mapImageBaseUrl + "055.png"
	},
	restaurant : {
		icon : mapImageBaseUrl + "055.png"
	},
	drugStore : {
		icon : mapImageBaseUrl + "055.png"
	},

	cluster_live : {
		icon : mapImageBaseUrl + "059-1.png"
	},
	mart_live : {
		icon : mapImageBaseUrl + "056.png"
	},
	foodTruck_live : {
		icon : mapImageBaseUrl + "056.png"
	},
	gassStation_live : {
		icon : mapImageBaseUrl + "056.png"
	},
	toilet_live : {
		icon : mapImageBaseUrl + "056.png"
	},
	cafe_live : {
		icon : mapImageBaseUrl + "056.png"
	},
	restaurant_live : {
		icon : mapImageBaseUrl + "056.png"
	},
	drugStore_live : {
		icon : mapImageBaseUrl + "056.png"
	}
};

// Setting MAP Marker Basic Cluster - <Jerome>
function setMarkerClusterOption_Jerome() {
	var clusterIcon = setMarkerImageSize_Jerome("cluster", 55, 55);
	var clusterOption = {
		// maxZoom : 16,
		zoomOnClick : false,
		clusterClick_Jerome : true,
//		gridSize : 45,
		minimumClusterSize : 2,
		styles : [ {
			width : 55,
			height : 55,
			url : clusterIcon.url,
			fontFamily : "comic sans ms",
			textSize : 17,
			textColor : "#252525",
		// anchor : clusterIcon.anchor,
		// backgroundPosition : clusterIcon.origin,
		// iconAnchor : clusterIcon.anchor
		} ]
	};

	return clusterOption;
}

// Setting MAP Marker Live Cluster - <Jerome>
function setMarkerClusterOption_live_Jerome() {
	var clusterIcon = setMarkerImageSize_Jerome("cluster_live", 55, 55);
	var clusterOption = {
		// maxZoom : 16,
		zoomOnClick : false,
		clusterClick_Jerome : true,
//		gridSize : 45,
		minimumClusterSize : 2,
		backgroundPosition : clusterIcon.origin,

		styles : [ {
			width : 55,
			height : 55,
			url : clusterIcon.url,
			fontFamily : "comic sans ms",
			textSize : 17,
			textColor : "#FFF200",
		// anchor : clusterIcon.anchor,
		// iconAnchor : clusterIcon.anchor
		} ]
	};

	return clusterOption;
}

// Setting MAP Marker Image Basic Size - <Jerome>
function setMarkerImageSize_Jerome(type, size1, size2) {
	var image = {
		url : icons[type].icon,
		size : new google.maps.Size(size1, size2),
		origin : new google.maps.Point(0, 0),
		anchor : new google.maps.Point(0, 0),
		scaledSize : new google.maps.Size(size1, size2)
	};
	return image;
}

function setMarkerImage_detail_Jerome(kindOfMenu) {
	if (kindOfMenu != undefined || kindOfMenu != null) {
		var type;
		if (kindOfMenu.big_type == "마트")
			type = "mart";
		else if (kindOfMenu.big_type == "푸드트럭")
			type = "foodTruck";
		else if (kindOfMenu.big_type == "주유소")
			type = "gassStation";
		else if (kindOfMenu.big_type == "화장실")
			type = "toilet";
		else if (kindOfMenu.big_type == "카페")
			type = "cafe";
		else if (kindOfMenu.big_type == "음식점")
			type = "restaurant";
		else if (kindOfMenu.big_type == "약국")
			type = "drugStore";
		var image = setMarkerImageSize_Jerome(type, 25, 35);
		return image;
	} else {

	}
}

// Setting MAP Marker Basic Image - <Jerome>
function setMarkerImage_Jerome(kindOfMenu) {
	if (kindOfMenu != undefined || kindOfMenu != null) {
		// // //console.log("setMarkerImage_Jerome 호출 성공");
		var type;
		// // //console.log(kindOfMenu.big_type);
		if (kindOfMenu.big_type == "마트")
			type = "mart";
		else if (kindOfMenu.big_type == "푸드트럭")
			type = "foodTruck";
		else if (kindOfMenu.big_type == "주유소")
			type = "gassStation";
		else if (kindOfMenu.big_type == "화장실")
			type = "toilet";
		else if (kindOfMenu.big_type == "카페")
			type = "cafe";
		else if (kindOfMenu.big_type == "음식점")
			type = "restaurant";
		else if (kindOfMenu.big_type == "약국")
			type = "drugStore";
		// // //console.log(type);
		if (Live_state != "Live On") {
			var image = setMarkerImageSize_Jerome(type, 25, 35);
		} else {
			var image = setMarkerImageSize_Jerome(type + "_live", 25, 35);
		}
		// // //console.log(image.url);
		return image;
	} else {
		// // //console.log("setMarkerImage_Jerome 호출 실패");
	}
}

// add Marker BOUNCE event - <2017-08-01 Jerome>
function markerEvent_Bounce_Jerome(markerIndex) {
	clickMarker = markerList[markerIndex];
	// console.log(clickMarker);
	if (clickMarker.getAnimation() != undefined
			|| clickMarker.getAnimation() != null) {
		clickMarker.setAnimation(null);
	} else {
		clickMarker.setAnimation(google.maps.Animation.BOUNCE);
	}
}
var preSelectMarker = -1;

// 핀 클릭시 이벤트 넣을곳
var listView = false;

// change Marker Image event - <2017-08-01 Jerome>
function markerEvenet_ChangeImage_Jerome(markerIndex, aaa) {
	// search_bar_hide 이게 뭔지 모르겠음. - <2017-08-01 Jerome>
	search_bar_hide("search");

	// 선택한 마커 확인용 console - <2017-08-01 Jerome>
//	console.log("마커 이미지 변경 함수 실행");
//	console.log(markerIndex);

	// 선택한 마커를 clickMarker 변수에 저장 - <2017-08-01 Jerome>
	if (Live_state == "Live On") {
		
		clickMarker = markerList_live[markerIndex];
		for (var i = 0; i < markerList_live.length; i++) {
			if (i != markerIndex) {
				markerList_live[i].setAnimation(null);
				markerList_live[i].icon.size = new google.maps.Size(25, 35);
				markerList_live[i].icon.scaledSize = new google.maps.Size(25, 35);
			}
		}
		
		
	} else {
		
		clickMarker = markerList[markerIndex];
		
		for (var i = 0; i < markerList.length; i++) {
			if (i != markerIndex) {
				markerList[i].setAnimation(null);
				markerList[i].icon.size = new google.maps.Size(25, 35);
				markerList[i].icon.scaledSize = new google.maps.Size(25, 35);
			}
		}
	}
//	console.log("clickMarker변수 값 확인");
//	console.log(clickMarker); 

	// 선택한 마커를 제외한 모든 마커의 이미지를 초기값으로 변경 - <2017-08-01 Jerome>
	

	// 선택한 마커 상황별 이미지 변경 - <2017-08-01 Jerome>
	if (clickMarker.getAnimation() != undefined || clickMarker.getAnimation() != null) 
	{
		clickMarker.setAnimation(null);
		
	} else {
		
		clickMarker.setAnimation(clickMarker.getAnimation());
//		if (clickMarker.icon.size.width == 25) 
//		{
			if (clickMarker.icon.url.includes("055.png")) 
			{
				clickMarker.icon.url = clickMarker.icon.url.replace("055.png", "055-1.png");
			} else if (clickMarker.icon.url.includes("056.png")) {
				clickMarker.icon.url = clickMarker.icon.url.replace("056.png", "056-1.png");
			}

//			clickMarker.icon.size = new google.maps.Size(35, 45);
//			clickMarker.icon.scaledSize = new google.maps.Size(35, 45);
			$("#contents").css("height", w_height * (searchMode==false?54:64) + "px");
			$("#bottom-list").show();
			$("#live-store").hide();

//		} else if (clickMarker.icon.size.width == 35) {
			
			if (clickMarker.icon.url.includes("055-1.png")) 
			{
				clickMarker.icon.url = clickMarker.icon.url.replace("055-1.png", "055.png");
			} else if (clickMarker.icon.url.includes("056-1.png")) {
				clickMarker.icon.url = clickMarker.icon.url.replace("056-1.png", "056.png");
			}
			if (aaa != "no") {
//				clickMarker.icon.size = new google.maps.Size(25, 35);
//				clickMarker.icon.scaledSize = new google.maps.Size(25, 35);
				$("#contents").css("height", w_height * (searchMode==false?80:90) + "px");
				$("#bottom-list").hide();
				$("#live-store").show();
			}
//		}
	}
}

// 검색바 숨기기
function search_bar_hide() {
	searchShow = false;
	$(".menu-item[data-type='search']").children().find(".menu-image td").css({
		"background" : "url(/static/img/_search.png)",
		"background-repeat" : "no-repeat",
		"background-size" : "auto 75%",
		"background-position" : "center bottom"
	});
	$(".menu-item[data-type='search']").children().find(".menu-text td").css({
		"color" : "#CCCCCC"
	});
}

//// collect Map Moved event $ make Markers - <Jerome> 지우지 마세요
//function mapEvent_Collected_Jerome(map) {
//	if (map != undefined || map != null) {
//		// console.log("mapEvent_Collected_Jerome 호출 성공");
//
//		/*
//		 * google.maps.event.addListener(map, 'zoom_changed', function() {
//		 * //mapEvent_ChangedZoom_Jerome(map); });
//		 */
//		// google.maps.event.addListener(map, 'dragend', function() {
//		// mapEvent_DragendMap_Jerome(map);
//		// });
//	} else {
//		// console.log("mapEvent_Collected_Jerome 호출 실패");
//	}
//}



// started Load Map event & make Markers - <Jerome>
function mapEvent_LoadMapRange_Jerome(map, origin_location, search_status) {
	if (map != undefined || map != null) {
		// console.log("mapEvent_LoadMapRange_Jerome 호출 성공");
		if(EXECUTE_LOCATION!=1&&EXECUTE_LOCATION!=3){
			if(search_status == true) {
				startLat = parseFloat(origin_location.lat - 0.07);
				startLng = parseFloat(origin_location.lng - 0.07);
				endLat = parseFloat(origin_location.lat + 0.07);
				endLng = parseFloat(origin_location.lng + 0.07);
			} else {
				startLat = map.getBounds().getSouthWest().lat();
				startLng = map.getBounds().getSouthWest().lng();
				endLat = map.getBounds().getNorthEast().lat();
				endLng = map.getBounds().getNorthEast().lng();
			}
		}else{
			if(search_status == true) {
				startLat = parseFloat(origin_location.lat - 0.07);
				startLng = parseFloat(origin_location.lng - 0.07);
				endLat = parseFloat(origin_location.lat + 0.07);
				endLng = parseFloat(origin_location.lng + 0.07);
			} else {
				startLat = map.getBounds().getSouthWest().lat();
				startLng = map.getBounds().getSouthWest().lng();
				endLat = map.getBounds().getNorthEast().lat();
				endLng = map.getBounds().getNorthEast().lng();
			}
		}
//		alert(startLat);
//		alert(startLng);
//		alert(endLat);
//		alert(endLat);
		setMarkers_Jerome(map);
		// if(centerCircle != null || centerCircle != undefined)
		// centerCircle.setCenter(map.getCenter());
	} else {
		// console.log("mapEvent_LoadMapRange_Jerome 호출 실패");
	}
}



//// changed Zoom on Map event & make Markers - <Jerome> 지우지 마세요
//function mapEvent_ChangedZoom_Jerome(map) {
//	if (map != undefined || map != null) {
//		// // //console.log("mapEvent_ChangedZoom_Jerome 호출 성공");
//		startLat = map.getBounds().getSouthWest().lat();
//		startLng = map.getBounds().getSouthWest().lng();
//		endLat = map.getBounds().getNorthEast().lat();
//		endLng = map.getBounds().getNorthEast().lng();
//		setMarkers_Jerome(map);
//	} else {
//		// // //console.log("mapEvent_ChangedZoom_Jerome 호출 실패");
//	}
//}



//// dragEnd on Map event & make Markers - <Jerome> 지우지 마세요
//function mapEvent_DragendMap_Jerome(map) {
//	if (map != undefined || map != null) {
//		// console.log("mapEvent_DragendMap_Jerome 호출 성공");
//		startLat = map.getBounds().getSouthWest().lat() - 0.01;
//		startLng = map.getBounds().getSouthWest().lng() - 0.01;
//		endLat = map.getBounds().getNorthEast().lat() + 0.01;
//		endLng = map.getBounds().getNorthEast().lng() + 0.01;
//		setMarkers_Jerome(map);
//
//		// if (centerCircle != null || centerCircle != undefined)
//		// centerCircle.setCenter(map.getCenter());
//	} else {
//		// //console.log("mapEvent_DragendMap_Jerome 호출 실패");
//	}
//}

function create_Overay_Jerome(map) {

	var citymap = {
		center : map.getCenter(),
		population : 999999999999
	};

	centerCircle = new google.maps.Circle({
		strokeColor : '#333333',
		strokeOpacity : 0.7,
		strokeWeight : 0,
		fillColor : '#333333',
		fillOpacity : 0.7,
		map : map,
		center : citymap.center,
		radius : citymap.population
	});
	// 라이브 오버레이 클릭 이벤트 - <2017-08-02 Jerome>
	centerCircle.addListener('click', function() {
		// console.log("오버레이 클릭이벤트 상태");
	});
	// if(centerCircle != null || centerCircle != undefined) //
	// //console.log(centerCircle);
	// }
	//

}

// 선택한 마커를 제외한 모든 마커의 이미지를 초기값으로 변경(선택된 마커 변경 전 모두 초기 값으로 변경) - <2017-08-01 Jerome>
function initializeMarkerImage_Jerome() {
	for (var i = 0; i < markerList.length; i++) {

		if (markerList[i].icon.url.includes("055-1.png")) 
		{
			markerList[i].icon.url.replace("055-1.png", "055.png");
		} else if (markerList[i].icon.url.includes("056-1.png")) {
			markerList[i].icon.url.replace("056-1.png", "056.png");
		}
		markerList[i].setAnimation(null);
		markerList[i].icon.size = new google.maps.Size(25, 35);
		markerList[i].icon.scaledSize = new google.maps.Size(25, 35);

		// 여기에 클러스터 삭제도 넣을거야 하하하하하하하
		// if(markerCluster != null) markerCluster.clearMarkers();
		// if(markerCluster_live != null) markerCluster_live.clearMarkers();

	}
}



function kindOfZoomClickMarker(zoomSize) {

	// 마커 선택했을 때 마커 위치 중앙으로 변경하기
	var selected_Lat;
	var selected_Lng;
	
	if(zoomSize == 7) {
		selected_Lat = selected_marker.lat - 0.8;
		selected_Lng = selected_marker.lng/* + 0.02*/;
	} else if (zoomSize == 8) {
		selected_Lat = selected_marker.lat - 0.45;
		selected_Lng = selected_marker.lng/* + 0.02*/;
	} else if (zoomSize == 9) {
		selected_Lat = selected_marker.lat - 0.2;
		selected_Lng = selected_marker.lng/* + 0.02*/;
	} else if (zoomSize == 10) {
		selected_Lat = selected_marker.lat - 0.1;
		selected_Lng = selected_marker.lng + 0.02;
	} else if (zoomSize == 11) {
		selected_Lat = selected_marker.lat - 0.05;
		selected_Lng = selected_marker.lng + 0.01;
	} else if (zoomSize == 12) {
		selected_Lat = selected_marker.lat - 0.025;
		selected_Lng = selected_marker.lng + 0.005;
	} else if (zoomSize == 13) {
		selected_Lat = selected_marker.lat - 0.015;
		selected_Lng = selected_marker.lng + 0.003;
	} else if (zoomSize == 14) {
		selected_Lat = selected_marker.lat - 0.0075;
		selected_Lng = selected_marker.lng + 0.0015;
	} else if (zoomSize == 15) {
		selected_Lat = selected_marker.lat - 0.004;
		selected_Lng = selected_marker.lng + 0.0007;
	} else if (zoomSize == 16) {
		selected_Lat = selected_marker.lat - 0.002;
		selected_Lng = selected_marker.lng + 0.00035;
	} else if (zoomSize == 17) {
		selected_Lat = selected_marker.lat - 0.001;
		selected_Lng = selected_marker.lng + 0.0002;
	} else if (zoomSize == 18) {
		selected_Lat = selected_marker.lat - 0.0005;
		selected_Lng = selected_marker.lng + 0.0001;
	} else if (zoomSize == 19) {
		selected_Lat = selected_marker.lat - 0.0003;
		selected_Lng = selected_marker.lng + 0.00005;
	}
	var selected_Center = new google.maps.LatLng(selected_Lat, selected_Lng);
	return selected_Center;
}

function kindOfZoomClickCluster(temp_cluster, zoomSize) {

	// 라이브 클러스터 선택했을 때 클러스터 위치 중앙으로 변경하기
	var selected_Lat;
	var selected_Lng;
//	console.log(temp_cluster.center_.lat());
//	console.log(temp_cluster.center_.lng());
	if(zoomSize == 7) {
		selected_Lat = temp_cluster.center_.lat() - 0.8;
		selected_Lng = temp_cluster.center_.lng();
	} else if (zoomSize == 8) {
		selected_Lat = temp_cluster.center_.lat() - 0.45;
		selected_Lng = temp_cluster.center_.lng();
	} else if (zoomSize == 9) {
		selected_Lat = temp_cluster.center_.lat() - 0.2;
		selected_Lng = temp_cluster.center_.lng();
	} else if (zoomSize == 10) {
		selected_Lat = temp_cluster.center_.lat() - 0.1;
		selected_Lng = temp_cluster.center_.lng() + 0.02;
	} else if (zoomSize == 11) {
		selected_Lat = temp_cluster.center_.lat() - 0.05;
		selected_Lng = temp_cluster.center_.lng();
	} else if (zoomSize == 12) {
		selected_Lat = temp_cluster.center_.lat() - 0.025;
		selected_Lng = temp_cluster.center_.lng();
	} else if (zoomSize == 13) {
		selected_Lat = temp_cluster.center_.lat() - 0.015;
		selected_Lng = temp_cluster.center_.lng();
	} else if (zoomSize == 14) {
		selected_Lat = temp_cluster.center_.lat() - 0.0075;
		selected_Lng = temp_cluster.center_.lng();
	} else if (zoomSize == 15) {
		selected_Lat = temp_cluster.center_.lat() - 0.004;
		selected_Lng = temp_cluster.center_.lng();
	} else if (zoomSize == 16) {
		selected_Lat = temp_cluster.center_.lat() - 0.002;
		selected_Lng = temp_cluster.center_.lng();
	} else if (zoomSize == 17) {
		selected_Lat = temp_cluster.center_.lat() - 0.001;
		selected_Lng = temp_cluster.center_.lng();
	} else if (zoomSize == 18) {
		selected_Lat = temp_cluster.center_.lat() - 0.0005;
		selected_Lng = temp_cluster.center_.lng();
	} else if (zoomSize == 19) {
		selected_Lat = temp_cluster.center_.lat() - 0.0003;
		selected_Lng = temp_cluster.center_.lng();
	}
	var selected_Center = new google.maps.LatLng(selected_Lat, selected_Lng);
	return selected_Center;
}






function liveOn_Jerome(map) {
	Live_state = "Live On";
	for (var i = 0; i < markerList.length; i++) {
//		// 마커 정보의 상태가 "o"인 경우 - <2017-08-02 Jerome>
		if(swipe_items != '' && searchMode==false){
			var get_CenterLat = map.getCenter().lat();
			var get_CenterLng = map.getCenter().lng();
			origin_location = {lat: get_CenterLat, lng: get_CenterLng};
			mapRangeCall_Jerome(map, origin_location, searchMode);
			Get_Store(swipe_items,"menu");
			mapEvent_LoadMapRange_Jerome(map, origin_location, searchMode);
		}else if(searchMode==true){
			var searchData = $("#search-contents-bar").val();
			mapRangeCall_Jerome(map, origin_location, searchMode);
			Get_Store(searchData,"keyword");
			mapEvent_LoadMapRange_Jerome(map, origin_location, searchMode);
		}
		if (markerList_live[i].open == "o") 
		{
			// console.log("1-1 o = " + markerList[i].icon.url);
			if (markerList_live[i].icon.url.includes("055.png")) 
			{
				markerList_live[i].icon.url = markerList_live[i].icon.url.replace("055.png", "056.png");

			}
			
			if (markerList_live[i].icon.url.includes("055-1.png")) 
			{
				markerList_live[i].icon.url = markerList_live[i].icon.url.replace("055-1.png", "056-1.png");
			}
			markerList_live.push(markerList_live[i]);
//			markerList[i].setMap(map);
			// console.log("1-1 o = " + markerList[i].icon.url);

		// 마커 정보의 상태가 "x"인 경우 - <2017-08-02 Jerome>
		} else {
			
			// console.log("1-2 x = " + markerList[i].icon.url + "\n" + "1-2 x = " + markerList[i].icon.size);
			
//			markerList[i].icon.size = new google.maps.Size(0, 0);
//			markerList[i].icon.scaledSize = new google.maps.Size(0, 0);
			markerList[i].setMap(null);

			// console.log("1-2 x = " + markerList[i].icon.url + "\n" + "1-2 x = " + markerList[i].icon.size);
		}
	}
	for(var kk in markerList_live) 
	{
		markerList_live[kk].setMap(map);
	}
	
	if (markerCluster != null || markerCluster != undefined) 
		markerCluster.clearMarkers();
	if (markerCluster_live != null || markerCluster_live != undefined)
		markerCluster_live.clearMarkers();
	var clusterOption_live = setMarkerClusterOption_live_Jerome();
	markerCluster_live = new MarkerClusterer(map, markerList_live, clusterOption_live);
	mapClickEvent = "Off";
	markerClickEvent = "Off";
	clusterClickEvent = "Off";
}






function liveOff_Jerome(map) {
	Live_state = "Live Off";
	// 오버레이 지우기 <2017-08-29 Jerome>
//	if (centerCircle != undefined || centerCircle != null) 
//	{
//		centerCircle.setMap(null);
//		centerCircle = null;
//	}
	selected_cluster = -1;
	// clusterClick_changeList = null;
	// clusterClickEvent = "Off";
	
	// 새로추가 <2018-08-29 Jerome>
	selected_marker = -1;
	for(var i in markerList_live) 
	{
		markerList_live[i].setMap(null);
	}
	markerList_live = [];
	if(swipe_items != '' && searchMode==false){
		var get_CenterLat = map.getCenter().lat();
		var get_CenterLng = map.getCenter().lng();
		origin_location = {lat: get_CenterLat, lng: get_CenterLng};
		mapRangeCall_Jerome(map, origin_location, searchMode);
		Get_Store(swipe_items,"menu");
		mapEvent_LoadMapRange_Jerome(map, origin_location, searchMode);
	}else if(searchMode==true){
		var searchData = $("#search-contents-bar").val();
		mapRangeCall_Jerome(map, origin_location, searchMode);
		Get_Store(searchData,"keyword");
		mapEvent_LoadMapRange_Jerome(map, origin_location, searchMode);
	}
	if (markerCluster != null || markerCluster != undefined)
		markerCluster.clearMarkers();
	if (markerCluster_live != null || markerCluster_live != undefined)
		markerCluster_live.clearMarkers();
	var clusterOption = setMarkerClusterOption_Jerome();
	markerCluster = new MarkerClusterer(map, markerList, clusterOption);
	mapClickEvent = "Off";
	markerClickEvent = "Off";
	clusterClickEvent = "Off";
}





//	현재위치 국가 확인 - <2017-09-18 Jerome>
function checkCountry_MyLocation(lat_value, lng_value, mythic) {
	var myCountry_check = "";
	var check_LatLng = {lat: lat_value, lng: lng_value};
	var geocoder_country = new google.maps.Geocoder;
	geocoder_country.geocode({
		'location' : check_LatLng
	}, function(results, status) {
		if(status == "OK") {
			for(var i=0; i<results.length; i++) {
				if(results[i].formatted_address.indexOf('대한민국') != -1) {
					myCountry_check = "seoul";
					break;
				} else {
					myCountry_check = "vancouver";
				}
			}
			return mythic(myCountry_check);
		}
	});
}









































//클릭이벤트 상황별로 MAP에 적용될 이벤트 함수 - <2017-08-02 Jerome>
function statusOfClickEventFunction_Jerome(map) {

	 // console.log("Map>> 맵 클릭이벤트 상태 = " + mapClickEvent);
	 // console.log("Map>> 마커 클릭이벤트 상태 = " + markerClickEvent);
	 // console.log("Map>> 클러스터 클릭이벤트 상태 = " + clusterClickEvent);
	 if(mapClickEvent == "On" && markerClickEvent == "On" && clusterClickEvent == "On") {
	 	// map = On
	 	// marker = On
	 	// clu = On

	 	if(markerList.length == 0 && markerList_live == 0) {
	 		$("#live-store").hide();
	 	} else {
	 		$("#contents").css("height", w_height * (searchMode==false?80:90) + "px");
			$("#live-store").show();
			$("#bottom-list").hide();

			mapClickEvent = "Off";
			markerClickEvent = "Off";
			clusterClickEvent = "Off";
	 	}


	 } else if(mapClickEvent == "On" && markerClickEvent == "On" && clusterClickEvent != "On") {
	 	// map = On
	 	// marker = On
	 	// clu = Off


	 	if(markerList.length == 0 && markerList_live == 0) {
	 		$("#live-store").hide();
	 	} else {
	 		$("#contents").css("height", w_height * (searchMode==false?80:90) + "px");
			$("#live-store").show();
			$("#bottom-list").hide();

			mapClickEvent = "Off";
			markerClickEvent = "Off";
			clusterClickEvent = "Off";
	 	}

	 } else if(mapClickEvent == "On" && markerClickEvent != "On" && clusterClickEvent == "On") {
	 	// map = On
	 	// marker = Off
	 	// clu = On


	 	if(markerList.length == 0 && markerList_live == 0) {
	 		$("#live-store").hide();
	 	} else {
	 		$("#contents").css("height", w_height * (searchMode==false?80:90) + "px");
			$("#live-store").show();
			$("#bottom-list").hide();

			mapClickEvent = "Off";
			markerClickEvent = "Off";
			clusterClickEvent = "Off";
	 	}

	 } else if(mapClickEvent == "On" && markerClickEvent != "On" && clusterClickEvent != "On") {
	 	// map = On
	 	// marker = Off
	 	// clu = Off
	 	// console.log(markerList.length);
	 	// console.log(markerList_live.length);
	 	if(markerList.length == 0 && markerList_live == 0) {
	 		$("#live-store").hide();
	 	} else {
		 	$("#contents").css("height", w_height * (searchMode==false?54:64) + "px");
		 	$("#live-store").hide();
			$("#bottom-list").show();
			mapClickEvent = "On";
			markerClickEvent = "Off";
			clusterClickEvent = "Off";
	 	}


	 } else if(mapClickEvent != "On" && markerClickEvent == "On" && clusterClickEvent == "On") {
	 	// map = Off
	 	// marker = On
	 	// clu = On
	 	// 이럴 상황은 없소
	 	if(markerList.length == 0 && markerList_live == 0) {
	 		$("#live-store").hide();
	 	} else {
	 		$("#contents").css("height", w_height * (searchMode==false?80:90) + "px");
			$("#live-store").show();
			$("#bottom-list").hide();

			mapClickEvent = "Off";
			markerClickEvent = "Off";
			clusterClickEvent = "Off";
	 	}

	 } else if(mapClickEvent != "On" && markerClickEvent == "On" && clusterClickEvent != "On") {
	 	// map = Off
	 	// marker = On
	 	// clu = Off
	 	// console.log(selected_marker);
/*	 	
	 	if(swipe_items != '' && searchMode==false){
			  var get_CenterLat = map.getCenter().lat();
			  var get_CenterLng = map.getCenter().lng();
			  origin_location = {lat: get_CenterLat, lng: get_CenterLng};
			  mapRangeCall_Jerome(map, origin_location, searchMode);
			  Get_Store(swipe_items,"menu");
//			  mapEvent_LoadMapRange_Jerome(map, origin_location, searchMode);
		  } else if(searchMode==true) {
			  Geolocation_ramNjerome(2,originLocations);
			  var searchData = $("#search-contents-bar").val();
			  mapRangeCall_Jerome(map, origin_location, searchMode);
			  Get_Store(searchData,"keyword");
//			  mapEvent_LoadMapRange_Jerome(map, origin_location, searchMode);
		  }

		  if (selected_marker === -1) {
			selected_marker = {};
		}

		var checkNum = parseInt(selected_marker.idx);
		if (sliderTarget[0] != "") {
			$(sliderTarget[0]).html(sliderHtml[0]);
			$(sliderTarget[1]).html(sliderHtml[1]);
		}
		var firstTag = $("#bottom-list-" + sliderNumber).html();
		var changeTag = $("#bottom-list-" + checkNum).html();
		$("#bottom-list-" + sliderNumber).html(changeTag);
		$("#bottom-list-" + checkNum).html(firstTag);

		sliderTarget[0] = "#bottom-list-" + sliderNumber;
		sliderHtml[0] = firstTag;
		sliderTarget[1] = "#bottom-list-" + checkNum;
		sliderHtml[1] = changeTag;
*/
	 	$("#contents").css("height", w_height * (searchMode==false?54:64) + "px");
	 	$("#live-store").hide();
		$("#bottom-list").show();
		

		mapClickEvent = "Off";
		markerClickEvent = "On";
		clusterClickEvent = "Off";

	 } else if(mapClickEvent != "On" && markerClickEvent != "On" && clusterClickEvent == "On") {
	 	// map = Off
	 	// marker = Off
	 	// clu = On
		$("#contents").css("height", w_height * (searchMode==false?54:64) + "px");
	 	$("#live-store").hide();
		$("#bottom-list").show();

		mapClickEvent = "Off";
		markerClickEvent = "Off";
		clusterClickEvent = "On";

	 } else if(mapClickEvent != "On" && markerClickEvent != "On" && clusterClickEvent != "On") {
	 	// map = Off
	 	// marker = Off
	 	// clu = Off
	 	if(markerList.length == 0 && markerList_live == 0) {
	 		$("#live-store").hide();
	 	} else {
	 		$("#contents").css("height", w_height * (searchMode==false?80:90) + "px");
			$("#live-store").show();
			$("#bottom-list").hide();

			mapClickEvent = "Off";
			markerClickEvent = "Off";
			clusterClickEvent = "Off";
	 	}

	 }

}