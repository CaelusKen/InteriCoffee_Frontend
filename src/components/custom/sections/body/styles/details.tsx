"use client";

import React from "react";
import Header from "../../header";
import Footer from "../../footer";
import User from "@/components/custom/avatar/user-avatar";
import { motion } from "framer-motion";
import ThumbnailStyleImage from "@/components/custom/images/thumbnail-style-image";
import FurnitureGrid from "./furniture-lists/furniture-lists";
import { ColorDeck } from "./color-deck";
import SimilarStylesSection from "./similar-styles/similar-styles";
import StyleSubHeader from "../../sub-header/style-sub-header";
import StyleImagePreview from "@/components/custom/cards/style-card-preview";
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
      <motion.section
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.5 }}
        className="flex flex-col gap-4 text-center my-4 px-10"
      >
        <StyleSubHeader />
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
        Style
      </motion.h3>
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.6 }}
        className="text-3xl sm:text-5xl md:text-7xl uppercase font-bold text-left px-10 py-2"
      >
        Highlights
      </motion.h1>
      <motion.h3 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.6 }}
        className="text-lg sm:text-xl text-left px-10 py-2">
        See the highlights of the collection that you might want to reference
      </motion.h3>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.6 }}
        className="grid grid-cols-2 px-10 gap-4"
      >
        <StyleImagePreview 
          src="https://placehold.co/600x600" 
          alt="Description of the image" 
          title="Your Card Title"
        />
        <StyleImagePreview 
          src="https://placehold.co/600x600" 
          alt="Description of the image" 
          title="Your Card Title"
        />
        <StyleImagePreview 
          src="https://placehold.co/600x600" 
          alt="Description of the image" 
          title="Your Card Title"
        />
        <StyleImagePreview 
          src="https://placehold.co/600x600" 
          alt="Description of the image" 
          title="Your Card Title"
        />
      </motion.div>
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
      <motion.h3
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.6 }}
        className="text-lg sm:text-xl text-left px-10 py-2 mt-56"
      >
        Color
      </motion.h3>
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.6 }}
        className="text-3xl sm:text-5xl md:text-7xl uppercase font-bold text-left px-10 py-2"
      >
        Concept
      </motion.h1>
      <motion.h3 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.6 }}
        className="text-lg sm:text-xl text-left px-10 py-2">
        The style is used with this color palette
      </motion.h3>
      <ColorDeck/>
      <motion.h3
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.6 }}
        className="text-lg sm:text-xl text-left px-10 py-2 mt-56"
      >
        Similar
      </motion.h3>
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.6 }}
        className="text-3xl sm:text-5xl md:text-7xl uppercase font-bold text-left px-10 py-2"
      >
        Concepts
      </motion.h1>
      <motion.h3 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.6 }}
        className="text-lg sm:text-xl text-left px-10 py-2">
        Similar collections for you to choose
      </motion.h3>
      <SimilarStylesSection/>
      <SimilarStylesSection/>
    </main>
  );
};
