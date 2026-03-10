import Link from 'next/link'
import { Github, Twitter, Instagram, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Section Logo & Bio */}
          <div className="">
            <Link href="/" className="text-2xl font-black text-indigo-600 tracking-tighter mb-6 inline-block">
              CityHub<span className="text-gray-900">.</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              La plateforme communautaire pour découvrir et partager les meilleurs événements de votre ville. Ne manquez plus rien.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<Twitter className="w-5 h-5" />} href="#" />
              <SocialIcon icon={<Instagram className="w-5 h-5" />} href="#" />
              <SocialIcon icon={<Github className="w-5 h-5" />} href="#" />
            </div>
          </div>

          {/* Section Navigation */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6 uppercase text-xs tracking-widest">Plateforme</h4>
            <ul className="space-y-4">
              <FooterLink href="#">Explorer les événements</FooterLink>
              <FooterLink href="#">Proposer un événement</FooterLink>
              <FooterLink href="#">Parcourir les villes</FooterLink>
            </ul>
          </div>

          {/* Section Support */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6 uppercase text-xs tracking-widest">Aide & Légal</h4>
            <ul className="space-y-4">
              <FooterLink href="#">Centre d'aide (FAQ)</FooterLink>
              <FooterLink href="#">Conditions d'utilisation</FooterLink>
              <FooterLink href="#">Confidentialité</FooterLink>
            </ul>
          </div>

          {/* Section Contact / Newsletter */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6 uppercase text-xs tracking-widest">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <Mail className="w-4 h-4 text-indigo-600" />
                <a href='mailto:ulrichtoussom@gmail.com'>Me Contacter</a>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <MapPin className="w-4 h-4 text-indigo-600" />
                <span>Paris, France</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright & Bottom bar */}
        <div className="pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400 font-medium">
          <p>© 2026 CityHub. Tous droits réservés.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-gray-900 transition-colors">Politique de cookies</Link>
            <Link href="#" className="hover:text-gray-900 transition-colors">Sécurité</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Petits composants utilitaires pour garder le code propre
function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-gray-500 text-sm hover:text-indigo-600 hover:translate-x-1 inline-block transition-all duration-200">
        {children}
      </Link>
    </li>
  )
}

function SocialIcon({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <a href={href} className="p-2.5 bg-gray-50 text-gray-400 hover:text-white hover:bg-indigo-600 rounded-xl transition-all duration-300">
      {icon}
    </a>
  )
}