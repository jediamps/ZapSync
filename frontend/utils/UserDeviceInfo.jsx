export const getDeviceInfo = () => {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const browser = getBrowserName();
    const deviceType = getDeviceType();
    
    return {
      userAgent,
      platform,
      screenWidth,
      screenHeight,
      browser,
      deviceType
    };
  };
  
  // Detect browser
  const getBrowserName = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes("chrome")) return "Chrome";
    if (userAgent.includes("firefox")) return "Firefox";
    if (userAgent.includes("safari") && !userAgent.includes("chrome")) return "Safari";
    if (userAgent.includes("edge")) return "Edge";
    if (userAgent.includes("opera") || userAgent.includes("opr")) return "Opera";
    return "Unknown";
  };
  
  // Detect device type
  const getDeviceType = () => {
    const width = window.screen.width;
    if (width < 768) return "Mobile";
    if (width < 1024) return "Tablet";
    return "Desktop";
  };
  