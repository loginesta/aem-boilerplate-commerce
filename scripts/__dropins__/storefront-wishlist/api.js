/*! Copyright 2025 Adobe
All Rights Reserved. */
import{Initializer as I}from"@dropins/tools/lib.js";import{events as n}from"@dropins/tools/event-bus.js";import{s as i,e as m,f as a,h as _,W as w,d as u,g as d,t as h}from"./chunks/removeProductsFromWishlist.js";import{m as O,k as A,r as H,i as M,j as v,l as Q}from"./chunks/removeProductsFromWishlist.js";import{a as $,g as Y}from"./chunks/addProductsToWishlist.js";import{g as q}from"./chunks/getWishlistById.js";import"@dropins/tools/fetch-graphql.js";const f=new I({init:async s=>{const t={...s};f.config.setConfig({defaultConfig:t}),c().catch(console.error)},listeners:()=>[n.on("authenticated",s=>{i.authenticated&&!s&&n.emit("wishlist/reset",void 0),s&&!i.authenticated&&(i.authenticated=s,c().catch(console.error))},{eager:!0}),n.on("wishlist/data",s=>{m(s)}),n.on("wishlist/reset",()=>{y().catch(console.error),n.emit("wishlist/data",null)})]}),U=f.config;function g(s){if(!s)return null;const t=e=>{switch(e){case 1:return"INCLUDING_FPT_AND_DESCRIPTION";case 2:return"EXCLUDING_FPT_INCLUDING_DESCRIPTION_FINAL_PRICE";case 3:return"EXCLUDING_FPT";default:return"INCLUDING_FPT_ONLY"}};return{wishlistIsEnabled:s.storeConfig.magento_wishlist_general_is_enabled,wishlistMultipleListIsEnabled:s.storeConfig.enable_multiple_wishlists,wishlistMaxNumber:s.storeConfig.maximum_number_of_wishlists,fixedProductTaxesEnabled:s.storeConfig.fixed_product_taxes_enable,fixedProductTaxesApply:s.storeConfig.fixed_product_taxes_apply_tax_to_fpt,fixedProductTaxesEnabledDisplayInProductLists:t(s.storeConfig.fixed_product_taxes_display_prices_in_product_lists),fixedProductTaxesEnabledDisplayInSalesModules:t(s.storeConfig.fixed_product_taxes_display_prices_in_sales_modules),fixedProductTaxesEnabledDisplayInProductView:t(s.storeConfig.fixed_product_taxes_display_prices_on_product_view_page)}}const x=`
query STORE_CONFIG_QUERY {
  storeConfig {
    magento_wishlist_general_is_enabled
    enable_multiple_wishlists
    maximum_number_of_wishlists
    fixed_product_taxes_enable
    fixed_product_taxes_apply_tax_to_fpt
    fixed_product_taxes_display_prices_in_product_lists
    fixed_product_taxes_display_prices_in_sales_modules
    fixed_product_taxes_display_prices_on_product_view_page    
  }
}
`,T=async()=>a(x,{method:"GET",cache:"force-cache"}).then(({errors:s,data:t})=>s?_(s):g(t)),P=`
  query GET_WISHLISTS_QUERY(${w}) {
    customer {
      wishlists {
        ...WISHLIST_FRAGMENT
      }
    }
  }

  ${u}
`,S=async()=>i.authenticated?a(P).then(({errors:s,data:t})=>{var e;return s?_(s):(e=t==null?void 0:t.customer)!=null&&e.wishlists?t.customer.wishlists.map(r=>h(r)):null}):d(),E=`
  mutation UPDATE_PRODUCTS_IN_WISHLIST_MUTATION(
      $wishlistId: ID!, 
      $wishlistItems: [WishlistItemUpdateInput!]!,
    ) {
    updateProductsInWishlist(
      wishlistId: $wishlistId
      wishlistItems: $wishlistItems
    ) {
      wishlist {
        ...WISHLIST_FRAGMENT
      }
      user_errors {
        code
        message
      }
    }
  }
  
   ${u} 
`,b=async s=>{const t=i.wishlistId;if(!t)throw Error("Wishlist ID is not set");return a(E,{variables:{wishlistId:t,wishlistItems:s.map(({wishlistItemId:e,quantity:r,description:o,selectedOptions:l,enteredOptions:p})=>({wishlistItemId:e,quantity:r,description:o,selected_options:l,entered_options:p}))}}).then(({errors:e,data:r})=>{var l;const o=[...((l=r==null?void 0:r.updateProductsInWishlist)==null?void 0:l.user_errors)??[],...e??[]];return o.length>0?_(o):h(r.updateProductsInWishlist.wishlist)})},y=()=>(i.wishlistId=null,i.authenticated=!1,Promise.resolve(null)),c=async()=>{if(i.initializing)return null;i.initializing=!0,i.config||(i.config=await T());const s=i.authenticated?await C():await N();return n.emit("wishlist/initialized",s),n.emit("wishlist/data",s),i.initializing=!1,s};async function C(){const s=await S(),t=s?s[0]:null;return t?(i.wishlistId=t.id,t):null}async function N(){try{return await d()}catch(s){throw console.error(s),s}}export{$ as addProductsToWishlist,U as config,a as fetchGraphQl,O as getConfig,C as getDefaultWishlist,N as getGuestWishlist,d as getPersistedWishlistData,Y as getProductBySku,T as getStoreConfig,q as getWishlistById,S as getWishlists,f as initialize,c as initializeWishlist,A as removeFetchGraphQlHeader,H as removeProductsFromWishlist,y as resetWishlist,M as setEndpoint,v as setFetchGraphQlHeader,Q as setFetchGraphQlHeaders,m as setPersistedWishlistData,b as updateProductsInWishlist};
