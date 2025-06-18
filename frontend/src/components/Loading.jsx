import React from 'react'

const Loading = () => {
  return (
    <div>
        <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600"></div>
        </div>
        <p className="text-center text-orange-600">Carregando...</p>
    </div>
  )
}

export default Loading