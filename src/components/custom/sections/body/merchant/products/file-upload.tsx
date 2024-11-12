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
  file: File | null
}

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} />
}

export function FileUpload(props: FileUploadProps) {
  const { label, accept, onChange, multiple, preview } = props
  const [previewFiles, setPreviewFiles] = useState<PreviewFile[]>(
    preview
      ? (Array.isArray(preview)
          ? preview.map(url => ({ url, type: '3d', file: null }))
          : [{ url: preview, type: '3d', file: null }]
        )
      : []
  )

  useEffect(() => {
    return () => {
      previewFiles.forEach(file => URL.revokeObjectURL(file.url))
    }
  }, [previewFiles])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files
    if (!fileList) return

    const files = Array.from(fileList)
    const newPreviewFiles: PreviewFile[] = files.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : '3d',
      file
    }))

    if (multiple) {
      onChange(files)
      setPreviewFiles(prevFiles => [...prevFiles, ...newPreviewFiles])
    } else {
      onChange(files[0])
      setPreviewFiles([newPreviewFiles[0]])
    }
  }

  const handleRemoveFile = (index: number) => {
    setPreviewFiles(prevFiles => prevFiles.filter((_, i) => i !== index))
    if (multiple) {
      onChange(previewFiles.filter((_, i) => i !== index).map(file => file.file as File))
    }
  }

  const renderPreview = () => {
    if (previewFiles.length === 0) return null

    return (
      <div className="mt-4 grid grid-cols-3 gap-2 overflow-y-auto max-h-48">
        {previewFiles.map((file, index) => (
          <div key={index} className="relative w-[240px] h-[160px] border rounded-md overflow-hidden">
            <button
              onClick={() => handleRemoveFile(index)}
              className="absolute top-1 right-1 z-10 bg-red-500 text-white text-xs w-6 h-6 rounded-full"
            >
              &times;
            </button>
            {file.type === 'image' ? (
              <Image
                src={file.url}
                alt={`Preview ${index + 1}`}
                fill
                className="object-cover"
              />
            ) : (
              <Canvas style={{ background: '#f0f0f0' }}>
                <Suspense fallback={null}>
                  <ambientLight intensity={0.4} />
                  <directionalLight position={[5, 5, 5]} />
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
      <div className="w-1/2">
        <Label htmlFor={label}>{label}</Label>
        <Input
          id={label}
          name={label}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          multiple={multiple}
          className="p-2 text-sm border-gray-300 rounded-md"
        />
      </div>
      {renderPreview()}
    </div>
  )
}
