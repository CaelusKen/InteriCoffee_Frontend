'use client'

import StyleCard from "@/components/custom/cards/style-card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

export default function StyleHome() {
    const router = useRouter();

    return(
        <div>
            <Button onClick={() => {}}>Create from Template</Button>
        </div>
    )
}