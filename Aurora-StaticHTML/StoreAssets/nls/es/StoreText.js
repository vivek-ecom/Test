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
	HISTORY:"Historial",

	//Product Description
	ERR_RESOLVING_SKU : "Su selección está incompleta o no está en stock. Asegúrese de especificar un valor para cada atributo o considere una combinación de valores diferente.",
	QUANTITY_INPUT_ERROR : "El valor del campo Cantidad no es válido. Asegúrese de que el valor sea un entero positivo e inténtelo de nuevo.",
	WISHLIST_ADDED : "El artículo se ha añadido satisfactoriamente a la Lista de deseos.",
	
	SHOPCART_ADDED : "El artículo se ha añadido satisfactoriamente al carro de la compra.",
	PRICE : "Precio:",
	SKU : "Código de artículo:",
	PQ_PURCHASE : "Compra:",
	PQ_PRICE_X : "${0} -",
	PQ_PRICE_X_TO_Y : "${0} a ${1} -",
	PQ_PRICE_X_OR_MORE : "${0} o más -",
	
	COMPARE_ITEM_EXISTS : "El producto que intenta añadir a la zona de comparación ya existe.",
	COMPATE_MAX_ITEMS : "Sólo se pueden comparar 4 productos como máximo.",
	COMPAREZONE_ADDED : "El artículo se ha añadido satisfactoriamente a la zona de comparación.",
	
	GENERICERR_MAINTEXT : "La tienda ha tenido un problema al procesar la última petición. Inténtelo de nuevo. Si el problema persiste, ${0} y solicite ayuda.",
	GENERICERR_CONTACT_US : "contacte con nosotros",
	
	// Shopping List Messages
	DEFAULT_WISH_LIST_NAME : "Lista de deseos",
	LIST_CREATED : "La lista de la compra se ha creado satisfactoriamente.",
	LIST_EDITED : "El nombre de la lista de la compra se ha cambiado satisfactoriamente.",
	LIST_DELETED : "La lista de la compra se ha suprimido satisfactoriamente.",
	ITEM_ADDED : "El artículo se ha añadido a la lista de la compra.",
	ITEM_REMOVED : "El artículo se ha eliminado de la lista de la compra.",
	ERR_NAME_EMPTY : "Escriba un nombre para la lista de la compra.",
	ERR_NAME_TOOLONG : "El nombre de la lista de la compra es demasiado largo.",
	ERR_NAME_SHOPPING_LIST : "El nombre Lista de deseos está reservado para la lista de la compra predeterminada. Elija un nombre distinto.",
	ERR_NAME_DUPLICATE : "Ya existe una lista de la compra con el nombre que ha elegido. Por favor, elija un nombre distinto.",
	WISHLIST_EMAIL_SENT : "Su correo electrónico se ha enviado.",
	WISHLIST_MISSINGNAME : "El campo Nombre no puede estar en blanco. Escriba su nombre en el campo Nombre e inténtelo de nuevo.",
	WISHLIST_MISSINGEMAIL : "El campo de dirección de correo electrónico no puede estar en blanco. Escriba la dirección de correo electrónico de la persona a la que va a enviar su lista de deseos e inténtelo de nuevo.",
	WISHLIST_INVALIDEMAILFORMAT : "Formato no válido de dirección de correo electrónico.",
	WISHLIST_EMPTY : "Cree una lista de deseos antes de enviar un correo electrónico.",
		
	// Inventory Status Messages
	INV_STATUS_RETRIEVAL_ERROR : "Se ha producido un error al recuperar el estado del inventario. Vuelva a intentarlo más adelante. Si el problema persiste, póngase en contacto con el administrador del sitio.",
	
	// Product Tab
	CONFIGURATION: "Configuración",
	
	// My Account Page Messages
	QC_UPDATE_SUCCESS : "El perfil de caja rápida se ha actualizado satisfactoriamente",
	
	// This line defines the Quantity {0} and the component name {1} of a dynamic kit.  If a kit has a component with quantity 3, it will show as: 3 x Harddrive.
	// To show the string "Harddrive : 3", simply change this line to:  {1} : {0}.
	ITEM_COMPONENT_QUANTITY_NAME: "${0} x ${1}",
	
	//Sterling Order Line Status
	ORDER_LINE_STATUS_S : "Pedido enviado",
	ORDER_LINE_STATUS_G : "Pedido en proceso",
	ORDER_LINE_STATUS_K : "Devolución asociada",
	ORDER_LINE_STATUS_V : "Enviado parcialmente",
	ORDER_LINE_STATUS_X : "Pedido cancelado"
})
