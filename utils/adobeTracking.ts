/**
 * 带有超时机制的等待 _satellite 就绪函数
 */
function waitForSatellite(callback: () => void, maxRetries = 20, interval = 250): void {
  let retries = 0;
  const check = () => {
    // @ts-ignore
    if (window._satellite && typeof window._satellite.track === 'function') {
      callback();
    } else if (retries < maxRetries) {
      retries++;
      setTimeout(check, interval);
    } else {
      console.warn('[Adobe Tracking] _satellite 加载超时');
    }
  };
  check();
}

/**
 * 更新数据并触发 Page View 埋点
 */
export function trackPageView(pageName: string = 'AI Translator', lang: string = 'zh-CN') {
  waitForSatellite(() => {
    // 1. 更新当前页面的数据层 (覆盖之前的值)
    // @ts-ignore
    window.digitalData = {
      global: {
        page: {
          language: lang,
          brandCode: "HI",
          primaryCategory: "AI Translator",
          pageType: pageName,
          siteName: "HiltonChina",
          version: "index"
        }
      }
    };
    // 2. 触发通用 Direct Call Rule (DCR) 事件
    // @ts-ignore
    window._satellite!.track('brand_page');
  });
}
