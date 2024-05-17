import React from "react";
import SaleProduct from "./SaleProduct";
import CustomerVIP from "./CustomerVIP";
import RevenueChart from "./RevenueChart";

function HomePage() {
    return (
        <div className='bg-gray-100'>
            <RevenueChart />
            <div className="flex gap-3">
                <SaleProduct />
                <CustomerVIP />
            </div>
        </div>

    );
}

export default HomePage;
