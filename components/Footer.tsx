

import Link from 'next/link'
import { Github, Twitter, Instagram, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-10 md:pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Grid : 1 col sur mobile, 2 sur tablettes (sm), 4 sur PC (md) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 mb-12 md:mb-16">
          
          {/* Section Logo & Bio - Centrée sur mobile */}
          <div className="text-center md:text-left">
            <Link href="/" className="text-2xl font-black text-indigo-600 tracking-tighter mb-4 inline-block">
              CityHub<span className="text-gray-900">.</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-sm mx-auto md:mx-0">
              La plateforme communautaire pour découvrir et partager les meilleurs événements de ta ville.
            </p>
            <div className="flex justify-center md:justify-start gap-4">
              <SocialIcon icon={<Twitter className="w-5 h-5" />} href="#" />
              <SocialIcon icon={<Instagram className="w-5 h-5" />} href="#" />
              <SocialIcon icon={<Github className="w-5 h-5" />} href="#" />
            </div>
          </div>

          {/* Section Navigation */}
          <div className="text-center md:text-left">
            <h4 className="font-bold text-gray-900 mb-5 md:mb-6 uppercase text-xs tracking-widest">Plateforme</h4>
            <ul className="space-y-3 md:space-y-4">
              <FooterLink href="#">Explorer les événements</FooterLink>
              <FooterLink href="#">Proposer un événement</FooterLink>
              <FooterLink href="#">Parcourir les villes</FooterLink>
            </ul>
          </div>

          {/* Section Support */}
          <div className="text-center md:text-left">
            <h4 className="font-bold text-gray-900 mb-5 md:mb-6 uppercase text-xs tracking-widest">Aide & Légal</h4>
            <ul className="space-y-3 md:space-y-4">
              <FooterLink href="#">Centre d'aide (FAQ)</FooterLink>
              <FooterLink href="#">Conditions d'utilisation</FooterLink>
              <FooterLink href="#">Confidentialité</FooterLink>
            </ul>
          </div>

          {/* Section Contact */}
          <div className="text-center md:text-left">
            <h4 className="font-bold text-gray-900 mb-5 md:mb-6 uppercase text-xs tracking-widest">Contact</h4>
            <div className="space-y-4 flex flex-col items-center md:items-start">
              <div className="flex items-center gap-3 text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                <Mail className="w-4 h-4 text-indigo-600" />
                <a href='mailto:ulrichtoussom@gmail.com'>Me Contacter</a>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <MapPin className="w-4 h-4 text-indigo-600" />
                <span>Montpellier, France</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright & Bottom bar */}
        <div className="pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6 text-xs md:text-sm text-gray-400 font-medium">
          <p className="order-2 md:order-1 text-center">© 2026 CityHub. Fait avec ❤️ par Ulrich.</p>
          <div className="flex gap-6 md:gap-8 order-1 md:order-2">
            <Link href="#" className="hover:text-gray-900 transition-colors">Cookies</Link>
            <Link href="#" className="hover:text-gray-900 transition-colors">Sécurité</Link>
            <Link href="#" className="hover:text-gray-900 transition-colors">Mentions légales</Link>
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