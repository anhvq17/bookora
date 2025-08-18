import React, { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import {
  Badge,
  Button,
  Card,
  Col,
  Empty,
  Row,
  Space,
  Tabs,
  Tag,
  Typography,
} from "antd"
import {
  CalendarOutlined,
  EyeOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons"
import type { IOrder } from "../../types/order"
import { getOrderStatusMap, ORDER_STATUS } from "./orderContant"
import { useNavigate } from "react-router-dom"

const { Title, Text, Paragraph } = Typography

const fetchOrders = async (): Promise<IOrder[]> => {
  const token = localStorage.getItem("accessToken")
  const res = await axios.get("http://localhost:8888/api/orders/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  console.log(res);
  
  return res.data?.data || res.data || []
}

const OrderList: React.FC = () => {
  const nav = useNavigate()
  const [selectedTab, setSelectedTab] = useState(ORDER_STATUS[0].key)

  const { data: orders = [], isLoading, isError } = useQuery({
    queryKey: ["userOrders"],
    queryFn: fetchOrders,
  })

  const filteredOrders = orders.filter((o) => o.status === selectedTab)

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

  const counts: Record<string, number> = {}
  orders.forEach((order) => {
    counts[order.status] = (counts[order.status] || 0) + 1
  })

  const tabKeys = ORDER_STATUS.map((s) => s.key)
  const statusMap = getOrderStatusMap()

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>
      <div style={{ marginBottom: 32 }}>
        <Title level={2}>Đơn hàng của tôi</Title>
        <Paragraph type="secondary">
          Quản lý và theo dõi tất cả đơn hàng của bạn
        </Paragraph>
      </div>

      {isLoading || isError ? (
        <Card>
          <Empty
            description={
              isLoading
                ? "Đang tải dữ liệu đơn hàng..."
                : "Không thể tải dữ liệu đơn hàng"
            }
          />
        </Card>
      ) : (
        <>
          <Tabs
            activeKey={selectedTab}
            onChange={setSelectedTab}
            type="card"
            size="large"
            items={tabKeys.map((key) => {
              const label = statusMap[key]?.label || key
              return {
                key,
                label: <Badge count={counts[key] || 0}>{label}</Badge>,
              }
            })}
          />

          <div style={{ marginTop: 24 }}>
            {filteredOrders.length === 0 ? (
              <Card>
                <Empty
                  image={
                    <ShoppingCartOutlined
                      style={{ fontSize: 64, color: "#d9d9d9" }}
                    />
                  }
                  description={
                    <div>
                      <Title level={4}>Không có đơn hàng nào</Title>
                      <Text type="secondary">
                        {`Không có đơn hàng nào ở trạng thái "${statusMap[selectedTab]?.label || selectedTab}"`}
                      </Text>
                    </div>
                  }
                />
              </Card>
            ) : (
              <Space direction="vertical" size="large" style={{ width: "100%" }}>
                {filteredOrders.map((order) => {
                  const statusInfo = statusMap[order.status] || {
                    label: order.status,
                    color: "default",
                    icon: null,
                  }

                  return (
                    <Card key={order._id}>
                      <Row
                        justify="space-between"
                        align="middle"
                        style={{ marginBottom: 16 }}
                      >
                        <Col>
                          <Space align="center">
                            <Title level={4} style={{ margin: 0 }}>
                              Mã đơn: #{order._id.slice(-6).toUpperCase()}
                            </Title>
                            <Tag color={statusInfo.color} icon={statusInfo.icon}>
                              {statusInfo.label}
                            </Tag>
                          </Space>
                        </Col>
                        <Col>
                          <Button
                            type="default"
                            icon={<EyeOutlined />}
                            size="small"
                            onClick={() => nav(`/orderdetails/${order._id}`)}
                          >
                            Chi tiết
                          </Button>
                        </Col>
                      </Row>

                      <Row justify="space-between" style={{ marginBottom: 16 }}>
                        <Col>
                          <Space>
                            <CalendarOutlined />
                            <Text type="secondary">
                              {formatDate(order.createdAt)}
                            </Text>
                          </Space>
                        </Col>
                       
                      </Row>

                      {order.items.map((item, index) => (
                        <Row
                          key={index}
                          gutter={[16, 16]}
                          align="middle"
                          style={{ marginBottom: 8 }}
                        >
                          <Col>
                            <img
                              src={
                                item.product_id?.imageUrl ||
                                item.image ||
                                "https://via.placeholder.com/60"
                              }
                              alt="product"
                              width={60}
                              height={60}
                              style={{ objectFit: "cover", borderRadius: 8, border: "1px solid #eee" }}

                            />
                          </Col>
                          <Col flex="auto">
                            <Space direction="vertical" size={4}>
                              <Text strong>
                                {item.product_id?.name || item.name}
                              </Text>
                              {item.variant_id?.format && (
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                  Phiên bản: {item.variant_id.format}
                                </Text>
                              )}
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                x{item.quantity} -{" "}
                                {(item.price * item.quantity).toLocaleString(
                                  "vi-VN"
                                )}{" "}
                              </Text>
                               <Col>
                          <Text strong>
                            Tổng: {formatPrice(order.totalAmount)}
                          </Text>
                        </Col>
                            </Space>
                          </Col>
                        </Row>
                      ))}
                    </Card>
                  )
                })}
              </Space>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default OrderList