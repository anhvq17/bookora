import { Breadcrumb } from 'antd'
import { useLocation } from 'react-router'

const breadcrumbNameMap: Record<string, { group: string, label: string }> = {
  '/': { group: 'Tổng quan', label: 'Dashboard' },
  '/analytics': { group: 'Tổng quan', label: 'Thống kê' },
  '/users': { group: 'Quản lý', label: 'Khách hàng' },
  '/products': { group: 'Quản lý', label: 'Sản phẩm' },
  '/variants': { group: 'Quản lý', label: 'Biến thể' },
  '/discounts': { group: 'Quản lý', label: 'Khuyến mại' },
  '/categories': { group: 'Quản lý', label: 'Danh mục' },
  '/orders': { group: 'Quản lý', label: 'Đơn hàng' },
  '/coupons': { group: 'Quản lý', label: 'Mã giảm giá' },
  '/reviews': { group: 'Quản lý', label: 'Đánh giá' },
}

const AppBreadcrumb = () => {
  const location = useLocation()
  const { pathname } = location

  const current = breadcrumbNameMap[pathname]

  const breadcrumbItems = current
    ? [
        { title: current.group },
        { title: current.label }
      ]
    : [{ title: 'Trang không xác định' }]

  return (
    <Breadcrumb style={{ margin: '16px 0' }} items={breadcrumbItems} />
  )
}

export default AppBreadcrumb
