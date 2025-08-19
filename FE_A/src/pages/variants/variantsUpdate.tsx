import api from '@/config/axios.customize'
import { IVariant } from '@/types/variants';
import { useQuery } from '@tanstack/react-query';
import { Button, Form, Input, InputNumber, message, Select, Row, Col } from 'antd';
import { useNavigate, useParams } from 'react-router';
import { useEffect } from 'react';

const UpdateVariant = () => {
  const nav = useNavigate();
  const [form] = Form.useForm();
  const { id } = useParams();

  // Lấy chi tiết biến thể
  const { data: variant, isLoading: isVariantLoading } = useQuery({
    queryKey: ['variant', id],
    queryFn: async () => {
      const res = await api.get(`/api/variants/${id}`);
      return res.data.data;
    },
    enabled: !!id
  });

  // Lấy danh sách sản phẩm
  const { data: products, isLoading: isProductsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await api.get('/api/products');
      return res.data.data;
    }
  });

  // Tạo options cho dropdown sản phẩm
  const productOptions = Array.isArray(products)
    ? products.map((product) => ({
        label: product.name,
        value: product._id,
      }))
    : [];

  // Gán dữ liệu cũ vào form
  useEffect(() => {
    if (variant) {
      form.setFieldsValue({
        productId: variant.productId?._id || variant.productId,
        sku: variant.sku,
        format: variant.format,
        price: variant.price,
        stock_quantity: variant.stock_quantity,
      });
    }
  }, [variant, form]);

  // Submit cập nhật
  const onFinish = async (values: IVariant) => {
    try {
      await api.put(`/api/variants/${id}`, values);
      message.success('Cập nhật biến thể thành công');
      nav('/variants');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Cập nhật biến thể thất bại');
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      style={{ maxWidth: 600, margin: '0 auto' }}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Sản phẩm"
            name="productId"
            rules={[{ required: true, message: "Vui lòng chọn sản phẩm" }]}
          >
            <Select
              placeholder="Chọn sản phẩm"
              options={productOptions}
              loading={isProductsLoading}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Định dạng"
            name="format"
            rules={[{ required: true, message: 'Vui lòng chọn định dạng' }]}
          >
            <Select
              placeholder="Chọn định dạng"
              options={[
                { label: "Bìa cứng", value: "Bìa cứng" },
                { label: "Bìa mềm", value: "Bìa mềm" }
              ]}
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        label="SKU"
        name="sku"
        rules={[{ required: true, message: 'Vui lòng nhập SKU' }]}
      >
        <Input style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        label="Giá tiền"
        name="price"
        rules={[{ required: true, message: 'Vui lòng nhập giá tiền' }]}
      >
        <InputNumber min={0} style={{ width: '100%' }} placeholder="VD: 150000" />
      </Form.Item>

      <Form.Item
        label="Tồn kho"
        name="stock_quantity"
        rules={[{ required: true, message: 'Vui lòng nhập số lượng tồn kho' }]}
      >
        <InputNumber min={0} style={{ width: '100%' }} placeholder="VD: 100" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block loading={isVariantLoading || isProductsLoading}>
          Xác nhận
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UpdateVariant;
