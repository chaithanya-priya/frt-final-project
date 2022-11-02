
    
        let DEFAULT_addToCartBtnSelectorsApp3 = 'input[name="add"], button[name="add"], form[action*="/cart/add"] input[type="submit"], form[action*="/cart/add"] button[type="submit"], form[action*="/cart/add"] button:not([type="button"]), form[action*="/cart/add"] .glpro__add-to-cart';
        let DEFAULT_checkoutBtnSelectorsApp3 = 'button[name="checkout"], input[name="checkout"], form[action*="/cart"] a[href="/checkout"], a[href="/checkout"], form[action="/cart"] input[type="submit"][name="checkout"], form[action="/cart"] button[type="submit"][name="checkout"]';
        let DEFAULT_quantityBtnSelectorsApp3 = '.ajaxcart__qty,quantity-input .quantity,.product-form__input, .product-form__quantity ';
        let DEFAULT_sideCartSelectorsApp3 = '.cart-notification,cart-notification,.cart-notification-wrapper,#cart-notification, #CartDrawer, .drawer, .drawer-cover, .Drawer';
        let DEFAULT_buyNowBtnApp3 = '.shopify-payment-button__button, .shopify-payment-button__button--unbranded';
        let DEFAULT_cartFormApp3 = 'form[action="/cart"], form[action="/cart/"], form[action="cart"]';
                    
        var glproUtils = {
            f: {}
        }
        window.glproUtils = glproUtils;
        //console.log


        /*
        *fn(param1, param2) =>   
        *param1 is url of script that we suppose to load 
        *param2 is function that should be called after script is loaded 
        */


        glproUtils.f.loadScript = function (a, b) {
            var c = document.createElement("script");
            c.type = "text/javascript";
            c.src = a;
            document.getElementsByTagName("head")[0].appendChild(c)
            c.onload = function () { b() };
        };
    
        /*
        * we changed loadScript function - if else block for onload is removed as it was not making sense
        *fn(param1) =>  
        *param1 - represents function that should be executed once jquery is loaded 
        *https://www.w3schools.com/jquery/jquery_noconflict.asp
        */
        glproUtils.f.loadJquery = function (b) {
            console.log("does this work");
            let flag = false;
            if("undefined" === typeof jQuery || 1.9 > parseFloat(jQuery.fn.jquery)){
                flag = true;
            }
            if("undefined" != typeof jQuery && jQuery.post == undefined){
                flag = true;
            }

            if(flag){
                glproUtils.f.loadScript("https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js", function () {
                    glproJquery = jQuery.noConflict(!0);
                    b(glproJquery)
                })
            }else{
                b(jQuery);
            }
        };
    
        var glpro = {
            debug: [],
            version: 1.1,
            state: {
                submitted: "",
                product_added: "",
                page_type: "",
                insertWrapperOnPage: [],
                cartData: undefined,
                isOverWriteBuyNowBtnTriggered: false,
                timer: undefined,
                freeGiftcardPopupModalTriggered: false,
                atleastOneProduct:{}
            },
            constants: {
                themesIds: {
                    DAWN_THEME: 887,
                    VENTURE_THEME: 775,
                    EXPRESS_THEME: 885,
                    CRAVE_THEME: 1363,
                    SENSE_THEME: 1356,
                    CRAFT_THEME: 1368,
                }
            },
            importExternalScript: async function (scriptName) {
                switch (scriptName) {
                    case "date-flatpickr":
                        await new Promise(function (resolve, reject) {
                            try{                                                                
                                document.body.appendChild(document.createElement('script')).src = 'https://cdn.jsdelivr.net/npm/flatpickr@4.6.13/dist/flatpickr.min.js';

                                //attach a link tag for css 
                                // var link = document.createElement('link');
                                // link.rel = 'stylesheet';
                                // link.href = 'https://cdn.jsdelivr.net/npm/flatpickr/dist/themes/material_blue.css';
                                // document.head.appendChild(link);
                                //delay the resolve by 1 second
                                setTimeout(function () {
                                    console.log("resolved just now");
                                    resolve();
                                }, 1000); 
                            }catch(e){
                                console.log(e);
                                reject();
                            }
                        });
                    break;
                }
            },
            settings: {}, //object from function
            selectors: {},
            cartInterval: "",
            productinterval: "",
            f: {
    
                bootstrap: function (settings) {
                    console.log("bootstap?");
                    glpro.f.initThemeCSS();
                    glpro.f.globalListener(settings)
                    // glpro.glproGiftMsgAndWrap.init(settings);
                    glpro.storage.loadValuesFromStorage(glpro.settings);
                    glpro.themeSpecificCode.init(glpro.settings)

                },
                initThemeCSS: function (){
                    console.log("initThemeCSS?",glpro.selectors.addToCart);
                    let  addToCartBtnEle =  glpro.$(document).find(glpro.selectors.addToCart)
                    let checkoutBtnEle = glpro.$(document).find(glpro.selectors.checkoutBtn)
    
                    let buttonToOverRide = glpro.$(addToCartBtnEle).length > 0 ?  addToCartBtnEle : checkoutBtnEle;
    
                    if(glpro.settings.app.themeFontFamily == "" && glpro.$("body").length>0){
                        glpro.settings.app.themeFontFamily = glpro.$("body").css("font-family");
                    }
                    //find the font color of the theme
                    if(glpro.settings.app.themeFontColor == "" && glpro.$("p").length > 0){
                        glpro.settings.app.themeFontColor = glpro.$("p").css("color");
                    }
                    //theme background color
                    if(glpro.settings.app.themeBackgroundColor == "" && glpro.$("body").length > 0){
                        glpro.settings.app.themeBackgroundColor = glpro.$("body").css("background-color");
                    }
                    if(glpro.settings.app.themeLabelFontColor == "" && glpro.$("label").length > 0){
                        glpro.settings.app.themeLabelFontColor = glpro.$("label").css("color");
                    }
                    // themeLabelFontFamily
                    if(glpro.settings.app.themeLabelFontFamily == "" && glpro.$("label").length > 0){
                        glpro.settings.app.themeLabelFontFamily = glpro.$("label").css("font-family");
                    }
                    if(glpro.settings.app.themeButtonBackgroundColor == "" && glpro.$(buttonToOverRide).length > 0 ){
                        glpro.settings.app.themeButtonBackgroundColor = glpro.$(buttonToOverRide).css("background-color");
                    }
                    if(glpro.settings.app.themButtonTextColor == "" && glpro.$(buttonToOverRide).length > 0){
                        glpro.settings.app.themButtonTextColor = glpro.$(buttonToOverRide).css("color");
                    }
                    if(glpro.settings.app.themeButtonBorderColor == "" && glpro.$(buttonToOverRide).length > 0){
                        glpro.settings.app.themeButtonBorderColor = glpro.$(buttonToOverRide).css("border-color");
                    }
                    //box shadow
                    if(glpro.settings.app.themeButtonBoxShadow == "" && glpro.$(buttonToOverRide).length > 0){
                        glpro.settings.app.themeButtonBoxShadow = glpro.$(buttonToOverRide).css("box-shadow");
                    }
                    // button font family
                    if(glpro.settings.app.themeButtonFontFamily == "" && glpro.$(buttonToOverRide).length > 0){
                        glpro.settings.app.themeButtonFontFamily = glpro.$(buttonToOverRide).css("font-family");
                    }
                    if(glpro.settings.app.themeHeaderFontFamily == "" && glpro.$("h1").length > 0){
                        glpro.settings.app.themeHeaderFontFamily = glpro.$("h1").css("font-family");
                    }
                    if(glpro.settings.app.themeHeaderFontColor == "" && glpro.$("h1").length > 0){
                        glpro.settings.app.themeHeaderFontColor = glpro.$("h1").css("color");
                    }
                    
                },
               
                
                getSettings: async function () {
                    //promise
                    
                    console.log("GET setting of giftlab pro fired")
                    return new Promise(function (resolve, reject) {
					    //  fetch("https://gkt101.pagekite.me/api/cartSettings/get?shopName=abhishek-devlopment-store.myshopify.com",{
						// fetch("https://gkt104.pagekite.me/api/cartSettings/get?shopName=staging-testing-107.myshopify.com",{
						// fetch("https://zurakite.pagekite.me/api/cartSettings/get?shopName=rafaths-dev-store.myshopify.com",
                        
                        fetch("/apps/gwm/get",{
                        method: 'GET',
                        }).then(
                            response => response.json() // if the response is a JSON object
                        ).then(
                            success => {
                                if(success.responseCode == 200){
                                    console.log("success-data", success.data);
                                }
                                resolve(success.data);
                            }
                        ).catch(error => {
                            console.log(error) // Handle the error response object
                            reject(error)
                            }
                        );

                    })
                    
                },
                setSettings: function(tmpCartSettings){
                    var cart_settings = {
                        giftwrap: {
                            isGiftWrapEnabled: tmpCartSettings.globalSettingsData.giftwrap.isGiftWrapEnabled,
                            isGiftWrapEnabledOnPage: tmpCartSettings.globalSettingsData.giftwrap.isGiftWrapEnabledOnPage || false,
                            productId: tmpCartSettings.globalSettingsData.giftwrap.giftwrapProduct.productId,
                            productHandle : tmpCartSettings.globalSettingsData.giftwrap.giftwrapProduct.handle,
                            productVariants: tmpCartSettings.globalSettingsData.giftwrap.giftwrapProduct.variants,
                            giftWrapShopifyImgUrl: tmpCartSettings.globalSettingsData.giftwrap.giftwrapProduct?.images[0]?.src,
                            purchaseLimitCount : tmpCartSettings.globalSettingsData.giftwrap.allowOnlyOne ||  tmpCartSettings.globalSettingsData.giftwrap.purchaseLimitCount || 100,
                        },
                        greetingCard: {
                            isGreetingCardEnabled: tmpCartSettings.globalSettingsData.greetingCard.isGreetingCardEnabled, 
                            productId: tmpCartSettings.globalSettingsData.greetingCard.greetingCardProduct.productId,
                            productHandle : tmpCartSettings.globalSettingsData.greetingCard.greetingCardProduct.handle,
                            productVariants: tmpCartSettings.globalSettingsData.greetingCard.greetingCardProduct.variants,
                            giftWrapShopifyImgUrl: tmpCartSettings.globalSettingsData.greetingCard.greetingCardProduct?.images[0]?.src,
                            purchaseLimitCount : tmpCartSettings.globalSettingsData.greetingCard.allowOnlyOne || tmpCartSettings.globalSettingsData.greetingCard.purchaseLimitCount || 100,
                        },
                        giftMessage: tmpCartSettings.globalSettingsData.giftMessage || {},
                    
                        // popup: {
                        //     popupHeadingText: tmpCartSettings.popupHeadingText,
                        //     messageCheckboxHeading: tmpCartSettings.messageCheckboxHeading,
                        //     giftWrapCheckboxHeading: tmpCartSettings.giftWrapCheckboxHeading,
                        //     messageBoxplaceholder: tmpCartSettings.messageBoxplaceholder,
                        //     saveButtonBackgroundColor: tmpCartSettings.saveButtonBackgroundColor,
                        //     saveButtonTextColor: tmpCartSettings.saveButtonTextColor,
                        //     saveButtonText: tmpCartSettings.saveButtonText,
                        //     cartPopupBackgroundColor: tmpCartSettings.cartPopupBackgroundColor,
                        //     reloadOnCancelClick: tmpCartSettings.reloadOnCancelClick
                        // },
                        // giftingOptions: {
                        //     isGiftWrapEnabled: tmpCartSettings.isGiftWrap,
                        //     isGiftMessageEnabled: tmpCartSettings.isGiftField,
                        //     // enabledGifiting: "PRODUCT_PAGES_AND_CART_PAGE", "PRODUCT_PAGES", "CART_PAGE", "NONE",
                        //     enabledGifiting: tmpCartSettings.enabledGifiting,
                        //     shopifyPageinnerHTML: tmpCartSettings.cartPageText
                        // },,
                        
                        giftAddons: tmpCartSettings.globalSettingsData.giftAddons || {},
                        deliveryScheduler: tmpCartSettings.globalSettingsData.deliveryScheduler || {},
                        scheduleDelivery: tmpCartSettings.globalSettingsData.scheduleDelivery || {},
                        videoMessage: tmpCartSettings.globalSettingsData.videoMessage || {},
                        //Todo
                        isEmailEnabled: tmpCartSettings.globalSettingsData.videoMessage.isEmailEnabled ?? true,   
                        pageWrapper: { cartPageText: tmpCartSettings.cartPageText },
                        combos: tmpCartSettings.combos || [],
                        oneClickUpsells: tmpCartSettings.oneClickUpsells || [],
                        whereToShow:{
                          	isAppEnabled:  tmpCartSettings.globalSettingsData.isAppEnabled,
                            isVisibleOnCart: tmpCartSettings.globalSettingsData.isVisibleOnCart,
                            isVisibleOnAllProductPages: tmpCartSettings.globalSettingsData.isVisibleOnAllProductPages,
                            isVisibleOnSpecificProductPages: tmpCartSettings.globalSettingsData.isVisibleOnSpecificProductPages,
                            visibleOnSpecificProductPages: tmpCartSettings.globalSettingsData.visibleOnSpecificProductPages,

                            isVisibleOnSpecificCollectionPages: tmpCartSettings.globalSettingsData.isVisibleOnSpecificCollectionPages || false,
                            visibleOnSpecificCollectionPages: tmpCartSettings.globalSettingsData.visibleOnSpecificCollectionPages || [],
                            visibleOnSpecificCollectionProductPages: tmpCartSettings.globalSettingsData.visibleOnSpecificCollectionProductPages,

                            isExcludeOnSpecificProductPages: tmpCartSettings.globalSettingsData.isExcludeOnSpecificProductPages || false,
                            excludeOnSpecificProductPages: tmpCartSettings.globalSettingsData.excludeOnSpecificProductPages || []

                        },
                        SERVER_URL: tmpCartSettings.SERVER_URL,
                        app: {
                            disableApp: tmpCartSettings.userData.customSettings.disableApp || false,
                            disableSideCart: tmpCartSettings.userData.customSettings.disableSideCart || false,
                            refreshProductPageOnGiftWrap: tmpCartSettings.userData.customSettings.refreshProductPageOnGiftWrap || false,
                            addToCartBtnSelectors: tmpCartSettings.userData.customSettings.addToCartBtnSelectors || DEFAULT_addToCartBtnSelectorsApp3,
                            checkoutBtnSelectors: tmpCartSettings.userData.customSettings.checkoutBtnSelectors || DEFAULT_checkoutBtnSelectorsApp3,
                            quantityBtnSelectors: tmpCartSettings.userData.customSettings.quantityBtnSelectors || DEFAULT_quantityBtnSelectorsApp3,
                            sideCartSelectors: tmpCartSettings.userData.customSettings.sideCartSelectors || DEFAULT_sideCartSelectorsApp3,
                            themeBackgroundColor : tmpCartSettings.userData.customSettings.themeBackgroundColor || "",

                            themeFontFamily: tmpCartSettings.userData.customSettings.themeFontFamily || "",
                            themeFontColor: tmpCartSettings.userData.customSettings.themeFontColor || "",
                            
                            themeButtonBackgroundColor: tmpCartSettings.userData.customSettings.themeButtonBackgroundColor || "",
                            themButtonTextColor: tmpCartSettings.userData.customSettings.themButtonTextColor || "",
                            themeButtonBorderColor: tmpCartSettings.userData.customSettings.themeButtonBorderColor || "",
                            themeButtonBoxShadow: tmpCartSettings.userData.customSettings.themeButtonBoxShadow || "",
                            //button font family
                            themeButtonFontFamily: tmpCartSettings.userData.customSettings.themeButtonFontFamily || "",
                
                            themeHeaderFontFamily: tmpCartSettings.userData.customSettings.themeHeaderFontFamily || "",
                            themeHeaderFontColor: tmpCartSettings.userData.customSettings.themeHeaderFontColor || "",
                
                            themeLabelFontColor: tmpCartSettings.userData.customSettings.themeLabelFontColor || "",
                            themeLabelFontFamily: tmpCartSettings.userData.customSettings.themeLabelFontFamily || "",

                            addButtonBackgroundColor: tmpCartSettings.userData.customSettings.addButtonBackgroundColor || "",
                            addButtonTextColor: tmpCartSettings.userData.customSettings.addButtonTextColor || "",
                            addButtonBorderColor: tmpCartSettings.userData.customSettings.addButtonBorderColor || "",

                            removeButtonBackgroundColor: tmpCartSettings.userData.customSettings.removeButtonBackgroundColor || "",
                            removeButtonTextColor: tmpCartSettings.userData.customSettings.removeButtonTextColor || "",
                            removeButtonBorderColor: tmpCartSettings.userData.customSettings.removeButtonBorderColor || "",

                            activeVariantCodes: tmpCartSettings.userData.customSettings.activeVariantCodes || "123456789",

                            showBranding : tmpCartSettings.userData.customSettings.showBranding,

                            buyNowBtn: tmpCartSettings.userData.customSettings.buyNowBtn || DEFAULT_buyNowBtnApp3,
                            cartForm: tmpCartSettings.userData.customSettings.cartForm || DEFAULT_cartFormApp3,
                            addAfterAddTocartBtn:tmpCartSettings.userData.customSettings.addAfterAddTocartBtn || false,
                            addAftercheckoutBtn: tmpCartSettings.userData.customSettings.addAftercheckoutBtn || false,
                            customStyle: tmpCartSettings.userData.customSettings.customStyle || null,
                            removeGiftNoteFromNote: tmpCartSettings.userData.customSettings.removeGiftNoteFromNote || false, 
                            gwmGiftMessageTextAreaKeepOpen: tmpCartSettings.userData.customSettings.gwmGiftMessageTextAreaKeepOpen || false 
                        },
                        merchantInfo: tmpCartSettings.userData,
                        languageData: tmpCartSettings.languageData,

                    }

                    glpro.settings = cart_settings
                    console.log("settings assigned")

                },

                setSelectors:  function(){
                    let settings =  glpro.settings
                    glpro.selectors = {
                        addToCart: settings.app.addToCartBtnSelectors,
                        checkoutBtn: settings.app.checkoutBtnSelectors,
                        sideCartSelectors: settings.app.sideCartSelectors,
                        buyNowBtn: settings.app.buyNowBtn,
                        cartForm: settings.app.cartForm,
                        productPageWrapperV2: '.glproProductPageWrapperV2',
                        cartPageWrapperV2: '.glproCartPageWrapperV2',
                        quantityBtnSelectors : settings.app.quantityBtnSelectors,
                    }
                },
                setCustomStyling: function (){
                    let customStyle =  glpro.settings.app.customStyle
                    if(customStyle){
                        var styleSheet = document.createElement("style")
                        styleSheet.innerText = customStyle
                        document.body.appendChild(styleSheet)

                    }
                },
                getPageType: function () {
                    var pageType = "";
                    if (window.location.pathname.includes("/cart") && !window.location.pathname.includes("/products")) {
                        pageType = "cart";
                    } else if (window.location.pathname.includes("/products")) {
                        pageType = "product";
                    } else if (window.location.pathname.includes("/collections")) {
                        pageType = "COLLECTION";
                    } else if (window.location.pathname.includes("/")) {
                        pageType = "HOME";
                    } else if ("undefined" != typeof Shopify && "undefined" != typeof Shopify.Checkout) {
                        pageType = "CHECKOUT";
                    } else {
                        pageType = "PAGE_NOT_FOUND";
                    }
                    return pageType;
                },
                getProductPageHandle: function () {
                    if ("product" === glpro.state.page_type && shopifyLiquidValuesApp3.product.handle) {
                        // let pattern = /(?<=\\/products\\/)((?!\\?|\\$).)+/g
                        // if(window && window.location && window.location.href){
                        //     return window.location.href.match(pattern)[0]
                        // }
                        return shopifyLiquidValuesApp3.product.handle
                    }
                    return "undefined"
                },
                applyButtonCSS : function(element){
                
                    //apply glpro.settings.app.themButtonTextColor themeButtonBackgroundColor themeButtonBorderColor to the button
                    if(glpro.settings.app.themButtonTextColor != ""){
                        element.css("color", glpro.settings.app.themButtonTextColor);
                    }
                    if(glpro.settings.app.themeButtonBackgroundColor != ""){
                        element.css("background-color", glpro.settings.app.themeButtonBackgroundColor);
                    }
                    if(glpro.settings.app.themeButtonBorderColor != ""){
                        element.css("border","1px solid")
                        element.css("border-color", glpro.settings.app.themeButtonBorderColor);
                    }
                    // box shadow
                    if(glpro.settings.app.themeButtonBoxShadow != ""){
                        element.css("box-shadow", glpro.settings.app.themeButtonBoxShadow);
                    }
                    //themeButtonFontFamily
                    if(glpro.settings.app.themeButtonFontFamily != ""){
                        element.css("font-family", glpro.settings.app.themeButtonFontFamily);
                    }
                    
                  
                },
                resetButtonCSS: function (element){
                    //reset the button css
                    element.css("color","");
                    element.css("background-color","");
                    element.css("border","");
                    element.css("border-color","");
                    element.css("box-shadow","");
                },
                applyHeaderCSS: function (element){
                    //apply glpro.settings.app.themeFontFamily themeFontColor to the header
                    if(glpro.settings.app.themeHeaderFontFamily != ""){
                        element.css("font-family", glpro.settings.app.themeHeaderFontFamily);
                    }
                    if(glpro.settings.app.themeHeaderFontColor != ""){
                        element.css("color", glpro.settings.app.themeHeaderFontColor);
                    }
                },
                applyLabelCSS: function (element){
                    if (!element){
                        return
                    }
                    //apply glpro.settings.app.themeLabelFontColor to the label
                    if(element && glpro.settings.app.themeLabelFontColor != ""){
                        element.css("color", glpro.settings.app.themeLabelFontColor);
                    }
                    if(element && glpro.settings.app.themeLabelFontFamily != ""){
                        element.css("font-family", glpro.settings.app.themeLabelFontFamily);
                    }else{
                        element.css("font-family","inherit");
                    }
                },

                applyAddButtonCSS: function (element){
                    //apply glpro.settings.app.themButtonTextColor themeButtonBackgroundColor themeButtonBorderColor to the button
                    if(glpro.settings.app.addButtonTextColor != ""){
                        element.css("color", glpro.settings.app.addButtonTextColor);
                    }
                    if(glpro.settings.app.addButtonBackgroundColor != ""){
                        element.css("background-color", glpro.settings.app.addButtonBackgroundColor);
                    }
                    if(glpro.settings.app.addButtonBorderColor != ""){
                        // element.css("border","1px solid")
                        element.css("border-color", glpro.settings.app.addButtonBorderColor);
                    }
                    //themeButtonFontFamily
                    if(glpro.settings.app.themeButtonFontFamily != ""){
                        element.css("font-family", glpro.settings.app.themeButtonFontFamily);
                    }
                },

                applyRemoveButtonCSS: function (element){
                    //apply glpro.settings.app.themButtonTextColor themeButtonBackgroundColor themeButtonBorderColor to the button
                    if(glpro.settings.app.removeButtonTextColor != ""){
                        element.css("color", glpro.settings.app.removeButtonTextColor);
                    }
                    if(glpro.settings.app.removeButtonBackgroundColor != ""){
                        element.css("background-color", glpro.settings.app.removeButtonBackgroundColor);
                    }
                    if(glpro.settings.app.removeButtonBorderColor != ""){
                        // element.css("border","1px solid")
                        element.css("border-color", glpro.settings.app.removeButtonBorderColor);
                    }
                    //themeButtonFontFamily
                    if(glpro.settings.app.themeButtonFontFamily != ""){
                        element.css("font-family", glpro.settings.app.themeButtonFontFamily);
                    }
                },

                cleanupAdditionalNotesProperty:  async function (cart){
                    if(cart && cart.attributes){
                       // each cart has a property called attributes, which has key value pairs
                       // based on value of the key, we can decide if we want to remove it or not
                       // for example, if the key is "glproGiftAddons", we want to remove it
                       // and add a new key called "Gift Addons" with the value as an yes
                       // this is done to make the cart more readable
                        let deletedVariantIds = [];
                        for (let key in cart.attributes) {
                            if (cart.attributes.hasOwnProperty(key)) {
                                if(cart.attributes[key] == "glproGiftAddons" || cart.attributes[key] == "giftAddons"){
                                    cart.attributes["Gift Addons"] = "Yes"
                                    deletedVariantIds.push(key) 
                                    cart.attributes[key] =""
                                }

                                
                                //giftwrap
                                if(cart.attributes[key] == "giftwrap" || cart.attributes[key] == "glproGiftWrap"){
                                    cart.attributes["Gift Wrap"] = "Yes"
                                    deletedVariantIds.push(key) 
                                    cart.attributes[key] =""
                                }

                                if(cart.attributes[key] == "greetingCard" || cart.attributes[key] == "glproGreetingCard"){
                                    cart.attributes["Greeting Card"] = "Yes"
                                    deletedVariantIds.push(key) 
                                    cart.attributes[key] =""
                                }

                            }
                        }

                    //    await glpro.utility.deleteCartAttributes(deletedVariantIds)
                       await glpro.utility.updateCart({attributes: cart.attributes})                  
                    }
                },

                
                getSelectedVariant: function () {
                    if ("product" === glpro.state.page_type) {
    
                        let activeCodes = glpro.settings.app.activeVariantCodes;  
                          
                        if(activeCodes.indexOf("1") >= 0){
                            const params = Object.fromEntries(new URLSearchParams(location.search))
                            if(params && params.variant){
                                return params.variant
                            }
                        }
                       
                        if(activeCodes.indexOf("2") >= 0){
                                if (ShopifyAnalytics && ShopifyAnalytics.meta && ShopifyAnalytics.meta.selectedVariantId) {
                                for(let i = 0; i < ShopifyAnalytics.meta.product.variants.length; i++){
                                    if(ShopifyAnalytics.meta.product.variants[i].id == ShopifyAnalytics.meta.selectedVariantId){
                                        return ShopifyAnalytics.meta.selectedVariantId
                                    }
                                }
                            }
                        }
                        if(activeCodes.indexOf("3") >= 0){
                            if (document.querySelector('[name="id"]') && document.querySelector('[name="id"]').value) {
                                return document.querySelector('[name="id"]').value
                            }
                        }
                        
                        if(activeCodes.indexOf("4") >= 0){
                            if (shopifyLiquidValues.selected_or_first_available_variant) {
                                return shopifyLiquidValues.selected_or_first_available_variant.id
                            }
                        }
    
                        return undefined
                    }
                },

                getProductQuantity: function () {
                    if (document.querySelector('[name="quantity"]') && document.querySelector('[name="quantity"]').value) {
                        if(Number(document.querySelector('[name="quantity"]').value)){
                            return Number(document.querySelector('[name="quantity"]').value)
                        }else{
                            return 1
                        }       
                    }else {
                        return 1
                    }
                },


                getElements: function (settings) {
                    return {
                        gwmGiftMsgAndWrapWrapperParent: glpro.$(glpro.$.parseHTML('<div class="gwmGiftMsgAndWrapHeader"><div class="gwmGiftMsgAndWrapHeaderItem"><label for="gwm-gift-wrapping" class="gwmGiftMsgAndWrapWrapperInnerEle"><input id="gwm-gift-wrapping" class="gwmGiftOptionsCheckbox" type="checkbox" name="addGiftOptions"><span class="gwmCustomWrapCheckboxCheckmark"></span><div class="gwmGiftMsgAndWrapWrapperInnerEleHeading"></div></label> </div></div>')),
                        gwmCartGiftMsgAndWrapWrapperParent: glpro.$(glpro.$.parseHTML('<div class="gwmCartGiftMsgAndWrapHeader"><div class="gwmCartGiftMsgAndWrapHeaderItem"><label for="gwm-gift-wrapping" class="gwmGiftMsgAndWrapWrapperInnerEle"><input id="gwm-gift-wrapping" class="gwmGiftOptionsCheckbox" type="checkbox" name="addGiftOptions"><span class="gwmCustomWrapCheckboxCheckmark"></span><div class="gwmGiftMsgAndWrapWrapperInnerEleHeading"></div></label></div></div>')),
                        glproGiftMsgAndWrapWrapperParent: glpro.$(glpro.$.parseHTML('<div class="glproGiftOptionsPageEleHeader"><div class="glproGiftOptionsPageEleHeaderItem"><label for="glpro-modal" class="glproGiftOptionsPageEleInnerEle"><input id="glpro-modal" class="glproGiftOptionsPageEleCheckbox" type="checkbox" name="addGiftOptions"><span class="glproGiftOptionsPageEleCheckboxCheckmark"></span><div class="glproGiftOptionsPageEleInnerEleHeading"></div></label> </div></div>')),
                        glproGiftMsgAndWrapWrapperParentV2: glpro.$(glpro.$.parseHTML('<div class="glproGiftOptionsPageEleHeader"><div class="glproGiftOptionsPageEleHeaderItem"><label for="glpro-gift-wrapping" class="glproGiftOptionsPageEleInnerEle"><input id="glpro-gift-wrapping" class="glproGiftOptionsPageEleCheckbox" type="checkbox" name="addGiftOptions"><span class="glproGiftOptionsPageEleCheckboxCheckmark"></span><div class="glproGiftOptionsPageEleInnerEleHeading"></div></label> </div></div>')),
                        glproCartGiftMsgAndWrapWrapperParent: glpro.$(glpro.$.parseHTML('<div class="glproCartGiftOptionsPageEleHeader"><div class="glproCartGiftOptionsPageEleHeaderItem"><label for="glpro-gift-wrapping" class="glproGiftOptionsPageEleInnerEle"><input id="glpro-gift-wrapping" class="glproGiftOptionsPageEleCheckbox" type="checkbox" name="addGiftOptions"><span class="glproGiftOptionsPageEleCheckboxCheckmark"></span><div class="glproGiftOptionsPageEleInnerEleHeading"></div></label></div></div>')),
                        addToCartBtn: glpro.$(document).find(glpro.selectors.addToCart),
                        addToCartButtonCloned: undefined,
                        checkoutBtn: glpro.$(document).find(glpro.selectors.checkoutBtn),
                        cartForm: glpro.$(document).find(glpro.selectors.cartForm),
                        productPageWrapperV2: glpro.$(glpro.$.parseHTML('<div class="glproPageWrapper glproProductPageWrapperV2"> <div class="glproGiftOptionsPageEleWrapper"></div>  <div class="gwmGiftMsgAndWrapWrapper"></div><div class="gwmGiftMessageWrapper"></div> </div>')),
                        cartPageWrapperV2: glpro.$(glpro.$.parseHTML('<div class="glproPageWrapper glproCartPageWrapperV2"> <div class="glproCartGiftOptionsPageEleWrapper"></div><div class="gwmCartGiftMsgAndWrapWrapper"></div><div class="gwmCartGiftMessageWrapper"></div></div>')),
                        buyNowBtn: glpro.$(document).find(glpro.selectors.buyNowBtn)
                    }
                },
    
                initialize: async function (jQuery) {
                    //  glpro.$.ajaxSetup({global: true});
                    let tmpCartSettings =  await glpro.f.getSettings();
                    glpro.f.setSettings(tmpCartSettings)
                    glpro.f.setSelectors()
                    glpro.f.setCustomStyling()
                    glpro.state.page_type = glpro.f.getPageType();
                    glpro.elements = glpro.f.getElements(glpro.settings);
                    if ("" === glpro.state.page_type) return false;
                    glpro.utility.setLanguageLocale();
                    return glpro.f.bootstrap(glpro.settings);
                },
                globalListener: async function (settings) {
                    let isIntervalActive = false
                    //if app is disabled reurn
                    if (settings.app.disableApp) {
                        return
                    } else {
                        glpro.state.cartData = await glpro.utility.getCart()
                        glpro.glproModal.init()
                        
                        // if(glpro.glproModal.state.navigationItems.length == 0){
                        //     return 
                        // }

                        if ("product" === glpro.state.page_type) {
                            glpro.productPage.init(settings)
                        }
    
                        if (settings.app.disableSideCart) {
                            if ("cart" === glpro.state.page_type) {
                                glpro.cartPage.init(settings)
                            }
                        } else {
                            glpro.cartPage.init(settings)
    
                        }
                       
                    }
    
                    setInterval(async () => {
                        if (!isIntervalActive) {
                            console.log("glpro-globalListener-active")
    
                            isIntervalActive = true
    
                            // insert productpage wrapper if productPage is initialized
                            if ("product" === glpro.state.page_type &&
                                glpro.elements.addToCartBtn.length > 0 &&
                                glpro.$(document).find(glpro.selectors.productPageWrapperV2).length == 0) {
                                console.log("glpro-productPage-insertWrapperIntoPage1")
                                glpro.productPage.f.insertWrapperIntoPage(settings)
                            }
    
                            let checkoutBtnEle = glpro.$(document).find(glpro.selectors.checkoutBtn)
    
                            // insert cartPage wrapper if cartPage is initialized 
                            if (checkoutBtnEle.length > 0 &&
                                glpro.$(document).find(glpro.selectors.cartPageWrapperV2).length == 0) {
                                console.log("cartPage-insertWrapperIntoPage")
                                await glpro.cartPage.f.insertWrapperIntoPage(settings)
                            }
    
                            // check if giftwrap, message or oneclick upsell overwrite buyNowButton
                            if(glpro.state.isOverWriteBuyNowBtnTriggered && glpro.$(document).find(".glpro-overwrite-buy-now-btn").length  == 0){
                                glpro.utility.overWriteBuyNowBtn()
                            }
    
                           
                            isIntervalActive = false
    
                        }
                    }, 1000)
                }
            },
            utility: {
                getLocale: function () {
                    if (window.Shopify && window.Shopify.locale) {
                        return window.Shopify.locale
                    }else{
                        return "en"
                    } 
                },
                setLanguageLocale: function () {
                    let locale = glpro.utility.getLocale()
                    
                    if(glpro.settings.languageData && glpro.settings.languageData.languageMode == "SINGLE"){
                        locale = "en"
                    }
    
                    if(!glpro.settings.languageData[locale]){
                        locale = "en"
                    }
                    glpro.settings.languageData = glpro.settings.languageData[locale]
                },
                getCookie: function (cookieName) {
                    let name = cookieName + "=";
                    let decodedCookie = decodeURIComponent(document.cookie);
                    let ca = decodedCookie.split(";");
                    for (let i = 0; i < ca.length; i++) {
                        let c = ca[i];
                        while (c.charAt(0) == " ") {
                            c = c.substring(1);
                        }
                        if (c.indexOf(name) == 0) {
                            return c.substring(name.length, c.length);
                        }
                    }
                    return null;
                },
                setCookie: function (cookieName, cookieValue, expiryDays = 7) {
                    const d = new Date();
                    d.setTime(d.getTime() + expiryDays * 24 * 60 * 60 * 1000);
                    let expires = "expires=" + d.toUTCString();
                    document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
                },
                getDate: function (date) {
                    let d = new Date(date);
                    let month = "" + (d.getMonth() + 1);
                    let day = "" + d.getDate();
                    let year = d.getFullYear();

                    if (month.length < 2) month = "0" + month;
                    if (day.length < 2) day = "0" + day;

                    return [year, month, day].join("-");
                },
                addToCart: async function (data) {
    
                    try {
                        // if there is nothing to add in cart..just return true
                        if (!data.id) {
                            return true
                        }
                        let result = await glpro.$.ajax({
                            url: "/cart/add.js",
                            data: data,
                            type: "POST",
                            dataType: "json",
                        })
                        return true
                    } catch (error) {
                        console.error("glpro-utility-addToCart");
                        console.error(error);
                        return false
                    }
                },
                updateCart: async function (data) {
                    try {
                        let result = await glpro.$.ajax({
                            type: "POST",
                            url: "/cart/update.js",
                            data: data,
                            dataType: "json",
                        });
                        return result
                    } catch (error) {
                        console.error("glpro-utility-updateCart");
                        console.error(error);
                        return false
                    }
                },
                changeCart: async function (data) {
                    try {
                        let result = await glpro.$.ajax({
                            type: "POST",
                            url: "/cart/change.js",
                            data: data,
                            dataType: "json",
                        });
                        return true
                    } catch (error) {
                        console.error("glpro-utility-changeCart");
                        console.error(error);
                        return false
                    }
                },
    
                getProductData: async function (productName) {
                    try {
                        let result = await glpro.$.ajax({
                            type: "GET",
                            url: "/products/" + productName,
                            // data: data,
                            dataType: "json",
                        });
                        return result;
                    } catch (error) {
                        console.error("glpro-utility-updateCart");
                        console.error(error);
                        return false
                    }
                },
                getProductDataV2: function (productName) {
                    try {
                        let languageValue = window?.Shopify?.routes?.root ? window.Shopify.routes.root : "/"
                        return new Promise((res, rej) => {
                            glpro.$.getJSON(languageValue +  "products/" + productName + ".js", function (product) {
                                console.log("success-productName: ", productName)
                                res(product)
                            }).fail(function () { console.log("fail-productName: ", productName); res(false) })
                        })
                        return result;
                    } catch (error) {
                        console.error("glpro-utility-getProductDataV2");
                        console.error(error);
                        return false
                    }
                },
                addToCartV2: function (data) {
                    try {
                        return new Promise((res, rej) => {
                            glpro.$.post('/cart/add.js', data)
                                .done(function () { console.log("success-/cart/add.js': "); res(true) })
                                .fail(function () { console.log("fail-/cart/add.js"); res(false) })
                        })
                        return result;
                    } catch (error) {
                        console.error("glpro-utility-addToCartV2");
                        console.error(error);
                        return false
                    }
                },
                clearCart: function (data) {
                    try {
                        return new Promise((res, rej) => {
                            glpro.$.post('/cart/clear.js', data)
                                .done(function () { console.log("success-/cart/clear.js': "); res(true) })
                                .fail(function () { console.log("fail-/cart/clear.js"); res(false) })
                        })
                        return result;
                    } catch (error) {
                        console.error("glpro-utility-clearCart");
                        console.error(error);
                        return false
                    }
                },
                getCart: async function (data) {
                    try {
                        let result = await glpro.$.ajax({
                            type: "GET",
                            url: "/cart.js",
                            dataType: "json",
                        });
                        return result
                    } catch (error) {
                        console.error("glpro-utility-getCart");
                        console.error(error);
                        return false
                    }
                },
                getCartTotalQuantity: async function () {
                    try {
                        let total = 0
                        let cartData = await glpro.$.ajax({
                            type: "GET",
                            url: "/cart.js",
                            dataType: "json",
                        });
                        for (var item of cartData['items']) {
                            total += item["quantity"]
                        }
                        return total
                    } catch (error) {
                        console.error("glpro-utility-getCart");
                        console.error(error);
                        return false
                    }
                },
                checkIfItemPresentInCart: function (searchedVariantId) {
                    if (glpro.state.cartData && glpro.state.cartData.items && glpro.state.cartData.items.length && glpro.state.cartData.items.length > 0) {
                        for (let i = 0; i < glpro.state.cartData.items.length; i++) {
                            let item = glpro.state.cartData.items[i]
                            if (item && item.variant_id && item.variant_id == searchedVariantId) {
                                return item
                            }
                        }
                        return false
                    } else {
                        return false
                    }
                },
                checkIfProductPresentInCart: function (searchedProductId) {
                    if (glpro.state.cartData && glpro.state.cartData.items && glpro.state.cartData.items.length && glpro.state.cartData.items.length > 0) {
                        for (let i = 0; i < glpro.state.cartData.items.length; i++) {
                            console.log("cjeckIfProductPresentInCart: ", glpro.state.cartData.items[i])
                            let item = glpro.state.cartData.items[i]
                            if (item && item.id && item.id == searchedProductId) {
                                return item
                            }
                        }

                        return false
                    } else {
                        return false
                    }
                },
                checkIfGiftOptionsInCart: async function () {
                    let isGiftWrapPresent=false, isGreetingPresent=false, isGiftNotePresent=false, iseDeliveryPresent=false, isGiftAddonPresent=false 
                    

                    // if (glpro.utility.isCartEmpty()==true) {
                    //     //remove the glproScheduleDelivery from attributes and glproGiftMessage and note attributes
                    //     let updateCartData = {  }
                    //     updateCartData.attributes= {"glproGiftMessage" : "","Video Recorded":"", "glproVideoMsgId":"", "RecipientEmail":""}
                    //     await glpro.utility.updateCart(updateCartData)
                    //     return false;
                    // }
                    
                    let giftWrapVariants = [],greetingCardVariants=[],giftAddonVariants=[]
                    if(glpro.settings && glpro.settings.giftwrap && glpro.settings.giftwrap.isGiftWrapEnabled && glpro.settings.giftwrap.productVariants){
                        glpro.settings.giftwrap.productVariants.forEach(item=>giftWrapVariants.push(item.id))   
                    }

                    if(glpro.settings && glpro.settings.greetingCard && glpro.settings.greetingCard.isGreetingCardEnabled && glpro.settings.greetingCard.productVariants){
                        glpro.settings.greetingCard.productVariants.forEach(item=>greetingCardVariants.push(item.id))   
                    }

                    //  Don't check the box if the addon product is not present in the cart
                    // if(glpro.settings && glpro.settings.giftAddons && glpro.settings.giftAddons.isGiftAddonsEnabled && glpro.settings.giftAddons.addOnProducts && glpro.settings.giftAddons.addOnProducts.length && glpro.settings.giftAddons.addOnProducts.length > 0){
                    //     for(let i = 0;i< glpro.settings.giftAddons.addOnProducts.length;i++){
                    //         let addOnProduct = glpro.settings.giftAddons.addOnProducts[i]
                    //         addOnProduct.variants.forEach(item=>giftAddonVariants.push(parseInt(item.variantId)))
                    //     }
                    // }

                    if(glpro.state.cartData && glpro.state.cartData.attributes){
                        if(glpro.state.cartData.attributes.glproGiftMessage){
                            return true
                        }

                        if(glpro.state.cartData.attributes.glproScheduleDelivery){
                            return true
                        }
                    }

                    if (glpro.state.cartData && glpro.state.cartData.items && glpro.state.cartData.items.length && glpro.state.cartData.items.length > 0) {
                        for (let i = 0; i < glpro.state.cartData.items.length; i++) {
                            let item = glpro.state.cartData.items[i]
                            if (item && item.variant_id && item.variant_id) {
                                
                                if(giftWrapVariants.includes(item.variant_id)){
                                    isGiftWrapPresent = true
                                }
                                if(greetingCardVariants.includes(item.variant_id)){
                                    isGreetingPresent = true
                                }
                                if(giftAddonVariants.includes(item.variant_id)){
                                    isGiftAddonPresent = true
                                }
                            }
                        }
                        
                        if(isGiftWrapPresent || isGreetingPresent || isGiftNotePresent || iseDeliveryPresent || isGiftAddonPresent){
                            return true
                        }else{
                            return false
                        }

                    } else {
                        return false
                    }

                    
                    
                },
                getNoteFromCart: function () {
                    if (glpro.state.cartData && glpro.state.cartData.attributes && glpro.state.cartData.attributes.glproGiftMessage &&  glpro.state.cartData.attributes.glproGiftMessage != "") {
                        
                        return glpro.state.cartData.attributes.glproGiftMessage 
                    } else {
                        return false
                    }
                },
                getAttributValueFromCart: function (attributeName) {
                    if (glpro.state.cartData && glpro.state.cartData.attributes && glpro.state.cartData.attributes[attributeName] && glpro.state.cartData.attributes[attributeName] != "") {
                        return glpro.state.cartData.attributes[attributeName]
                    } else {
                        return null
                    }
                },
                getQuantityOfItemInCart: async function (variantIdsList,cartData) {
                    //find the number of items which have the same value of noteAttributesList
                    let count = 0
                    if(!cartData){
                        glpro.state.cartData = await glpro.utility.getCart()
                    }else{
                        glpro.state.cartData = cartData
                    }
                    if (glpro.state.cartData && glpro.state.cartData.items && glpro.state.cartData.items.length > 0)  {
                        // attributes: {variantId : "glproGiftMessage"}
                        for (let i = 0; i < glpro.state.cartData.items.length; i++) {
                            let item = glpro.state.cartData.items[i]
                            if (item && item.variant_id && item.variant_id) {
                                if(variantIdsList.includes(item.variant_id)){
                                    // count += item.quantity
                                    count += 1
                                }
                            }
                        }
                    }
                    return count;
                },


                isCartTotalMoreThan: async function(value){
                    glpro.state.cartData = await glpro.utility.getCart()
    
                    if(glpro.state.cartData && glpro.state.cartData.total_price && ((glpro.state.cartData.total_price)/100 >= parseFloat(value))){
                        console.log("isCartTotalMoreThan: ", glpro.state.cartData.total_price)
                        return true
                    }else{
                        return false
                    }
                },
                isCartEmpty: function () {
                    if (glpro.state.cartData && glpro.state.cartData.items.length <= 0) {
                        return true;
                        
                    } else {
                        return false
                    }
                },

                cloneAddToCartBtn: function () {
                },
                overWriteBuyNowBtn: function (){
                    
                    let buyNowBtnEle = glpro.$(document).find(glpro.selectors.buyNowBtn)   
    
                    if(buyNowBtnEle && buyNowBtnEle.length > 0 && glpro.$(document).find(".glpro-overwrite-buy-now-btn").length  == 0){
                        buyNowBtnEle.show()
                        buyNowBtnEle.unbind().unbind("click").off().off("click");
                        newBuyNowBtnEle = buyNowBtnEle.clone()
                        buyNowBtnEle.after(newBuyNowBtnEle)
                        buyNowBtnEle.hide()
                        newBuyNowBtnEle.addClass("glpro-overwrite-buy-now-btn")
    
                       // clone add to cart behavior 
                        // newBuyNowBtnEle.on("click", async function (event) {    
                        //      glpro.$(this).attr("disabled", true);
                        //     setTimeout(() => { glpro.$(this).attr("disabled", false); }, 1000)
                        //     event.preventDefault();
                        //     event.stopPropagation();
                        //     let selectedVariantId = glpro.f.getSelectedVariant()
                        //     let resAddToCart = await glpro.utility.addToCartV2({   "items": [
                        //                                         {
                        //                                             "id": selectedVariantId,
                        //                                             "quantity": 1
                        //                                         }
                        //                                         ]})
                        
                        //     window.location.href = window.location.origin + "/cart/checkout"
                        //     return
                        // })
    
    
                        newBuyNowBtnEle.on("click", async function (event) {
                            event.preventDefault();
                            event.stopPropagation();
                            glpro.$(this).attr("disabled", true);
                            newBuyNowBtnEle.text("loading checkout...");
                            setTimeout(() => { glpro.$(this).attr("disabled", false)}, 3000)
                            addToCartBtnEle =  glpro.$(document).find(glpro.selectors.addToCart)
                            sideCartEle = glpro.$(document).find(glpro.selectors.sideCartSelectors) 
    
                            // glpro.$(document).find("body").addClass("loadingCheckoutPage")
                            // glpro.$(document).find("body").text("loading checkout...")
    
                            if(sideCartEle && sideCartEle.length > 0){
                                sideCartEle.css("display", "none")
                            }
                            
                            if(addToCartBtnEle && addToCartBtnEle.length > 0){
                                addToCartBtnEle.trigger("click")
                            }

                            let selectedVariantId = glpro.f.getSelectedVariant()
                            let quantity = glpro.f.getProductQuantity()

                            let resAddToCart = await glpro.utility.addToCartV2({   "items": [
                                                                {
                                                                    "id": selectedVariantId,
                                                                    "quantity": quantity
                                                                }
                                                                ]})

                            setTimeout(()=>{
                                window.location.href = window.location.origin + "/cart/checkout"
                            },1000)
                            
                        })
                        
                    }
                },
                emailValidation: function (emailString) {
                        var atSymbol = emailString.indexOf("@");
                        if (atSymbol < 1) return false;
    
                        var dot = emailString.lastIndexOf(".");                    
                        if (dot <= atSymbol + 2) return false;
    
                        // check that the dot is not at the end
                        if (dot === emailString.length - 1) return false;
    
                        return true;
                },
                renderLanguageValue: function (parent) {
                    if (parent){
                        return parent.value;
                    }
                 return;
                },  
                slider: {
                    state: {
                        slideIndex: 0,
                    },
                    plusSlides: function (selector, n) {
                        this.showSlides(selector, this.state.slideIndex += n);
                    },
                    //minusSlides
                    minusSlides: function (selector, n) {
                        this.showSlides(selector, this.state.slideIndex -= n);
                    },
                    showSlides: function (selector, n) {
                        var i;
                        var slides = selector.find(".glproComboItemContainerItem1Img");
                        if (slides && slides.length) {
                            //     slides = JSON.parse(slides);
                            // }
    
    
                            if (n > slides.length) { this.state.slideIndex = 1 }
                            if (n < 1) { this.state.slideIndex = slides.length }
                            for (i = 0; i < slides.length; i++) {
                                slides[i].style.display = "none";
                            }
                            slides[this.state.slideIndex - 1].style.display = "block";
                            //   plusSlides(1)
                        }
                        // setTimeout(function () { plusSlides(n + 1) }, 2000);
                    },
                },
    
            },
            storage: {
    
                loadValuesFromStorage: function (settings) {
                    var glproGiftMessageCheckbox = sessionStorage.getItem("glproGiftMessageCheckbox");
                    var glproMessageTextarea = sessionStorage.getItem("glproMessageTextarea");
                    var glproGiftWrapCheckbox = sessionStorage.getItem("glproGiftWrapCheckbox");
                    var glproGiftOptionsPageEleCheckbox = sessionStorage.getItem("glproGiftOptionsPageEleCheckbox");
                    glpro.$('.glproMessageTextarea').val(glproMessageTextarea);
    
                    if (glproGiftMessageCheckbox === null) {
                        glpro.$('.glproGiftMessageCheckbox').prop('checked', true);
                    } else {
                        glpro.$('.glproGiftMessageCheckbox').prop('checked', glproGiftMessageCheckbox === "true");
                    }
    
                    if (glproGiftWrapCheckbox === null) {
                        glpro.$('.glproGiftWrapCheckbox').prop('checked', true);
                    } else {
                        glpro.$('.glproGiftWrapCheckbox').prop('checked', glproGiftWrapCheckbox === "true");
                    }
    
                    if (glproGiftOptionsPageEleCheckbox === null) {
    
                        glpro.elements.cartPageWrapperV2.find(".glproGiftOptionsPageEleCheckbox").prop('checked', false)
                        glpro.elements.productPageWrapperV2.find(".glproGiftOptionsPageEleCheckbox").prop('checked', false)
                        glpro.$(document).find(".glproGiftOptionsPageEleCheckbox").prop('checked', false)
                    } else {
                        glpro.elements.cartPageWrapperV2.find(".glproGiftOptionsPageEleCheckbox").prop('checked', glproGiftOptionsPageEleCheckbox === "true")
                        glpro.elements.productPageWrapperV2.find(".glproGiftOptionsPageEleCheckbox").prop('checked', glproGiftOptionsPageEleCheckbox === "true")
                        glpro.$(document).find(".glproGiftOptionsPageEleCheckbox").prop('checked', glproGiftOptionsPageEleCheckbox === "true")
    
                    }
    
                },
                setItem: function (field, value) {
                    sessionStorage.setItem(field, value)
                },
                getItem: function (field) {
                    return sessionStorage.getItem(field)
                }
            },
            drawerCart: {
                init: function (settings) {
                    glpro.cartPage.init(settings)
                }
            },
            themeSpecificCode: {
                init: function (settings) {
                    glpro.themeSpecificCode.f.ventureTheme(settings)
                    glpro.themeSpecificCode.f.expressTheme(settings)
                    glpro.themeSpecificCode.f.craveTheme(settings)
                    glpro.themeSpecificCode.f.craftTheme(settings)
                    glpro.themeSpecificCode.f.senseTheme(settings)
    
    
                },
    
                f: {
                    ventureTheme: function () {
                        if (window.Shopify && window.Shopify.theme && window.Shopify.theme.theme_store_id && window.Shopify.theme.theme_store_id == glpro.constants.themesIds.VENTURE_THEME) {
                            // reload on save
                            glpro.selectors.sideCartDrawerOverlay = ""
                        }
                    },
                    expressTheme: function () {
                        if (window.Shopify && window.Shopify.theme && window.Shopify.theme.theme_store_id && window.Shopify.theme.theme_store_id == glpro.constants.themesIds.EXPRESS_THEME) {
                            // addd a css property of jusyify-items:cetner to cartpagewrapper
                            glpro.elements.cartPageWrapperV2.css("justify-items", "center")
                            if (window.location.pathname.includes("/cart")) {
                                glpro.selectors.checkoutBtn = ".cart__actions"
                            }
                        }
                    },
                    craveTheme: function () {
                        if (window.Shopify && window.Shopify.theme && window.Shopify.theme.theme_store_id && window.Shopify.theme.theme_store_id == glpro.constants.themesIds.CRAVE_THEME) {
                            // change css of cart__ctas in the document to block
                            glpro.$(document).find(".cart__ctas").css("display", "block")
    
                        }
                    },
                    craftTheme: function () {
                        if (window.Shopify && window.Shopify.theme && window.Shopify.theme.theme_store_id && window.Shopify.theme.theme_store_id == glpro.constants.themesIds.CRAFT_THEME) {
                            // change css of cart__ctas in the document to block
                            glpro.$(document).find(".cart__ctas").css("display", "block")
    
                        }
                    },
                    senseTheme: function () {
                        if (window.Shopify && window.Shopify.theme && window.Shopify.theme.theme_store_id && window.Shopify.theme.theme_store_id == glpro.constants.themesIds.SENSE_THEME) {
                            // change css of cart__ctas in the document to block
                            glpro.$(document).find(".cart__ctas").css("display", "block")
    
                        }
                    },
    
                }
            },
            productPage: {
                init: async function (settings) {
                    console.log("productPage-init")
    
                    glpro.state.cartData = await glpro.utility.getCart()
                    // // glpro.state.insertWrapperOnPage.push("PRODUCT_PAGE")
    
                    // glpro.glproMessage.init(settings, "PRODUCT_PAGE")
    
                    // glpro.glproCombo.init(settings)
    
                    // glpro.glproGiftMsgAndWrap.init(settings, "PRODUCT_PAGE")
    
                    // glpro.glproOneClickUpsell.init(settings, "PRODUCT_PAGE")
                    glpro.gwmGiftMsgAndWrap.init(settings, "PRODUCT_PAGE")
                    glpro.gwmMessage.init(settings, "PRODUCT_PAGE")

                    // glpro.glproGiftCard.init(settings, "PRODUCT_PAGE")
    
                    // glpro.utility.cloneAddToCartBtn()
                    glpro.glproGiftOptionsPageEle.init(settings, "PRODUCT_PAGE")
                    // glpro.glproGiftWrap.init(settings, "PRODUCT_PAGE")

                },
                f: {
                    insertWrapperIntoPage: function (settings) {
    
                        if ("undefined" != typeof glpro.elements.addToCartBtn) {
                            let addToCartBtnEle = glpro.$(document).find(glpro.elements.addToCartBtn)
                            addToCartBtnEle.each(function (index) {
                                if (glpro.$(this).is(":visible")) {
                                    if(glpro.settings.app.addAfterAddTocartBtn){
                                        glpro.$(this).after(glpro.elements.productPageWrapperV2);
                                    }else{
                                        glpro.$(this).before(glpro.elements.productPageWrapperV2);
                                    }
                                    
                                }
    
                            });
                        }
                    },
                },
                 
                actions: {
                    insertUpsellModal: function () {
                        //   Gs.$("body").append(Gs.settings._modalHtml);
                        alert("popModal for upsell action")
                    },
                },
            },
            cartPage: {
                init: async function (settings) {
    
                    glpro.state.cartData = await glpro.utility.getCart()
                    glpro.gwmMessage.init(settings, "CART_PAGE")
                    // glpro.glproMessage.init(settings, "CART_PAGE")
    
                    // glpro.glproGiftMsgAndWrap.init(settings, "CART_PAGE")
    
                    // glpro.glproOneClickUpsell.init(settings, "CART_PAGE")
    
                    // glpro.glproFreeGiftCardPopup.init(settings, "CART_PAGE")
                    glpro.gwmGiftMsgAndWrap.init(settings, "CART_PAGE")

                    // glpro.glproGiftWrap.init(settings, "CART_PAGE")

                    //TODO
                    glpro.glproGiftOptionsPageEle.init(settings, "CART_PAGE")
                    
    
                },
                f: {
                    insertWrapperIntoPage: function (settings) {
                        return new Promise((res, rej) => {
                            if ("undefined" != typeof glpro.elements.checkoutBtn) {
                                let checkoutBtnEle = glpro.$(document).find(glpro.selectors.checkoutBtn)
                                checkoutBtnEle.each(function (index) {
                                    // console.log("index", index)
                                    if (glpro.$(this).is(":visible")) {
                                        // check if theme ids matches otherwise add element to default position
                                        if (window.Shopify && window.Shopify.theme && window.Shopify.theme.theme_store_id && window.Shopify.theme.theme_store_id == glpro.constants.themesIds.DAWN_THEME) {
                                            glpro.$(this).parent().before(glpro.elements.cartPageWrapperV2);
                                        } else if(glpro.settings.app.addAftercheckoutBtn) {
                                            glpro.$(this).after(glpro.elements.cartPageWrapperV2);
                                        }else{
                                            glpro.$(this).before(glpro.elements.cartPageWrapperV2);
                                        }
                                    }
                                });
    
                            }
                            res()
                        })
                    },
                },
                events: {
                    ajaxSuccess: function (cartSettings) {
                        console.log("register ajax success event")
                        glpro.$(document).ajaxSuccess(function (event, xhr, settings) {
                            console.log("ajaxSuccess", settings.url)
                            if (settings.url == "/change.js?line=1&quantity=0" || settings.url == "change.js?line=1&quantity=0" || settings.url == "change.js" || settings.url == "/change.js" || settings.url == "/cart.js" || settings.url == "cart.js" || settings.url == "cart" || settings.url == "/cart") {
                                setTimeout(function () {
                                    console.log("ajaxSuccess")
    
                                }, 2000);
                            }
                        });
                    }
                }
            },
            gwmGiftMsgAndWrap: {
                init: function (settings, parent) {
                    glpro.gwmGiftMsgAndWrap.initialize(settings, parent)
                    glpro.gwmGiftMsgAndWrap.events(settings)
                    // glpro.glproModel.init(settings)
                },
                initialize: function (settings, parent) {
                    let productHandle = glpro.f.getProductPageHandle(settings)
                    console.log("settings:",settings.giftwrap);
                    let {isEnabledOnProductPage, isEnabledOnCartPage} = glpro.gwmGiftMsgAndWrap.f.checkifGiftWrapEnabled(settings.giftwrap, productHandle, parent)
                    if (parent == "PRODUCT_PAGE" && isEnabledOnProductPage) {
                        glpro.gwmGiftMsgAndWrap.f.insertIntoProductPageWrapper(settings)
                        glpro.utility.overWriteBuyNowBtn()
                        glpro.state.isOverWriteBuyNowBtnTriggered = true
                    }
                    if (parent == "CART_PAGE" && (isEnabledOnCartPage)) {
                        glpro.gwmGiftMsgAndWrap.f.insertIntoCartPageWrapper(settings)
                    }

                    
                },
                f: {
                    insertIntoProductPageWrapper: function (settings) {
    
                        glpro.elements.productPageWrapperV2.find(".gwmGiftMsgAndWrapWrapper").css("display", "block")
    
                        // let productVairantId = glpro.settings.giftWrapProduct.productVairantID
                        let productVairantId = glpro.settings.giftwrap.productVariants[0].id

                        if (glpro.utility.checkIfItemPresentInCart(productVairantId)) {
                            glpro.elements.gwmGiftMsgAndWrapWrapperParent.find('.gwmGiftOptionsCheckbox').attr("checked", true)
                        }
    
                        // insert into parent element 
                        glpro.elements.gwmGiftMsgAndWrapWrapperParent.find(".gwmGiftMsgAndWrapWrapperInnerEleHeading").append(glpro?.settings?.languageData?.giftWrapOnPage?.giftWrapOnPageText || "<p>Add Gift Wrap</p>");    //cartPageText                   //cartPageText                 
    
                        // insert final  element into productPageWrapperV2
                        glpro.elements.productPageWrapperV2.find(".gwmGiftMsgAndWrapWrapper").append(glpro.elements.gwmGiftMsgAndWrapWrapperParent);
    
                    },
                   

                    insertIntoCartPageWrapper: function (settings) {
    
                        glpro.elements.cartPageWrapperV2.find(".gwmCartGiftMsgAndWrapWrapper").css("display", "block")
                        console.log("insertIntoCartPageWrapper")
                        let productVairantId = glpro.settings.giftwrap.productVariants[0].id
                        if (glpro.utility.checkIfItemPresentInCart(productVairantId)) {
                            glpro.elements.gwmCartGiftMsgAndWrapWrapperParent.find('.gwmGiftOptionsCheckbox').attr("checked", true)
                        }
    
                        // insert into parent element 
                        // glpro.elements.gwmCartGiftMsgAndWrapWrapperParent.find(".gwmGiftMsgAndWrapWrapperInnerEleHeading").append(settings.giftingOptions.shopifyPageinnerHTML);    //cartPageText 
                        
                        glpro.elements.gwmCartGiftMsgAndWrapWrapperParent.find(".gwmGiftMsgAndWrapWrapperInnerEleHeading").append(glpro?.settings?.languageData?.giftWrapOnPage?.giftWrapOnPageText|| "Add Gift Wrap");    //cartPageText              
    
                        // insert final  element into productPageWrapperV2
                        glpro.elements.cartPageWrapperV2.find(".gwmCartGiftMsgAndWrapWrapper").append(glpro.elements.gwmCartGiftMsgAndWrapWrapperParent);
    
                    },


                    isAddgwmGiftMsgAndWrapOnProductPage: function (settings) {
                        let flag = false
                        switch (settings.giftingOptions.enabledGifiting) {
                            case "PRODUCT_PAGES_AND_CART_PAGE":
                            case "PRODUCT_PAGES":
                                flag = true
                                break;
                        }
                        return flag
                    },
                    isAddgwmGiftMsgAndWrapOnCartPage: function (settings) {
                        let flag = false
                        switch (settings.giftingOptions.enabledGifiting) {
                            case "PRODUCT_PAGES_AND_CART_PAGE":
                            case "CART_PAGE":
                                flag = true
                                break;
                        }
                        return flag
                    },
                    checkifGiftWrapEnabled: function (giftWrapProduct, currProductHandle, parent) {
                        let isEnabledOnProductPage = false
                        let isEnabledOnCartPage = false

                        let whereToShow = glpro.settings.whereToShow;
                        if(!giftWrapProduct.isGiftWrapEnabledOnPage){
                            return {isEnabledOnProductPage, isEnabledOnCartPage}
                        }

                        if (whereToShow.isVisibleOnCart) {
                            isEnabledOnCartPage = true
                        }
                        //TODO
                        if (whereToShow.isVisibleOnAllProductPages) {
                            isEnabledOnProductPage = true
                        } else if (whereToShow.isVisibleOnSpecificProductPages &&
                                   whereToShow.visibleOnSpecificProductPages &&

                                   whereToShow.visibleOnSpecificProductPages.find(x => x.handle === currProductHandle)) {

                            isEnabledOnProductPage = true
                        }else if (whereToShow.isVisibleOnSpecificCollectionPages && 
                            whereToShow.visibleOnSpecificCollectionProductPages && 
                            whereToShow.visibleOnSpecificCollectionProductPages.length  && 
                            whereToShow.visibleOnSpecificCollectionProductPages.length > 0) {
                            let collectionsList = whereToShow.visibleOnSpecificCollectionProductPages
                            for(let i=0; i<collectionsList.length; i++){
                                let productList =collectionsList[i].productList
                                if(productList.find(x => x.handle === currProductHandle)){
                                    isEnabledOnProductPage = true
                                    break
                                }
                            }
                        }

                        // check exclude product pages
                        if (whereToShow.isExcludeOnSpecificProductPages &&  
                            whereToShow.excludeOnSpecificProductPages && 
                            whereToShow.excludeOnSpecificProductPages.length &&  
                            whereToShow.excludeOnSpecificProductPages.length > 0) {
                                
                            if (whereToShow.excludeOnSpecificProductPages.find(x => x.handle === currProductHandle)) {
                                isEnabledOnProductPage = false
                            }
                        }


                        return {isEnabledOnProductPage, isEnabledOnCartPage}
                    }
                },
                events: function (settings) {
                        glpro.$(document).on("click", ".gwmGiftOptionsCheckbox", async function (event) {
                            await glpro.gwmGiftMsgAndWrap.action.handlegwmGiftOptionsCheckboxEvent(event);
                            
                            if (glpro.state.page_type == "cart") {
                                window.location.reload()
                                //turn off click events till the page loads
                                glpro.$("body").css("pointer-events", "none")
                            }
                        })

                    
                },
                action: {
                    syncWrapperCheckBoxState: function () {

                        let gwmGiftOptionsCheckbox = glpro.storage.getItem("gwmGiftOptionsCheckbox");
                        let glproGiftMessageCheckbox = sessionStorage.getItem("gwmGiftOptionsCheckbox");
                        let glproGiftWrapCheckbox = sessionStorage.getItem("gwmGiftOptionsCheckbox");

                        let gwmGiftOptionsCheckboxValue = false
                        // check if all null, keep it chekc
                        if (glproGiftMessageCheckbox === null && glproGiftWrapCheckbox === null) {
                            gwmGiftOptionsCheckboxValue = false
                        } else if ((glproGiftMessageCheckbox === "true" ? true : false) || (glproGiftWrapCheckbox === "true" ? true : false)) {
                            gwmGiftOptionsCheckboxValue = true
                        } else {
                            gwmGiftOptionsCheckboxValue = false
                        }

                        glpro.elements.cartPageWrapperV2.find(".gwmGiftOptionsCheckbox").prop('checked', gwmGiftOptionsCheckboxValue)
                        glpro.elements.productPageWrapperV2.find(".gwmGiftOptionsCheckbox").prop('checked', gwmGiftOptionsCheckboxValue)
                        glpro.$(document).find(".gwmGiftOptionsCheckbox").prop('checked', gwmGiftOptionsCheckboxValue)

                    },

                    setWrapperCheckBoxState: function (value) {
                        glpro.elements.cartPageWrapperV2.find(".gwmGiftOptionsCheckbox").prop('checked', value)
                        glpro.elements.productPageWrapperV2.find(".gwmGiftOptionsCheckbox").prop('checked', value)
                        glpro.$(document).find(".gwmGiftOptionsCheckbox").prop('checked', value)
                    },
                    handlegwmGiftOptionsCheckboxEvent: async function (cb) {
                        if (cb && cb.target) {
                            window.giftwrapEvent = cb
                            let productVairantId = glpro.settings.giftwrap.productVariants[0].id
                            //if true 
                            if (cb.target.checked) {
                                glpro.$(document).find('.gwmGiftOptionsCheckbox').each(function () {glpro.$(this).attr("checked", true)})
                                await glpro.utility.updateCart({ updates: { [productVairantId]: 1 } })
                            }
                            else {
                                glpro.$(document).find('.gwmGiftOptionsCheckbox').each(function () {glpro.$(this).attr("checked", false)})
                                await glpro.utility.updateCart({ updates: { [productVairantId]: 0 } })
                                glpro.$(document).find('.gwmGiftOptionsCheckbox').attr("checked", false)
                            }

                        }

                    }

                }
            },
            gwmMessage:{
                init: function (settings, parent) {
                    glpro.gwmMessage.initialize(settings, parent)
                },
                initialize: function (settings, parent) {
                    let productHandle = glpro.f.getProductPageHandle(settings)
                    let {isEnabledOnProductPage, isEnabledOnCartPage} = glpro.gwmMessage.f.checkifGiftMessageEnabled(settings.giftMessage, productHandle, parent)
    
                    if (parent == "PRODUCT_PAGE" && isEnabledOnProductPage){
                        // let oneClickUpsellProductPageHTML = glpro.gwmOneClickUpsell.f.prepareUI(settings, variantListToBeShownOnProductPage, parent)
                        let giftMessageProductPageHTML = glpro.gwmMessage.f.prepareUI(settings, productHandle, parent)
                        glpro.gwmMessage.f.insertIntoProductPageWrapper(settings, giftMessageProductPageHTML)
                        glpro.utility.overWriteBuyNowBtn()
                        glpro.state.isOverWriteBuyNowBtnTriggered = true
                    }
    
                    if (parent == "CART_PAGE" && isEnabledOnCartPage && productHandle == "undefined"){
                        let giftMessageCartPageHTML = glpro.gwmMessage.f.prepareUI(settings, productHandle, parent)
                        glpro.gwmMessage.f.insertIntoCartPageWrapper(settings, giftMessageCartPageHTML)
                    }
    
                    
                },
                f: {
                    checkifGiftMessageEnabled: function (giftMessage, currProductHandle, parent) {
                        let isEnabledOnProductPage = false
                        let isEnabledOnCartPage = false
                        let whereToShow = glpro.settings.whereToShow;
                        if(!giftMessage.isGiftMessageEnabledOnPage){
                            return {isEnabledOnProductPage, isEnabledOnCartPage}
                        }
                        
                        if (whereToShow.isVisibleOnCart) {
                            isEnabledOnCartPage = true
                        }
                        
                        if (whereToShow.isVisibleOnAllProductPages) {
                            isEnabledOnProductPage = true
                        } else if (whereToShow.isVisibleOnSpecificProductPages &&
                                   whereToShow.visibleOnSpecificProductPages &&
                                   whereToShow.visibleOnSpecificProductPages.find(x => x.handle === currProductHandle)) {
    
                            isEnabledOnProductPage = true
                        }
                        if (whereToShow.isVisibleOnSpecificCollectionPages && 
                                    whereToShow.visibleOnSpecificCollectionProductPages && 
                                    whereToShow.visibleOnSpecificCollectionProductPages.length  && 
                                    whereToShow.visibleOnSpecificCollectionProductPages.length > 0) {

                                let collectionsList = whereToShow.visibleOnSpecificCollectionProductPages
                                for(let i=0; i<collectionsList.length; i++){
                                    let productList =collectionsList[i].productList
                                    if(productList.find(x => x.handle === currProductHandle)){
                                        isEnabledOnProductPage = true
                                        break
                                    }
                                }
                        }

                        // check exclude product pages
                        if (whereToShow.isExcludeOnSpecificProductPages &&  
                            whereToShow.excludeOnSpecificProductPages && 
                            whereToShow.excludeOnSpecificProductPages.length &&  
                            whereToShow.excludeOnSpecificProductPages.length > 0) {

                            if (whereToShow.excludeOnSpecificProductPages.find(x => x.handle === currProductHandle)) {
                                isEnabledOnProductPage = false
                            }
                        }
    
                        return {isEnabledOnProductPage, isEnabledOnCartPage}
                    },
                    prepareUI:  function(settings, currProductHandle, parent){
                        let gwmGiftMessageContainer = glpro.$("<div>").addClass('gwmGiftMessageContainer')
    
                        let gwmGiftMessageItemContainer = glpro.$("<div>").addClass('gwmGiftMessageItemContainer')
                        let gwmGiftMessageTextArea = glpro.$("<textarea>").addClass('gwmGiftMessageTextArea')
                                                                        .attr("placeholder",glpro?.settings?.languageData?.giftMessageOnPage?.giftMessageOnPagePlaceholderText || "Add Gift Message" )
                                                                        
                        
                        if(glpro.settings.app.gwmGiftMessageTextAreaKeepOpen){
                            gwmGiftMessageTextArea.css("display", "block")
                        }   
                        
                        let gwmGiftMessageCounterEle = glpro.$("<div>").addClass("gwmGiftMessageCounterEle")

                        let giftMessageCharacterLimit = glpro.settings.giftMessage.giftMessageCharacterLimit
                        
                        if(giftMessageCharacterLimit){
                            gwmGiftMessageTextArea.attr("maxlength", giftMessageCharacterLimit)
                        }


                        let gwmGiftMessageItemContainerCheckboxLable = glpro.$("<label>").addClass('gwmCustomCheckboxMsgContainer')
                        let inputCheckboxEle = glpro.$("<input>").addClass('gwmGiftMessageInputCheckboxEle')
                            .attr("type", "checkbox")
    
                        if (glpro.utility.getNoteFromCart()) {
                            inputCheckboxEle.attr("checked", true)
                            let noteVal = glpro.utility.getNoteFromCart()
                            gwmGiftMessageTextArea.val(noteVal)
                        }
    
                       
                        
                        
                        gwmGiftMessageItemContainerCheckboxLable.append(inputCheckboxEle)
                        gwmGiftMessageItemContainerCheckboxLable.append(glpro.$("<span>").addClass("gwmCustomMsgCheckboxCheckmark"))
    
    
                        //create a div with appendString 
                        let gwmGiftMessageItemContainerLableText = glpro.$("<div>").addClass('gwmGiftMessageItemContainerLabelText')
                                                                    .html(glpro?.settings?.languageData?.giftMessageOnPage?.giftMessageOnPageHeadingLabel)
                        gwmGiftMessageItemContainerCheckboxLable.append(gwmGiftMessageItemContainerLableText)
                        gwmGiftMessageItemContainer.append(gwmGiftMessageItemContainerCheckboxLable)
                        gwmGiftMessageContainer.append(gwmGiftMessageItemContainer)
    
    
                        
    
                        gwmGiftMessageContainer.append(gwmGiftMessageTextArea)

                        if(giftMessageCharacterLimit){
                            gwmGiftMessageContainer.append(gwmGiftMessageCounterEle)
                        }

                        
    
                        glpro.$(document).on("click", ".gwmGiftMessageInputCheckboxEle",async (e)=>{
                            // window.eventCick = e
                            // let isChecked = glpro.$(e.currentTarget).find(".gwmGiftMessageInputCheckboxEle").is(":checked")
                            // if(glpro.$(this).prop('checked') == true){
                            //     console.log("gwmCustomCheckboxMsgContainer")
                            // }
                            if(!e.currentTarget.checked){
                                let updateCartData = {  }
                                if(!glpro.settings.app.removeGiftNoteFromNote){
                                    updateCartData.note = null
                                }
                                updateCartData.attributes = {"glproGiftMessage": ""}
                                await glpro.utility.updateCart(updateCartData)
                                // if(glpro.$(".gwmGiftMessageTextArea")){
                                //     glpro.$(".gwmGiftMessageTextArea").val("")
                                // } 
                                
                            }else{
                                // if(glpro.$(".gwmGiftMessageTextArea")){
                                //     let updateCartData = {  }
                                //     updateCartData.note = glpro.$(".gwmGiftMessageTextArea").val()
                                //     await glpro.utility.updateCart(updateCartData)
                                // } 
                            }
                            glpro.$(document).find('.gwmGiftMessageTextArea').css("display", "block")
                        })
    
                        glpro.$(document).on("keyup ", ".gwmGiftMessageTextArea", ((event)=>{glpro.gwmMessage.action.onGiftMessageTextAreakeyup(event,settings, parent)}))
                        glpro.$(document).on("input ", ".gwmGiftMessageTextArea", ((e)=>{
                                
                                const target = e.target;
                                // Get the `maxlength` attribute
                                const maxLength = target.getAttribute('maxlength');
                            
                                // Count the current number of characters
                                const currentLength = target.value.length;
                                if(maxLength && currentLength){
                                    gwmGiftMessageCounterEle.text(`${currentLength}/${maxLength}`);                       
                                }
                            }))

                        return gwmGiftMessageContainer    
                    },
                    insertIntoProductPageWrapper: function (settings, giftMessageHTML) {
    
                        glpro.elements.productPageWrapperV2.find(".gwmGiftMessageWrapper").css("display", "block")
    
                        // // insert into parent element 
                        // glpro.elements.gwmGiftMsgAndWrapWrapperParent.find(".gwmGiftMsgAndWrapWrapperInnerEle").append(settings.giftingOptions.shopifyPageinnerHTML);    //cartPageText                 
    
                        // insert final  element into productPageWrapperV2
                        glpro.elements.productPageWrapperV2.find(".gwmGiftMessageWrapper").append(giftMessageHTML);
    
                    },
                    insertIntoCartPageWrapper: function (settings, giftMessageHTML) {
    
                        glpro.elements.cartPageWrapperV2.find(".gwmCartGiftMessageWrapper").css("display", "block")
    
                        // insert into parent element 
                        // glpro.elements.gwmCartGiftMsgAndWrapWrapperParent.find(".gwmGiftMsgAndWrapWrapperInnerEle").append(settings.giftingOptions.shopifyPageinnerHTML);    //cartPageText                 
    
                        // insert final  element into productPageWrapperV2
                        // glpro.elements.cartPageWrapperV2.find(".gwmCartUpsellWrapper").append(glpro.elements.gwmCartGiftMsgAndWrapWrapperParent);
                        glpro.elements.cartPageWrapperV2.find(".gwmCartGiftMessageWrapper").append(giftMessageHTML);
    
                    },
                },
                action: {
                    onGiftMessageTextAreakeyup: function (event,settings, parent){
                            let giftMessageValue = event.target.value
                            let updateCartData = {  }
                            if(!glpro.settings.app.removeGiftNoteFromNote){
                                updateCartData.note = giftMessageValue
                            }
                           
                            updateCartData.attributes = {"glproGiftMessage": giftMessageValue}
                            if(glpro.state.timer){
                              clearTimeout(glpro.state.timer);
                              glpro.state.timer  = undefined
                            }
                            
                            glpro.state.timer = setTimeout(()=>{
                                               glpro.utility.updateCart(updateCartData).then((data) => {
                                                                 console.log("gift message updated")
                                                            })
                                               },1000)
    
                            // glpro.utility.updateCart(updateCartData).then((data) => {
                            // //    console.log("gift message updated")
                            // })
                    }
                }
            
            },
        

           
            glproOneClickUpsell: {
                init: async function (settings, parent) {
                    await glpro.glproOneClickUpsell.initialize(settings, parent)
                    glpro.glproOneClickUpsell.f.registerEvents()
                },
                initialize: async function (settings, parent) {
                    let productHandle = glpro.f.getProductPageHandle(settings)
    
                    // write function which return two list 
                    // oneClickUpsell products that need to be shown on this product page 
                    // get the list of oneClickUpsellProducts that need to be shown on cart page 
                    let { oneClickUpsellListForCartPage, oneClickUpsellListForProductPage } = glpro.glproOneClickUpsell.f.segregateOneClickUpsells(settings.oneClickUpsells, productHandle)
    
                    if (parent == "PRODUCT_PAGE" && oneClickUpsellListForProductPage && oneClickUpsellListForProductPage.length && oneClickUpsellListForProductPage.length > 0) {
                        let variantListToBeShownOnProductPage = await glpro.glproOneClickUpsell.f.findVariantListToBeShown(oneClickUpsellListForProductPage)
                        let oneClickUpsellProductPageHTML = glpro.glproOneClickUpsell.f.prepareUI(settings, variantListToBeShownOnProductPage, parent)
                        glpro.glproOneClickUpsell.f.insertIntoProductPageWrapper(settings, oneClickUpsellProductPageHTML)
                        console.log("variantListToBeShownOnProductPage", variantListToBeShownOnProductPage)
                        glpro.utility.overWriteBuyNowBtn()
                        glpro.state.isOverWriteBuyNowBtnTriggered = true
                        console.log("PRODUCT_PAGE")
                    }
    
                    if (parent == "CART_PAGE" && oneClickUpsellListForCartPage && oneClickUpsellListForCartPage.length && oneClickUpsellListForCartPage.length > 0) {
                        let variantListToBeShownOnCartPage = await glpro.glproOneClickUpsell.f.findVariantListToBeShown(oneClickUpsellListForCartPage)
                        let oneClickUpsellCartPageHTML = glpro.glproOneClickUpsell.f.prepareUI(settings, variantListToBeShownOnCartPage, parent)
                        glpro.glproOneClickUpsell.f.insertIntoCartPageWrapper(settings, oneClickUpsellCartPageHTML)
                        console.log("variantListToBeShownOnCartPage", variantListToBeShownOnCartPage)
                        console.log("CART_PAGE")
                    }
    
                },
                f: {
    
                    segregateOneClickUpsells: function (oneClickUpsells, currProductHandle) {
                        let oneClickUpsellListForCartPage = []
                        let oneClickUpsellListForProductPage = []
    
                        for (let i = 0; i < oneClickUpsells.length; i++) {
                            let oneClickUpsell = oneClickUpsells[i]
    
                            // add products to cart page list
                            if (oneClickUpsell.isVisibleOnCart) {
                                oneClickUpsellListForCartPage.push(oneClickUpsell)
                            }
    
                            // add products to product page list 
                            if (oneClickUpsell.isVisibleOnAllProductPages) {
    
                                oneClickUpsellListForProductPage.push(oneClickUpsell)
    
                            } else if (oneClickUpsell.isVisibleOnSpecificProductPages &&
                                oneClickUpsell.visibleOnSpecificProductPages &&
                                oneClickUpsell.visibleOnSpecificProductPages.find(x => x.handle === currProductHandle)) {
    
                                oneClickUpsellListForProductPage.push(oneClickUpsell)
                            }
    
                        }
    
                        return {
                            oneClickUpsellListForCartPage: oneClickUpsellListForCartPage,
                            oneClickUpsellListForProductPage: oneClickUpsellListForProductPage
                        }
                    },
                    findVariantListToBeShown: async function (oneClickUpsellList) {
                        let responseData = []
    
                        let variantListSelectedByUser = []
                        let apiCalls = []
    
                        for (let i = 0; i < oneClickUpsellList.length; i++) {
                            let oneClickUpsell = oneClickUpsellList[i]
    
                            for (let j = 0; j < oneClickUpsell.upsellProducts.length; j++) {
                                let oneClickUpsellProduct = oneClickUpsell.upsellProducts[j]
                                apiCalls.push(glpro.utility.getProductDataV2(oneClickUpsellProduct.handle))
    
                                for (let k = 0; k < oneClickUpsellProduct.variants.length; k++) {
                                    variantListSelectedByUser.push(parseInt(oneClickUpsellProduct.variants[k].variantId))
                                }
                            }
    
                        }
    
                        let oneClickUpsellProducts = await Promise.all(apiCalls)
                        // get required variants and return 
                        for (let i = 0; i < oneClickUpsellProducts.length; i++) {
                            let oneClickUpsellProduct = oneClickUpsellProducts[i]
    
                            if (!oneClickUpsellProduct) {
                                continue
                            }
    
                            for (let j = 0; j < oneClickUpsellProduct.variants.length; j++) {
                                let variant = oneClickUpsellProduct.variants[j]
                                //if variant.featured_image is null then take the onceClickUpsellProduct.featured_image
                                if (variant.featured_image) {
                                    variant.featured_image = variant.featured_image.src
                                } else {
                                    variant.featured_image = oneClickUpsellProduct.featured_image
                                }
                                //console.log("ashfaq");
                                // if variant is not available dont add it
                                if (!variant.available) {
                                    continue
                                }
    
                                // if variant is not selected in admin ui, dont add it
                                if (variantListSelectedByUser.indexOf(variant.id) == -1) {
                                    continue
                                }
    
                                responseData.push(variant)
    
                            }
                        }
    
                        return responseData
    
                    },
                    insertIntoProductPageWrapper: function (settings, oneClickUpsellHTML) {
    
                        glpro.elements.productPageWrapperV2.find(".glproProductPageUpsellWrapper").css("display", "block")
    
                        // // insert into parent element 
                        // glpro.elements.gwmGiftMsgAndWrapWrapperParent.find(".glproGiftOptionsPageEleInnerEle").append(settings.giftingOptions.shopifyPageinnerHTML);    //cartPageText                 
    
                        // insert final  element into productPageWrapperV2
                        glpro.elements.productPageWrapperV2.find(".glproProductPageUpsellWrapper").append(oneClickUpsellHTML);
    
                    },
                    insertIntoCartPageWrapper: function (settings, oneClickUpsellHTML) {
    
                        glpro.elements.cartPageWrapperV2.find(".glproCartUpsellWrapper").css("display", "block")
    
                        // insert into parent element 
                        // glpro.elements.glproCartGiftMsgAndWrapWrapperParent.find(".glproGiftOptionsPageEleInnerEle").append(settings.giftingOptions.shopifyPageinnerHTML);    //cartPageText                 
    
                        // insert final  element into productPageWrapperV2
                        // glpro.elements.cartPageWrapperV2.find(".glproCartUpsellWrapper").append(glpro.elements.glproCartGiftMsgAndWrapWrapperParent);
                        glpro.elements.cartPageWrapperV2.find(".glproCartUpsellWrapper").append(oneClickUpsellHTML);
    
                    },
                    prepareUI: function (settings, variantListToBeShown, parent) {
                        let glproOneClickUpsellContainer = glpro.$("<div>").addClass('glproOneClickUpsellContainer')
    
                        for (let i = 0; i < variantListToBeShown.length; i++) {
                            let variant = variantListToBeShown[i]
                            let glproOneClickUpsellItemContainer = glpro.$("<div>").addClass('glproOneClickUpsellItemContainer')
                            let glproOneClickUpsellItemContainerCheckboxLable = glpro.$("<label>").addClass('glproCustomCheckboxContainer')
                            let inputCheckboxEle = glpro.$("<input>").addClass('glproOneClickUpsellInputCheckboxEle')
                                .attr("type", "checkbox")
                                .attr("data-variant", JSON.stringify(variant))
                                .attr("data-parent", JSON.stringify(parent))
                                
                            // if (glpro.utility.checkIfItemPresentInCart(variant.id)) {
                            //     inputCheckboxEle.attr("checked", true)
                            // }
                            let glproOneClickUpsellImage = glpro.$("<img>").addClass('glproOneClickUpsellImage')
                                .attr("src", variant.featured_image)
                            glproOneClickUpsellImage.css("width", "40px")
                            glproOneClickUpsellImage.css("height", "40px")
                            glproOneClickUpsellImage.css("justify-self", "right")
    
                            glproOneClickUpsellItemContainerCheckboxLable.append(inputCheckboxEle)
                            glproOneClickUpsellItemContainerCheckboxLable.append(glpro.$("<span>").addClass("glproCustomCheckboxCheckmark"))
    
    
                            let appendString = "" + variant.name
                            let price = variant.price > 0 ? parseFloat(variant.price / 100) : variant.price
                            if (settings.merchantInfo && settings.merchantInfo.currencyInfo && settings.merchantInfo.currencyInfo.symbol) {
                                appendString = appendString + " + " + settings.merchantInfo.currencyInfo.symbol + price
                            }
                            //create a div with appendString 
                            let glproOneClickUpsellItemContainerLableText = glpro.$("<div>").addClass('glproOneClickUpsellItemContainerLabelText')
                                .text(appendString)
                            glproOneClickUpsellItemContainerCheckboxLable.append(glproOneClickUpsellItemContainerLableText)
                            glproOneClickUpsellItemContainer.append(glproOneClickUpsellItemContainerCheckboxLable)
                            glproOneClickUpsellItemContainerCheckboxLable.append(glproOneClickUpsellImage)
                            glproOneClickUpsellContainer.append(glproOneClickUpsellItemContainer)
                        }
    
                        return glproOneClickUpsellContainer
                    },
                    registerEvents: function () {
                        glpro.$(document).on("click", ".glproOneClickUpsellInputCheckboxEle", async function (event) {
                            await glpro.glproOneClickUpsell.actions.handleOneClickUpsellOnChangEvent(event);
                            //glproPage type is cartPage then reload page
                            if (glpro.state.page_type == "cart") {
                                window.location.reload()
                                //turn off click events till the page loads
                                glpro.$("body").css("pointer-events", "none")
                            }
                        })
                    }
                },
                actions: {
                    //TODO
                    handleOneClickUpsellOnChangEvent: async function (cb) {
                        if (cb && cb.target) {
                            let variant = JSON.parse(cb.target.getAttribute("data-variant"))
                            let parent = cb.target.getAttribute("data-parent")
    
                            // if true 
                            if (cb.target.checked) {
                                await glpro.utility.updateCart({ updates: { [variant.id]: 1 }, attributes:{[variant.id]:"glproOneClickUpsellBuy"}})
                            }
                            else {
                                await glpro.utility.updateCart({ updates: { [variant.id]: 0 }, attributes:{[variant.id]:""} })
                            }
    
                        }
    
                    }
                }
    
            },
            glproGiftMessageV2: {
                state:{
                    giftMessage:"",
                    giftMessageIsChange:false,
                    giftCardDeliveryOption: "sendNow",
                    giftCardDeliveryDateEnabled: false,
                    glproGiftCardDatePicker: false

                },
                init: function (settings, parent) {
                    glpro.glproGiftMessageV2.initialize();
                },
                initialize: async function () {
                    // let giftMessageV2HTML 
                    //create a div 
                    let giftMessageV2MainContent = glpro.$("<div>").addClass("giftMessageV2MainContent");
                    let giftMessageSubtext = glpro.$("<div>").addClass("giftMessageSubtext");
                    let glproGiftMessageV2HTML = glpro.$("<div>").addClass('glproGiftMessageV2HTML')
                    glproGiftMessageV2HTML.append(glpro.glproGiftMessageV2.f.prepareUI());
                    // glpro.$(".glproModalContent").html(glproGiftMessageV2HTML);
                    
                    //TODO: Gift Message Subtext
                    giftMessageSubtext.html(glpro.utility.renderLanguageValue(glpro.settings.languageData?.additionalFields?.giftMessageSubtext));
                    if(giftMessageSubtext && giftMessageSubtext.html().length>0){
                        glpro.f.applyLabelCSS(giftMessageSubtext);
                        giftMessageV2MainContent.append(giftMessageSubtext);
                    }
                    giftMessageV2MainContent.append(glproGiftMessageV2HTML);

                    let giftMessageV2Buttons = await glpro.glproGiftMessageV2.f.renderButtons();


                    glpro.$(".giftMessageBody").append(giftMessageV2MainContent);
                    glpro.$(".giftMessageBody").append(giftMessageV2Buttons);
                   
                    glpro.glproVideoMsg.init(glpro.settings);
                },
                f:{
                    prepareUI : function (){
                        // let glproGiftMessageV2 = glpro.$(".glproGiftMessageV2Content");
                        //create a div glproGiftMessageV2Content 
                        let glproGiftMessageV2 = glpro.$("<div>").addClass('glproGiftMessageV2')
                        // a label field
                        let glproGiftMessageV2Label = glpro.$("<label>").addClass("glproGiftMessageV2Label").attr("for", "glproGiftMessageV2").text(glpro.settings?.languageData?.giftMessage?.giftMessageHeadingLabel || "giftnote ");
                        let glproGiftMessageV2InputField = glpro.$("<textarea>").addClass("glproGiftMessageV2InputField").attr("placeholder", glpro.settings?.languageData?.giftMessage?.giftMessagePlaceholderText || "Placeholder")
                        let glproGiftMessageCounterEle = glpro.$("<div>").addClass("glproGiftMessageCounterEle")
                        let glproVideoMsgButton;
    
                        ///save the input field values
                        glproGiftMessageV2InputField.on("change", function (event) {
                            glpro.glproGiftMessageV2.state.giftMessage = glproGiftMessageV2InputField.val();
                            glpro.glproGiftMessageV2.state.giftMessageIsChange =  true
                        })
                        
                        //get giftMessageCharacterLimit
                        let giftMessageCharacterLimit = glpro.settings.giftMessage.giftMessageCharacterLimit
                        if(giftMessageCharacterLimit){
                            glproGiftMessageV2InputField.attr("maxlength", giftMessageCharacterLimit)
                        }
                        
                        if (glpro.utility.getNoteFromCart()) {
                            let noteVal = glpro.utility.getNoteFromCart();
                            glproGiftMessageV2InputField.val(noteVal)
                            
                            //trigger on input event
                            // glproGiftMessageV2InputField.trigger("input")
                            const maxlength = glproGiftMessageV2InputField.attr("maxlength");
                            const currentLength = glproGiftMessageV2InputField.val().length;

                            glproGiftMessageCounterEle.text(currentLength + "/" + maxlength);

                        }

                         glproGiftMessageV2InputField.on('input', function (e) {
                            const target = e.target;
                        
                            // Get the `maxlength` attribute
                            const maxLength = target.getAttribute('maxlength');
                        
                            // Count the current number of characters
                            const currentLength = target.value.length;
                        
                            glproGiftMessageCounterEle.text(`${currentLength}/${maxLength}`);
                        });



                        glpro.f.applyLabelCSS(glproGiftMessageV2Label)
    
                        // create an empty divider to separate the message and the video message button
                        let glproGiftMessageV2Divider = glpro.$("<div>").addClass("glproGiftMessageV2Divider")
                        let glproGiftMessageV2Divider2 = glpro.$("<div>").addClass("glproGiftMessageV2Divider2")
                        let glproVideoMsgCheckboxWrapper;
                        let glproVideoMsgCheckboxLabel;
                        //TODO: video message entry index   
                        if(glpro.settings.videoMessage.isVideoMessageEnabled){
                            //glproVideoMsgButton  = glpro.$("<button>").addClass("glproVideoMsgButton").attr("type", "button").text(glpro.settings.languageData.videoMessage.sendVideoMessageText.value);
                            glproVideoMsgButton  = glpro.$("<button>").addClass("glproVideoMsgButton").attr("type", "button").text("Video Msg");
                            glproVideoMsgCheckboxLabel = glpro.$("<label>").addClass("glproVideoMsgCheckboxLabel").attr("for", "glproVideoMsgCheckbox").text("Record Video"||glpro.utility.renderLanguageValue(glpro.settings.languageData.videoMessage.recordVideoLabel));
                            // create a label with switch classname
                            
                            // glpro.f.applyLabelCSS(glproVideoMsgCheckboxLabel)
                            
                            glproVideoMsgCheckboxWrapper = glpro.$("<label>").addClass("glproVideoMsgCheckboxWrapper").attr("for", "glproVideoMsg")
    
                            //input which is type of checkbox
                            let glproVideoMsgCheckboxField = glpro.$("<input>").addClass("glproVideoMsgCheckboxField").attr("type", "checkbox").attr("id", "glproVideoMsg");
    
                            // a span which is round and slider css
                            let glproVideoMsgSlider = glpro.$("<span>").addClass("glproVideoMsgSlider").attr("id", "glproVideoMsgSlider");
                            
                            glproVideoMsgCheckboxField.on("change", function(event){
                                if(glproVideoMsgCheckboxField.is(":checked")){  
                                    console.log("it is checked");
                                    glpro.glproVideoMsg.actions.glproVideoMsgButton(event);
                                }else{
                                    glproVideoMsgSlider.removeClass("glproVideoMsgSliderActive")
                                    glpro.glproVideoMsg.f.clickClose(event);
                                }
                            })
                            glproVideoMsgCheckboxWrapper.append(glproVideoMsgCheckboxField)
                            glproVideoMsgCheckboxWrapper.append(glproVideoMsgSlider)

                        }else if(glpro?.settings?.isEmailEnabled != true){
                            glproGiftMessageV2InputField.addClass("glproGiftMessageV2InputFieldNoVideo")
                        }
                        // glproGiftMessageV2InputField and glproGiftMessageV2Label are added to same parent div
                        let glproVideoMessageCheckboxRow = glpro.$("<div>").addClass("glproVideoMessageCheckboxRow")
                        glpro.f.applyLabelCSS(glproVideoMsgCheckboxLabel)
                        glproVideoMessageCheckboxRow.append(glproVideoMsgCheckboxLabel).append(glproVideoMsgCheckboxWrapper)
                        
                        let glproGiftMessageV2InputFieldsDiv = glpro.$("<div>").addClass("glproGiftMessageV2InputFieldsDiv")
                        glproGiftMessageV2InputFieldsDiv.append(glproGiftMessageV2Label).append(glproGiftMessageV2InputField)
                        
                        if(giftMessageCharacterLimit){
                            glproGiftMessageV2InputFieldsDiv.append(glproGiftMessageCounterEle)
                        }
                        
                        // glproGiftCardModalBackButton = glpro.glproGiftCard.f.prepareBackButton(glpro.glproGiftCard.f.displayGiftCardDetailsForm);
                        // glproGiftMessageV2.append(glproGiftCardModalBackButton);
                        let glproGiftCardDateLabel  = ""
                        let glproGiftCardDatePicker = ""
                        let glproVideoMsgEmailField = ""
                        let giftMessageDeliveryInfo = ""
                        let glproGiftMessageEmailLabel = ""
                        let glproGiftMessageEmailDiv = ""
                        if(glpro?.settings?.isEmailEnabled){
                           //introduce an input field to enter the email address
                            glproGiftMessageEmailDiv  = glpro.$("<div>").addClass("glproGiftMessageEmailDiv")
                            glproGiftMessageEmailLabel = glpro.$("<label>").addClass("glproGiftMessageEmailLabel").attr("for", "glproVideoMsgEmailField").text(glpro.utility.renderLanguageValue(glpro?.settings?.languageData?.videoMessage?.recipientEmailAddressLabel) || "Recipient Email Address");
                            glproVideoMsgEmailField = glpro.$("<input>").addClass("glproVideoMsgEmailField").attr("type", "email").attr("placeholder", glpro.utility.renderLanguageValue(glpro?.settings?.languageData?.videoMessage?.emailPlaceholder) || "Enter Recipient Email Address");
                            glproGiftMessageEmailDiv.append(glproGiftMessageEmailLabel).append(glproVideoMsgEmailField)
                           
                            glpro.f.applyLabelCSS(glproGiftMessageEmailLabel)
                            if(glpro.utility.isCartEmpty() == false && glpro.utility.getAttributValueFromCart("RecipientEmail") != null){
                               let value = glpro.utility.getAttributValueFromCart("RecipientEmail");
                               glproVideoMsgEmailField.val(value)
                           }

                    
                           glproVideoMsgEmailField.on("change", function(event){
                               glpro.glproVideoMsg.state.emailId = glproVideoMsgEmailField.val();
                               glpro.glproVideoMsg.state.emailIdIsChange = true
                           })

                            giftMessageDeliveryInfo = glpro.$("<div>").addClass("giftMessageDeliveryInfo").text(glpro.utility.renderLanguageValue(glpro?.settings?.languageData?.videoMessage?.giftMessageNote)|| "Note: We'll send an email to the recipient with the Gift Message!");

                            // Add date field  -----------------------------------------------
                            glpro.glproGiftMessageV2.state.giftCardDeliveryDateEnabled =  true
                           
                            glproGiftCardDatePicker = glpro.$("<input>").attr("type", "date").addClass("glproGiftCardDatePicker"); 
                            glproGiftCardDatePicker.attr("value", new Date().toISOString().slice(0, 10));                           
                            glproGiftCardDatePicker.attr("max", new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
                           
                            glpro.glproGiftMessageV2.state.glproGiftCardDatePicker = glproGiftCardDatePicker

                            glproGiftCardDateLabel = glpro.$("<label>").addClass("glproGiftCardDateLabel").html(glpro.utility.renderLanguageValue( glpro?.settings?.languageData?.videoMessage?.emailLabel)|| "Email Delivery Date")

                            glpro.f.applyLabelCSS(glproGiftCardDateLabel)

                           // create two buttons, detailing Delivery Options
                           let glproDeliveryOptions = glpro.$("<div>").addClass("glproDeliveryOptions")
                           let glproGiftCardSendNowButton = glpro.$("<button>").addClass("glproGiftCardSendNowButton").html(glpro.utility.renderLanguageValue( glpro?.settings?.languageData?.videoMessage?.sendNowBtnText)|| "Send Now")
                           let glproGiftCardSendLaterButton = glpro.$("<button>").addClass("glproGiftCardSendLaterButton").html(glpro.utility.renderLanguageValue(glpro?.settings?.languageData?.videoMessage?.sendLaterBtnText) || "Send Later");
                           
                           
                           // type as button else they autosubmit the form.
                           glproGiftCardSendNowButton.attr("type", "button");
                           
                           glproGiftCardSendLaterButton.attr("type", "button");
                           
                           glproDeliveryOptions.append(glproGiftCardSendNowButton)
                           glproDeliveryOptions.append(glproGiftCardSendLaterButton)
                           // add all of these to the glproGiftCardDateLabel
                           glproGiftCardDateLabel.append(glproDeliveryOptions)

                           glproGiftCardSendNowButton.addClass("activeDeliveryOption");

                           glproGiftCardSendNowButton.css("font-family", glpro.settings.app.themeButtonFontFamily);
                           glproGiftCardSendLaterButton.css("font-family", glpro.settings.app.themeButtonFontFamily);
                           glpro.f.applyButtonCSS(glproGiftCardSendNowButton)
    
                           //add onClickFunctionality to Send Later which opens up a date picker
                           glproGiftCardSendLaterButton.on("click", function () {
                           glproGiftCardDatePicker.css("display", "block");
                           glpro.f.applyButtonCSS(glproGiftCardSendLaterButton);
                           
                           glpro.f.resetButtonCSS(glproGiftCardSendNowButton)
                           glproGiftCardSendLaterButton.addClass("activeDeliveryOption");
                           glproGiftCardSendNowButton.removeClass("activeDeliveryOption");
                           glpro.glproGiftMessageV2.state.giftCardDeliveryOption = "sendLater"
                           glproGiftCardDateLabel.append(glproGiftCardDatePicker)
                           })

                           glproGiftCardSendNowButton.on("click", function () {
                               glproGiftCardDatePicker.css("display", "none");
                               glpro.f.applyButtonCSS(glproGiftCardSendNowButton)
                               //add activeDeliveryOption class to the button
                               glproGiftCardSendNowButton.addClass("activeDeliveryOption");
                               glpro.f.resetButtonCSS(glproGiftCardSendLaterButton)
                               glproGiftCardSendLaterButton.removeClass("activeDeliveryOption");
                               glpro.glproGiftMessageV2.state.giftCardDeliveryOption = "sendNow"
                           })

                        }


                        glproGiftMessageV2.append(glproGiftMessageV2InputFieldsDiv)
                        // glproGiftMessageV2.append(glproGiftMessageV2Divider)
                        glproGiftMessageV2.append(glproVideoMessageCheckboxRow)

                        if(glpro?.settings?.isEmailEnabled){
                            glproGiftMessageV2.append(glproGiftMessageV2Divider2)
                            glproGiftMessageV2.append(giftMessageDeliveryInfo)
                            glproGiftMessageV2.append(glproGiftMessageEmailDiv)
                            glproGiftMessageV2.append(glproGiftCardDateLabel)
                        }
                        
                        return glproGiftMessageV2;
                    },
                    renderButtons : function (){
                        let giftMessageV2ButtonsWrapper = glpro.$("<div>").addClass("giftMessageV2ButtonsWrapper");
                        let giftMessageV2NextButton = glpro.$("<button>").addClass("giftMessageNextButton").text(glpro.utility.renderLanguageValue(glpro.settings?.languageData?.generalSettings?.popUpFields?.next) || "Next");
                        let giftMessageV2FinalButton = glpro.$("<button>").addClass("giftMessageFinalButton").text(glpro.utility.renderLanguageValue(glpro.settings?.languageData?.generalSettings?.popUpFields?.done) || "Done");
                        glpro.f.applyButtonCSS(giftMessageV2NextButton);
                        glpro.f.applyButtonCSS(giftMessageV2FinalButton);

                        if (glpro.glproModal.f.isNavElementLast('giftMessage')==true) {
                            giftMessageV2FinalButton.on("click",function(event){
                                glpro.glproModal.action.onModalDone();
                            })
                            giftMessageV2ButtonsWrapper.append(giftMessageV2FinalButton);
                        }else{
                            giftMessageV2NextButton.on("click",function(event){
                                glpro.glproModal.action.onModalNext();
                             })
                             giftMessageV2ButtonsWrapper.append(giftMessageV2NextButton);
                        }
                        return giftMessageV2ButtonsWrapper;
                    },
                    saveMessageToCart : async function(){
                        //updag
                        let updateCartData = {attributes: {}  }
                        
                        if( glpro.glproGiftMessageV2.state.giftMessageIsChange){
                            updateCartData.attributes.glproGiftMessage =  glpro.glproGiftMessageV2.state.giftMessage
                            if(!glpro.settings.app.removeGiftNoteFromNote){
                                updateCartData.note = glpro.glproGiftMessageV2.state.giftMessage;
                            }
                        }
                        
                        if(glpro.glproVideoMsg.state && glpro.glproVideoMsg.state.emailIdIsChange){
                            updateCartData.attributes.RecipientEmail =  glpro.glproVideoMsg.state.emailId
                        }
                        if(glpro.glproGiftMessageV2.state && glpro.glproGiftMessageV2.state.giftCardDeliveryDateEnabled && glpro.glproGiftMessageV2.state.glproGiftCardDatePicker){
                            updateCartData.attributes.giftMsgEmailDate = glpro.glproGiftMessageV2.state.glproGiftCardDatePicker.val()
                        }

                        if(glpro.glproVideoMsg.state.uploadedVideoId){
                            updateCartData.attributes = {
                                ...updateCartData.attributes,
                                "Video Recorded" : glpro.glproVideoMsg.state.uploadedVideoId ? "yes": null,
                                "glproVideoMsgId": glpro.glproVideoMsg.state.uploadedVideoId
                            };
                        }

                        return await glpro.utility.updateCart(updateCartData)
                    },
                },
                
                action:{
                     show: function () {
                        glpro.glproModal.f.hideAllComponents();
                        glpro.$(".giftMessageBody").show();
                        glpro.glproModal.state.currentNavigationId = "giftMessage";
                        glpro.glproModal.f.updateNavigation();
                    },
                    hide: function () {
                        glpro.$(".giftMessageBody").hide();
                    }
                 }
            },
            glproVideoMsg: {
                init: function (settings, parent) {
                    glpro.glproVideoMsg.initialize(settings, parent)
                 
                },
                state: {
                    elements: {},
                    uploadedVideoId: null,
                    recordingTimeMS: 60000,
                    recordingTime: "1:00",
                    recordedBlob: "",
                    mediaRecorder: null,
                    interval: undefined,
                    emailId: null,
                    emailIdIsChange:false
                },
                initialize: function (settings, parent) {
                    let productHandle = glpro.f.getProductPageHandle(settings)
                    console.log("videoMesageInitialize");
                    if(glpro.settings.videoMessage.isVideoMessageEnabled){
                        glpro.glproVideoMsg.f.registerEvents()
                        glpro.glproVideoMsg.f.prepareVideoMsgPlayer()
                        // // let oneClickUpsellProductPageHTML = glpro.glproOneClickUpsell.f.prepareUI(settings, variantListToBeShownOnProductPage, parent)
                        // let giftMessageProductPageHTML = glpro.glproMessage.f.prepareUI(settings, productHandle, parent)
                        // glpro.glproMessage.f.insertIntoProductPageWrapper(settings, giftMessageProductPageHTML)
                        // glpro.utility.overWriteBuyNowBtn()
                        // glpro.state.isOverWriteBuyNowBtnTriggered = true
                    }
    
                },
                f:{
                    registerEvents: function () {
                        glpro.$(document).on("click", ".glproVideoMsgButton", glpro.glproVideoMsg.actions.glproVideoMsgButton)
                    },
                    prepareVideoMsgPlayer: function () {
    
                        let glproVideoMsgPlayerWrapper = glpro.$("<div>").addClass("glproVideoMsgPlayerWrapper");
                        
                        let glproRecorder  =  glpro.$("<div>").addClass("glproRecorder")
                        console.log("prepareVideoMsgPlayer");
                        let glproRecorderCloseBtn  =  glpro.$("<button>").addClass("glproRecorderCloseBtn").on("click", function (e) { glpro.glproVideoMsg.f.clickClose(e) })
                        let glproRecorderCloseBtnImg =  glpro.$("<img>").attr("src", "https://db07ji0eqime4.cloudfront.net/public/videoMessage/close-video.svg")
                        glproRecorderCloseBtn.append(glproRecorderCloseBtnImg)
                        
                        
                        let glproRecord  =  glpro.$("<div>").addClass("glproRecord")
                        let glproVideoPlayer = glpro.$("<video>").addClass("glproVideoPlayer")
                                                            .attr("autoplay", true)
                                                            .prop("muted", true)
                                                            .attr("poster", "https://db07ji0eqime4.cloudfront.net/public/videoMessage/free-video.jpg")
                        let glproPermissionDenied = glpro.$("<div>").addClass("glproPermissionDenied glproVideoPlayerHide").text( glpro.utility.renderLanguageValue(glpro.settings.languageData.videoMessage.permissionDenied))
                        let glproVideoPlayerStatus = glpro.$("<div>").addClass("glproVideoPlayerStatus").html( glpro.utility.renderLanguageValue(glpro.settings.languageData.videoMessage.pressToRecord))
                        
                        //let glproVideoPlayerEmptyPTag = glpro.$("<p>");
                        
                        let glproVideoPlayerStartBtn = glpro.$("<button>").addClass("glproVideoPlayerStartBtn").on("click", function (e) { glpro.glproVideoMsg.f.clickStart(e) })
                        let glproVideoPlayerRedDot = glpro.$("<div><p></p></div>").addClass("glproVideoPlayerRedDot")
                        //glproVideoPlayerRedDot.append(glproVideoPlayerEmptyPTag);
                        glproVideoPlayerStartBtn.append(glproVideoPlayerRedDot)
                            
                        let glproVideoPlayerStopBtn = glpro.$("<button>").addClass("glproVideoPlayerStopBtn").on("click", function (e) { glpro.glproVideoMsg.f.clickStop(e) })
                        let glproVideoPlayerRedSquare = glpro.$("<div><p></p></div>").addClass("glproVideoPlayerRedSquare")
                        //glproVideoPlayerRedSquare.append(glproVideoPlayerEmptyPTag);
                        glproVideoPlayerStopBtn.append(glproVideoPlayerRedSquare)  
                         
                        
                        let glproVideoPlayerTimeLeft = glpro.$("<div>").addClass("glproVideoPlayerTimeLeft glproVideoPlayerHide") 
                        
                        glproRecord.append(glproVideoPlayer)
                        glproRecord.append(glproPermissionDenied)
                        glproRecord.append(glproVideoPlayerStatus)
                        glproRecord.append(glproVideoPlayerStartBtn)
                        glproRecord.append(glproVideoPlayerStopBtn)
                        glproRecord.append(glproVideoPlayerTimeLeft)
                        
                        
                        let glproRecorded  =  glpro.$("<div>").addClass("glproRecorded")
    
                        let glproVideoPlayerRecording = glpro.$("<video>").addClass("glproVideoPlayerRecording")
                                                            .attr("preload", "none")
                                                            .attr("poster", "https://db07ji0eqime4.cloudfront.net/public/videoMessage/free-video.jpg")
                        
                        let glproLoadingHeading = glpro.$("<div>").addClass("glproLoadingHeading glproVideoPlayerHide").html(glpro.utility.renderLanguageValue(glpro.settings.languageData.videoMessage.loading))
                        let glproUploadingVideoHeading = glpro.$("<div>").addClass("glproUploadingVideoHeading glproVideoPlayerHide").html( glpro.utility.renderLanguageValue(glpro.settings.languageData.videoMessage.uploading))
                        
                        let glproVideoPlayerControls = glpro.$("<div>").addClass("glproVideoPlayerControls")
                  
                        let glproVideoPlayerControlsAcceptBtnDiv = glpro.$("<div>").addClass("glproVideoPlayerControlsAcceptBtnDiv");
    
                        let glproVideoPlayerControlsAcceptBtnDivInfo = glpro.$("<p>").addClass("glproVideoPlayerControlsBtnDivInfo").html(glpro.utility.renderLanguageValue(glpro.settings.languageData.videoMessage.startUploadText));
    
                        glproVideoPlayerControlsAcceptBtnDiv.append(glproVideoPlayerControlsAcceptBtnDivInfo);
                        
                        let glproVideoPlayerControlsAcceptBtn  =  glpro.$("<button>").addClass("glproVideoPlayerControlsAcceptBtn").on("click", function (e) { glpro.glproVideoMsg.f.clickAccept(e) })
                        let glproVideoPlayerControlsAcceptBtnImg =  glpro.$("<img>").addClass("glproVideoPlayerControlsAcceptBtnImg")
                                                                                .attr("src", "https://db07ji0eqime4.cloudfront.net/public/videoMessage/confirm-video.png")
                        glproVideoPlayerControlsAcceptBtn.append(glproVideoPlayerControlsAcceptBtnImg)
                        glproVideoPlayerControlsAcceptBtnDiv.append(glproVideoPlayerControlsAcceptBtn);
    
                       
    
                        let glproVideoPlayerControlsPlayBtnDiv = glpro.$("<div>").addClass("glproVideoPlayerControlsPlayBtnDiv");
                        
                        let glproVideoPlayerControlsPlayBtnDivInfo = glpro.$("<p>").addClass("glproVideoPlayerControlsBtnDivInfo").html(glpro.utility.renderLanguageValue(glpro.settings.languageData.videoMessage.playText));
    
                        glproVideoPlayerControlsPlayBtnDiv.append(glproVideoPlayerControlsPlayBtnDivInfo);
    
                        let glproVideoPlayerControlsPlayBtn  =  glpro.$("<button>").addClass("glproVideoPlayerControlsPlayBtn").on("click", function (e) { glpro.glproVideoMsg.f.clickPlay(e) })
                        let glproVideoPlayerControlsPlayBtnImg =  glpro.$("<img>").addClass("glproVideoPlayerControlsPlayBtnImg")
                                                                                .attr("src", "https://db07ji0eqime4.cloudfront.net/public/videoMessage/play-video.png")
                        glproVideoPlayerControlsPlayBtn.append(glproVideoPlayerControlsPlayBtnImg)
                        glproVideoPlayerControlsPlayBtnDiv.append(glproVideoPlayerControlsPlayBtn);
    
                       
                        let glproVideoPlayerControlsReStartBtnDiv = glpro.$("<div>").addClass("glproVideoPlayerControlsReStartBtnDiv");
                        
                        let glproVideoPlayerControlsReStartBtnDivInfo = glpro.$("<p>").addClass("glproVideoPlayerControlsBtnDivInfo").html(glpro.utility.renderLanguageValue(glpro.settings.languageData.videoMessage.reRecordVideoText));
    
                        glproVideoPlayerControlsReStartBtnDiv.append(glproVideoPlayerControlsReStartBtnDivInfo);
                        
                        let glproVideoPlayerControlsReStartBtn  =  glpro.$("<button>").addClass("glproVideoPlayerControlsReStartBtn").on("click", function (e) { glpro.glproVideoMsg.f.clickReStart(e) })
                        let glproVideoPlayerControlsReStartBtnImg =  glpro.$("<img>").addClass("glproVideoPlayerControlsReStartBtnImg")
                                                                                .attr("src", "https://db07ji0eqime4.cloudfront.net/public/videoMessage/redo-video.png")
                        glproVideoPlayerControlsReStartBtn.append(glproVideoPlayerControlsReStartBtnImg)
                        glproVideoPlayerControlsReStartBtnDiv.append(glproVideoPlayerControlsReStartBtn);
    
                        glproVideoPlayerControls.append(glproVideoPlayerControlsReStartBtnDiv)
                        glproVideoPlayerControls.append(glproVideoPlayerControlsPlayBtnDiv)
                        glproVideoPlayerControls.append(glproVideoPlayerControlsAcceptBtnDiv)
    
    
                        glproRecorded.append(glproVideoPlayerRecording)
                        glproRecorded.append(glproLoadingHeading)
                        glproRecorded.append(glproUploadingVideoHeading)
                        glproRecorded.append(glproVideoPlayerControls)
                        
                        
                        glproRecorder.append(glproRecorderCloseBtn)
                        glproRecorder.append(glproRecord)
                        glproRecorder.append(glproRecorded)
    
                        glpro.$(".glproVideoMessageCheckboxRow").after(glproVideoMsgPlayerWrapper);
                        glpro.$(".glproVideoMsgPlayerWrapper").append(glproRecorder)
                        glpro.glproVideoMsg.state.elements.glproRecorder = glproRecorder
                        glpro.glproVideoMsg.state.elements.glproRecord = glproRecord
                        glpro.glproVideoMsg.state.elements.glproRecorded = glproRecorded
                        glpro.glproVideoMsg.state.elements.glproVideoPlayer = glproVideoPlayer
                        glpro.glproVideoMsg.state.elements.glproVideoPlayerStartBtn = glproVideoPlayerStartBtn
                        glpro.glproVideoMsg.state.elements.glproVideoPlayerStopBtn = glproVideoPlayerStopBtn
                        glpro.glproVideoMsg.state.elements.glproVideoPlayerControlsReStartBtn = glproVideoPlayerControlsReStartBtn
                        glpro.glproVideoMsg.state.elements.glproVideoPlayerControlsPlayBtn = glproVideoPlayerControlsPlayBtn
                        glpro.glproVideoMsg.state.elements.glproVideoPlayerRecording = glproVideoPlayerRecording
                        glpro.glproVideoMsg.state.elements.glproRecorderCloseBtn = glproRecorderCloseBtn
                        glpro.glproVideoMsg.state.elements.glproVideoPlayerControlsAcceptBtn = glproVideoPlayerControlsAcceptBtn
                        glpro.glproVideoMsg.state.elements.glproVideoPlayerControls = glproVideoPlayerControls
                        glpro.glproVideoMsg.state.elements.glproLoadingHeading = glproLoadingHeading
                        glpro.glproVideoMsg.state.elements.glproVideoPlayerTimeLeft = glproVideoPlayerTimeLeft
                        glpro.glproVideoMsg.state.elements.glproVideoPlayerStatus = glproVideoPlayerStatus
                        glpro.glproVideoMsg.state.elements.glproPermissionDenied = glproPermissionDenied
                        glpro.glproVideoMsg.state.elements.glproUploadingVideoHeading = glproUploadingVideoHeading
    
    
                    },
                    createRecorder: function() {
                        glpro.glproVideoMsg.state.elements.glproRecorder.removeClass("glproVideoPlayerHide");
                        glpro.glproVideoMsg.state.elements.glproRecord.removeClass("glproVideoPlayerHide");
                        glpro.glproVideoMsg.state.elements.glproVideoPlayerStartBtn.removeClass("glproVideoPlayerHide");
                        glpro.glproVideoMsg.state.elements.glproVideoPlayerStatus.removeClass("glproVideoPlayerHide");
                        glpro.glproVideoMsg.state.elements.glproPermissionDenied.addClass("glproVideoPlayerHide");
                        glpro.glproVideoMsg.state.elements.glproRecorded.addClass("glproVideoPlayerHide");
                        glpro.glproVideoMsg.state.elements.glproVideoPlayerStopBtn.addClass("glproVideoPlayerHide");
                        glpro.glproVideoMsg.state.elements.glproVideoPlayerControls.addClass("glproVideoPlayerHide");
                        glpro.glproVideoMsg.state.elements.glproVideoPlayerTimeLeft.html(glpro.glproVideoMsg.state.recordingTime);
                        glpro.glproVideoMsg.state.elements.glproVideoPlayerStatus.html(glpro.utility.renderLanguageValue(glpro.settings.languageData.videoMessage.pressToRecord));
                        glpro.glproVideoMsg.state.recordingTime = "1:00";
                        glpro.glproVideoMsg.state.elements.glproUploadingVideoHeading.html(glpro.utility.renderLanguageValue(glpro.settings.languageData.videoMessage.uploading));
                        navigator.mediaDevices
                            .getUserMedia({
                            audio: true,
                            video: true,
                            })
                            .then((stream) => {
                                glpro.glproVideoMsg.state.elements.glproVideoPlayer[0].srcObject = stream;
                            })
                            .catch((error) => {
                                console.log("navigator", error)
                                console.log(error);
                                glpro.glproVideoMsg.state.elements.glproVideoPlayerStartBtn.addClass("glproVideoPlayerHide");
                                glpro.glproVideoMsg.state.elements.glproVideoPlayerStatus.addClass("glproVideoPlayerHide");
                                glpro.glproVideoMsg.state.elements.glproPermissionDenied.removeClass("glproVideoPlayerHide");
                            });
                    },
                    clickClose: function(e){
                        e.preventDefault();
                        glpro.$('.glproVideoMsgPlayerWrapper').css('display', 'none')
                        // glpro.glproVideoMsg.state.elements.glproRecorder.addClass("glproVideoPlayerHide");
                        glpro.glproVideoMsg.f.stopRecording(glpro.glproVideoMsg.state.elements.glproVideoPlayer[0].srcObject);
                        glpro.glproVideoMsg.f.revokeObjectUrl();
                    },
                    stopRecording: function (stream) {
                        if(glpro.glproVideoMsg.state.interval) {
                            clearInterval(glpro.glproVideoMsg.state.interval);
                        }
                        if(glpro.glproVideoMsg.state.mediaRecorder && glpro.glproVideoMsg.state.mediaRecorder.state !== "inactive") {
                            glpro.glproVideoMsg.state.mediaRecorder.stop();
                        }
                        stream.getTracks().forEach(function (track) {
                            if (track.readyState == "live") {
                            console.log("hello - stop");
                            track.stop();
                            }
                        })
                    },
                    
                    clearTracks: function (stream) {
                        if(stream){
                            stream.getTracks().forEach(function (track) {
                                if (track.readyState == "live") {
                                console.log("hello - stop");
                                track.stop();
                                }
                            })

                        }
                       
                    },
                    revokeObjectUrl: function () {
                        URL.revokeObjectURL(glpro.glproVideoMsg.state.elements.glproVideoPlayerRecording.src);
                    },
                    clickStart: function async (e){
                        e.preventDefault();
                        glpro.glproVideoMsg.state.elements.glproVideoPlayerStartBtn.addClass("glproVideoPlayerHide");
                        glpro.glproVideoMsg.state.elements.glproRecorderCloseBtn.addClass("glproVideoPlayerHide");
                        glpro.glproVideoMsg.state.elements.glproVideoPlayerStopBtn.removeClass("glproVideoPlayerHide");
                        glpro.glproVideoMsg.state.elements.glproVideoPlayerTimeLeft.removeClass("glproVideoPlayerHide");
                        // the below field for the text 
                        //hide the toggle
                        //glproVideoMsgCheckboxWrapper
    
                        glpro.glproVideoMsg.f.clearTracks(glpro.glproVideoMsg.state.elements.glproVideoPlayer[0].srcObject);
    
                        glpro.glproVideoMsg.state.elements.glproVideoPlayerStatus.html(glpro.utility.renderLanguageValue(glpro.settings.languageData.videoMessage.recording));
                        navigator.mediaDevices
                            .getUserMedia({
                            video: true,
                            audio: true,
                            })
                            .then((stream) => {
                                console.log("1 - navigator");
                                glpro.glproVideoMsg.state.elements.glproVideoPlayer[0].srcObject = stream;
                                glpro.glproVideoMsg.state.elements.glproVideoPlayer[0].captureStream = glpro.glproVideoMsg.state.elements.glproVideoPlayer[0].captureStream || glpro.glproVideoMsg.state.elements.glproVideoPlayer[0].mozCaptureStream;
                                return new Promise((resolve) => (
                                    glpro.glproVideoMsg.state.elements.glproVideoPlayer[0].onplaying = resolve
                                ));
                            })
                            .then(() => {
                                console.log("2 - onplaying");
                                return glpro.glproVideoMsg.f.startRecording(e, glpro.glproVideoMsg.state.elements.glproVideoPlayer[0].captureStream())
                            })
                            .then((recordedChunks) => {
                                console.log("3 - startRecording");
                                console.log(recordedChunks);
                                glpro.glproVideoMsg.state.elements.glproVideoPlayerControls.removeClass("glproVideoPlayerHide");
                                glpro.glproVideoMsg.state.elements.glproUploadingVideoHeading.addClass("glproVideoPlayerHide");
                                glpro.glproVideoMsg.state.elements.glproLoadingHeading.addClass("glproVideoPlayerHide");
                                glpro.glproVideoMsg.state.recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
                                glpro.glproVideoMsg.state.elements.glproVideoPlayerRecording.attr("src",URL.createObjectURL(glpro.glproVideoMsg.state.recordedBlob));
                                glpro.glproVideoMsg.state.elements.glproVideoPlayerRecording[0].load();
                            })
                            .catch(
                                (error) => 
                                console.log(error)
                            );
                    },
                    startRecording: function (e, stream) {
                        return new Promise ((resolve, reject) => {
    
                            let mediaRecorder = new MediaRecorder(stream);
                            glpro.glproVideoMsg.state.mediaRecorder = mediaRecorder;
                            let parts = [];
                            mediaRecorder.ondataavailable = (event) => {
                                parts.push(event.data);
                            };
                            mediaRecorder.start(1000);
    
                            mediaRecorder.onerror = (event) => reject(event.name); 
    
                            glpro.glproVideoMsg.f.wait(mediaRecorder);
    
                            mediaRecorder.onstop = function(){ 
                                console.log("mediaRecorder.onstop() func called");
                                resolve(parts);
                            }
                        })
                    },
                    clickStop: function (e) {
                        e.preventDefault();
                        glpro.glproVideoMsg.state.elements.glproRecord.addClass("glproVideoPlayerHide");
                        glpro.glproVideoMsg.state.elements.glproRecorded.removeClass("glproVideoPlayerHide");
                        glpro.glproVideoMsg.state.elements.glproVideoPlayerControls.addClass("glproVideoPlayerHide");
                        glpro.glproVideoMsg.state.elements.glproVideoPlayerTimeLeft.addClass("glproVideoPlayerHide");
                        glpro.glproVideoMsg.state.elements.glproVideoPlayerStatus.addClass("glproVideoPlayerHide");
                        glpro.glproVideoMsg.state.elements.glproRecorderCloseBtn.removeClass("glproVideoPlayerHide");
                        glpro.glproVideoMsg.state.elements.glproLoadingHeading.removeClass("glproVideoPlayerHide");
                        glpro.glproVideoMsg.f.stopRecording(glpro.glproVideoMsg.state.elements.glproVideoPlayer[0].srcObject);
                    },
                    covertBlobToBase64: async function (recordedBlob){
    
                        const reader = new FileReader();
                        reader.readAsDataURL(recordedBlob);
    
                        reader.onloadend = function () {
                        
                        var arrayBuffer = reader.result;
    
                        console.log(arrayBuffer);
    
                        var formData = new FormData();
    
                        formData.append("upload_data", recordedBlob, "video.txt");
                        formData.append("shopName", glpro.settings.merchantInfo.shopName);
    
                            fetch(glpro.settings.SERVER_URL+"/api/proxy/upload/video?shopName="+glpro.settings.merchantInfo.shopName,{
                                method: 'POST',
                                body: formData
                            }).then(
                                response => response.json() // if the response is a JSON object
                            ).then(
                                success => {
                                    if(success.responseCode == 200){
                                        glpro.glproVideoMsg.state.uploadedVideoId = success.data.videoMsgId;
                                        console.log(success) // Handle the success response object
                                        glpro.glproVideoMsg.state.elements.glproUploadingVideoHeading.html(glpro.utility.renderLanguageValue(glpro.settings.languageData.videoMessage.uploadConfirmation));
                                        //glpro.$('.glproVideoMsgPlayerWrapper').css('display', 'none')
                                        // Show feedback that it got uploaded
                                        // glpro.glproVideoMsg.state.elements.glproRecorder.addClass("glproVideoPlayerHide");
                                    }
                                    /*
                                    * @Abhishek, the below if else condition is added to handle the
                                    * condition where the api fails in sending over responseCode 200.
                                    */ 
                                    else{
                                        console.log(success) // Handle the error response object
                                        glpro.glproVideoMsg.state.elements.glproUploadingVideoHeading.html(glpro.utility.renderLanguageValue(glpro.settings.languageData.videoMessage.errorMessage));
                                    }
    
                                }
                            ).catch(
                                error => {
                                console.log(error) // Handle the error response object
                                glpro.glproVideoMsg.state.elements.glproUploadingVideoHeading.html(glpro.utility.renderLanguageValue(glpro.settings.languageData.videoMessage.errorMessage));
                                }
                            );
                        }
                    },
                    clickAccept: function(e) {
                        e.preventDefault();
                        glpro.glproVideoMsg.state.elements.glproVideoPlayerControls.addClass("glproVideoPlayerHide")
                        glpro.glproVideoMsg.state.elements.glproUploadingVideoHeading.removeClass("glproVideoPlayerHide")
                        glpro.glproVideoMsg.f.covertBlobToBase64(glpro.glproVideoMsg.state.recordedBlob);
                    },
                    wait: function(mediaRecorder){
                        var now = new Date().getTime();
                        var deadline = new Date(now + glpro.glproVideoMsg.state.recordingTimeMS).getTime();
                        var interval = setInterval(() => {
                            now = new Date().getTime();
                            var t = deadline - now;
                            console.log(t);
                            var minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
                            var seconds = Math.floor((t % (1000 * 60)) / 1000);
                            if (t < 0) {
                                glpro.$('.glproVideoPlayerStopBtn').click();
                            }
                            glpro.glproVideoMsg.state.elements.glproVideoPlayerTimeLeft.html(minutes + " : " + seconds)
                        }, 1000);
                        glpro.glproVideoMsg.state.interval = interval;
                    },
                    clickReStart: function (e) {
                        e.preventDefault();
                        glpro.glproVideoMsg.f.revokeObjectUrl()
                        glpro.glproVideoMsg.f.createRecorder();
                    },
                    clickPlay: async function(e) {
                        e.preventDefault();
                        try {
                            glpro.glproVideoMsg.state.elements.glproVideoPlayerControls.addClass("glproVideoPlayerHide");
                            glpro.glproVideoMsg.state.elements.glproVideoPlayerRecording[0].play();
                            let isEnded = new Promise((resolve, reject) => {
                                glpro.glproVideoMsg.state.elements.glproVideoPlayerRecording[0].onended = resolve;
                            });
                            await isEnded;
                            glpro.glproVideoMsg.state.elements.glproVideoPlayerRecording[0].load();
                            glpro.glproVideoMsg.state.elements.glproVideoPlayerControls.removeClass("glproVideoPlayerHide");
                            
                        } catch (error) {
                            console.log(error)
                        }                   
                    },
                    scrollToVideoDiv: function() {
                        // glpro.$(".glproGiftCardMessageContent").animate({scrollTop: 9999},1000);
                        glpro.$(".giftMessageV2MainContent").animate({scrollTop: 360},2000, 'swing');
                    },
                },
                actions: {
                    glproVideoMsgButton: function(e){
                        e.preventDefault()
                        glpro.$('.glproVideoMsgPlayerWrapper').css('display', 'grid')
                        glpro.glproVideoMsg.f.createRecorder()
                        glpro.glproVideoMsg.f.scrollToVideoDiv()
                    },
                },
                events: {
    
                },
                
            }, 
            // GLPRO Code start
            glproGiftOptionsPageEle: {
                init: function (settings, parent) {
                    glpro.glproGiftOptionsPageEle.initialize(settings, parent)
                    glpro.glproGiftOptionsPageEle.events(settings)
                },
                initialize: function (settings, parent) {
                    let productHandle = glpro.f.getProductPageHandle(settings)
                    let {isEnabledOnProductPage, isEnabledOnCartPage} = glpro.glproGiftOptionsPageEle.f.checkIfGiftOptionsEnabled(settings.whereToShow, productHandle, parent)
                    
                    if(glpro.glproModal.state.navigationItems.length == 0){
                        return 
                    }

                    if (parent == "PRODUCT_PAGE" && isEnabledOnProductPage) {
                        glpro.glproGiftOptionsPageEle.f.insertIntoProductPageWrapper(settings)
                        glpro.utility.overWriteBuyNowBtn()
                        glpro.state.isOverWriteBuyNowBtnTriggered = true
                        
                    }
                    if (parent == "CART_PAGE" && isEnabledOnCartPage) {
                        glpro.glproGiftOptionsPageEle.f.insertIntoCartPageWrapper(settings)
                    }
    

                },
                f: {
                    insertIntoProductPageWrapper: async function (settings) {
    
                        glpro.elements.productPageWrapperV2.find(".glproGiftOptionsPageEleWrapper").css("display", "block")
    
                        // let productVairantId = glpro.settings.giftwrap.productVairantID
                        let isCheckIfGiftOptionsInCart = await glpro.utility.checkIfGiftOptionsInCart()
                        if (isCheckIfGiftOptionsInCart) {
                            glpro.elements.glproGiftMsgAndWrapWrapperParent.find('.glproGiftOptionsPageEleCheckbox').attr("checked", true)
                        }
    
                        // insert into parent element 
                        glpro.elements.glproGiftMsgAndWrapWrapperParent.find(".glproGiftOptionsPageEleInnerEleHeading").append(glpro.utility.renderLanguageValue(glpro.settings?.languageData?.generalSettings?.pageFields?.isThisAGift));    //cartPageText                 
    
                        // insert final  element into productPageWrapperV2
                        glpro.elements.productPageWrapperV2.find(".glproGiftOptionsPageEleWrapper").append(glpro.elements.glproGiftMsgAndWrapWrapperParent);
    
                    },
                    insertIntoCartPageWrapper: async function (settings) {
    
                        glpro.elements.cartPageWrapperV2.find(".glproCartGiftOptionsPageEleWrapper").css("display", "block")
    
                        // let productVairantId = glpro.settings.giftwrap.productVairantID
                        let isCheckIfGiftOptionsInCart = await glpro.utility.checkIfGiftOptionsInCart()
                        if (isCheckIfGiftOptionsInCart) {
                            glpro.elements.glproCartGiftMsgAndWrapWrapperParent.find('.glproGiftOptionsPageEleCheckbox').attr("checked", true)
                        }
                        
    
                        // insert into parent element 
                        glpro.elements.glproCartGiftMsgAndWrapWrapperParent.find(".glproGiftOptionsPageEleInnerEleHeading").append(glpro.utility.renderLanguageValue(glpro.settings?.languageData?.generalSettings?.pageFields?.isThisAGift));   //cartPageText                 
    
                        // insert final  element into productPageWrapperV2
                        glpro.elements.cartPageWrapperV2.find(".glproCartGiftOptionsPageEleWrapper").append(glpro.elements.glproCartGiftMsgAndWrapWrapperParent);
    
                    },
                    checkIfGiftOptionsEnabled: function (whereToShow, currProductHandle, parent) {
                        let isEnabledOnProductPage = false
                        let isEnabledOnCartPage = false
    
                        if(!whereToShow.isAppEnabled){
                            return {isEnabledOnProductPage, isEnabledOnCartPage}
                        }
    
                        if (whereToShow.isVisibleOnCart) {
                            isEnabledOnCartPage = true
                        }
    
                        if (whereToShow.isVisibleOnAllProductPages) {
                            isEnabledOnProductPage = true
                        } else if (whereToShow.isVisibleOnSpecificProductPages &&
                                whereToShow.visibleOnSpecificProductPages &&
                                whereToShow.visibleOnSpecificProductPages.find(x => x.handle === currProductHandle)) {
    
                            isEnabledOnProductPage = true
                        }
                        if (whereToShow.isVisibleOnSpecificCollectionPages && 
                                    whereToShow.visibleOnSpecificCollectionProductPages && 
                                    whereToShow.visibleOnSpecificCollectionProductPages.length  && 
                                    whereToShow.visibleOnSpecificCollectionProductPages.length > 0) {
                                let collectionsList = whereToShow.visibleOnSpecificCollectionProductPages
                                for(let i=0; i<collectionsList.length; i++){
                                    let productList =collectionsList[i].productList
                                    if(productList.find(x => x.handle === currProductHandle)){
                                        isEnabledOnProductPage = true
                                        break
                                    }
                                }
                        }

                        // check exclude product pages
                        if (whereToShow.isExcludeOnSpecificProductPages &&  
                            whereToShow.excludeOnSpecificProductPages && 
                            whereToShow.excludeOnSpecificProductPages.length &&  
                            whereToShow.excludeOnSpecificProductPages.length > 0) {
                                
                            if (whereToShow.excludeOnSpecificProductPages.find(x => x.handle === currProductHandle)) {
                                isEnabledOnProductPage = false
                            }
                        }
    
                        return {isEnabledOnProductPage, isEnabledOnCartPage}
                    },
                    syncGlproPageEleCheckbox: async function () {
                        glpro.state.cartData = await glpro.utility.getCart()
                        let isCheckIfGiftOptionsInCart = await glpro.utility.checkIfGiftOptionsInCart()
                        if (isCheckIfGiftOptionsInCart) {
                            glpro.$('.glproGiftOptionsPageEleCheckbox').prop("checked", true)
                        }else{
                            glpro.$('.glproGiftOptionsPageEleCheckbox').prop("checked", false)
                        }
                    },
                    disableSidecart: function () {
                        if(glpro.$("#sidebar-cart") && glpro.$("#sidebar-cart").attr("tabIndex") == "-1"){
                            glpro.$("#sidebar-cart").attr("tabIndex", "")
                          }
                    }
                },

                events: function (settings) {
                        glpro.$(document).on("click", ".glproGiftOptionsPageEleCheckbox", async function (event) {
                            console.log("glproGiftOptionsPageEleCheckbox")
                            glpro.glproModal.action.onModalOpen()
                            glpro.glproGiftOptionsPageEle.f.disableSidecart()
                           
                            // await glpro.glproGiftMsgAndWrap.action.handleglproGiftOptionsPageEleCheckboxEvent(event);
                            // //glproPage type is cartPage then reload page
                            // if (glpro.state.page_type == "cart") {
                            //     window.location.reload()
                            //     //turn off click events till the page loads
                            //     glpro.$("body").css("pointer-events", "none")
                            // }

                        })
    
                   
                },
                action: {
                    handleglproGiftOptionsPageEleCheckboxEvent: async function (cb) {
                        if (cb && cb.target) {
                            window.giftwrapEvent = cb
                            let productVairantId = glpro.settings.giftwrap.productVairantID
                            //if true 
                            if (cb.target.checked) {
                                glpro.$(document).find('.glproGiftOptionsPageEleCheckbox').each(function () {glpro.$(this).attr("checked", true)})
                                await glpro.utility.updateCart({ updates: { [productVairantId]: 1 } })
                            }
                            else {
                                glpro.$(document).find('.glproGiftOptionsPageEleCheckbox').each(function () {glpro.$(this).attr("checked", false)})
                                await glpro.utility.updateCart({ updates: { [productVairantId]: 0 } })
                                glpro.$(document).find('.glproGiftOptionsPageEleCheckbox').attr("checked", false)
                            }
    
                        }
    
                    }
    
                }
            },

            glproModal:{
                state:{
                    navigationItems: [],
                    currentNavigationId: "",
                    modalContentHTML: "",
                },
                init: function(){
                    glpro.glproModal.action.registerEvents(),
                    glpro.glproModal.initialize()
                },
                initialize: async function(){
                    let navigationItems = glpro.glproModal.f.setNavigationItems();
                    glpro.glproModal.state.navigationItems = navigationItems

                    let modalWrapperHtml = glpro.glproModal.f.renderGlproWrapperHTML()
                    let modalHTML = glpro.glproModal.f.renderHTML()

                    modalWrapperHtml.append(modalHTML)
                    glpro.$("body").append(modalWrapperHtml)

                   await glpro.glproModal.f.initalizeModalComponents()
                },
                f:{
                    renderGlproWrapperHTML: function(){
                        let modalWrapperHtml = glpro.$("<div>").addClass("glproModalWrapper")
                        return modalWrapperHtml;
                    },
                    renderHTML: function(){
                        let modalHTML = glpro.$("<div>").addClass("glproModal")

                        let modalHeader = glpro.$("<div>").addClass("glproModalHeader")
                        let modalNavigation = glpro.$("<div>").addClass("glproModalNavigation")
                        let modalContent = glpro.$("<div>").addClass("glproModalContent")
                        let modalFooter = glpro.$("<div>").addClass("glproModalFooter")
                        
                        let branding = glpro.$("<div>").addClass("glproBranding")
                        //attach a link to shopify app store
                        let brandingLink = glpro.$("<a>").attr("href", "https://apps.shopify.com/giftlabs").attr("target", "_blank").text("Powered By GiftLab")
                        branding.append(brandingLink)



                        let modalClose = glpro.$("<div>").addClass("glproModalClose")
                        modalClose.append('<svg enable-background="new 0 0 587.91 587.91" version="1.1" viewBox="0 0 587.91 587.91" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" appify_fntsize="15px" style="font-size: 15px;"><path d="m86.451 501.46c26.937 26.936 58.315 48.088 93.265 62.871 36.207 15.314 74.642 23.078 114.24 23.078 39.596 0 78.032-7.764 114.24-23.078 34.949-14.783 66.328-35.936 93.266-62.871 26.936-26.938 48.09-58.316 62.871-93.266 15.314-36.207 23.08-74.643 23.08-114.24 0-39.598-7.766-78.033-23.08-114.24-14.781-34.95-35.936-66.328-62.871-93.265-26.938-26.937-58.316-48.09-93.266-62.872-36.208-15.315-74.643-23.079-114.24-23.079-39.597 0-78.032 7.765-114.24 23.079-34.95 14.782-66.328 35.936-93.265 62.872s-48.09 58.315-62.873 93.264c-15.313 36.207-23.078 74.642-23.078 114.24 0 39.596 7.765 78.031 23.079 114.24 14.782 34.95 35.936 66.328 62.872 93.266zm207.5-458.12c138.41 0 250.61 112.2 250.61 250.62 0 138.41-112.2 250.61-250.61 250.61s-250.62-112.2-250.62-250.61c0-138.41 112.2-250.62 250.62-250.62z" appify_fntsize="15px" style="font-size: 15px;"></path><path d="m293.96 587.91c-39.667 0-78.167-7.778-114.43-23.117-35.01-14.809-66.442-35.998-93.423-62.979-26.983-26.984-48.172-58.417-62.979-93.425-15.341-36.269-23.119-74.77-23.119-114.43 0-39.663 7.778-78.165 23.118-114.44 14.807-35.008 35.997-66.44 62.979-93.423s58.415-48.172 93.423-62.979c36.27-15.34 74.771-23.118 114.43-23.118 39.666 0 78.167 7.778 114.43 23.119 35.009 14.807 66.441 35.997 93.425 62.979 26.984 26.985 48.173 58.417 62.979 93.423 15.341 36.27 23.119 74.771 23.119 114.43 0 39.662-7.778 78.163-23.119 114.43-14.806 35.007-35.994 66.439-62.979 93.425-26.982 26.98-58.415 48.169-93.425 62.979-36.266 15.338-74.767 23.116-114.43 23.116zm0-586.91c-39.529 0-77.898 7.751-114.04 23.039-34.889 14.757-66.215 35.874-93.106 62.765-26.892 26.892-48.009 58.217-62.766 93.105-15.288 36.147-23.039 74.517-23.039 114.05 0 39.527 7.751 77.898 23.039 114.04 14.757 34.889 35.874 66.214 62.766 93.106 26.89 26.889 58.215 48.006 93.106 62.765 36.142 15.287 74.512 23.038 114.04 23.038s77.901-7.751 114.04-23.039c34.89-14.758 66.216-35.875 93.106-62.764 26.893-26.895 48.009-58.22 62.764-93.106 15.289-36.146 23.041-74.516 23.041-114.04 0-39.529-7.752-77.899-23.041-114.04-14.754-34.887-35.871-66.212-62.764-93.106-26.892-26.891-58.218-48.008-93.106-62.765-36.144-15.289-74.514-23.04-114.04-23.04zm0 544.07c-67.075 0-130.14-26.12-177.56-73.549-47.429-47.43-73.55-110.49-73.55-177.56s26.12-130.14 73.55-177.56c47.429-47.429 110.49-73.55 177.56-73.55s130.14 26.121 177.56 73.55c47.43 47.43 73.55 110.49 73.55 177.56s-26.12 130.14-73.55 177.56c-47.429 47.429-110.49 73.549-177.56 73.549zm0-501.23c-66.808 0-129.62 26.017-176.86 73.257-47.24 47.241-73.257 110.05-73.257 176.86s26.017 129.62 73.257 176.86c47.24 47.24 110.05 73.257 176.86 73.257s129.62-26.017 176.86-73.257c47.24-47.239 73.257-110.05 73.257-176.86 0-66.808-26.017-129.62-73.257-176.86-47.241-47.241-110.05-73.257-176.86-73.257z" appify_fntsize="15px" style="font-size: 15px;"></path><path d="m184.92 402.99c4.183 4.184 9.664 6.275 15.146 6.275s10.964-2.092 15.146-6.275l78.742-78.742 78.743 78.742c4.182 4.184 9.664 6.275 15.146 6.275s10.963-2.092 15.146-6.275c8.365-8.363 8.365-21.926 0-30.291l-78.744-78.742 78.742-78.743c8.365-8.365 8.365-21.928 0-30.292-8.363-8.365-21.926-8.365-30.291 0l-78.743 78.743-78.742-78.743c-8.365-8.365-21.928-8.365-30.292 0-8.365 8.365-8.365 21.927 0 30.292l78.743 78.743-78.743 78.742c-8.364 8.365-8.364 21.928 1e-3 30.291z" appify_fntsize="15px" style="font-size: 15px;"></path><path d="m387.84 409.76c-5.856 0-11.36-2.28-15.5-6.422l-78.389-78.389-78.388 78.389c-4.14 4.142-9.645 6.422-15.5 6.422s-11.36-2.28-15.5-6.422c-4.14-4.14-6.42-9.644-6.42-15.498 0-5.855 2.28-11.359 6.42-15.5l78.389-78.389-78.389-78.389c-8.546-8.547-8.546-22.453 0-31 4.14-4.14 9.644-6.42 15.5-6.42 5.855 0 11.36 2.28 15.5 6.42l78.389 78.389 78.389-78.389c4.141-4.14 9.645-6.42 15.5-6.42 5.854 0 11.358 2.28 15.498 6.42 4.141 4.14 6.42 9.645 6.42 15.5s-2.279 11.36-6.42 15.5l-78.389 78.389 78.391 78.389c4.141 4.141 6.421 9.645 6.421 15.5 0 5.854-2.28 11.358-6.421 15.498-4.143 4.141-9.647 6.422-15.501 6.422zm-93.889-86.225 79.096 79.096c3.95 3.952 9.204 6.129 14.793 6.129 5.587 0 10.841-2.177 14.793-6.129 3.951-3.95 6.128-9.203 6.128-14.791s-2.177-10.842-6.128-14.793l-79.098-79.096 79.096-79.096c3.951-3.951 6.127-9.205 6.127-14.793s-2.176-10.841-6.127-14.792c-3.95-3.951-9.203-6.127-14.791-6.127s-10.842 2.176-14.793 6.127l-79.096 79.096-79.096-79.096c-3.951-3.951-9.205-6.127-14.793-6.127s-10.841 2.176-14.792 6.127c-8.156 8.157-8.156 21.428 0 29.585l79.096 79.096-79.096 79.096c-3.951 3.951-6.127 9.205-6.127 14.793s2.176 10.841 6.127 14.791c3.952 3.952 9.205 6.129 14.793 6.129s10.841-2.177 14.793-6.129l79.095-79.096z" appify_fntsize="15px" style="font-size: 15px;"></path></svg>')
                        
                        let modalButtonContainer = glpro.$("<div>").addClass("glproModalButtonContainer");
                        let modalNextButton = glpro.$("<button>").addClass("glproModalNextButton").html(glpro.utility.renderLanguageValue(glpro.settings?.languageData?.generalSettings?.popUpFields?.done) || "Next");
                        let modalSkipButton = glpro.$("<button>").addClass("glproModalSkipButton").text(glpro.utility.renderLanguageValue(glpro.settings.languageData.skipButton) || "Skip");

                        glpro.f.applyButtonCSS(modalNextButton);

                        modalClose.on("click", function (event) {
                            glpro.glproModal.action.onModalClose()
                        })

                        modalSkipButton.on("click", function (event) {
                            glpro.glproModal.action.onModalSkip()
                        });

                        modalNextButton.on("click", function (event) {
                            glpro.glproModal.action.onModalNext()
                        });

                         //6 dummies for the content that are giftWrapBody, giftAddonsBody, giftMessageBody, scheduleDeliveryBody, greetingCardBody
                        glpro.glproModal.f.insertSkeletonHTML(modalContent, "giftWrapBody")
                        glpro.glproModal.f.insertSkeletonHTML(modalContent, "giftAddonsBody")
                        glpro.glproModal.f.insertSkeletonHTML(modalContent, "giftMessageBody")
                        glpro.glproModal.f.insertSkeletonHTML(modalContent, "scheduleDeliveryBody")
                        glpro.glproModal.f.insertSkeletonHTML(modalContent, "greetingCardBody")
                      
                        modalHeader.append(modalClose)
                        modalHeader.append(modalNavigation)

                        // modalContent.append(glpro.glproModal.state.modalContentHTML)
                        //TODO: conditionally check if needed modalButtonContainer.append(modalSkipButton)
                        // modalButtonContainer.append(modalNextButton)
                        let showBranding = glpro.settings?.app?.showBranding == undefined ? true :  glpro.settings?.app?.showBranding ;

                        let higherPlanNames = ["plus", "pro", "essential"]


                        showBranding =  higherPlanNames.includes(glpro.settings.merchantInfo?.isSubscription?.name) ? false : showBranding;

                        modalFooter.append(modalButtonContainer)
                        if(showBranding){
                            modalFooter.append(branding)
                        }

    
                        modalHTML.append(modalHeader)
                        modalHTML.append(modalContent)
                        modalHTML.append(modalFooter)

                        modalNavigation.append(glpro.glproModal.f.renderNavigationHTML())

                        
                        return modalHTML;
                    },
                    insertSkeletonHTML : function(modalHTML, elementName){
                        //create a div with the body as the className
                        let elementHTML = glpro.$("<div>").addClass(elementName);
                        //append the modalHTML to the skeleton
                        modalHTML.append(elementHTML);
                    },
                    setNavigationItems: function(){
                        let navigationItems = []   
                        if (glpro.settings?.giftwrap?.isGiftWrapEnabled) {
                            navigationItems.push({
                                "id": "giftwrap",
                                "rank": 1,
                                "text": glpro.utility.renderLanguageValue(glpro.settings?.languageData?.generalSettings?.navigationFields?.giftWrap),
                                "isActive": false,
                                "initFn": glpro.glproGiftWrap.init,
                                "showFn": glpro.glproGiftWrap.action.show,
                                "hideFn": glpro.glproGiftWrap.action.hide,
                            })
                        }
                       
                        if (glpro.settings?.greetingCard?.isGreetingCardEnabled) {
                            navigationItems.push({
                                "id": "greetingCard",
                                "rank": 3,
                                "text": glpro.utility.renderLanguageValue(glpro.settings.languageData?.generalSettings?.navigationFields?.greetingCard),
                                "isActive": false,
                                "initFn": glpro.glproGreetingCard.init,
                                "showFn": glpro.glproGreetingCard.action.show,
                                "hideFn": glpro.glproGreetingCard.action.hide,
                            })
                        }
                        //isGiftAddonsEnabled
                        if (glpro.settings?.giftAddons?.isGiftAddonsEnabled) {
                            navigationItems.push({
                                "id": "giftAddons",
                                "rank": 5,
                                "text": glpro.utility.renderLanguageValue(glpro.settings?.languageData?.generalSettings?.navigationFields?.addOns),
                                "isActive": false,
                                "initFn": glpro.glproGiftAddOns.init,
                                "showFn": glpro.glproGiftAddOns.action.show,
                                "hideFn": glpro.glproGiftAddOns.action.hide,
                            })
                        }
                        
                        if(glpro.settings?.giftMessage?.isGiftMessageEnabled){
                            navigationItems.push({
                                "id": "giftMessage",
                                "rank": 2,
                                "text": glpro.utility.renderLanguageValue(glpro.settings?.languageData?.generalSettings?.navigationFields?.message),
                                "isActive": false,
//                               "initFn": glpro.glproGiftWrap.init,

// //                          "showFn": glpro.glproModal.action.glproGiftMessage.show,
                                "showFn": glpro.glproGiftMessageV2.action.show,
                                "initFn": glpro.glproGiftMessageV2.init,
                                "hideFn": glpro.glproGiftMessageV2.action.hide,
                                // "showFn": glpro.glproGiftWrap.action.show,       

                            })
                        }
                        if( glpro.settings?.scheduleDelivery?.isScheduleDeliveryEnabled){
                            navigationItems.push({
                                "id": "scheduleDelivery",
                                "rank":4,
                                "text": glpro.utility.renderLanguageValue(glpro.settings?.languageData?.generalSettings?.navigationFields?.deliverySchedule),
                                "isActive": false,          
                                "initFn": glpro.glproScheduleDelivery.init,
                                "showFn": glpro.glproScheduleDelivery.action.show,
                                "hideFn": glpro.glproScheduleDelivery.action.hide,
                            })
                        }
                     return navigationItems;
                    },
                    renderNavigationHTML: function(){
                        let navigationHTML = glpro.$("<div>").addClass("glproNavigation");
                        // let navigationItems = glpro.glproModal.setNavigationItems();
                        let navigationItems = glpro.glproModal.state.navigationItems;
                        let navigationItemsListHTML = glpro.$("<div>").addClass("glproNavigationList");
                        let navigationItemHTML = glpro.$("<div>").addClass("glproNavigationItem");
                        //run a for loop with each navigation item with the following properties text, onclick function, isActive

                        //OLD code
                        // for(let i = 0; i < navigationItems.length; i++){
                        //     let item = navigationItems[i];
                        //     let navigationItem= navigationItemHTML.clone();
                        //     navigationItem.attr("id", item.id);
                        //     navigationItem.text(item.text);
                        //     navigationItem.on("click", item?.showFn);
                        //     navigationHTML.append(navigationItem)
                        // }

                        for(let i = 0; i < navigationItems.length; i++){
                            let item = navigationItems[i];
                            let navigationItem= navigationItemHTML.clone();
                            navigationItem.attr("id", item.id);
                            navigationItem.text(item.text);
                             //applyheader class 
                            glpro.f.applyHeaderCSS(navigationItem)
                            navigationItem.on("click", item?.showFn);
                            navigationItemsListHTML.append(navigationItem)
                        }
                       
                        
                        navigationHTML.append(navigationItemsListHTML)

                        //code to introduce paddles to the navigation
                        // let navigationPaddleHTML = glpro.glproModal.f.renderNavigationPaddleHTML();
                        // navigationHTML.append(navigationPaddleHTML);
                        return navigationHTML;
                    },
                    getNavItem: function(id){
                        let navigationItems = glpro.glproModal.state.navigationItems;
                        let navigationItem = navigationItems.filter(function(item){
                            return item.id === id;
                        })
                        return navigationItem[0];
                    },
                    renderNavigationPaddleHTML: function(){
                        // return `<div class="glpro_paddles">
                        //     <button class="glpro_left-paddle glpro_paddle hidden">
                        //         <
                        //     </button>
                        //     <button class="glpro_right-paddle glpro_paddle">
                        //         >
                        //     </button>
                        // </div>`

                        //change the above to the following jquery code
                        let navigationPaddleHTML = glpro.$("<div>").addClass("glpro_paddles");
                        let _leftPaddle = glpro.$("<button>").addClass("glpro_left-paddle glpro_paddle hidden");
                        let _rightPaddle = glpro.$("<button>").addClass("glpro_right-paddle glpro_paddle");
                        navigationPaddleHTML.append(_leftPaddle);

                        //add the following code respectively
                        // duration of scroll animation
                        //on click scroll to the next div   
                        glpro.$(_rightPaddle).on("click", function(){
                          
                            //get the current active nav item
                            // let activeNavItem = glpro.glproModal.state.activeNavItem;
                            let nextNavItem =  glpro.glproModal.f.getNextNavigationItem();
                            if(nextNavItem){
                                nextNavItem.showFn();
                            }
                            else{
                                return;
                            }
                            // scroll to the next div
                            let nextDiv = glpro.$("#" + nextNavItem.id);
                          
                            //scroll to the next div
                            //horizontalscroll to the div with id of the next nav item
                            //scroll to the right of the div
                            //horizontal scroll to the div with id of the next nav item

                            glpro.$("#glproModal").animate({
                                scrollLeft: nextDiv.offset().left
                            }, 500);
                        })
                        
                        navigationPaddleHTML.append(_rightPaddle);
                        return navigationPaddleHTML;

                    },
                    getNextNavigationItem: function(){

                        let navigationItems = glpro.glproModal.state.navigationItems;
                        let currentNavigationId = glpro.glproModal.state.currentNavigationId;

                        let currentNavigationItem = glpro.glproModal.f.getNavItem(currentNavigationId);

                        // find the index of the current navigation item
                        let currentNavigationIndex = navigationItems.indexOf(currentNavigationItem);
                        console.log(currentNavigationIndex);
                        // get the next navigation item making sure its not the last one, if its then return null
                        if(currentNavigationIndex === navigationItems.length - 1){
                            return null;
                        }
                        else {
                            return navigationItems[currentNavigationIndex + 1];
                        }
                    },
                    isNavElementLast: function(id){
                        // if it is last then return null
                        let navigationItems = glpro.glproModal.state.navigationItems;
                        let currentNavigationId = id;

                        //check if the passed id is the last one
                        let currentNavigationItem = glpro.glproModal.f.getNavItem(currentNavigationId);
                        let currentNavigationIndex = navigationItems.indexOf(currentNavigationItem);
                        if(currentNavigationIndex === navigationItems.length - 1){
                            return true;
                        }
                        else {
                            return false;
                        }
                    },
                    initalizeModalComponents:async function(){
                        //get the navigation items
                        let navigationItems = glpro.glproModal.state.navigationItems;

                       for(let i = 0; i < navigationItems.length; i++){
                            let item = navigationItems[i];
                            await item.initFn();
                            if(i==0){
                                navigationItems[i].isActive = true;
                                item.showFn();
                            }
                        }
                    },
                    hideAllComponents: function(){
                        let navigationItems = glpro.glproModal.state.navigationItems;
                        for(let i = 0; i < navigationItems.length; i++){
                            let item = navigationItems[i];
                            item.isActive = false;
                            item.hideFn && item?.hideFn();
                        }   
                    },
                    updateNavigation : function(){
                        let currentNavigationId = glpro.glproModal.state.currentNavigationId;
                        let navItem = glpro.$(`.glproNavigationItem[id='${currentNavigationId}']`);
                        //remove the class from all the other navItems
                        glpro.$(".glproNavigationItem").removeClass("activeNavItem");
                        navItem.addClass("activeNavItem");
                    }
                },
                action:{

                    registerEvents: function(){
                        //
                    },
                    onModalClose: async function(){
                        let cart = await glpro.glproGiftMessageV2.f.saveMessageToCart();
                        if(glpro.f.getPageType()=="cart"){
                            window.location.reload();
                        }

                        await glpro.f.cleanupAdditionalNotesProperty(cart);

                        await glpro.glproGiftOptionsPageEle.f.syncGlproPageEleCheckbox()
                        glpro.$(".glproModalWrapper").hide();
                    },
                    onModalOpen : function(){
                        glpro.$(".glproModalWrapper").show()
                    },
                    onModalNext : async function(){
                        //get the current navigation item 
                        // and find the next navigation item in the array and call the showFn function

                        //save the current value of the navigation item
                        let currentNavigationId = glpro.glproModal.state.currentNavigationId;
                        if(currentNavigationId == "giftMessage"){

                            if(glpro?.settings?.isEmailEnabled){
                            let email = glpro.$(".glproVideoMsgEmailField").val()
                            let emailValid = glpro.utility.emailValidation(email);
                            let emailValidationError = glpro.$("<div>").addClass("glproEmailValidationError").text(glpro.utility.renderLanguageValue(glpro.settings?.languageData?.generalSettings?.emailValidationError)||"Please enter a valid email address");
                            glpro.glproVideoMsg.state.emailId = email;
                            if(email!=""){
                                if(!emailValid){
                                    glpro.$(".glproEmailValidationError").remove();
                                    glpro.$(".glproVideoMsgEmailField").after(emailValidationError);
                                    return;
                                }
                            }
                             //do the form Validation here
                             if(glpro.glproVideoMsg.state.uploadedVideoId || glpro.$(".glproVideoMsgCheckboxField").is(":checked")){
                                    if(email.trim() == "" || !emailValid){
                                        //replace the old instance of glproEmailValidationError if found
                                        glpro.$(".glproEmailValidationError").remove();
                                        glpro.$(".glproVideoMsgEmailField").after(emailValidationError);
                                        return;
                                    }
                                }else{
                                    //if the video message is not checked then remove the error message
                                    glpro.$(".glproEmailValidationError").remove(); 
                                }
                            }

                            await glpro.glproGiftMessageV2.f.saveMessageToCart();
                            // await glpro.glproGiftMessageV2.f.addVideoMessageToCart();

                        }

                        let nextNavigationItem = glpro.glproModal.f.getNextNavigationItem();
                        //check if its the last navigation item
                        if(nextNavigationItem){
                            nextNavigationItem.showFn();
                        }
                        else{
                            // await glpro.glproModal.action.onModalDone();
                            glpro.glproModal.action.onModalClose();
                        }
                    },
                    onModalDone: async function(){

                        await glpro.glproGiftMessageV2.f.saveMessageToCart();
                        glpro.glproModal.action.onModalNext();
                    }
                },
                common:{
                    renderHTML: async function(productHandle,productVariants,noteAttribute, getAllAddOnProducts){

                        let productData = "";
                        if(noteAttribute=="giftAddons"){
                            productData = getAllAddOnProducts.find(function(element){
                                return element.handle == productHandle;
                            })
                        }else{
                            productData = await glpro.utility.getProductDataV2(productHandle);
                        }
                        

                        // and atleast one variant is available
                        
                        //   if the product is unavailable/deleted then return
                        if(!productData || productData?.available != true){
                            return;
                        }
                        

                        let productVariantsFromDB = productVariants;
                        let giftWrapHTML = glpro.$("<div>").addClass("glproGiftWrapHTML");
                        let variantArray = [];
                        let giftWrapDetails = glpro.$("<div>").addClass("glproGiftWrapDetails")
                        for(let i = 0; i < productData.variants.length; i++){
                            let variant = productData.variants[i];
                            
                            //TODO LATER! EXTRA CHECK,if this is not found then get the variantImage from the featured_image.src from the productData.variants // 
                            
                            let variantDB = productVariantsFromDB.find(function(item){
                                return (variant.id == item.variantId || variant.id == item.id);
                            })

                            //find the variant id from the db else continue
                            if(!variantDB || variant.available != true ){
                                continue;
                            }else{
                                glpro.state.atleastOneProduct[noteAttribute] = true;
                            }

                            

                            let giftWrapVariant = glpro.$("<div>").addClass("glproGiftWrapVariant")
                            if(productData.variants.length==1 && noteAttribute != "giftAddons"){
                                giftWrapVariant.addClass("glproGiftWrapVariantSingle");
                                
                            }
                            //add attributes to the giftWrapVariant
                            giftWrapVariant.attr("data-variant-id", JSON.stringify(variant.id));
                            let giftWrapVariantDetails = glpro.$("<div>").addClass("glproGiftWrapVariantDetails")
                            let giftWrapImageWrapper = glpro.$("<div>").addClass("glproGiftWrapImageWrapper")
                            let giftWrapAddButton = glpro.$("<button>").addClass("glproGiftWrapButton").text("Add" || glpro.settings.languageData.giftwrap.button.value)
                            
                            


                            glpro.f.applyAddButtonCSS(giftWrapAddButton);

                            let data = {
                                "variant": variant,
                                "productData": productData,
                            }
                            
                            //check if the variant is in the cart
                            const isItemInCart = glpro.utility.checkIfItemPresentInCart(data.variant.id);
                            if(isItemInCart){
                                glpro.glproModal.common.activateRemoveButton(giftWrapAddButton,data,noteAttribute);
                                glpro.glproModal.common.showAddedToCartText(giftWrapAddButton);
                            }
                            else{
                                glpro.glproModal.common.activateAddButton(giftWrapAddButton,data,noteAttribute);
                            }

                            if (variant.featured_image) {
                                variant.featured_image = variant.featured_image.src
                            } else {
                                //TODO
                                variant.featured_image = productData.featured_image
                            }

                            let giftWrapImage = glpro.$("<img>").addClass("glproGiftWrapImage").attr("src",  variant?.featured_image || variantDB?.variantImage );
                           
                            let imageWrapper = giftWrapImageWrapper.append(giftWrapImage);

                            if(variant.title == "Default Title" || variant.option1 == "Default Title"){
                                // variant.title = "";
                                if (noteAttribute == "giftwrap"){
                                    variant.title = "Wrap"
                                }
                                else if(noteAttribute=="greetingCard") {
                                    variant.title = "Greeting Card"
                                }
                                else{
                                    variant.title = " ";
                                }
                            }

                            if(noteAttribute == "greetingCard"){
                                productData.title = variant.option1;
                            }
                            if(noteAttribute == "giftwrap"){
                                productData.title = variant.option1;
                            }

                            let giftWrapTitle = glpro.$("<div>").addClass("glproGiftWrapTitle").text(productData.title);
                            let giftWrapSubtext = glpro.$("<div>").addClass("glproGiftWrapSubtext").text(variant.title || variant.option1);
                            
                            let price = variant.price > 0 ? parseFloat(variant.price / 100) : variant.price
                            // if(price && !Number.isInteger(price)){
                                price = price.toFixed(2)
                            // }
                            if (glpro.settings.merchantInfo && glpro.settings.merchantInfo.currencyInfo && glpro.settings.merchantInfo.currencyInfo.symbol) {
                                price = glpro.settings.merchantInfo.currencyInfo.symbol + price
                            }
                            let giftWrapPrice = glpro.$("<div>").addClass("glproGiftWrapPrice").text(price)

                            let giftWrapVariantPriceAndButtonWrapper = glpro.$("<div>").addClass("glproGiftWrapVariantPriceAndButtonWrapper")

                            // giftWrapVariantPriceAndButtonWrapper.append(giftWrapPrice);
                            giftWrapVariantPriceAndButtonWrapper.append(giftWrapAddButton);
                            
                            imageWrapper.append(giftWrapImage)
                            giftWrapVariantDetails.append(giftWrapTitle);
                            
                            //if note Attribute is giftwrap or greetingCard then dont append subtext
                            if(noteAttribute != "giftwrap" && noteAttribute != "greetingCard"){
                                giftWrapVariantDetails.append(giftWrapSubtext);
                            }

                            // giftWrapVariantDetails.append(giftWrapSubtext)
                            giftWrapVariantDetails.append(giftWrapPrice)
                            giftWrapVariantDetails.append(giftWrapVariantPriceAndButtonWrapper)

                            giftWrapVariant.append(imageWrapper)
                            giftWrapVariant.append(giftWrapVariantDetails)

                            variantArray.push(giftWrapVariant);
                            // giftWrapHTML.append(giftWrapVariant)
                        }
                        return variantArray;
                            
                    },
                    activateAddButton: async function(buttonEle,data,noteAttribute){
                        buttonEle.text(glpro.utility.renderLanguageValue(glpro.settings?.languageData?.generalSettings?.popUpFields?.addBtnText) || "Add" )
                        buttonEle.removeClass("glproGiftWrapRemoveButton")
                        buttonEle.addClass("glproGiftWrapAddButton")

                        let parentClass, isLimitReached;
                        let currentNavigationId = glpro.glproModal.state.currentNavigationId;

                        if(currentNavigationId == "giftwrap"){
                            parentClass = "giftWrapBody"
                            isLimitReached = await glpro.glproGiftWrap.f.checkIfPurchaseLimitReached();
                        }
                        else if(currentNavigationId == "greetingCard"){
                            parentClass = "greetingCardBody"
                            isLimitReached = await glpro.glproGreetingCard.f.checkIfPurchaseLimitReached();
                        }

                        if(parentClass && isLimitReached){
                            glpro.glproModal.common.disableAllAddButtons(parentClass);
                        }

                        glpro.f.applyAddButtonCSS(buttonEle);
                        //get current navigation item
                        

                        buttonEle.off("click")
                        buttonEle.on("click",  async function(){
                                let cartData = await glpro.glproModal.common.addToCart(data,noteAttribute);
                                glpro.state.cartData = cartData;    
                                glpro.glproModal.common.activateRemoveButton(buttonEle, data);

                                let parentClass;
                                let isLimitReached;
                                let currentNavigationId = glpro.glproModal.state.currentNavigationId;
                                if(currentNavigationId == "giftwrap"){
                                    parentClass = "giftWrapBody"
                                    isLimitReached = await glpro.glproGiftWrap.f.checkIfPurchaseLimitReached(cartData);
                                }
                                else if(currentNavigationId == "greetingCard"){
                                    parentClass = "greetingCardBody"
                                    isLimitReached = await glpro.glproGreetingCard.f.checkIfPurchaseLimitReached(cartData);
                                }

                                if(parentClass && isLimitReached){
                                    glpro.glproModal.common.disableAllAddButtons(parentClass);
                                }
                                glpro.glproModal.common.showAddedToCartText(buttonEle);                        
                        })
                    },
                    activateRemoveButton: async function(buttonEle,data,noteAttribute){
                        let {variant,parent} = data;
                        buttonEle.text( glpro.utility.renderLanguageValue(glpro.settings?.languageData?.generalSettings?.popUpFields?.removedBtnText) || "Remove")
                        //replace with a new class
                        buttonEle.removeClass("glproGiftWrapAddButton")
                        buttonEle.addClass("glproGiftWrapRemoveButton")
                        glpro.f.applyRemoveButtonCSS(buttonEle);   

                       
                        //remove the previous click event
                        buttonEle.off("click")
                        buttonEle.on("click", async function(){
                                await glpro.glproModal.common.removeFromCart(data);
                                let parentClass;
                                let isLimitReached;
                                let currentNavigationId = glpro.glproModal.state.currentNavigationId; 
        
                                if(currentNavigationId == "giftwrap"){
                                    parentClass = "giftWrapBody"
                                    isLimitReached = await glpro.glproGiftWrap.f.checkIfPurchaseLimitReached();
                                }
                                else if(currentNavigationId == "greetingCard"){
                                    parentClass = "greetingCardBody"
                                    isLimitReached = await glpro.glproGreetingCard.f.checkIfPurchaseLimitReached();
                                }

                                await glpro.glproModal.common.activateAddButton(buttonEle,data,noteAttribute);

                                if(parentClass && isLimitReached == false){
                                    // glpro.glproModal.common.enableAddButtons(parentClass);
                                    glpro.glproModal.common.enableAllAddButtons(parentClass);
                                }
                        })
                    },
                    showAddedToCartText: function(buttonEle){
                        // add a new element next to the buttonEle and show the text
                        let addedToCartText = glpro.$("<div>").addClass("glproGiftWrapAddedToCartText").text(glpro.utility.renderLanguageValue(glpro.settings?.languageData?.generalSettings?.popUpFields?.addedText) || "Added")
                        buttonEle.after(addedToCartText)
                        //TODO added to cart
                        setTimeout(function(){
                            addedToCartText.remove();
                        },2000)
                    },
                    disableAllAddButtons: function(parentClass){
                        let parent = glpro.$(`.${parentClass}`);
                        let addButtons = parent.find(".glproGiftWrapAddButton");
                        addButtons.each(function(){
                            //disable the button and add a class of
                            let buttonEle = glpro.$(this);
                            buttonEle.addClass("glproGiftWrapAddButtonDisabled")
                            buttonEle.attr("disabled",true)
                        })
                    },
                    enableAllAddButtons: function(parentClass){
                        let parent = glpro.$(`.${parentClass}`);
                        let addButtons = parent.find(".glproGiftWrapAddButtonDisabled");
                        addButtons.each(function(){
                            //disable the button and add a class of
                            let buttonEle = glpro.$(this);
                            buttonEle.removeClass("glproGiftWrapAddButtonDisabled")
                            buttonEle.attr("disabled",false)
                        })
                    },
                    addToCart: async function({variant, parent},noteAttribute){
                        // try{
                         return   await glpro.utility.updateCart({ updates: { [variant.id]: 1 }, attributes:{[variant.id]:noteAttribute} })
                        // }catch(error){
                        //     console.log(error)
                        //     alert("Something went wrong")
                        // }
                    },
                    removeFromCart: async function({variant, parent},noteAttribute){
                    //    try{
                          await glpro.utility.updateCart({ updates: { [variant.id]: 0 }, attributes:{[variant.id]:""} })
                          
                          //remove the added to cart div if it exists in the same element scope

                          //check the div data-id for the variant id
                            // let variantDiv = glpro.$(".glproGiftWrapVariant[data-variant-id='"+variant.id+"']")
                            // if(variantDiv.length > 0){
                            //  //now find the glproGiftWrapAddedToCartText div inside the variant div
                            //     let addedToCartText = glpro.$(".glproGiftWrapAddedToCartText",variantDiv)
                            //     if(addedToCartText.length > 0){
                            //         // addedToCartText.css("border","2px solid red");
                            //         addedToCartText.remove();
                            //     }
                            // }
                    //    }catch(error){
                    //         console.log(error)
                    //         alert("Something went wrong")
                    //    }
                    }
                    
                }
            },
            glproGiftWrap:{
                state:{
                    glproGiftWrap:"",
                },
                init: function(){
                    glpro.glproGiftWrap.initialize()
                },

                initialize: async function(){
                    let giftWrapContentHTML = glpro.$("<div>").addClass("glproMainContentHTML").addClass("glproGiftWrapMainContent");


                    //TODO: Gift Wrap Subtext
                    let giftWrapSubtext = glpro.$("<div>").addClass("giftWrapSubtext");
                    giftWrapSubtext.html(glpro.utility.renderLanguageValue(glpro.settings.languageData?.additionalFields?.giftWrapSubtext));
                    if(giftWrapSubtext && giftWrapSubtext.html().length>0){
                        glpro.f.applyLabelCSS(giftWrapSubtext);
                        giftWrapContentHTML.append(giftWrapSubtext);
                    }


                    let mainContentRowContainer = glpro.$("<div>").addClass("mainContentRowContainer");

                    let giftWrapContent = await glpro.glproModal.common.renderHTML(glpro.settings.giftwrap.productHandle,glpro.settings.giftwrap.productVariants,"giftwrap");


                    // if giftWrapContent has a class of glproGiftWrapVariantSingle then add a glproGiftWrapJustOneChild class to the mainContentRowContainer
                    if(giftWrapContent.length == 1){
                        mainContentRowContainer.addClass("glproJustOneChild")
                    }
                    mainContentRowContainer.append(giftWrapContent)
                    //if giftWrap Content is empty then show No Products to display

                    //TODO
                    if(true){
                        if(glpro.state.atleastOneProduct.giftwrap != true){
                            giftWrapContent = glpro.$("<div>").addClass("glproNoProductsToDisplay").text(glpro.utility.renderLanguageValue(glpro.settings?.languageData?.generalSettings?.popUpFields?.noProductsToDisplay) || "No Products to display")
                        }
                    }
                   

                    mainContentRowContainer.append(giftWrapContent);
                    giftWrapContentHTML.append(mainContentRowContainer);

                  
                    let giftWrapButtons  = await glpro.glproGiftWrap.f.renderButtons();
                    // giftWrapHTML.append(giftWrapButtons);

                    glpro.$(".giftWrapBody").html(giftWrapContentHTML);
                    glpro.$(".giftWrapBody").append(giftWrapButtons);
                },
                f:{
                    renderButtons: function(){
                        // write a wrapper
                        let giftWrapButtonsWrapper = glpro.$("<div>").addClass("giftWrapButtonsWrapper");
                        let giftWrapNextButton = glpro.$("<button>").addClass("glproGiftWrapNextButton").text(glpro.utility.renderLanguageValue(glpro.settings?.languageData?.generalSettings?.popUpFields?.next) || "Add")
                        let giftWrapSkipButton = glpro.$("<button>").addClass("glproGiftWrapRemoveButton").text(glpro.utility.renderLanguageValue(glpro.settings?.languageData?.generalSettings?.popUpFields?.skip) || "Remove")
                        let giftWrapFinalButton = glpro.$("<button>").addClass("glproGiftWrapFinalButton").text(glpro.utility.renderLanguageValue(glpro.settings?.languageData?.generalSettings?.popUpFields?.done) || "Done")

                        if (glpro.glproModal.f.isNavElementLast('giftwrap')==true) {
                            glpro.f.applyButtonCSS(giftWrapFinalButton);
                            giftWrapFinalButton.on("click",function(event){
                                glpro.glproModal.action.onModalDone();
                            })
                            giftWrapButtonsWrapper.append(giftWrapFinalButton);
                        }
                        else{
                            glpro.f.applyButtonCSS(giftWrapNextButton);
                            giftWrapNextButton.on("click",function(event){
                                glpro.glproModal.action.onModalNext();
                            })
                            giftWrapButtonsWrapper.append(giftWrapNextButton);
                        }
                        // giftWrapButtonsWrapper.append(giftWrapSkipButton);
                        return giftWrapButtonsWrapper;
                    },
                    checkIfPurchaseLimitReached: async function(cartData){
                        let currentQuantityInCart;

                        let productVariants = glpro.settings.giftwrap.productVariants;
                        let variantIds = productVariants.map((variant)=>{return variant.id})
                        currentQuantityInCart = await glpro.utility.getQuantityOfItemInCart(variantIds,cartData);
                        let purchaseLimitCount = glpro.settings.giftwrap.purchaseLimitCount;

                        let limitReached = (currentQuantityInCart >= purchaseLimitCount ) ? true : false;

                        return limitReached;
                    }

                },
                action:{
                    show: async function(){
                        glpro.glproModal.f.hideAllComponents();
                        glpro.$(".giftWrapBody").show();
                        // glpro.$(".giftWrapBody").css("display","grid");
                        glpro.glproModal.state.currentNavigationId = "giftwrap";
                        glpro.glproModal.f.updateNavigation();
                    },
                    hide: function(){
                        glpro.$(".giftWrapBody").hide();
                    },
                    addToCart: async function({variant, parent}){
                        await glpro.utility.updateCart({ updates: { [variant.id]: 1 }, attributes:{[variant.id]:"glproGiftWrap"} })
                    },
                    removeFromCart: async function({variant, parent}){
                        //TODO try and catch
                        await glpro.utility.updateCart({ updates: { [variant.id]: 0 }, attributes:{[variant.id]:""} })
                    }
                }
            },
            glproGiftAddOns:{
                state:{
                    glproGiftAddOns:"",
                },
                init: function(){
                    // glpro.glproGiftAddOns.action.registerEvents(),
                    glpro.glproGiftAddOns.initialize()
                },

                initialize: async function(){
                     await  glpro.glproGiftAddOns.f.renderGiftAddonsHTML();
                },
                f:{
                    renderGiftAddonsHTML: async function(){

                        let giftAddOnsContentHTML = glpro.$("<div>").addClass("glproMainContentHTML").addClass("giftAddOnsContent");
                       

                        let giftAddonsSubtext = glpro.$("<div>").addClass("giftAddonsSubtext");
                        giftAddonsSubtext.html(glpro.utility.renderLanguageValue(glpro.settings?.languageData?.additionalFields?.giftAddOnsSubtext));
                        if(giftAddonsSubtext && giftAddonsSubtext.html().length>0){
                            glpro.f.applyLabelCSS(giftAddonsSubtext);
                            giftAddOnsContentHTML.append(giftAddonsSubtext);
                        }
                        
                        let mainContentRowContainer = glpro.$("<div>").addClass("mainContentRowContainer");

                        let giftAddOnsContent =[];

                        let apiCalls = []
                        for(let i = 0; i < glpro.settings.giftAddons.addOnProducts.length; i++){
                            let productData = glpro.settings.giftAddons.addOnProducts[i];
                            let productHandle = productData.handle;
                            apiCalls.push(glpro.utility.getProductDataV2(productHandle))
                        }
                        let getAllAddOnProducts = await Promise.all(apiCalls)

                        // for loop that traverses the loop of giftAddons.addOnProducts[i].handle
                        // and renders the html for each product
                        for(let i = 0; i < glpro.settings.giftAddons.addOnProducts.length; i++){
                            let productData = glpro.settings.giftAddons.addOnProducts[i];
                            let productHandle = productData.handle;
                            if(productData.variants.length>0){
                                let productVariants = productData.variants;
                                giftAddOnsContent.push(await glpro.glproModal.common.renderHTML(productHandle,productVariants,"giftAddons", getAllAddOnProducts));
                            }
                            else{
                                giftAddOnsContent.push(await glpro.glproGiftAddOns.f.renderHTMLWithNoVariant(productHandle,"giftAddons", getAllAddOnProducts));
                            }
                        }

                        if(giftAddOnsContent && giftAddOnsContent.length == 1 && giftAddOnsContent[0].length == 1 ){
                            giftAddOnsContent[0][0].addClass("glproGiftWrapVariantSingle")
                            mainContentRowContainer.addClass("glproJustOneChild")
                        }

                        //if the glproMainContentHTML div in giftAddonsBody  is  empty then show No Products to display
                        //TODO
                        
                        if(true){
                            if(glpro.state.atleastOneProduct.giftAddons != true){
                                giftAddOnsContent.push(glpro.$("<div>").addClass("glproNoProductsToDisplay").text(glpro.utility.renderLanguageValue(glpro.settings?.languageData?.generalSettings?.popUpFields?.noProductsToDisplay) || "No Products to display"));
                            }
                        }
                        // mainContentRowContainer.append(giftAddOnsContent);
                        //append giftAddOnsContent array to mainContentRowContainer

                        giftAddOnsContent.forEach(function(element){
                            mainContentRowContainer.append(element);
                        })
                        giftAddOnsContentHTML.append(mainContentRowContainer);
                        glpro.$(".giftAddonsBody").append(giftAddOnsContentHTML);

                        // modalNextButton.on("click", function (event) {
                        //     glpro.glproModal.action.onModalNext()
                        // });


                        let giftAddOnsButtons  = await glpro.glproGiftAddOns.f.renderButtons();
                        // giftAddOnsHTML.append(giftAddOnsButtons);
                        glpro.$(".giftAddonsBody").append(giftAddOnsButtons);

                    },
                    renderHTMLWithNoVariant: async function(productHandle,noteAttribute, getAllAddOnProducts){
                        
                        // const productData = await glpro.utility.getProductDataV2(glpro.settings.giftwrap.productHandle);
                        //get productData from getAllAddOnProducts
                        let productData = getAllAddOnProducts.find(function(element){
                            return element.handle == productHandle;
                        })
                        // const productData = await glpro.utility.getProductDataV2(productHandle);
                        console.log(productData);
                        if(!productData  ||  productData?.available !== true){
                            return;
                        }
                        else{
                            glpro.state.atleastOneProduct[noteAttribute] = true;
                        }
                        let giftAddonHTML = glpro.$("<div>").addClass("glproGiftAddonProduct")
                        let giftAddonDetails = glpro.$("<div>").addClass("glproGiftAddonProductDetails")
                        let variant = productData;

                        let giftAddonVariant = glpro.$("<div>").addClass("glproGiftAddonProductVariant")
                        giftAddonVariant.attr("data-variant-id", JSON.stringify(variant.id))
                        //                .attr("data-parent", JSON.stringify(productData));
                        let giftAddonVariantDetails = glpro.$("<div>").addClass("glproGiftAddonProductVariantDetails")
                        let giftAddonImageWrapper = glpro.$("<div>").addClass("glproGiftAddonProductImageWrapper")
                        let giftAddonAddButton = glpro.$("<button>").addClass("glproGiftAddonProductButton").text(glpro.utility.renderLanguageValue(glpro.settings?.languageData?.generalSettings?.popUpFields?.addBtnText) || "Add")
                        
                        // glpro.f.applyRemoveButtonCSS(giftAddonAddButton);
                        let data = {
                            "variant": variant,
                            "productData": productData,
                        }
                        
                        //check if the variant is in the cart
                        const isItemInCart = glpro.utility.checkIfProductPresentInCart(data.variant.id);
                        if(isItemInCart){
                            glpro.glproModal.common.activateRemoveButton(giftAddonAddButton,data,noteAttribute);
                            glpro.glproModal.common.showAddedToCartText(giftAddonAddButton);
                        }
                        else{
                            glpro.glproModal.common.activateAddButton(giftAddonAddButton,data,noteAttribute);
                        }
                        
                        let giftAddonImage = glpro.$("<img>").addClass("glproGiftAddonProductImage").attr("src", variant?.images[0]);
                        
                        let imageWrapper = giftAddonImageWrapper.append(giftAddonImage);
                        let giftAddonTitle = glpro.$("<div>").addClass("glproGiftAddonProductTitle").text(variant?.option1 || variant?.title )
                        let giftAddonPrice = glpro.$("<div>").addClass("glproGiftAddonProductPrice").text(variant?.price > 0? parseFloat(variant?.price / 100).toFixed(2) : variant?.price )

                        let giftAddonVariantPriceAndButtonWrapper = glpro.$("<div>").addClass("glproGiftAddonProductVariantPriceAndButtonWrapper")

                        giftAddonVariantPriceAndButtonWrapper.append(giftAddonPrice);
                        giftAddonVariantPriceAndButtonWrapper.append(giftAddonAddButton);
                        
                        imageWrapper.append(giftAddonImage)
                        giftAddonVariantDetails.append(giftAddonTitle)
                        giftAddonVariantDetails.append(giftAddonVariantPriceAndButtonWrapper)

                        giftAddonVariant.append(imageWrapper)
                        giftAddonVariant.append(giftAddonVariantDetails)

                        giftAddonHTML.append(giftAddonVariant)
                        
                       

                        return giftAddonHTML;
                            
                   
                    },
                    renderButtons: function(){
                        // write a wrapper
                        let giftAddonsButtonsWrapper = glpro.$("<div>").addClass("giftAddonsButtonsWrapper");
                        let giftAddonsNextButton = glpro.$("<button>").addClass("giftAddonsNextButton").text(glpro.utility.renderLanguageValue(glpro.settings?.languageData?.generalSettings?.popUpFields?.next) || "Next")
                        let giftAddonsFinalButton = glpro.$("<button>").addClass("giftAddonsFinalButton").text(glpro.utility.renderLanguageValue(glpro.settings?.languageData?.generalSettings?.popUpFields?.done) || "Done" )

                        //check if this is the last element.
                        if (glpro.glproModal.f.isNavElementLast('giftAddons')==true) {
                            glpro.f.applyButtonCSS(giftAddonsFinalButton);
                            giftAddonsButtonsWrapper.append(giftAddonsFinalButton);
                            giftAddonsFinalButton.on("click",function(event){
                                glpro.glproModal.action.onModalDone();
                            })
                        }
                        else{
                            glpro.f.applyButtonCSS(giftAddonsNextButton);
                            giftAddonsNextButton.on("click",function(event){
                                glpro.glproModal.action.onModalNext();
                            })
                            giftAddonsButtonsWrapper.append(giftAddonsNextButton);
                        }

                        return giftAddonsButtonsWrapper;
                    },
                 },
                action:{
                    show: async function(){
                        glpro.glproModal.f.hideAllComponents();
                        glpro.$(".giftAddonsBody").show();

                        glpro.glproModal.state.currentNavigationId = "giftAddons";
                        glpro.glproModal.f.updateNavigation();

                    },
                    hide: function(){
                        glpro.$(".giftAddonsBody").hide();
                    },

                    addToCart: async function({variant, parent}){
                        await glpro.utility.updateCart({ updates: { [variant.id]: 1 }, attributes:{[variant.id]:"glproGiftAddOns"} })
                    },
                    removeFromCart: async function({variant, parent}){
                        //TODO try and catch
                        await glpro.utility.updateCart({ updates: { [variant.id]: 0 }, attributes:{[variant.id]:""} })
                    }
                }
            },
            glproGreetingCard:{
                state:{
                    glproGreetingCard:"",
                },
                init: function(){
                    glpro.glproGreetingCard.initialize()
                },

                initialize: async function(){
                    let greetingCardContentHTML = glpro.$("<div>").addClass("glproMainContentHTML").addClass("glproGreetingCardContent");

                    let greetingCardHTML = await glpro.glproModal.common.renderHTML(glpro.settings.greetingCard.productHandle,glpro.settings.greetingCard.productVariants,"greetingCard");
                    

                    //TODO
                    let greetingCardSubtext = glpro.$("<div>").addClass("greetingCardSubtext")
                                                .html(glpro.utility.renderLanguageValue(glpro.settings?.languageData?.additionalFields?.greetingCardSubtext))
                    if(greetingCardSubtext && greetingCardSubtext.html() != ""){
                        glpro.f.applyLabelCSS(greetingCardSubtext);
                        greetingCardContentHTML.append(greetingCardSubtext);
                    }



                    let mainContentRowContainer = glpro.$("<div>").addClass("mainContentRowContainer");
                   
                    if(greetingCardHTML.length == 1 ){
                        mainContentRowContainer.addClass("glproJustOneChild")
                    }
                    //if the product is not found then show the error message
                    if(glpro.state.atleastOneProduct.greetingCard != true){
                        greetingCardHTML = glpro.$("<div>").addClass("glproNoProductsToDisplay").text(glpro.utility.renderLanguageValue(glpro.settings?.languageData?.generalSettings?.popUpFields?.noProductsToDisplay) || "No Products to display")
                     }
                    mainContentRowContainer.append(greetingCardHTML);
                    greetingCardContentHTML.append(mainContentRowContainer);

                    let greetingCardButtons  = await glpro.glproGreetingCard.f.renderButtons();

                    //greetingCardRowContainer


                    glpro.$(".greetingCardBody").html(greetingCardContentHTML);
                    glpro.$(".greetingCardBody").append(greetingCardButtons);

                },
                f:{
                    renderButtons: function(){
                        // write a wrapper
                       
                        let greetingCardButtonWrapper = glpro.$("<div>").addClass("greetingCardButtonWrapper");
                        let greetingCardNextButton = glpro.$("<button>").addClass("greetingCardNextButton").text(glpro.utility.renderLanguageValue(glpro.settings?.languageData?.generalSettings?.popUpFields?.next) || "Next")
                        let greetingCardFinalButton = glpro.$("<button>").addClass("greetingCardFinalButton").text(glpro.utility.renderLanguageValue(glpro.settings?.languageData?.generalSettings?.popUpFields?.done) || "Done" )

                        //check if this is the last element.
                        if (glpro.glproModal.f.isNavElementLast('greetingCard')) {
                            glpro.f.applyButtonCSS(greetingCardFinalButton);
                             greetingCardFinalButton.on("click",function(event){
                                glpro.glproModal.action.onModalDone();
                            })
                            greetingCardButtonWrapper.append(greetingCardFinalButton);
                           
                        }
                        else{
                            glpro.f.applyButtonCSS(greetingCardNextButton);
                            greetingCardNextButton.on("click",function(event){
                                glpro.glproModal.action.onModalNext();
                            })
                            greetingCardButtonWrapper.append(greetingCardNextButton);
                        }

                        return greetingCardButtonWrapper;
                    },
                    checkIfPurchaseLimitReached: async function(cartData){
                        let productVariants = glpro.settings.greetingCard.productVariants;
                        let variantIds = productVariants.map((variant)=>{return variant.id})
                        let currentQuantityInCart = await glpro.utility.getQuantityOfItemInCart(variantIds,cartData);
                        let purchaseLimitCount = glpro.settings.greetingCard.purchaseLimitCount;

                        let limitReached = (currentQuantityInCart >= purchaseLimitCount ) ? true : false;

                        return limitReached;
                    },
                },
                action:{
                    show: async function(){
                        glpro.glproModal.f.hideAllComponents();

                        glpro.$(".greetingCardBody").show();
                        
                        glpro.glproModal.state.currentNavigationId = "greetingCard";
                        glpro.glproModal.f.updateNavigation();
                    },
                    hide: function(){
                        glpro.$(".greetingCardBody").hide();
                    }
                }
            },
            glproScheduleDelivery:{
                state:{
                    glproScheduleDelivery:"",
                },
                init: function(){
                    glpro.glproScheduleDelivery.initialize()
                },
                initialize: async function(){

                    let scheduleDeliveryMainContent = glpro.$("<div>").addClass("scheduleDeliveryMainContent");
                    
                    try{
                        await glpro.importExternalScript("date-flatpickr");
                        console.log("date-flatpickr imported");
                    }
                    catch{
                        console.log("date-flatpickr not imported");
                    }
                    let scheduleDeliveryHTML = await glpro.glproScheduleDelivery.f.renderHTML();


                    //TODO
                    let scheduleDeliverySubtext = glpro.$("<div>").addClass("scheduleDeliverySubtext")
                                                .html(glpro.utility.renderLanguageValue(glpro.settings?.languageData?.additionalFields?.scheduleDeliverySubtext))

                    if(scheduleDeliverySubtext && scheduleDeliverySubtext.text() != ""){
                        glpro.f.applyLabelCSS(scheduleDeliverySubtext);
                        scheduleDeliveryMainContent.append(scheduleDeliverySubtext);
                    }

                    scheduleDeliveryMainContent.append(scheduleDeliveryHTML);
                    


                    let scheduleDeliveryButtons = await glpro.glproScheduleDelivery.f.renderButtons();

                    glpro.$(".scheduleDeliveryBody").append(scheduleDeliveryMainContent);
                    glpro.$(".scheduleDeliveryBody").append(scheduleDeliveryButtons);
                },
                f:{
                    renderHTML: async function(){
                        // a checkbox with a datepicker 
                        let scheduleDeliveryHTML = glpro.$("<div>").addClass("glproScheduleDeliveryHTML")
                        let scheduleDeliveryDetails = glpro.$("<div>").addClass("glproScheduleDeliveryDetails")
                        

                        //write a checkbox
                        let scheduleDeliveryCheckbox = glpro.$("<div>").addClass("glproScheduleDeliveryCheckbox")
                        let scheduleDeliveryCheckboxLabel = glpro.$("<label>").addClass("glproScheduleDeliveryCheckboxLabel").text(glpro.utility.renderLanguageValue(glpro.settings?.languageData?.deliveryScheduler?.dateLabel) || "Checkbox label")

                        let scheduleDeliveryDatePickerLabel = glpro.$("<label>").addClass("glproScheduleDeliveryDatePickerLabel").text("")
                        let scheduleDeliveryDatePickerInput = glpro.$("<input>").addClass("glproScheduleDeliveryDatePickerInput").attr("type","date")

                        // min date is today+ glpro.settings.scheduleDelivery.leadTime
                        // let scheduleDeliveryDatePickerInputMinDate = new Date();
                        // scheduleDeliveryDatePickerInputMinDate.setDate(glpro.glproScheduleDelivery.f.calculateDaysFromToday(glpro.settings.scheduleDelivery.leadTime));
                        let scheduleDeliveryDatePickerInputMinDate = glpro.glproScheduleDelivery.f.calculateDaysFromToday(glpro.settings.scheduleDelivery.leadTime)
                        // scheduleDeliveryDatePickerInput.attr("min", scheduleDeliveryDatePickerInputMinDate.toISOString().split("T")[0]);

                        // let scheduleDeliveryDatePickerInputMaxDate = new Date();
                        // scheduleDeliveryDatePickerInputMaxDate.setDate(glpro.glproScheduleDelivery.f.calculateDaysFromToday(glpro.settings.scheduleDelivery.maxDateInDays));
                        let scheduleDeliveryDatePickerInputMaxDate = glpro.glproScheduleDelivery.f.calculateDaysFromToday(glpro.settings.scheduleDelivery.maxDateInDays)
                        // scheduleDeliveryDatePickerInput.attr("max", scheduleDeliveryDatePickerInputMaxDate.toISOString().split("T")[0]);

                        const disabledDates = glpro.settings.scheduleDelivery.disabledDates;
                        const disabledDays = glpro.settings.scheduleDelivery.disabledDaysOfWeek;

                        let isValidDate;
                        // scheduleDeliveryDatePickerInput.on("change",async function(){
                        //     console.log("Date changed")
                        //     let val = scheduleDeliveryDatePickerInput.val(); 
                        //     isValidDate = glpro.glproScheduleDelivery.f.isValidDate(val);
                        //     if(isValidDate){
                        //        await glpro.glproScheduleDelivery.f.updateScheduleDeliveryDateToCart(scheduleDeliveryDatePickerInput.val())
                        //     }else{
                        //         alert(glpro.utility.renderLanguageValue(glpro.settings?.languageData?.deliveryScheduler?.badInput))
                        //         scheduleDeliveryDatePickerInput.val("")
                        //     }
                        // })

                        let scheduleDeliveryDatePickerWrapper = glpro.$("<div>").addClass("glproScheduleDeliveryDatePickerWrapper")
                        scheduleDeliveryDatePickerWrapper.append(scheduleDeliveryDatePickerLabel)
                        scheduleDeliveryDatePickerWrapper.append(scheduleDeliveryDatePickerInput)
                        
                        
                        let scheduleDeliveryCheckboxInput = glpro.$("<input>").addClass("glproScheduleDeliveryCheckboxInput").attr("type","checkbox")
                        scheduleDeliveryDatePickerInput.attr("placeholder",glpro.utility.renderLanguageValue(glpro.settings?.languageData?.deliveryScheduler?.dateLabel||"Select a date1?"))
                        // scheduleDeliveryCheckboxInput.on("click", async function (event) {
                        //   if(event.target.checked){
                        //     glpro.$(document).find(".glproScheduleDeliveryDatePickerInput").attr("disabled",false)
                        //   }else{
                        //     glpro.$(document).find(".glproScheduleDeliveryDatePickerInput").attr("disabled",true)
                        //     scheduleDeliveryDatePickerInput.val("")
                        //     await glpro.glproScheduleDelivery.f.updateScheduleDeliveryDateToCart(scheduleDeliveryDatePickerInput.val())
                        //   }
                        // })
                        flatpickr(scheduleDeliveryDatePickerInput,{
                            inline: true,
                            dateFormat: "d-m-Y",
                            time_24hr: true,
                            minDate: scheduleDeliveryDatePickerInputMinDate,
                            maxDate : scheduleDeliveryDatePickerInputMaxDate,
                            disable: [
                                function(date) {
                                    // return true to disable
                                    // let d = new Date(date+"Z");
                                    let d = glpro.utility.getDate(date);
                                    // d = (d.toISOString().split('T')[0]);
                                    // return (date.getDay() === 0 || date.getDay() === 6);
                                    if(disabledDates.includes(d) || disabledDays.includes(new Date(date).toLocaleString('en-us', {weekday:'long'})))
                                    {
                                        return true;
                                    }
                                }
                            ],
                            onChange: async function(selectedDates, dateStr, instance) {
                                console.log("date changed");
                                console.log({dateStr});
                                await glpro.glproScheduleDelivery.f.updateScheduleDeliveryDateToCart(dateStr)
                            },
                            // appendTo: gbb.$(body)
                        });

                        //get glproScheduleDelivery from cart attribute
                        if(glpro.utility.isCartEmpty() == false && glpro.utility.getAttributValueFromCart("glproScheduleDelivery") != null){
                            scheduleDeliveryDatePickerInput.val(glpro.utility.getAttributValueFromCart("glproScheduleDelivery"));
                            glpro.$(document).find(".glproScheduleDeliveryDatePickerInput").attr("disabled",false);
                            scheduleDeliveryCheckboxInput.prop("checked",true);
                        }

                        
                        let scheduleDeliveryCheckboxWrapper = glpro.$("<div>").addClass("glproScheduleDeliveryCheckboxWrapper")
                        
                        
                        scheduleDeliveryCheckboxWrapper.append(scheduleDeliveryCheckboxInput)
                        scheduleDeliveryCheckboxWrapper.append(scheduleDeliveryCheckboxLabel)


                        // scheduleDeliveryDetails.append(scheduleDeliveryCheckboxWrapper)
                        scheduleDeliveryDetails.append(scheduleDeliveryDatePickerWrapper)

                        scheduleDeliveryHTML.append(scheduleDeliveryDetails)

                        return scheduleDeliveryHTML;
                    },
                    isValidDate: function(date){
                        const disabledDates = glpro.settings.scheduleDelivery.disabledDates;
                        const disabledDays = glpro.settings.scheduleDelivery.disabledDaysOfWeek;
                        //checkIfDateis Valid and not in the disabled dates array and check of the day is not in the disabled days array
                        if(!disabledDates.includes(date) && !disabledDays.includes(new Date(date).toLocaleString('en-us', {weekday:'long'}))){
                            return true
                        }
                    },
                    updateScheduleDeliveryDateToCart: async function(date){
                        glpro.glproScheduleDelivery.state.glproScheduleDelivery = date;
                        let updateCartData = {  }
                        // updateCartData.note =  glpro.glproScheduleDelivery.state.glproScheduleDelivery
                        updateCartData.attributes = {"glproScheduleDelivery": glpro.glproScheduleDelivery.state.glproScheduleDelivery};
                        await glpro.utility.updateCart(updateCartData);
                    },

                    calculateDaysFromToday: function(numberOfDays){
                        return new Date(Date.now() + parseInt(numberOfDays) * 24 * 60 * 60 * 1000) 
                    },
                    renderButtons : function (){
                        let scheduleDeliveryButtonsWrapper = glpro.$("<div>").addClass("scheduleDeliveryButtonsWrapper");
                        let scheduleDeliveryNextButton = glpro.$("<button>").addClass("scheduleDeliveryNextButton").text(glpro.utility.renderLanguageValue(glpro.settings?.languageData?.generalSettings?.popUpFields?.next) || "Next");
                        let scheduleDeliveryFinalButton = glpro.$("<button>").addClass("scheduleDeliveryFinalButton").text(glpro.utility.renderLanguageValue(glpro.settings?.languageData?.generalSettings?.popUpFields?.done) || "Done");
                        glpro.f.applyButtonCSS(scheduleDeliveryNextButton);
                        glpro.f.applyButtonCSS(scheduleDeliveryFinalButton);
                        if (glpro.glproModal.f.isNavElementLast('scheduleDelivery')==true) {
                            scheduleDeliveryFinalButton.on("click",function(event){
                                glpro.glproModal.action.onModalDone();
                            })
                            scheduleDeliveryButtonsWrapper.append(scheduleDeliveryFinalButton);
                        }else{
                            scheduleDeliveryNextButton.on("click",function(event){
                                glpro.glproModal.action.onModalNext();
                             })
                             scheduleDeliveryButtonsWrapper.append(scheduleDeliveryNextButton);
                        }
                        return scheduleDeliveryButtonsWrapper;

                    }    
                    
                },
                action:{
                    show: async function(){
                        glpro.glproModal.f.hideAllComponents();
                        glpro.$(".scheduleDeliveryBody").show();
                        glpro.glproModal.state.currentNavigationId = "scheduleDelivery";
                        glpro.glproModal.f.updateNavigation();
                    },
                    hide: function(){
                        glpro.$(".scheduleDeliveryBody").hide();
                    }
                },
            }
        }

        window.glpro = glpro;
        /*
        * start the program 
        */
        glproUtils.f.loadJquery(function (jqueryRefObj) {
            glpro.$ = jqueryRefObj;
    
            glpro.$(document).ready(function () {
                console.log("document-ready-glpro", glpro.$);
                glpro.f.initialize(glpro.$);
            })
        })

    
