import { Suspense } from 'react'
import RoomEditor from '@/components/custom/room-editor/room-editor'
import LoadingPage from '@/components/custom/loading/loading'

export default function SimulationWithIdPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<LoadingPage />}>
      <RoomEditor id={params.id} />
    </Suspense>
  )
}

