import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Graph = ({ graphData }) => {
  // Transform the data into the required format for the graph
  const data = Object.keys(graphData).map((index) => {
    const month = graphData[index].month;
    const salesInvoiceTotal = graphData[index].salesInvoiceTotal;
    const purchaseInvoiceTotal = graphData[index].purchaseInvoiceTotal;

    return {
      name: month,
      Sales: salesInvoiceTotal,
      Purchase: purchaseInvoiceTotal,
      amt: salesInvoiceTotal - purchaseInvoiceTotal,
    };
  });

  return (
    <ResponsiveContainer>
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Sales" fill="#82ca9d" />
        <Bar dataKey="Purchase" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Graph;
