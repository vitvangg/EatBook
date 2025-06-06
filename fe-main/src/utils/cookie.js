// File: src/utils/cookie.js

/**
 * Lấy giá trị cookie theo key.
 * @param {string} name - Tên cookie cần lấy.
 * @returns {string|null} - Giá trị cookie hoặc null nếu không tồn tại.
 */
export function getCookie(name) {
  const value = `; ${document.cookie}`;        
  const parts = value.split(`; ${name}=`);   
  if (parts.length === 2) {
    return parts
      .pop()
      .split(';')
      .shift() || null;
  }
  return null;
}

/**
 * Gán cookie với tên, giá trị, thời gian sống và tùy chọn path.
 * @param {string} name - Tên cookie.
 * @param {string} value - Giá trị cookie.
 * @param {number} maxAgeSeconds - Thời gian tồn tại (đơn vị: giây).
 */
export function setCookie(name, value, maxAgeSeconds) {
  // Ví dụ: "ad_popup_closed=true; max-age=604800; path=/"
  document.cookie = `${name}=${value}; max-age=${maxAgeSeconds}; path=/`;
}

/**
 * Xóa cookie bằng cách đặt max-age=0
 * @param {string} name - Tên cookie.
 */
export function eraseCookie(name) {
  document.cookie = `${name}=; max-age=0; path=/`;
}
