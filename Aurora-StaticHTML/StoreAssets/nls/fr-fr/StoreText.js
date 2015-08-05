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
	HISTORY:"Historique",

	//Product Description
	ERR_RESOLVING_SKU : "Votre sélection est incomplète ou elle n'est pas en stock. Veillez à indiquer une valeur pour chaque attribut ou envisagez une autre combinaison de valeurs.",
	QUANTITY_INPUT_ERROR : "La valeur indiquée dans la zone Quantité est incorrecte. Vérifiez que la valeur est un entier positif et essayez à nouveau.",
	WISHLIST_ADDED : "L'article a été ajouté à votre liste de présélection.",
	
	SHOPCART_ADDED : "L'article a été ajouté à votre panier.",
	PRICE : "Prix :",
	SKU : "SKU :",
	PQ_PURCHASE : "Achats :",
	PQ_PRICE_X : "${0} -",
	PQ_PRICE_X_TO_Y : "${0} à ${1} -",
	PQ_PRICE_X_OR_MORE : "${0} ou plus -",
	
	COMPARE_ITEM_EXISTS : "Le produit que vous tentez d'ajouter à la zone de comparaison existe déjà.",
	COMPATE_MAX_ITEMS : "Vous pouvez comparer jusqu'à 4 produits.",
	COMPAREZONE_ADDED : "L'article a été ajouté à la zone de comparaison.",
	
	GENERICERR_MAINTEXT : "Un incident s'est produit sur le magasin lors du traitement de la dernière requête. Faites une nouvelle tentative. Si l'incident persiste, ${0} pour une assistance.",
	GENERICERR_CONTACT_US : "contactez-nous",
	
	// Shopping List Messages
	DEFAULT_WISH_LIST_NAME : "Liste de présélection",
	LIST_CREATED : "La liste d'achats a été créée.",
	LIST_EDITED : "Le nom de la liste d'achats a été modifié.",
	LIST_DELETED : "La liste d'achats a été supprimée.",
	ITEM_ADDED : "L'article a été ajouté à votre liste d'achats.",
	ITEM_REMOVED : "L'article a été retiré de votre liste d'achats.",
	ERR_NAME_EMPTY : "Entrez un nom pour votre liste d'achats.",
	ERR_NAME_TOOLONG : "Nom de liste d'achats trop long.",
	ERR_NAME_SHOPPING_LIST : "Le nom de liste de présélection est réservé à la liste d'achats par défaut. Choisissez un autre nom.",
	ERR_NAME_DUPLICATE : "Une liste d'achats existe déjà avec le nom que vous avez choisi. Choisissez un nom différent.",
	WISHLIST_EMAIL_SENT : "Votre courrier électronique a été envoyé.",
	WISHLIST_MISSINGNAME : "La zone du nom doit être renseignée. Indiquez votre nom dans la zone Nom puis faites une nouvelle tentative.",
	WISHLIST_MISSINGEMAIL : "La zone d'adresse électronique doit être renseignée. Indiquez l'adresse électronique de la personne à laquelle est destinée votre liste de présélection puis faites une nouvelle tentative.",
	WISHLIST_INVALIDEMAILFORMAT : "Format d'adresse électronique incorrect.",
	WISHLIST_EMPTY : "Créez une liste de présélection avant d'envoyer un courrier électronique.",
		
	// Inventory Status Messages
	INV_STATUS_RETRIEVAL_ERROR : "Une erreur s'est produite lors de l'extraction du statut du stock. Essayez ultérieurement. Si l'incident se produit de nouveau, contactez votre administrateur de site.",
	
	// Product Tab
	CONFIGURATION: "Configuration",
	
	// My Account Page Messages
	QC_UPDATE_SUCCESS : "Le profil de paiement rapide a été mis à jour !",
	
	// This line defines the Quantity {0} and the component name {1} of a dynamic kit.  If a kit has a component with quantity 3, it will show as: 3 x Harddrive.
	// To show the string "Harddrive : 3", simply change this line to:  {1} : {0}.
	ITEM_COMPONENT_QUANTITY_NAME: "${0} x ${1}",
	
	//Sterling Order Line Status
	ORDER_LINE_STATUS_S : "Commande envoyée",
	ORDER_LINE_STATUS_G : "Traitement de la commande",
	ORDER_LINE_STATUS_K : "Retour associé",
	ORDER_LINE_STATUS_V : "Partiellement expédié",
	ORDER_LINE_STATUS_X : "Commande annulée"
})
