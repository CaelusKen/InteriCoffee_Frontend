'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from 'next/image'
import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls } from '@react-three/drei'

type SingleFileUploadProps = {
  label: string
  accept: string
  onChange: (file: File) => void
  multiple?: false
  preview?: string
}

type MultipleFileUploadProps = {
  label: string
  accept: string
  onChange: (files: File[]) => void
  multiple: true
  preview?: string[]
}

type FileUploadProps = SingleFileUploadProps | MultipleFileUploadProps

type PreviewFile = {
  url: string
  type: 'image' | '3d'
}

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} />
}

export function FileUpload(props: FileUploadProps) {
  const { label, accept, onChange, multiple, preview } = props
  const [previewFiles, setPreviewFiles] = useState<PreviewFile[]>(
    preview 
      ? (Array.isArray(preview) ? preview : [preview]).map(url => ({ url, type: '3d' }))
      : []
  )

  useEffect(() => {
    return () => {
      // Clean up object URLs when component unmounts
      previewFiles.forEach(file => URL.revokeObjectURL(file.url))
    }
  }, [previewFiles])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files
    if (!fileList) return

    const files = Array.from(fileList)
    const newPreviewFiles: PreviewFile[] = files.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : '3d'
    }))

    if (multiple) {
      onChange(files)
      setPreviewFiles(prevFiles => [...prevFiles, ...newPreviewFiles])
    } else {
      onChange(files[0])
      setPreviewFiles([newPreviewFiles[0]])
    }
  }

  const renderPreview = () => {
    if (previewFiles.length === 0) return null
    
    return (
      <div className="mt-2 flex flex-wrap gap-2">
        {previewFiles.map((file, index) => (
          <div key={index} className="relative w-24 h-24 border rounded-md overflow-hidden">
            {file.type === 'image' ? (
              <Image
                src={file.url}
                alt={`Preview ${index + 1}`}
                fill
                className="object-cover"
              />
            ) : (
              <Canvas>
                <Suspense fallback={null}>
                  <ambientLight />
                  <pointLight position={[10, 10, 10]} />
                  <Model url={file.url} />
                  <OrbitControls />
                </Suspense>
              </Canvas>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div>
        <Label htmlFor={label}>{label}</Label>
        <Input
          id={label}
          name={label}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          multiple={multiple}
        />
      </div>
      {renderPreview()}
    </div>
  )
}