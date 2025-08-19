import api from '@/config/axios.customize';
import { IVariant } from '@/types/variants';
import { useQuery } from '@tanstack/react-query';
import { Button, Form, Input, InputNumber, message, Select, Row, Col } from 'antd';
import { useNavigate } from 'react-router';

const AddVariant = () => {
  const nav = useNavigate();
  const [form] = Form.useForm();

  const {data:products, isLoading} = useQuery({
    queryKey:['products'],
    queryFn: async()=>{
      const res = await api.get('/api/products')
      return res.data.data
    }
  })
  const productOptions = products?.map((product) => ({
  label: product.name, // hoặc title
  value: product._id,
})) || [];


  const onFinish = async (values: IVariant) => {
    try {
      await api.post('/api/variants/add',values)
      message.success("Thêm biến thể thành công");
      nav("/variants");
    } catch (error: any) {
      message.error(error.response?.data?.message || "Thêm biến thể thất bại");
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} style={{ maxWidth: 600, margin: '0 auto' }}>
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
  loading={isLoading}
/>

          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Định dạng"
            name="format"
            rules={[
              { required: true, message: 'Vui lòng chọn định dạng' }
            ]}
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
        label="Sku"
        name="sku"
        rules={[{ required: true, message: 'Vui lòng nhập sku' }]}
      >
        <Input  style={{ width: '100%' }}  />
      </Form.Item>
      <Form.Item
        label="Giá tiền"
        name="price"
        rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
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
        <Button type="primary" htmlType="submit" block>
          Xác nhận
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddVariant;
