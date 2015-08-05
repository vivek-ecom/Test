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
	HISTORY:"履歴",

	//Product Description
	ERR_RESOLVING_SKU : "選択が不完全であるか、在庫がありません。 各属性に値を確実に指定するか、値の組み合わせを変えることをご考慮ください。",
	QUANTITY_INPUT_ERROR : "「数量」フィールドの値が無効です。 値が正の整数であることを確認してから、もう一度やり直してください",
	WISHLIST_ADDED : "アイテムは正常に買い物候補リストに追加されました。",
	
	SHOPCART_ADDED : "アイテムは正常にショッピング・カートに追加されました。",
	PRICE : "価格:",
	SKU : "SKU:",
	PQ_PURCHASE : "購入:",
	PQ_PRICE_X : "${0} -",
	PQ_PRICE_X_TO_Y : "${0} から ${1} -",
	PQ_PRICE_X_OR_MORE : "${0} 以上 -",
	
	COMPARE_ITEM_EXISTS : "比較ゾーンに追加しようとしている商品は既に存在します。",
	COMPATE_MAX_ITEMS : "比較できる商品は 4 つまでです。",
	COMPAREZONE_ADDED : "アイテムは正常に比較ゾーンに追加されました。",
	
	GENERICERR_MAINTEXT : "最後のご要求を処理中にストアは問題を検出しました。 もう一度やり直してください。 もし問題が続く場合は ${0} の支援をご利用ください。",
	GENERICERR_CONTACT_US : "問い合わせ先",
	
	// Shopping List Messages
	DEFAULT_WISH_LIST_NAME : "買い物候補リスト",
	LIST_CREATED : "ショッピング・リストは正常に作成されました。",
	LIST_EDITED : "ショッピング・リスト名は正常に変更されました。",
	LIST_DELETED : "ショッピング・リストは正常に削除されました。",
	ITEM_ADDED : "アイテムがショッピング・リストに追加されました。",
	ITEM_REMOVED : "アイテムがショッピング・リストから除去されました。",
	ERR_NAME_EMPTY : "ショッピング・リストの名前を入力してください。",
	ERR_NAME_TOOLONG : "ショッピング・リストの名前が長すぎます。",
	ERR_NAME_SHOPPING_LIST : "買い物候補リストという名前はデフォルト・ショッピング・リスト用に予約されています。別の名前を選択してください。",
	ERR_NAME_DUPLICATE : "選択された名前のショッピング・リストは既に存在します。別の名前を選択してください。",
	WISHLIST_EMAIL_SENT : "E メールが送信されました。",
	WISHLIST_MISSINGNAME : "「名前」フィールドをブランクにすることはできません。 「名前」フィールドに名前を入力し、やり直してください。",
	WISHLIST_MISSINGEMAIL : "「E メール・アドレス」フィールドをブランクにすることはできません。 買い物候補リストを送信する相手の E メール・アドレスを入力し、やり直してください。",
	WISHLIST_INVALIDEMAILFORMAT : "E メール・アドレス形式が無効です。",
	WISHLIST_EMPTY : "E メールを送信する前に、買い物候補リストを作成してください。",
		
	// Inventory Status Messages
	INV_STATUS_RETRIEVAL_ERROR : "在庫状況の取得中にエラーが発生しました。 後でもう一度やり直してください。 問題が解決しない場合は、サイトの管理者に連絡してください。",
	
	// Product Tab
	CONFIGURATION: "構成",
	
	// My Account Page Messages
	QC_UPDATE_SUCCESS : "クイック・チェックアウト・プロファイルが正常に更新されました。",
	
	// This line defines the Quantity {0} and the component name {1} of a dynamic kit.  If a kit has a component with quantity 3, it will show as: 3 x Harddrive.
	// To show the string "Harddrive : 3", simply change this line to:  {1} : {0}.
	ITEM_COMPONENT_QUANTITY_NAME: "${0} x ${1}",
	
	//Sterling Order Line Status
	ORDER_LINE_STATUS_S : "オーダー配送済み",
	ORDER_LINE_STATUS_G : "オーダー処理",
	ORDER_LINE_STATUS_K : "関連付けられた返品",
	ORDER_LINE_STATUS_V : "一部配送済み",
	ORDER_LINE_STATUS_X : "キャンセルされたオーダー"
})
