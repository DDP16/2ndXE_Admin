import React, { useState } from "react";
import { motion } from "framer-motion";
import ApprovalPostCard from "../../components/Approval/ApprovalPostCard";

const posts = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  title: [
    "Honda Civic 2022 - Excellent Condition",
    "BMW X5 - Low Mileage, Full Service History",
    "Toyota Camry - One Owner, Like New",
    "Audi Q5 Premium - Fully Loaded",
    "Mercedes-Benz GLC - Mint Condition",
    "Ford Mustang GT - Performance Package",
    "Volkswagen Golf GTI - Modified",
    "Mazda CX-5 - Family SUV",
    "Hyundai Tucson - Fuel Efficient",
    "Tesla Model 3 - Long Range Battery",
  ][i % 10],
  brand: [
    "Honda",
    "BMW",
    "Toyota",
    "Audi",
    "Mercedes-Benz",
    "Ford",
    "Volkswagen",
    "Mazda",
    "Hyundai",
    "Tesla",
  ][i % 10],
  year: [2022, 2021, 2020, 2019, 2018, 2017, 2016][i % 7],
  mileage: [12500, 35000, 45200, 8900, 27600, 62000, 18400][i % 7],
  price: [
    32500, 
    56900, 
    28750, 
    45600, 
    38900, 
    52300, 
    24500, 
    36700, 
    29800, 
    58400
  ][i % 10],
  created_at: [
    "2023-12-15",
    "2023-11-28",
    "2024-01-05",
    "2023-10-22",
    "2024-02-10",
    "2023-09-18",
    "2024-01-25",
  ][i % 7],
  status: "Pending",
  imageURL: [
    `https://picsum.photos/300/300?random=${i}`,
    `https://picsum.photos/300/300?random=${i}`,
    `https://picsum.photos/300/300?random=${i}`,
  ],
}));

export default function Approval() {
  return (
    <div className="space-y-4 overflow-auto h-[90vh]">
      <div className="sticky top-0 z-10 px-6 pt-6 space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">Approval</h1>
      </div>

      <div className="overflow-y-auto h-[80vh] min-h-0">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
        >
          {posts.map((post) => (
            <ApprovalPostCard key={post.id} post={post} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
