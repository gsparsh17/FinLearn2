import React from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const StockChart = ({ history }) => {
  const data = history.map((price, index) => ({ step: index + 1, price }));

  return (
    <div className="w-full h-[300px] overflow-hidden flex justify-center items-center">
      <ResponsiveContainer width="95%" height="100%">
        <LineChart data={data}>
          <Line type="monotone" dataKey="price" stroke="#8884d8" strokeWidth={2} />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="step" label={{ value: "Step", position: "insideBottom", dy: 10 }} />
          <YAxis label={{ value: "Price", angle: -90, position: "insideLeft" }} />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;
