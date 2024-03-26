import React from 'react'

const Loader = () => {
    return (
        <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-30 z-[9999]">
            <div className="animate-spin h-10 w-10 border-[3px] border-current border-t-transparent text-yellow-600 rounded-full" role="status" aria-label="loading">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    )
}

export default Loader