'use client'

import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const ConsultantEditTemplate = () => {
  return (
    <div>
      <Tabs defaultValue="edit" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="edit-information">Edit Template Information</TabsTrigger>
          <TabsTrigger value="edit-modelView">Edit Template Model View</TabsTrigger>
        </TabsList>
        <TabsContent value="edit-information">
          Edit your template information here
        </TabsContent>
        <TabsContent value="edit-modelView">
          Edit your template 3D view here
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ConsultantEditTemplate