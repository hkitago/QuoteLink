// Pattern-based removal (Prefixes/Patterns)
const removeParamPatterns = [
  /^utm/i,
  /^ga_/i,
  /^gad_/i,
  /^gcl_/i,
  /^ep[._]/i,
  /^fb_/i,
  /^twclid/i,
  /^twitter_/i,
  /^li_/i,
  /^rdt_/i,
  /^pf_rd_/i,
  /^pd_rd_/i,
  /^shop(ify)?_/i,
  /^cart_/i,
  /^checkout_/i,
  /^ref/i,        // Covers ref, ref_, refRID
  /^hs_/i,
  /^hsa_/i,
  /^mc_/i,
  /^kl_/i,
  /^pi_/i,
  /^mkt_/i,
  /^bd_/i,
  /^hm/i,
  /^naver_/i,
  /^yj_/i,
  /^tc_/i,
  /^ys_/i,
  /^ms_/i,
  /^mp_/i,
  /^amp_/i,
  /^sp_/i,
  /^hp_/i,
  /^gtm_/i,
  /^consent_/i,
  /^gdpr_/i,
  /^ccpa_/i,
  /^cookie_/i,
  /^cpt_/i,
  /^aff_/i,
  /^mv/i,
  /^trc_/i,       // Taboola
  /^s_/i,         // Adobe/Marketing (s_kwcid, etc.)
  /^nft_/i,
  /^dapp_/i,
  /^beacon_/i,
  /^ltm_/i,
  /^social_/i,    // social_id, social_source, etc.
  /^share_/i,     // share_token, share_ref
  /^offer_/i,      // offer_id, offer_code
];

// Exact match removal (Specific keys)
const removeExactParams = [
  '_gl', '_gac', '_gid', 'gclid', 'gclsrc', 'dclid', 'wbraid', 'gbraid',
  'fbclid', 'tweetid', 'reddit_ad_id', 'reddit_campaign_id', 'tag',
  'linkCode', 'linkId', 'creativeASIN', 'ascsubtag', '_encoding',
  'qid', 'sr', 'keywords', 'sprefix', 'crid', 'dchild', 'dib', 'dib_tag',
  '_hsenc', '_hsmi', 'mkt_tok', 'yjr', 'yjad', 'yjcmp', 'adtag', 'yclid',
  '_openstat', 'msclkid', 'mixpanel_id', 'amplitude_id', 'snowplow_id',
  'heap_id', 'tracking_consent', 'cid', 'rid', 'adid', 'argument',
  'free4', 'dmai', 'sub_rt', 'spid', 'prid', 'aspid', 'mid', 'scadid',
  'source', 'dv', 'date', 'ctg', 'fr', 'sk', 'afSmartRedirect',
  'gatewayAdapt', 'sdid', 'social_share', 'referrer', 'ie',
  'ecid', 'smid', 'content-id', 'camp', 'creative', // Added back from original
  'promo', 'discount', 'coupon' // Added back from original
];

export const getCleanUrl = (url, isCleanUrl) => {
  if (!isCleanUrl) return url;
  try {
    const urlObj = new URL(url);
    const params = urlObj.searchParams;
    const allKeys = Array.from(params.keys());
    
    for (const key of allKeys) {
      if (removeExactParams.includes(key) ||
          removeParamPatterns.some(pattern => pattern.test(key))) {
        params.delete(key);
      }
    }
    
    return urlObj.toString();
  } catch (error) {
    console.error('[QuoteLinkExtension] Invalid URL:', error);
    return url;
  }
};
