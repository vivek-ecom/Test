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
	HISTORY:"历史",

	//Product Description
	ERR_RESOLVING_SKU : "您的选择不完整或不在库存中。请确保为每个属性均提供一个值，或者考虑值的不同组合。",
	QUANTITY_INPUT_ERROR : "“数量”字段中的值无效。确保该值是正整数并重试。",
	WISHLIST_ADDED : "已成功将商品添加至愿望清单",
	
	SHOPCART_ADDED : "已成功将商品添加至购物车。",
	PRICE : "价格：",
	SKU : "SKU：",
	PQ_PURCHASE : "购买：",
	PQ_PRICE_X : "${0} -",
	PQ_PRICE_X_TO_Y : "${0} 至 ${1} -",
	PQ_PRICE_X_OR_MORE : "${0} 或更多 -",
	
	COMPARE_ITEM_EXISTS : "您尝试添加至比较区域的产品已存在。",
	COMPATE_MAX_ITEMS : "您最多只能比较 4 种产品。",
	COMPAREZONE_ADDED : "已成功将商品添加至比较区域。",
	
	GENERICERR_MAINTEXT : "商店在处理最近的请求时遇到问题。请重试。如果问题仍然存在，${0} 获得帮助。",
	GENERICERR_CONTACT_US : "联系方式",
	
	// Shopping List Messages
	DEFAULT_WISH_LIST_NAME : "愿望清单",
	LIST_CREATED : "已成功创建购物清单。",
	LIST_EDITED : "已成功更改购物清单名称。",
	LIST_DELETED : "已成功删除购物清单。",
	ITEM_ADDED : "该商品已添加至购物清单。",
	ITEM_REMOVED : "已从购物清单中除去该商品。",
	ERR_NAME_EMPTY : "输入购物清单的名称。",
	ERR_NAME_TOOLONG : "购物清单名称太长。",
	ERR_NAME_SHOPPING_LIST : "名称“愿望清单”保留用于缺省购物清单。请选择其他名称。",
	ERR_NAME_DUPLICATE : "具有您所选名称的购物清单已存在。请选择其他名称。",
	WISHLIST_EMAIL_SENT : "您的电子邮件已发送。",
	WISHLIST_MISSINGNAME : "“姓名”字段不能为空。在“姓名”字段中输入您的姓名然后重试。",
	WISHLIST_MISSINGEMAIL : "“电子邮件地址”字段不能为空。请输入您发送愿望清单的人员的电子邮件地址，然后重试。",
	WISHLIST_INVALIDEMAILFORMAT : "无效的电子邮件地址格式。",
	WISHLIST_EMPTY : "在发送电子邮件之前，请创建愿望清单。",
		
	// Inventory Status Messages
	INV_STATUS_RETRIEVAL_ERROR : "检索库存状态时发生错误。请稍后重试。如果问题仍然存在，请与站点管理员联系。",
	
	// Product Tab
	CONFIGURATION: "配置",
	
	// My Account Page Messages
	QC_UPDATE_SUCCESS : "已成功更新快速结账概要文件！",
	
	// This line defines the Quantity {0} and the component name {1} of a dynamic kit.  If a kit has a component with quantity 3, it will show as: 3 x Harddrive.
	// To show the string "Harddrive : 3", simply change this line to:  {1} : {0}.
	ITEM_COMPONENT_QUANTITY_NAME: "${0} x ${1}",
	
	//Sterling Order Line Status
	ORDER_LINE_STATUS_S : "订单已装运",
	ORDER_LINE_STATUS_G : "正在处理订单",
	ORDER_LINE_STATUS_K : "退货已关联",
	ORDER_LINE_STATUS_V : "已部分装运",
	ORDER_LINE_STATUS_X : "订单已取消"
})
