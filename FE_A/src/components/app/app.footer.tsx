import { theme } from 'antd'
import { Footer } from 'antd/es/layout/layout'

const AppFooter = () => {
  const { token: { colorBgContainer } } = theme.useToken()
  return (
    <Footer style={{ textAlign: 'end', background: colorBgContainer }}>
      Copyright © {new Date().getFullYear()} by Group 8 CodeFarm
    </Footer>
  )
}

export default AppFooter
