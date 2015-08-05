//-----------------------------------------------------------------
// Licensed Materials - Property of IBM
//
// WebSphere Commerce
//
// (C) Copyright IBM Corp. 2011, 2012 All Rights Reserved.
//
// US Government Users Restricted Rights - Use, duplication or
// disclosure restricted by GSA ADP Schedule Contract with
// IBM Corp.
//-----------------------------------------------------------------

// NLS_CHARSET=UTF-8
({
	HISTORY:"히스토리",

	//Product Description
	ERR_RESOLVING_SKU : "선택을 완료하지 않았거나 재고가 없습니다. 각 속성의 값을 제공하거나 값을 다르게 조합해 보십시오.",
	QUANTITY_INPUT_ERROR : "수량 필드의 값이 올바르지 않습니다. 값이 양의 정수인지 확인한 후 다시 시도하십시오.",
	WISHLIST_ADDED : "찜 목록에 항목이 추가되었습니다.",
	
	SHOPCART_ADDED : "장바구니에 항목이 추가되었습니다.",
	PRICE : "가격:",
	SKU : "SKU:",
	PQ_PURCHASE : "구매:",
	PQ_PRICE_X : "${0} -",
	PQ_PRICE_X_TO_Y : "${0}에서 ${1}까지 -",
	PQ_PRICE_X_OR_MORE : "${0} 이상 -",
	
	COMPARE_ITEM_EXISTS : "비교 영역에 추가하려는 상품이 이미 있습니다.",
	COMPATE_MAX_ITEMS : "최대 4개의 상품만 비교할 수 있습니다.",
	COMPAREZONE_ADDED : "항목이 비교 영역으로 추가되었습니다.",
	
	GENERICERR_MAINTEXT : "마지막 요청을 처리하는 중 상점에 문제점이 발생했습니다. 다시 시도하십시오. 문제가 지속되면 ${0}에게 문의하십시오.",
	GENERICERR_CONTACT_US : "문의",
	
	// Shopping List Messages
	DEFAULT_WISH_LIST_NAME : "찜 목록",
	LIST_CREATED : "구매 목록이 작성되었습니다.",
	LIST_EDITED : "구매 목록 이름이 변경되었습니다.",
	LIST_DELETED : "구매 목록이 삭제되었습니다.",
	ITEM_ADDED : "구매 목록에 항목이 추가되었습니다.",
	ITEM_REMOVED : "구매 목록에서 항목이 제거되었습니다.",
	ERR_NAME_EMPTY : "구매 목록의 이름을 입력하십시오.",
	ERR_NAME_TOOLONG : "구매 목록 이름이 너무 깁니다.",
	ERR_NAME_SHOPPING_LIST : "찜 목록 이름은 기본 구매 목록을 위해 예약되어 있습니다. 다른 이름을 선택하십시오.",
	ERR_NAME_DUPLICATE : "선택한 이름의 구매 목록이 이미 있습니다. 다른 이름을 선택하십시오.",
	WISHLIST_EMAIL_SENT : "이메일을 보냈습니다.",
	WISHLIST_MISSINGNAME : "이름은 필수 필드입니다. 이름 필드에 이름을 입력하고 다시 시도하십시오.",
	WISHLIST_MISSINGEMAIL : "이메일 주소는 필수 필드입니다. 찜 목록을 받을 사람의 이메일 주소를 입력하고 다시 시도하십시오.",
	WISHLIST_INVALIDEMAILFORMAT : "이메일 주소 형식이 올바르지 않습니다.",
	WISHLIST_EMPTY : "이메일을 보내기 전에 찜 목록을 작성하십시오.",
		
	// Inventory Status Messages
	INV_STATUS_RETRIEVAL_ERROR : "재고 상태 검색 중에 오류가 발생했습니다. 나중에 다시 시도하십시오. 문제가 지속되면 사이트 운영자에게 문의하십시오.",
	
	// Product Tab
	CONFIGURATION: "구성",
	
	// My Account Page Messages
	QC_UPDATE_SUCCESS : "바로 주문하기 프로파일이 업데이트되었습니다. ",
	
	// This line defines the Quantity {0} and the component name {1} of a dynamic kit.  If a kit has a component with quantity 3, it will show as: 3 x Harddrive.
	// To show the string "Harddrive : 3", simply change this line to:  {1} : {0}.
	ITEM_COMPONENT_QUANTITY_NAME: "${0} x ${1}",
	
	//Sterling Order Line Status
	ORDER_LINE_STATUS_S : "주문 운송됨",
	ORDER_LINE_STATUS_G : "주문 처리",
	ORDER_LINE_STATUS_K : "반품 연관됨",
	ORDER_LINE_STATUS_V : "부분적으로 운송됨",
	ORDER_LINE_STATUS_X : "주문 취소됨"
})
