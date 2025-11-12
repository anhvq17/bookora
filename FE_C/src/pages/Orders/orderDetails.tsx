import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Card, Row, Col, Typography, Divider, Tag, Button, Image,
  Space, Descriptions, Alert, Spin, message, Modal, Select, Input
} from 'antd'
import {
  ArrowLeftOutlined, ExclamationCircleOutlined,
  CopyOutlined, PhoneOutlined
} from '@ant-design/icons'
import api from '../../configs/axios.customize'
import type { IOrder } from '../../types/order'
import {
  getPaymentMethodLabel,
  getShippingMethodLabel,
  getOrderStatusMap,
  CANCEL_REASONS,
  REFUND_REASONS
} from './orderContant'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input

const OrderDetailPage = () => {
  const { id: orderId } = useParams()
  const navigate = useNavigate()
  const statusMap = getOrderStatusMap()
  const queryClient = useQueryClient()

  const { data: order, isLoading } = useQuery<IOrder>({
    queryKey: ['order-detail', orderId],
    queryFn: async () => {
      const token = localStorage.getItem('accessToken')
      const res = await api.get(`/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      return res.data || null
    },
    enabled: !!orderId
  })
  const confirmReceived = useMutation({
  mutationFn: async () => {
    const token = localStorage.getItem('accessToken')
    const res = await api.put(`/api/orders/${orderId}/`, { status: 'completed' }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  },
  onSuccess: () => {
    message.success('Đã xác nhận đã nhận hàng')
    queryClient.invalidateQueries({ queryKey: ['order-detail', orderId] })
    queryClient.invalidateQueries({ queryKey: ['orders'] })
  },
  onError: () => {
    message.error('Xác nhận thất bại')
  }
})


  const updateStatus = useMutation({
    mutationFn: async ({ status, reason }: { status: 'cancelled' | 'refunded'; reason: string }) => {
      const token = localStorage.getItem('accessToken')
      const res = await api.put(`/api/orders/${orderId}/`, { status, reason }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return res.data
    },
    onSuccess: () => {
      message.success('Cập nhật trạng thái đơn hàng thành công')
      queryClient.invalidateQueries({ queryKey: ['order-detail', orderId] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
    onError: () => {
      message.error('Cập nhật trạng thái thất bại')
    }
  })

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    })

  const formatFullAddress = (address?: IOrder['address']) => {
  if (!address) return 'Không có địa chỉ';
  const { detail, district, city } = address;
  return [detail, district, city].filter(Boolean).join(', ');
}


  const showReasonModal = (action: 'cancelled' | 'refunded') => {
    let selectedReason = ''
    let customReason = ''

    const reasons = action === 'cancelled' ? CANCEL_REASONS : REFUND_REASONS

    const modal = Modal.confirm({
      title: action === 'cancelled' ? 'Xác nhận hủy đơn hàng' : 'Yêu cầu hoàn tiền',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <Text strong>Chọn lý do:</Text>
          <Select
            style={{ width: '100%', marginTop: 8 }}
            onChange={(value) => {
              selectedReason = value
              modal.update({
                content: modalContent()
              })
            }}
            options={reasons.map((r) => ({ label: r, value: r }))}
          />
          <div style={{ marginTop: 12 }}>
            {selectedReason === 'Khác' && (
              <TextArea
                rows={3}
                placeholder='Nhập lý do cụ thể...'
                onChange={(e) => { customReason = e.target.value }}
              />
            )}
          </div>
        </div>
      ),
      okText: action === 'cancelled' ? 'Xác nhận hủy' : 'Gửi yêu cầu',
      cancelText: 'Hủy bỏ',
      async onOk() {
        const reason = selectedReason === 'Khác' ? customReason.trim() : selectedReason

        if (!reason || (selectedReason === 'Khác' && reason.length < 10)) {
          message.error(selectedReason === 'Khác'
            ? 'Lý do cụ thể phải có ít nhất 10 ký tự'
            : 'Vui lòng chọn lý do')
          throw new Error('Invalid reason')
        }

        updateStatus.mutate({ status: action, reason })
      }
    })

    const modalContent = () => (
      <div>
        <Text strong>Chọn lý do:</Text>
        <Select
          defaultValue={selectedReason}
          style={{ width: '100%', marginTop: 8 }}
          onChange={(value) => {
            selectedReason = value
            modal.update({
              content: modalContent()
            })
          }}
          options={reasons.map((r) => ({ label: r, value: r }))}
        />
        <div style={{ marginTop: 12 }}>
          {selectedReason === 'Khác' && (
            <TextArea
              rows={3}
              placeholder='Nhập lý do cụ thể...'
              onChange={(e) => { customReason = e.target.value }}
            />
          )}
        </div>
      </div>
    )
  }

  const copyOrderId = () => {
    navigator.clipboard.writeText(order?._id || '')
    message.success('Đã sao chép mã đơn hàng')
  }

  if (isLoading) return (
    <div style={{ textAlign: 'center', padding: '100px 0' }}>
      <Spin size='large' />
      <div style={{ marginTop: 16 }}>
        <Text>Đang tải thông tin đơn hàng...</Text>
      </div>
    </div>
  )

  if (!order) return (
    <div style={{ textAlign: 'center', padding: '100px 0' }}>
      <Alert message='Không tìm thấy đơn hàng' type='error' showIcon />
    </div>
  )

  const statusInfo = statusMap[order.status] || {
    label: order.status,
    color: 'default',
    icon: <ExclamationCircleOutlined />
  }

  const discount = typeof order.discount_id === 'object' ? order.discount_id : null
  const user = typeof order.user_id === 'object' ? order.user_id : null
  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discountAmount = discount
    ? discount.type === 'percentage'
      ? (subtotal * discount.value) / 100
      : discount.value
    : 0

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
          Quay lại
        </Button>
        <Row justify='space-between' align='middle'>
          <Col>
            <Space align='center'>
              <Title level={2} style={{ margin: 0 }}>Chi tiết đơn hàng</Title>
              <Button icon={<CopyOutlined />} type='text' size='small' onClick={copyOrderId}>
                #{order._id}
              </Button>
            </Space>
          </Col>
          <Col>
            <Tag color={statusInfo.color} icon={statusInfo.icon}>
              {statusInfo.label}
            </Tag>
          </Col>
        </Row>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card title='Sản phẩm đã đặt' style={{ marginBottom: 24 }}>
            <Space direction='vertical' size='middle' style={{ width: '100%' }}>
              {order.items.map((item, idx) => (
                <div key={idx}>
                  <Row gutter={16} align='middle'>
                    <Col>
                      <Image
                        src={item.image || item.product_id?.imageUrl || '/placeholder.svg'}
                        alt={item.name || item.product_id?.name}
                        width={80}
                        height={80}
                        style={{ objectFit: 'cover', borderRadius: 8 }}
                      />
                    </Col>
                    <Col flex={1}>
                      <Title level={5} style={{ margin: 0 }}>
                        {item.name || item.product_id?.name}
                      </Title>
                      {item.variant_id && <Text type='secondary'>{item.variant_id.format}</Text>}
                      <Row justify='space-between' style={{ marginTop: 8 }}>
                        <Col><Text>Số lượng: {item.quantity}</Text></Col>
                        <Col><Text strong>{formatPrice(item.price)}</Text></Col>
                      </Row>
                    </Col>
                  </Row>
                  {idx < order.items.length - 1 && <Divider />}
                </div>
              ))}
            </Space>
          </Card>

          {order.note && (
            <Card title='Ghi chú đơn hàng'>
              <Paragraph>{order.note}</Paragraph>
            </Card>
          )}
        </Col>

        <Col xs={24} lg={8}>
          <Card title='Tóm tắt đơn hàng' style={{ marginBottom: 24 }}>
            <Descriptions column={1} size='small'>
              <Descriptions.Item label='Tạm tính'>{formatPrice(subtotal)}</Descriptions.Item>
              <Descriptions.Item label='Phí vận chuyển'>{formatPrice(order.shippingFee)}</Descriptions.Item>
              {discount && (
                <Descriptions.Item label={`Giảm giá (${discount.code})`}>
                  <Text type='success'>-{formatPrice(discountAmount)}</Text>
                </Descriptions.Item>
              )}
              <Divider style={{ margin: '12px 0' }} />
              <Descriptions.Item label={<Text strong>Tổng cộng</Text>}>
                <Text strong style={{ fontSize: 16, color: '#ff4d4f' }}>{formatPrice(order.totalAmount)}</Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title='Thông tin đơn hàng' style={{ marginBottom: 24 }}>
            <Descriptions column={1} size='small'>
              <Descriptions.Item label='Khách hàng'>{user?.fullname || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label='Email'>{user?.email || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label='Phone'>{user?.phoneNumber || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label='Ngày đặt'>{formatDate(order.createdAt)}</Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title='Thông tin giao hàng' style={{ marginBottom: 24 }}>
            <Space direction='vertical' size='small' style={{ width: '100%' }}>
              <Text strong>Địa chỉ giao hàng</Text>
              <Text>{order.address ? formatFullAddress(order.address) : 'Không có địa chỉ'}</Text>
              {order.addressNote && <Alert message={order.addressNote} type='info' showIcon={false} />}
              <Divider style={{ margin: '12px 0' }} />
              <Text>{getShippingMethodLabel(order.shippingMethod)}</Text>
              <Text>{getPaymentMethodLabel(order.paymentMethod)}</Text>
            </Space>
          </Card>

          <Card>
            <Space direction='vertical' size='middle' style={{ width: '100%' }}>
              {order.status === 'pending' && (
                <Button danger block onClick={() => showReasonModal('cancelled')}>
                  Yêu cầu hủy đơn hàng
                </Button>
              )}
              {order.status === 'delivered' && (
                <>
                  <Button type='primary' block onClick={() => confirmReceived.mutate()}>
                    Đã nhận hàng
                  </Button>
                  <Button danger block onClick={() => showReasonModal('refunded')}>
                    Yêu cầu hoàn tiền
                  </Button>
                </>
              )}
              <Button block icon={<PhoneOutlined />}>Liên hệ hỗ trợ</Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default OrderDetailPage