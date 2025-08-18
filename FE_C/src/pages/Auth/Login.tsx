import { Button, Divider, Form, Input, message } from 'antd'
import type { ILogin } from '../../types/auth'
import { Link, useNavigate } from 'react-router'
import api from '../../configs/axios.customize'


const Login = () => {
  const nav = useNavigate()
  const [form] = Form.useForm()
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 }
    }
  }

  const onFinish = async (values: ILogin) => {
    try {
      const res = await api.post("api/login", values)
      const { token, user } = res.data

      if (!token || !user) {
        throw new Error("Dữ liệu phản hồi không hợp lệ.")
      }

      localStorage.setItem("accessToken", token)
      localStorage.setItem("user", JSON.stringify(user))

      window.dispatchEvent(new Event("userLogin"))

      message.success("Đăng nhập thành công!")
      nav("/")
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        message.error(error.response.data.message)
        console.log('Lỗi đăng nhập:', error.response.data.message)
      } else {
        message.error('Đăng nhập thất bại!')
        console.log(error)
      }
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        fontFamily: "'Inter', sans-serif",
      }}>
      <div style={{
        background: '#ffffff',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
        padding: '25px',
        maxWidth: '600px',
        width: '100%',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: 32, fontSize: '28px', fontWeight: '600', color: '#4f0f87', letterSpacing: '0.5px' }}>ĐĂNG NHẬP TÀI KHOẢN</h2>

        <Form {...formItemLayout} form={form} onFinish={onFinish} initialValues={{ residence: ['zhejiang', 'hangzhou', 'xihu'], prefix: '86' }} style={{ maxWidth: '100%' }} scrollToFirstError>
          <Form.Item
            name="email"
            style={{ marginLeft: 88, width: '100%' }}
            rules={[
              {
                type: 'email',
                message: 'Dữ liệu nhập vào không phù hợp!'
              },
              {
                required: true,
                message: 'Vui lòng nhập email!'
              }
            ]}
          >
            <Input placeholder="Email" style={{ boxShadow: 'none', borderColor: '#d9d9d9' }} />
          </Form.Item>

          <Form.Item
            name="password"
            style={{ marginLeft: 88, width: '100%' }}
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập mật khẩu!'
              }
            ]}
            hasFeedback
          >
            <Input.Password placeholder="Mật khẩu" style={{ boxShadow: 'none', borderColor: '#d9d9d9' }} />
          </Form.Item>

          <Form.Item style={{ textAlign: 'center' }}>
            <Button
              htmlType="submit"
              style={{
                background: '#4f0f87',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                padding: '6px 16px',
                width: '100%',
                marginLeft: 88,
                fontWeight: 500,
              }}
            >
              Xác nhận
            </Button>
          </Form.Item>
        </Form>

        <div style={{ width: '66%', margin: '0 auto' }}>
          <Divider plain>hoặc</Divider>
        </div>
        <Form.Item style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              style={{ boxShadow: 'none', borderColor: '#d9d9d9' }}
              onClick={() => window.location.href = "http://localhost:8888/auth/google"}
              icon={
                <img
                  src="https://cdn-icons-png.flaticon.com/512/281/281764.png"
                  alt="Google"
                  style={{ width: 18, height: 18, marginRight: 8 }}
                />
              }
              className="flex items-center justify-center px-4 py-2"
            >
              Google
            </Button>

            <Button
              style={{ boxShadow: 'none', borderColor: '#d9d9d9' }}
              onClick={() => window.location.href = "http://localhost:8888/auth/facebook"}
              icon={
                <img
                  src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
                  alt="Facebook"
                  style={{ width: 18, height: 18, marginRight: 8 }}
                />
              }
              className="flex items-center justify-center px-4 py-2"
            >
              Facebook
            </Button>

            <Button
              style={{ boxShadow: 'none', borderColor: '#d9d9d9' }}
              onClick={() => window.location.href = "http://localhost:8888/auth/github"}
              icon={
                <img
                  src="https://cdn-icons-png.flaticon.com/512/733/733553.png"
                  alt="GitHub"
                  style={{ width: 18, height: 18, marginRight: 8 }}
                />
              }
              className="flex items-center justify-center px-4 py-2"
            >
              GitHub
            </Button>
          </div>
        </Form.Item>

        <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: 'center' }}>
          Bạn chưa có tài khoản?{" "}
          <Link to="/register" style={{ color: '#4f0f87' }}>
            Đăng ký
          </Link>{" "}ngay
        </Form.Item>
      </div>
    </div>
  )
}

export default Login;