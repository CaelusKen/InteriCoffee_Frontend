'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from 'next/image'
import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls } from '@react-three/drei'
import { storage } from '@/service/firebase'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { Button } from "@/components/ui/button"

type SingleFileUploadProps = {
  label: string
  accept: string
  onChange: (file: File, downloadURL: string) => void
  multiple?: false
  currentFileUrl?: string
}

type MultipleFileUploadProps = {
  label: string
  accept: string
  onChange: (files: File[], downloadURLs: string[]) => void
  multiple: true
}

type FileUploadProps = SingleFileUploadProps | MultipleFileUploadProps

type PreviewFile = {
  url: string
  type: 'image' | '3d' | 'pdf'
  file: File | null
}

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} />
}

export function FileUpload(props: FileUploadProps) {
  const { label, accept, onChange, multiple } = props
  const [previewFiles, setPreviewFiles] = useState<PreviewFile[]>([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!multiple && 'currentFileUrl' in props && props.currentFileUrl) {
      const fileType = props.currentFileUrl.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image'
      setPreviewFiles([{ url: props.currentFileUrl, type: fileType, file: null }])
    }

    return () => {
      previewFiles.forEach(file => {
        if (file.url.startsWith('blob:')) {
          URL.revokeObjectURL(file.url)
        }
      })
    }
  }, [multiple, props])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files
    if (!fileList) return

    const files = Array.from(fileList)
    const newPreviewFiles: PreviewFile[] = files.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : file.type === 'application/pdf' ? 'pdf' : '3d',
      file
    }))

    setUploading(true)
    try {
      const uploadedURLs = await uploadFilesToFirebase(files)

      if (multiple) {
        setPreviewFiles(prevFiles => [...prevFiles, ...newPreviewFiles])
        ;(onChange as MultipleFileUploadProps['onChange'])(files, uploadedURLs)
      } else {
        setPreviewFiles([newPreviewFiles[0]])
        ;(onChange as SingleFileUploadProps['onChange'])(files[0], uploadedURLs[0])
      }
    } catch (error) {
      console.error('Error uploading files:', error)
    } finally {
      setUploading(false)
    }
  }

  const uploadFilesToFirebase = async (files: File[]): Promise<string[]> => {
    const uploads = files.map(async (file) => {
      const storageRef = ref(storage, `design-files/${Date.now()}-${file.name}`)
      const uploadTask = uploadBytesResumable(storageRef, file)

      return new Promise<string>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          null,
          (error) => reject(error),
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
            resolve(downloadURL)
          }
        )
      })
    })

    return Promise.all(uploads)
  }

  const handleRemoveFile = (index: number) => {
    setPreviewFiles(prevFiles => prevFiles.filter((_, i) => i !== index))
    if (multiple) {
      (onChange as MultipleFileUploadProps['onChange'])(
        previewFiles.filter((_, i) => i !== index).map(file => file.file as File),
        previewFiles.filter((_, i) => i !== index).map(file => file.url)
      )
    } else {
      (onChange as SingleFileUploadProps['onChange'])(new File([], ''), '')
    }
  }

  const renderPreview = () => {
    if (previewFiles.length === 0) return null

    return (
      <div className="mt-4 grid grid-cols-3 gap-2 overflow-y-auto max-h-48">
        {previewFiles.map((file, index) => (
          <div key={index} className="relative w-[240px] h-[160px] border rounded-md overflow-hidden">
            <Button
              onClick={() => handleRemoveFile(index)}
              variant="destructive"
              size="sm"
              className="absolute top-1 right-1 z-10"
            >
              Remove
            </Button>
            {file.type === 'image' ? (
              <Image
                src={file.url}
                alt={`Preview ${index + 1}`}
                fill
                className="object-cover"
              />
            ) : file.type === 'pdf' ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <span className="ml-2">PDF</span>
              </div>
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
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor={label}>{label}</Label>
        <Input
          id={label}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          multiple={multiple}
        />
      </div>
      {uploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
      {renderPreview()}
    </div>
  )
}