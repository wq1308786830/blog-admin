import { toast } from 'sonner'

type ToastType = 'success' | 'error' | 'info' | 'warning'

export function showToast(message: string, type: ToastType = 'info') {
  switch (type) {
    case 'success':
      toast.success(message)
      break
    case 'error':
      toast.error(message)
      break
    case 'warning':
      toast.warning(message)
      break
    default:
      toast.info(message)
  }
}

export function showSuccess(message: string) {
  toast.success(message)
}

export function showError(message: string) {
  toast.error(message)
}

export function showInfo(message: string) {
  toast.info(message)
}

export function showWarning(message: string) {
  toast.warning(message)
}
