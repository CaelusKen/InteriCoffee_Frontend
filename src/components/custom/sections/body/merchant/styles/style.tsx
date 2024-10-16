"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { TemplateData } from "@/types/room-editor";

interface Style extends TemplateData{
  id: string;
  views: number;
  items: number;
}

export default function StyleHome() {
  const [searchTerm, setSearchTerm] = useState("");
  const [styles, setStyles] = useState<Style[]>([]);

  const router = useRouter();

  useEffect(() => {
    const savedTemplates = JSON.parse(
      localStorage.getItem("merchantTemplates") || "[]"
    ) as TemplateData[];
    setStyles(
      savedTemplates.map((template, index) => ({
        ...template,
        id: (index + 1).toString(),
        templateName: template.templateName || `Template ${index + 1}`,
        description: template.description || `Custom template with ${template.floors[0]?.rooms[0]?.furniture.length || 0} items`,
        items: template.floors[0]?.rooms[0]?.furniture.length || 0,
        views: 0,
      }))
    );
  }, []);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Style Gallery</h1>

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search styles..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button className="bg-green-500 text-white hover:bg-green-600">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Style
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-background dark:bg-gray-800">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-white data-[state=active]:text-black dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white"
          >
            All Styles
          </TabsTrigger>
          <TabsTrigger
            value="popular"
            className="data-[state=active]:bg-white data-[state=active]:text-black dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white"
          >
            Popular
          </TabsTrigger>
          <TabsTrigger
            value="recent"
            className="data-[state=active]:bg-white data-[state=active]:text-black dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white"
          >
            Recently Added
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {styles.map((style) => (
              <Card key={style.id} className="rounded-sm">
                <CardHeader>
                  <CardTitle>{style.templateName}</CardTitle>
                  <CardDescription>{style.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <img
                    src={"https://placehold.co/400"}
                    alt={style.templateName}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{style.items} items</span>
                    <span>{style.views} views</span>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center gap-4">
                  <Button
                    className="w-full"
                    onClick={() => router.push("/merchant/styles/" + style.id)}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="popular" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {styles.map((style) => (
              <Card key={style.id} className="rounded-sm">
                <CardHeader>
                  <CardTitle>{style.templateName}</CardTitle>
                  <CardDescription>{style.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <img
                    src={"https://placehold.co/400"}
                    alt={style.templateName}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{style.items} items</span>
                    <span>{style.views} views</span>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center gap-4">
                  <Button
                    className="w-full"
                    onClick={() => router.push("/merchant/styles/" + style.id)}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="recent" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {styles.map((style) => (
              <Card key={style.id} className="rounded-sm">
                <CardHeader>
                  <CardTitle>{style.templateName}</CardTitle>
                  <CardDescription>{style.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <img
                    src={"https://placehold.co/400"}
                    alt={style.templateName}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{style.items} items</span>
                    <span>{style.views} views</span>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center gap-4">
                  <Button
                    className="w-full"
                    onClick={() => router.push("/merchant/styles/" + style.id)}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
