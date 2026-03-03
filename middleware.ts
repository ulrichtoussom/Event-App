import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  // On initialise le client Supabase spécial Middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
            getAll() {
                return request.cookies.getAll()
            },
            setAll(cookiesToSet) {
                // 1. Mise à jour de la requête (pour que le serveur voie les cookies immédiatement)
                cookiesToSet.forEach(({ name, value }) => 
                    request.cookies.set(name, value)
                )
                
                // 2. Mise à jour de la réponse (pour que le navigateur reçoive les cookies)
                response = NextResponse.next({
                    request: {
                        headers: request.headers,
                    },
                    })
                    
                    cookiesToSet.forEach(({ name, value, options }) =>
                    response.cookies.set(name, value, options)
                )
            }
        }
    }
  )

  // IMPORTANT : Cette ligne vérifie la session et rafraîchit le jeton si besoin
  await supabase.auth.getUser()

  return response
}

// Ce "matcher" dit au middleware de s'exécuter sur toutes les pages 
// SAUF sur les fichiers statiques (images, etc.)
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}