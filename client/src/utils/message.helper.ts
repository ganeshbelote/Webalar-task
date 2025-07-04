import { toast } from 'react-toastify'

export const successMsg = (msg: string) => {
  toast.success(msg)
}

export const failureMsg = (msg: string) => {
  toast.error(msg)
}
