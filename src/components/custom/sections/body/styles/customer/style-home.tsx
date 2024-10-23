'use client'

import StyleCard from "@/components/custom/cards/style-card";
import { useRouter } from "next/navigation";
import React from "react";

const styleData = [
    { imageSrc: "https://placehold.co/400", name: "Modern Minimalist", creator: "Jane Doe" },
    { imageSrc: "https://placehold.co/400", name: "Bohemian Chic", creator: "John Smith" },
    { imageSrc: "https://placehold.co/400", name: "Industrial Loft", creator: "Emma Wilson" },
]

export default function StyleHome() {
    const router = useRouter();
    return(
        <main className="px-10 py-4">
            <span className="flex flex-col gap-3">
                <h1 className="text-4xl uppercase font-semibold">Style Home Page</h1>
                <h3 className="text-lg font-medium">Start to edit or create new style</h3>
            </span>
            <div className="grid grid-cols-3 gap-4 justify-items-center">
                {styleData.map((style, index) => (
                    <StyleCard 
                        key={index}
                        imageSrc={style.imageSrc}
                        name={style.name}
                        creator={style.creator}
                        onViewDetails={() => router.push('/browse/styles/' + style.name)}
                    />
                ))}
            </div>
            <span className="flex flex-col gap-3">
                <h1 className="text-4xl uppercase font-semibold">Browse from Templates</h1>
                <h3 className="text-lg font-medium">Browse from the original templates created by merchants</h3>
            </span>
            <div className="grid grid-cols-3 gap-4 justify-items-center">
                {styleData.map((style, index) => (
                    <StyleCard 
                        key={index}
                        imageSrc={style.imageSrc}
                        name={style.name}
                        creator={style.creator}
                        onViewDetails={() => router.push('/browse/styles/' + style.name)}
                    />
                ))}
            </div>
        </main>
    )
}