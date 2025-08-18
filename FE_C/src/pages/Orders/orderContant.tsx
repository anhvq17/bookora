import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CarOutlined,
  CloseCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons"

export const ORDER_STATUS = [
  { key: "pending", label: "Chờ xác nhận", color: "orange", icon: <ClockCircleOutlined /> },
  { key: "confirmed", label: "Đã xác nhận", color: "cyan", icon: <SyncOutlined spin /> },
  { key: "shipped", label: "Đã gửi hàng", color: "blue", icon: <CarOutlined /> },
  { key: "delivered", label: "Đã giao hàng", color: "purple", icon: <CheckCircleOutlined /> },
  { key: "completed", label: "Đã hoàn thành", color: "green", icon: <CheckCircleOutlined /> },
  { key: "cancelled", label: "Đã hủy", color: "red", icon: <CloseCircleOutlined /> },
  { key: "refunded", label: "Đã hoàn tiền", color: "orange", icon: <SyncOutlined spin /> },
]

export const getOrderStatusMap = () => {
  const map: Record<string, { label: string; color: string; icon: React.ReactNode }> = {}
  for (const status of ORDER_STATUS) {
    map[status.key] = {
      label: status.label,
      color: status.color,
      icon: status.icon,
    }
  }
  return map
}
export const getShippingMethodLabel = (method: string) => {
  switch (method) {
    case 'standard':
    case 'Giao hàng tiêu chuẩn':
      return 'Giao hàng tiêu chuẩn'
    case 'express':
    case 'Giao hàng nhanh':
      return 'Giao hàng nhanh'
    default:
      return method
  }
}

export const getPaymentMethodLabel = (method: string) => {
  switch (method) {
    case 'cash':
    case 'Thanh toán khi nhận hàng':
      return 'Thanh toán khi nhận hàng'
    case 'momo':
    case 'Thanh toán MoMo':
      return 'Thanh toán MoMo'
    case 'vnpay':
    case 'Thanh toán VNPAY':
      return 'Thanh toán VNPAY'
    default:
      return method
  }
}

export const getPaymentStatusLabel = (status: string) => {
  switch (status) {
    case 'unpaid':
    case 'Chưa thanh toán':
      return 'Chưa thanh toán'
    case 'pending':
    case 'Chờ thanh toán':
      return 'Chờ thanh toán'
    case 'paid':
    case 'Đã thanh toán':
      return 'Đã thanh toán'
    default:
      return status
  }
}
export const CANCEL_REASONS = [
  'Đặt nhầm sản phẩm',
  'Muốn thay đổi địa chỉ giao hàng',
  'Không còn nhu cầu',
  'Tìm thấy giá rẻ hơn',
  'Khác'
]

export const REFUND_REASONS = [
  'Sản phẩm bị hỏng',
  'Không đúng mô tả',
  'Giao sai sản phẩm',
  'Thay đổi ý định sau khi nhận',
  'Khác'
]