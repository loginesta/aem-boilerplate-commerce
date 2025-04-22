/*! Copyright 2025 Adobe
All Rights Reserved. */
import{f as p,h as I,c as T,W as f,d as w,s as a,g as S,e as P,t as W}from"./removeProductsFromWishlist.js";import{events as l}from"@dropins/tools/event-bus.js";const g=`
  query GET_PRODUCT_BY_SKU($sku: String!) {
    products(filter: { sku: { eq: $sku } }) {
        items {
          sku
          name
          thumbnail {
            label
            url
          }
          price_range {
            minimum_price {
              regular_price {
                currency
                value
              }
              final_price {
                currency
                value
              }
              discount {
                amount_off
                percent_off
              }
            }
          }
          stock_status
          ... on SimpleProduct {
            stock_status
            options {
              uid
            }
          }
          ... on ConfigurableProduct {
            configurable_options {
              uid
              attribute_uid
              attribute_code
              values {
                uid
              }
            }
            variants {
              product {
                sku
                stock_status
              }
            }
          }
          ... on BundleProduct {
            items {
              uid
              title
              options {
                uid
                label
                quantity
              }
            }
          }
        }
      }
    }
`,k=async e=>{if(!e)throw Error("Product SKU is not set");return p(g,{variables:{sku:e}}).then(({errors:o,data:i})=>{var s;return o?I(o):(s=i==null?void 0:i.products)!=null&&s.items?T(i.products.items[0]):null})},D=`
  mutation ADD_PRODUCTS_TO_WISHLIST_MUTATION(
      $wishlistId: ID!, 
      $wishlistItems: [WishlistItemInput!]!,
      ${f}
    ) {
    addProductsToWishlist(
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
  
${w}
`,b=async e=>{var m,h;if(!a.authenticated){const r=S();for(const n of e){const c=await k(n.sku);if(!((m=r.items)==null?void 0:m.some(t=>t.product.sku===n.sku))){let t={id:r.id,items:r.items};t.items=[...t.items,{product:c}],P(t),l.emit("wishlist/data",t),l.emit("wishlist/update",{action:"add",item:t.items[t.items.length-1]})}}return null}if(!a.wishlistId)throw Error("Wishlist ID is not set");const o={wishlistId:a.wishlistId,wishlistItems:e.map(({sku:r,parentSku:n,quantity:c,optionsUIDs:_,enteredOptions:t})=>({sku:r,parent_sku:n,quantity:c,selected_options:_,entered_options:t}))},{errors:i,data:s}=await p(D,{variables:o}),d=[...((h=s==null?void 0:s.addProductsToWishlist)==null?void 0:h.user_errors)??[],...i??[]];if(d.length>0)return I(d);const u=W(s.addProductsToWishlist.wishlist);return a.currentPage=1,l.emit("wishlist/data",u),l.emit("wishlist/update",{action:"add",item:u.items[u.items.length-1]}),u};export{b as a,k as g};
