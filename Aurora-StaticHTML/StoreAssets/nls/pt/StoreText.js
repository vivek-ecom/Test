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
	HISTORY:"Histórico",

	//Product Description
	ERR_RESOLVING_SKU : "Sua seleção está incompleta ou não se encontra em estoque. Certifique-se de fornecer um valor para cada atributo ou considerar uma combinação diferente de valores.",
	QUANTITY_INPUT_ERROR : "O valor no campo Quantidade é inválido. Certifique-se de que o valor seja um inteiro positivo e tente novamente.",
	WISHLIST_ADDED : "O item foi incluído com êxito em sua Lista de Desejos",
	
	SHOPCART_ADDED : "O item foi incluído com êxito no carrinho de compras.",
	PRICE : "Preço:",
	SKU : "SKU:",
	PQ_PURCHASE : "Compra:",
	PQ_PRICE_X : "${0} -",
	PQ_PRICE_X_TO_Y : "${0} a ${1} -",
	PQ_PRICE_X_OR_MORE : "${0} ou mais -",
	
	COMPARE_ITEM_EXISTS : "O produto que você está tentando incluir na zona de comparação já existe.",
	COMPATE_MAX_ITEMS : "É possível comparar até 4 produtos apenas.",
	COMPAREZONE_ADDED : "O Item foi incluído com êxito na zona de comparação.",
	
	GENERICERR_MAINTEXT : "A loja encontrou um problema ao processar a última solicitação. Tente novamente. Se o problema persistir, ${0} para assistência.",
	GENERICERR_CONTACT_US : "fale conosco",
	
	// Shopping List Messages
	DEFAULT_WISH_LIST_NAME : "Lista de Desejos",
	LIST_CREATED : "Lista de compras criada com êxito.",
	LIST_EDITED : "Nome da lista de compras alterado com êxito.",
	LIST_DELETED : "Lista de compras excluída com êxito.",
	ITEM_ADDED : "O item foi incluído na sua lista de compras.",
	ITEM_REMOVED : "O item foi removido da lista de compras.",
	ERR_NAME_EMPTY : "Digite um nome para sua lista de compras.",
	ERR_NAME_TOOLONG : "O nome da lista de compras é muito longo.",
	ERR_NAME_SHOPPING_LIST : "O nome Lista de Desejos é reservado para lista de compras padrão. Escolha um nome diferente.",
	ERR_NAME_DUPLICATE : "Uma lista de compras já existe com o nome escolhido. Escolha um nome diferente.",
	WISHLIST_EMAIL_SENT : "Seu e-mail foi enviado.",
	WISHLIST_MISSINGNAME : "O campo Nome não pode ficar em branco. Digite seu nome no campo Nome e tente novamente.",
	WISHLIST_MISSINGEMAIL : "O campo Endereço de e-mail não pode ficar em branco. Digite o endereço de e-mail da pessoa para quem você está enviando a lista de desejos e tente novamente.",
	WISHLIST_INVALIDEMAILFORMAT : "Formato de endereço de e-mail inválido.",
	WISHLIST_EMPTY : "Crie uma lista de desejos antes de enviar um e-mail.",
		
	// Inventory Status Messages
	INV_STATUS_RETRIEVAL_ERROR : "Ocorreu um erro ao recuperar o status do inventário. Tente novamente mais tarde. Se o problema persistir, entre em contato com o administrador do seu site.",
	
	// Product Tab
	CONFIGURATION: "Configuração,",
	
	// My Account Page Messages
	QC_UPDATE_SUCCESS : "Perfil de registro de saída rápido atualizado com sucesso!",
	
	// This line defines the Quantity {0} and the component name {1} of a dynamic kit.  If a kit has a component with quantity 3, it will show as: 3 x Harddrive.
	// To show the string "Harddrive : 3", simply change this line to:  {1} : {0}.
	ITEM_COMPONENT_QUANTITY_NAME: "${0} x ${1}",
	
	//Sterling Order Line Status
	ORDER_LINE_STATUS_S : "Pedido Enviado",
	ORDER_LINE_STATUS_G : "Processamento de Pedido",
	ORDER_LINE_STATUS_K : "Devolução Associada",
	ORDER_LINE_STATUS_V : "Parcialmente Enviado",
	ORDER_LINE_STATUS_X : "Pedido Cancelado"
})
