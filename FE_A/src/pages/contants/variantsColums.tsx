import { IVariant } from "@/types/variants";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Popconfirm } from "antd";
import Space from "antd/es/space";
import { Link } from "react-router";

export const getVariantsColums = (queryClient: any, Del: (id:string) => void)=>[
    {
      title: 'Sản phẩm',
      dataIndex: ['productId', 'name'],
      key: 'productId',
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
    },
    {
      title: 'Định dạng',
      dataIndex: 'format',
      key: 'format',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (value: number) => value.toLocaleString('vi-VN') + '₫'
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stock_quantity',
      key: 'stock_quantity',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: IVariant) => (
        <Space>
           <Link to={`/variants/${record._id}/edit`}>
        <Button icon={<EditOutlined />} size="small" />
      </Link>
          <Popconfirm
            title="Bạn có chắc muốn xoá không?"
            onConfirm={() => Del(record._id)}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <Button icon={<DeleteOutlined />} danger size="small" />
          </Popconfirm>
        </Space>
      ),
    }
  ];