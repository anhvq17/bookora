import { useParams, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import {
  Descriptions,
  Divider,
  Table,
  Typography,
  Image,
  Spin,
  Button,
  Tag,
} from 'antd';
import instance from '@/config/axios.customize';
import { IOrder, IOrderItem } from '@/types/order';
import {
  getPaymentMethodLabel,
  getPaymentStatusLabel,
  getShippingMethodLabel,
  getStatusTagColor,
  ORDER_STATUS,
} from './ordersContant';

const { Title } = Typography;

const formatCurrency = (value?: number) =>
  typeof value === 'number' ? `${value.toLocaleString()} ₫` : 'N/A';

const formatFullAddress = (
  address?: IOrder['address'],
  note?: string
): string => {
  if (!address || typeof address !== 'object') return 'Không có địa chỉ';

  const detail = (address as any)?.detail ?? '';
  const district = (address as any)?.district ?? '';
  const city = (address as any)?.city ?? '';

  const full = [detail, district, city].filter(Boolean).join(', ');
  
  return full ? (note ? `${full} (${note})` : full) : 'Không có địa chỉ';
};



const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const { data: order, isLoading } = useQuery<IOrder>({
    queryKey: ['order-detail', orderId],
    queryFn: async () => {
      const res = await instance.get(`/api/orders/${orderId}`);
      return res.data;
    },
    enabled: !!orderId,
  });
  if (isLoading) return <Spin size="large" />;
if (!order) return <div>Không tìm thấy đơn hàng</div>;

console.log('Địa chỉ trả về từ API:', order.address);

  const columns = [
    {
      title: 'Tên sản phẩm',
      key: 'name',
      render: (_: any, record: IOrderItem) =>
        record?.product_id?.name || 'Không có tên sản phẩm',
    },
    {
      title: 'Ảnh',
      key: 'image',
      render: (_: any, record: IOrderItem) => (
        <Image
          src={record?.product_id?.image || '/placeholder.svg'}
          width={60}
          height={60}
          alt="product"
          crossOrigin="anonymous"
        />
      ),
    },
    {
      title: 'Phiên bản',
      key: 'format',
      render: (_: any, record: IOrderItem) =>
        record?.variant_id?.format || '—',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (value: number) => formatCurrency(value),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Thành tiền',
      key: 'total',
      render: (_: any, record: IOrderItem) =>
        formatCurrency(record.price * record.quantity),
    },
  ];

  const user = typeof order.user_id === 'string' ? null : order.user_id;
  const discount =
    typeof order.discount_id === 'object' && order.discount_id
      ? `${order.discount_id.code} - ${order.discount_id.value}${
          order.discount_id.type === 'percent' ? '%' : ' ₫'
        }`
      : 'Không áp dụng';

  return (
    <div>
      <Button type="primary" onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
        Quay lại
      </Button>

      <Title level={3}>Chi tiết đơn hàng</Title>
      <Descriptions bordered column={2} size="middle">
        <Descriptions.Item label="Mã đơn hàng">{order._id}</Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">
          {new Date(order.createdAt).toLocaleString()}
        </Descriptions.Item>
        <Descriptions.Item label="Tên người dùng">{user?.fullname || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Email">{user?.email || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Địa chỉ giao hàng" span={2}>
  {formatFullAddress(order.address, order.addressNote)}
</Descriptions.Item>
        <Descriptions.Item label="Trạng thái đơn">
          <Tag color={getStatusTagColor(order.status)}>
            {ORDER_STATUS.find((s) => s.key === order.status)?.label || order.status}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Hình thức vận chuyển">
          {getShippingMethodLabel(order.shippingMethod)}
        </Descriptions.Item>
        <Descriptions.Item label="Lý do hủy / hoàn tiền">
          {order.statusReason?.trim() ? order.statusReason : 'Không có'}
        </Descriptions.Item>
        <Descriptions.Item label="Hình thức thanh toán">
          {getPaymentMethodLabel(order.paymentMethod)}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái thanh toán">
          {getPaymentStatusLabel(order.paymentStatus)}
        </Descriptions.Item>
        <Descriptions.Item label="Ghi chú" span={2}>
          {order.note || 'Không có'}
        </Descriptions.Item>
        <Descriptions.Item label="Mã giảm giá">{discount}</Descriptions.Item>
        <Descriptions.Item label="Tổng tiền">{formatCurrency(order.totalAmount)}</Descriptions.Item>
        <Descriptions.Item label="Phí vận chuyển">{formatCurrency(order.shippingFee)}</Descriptions.Item>
      </Descriptions>

      <Divider />
      <Title level={4}>Sản phẩm trong đơn hàng</Title>
      <Table
        dataSource={order.items}
        rowKey={(record) =>
          typeof record.product_id === 'object'
            ? record.product_id?._id || Math.random().toString()
            : String(record.product_id || Math.random())
        }
        columns={columns}
        pagination={false}
      />
    </div>
  );
};

export default OrderDetailPage;