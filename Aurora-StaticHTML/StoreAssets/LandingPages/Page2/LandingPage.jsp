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
<c:set var="style_image1" value="dress_0_160.png"/>
<c:set var="style_image2" value="dress_1_160.png"/>
<c:set var="style_image3" value="dress_2_160.png"/>
<c:set var="style_image4" value="dress_3_160.png"/>
<c:set var="style_image5" value="dress_4_160.png"/>
<c:set var="style_image6" value="dress_5_160.png"/>
<c:set var="style_image7" value="dress_6_160.png"/>
<c:set var="style_image8" value="dress_7_160.png"/>
<c:set var="style_image9" value="dress_8_160.png"/>
<c:set var="style_image10" value="dress_9_160.png"/>

<fmt:message var="style_name1" key="LP_WOMEN_STYLE_SUNDRESS" />
<fmt:message var="style_name2" key="LP_WOMEN_STYLE_SLIP_DRESS" />
<fmt:message var="style_name3" key="LP_WOMEN_STYLE_LITTLE_BLACK_DRESS" />
<fmt:message var="style_name4" key="LP_WOMEN_STYLE_COCKTAIL_DRESS" />
<fmt:message var="style_name5" key="LP_WOMEN_STYLE_MAXI_DRESS" />
<fmt:message var="style_name6" key="LP_WOMEN_STYLE_SHEATH_DRESS" />
<fmt:message var="style_name7" key="LP_WOMEN_STYLE_BABY_DOLL_DRESS" />
<fmt:message var="style_name8" key="LP_WOMEN_STYLE_WRAP_DRESS" />
<fmt:message var="style_name9" key="LP_WOMEN_STYLE_SWEATER_DRESS" />
<fmt:message var="style_name10" key="LP_WOMEN_STYLE_2-PIECE_DRESS" />

<%-- To hold the style name and image in a map --%>
<jsp:useBean id="styleMap" class="java.util.HashMap" type="java.util.Map"/>

<c:set target="${styleMap}" property="${style_name1}" value="${style_image1}"/>
<c:set target="${styleMap}" property="${style_name2}" value="${style_image2}"/>
<c:set target="${styleMap}" property="${style_name3}" value="${style_image3}"/>
<c:set target="${styleMap}" property="${style_name4}" value="${style_image4}"/>
<c:set target="${styleMap}" property="${style_name5}" value="${style_image5}"/>
<c:set target="${styleMap}" property="${style_name6}" value="${style_image6}"/>
<c:set target="${styleMap}" property="${style_name7}" value="${style_image7}"/>
<c:set target="${styleMap}" property="${style_name8}" value="${style_image8}"/>
<c:set target="${styleMap}" property="${style_name9}" value="${style_image9}"/>
<c:set target="${styleMap}" property="${style_name10}" value="${style_image10}"/>
			
<c:set var="basePath" value="${env_schemeToUse}://${pageContext.request.serverName}${jspStoreImgDir}LandingPages/Page2/" />

<fmt:message var="departmentName" key="LP_APPAREL" />
<fmt:message var="topCategoryName" key="LP_WOMEN" />
<fmt:message var="subCategoryName" key="LP_DRESSES" />
<fmt:message var="categoryTitle" key="LP_WOMEN_DRESSES" />

<!-- Obtain the categoryId.  This can be hardcoded into the landing page or passed as a categoryId URL parameter, instead of from a name lookup -->
<%-- Get the category hierarchy upto 2 levels --%>
	
<wcf:getData type="com.ibm.commerce.catalog.facade.datatypes.CatalogNavigationViewType" var="catalog" 
	expressionBuilder="getCatalogNavigationCatalogGroupViewByCatalogId">
	<wcf:contextData name="storeId" data="${storeId}" />		
</wcf:getData>

<c:forEach var="deparment" items="${catalog.catalogGroupView}" varStatus="counter">
	<c:if test="${deparment.name eq departmentName}">
		<wcf:getData type="com.ibm.commerce.catalog.facade.datatypes.CatalogNavigationViewType" var="topCategories" 
			expressionBuilder="getCatalogNavigationCatalogGroupViewByParentCatalogGroup">
			<wcf:param name="parentCatalogGroupId" value="${deparment.uniqueID}" />
			<wcf:contextData name="storeId" data="${storeId}" />															
		</wcf:getData>
		<c:forEach var="topCategory" items="${topCategories.catalogGroupView}">
			<c:if test="${topCategory.name == topCategoryName}">
				<wcf:getData type="com.ibm.commerce.catalog.facade.datatypes.CatalogNavigationViewType" var="subCategories" 
					expressionBuilder="getCatalogNavigationCatalogGroupViewByParentCatalogGroup">
					<wcf:param name="parentCatalogGroupId" value="${topCategory.uniqueID}" />
					<wcf:contextData name="storeId" data="${storeId}" />															
				</wcf:getData>
				<c:forEach var="subCategory" items="${subCategories.catalogGroupView}">
					<c:if test="${subCategory.name == subCategoryName}">
						<c:set var="landingPageCategoryId" value="${subCategory.uniqueID}"/>
					</c:if>
				</c:forEach>
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
										<div class="widget_searchlanding_video" tabindex="0" title="<fmt:message key='LP_WOMEN_DRESSES_VIDEO_ACCE_TEXT'/>">
											<!-- Android 2.2+ fallback to Flash -/->
											<video controls poster="media/${CommandContext.locale}/main_934_392.jpg" >
												<source src="media/${CommandContext.locale}/dress_usl.mp4" type="video/mp4" />
											</video> -->
											<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" width="934" height="392" id="dress_usl_player" align="middle">
												<param name="movie" value="media/${CommandContext.locale}/dress_usl_player.swf" />
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
												<object type="application/x-shockwave-flash" data="media/${CommandContext.locale}/dress_usl_player.swf" width="934" height="392" tabindex="-1">
													<param name="movie" value="media/${CommandContext.locale}/dress_usl_player.swf" />
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
									
									<c:if test="${!empty landingPageCategoryId}">
										<!-- Searchlanding Brands -->
										<div class="widget_searchlanding_carousel_position">
											<div class="widget_searchlanding_carousel">
												
												<div class="top">
													<div class="left_border"></div>
													<div class="middle"></div>
													<div class="right_border"></div>
												</div>
												
												<div class="middle">
													<div class="left_border">
														<div class="right_border">
															<div class="content">
																<div class="brand_mode">
																	<div class="title"><fmt:message key="LP_SHOP_BY_BRANDS" /></div>
																	<div id="brandCarousel" class="carousel">
																		
																		<c:forEach var="facetField" items="${globalfacets}" varStatus="status">
																			<c:if test="${facetField.value eq 'mfName_ntk_cs'}">
																				<c:forEach var="item" items="${facetField.entry}">
																					<c:choose>
																						<c:when test='${item.label == "Hermitage Collection"}'>
																							<c:set var="brandFilename" value="brand_0_160.png"/>
																						</c:when>
																						<c:when test='${item.label == "Luigi Valenti"}'>
																							<c:set var="brandFilename" value="brand_1_160.png"/>
																						</c:when>
																						<c:when test='${item.label == "Gusso"}'>
																							<c:set var="brandFilename" value="brand_2_160.png"/>
																						</c:when>
																						<c:when test='${item.label == "Albini"}'>
																							<c:set var="brandFilename" value="brand_4_160.png"/>
																						</c:when>
																						<c:when test='${item.label == "Versatil"}'>
																							<c:set var="brandFilename" value="brand_5_160.png"/>
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
																						<div class="item">
																							<div class="image">
																								<a id="brandLink_${status.count}" href="${brandURL}" title="${item.label}">
																									<img src="${basePath}images/brands/${brandFilename}" alt="${item.label}">
																								</a>
																							</div>
																						</div>
																					</c:if>
																				</c:forEach>
																			</c:if>
																		</c:forEach>
																		
																		<div class="clear_float"></div>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
												
												<div class="bottom">
													<div class="left_border"></div>
													<div class="middle"></div>
													<div class="right_border"></div>
												</div>
												
												<div class="left_arrow"></div>
												
												<div class="right_arrow active"></div>
											</div>
											<div class="clear_float"></div>
										</div>
										<!-- Searchlanding Brands -->
									
									
										<!-- Searchlanding Style -->
										<div class="widget_carousel_position">
											<div class="widget_searchlanding_carousel">
												
												<div class="top">
													<div class="left_border"></div>
													<div class="middle"></div>
													<div class="right_border"></div>
												</div>
												
												<div class="middle">
													<div class="left_border">
														<div class="right_border">
															<div class="content">
																<div class="style_mode">
																	<div class="title"><fmt:message key="LP_SHOP_BY_STYLE" /></div>
																	<div id="styleCarousel" class="carousel" dojoType="wc.widget.ScrollablePane" totalDisplayNodes="5" autoScroll='false' scrollByPage="true" itemSize="169" buttonSize="115">
																		
																		<c:forEach var="style" items="${styleMap}" varStatus="status">
																		
																			<wcf:url var="styleSearchURL" value="SearchDisplay">
																				<wcf:param name="storeId" value="${storeId}"/>
																				<wcf:param name="catalogId" value="${catalogId}"/>
																				<wcf:param name="langId" value="${langId}"/>
																				<wcf:param name="sType" value="SimpleSearch"/>
																				<wcf:param name="categoryId" value="${landingPageCategoryId}"/>
																				<wcf:param name="searchTerm" value="${style.key}"/>
																				<wcf:param name="searchType" value="1000"/>
																			</wcf:url>
																			<div dojoType="dijit.layout.ContentPane" style="float:left;" id="style_${status.count}" class="itemImgContainer dijitContentPane">
																				<div class="item">
																					<div class="image">
																						<a id="styleLink_${status.count}" href="${styleSearchURL}" title="<c:out value="${style.key}"/>">
																							<img src="${basePath}images/style/${style.value}" alt="<c:out value="${style.key}"/>" />
																						</a>
																					</div>
																					<a id="styleLinkDesc_${status.count}" href="${styleSearchURL}" class="description"><c:out value="${style.key}"/></a>
																				</div>
																			</div>
																		</c:forEach>
																		
																		<div class="clear_float"></div>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
												
												<div class="bottom">
													<div class="left_border"></div>
													<div class="middle"></div>
													<div class="right_border"></div>
												</div>
												
											</div>
											<div class="clear_float"></div>
										</div>
										<!-- End Searchlanding Style -->
									</c:if>
									
									<div class="clear_float"></div>
									
									<div class="widget_full_espot_container_position">
										<c:choose>
											<c:when test="${env_fetchMarketingDetailsOnLoad}">
												<div dojoType="wc.widget.RefreshArea" id="HomeRightTopESpot_Widget" controllerId="HomeRightTopESpot_Controller" role="wairole:region" waistate:live="polite" waistate:atomic="false" waistate:relevant="all">
												</div>
											</c:when>
											<c:otherwise>
												<%out.flush();%>
												<c:import url="${env_jspStoreDir}Widgets/ESpot/ContentRecommendation/ContentRecommendation.jsp">
													<c:param name="emsName" value="SearchLandingPageAd" />
													<c:param name="numberContentPerRow" value="1" />
													<c:param name="catalogId" value="${catalogId}" />
													<c:param name="errorViewName" value="AjaxOrderItemDisplayView" />
												</c:import>
												<%out.flush();%>
											</c:otherwise>
										</c:choose>
									</div>
									
									
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
					<c:param name="homeRightTopESpot" value="true"/>
				</c:import>
			<%out.flush();%>
			</c:if>
			<!--End: Contents after page load-->
			
		</div>
	
	
	</body>
	
	
</html>