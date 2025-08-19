import {
  Table,
  Tag,
  Space,
  Typography,
  Dropdown,
  Button,
  message,
  Tooltip,
} from 'antd';
import { EyeOutlined, DownOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { IOrder } from '@/types/order';
import {
  getStatusTagColor,
  ORDER_STATUS,
  ORDER_STATUS_FLOW,
} from './ordersContant';
import { useNavigate } from 'react-router';

const { Text } = Typography;

const fetchOrders = async (): Promise<IOrder[]> => {
  const token = localStorage.getItem('token');
  const res = await axios.get('http://localhost:8888/api/orders/', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const OrderList = () => {
  const nav = useNavigate();

  const { data, isLoading, error, refetch } = useQuery<IOrder[]>({
    queryKey: ['orders'],
    queryFn: fetchOrders,
  });

  const getStatusLabel = (statusKey: string) => {
    const status = ORDER_STATUS.find((s) => s.key === statusKey);
    return status ? status.label : statusKey;
  };

  const handleChangeStatus = async (
    record: IOrder,
    statusKey: string,
    label: string
  ) => {
    const reason =
      statusKey === 'cancelled'
        ? 'Huỷ bởi admin'
        : statusKey === 'refunded'
        ? 'Hoàn tiền bởi admin'
        : undefined;

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:8888/api/orders/${record._id}/`,
        { status: statusKey, reason },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      message.success(`Đã cập nhật trạng thái: ${label}`);
      refetch();
    } catch (err) {
      message.error('Cập nhật trạng thái thất bại');
    }
  };

  const columns = [
    {
      title: 'Người đặt',
      dataIndex: ['user_id', 'fullname'],
      key: 'user',
      render: (_: any, record: IOrder) => (
        <div>
          {typeof record.user_id === 'object' ? (
            <>
              <Text strong>{record.user_id.fullname}</Text>
              <br />
              <Text type="secondary">{record.user_id.email}</Text>
            </>
          ) : (
            <Text type="secondary">Không có thông tin người dùng</Text>
          )}
        </div>
      ),
    },
    
    {
      title: 'Mã đơn hàng',
      dataIndex: '_id',
      key: 'orderId',
    },
    {
  title: 'Địa chỉ',
  dataIndex: 'address',
  key: 'address',
  render: (address: IOrder['address']) => {
    if (!address) return <Text type="secondary">Chưa có địa chỉ</Text>;
    const { detail, district, city } = address;
    return [detail, district, city].filter(Boolean).join(', ');
  },
},

    {
      title: 'Phí ship',
      dataIndex: 'shippingFee',
      key: 'shippingFee',
      render: (value: number) => value.toLocaleString('vi-VN'),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (value: number) => value.toLocaleString('vi-VN'),
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value: string) => new Date(value).toLocaleString('vi-VN'),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_: any, record: IOrder) => (
        <Space direction="vertical">
          <Tag color={getStatusTagColor(record.status)}>
            {getStatusLabel(record.status)}
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: IOrder) => {
        const currentIndex = ORDER_STATUS_FLOW.indexOf(record.status);
        const menuItems = ORDER_STATUS.filter((status) => {
          const newIndex = ORDER_STATUS_FLOW.indexOf(status.key);
          const isCancelled = status.key === 'cancelled';
          const isRefunded = status.key === 'refunded';
          const canCancel = ['pending', 'confirmed'].includes(
            record.status
          );

          if (isCancelled && !canCancel) return false;
          if (record.status === 'refunded' && isCancelled) return false;
          if (isRefunded && !['delivered'].includes(record.status)) return false;

          return newIndex > currentIndex || (isCancelled && canCancel);
        }).map((status) => ({
          key: status.key,
          label: status.label,
          onClick: () => handleChangeStatus(record, status.key, status.label),
        }));

        return (
          <Space size="middle">
            <Tooltip title="Xem chi tiết">
              <Button
                icon={<EyeOutlined />}
                onClick={() => nav(`/orders/${record._id}`)}
              />
            </Tooltip>
            <Dropdown menu={{ items: menuItems }} trigger={['click']}>
              <Tooltip title="Thay đổi trạng thái">
                <Button icon={<DownOutlined />} />
              </Tooltip>
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  if (isLoading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>Lỗi khi tải đơn hàng</p>;

  return (
    <Table
      rowKey="_id"
      dataSource={data}
      columns={columns}
      pagination={{ pageSize: 3 }}
    />
  );
};

export default OrderList;