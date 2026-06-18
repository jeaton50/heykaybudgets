(function () {
  var consentKey = 'hkb_ck';
  var analyticsId = 'G-SF7EQT5LF7';
  var adsClient = 'ca-pub-9306267160220923';
  var loadedScripts = {};

  function getConsent() {
    try {
      return window.localStorage.getItem(consentKey);
    } catch (err) {
      return null;
    }
  }

  function setConsent(value) {
    try {
      window.localStorage.setItem(consentKey, value);
    } catch (err) {}
  }

  function hideBanner() {
    var banner = document.getElementById('ck-banner');
    if (banner) banner.style.display = 'none';
  }

  function loadScript(src, attrs) {
    if (loadedScripts[src]) return loadedScripts[src];
    loadedScripts[src] = new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = src;
      script.async = true;
      if (attrs) {
        Object.keys(attrs).forEach(function (key) {
          script[key] = attrs[key];
        });
      }
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
    return loadedScripts[src];
  }

  function loadMarketingScripts() {
    if (window.hkbMarketingLoaded) return;
    window.hkbMarketingLoaded = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', analyticsId);

    loadScript('https://www.googletagmanager.com/gtag/js?id=' + analyticsId);
    loadScript('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + adsClient, {
      crossOrigin: 'anonymous'
    });
  }

  window.hkbCk = function (value) {
    setConsent(value);
    hideBanner();
    if (value === 'yes') loadMarketingScripts();
  };

  function initConsent() {
    var consent = getConsent();
    if (consent) hideBanner();
    if (consent === 'yes') loadMarketingScripts();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initConsent);
  } else {
    initConsent();
  }
})();
