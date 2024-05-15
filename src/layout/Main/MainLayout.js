import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
    ShoppingCartOutlined,
    SkinOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import { APP_ROUTER } from "../../utils/Constants";
const { Content, Sider } = Layout;
function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}
function MainLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const items = [
        getItem(
            <Link to={APP_ROUTER.HOME}>Home</Link>,
            "1",
            <PieChartOutlined />
        ),
        getItem(
            <Link to={APP_ROUTER.CATEGORY}>Danh mục</Link>,
            "2",
            <DesktopOutlined />
        ),
        getItem(
            <Link to={APP_ROUTER.NEEDS_COLLECTIONS}>
                Bộ sưu tập và nhu cầu
            </Link>,
            "5",
            <SkinOutlined />
        ),

        getItem("Sản phẩm", "sub1", <UserOutlined />, [
            getItem(
                <Link to={APP_ROUTER.ADD_PRODUCT}>Thêm sản phẩm</Link>,
                "3"
            ),
            getItem(
                <Link to={APP_ROUTER.PRODUCT}>Danh sách các sản phẩm</Link>,
                "4"
            ),
        ]),
        getItem("Đơn hàng", "sub3", <ShoppingCartOutlined />, [
            getItem(<Link to={APP_ROUTER.ORDER}>Tất cả đơn hàng</Link>, "10"),
            getItem(
                <Link to={APP_ROUTER.ORDERWAIT}>Đang chờ xác nhận</Link>,
                "12"
            ),
            getItem(
                <Link to={APP_ROUTER.ORDERTRANS}>Đang vận chuyển</Link>,
                "13"
            ),
            getItem(
                <Link to={APP_ROUTER.ORDERDELIVERING}>Đang giao hàng</Link>,
                "14"
            ),
            getItem(<Link to={APP_ROUTER.ORDERDELIVERED}>Đã giao</Link>, "15"),
        ]),
        getItem(
            <Link to={APP_ROUTER.LISTUSER}>Người dùng</Link>,
            "16",
            <TeamOutlined />
        ),
        getItem("Team", "sub2", <TeamOutlined />, [
            getItem("Team 1", "6"),
            getItem("Team 2", "8"),
        ]),
        getItem("Files", "9", <FileOutlined />),
    ];
    return (
        <>
            <div className="mx-auto w-full" style={{ maxWidth: "100vw" }}>
                <Layout
                    style={{
                        minHeight: "100vh",
                    }}
                >
                    <Sider
                        collapsible
                        collapsed={collapsed}
                        onCollapse={(value) => setCollapsed(value)}
                    >
                        <div className="demo-logo-vertical" />
                        <Menu
                            theme="dark"
                            defaultSelectedKeys={["1"]}
                            mode="inline"
                            items={items}
                        />
                    </Sider>
                    <Layout>
                        <Header />
                        <Content
                            style={{
                                margin: "0 16px",
                                backgroundColor: "white",
                            }}
                        >
                            <Outlet />
                            <div>main layout</div>
                        </Content>
                    </Layout>
                </Layout>
            </div>
        </>
    );
}

export default MainLayout;
