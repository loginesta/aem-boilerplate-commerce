# Product Recommendations Block

## Overview

The Product Recommendations block provides personalized product recommendations using the @dropins/storefront-recommendations ProductList container. It handles recommendation loading with intersection observer, context tracking, and dynamic reloading based on user behavior and page changes.

## Integration

### Block Configuration

| Configuration Key | Type | Default | Description | Required | Side Effects |
|-------------------|------|---------|-------------|----------|--------------|
| `recid` | string | — | Recommendation unit ID to render. | **Yes** | Identifies which recommendation unit to fetch |
| `currentsku` | string | undefined | Current product SKU. Only set this on pages where ACDL `productContext` is not populated. For cross-sell and upsell recommendation types (`viewed-viewed`, `viewed-bought`, `bought-bought`, `more-like-this`, `visual`) this value (from config or ACDL) is required for the unit to return results. | No | Takes precedence over ACDL-derived SKU; if set without `currentprice`, no price is passed to the service |
| `currentprice` | number | undefined | Current product price as an anchor for dynamic/relative price filter operators. **May only be set together with `currentsku`.** Only needed for SKU-related recommendation types with dynamic or relative price filters when ACDL product context is unavailable. The value should match the effective price shown to the shopper (`specialPrice ?? regularPrice`). | No | Takes precedence over ACDL-derived price; has no effect if `currentsku` is not also set |

<!-- ### URL Parameters

No URL parameters directly affect this block's behavior. -->

### Local Storage

- `{storeViewCode|catalogViewId}:productViewHistory` - Stores user's product view history for recommendation context
- `{storeViewCode|catalogViewId}:purchaseHistory` - Stores user's purchase history for recommendation context

History recording in `scripts/commerce.js` starts only after the same one-shot
`consent.update` acceptance used to load analytics (`consent=accept`), even when
analytics config is absent. Declined documents do not register history listeners
or delete existing histories. Product views are deduplicated by SKU and retain
the most recent 20 entries; purchase history retains the most recent 20 orders.
Both use ISO dates and native data-layer past/future hydration after acceptance,
excluding prerender-only activity. Recommendation requests and reads of existing
stored history remain independent: the block validates histories and passes them
to `ProductList` as `userViewHistory` and `userPurchaseHistory`, which the API
transmits as GraphQL inputs. They are not strictly local data, and no CMP/topic/
revocation policy is supplied by this block.

### Events

#### Event Listeners

- Adobe Data Layer (`adobeDataLayer:change`) for `pageContext`, `productContext`, `categoryContext`, and `shoppingCartContext` — triggers recommendation reload on significant changes
- `productContext` changes also extract `pricing` (SKU + `specialPrice ?? regularPrice`) and pass it to the dropin as the `currentProduct` prop

#### Event Emitters

- `publishRecsItemAddToCartClick()` — emits recommendation analytics events when items are added to cart

## Behavior Patterns

### Page Context Detection

- **Mobile Devices**: Uses intersection observer to load recommendations when section becomes visible
- **Desktop Devices**: Loads recommendations immediately on page load
- **Context Changes**: Reloads recommendations when significant context changes occur (product, category, page type)
- **Cart Changes**: Updates recommendation context when cart contents change

### User Interaction Flows

1. **Initialization**: Block sets up recommendation context and loads initial recommendations
2. **Lazy Loading**: On mobile, recommendations load when section becomes visible
3. **Context Tracking**: Monitors page, product, category, and cart changes to update recommendations
4. **Product Actions**: Users can add products to cart or navigate to product details
5. **Wishlist Integration**: Users can add/remove products from wishlist
6. **Dynamic Reloading**: Recommendations reload when significant context changes occur

### Error Handling

- **Context Errors**: If context data is invalid, falls back to empty arrays for view/purchase history
- **API Errors**: If recommendation API fails, the ProductList container handles error display
- **Configuration Errors**: If `readBlockConfig()` fails, uses undefined values for configuration
- **Missing SKU**: If the recommendation type requires a current SKU but none is available (neither from block config nor from ACDL), an error is logged to the browser console
- **Image Rendering Errors**: If product images fail to load, the image slots handle fallback behavior
- **Fallback Behavior**: Always falls back to appropriate default values for missing or invalid configuration
