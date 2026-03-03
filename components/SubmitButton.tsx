'use client'

import { useFormStatus } from 'react-dom'

export function SubmitButton({ text }: { text: string }) {
  // useFormStatus détecte automatiquement si le formulaire parent est en cours d'envoi
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-indigo-600 mt-3 text-white p-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
    >
      {pending ? (
        <>
          <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
          Enregistrement...
        </>
      ) : text}
    </button>
  )
}