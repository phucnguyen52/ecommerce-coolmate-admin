import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { APP_ROUTER } from "../../utils/Constants";

function MainLayout() {
    return (
        <div className="mx-auto w-full" style={{ maxWidth: "100vw" }}>
            <Header />
            <main>
                <Outlet />
                main layout
            </main>
            <Footer />
        </div>
    );
}

export default MainLayout;
