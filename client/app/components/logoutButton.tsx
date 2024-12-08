'use client'

import { signOut } from "next-auth/react"

export default function LogoutButton() {
  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: '/' })
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <button
      onClick={handleSignOut}
      className="w-full md:w-2/5 bg-red-500 font-mono hover:bg-red-600 text-white font-semibold rounded-[3px] border-[2.5px] border-neutral-600 px-12 py-3 flex items-center justify-center gap-2 shadow-md transition-all"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
      Sign out
    </button>
  )
}

