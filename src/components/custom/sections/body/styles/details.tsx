"use client";

import React from "react";
import Header from "../../header";
import Footer from "../../footer";
import FilterHeader from "../../sub-header/filter-header";
import User from "@/components/custom/avatar/user-avatar";
import { motion } from "framer-motion";
import FurnitureCard from "@/components/custom/cards/furniture-card";
import ThumbnailStyleImage from "@/components/custom/images/thumbnail-style-image";
import FurnitureGrid from "./furniture-lists/furniture-lists";

interface StyleDetails {
  id: string;
}

const furnitureItems = [
  {
    name: "Modern Chair",
    price: 120.00,
    modelSrc: "https://placehold.co/400",
    categories: ["Chairs", "Modern"]
  },
  {
    name: "Vintage Table",
    price: 340.00,
    modelSrc: "https://placehold.co/400",
    categories: ["Tables", "Vintage"]
  },
  {
    name: "Elegant Sofa",
    price: 550.00,
    modelSrc: "https://placehold.co/400",
    categories: ["Sofas", "Elegant"]
  },
  {
    name: "Glass Coffee Table",
    price: 250.00,
    modelSrc: "https://placehold.co/400",
    categories: ["Tables", "Modern"]
  },
  {
    name: "Classic Wardrobe",
    price: 650.00,
    modelSrc: "https://placehold.co/400",
    categories: ["Wardrobes", "Classic"]
  },
  // Add more items as needed
]

export const StyleDetailsBody: React.FC<StyleDetails> = ({ id }) => {
  return (
    <main>
      <Header />
      <motion.section
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.5 }}
        className="flex flex-col gap-4 text-center my-4"
      >
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 cursor-default">
          <h3 className="text-sm sm:text-base">Style Details</h3>
          <p>-</p>
          <h3 className="text-sm sm:text-base">Created from: 24/06/2024</h3>
        </div>
        <h1 className="uppercase text-4xl sm:text-6xl md:text-8xl font-bold">
          Modernication
        </h1>
        <div className="flex items-center justify-center gap-2">
          <h3 className="text-sm sm:text-base">Created By:</h3>
          <div className="flex items-center justify-center gap-4">
            <User />
            <User />
          </div>
        </div>
        <ThumbnailStyleImage />
      </motion.section>
      <motion.section
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 1 }}
        className="flex flex-col gap-4 text-center my-4"
      >
        <em className="text-lg">
          A remix take on the original modern mix with minimalism, with a touch
          of ember red for the glistening beauty
        </em>
      </motion.section>
      <motion.h3
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.6 }}
        className="text-lg sm:text-xl text-left px-10 py-2 mt-56"
      >
        Elements
      </motion.h3>
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.6 }}
        className="text-3xl sm:text-5xl md:text-7xl uppercase font-bold text-left px-10 py-2"
      >
        Details
      </motion.h1>
      <motion.h3 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.6 }}
        className="text-lg sm:text-xl text-left px-10 py-2">
        Checkout the styles and its included elements here
      </motion.h3>
      <FurnitureGrid items={furnitureItems} />
      <Footer />
    </main>
  );
};
