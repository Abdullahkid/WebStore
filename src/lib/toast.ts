// Simple toast utility
export const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  // For now, just use console.log - in production, you'd use a proper toast library
  console.log(`[${type.toUpperCase()}] ${message}`);
  
  // For simple feedback, create a temporary toast element
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 10000;
    transition: all 0.3s ease;
    ${type === 'success' ? 'background-color: #10b981;' : ''}
    ${type === 'error' ? 'background-color: #ef4444;' : ''}
    ${type === 'info' ? 'background-color: #3b82f6;' : ''}
  `;
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  // Remove after 3 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (toast.parentNode) {
        document.body.removeChild(toast);
      }
    }, 300);
  }, 3000);
};