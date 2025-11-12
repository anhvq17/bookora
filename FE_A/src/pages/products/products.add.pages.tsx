import { Button, Form, Input, message, Select, Row, Col, InputNumber, Upload, DatePicker } from 'antd'
import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { IProducts } from '../../types/product'
import api from '@/config/axios.customize'
import { LoadingOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

const ProductsAdd = () => {
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 }
    }
  }
  const nav = useNavigate()
  const [form] = Form.useForm()
  const { TextArea } = Input
  const [image, setImage] = useState<string>('')
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [uploadingImages, setUploadingImages] = useState<boolean>(false)

  const onFinish = async (values: any) => {
    try {
      if (!values.imageUrl && images.length === 0) {
        message.error('Vui lòng tải lên ít nhất một hình ảnh sản phẩm!');
        return;
      }

      const productData: any = {
        name: values.name,
        price: values.price,
        category: values.category,
        imageUrl: values.imageUrl || images[0] || '',
        images: images.length > 0 ? images : (values.imageUrl ? [values.imageUrl] : []),
        stock: values.stock || 0,
        description: values.description || '',
        status: values.status || 'Sẵn',
        discountPercent: values.discountPercent || 0,
        rating: values.rating || 0,
        publisher: values.publisher || '',
        releaseDate: values.releaseDate ? dayjs(values.releaseDate).toISOString() : null,
        language: values.language || '',
        pages: values.pages || null,
        age: values.age || '',
        dimensions: values.dimensions || ''
      };

      const response = await api.post('api/products/add', productData);

      message.success(response.data.message || 'Thêm sản phẩm thành công!');
      nav('/products');
    } catch (err: any) {
      if (err.response) {
        const errorMessage = err.response.data?.message || err.response.data?.error || 'Thêm sản phẩm thất bại!';
        message.error(errorMessage);
      } else if (err.request) {
        message.error('Không thể kết nối đến server. Vui lòng kiểm tra lại!');
      } else {
        message.error('Có lỗi xảy ra. Vui lòng thử lại!');
      }
    }
  }
  const uploadImage = async (file: File, isMultiple: boolean = false) => {
    if (!file) return
    if (isMultiple) {
      setUploadingImages(true)
    } else {
      setLoading(true)
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'reacttest')

    try {
      const { data } = await axios.put(
        'https://api.cloudinary.com/v1_1/dkpfaleot/image/upload',
        formData
      )
      if (isMultiple) {
        setImages([...images, data.url])
        setUploadingImages(false)
      } else {
        setImage(data.url)
        form.setFieldsValue({ imageUrl: data.url })
        setLoading(false)
      }
    } catch (error) {
      message.error('Tải hình ảnh lên thất bại')
      if (isMultiple) {
        setUploadingImages(false)
      } else {
        setLoading(false)
      }
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
  }

  return (
    <>
    <Form form={form} onFinish={onFinish} {...formItemLayout} layout='vertical' style={{ maxWidth: 800, margin: '0 auto' }}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Tên" name='name' rules={[
            { required: true, message: 'Vui lòng nhập tên sản phẩm' },
            { min: 3, message: 'Tên sản phẩm chứa ít nhất 3 ký tự' }
          ]}>
            <Input placeholder="VD: Đắc nhân tâm"/>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Danh mục" name='category' rules={[
            { required: true, message: 'Vui lòng chọn danh mục sản phẩm' }
          ]}>
            <Select placeholder="-- Chọn --">
              <Select.Option value="Tiểu thuyết">Tiểu thuyết</Select.Option>
              <Select.Option value="Ngôn tình">Ngôn tình</Select.Option>
              <Select.Option value="Trinh thám">Trinh thám</Select.Option>
              <Select.Option value="Huyền Bí">Huyền Bí</Select.Option>
              <Select.Option value="Light Novel">Light Novel</Select.Option>
              <Select.Option value="Truyện tranh">Truyện tranh</Select.Option>
              <Select.Option value="Tác phẩm kinh điển">Tác phẩm kinh điển</Select.Option>
              <Select.Option value="Du ký">Du ký</Select.Option>
              <Select.Option value="Phóng sự">Phóng sự</Select.Option>
              <Select.Option value="Hài hước">Hài hước</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Giá tiền" name='price' rules={[
              { required: true, message: 'Vui lòng nhập giá tiền' },
              { type: 'number', message: 'Giá sản phẩm phải là số' },
            ]}>
              <InputNumber placeholder="VD: 50000" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Số lượng" name='stock' rules={[
              { required: true, message: 'Vui lòng nhập số lượng trong kho' },
              { type: 'number', message: 'Số lượng phải là số' }
            ]}>
              <InputNumber placeholder="VD: 50" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

      <Form.Item label="Trạng thái" name='status' initialValue="Sẵn">
        <Select>
          <Select.Option value="Sẵn">Sẵn</Select.Option>
          <Select.Option value="Hết">Hết</Select.Option>
        </Select>
      </Form.Item>

        <div style={{ display: 'flex', alignItems: 'start', gap: 20 }}>
          <Form.Item label="Ảnh">
            <Upload
              listType="picture-card"
              showUploadList={false}
              beforeUpload={(file) => {
                const isImage = file.type.startsWith('image/')
                if (!isImage) {
                  message.error('Chỉ được tải lên hình ảnh!')
                }
                return isImage || Upload.LIST_IGNORE
              }}
              customRequest={({ file, onSuccess }) => {
                if (file instanceof File) {
                  uploadImage(file)
                }
                setTimeout(() => onSuccess?.("ok"), 0)
              }}
            >
              {loading ? (
                <div>
                  <LoadingOutlined />
                  <div style={{ marginTop: 8 }}>Đang tải...</div>
                </div>
              ) : image ? (
                <img
                  src={image}
                  alt="Uploaded"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
                />
              ) : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Tải ảnh</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item name="imageUrl" style={{ display: 'none' }}>
            <Input type="hidden" />
          </Form.Item>

          <Form.Item label="Mô tả" name='description' style={{ flex: 1, marginBottom: 0 }} rules={[
            { required: true, message: 'Vui lòng nhập mô tả' },
            { min: 10, message: 'Mô tả chứa ít nhất 10 ký tự' }
          ]}>
            <TextArea rows={4} placeholder="Mô tả hiển thị" />
          </Form.Item>
        </div>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Xác nhận
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default ProductsAdd