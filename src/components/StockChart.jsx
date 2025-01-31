import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

const StockChart = ({ history }) => {
  const data = history.map((price, index) => ({ step: index + 1, price }));

  return (
    <LineChart width={400} height={300} data={data}>
      <Line type="monotone" dataKey="price" stroke="#8884d8" />
      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey="step" label={{ value: 'Step', position: 'insideBottom', dy: 10 }} />
      <YAxis label={{ value: 'Price', angle: -90, position: 'insideLeft' }} />
      <Tooltip />
    </LineChart>
  );
};

export default StockChart;