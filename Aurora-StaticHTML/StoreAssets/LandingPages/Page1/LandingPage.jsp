<!DOCTYPE html>

<%--
 =================================================================
  Licensed Materials - Property of IBM

  WebSphere Commerce

  (C) Copyright IBM Corp. 2012 All Rights Reserved.

  US Government Users Restricted Rights - Use, duplication or
  disclosure restricted by GSA ADP Schedule Contract with
  IBM Corp.
 =================================================================
--%>

<%@include file="../../Common/EnvironmentSetup.jspf" %>
<%@include file="../../Common/nocache.jspf" %>

<!-- Landing Page Constants -->
<c:set var="attribute_image1" value="off-timer.png"/>
<c:set var="attribute_image2" value="power-off.png"/>
<c:set var="attribute_image3" value="pause-n-serve.png"/>
<c:set var="attribute_image4" value="grinder.png"/>
<fmt:message var="attribute_name1" key="LP_COFFEE_TIMER" />
<fmt:message var="attribute_name2" key="LP_COFFEE_AUTO_OFF" />
<fmt:message var="attribute_name3" key="LP_COFFEE_PAUSE_N_SERVE" />
<fmt:message var="attribute_name4" key="LP_COFFEE_GRINDER" />

<c:set var="basePath" value="${env_schemeToUse}://${pageContext.request.serverName}${jspStoreImgDir}LandingPages/Page1/" />

<fmt:message var="departmentName" key="LP_HOME_AND_FURNISHING" />
<fmt:message var="categoryName" key="LP_APPLIANCES" />
<fmt:message var="categoryTitle" key="LP_COFFEE_TITLE" />

<!-- Obtain the categoryId.  This can be hardcoded into the landing page or passed as a categoryId URL parameter, instead of from a name lookup -->
<%-- Get the category hierarchy upto 2 levels --%>
	
<wcf:getData type="com.ibm.commerce.catalog.facade.datatypes.CatalogNavigationViewType" var="catalog" 
	expressionBuilder="getCatalogNavigationCatalogGroupViewByCatalogId">
	<wcf:contextData name="storeId" data="${storeId}" />		
</wcf:getData>

<c:forEach var="department" items="${catalog.catalogGroupView}" varStatus="counter">
	<c:if test="${department.name == departmentName}">
		<wcf:getData type="com.ibm.commerce.catalog.facade.datatypes.CatalogNavigationViewType" var="subCategories" 
			expressionBuilder="getCatalogNavigationCatalogGroupViewByParentCatalogGroup">
			<wcf:param name="parentCatalogGroupId" value="${department.uniqueID}" />
			<wcf:contextData name="storeId" data="${storeId}" />															
		</wcf:getData>
		<c:forEach var="subCategory" items="${subCategories.catalogGroupView}">
			<c:if test="${subCategory.name == categoryName}">
				<c:set var="landingPageCategoryId" value="${subCategory.uniqueID}"/>
			</c:if>
		</c:forEach>
	</c:if>
</c:forEach>

<wcf:getData type="com.ibm.commerce.catalog.facade.datatypes.CatalogNavigationViewType" var="catalogNavigationView" 
	expressionBuilder="getCatalogNavigationView" scope="request" varShowVerb="showCatalogNavigationView" 
	maxItems="1" recordSetStartNumber="0" scope="request">
	<wcf:param name="searchProfile" value="IBM_findCatalogEntryByNameAndShortDescription" />
	<wcf:param name="searchTerm" value="" />
	<!-- 
		See SearchSetup.jspf for an explanation of the search type and its possible
		values.
	-->
	<wcf:param name="searchType" value="1000" />
	<wcf:param name="metaData" value="" />
	<wcf:param name="orderBy" value="" />
	<wcf:param name="facet" value="" />
	<wcf:param name="categoryId" value="${landingPageCategoryId}" />
	<wcf:param name="filterTerm" value="" />
	<wcf:param name="filterType" value="" />
	<wcf:param name="filterFacet" value="" />
	<wcf:param name="manufacturer" value="" />
	<wcf:param name="minPrice" value="" />
	<wcf:param name="maxPrice" value="" />
	<wcf:contextData name="storeId" data="${storeId}" />
	<wcf:contextData name="catalogId" data="${catalogId}" />
</wcf:getData>

<c:set var="globalfacets" value="${catalogNavigationView.facetView}" scope="request"/>

<html xmlns:wairole="http://www.w3.org/2005/01/wai-rdf/GUIRoleTaxonomy#"
xmlns:waistate="http://www.w3.org/2005/07/aaa" lang="${shortLocale}" xml:lang="${shortLocale}">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title><c:out value="${categoryTitle}" /></title>
		<!--Main Stylesheet for browser -->
		<link rel="stylesheet" href="${jspStoreImgDir}${env_vfileStylesheet}" type="text/css" media="screen"/>
		<!-- Style sheet for print -->
		<link rel="stylesheet" href="${jspStoreImgDir}${env_vfileStylesheetprint}" type="text/css" media="print"/>
		
		<!-- Include script files -->
		<script type="text/javascript" src="${dojoFile}" djConfig="${dojoConfigParams}"></script>
		<%@include file="../../Common/CommonJSToInclude.jspf" %>
		<script type="text/javascript" src="${jsAssetsDir}javascript/StoreCommonUtilities.js"></script>
		<script type="text/javascript" src="${jsAssetsDir}javascript/Widgets/Search.js"></script>
		<script type="text/javascript" src="${jsAssetsDir}javascript/CommonContextsDeclarations.js"></script>
		<script type="text/javascript" src="${jsAssetsDir}javascript/CommonControllersDeclaration.js"></script>
		<script type="text/javascript" src="${jsAssetsDir}javascript/Widgets/ShoppingList/ShoppingList.js"></script>
		<script type="text/javascript" src="${jsAssetsDir}javascript/Widgets/ShoppingList/ShoppingListServicesDeclaration.js"></script>
		<script type="text/javascript" src="${jsAssetsDir}javascript/Common/ShoppingActionsServicesDeclaration.js"></script>
		<script type="text/javascript" src="${jsAssetsDir}javascript/Common/ShoppingActions.js"></script>
		<script type="text/javascript" src="${jsAssetsDir}javascript/Widgets/MiniShopCartDisplay/MiniShopCartDisplay.js"></script>
		<script type="text/javascript" src="${jsAssetsDir}javascript/Widgets/Department/Department.js"></script>
		<script type="text/javascript" src="${jsAssetsDir}javascript/Widgets/QuickInfo/QuickInfo.js"></script>
		<script type="text/javascript">
			dojo.addOnLoad(function() { 
				shoppingActionsJS.setCommonParameters('${langId}','${storeId}','${catalogId}','${userType}','${env_CurrencySymbolToFormat}');
				shoppingActionsServicesDeclarationJS.setCommonParameters('${langId}','${storeId}','${catalogId}');
				});
		</script>
		<base href="${basePath}"/>
	</head>
		
	<body role="document">
		
		<%-- This file includes the progressBar mark-up and success/error message display markup --%>
		<%@ include file="../../Common/CommonJSPFToInclude.jspf"%>
		<%@ include file="../../Widgets/QuickInfo/QuickInfoPopup.jspf" %>
		<%@ include file="../../Widgets/ShoppingList/ItemAddedPopup.jspf" %>
		
		<!-- Begin Page -->
		<div id="page">
		
			<!-- Start Header -->
			<div class="header_wrapper_position" id="headerWidget">
				<%out.flush();%>
					<c:import url = "${env_jspStoreDir}Widgets/Header/Header.jsp" />
				<%out.flush();%>
			</div>
			<!-- End Header -->
			
			<!--Start Page Content-->
			<div class="content_wrapper_position">
				<div class="content_wrapper">
					<!--For border customization -->
					<div class="content_top">
						<div class="left_border"></div>
						<div class="middle"></div>
						<div class="right_border"></div>
					</div>
					<!-- Main Content Area -->
					<div class="content_left_shadow">
						<div class="content_right_shadow">				
							<div class="main_content">
								<!-- Start Main Content -->
								
								<!-- Start Double E-Spot Container -->
								<div class="widget_double_espot_container_position">
									<div class="widget_double_espot_container">
										<c:choose>
											<c:when test="${env_fetchMarketingDetailsOnLoad}">
												<div dojoType="wc.widget.RefreshArea" id="DoubleContentAreaESpot_Widget" controllerId="DoubleContentAreaESpot_Controller" role="wairole:region" waistate:live="polite" waistate:atomic="false" waistate:relevant="all">
												</div>
											</c:when>
											<c:otherwise>
												<%out.flush();%>
												<c:import url="${env_jspStoreDir}Widgets/ESpot/ContentRecommendation/ContentRecommendation.jsp">
													<c:param name="emsName" value="CatalogBanner_Content" />
													<c:param name="numberContentPerRow" value="2" />
													<c:param name="catalogId" value="${catalogId}" />
												</c:import>
												<%out.flush();%>
											</c:otherwise>
										</c:choose>
									</div>
								</div>
								<!-- End Double E-Spot Container --->
								
								
								<!-- Content - Full Width Container -->
								<div class="container_full_width container_margin_5px">

									<!--Searchlanding Video Widget -->
									<div class="widget_searchlanding_video_position">
										<div class="widget_searchlanding_video" tabindex="0" title="<fmt:message key='LP_COFFEE_VIDEO_ACCE_TEXT'/>">
											<!-- Android 2.2+ fallback to Flash -/->
											<video controls poster="media/${CommandContext.locale}/main_934_392.jpg" >
												<source src="media/${CommandContext.locale}/coffee_ad.mp4" type="video/mp4" />
											</video> -->
											<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" width="934" height="392" id="coffee_ad_player" align="middle">
												<param name="movie" value="media/${CommandContext.locale}/coffee_ad_player.swf" />
												<param name="quality" value="best" />
												<param name="bgcolor" value="#ffffff" />
												<param name="play" value="false" />
												<param name="loop" value="false" />
												<param name="wmode" value="transparent" />
												<param name="scale" value="showall" />
												<param name="menu" value="true" />
												<param name="devicefont" value="false" />
												<param name="salign" value="" />
												<param name="allowScriptAccess" value="sameDomain" />
												<!--[if !IE]>-->
												<object type="application/x-shockwave-flash" data="media/${CommandContext.locale}/coffee_ad_player.swf" width="934" height="392" tabindex="-1">
													<param name="movie" value="media/${CommandContext.locale}/coffee_ad_player.swf" />
													<param name="quality" value="best" />
													<param name="bgcolor" value="#ffffff" />
													<param name="play" value="false" />
													<param name="loop" value="false" />
													<param name="wmode" value="transparent" />
													<param name="scale" value="showall" />
													<param name="menu" value="true" />
													<param name="devicefont" value="false" />
													<param name="salign" value="" />
													<param name="allowScriptAccess" value="sameDomain" />
												<!--<![endif]-->
													<a href="http://www.adobe.com/go/getflash" title="<fmt:message key="GET_ADOBE_FLASH_PLAYER" />">
														<img src="http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif" alt="<fmt:message key="GET_ADOBE_FLASH_PLAYER" />" />
													</a>
												<!--[if !IE]>-->
												</object>
												<!--<![endif]-->
											</object>
										</div>
									</div>
									<!--End Searchlanding Video Widget -->
									
									<!-- Searchlanding Brands -->
									<div class="widget_carousel_position container_margin_5px">
										<div class="widget_carousel carousel_searchlanding">
											
											<div class="header"><fmt:message key="LP_SHOP_BY_BRANDS" /></div>
											
											<c:if test="${!empty landingPageCategoryId}">
												<c:forEach var="facetField" items="${globalfacets}">
													<c:if test="${facetField.value eq 'mfName_ntk_cs'}">
														<c:forEach var="item" items="${facetField.entry}">
															<c:choose>
																<c:when test='${item.label == "Sharpson"}'>
																	<c:set var="brandFilename" value="sharpson.png"/>
																</c:when>
																<c:when test='${item.label == "Enzi"}'>
																	<c:set var="brandFilename" value="enzi.png"/>
																</c:when>
																<c:when test='${item.label == "AromaStar"}'>
																	<c:set var="brandFilename" value="aromastar.png"/>
																</c:when>
																<c:when test='${item.label == "Kitchen\'s Best"}'>
																	<c:set var="brandFilename" value="kitchenbest.png"/>
																</c:when>
																<c:otherwise>
																	<c:set var="brandFilename" value=""/>
																</c:otherwise>
															</c:choose>
															
															<c:if test="${not empty brandFilename}">
																<wcf:url var="brandURL" value="SearchDisplay">
																	<wcf:param name="storeId" value="${storeId}"/>
																	<wcf:param name="catalogId" value="${catalogId}"/>
																	<wcf:param name="langId" value="${langId}"/>
																	<wcf:param name="sType" value="SimpleSearch"/>
																	<wcf:param name="manufacturer" value="${item.label}"/>
																	<wcf:param name="categoryId" value="${landingPageCategoryId}"/>
																	<wcf:param name="searchType" value="1000"/>
																</wcf:url>
				
																<div class="product">
																	<div class="product_image">
																		<a href="${brandURL}" title="${item.label}"><img src="${basePath}images/brands/${brandFilename}" alt="${item.label}"></a>
																	</div>
																</div>
															</c:if>
														</c:forEach>
													</c:if>
												</c:forEach>
											</c:if>

										</div>
										<div class="clear_float"></div>
									</div>
									<!-- Searchlanding Brands -->
									
									
									<!-- Searchlanding Style -->
									<div class="widget_carousel_position container_margin_5px">
										<div class="widget_carousel carousel_searchlanding">
											
											<div class="header"><fmt:message key="LP_SHOP_BY_FEATURES" /></div>
											
											<c:if test="${!empty landingPageCategoryId}">
												<c:forEach var="i" begin="1" end="4">
													<c:choose>
														<c:when test="${i == 1}">
															<c:set var="imageFilename" value="${attribute_image1}"/>
															<c:set var="attributeName" value="${attribute_name1}"/>
														</c:when>
														<c:when test="${i == 2}">
															<c:set var="imageFilename" value="${attribute_image2}"/>
															<c:set var="attributeName" value="${attribute_name2}"/>
														</c:when>
														<c:when test="${i == 3}">
															<c:set var="imageFilename" value="${attribute_image3}"/>
															<c:set var="attributeName" value="${attribute_name3}"/>
														</c:when>
														<c:when test="${i == 4}">
															<c:set var="imageFilename" value="${attribute_image4}"/>
															<c:set var="attributeName" value="${attribute_name4}"/>
														</c:when>
													</c:choose>
	
													<wcf:url var="attributeSearchURL" value="SearchDisplay">
														<wcf:param name="storeId" value="${storeId}"/>
														<wcf:param name="catalogId" value="${catalogId}"/>
														<wcf:param name="langId" value="${langId}"/>
														<wcf:param name="sType" value="SimpleSearch"/>
														<wcf:param name="categoryId" value="${landingPageCategoryId}"/>
														<wcf:param name="searchTerm" value="${attributeName}"/>
														<wcf:param name="searchType" value="1000"/>
													</wcf:url>
													<div class="product">
														<div class="product_image">
															<a id="featureLink_${i}" href="${attributeSearchURL}" title="<c:out value="${attributeName}"/>">
																<img src="${basePath}images/features/${imageFilename}" alt="<c:out value="${attributeName}"/>" />
															</a>
														</div>
														<a id="featureLinkDesc_${i}" href="${attributeSearchURL}" class="description"><c:out value="${attributeName}"/></a>
													</div>
													
												</c:forEach>
											</c:if>	
											
										</div>
										<div class="clear_float"></div>
									</div>
									<!-- End Searchlanding Style -->
									
									<div class="clear_float"></div>
									
									<div class="widget_carousel_position container_margin_5px">
										<c:choose>
											<c:when test="${env_fetchMarketingDetailsOnLoad}">
												<div dojoType="wc.widget.RefreshArea" id="ScrollableESpot_Widget" controllerId="ScrollableESpot_Controller" role="wairole:region" waistate:live="polite" waistate:atomic="false" waistate:relevant="all">
												</div>
											</c:when>
											<c:otherwise>
												<%out.flush();%>
												<fmt:message var="espotTitle" key="LP_COFFEE_CLEARANCE" />
												<c:import url="${env_jspStoreDir}Widgets/ESpot/ProductRecommendation/ProductRecommendation.jsp">
													<c:param name="emsName" value="SeachLandingClearance"/>
													<c:param name="pageView" value="miniGrid"/>
													<c:param name="espotTitle" value="${espotTitle}"/>
													<c:param name="background" value="none"/>
													<c:param name="align" value="scroll"/>
												</c:import>
												<%out.flush();%>
											</c:otherwise>
										</c:choose>
									</div>
									
									<div class="clear_float"></div>
									
								</div>
								<!-- End Content - Full Width Container -->
								
								<!-- End Main Content -->
							</div>
						</div>				
					</div>
					<!--For border customization -->
					<div class="content_bottom">
						<div class="left_border"></div>
						<div class="middle"></div>
						<div class="right_border"></div>
					</div>
				</div>
			</div>
			<!--End Page Content-->
			
			<!--Start Footer Content-->
			<div class="footer_wrapper_position">
				<%out.flush();%>
					<c:import url = "${env_jspStoreDir}Widgets/Footer/Footer.jsp" />
				<%out.flush();%>
			</div>
			<!--End Footer Content-->
			
			<!--Start: Contents after page load-->
			<c:if test="${env_fetchMarketingDetailsOnLoad}">
			<%out.flush();%>
				<c:import url = "${env_jspStoreDir}Widgets/PageLoadContent/PageLoadContent.jsp">
					<c:param name="doubleContentAreaESpot" value="true"/>
				</c:import>
			<%out.flush();%>
			</c:if>
			<!--End: Contents after page load-->
			
		</div>
	
	
	</body>
	
	
</html>