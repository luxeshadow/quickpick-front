import { AppColors } from '../constants/app_colors';
export const useToast = () => {
  const showToast = (
    text: string,
    icon: string = 'fi-rr-info',
    type: 'success' | 'error' | 'normal' = 'normal',
    color: string = AppColors.toastText
  ) => {
    if (!import.meta.client) return;

    const safeText = text.replace(/[&<>"']/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[character]!);
    const lib = (window as any).Toastify;

    if (lib) {
      lib({
        text: `
          <div style="display: flex; align-items: center; gap: 12px;">
            <i class="fi ${icon}" style="font-size: 20px; color: ${type === 'error' ? AppColors.toastError : type === 'success' ? AppColors.toastSuccess : color}; flex-shrink: 0;"></i>
            <span style="font-weight: 500; font-family: 'Inter', sans-serif; font-size: 14px;">${safeText}</span>
          </div>
        `,
        duration: 3500,
        gravity: "top",
        position: "center",
        stopOnFocus: true,
        escapeMarkup: false,
        style: {
          background: AppColors.surface,
          color: AppColors.toastText,
          borderRadius: "12px",
          border: '1px solid ' + AppColors.toastBorder,
          padding: "10px 16px",
          maxWidth: "calc(100% - 30px)",
          width: "fit-content",
          display: "inline-block",
          boxShadow: "none"
        }
      }).showToast();
    } else {
      setTimeout(() => showToast(text, icon, type, color), 300);
    }
  }

  return { showToast }
}