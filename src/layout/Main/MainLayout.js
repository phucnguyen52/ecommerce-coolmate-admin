import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import {
    DesktopOutlined,
    AppstoreAddOutlined,
    PieChartOutlined,
    AppstoreOutlined,
    UserOutlined,
    ShoppingCartOutlined,
    SkinOutlined,
    TeamOutlined,
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
            <Link to={APP_ROUTER.HOME}>Trang chủ</Link>,
            "1",
            <PieChartOutlined />
        ),
        getItem(
            <Link to={APP_ROUTER.CATEGORY}>Danh mục</Link>,
            "2",
            <DesktopOutlined />
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
        getItem(
            <Link to={APP_ROUTER.NEEDS_COLLECTIONS}>
                Bộ sưu tập và nhu cầu
            </Link>,
            "5",
            <SkinOutlined />
        ),
        getItem("Quản lí kho", "sub2", <UserOutlined />, [
            getItem(
                <Link to={APP_ROUTER.ADD_STORE}>Nhập kho</Link>,
                "6",
                <AppstoreAddOutlined />
            ),
            getItem(
                <Link to={APP_ROUTER.STORE}>Danh sách nhập kho</Link>,
                "7",
                <AppstoreOutlined />
            ),
        ]),
        getItem("Đơn hàng", "sub3", <ShoppingCartOutlined />, [
            getItem(
                <Link to={'/order/1'}>Đang chờ xác nhận</Link>,
                "8"
            ),
            getItem(
                <Link to={'/order/2'}>Đang vận chuyển</Link>,
                "9"
            ),
            getItem(
                <Link to={'/order/3'}>Đang giao hàng</Link>,
                "10"
            ),
            getItem(<Link to={'/order/4'}>Đã giao</Link>, "11"),
        ]),
        getItem(
            <Link to={APP_ROUTER.LISTUSER}>Người dùng</Link>,
            "12",
            <TeamOutlined />
        ),
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
                            {/* <div>main layout</div> */}
                        </Content>
                    </Layout>
                </Layout>
            </div>
        </>
    );
}

export default MainLayout;
