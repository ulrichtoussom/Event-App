
-- 1. Creation des types enumerés 

CREATE TYPE user_role AS ENUM('guest', 'user', 'admin') ;
CREATE TYPE status_type AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE event_category AS ENUM ('comedy', 'music', 'food', 'corporate', 'lifestyle', 'other');

-- 2. Table des villes pivot de notre site 
CREATE TABLE cities(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  create_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Table des profils utilisateurs 

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT NOT NULL ,
  avatar_url TEXT ,
  role user_role DEFAULT 'user',
  city_preference UUID REFERENCES cities(id),
  update_at TIMESTAMPTZ DEFAULT now()
);

-- Tables des evenements 
CREATE TABLE events(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID  REFERENCES profiles(id) ON DELETE SET NULL,
  city_id UUID NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category event_category DEFAULT 'other',
  status status_type DEFAULT 'pending',
  venue_name TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  image_url TEXT,
  ticket_link TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Table des Influenceurs
CREATE TABLE influencers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city_id UUID NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    bio TEXT,
    category TEXT, -- ex: 'Fashion', 'Tech'
    social_links JSONB, -- Stockage flexible des réseaux {ig: '...', yt: '...'}
    profile_image TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Table des Deals & Offers
CREATE TABLE deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city_id UUID NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    brand_name TEXT,
    discount_value TEXT,
    promo_code TEXT,
    is_premium BOOLEAN DEFAULT false,
    expiry_date DATE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Creation des INDEX pour accellerer le filter par ville _crypto_aead_det_decrypt
CREATE INDEX idx_events_city ON events(city_id) ;
CREATE INDEX idx_deals_city ON deals(city_id) ;
CREATE INDEX idx_influencers_city ON influencers(city_id);
CREATE INDEX idx_events_status ON events(status) ; -- pour le dasboard de securite admin 

-- activation  des Row Level Security 

ALTER TABLE deals ENABLE ROW LEVEL SECURITY ;

-- Creation des polices qui s applique a tables deals 
-- Regles :  tout le monde peut voir les deals non Prenium 
CREATE POLICY "Public deals are viewable by everyone"
ON deals FOR SELECT 
USING(is_premium=false);

-- Règle : Seuls les utilisateurs connectés voient les deals premium

CREATE POLICY "Premium deals are viewable by logged users"
ON deals FOR SELECT
USING(auth.role() = 'authenticated');

--- 1. Activer la sécurité sur la table des événements
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- 2. RÈGLE : Tout le monde (même non connecté) peut VOIR les événements approuvés
CREATE POLICY "Tout le monde peut voir les événements approuvés" 
ON events FOR SELECT 
USING (status = 'approved');

-- 3. RÈGLE : Seuls les utilisateurs connectés peuvent CRÉER (publier) un événement
-- La condition 'auth.uid() = user_id' vérifie que l'ID de l'utilisateur connecté correspond à l'auteur
CREATE POLICY "Seuls les utilisateurs connectés peuvent créer" 
ON events FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 4. RÈGLE : Seul l'auteur (ou un admin) peut MODIFIER son événement
CREATE POLICY "L'auteur peut modifier son propre événement" 
ON events FOR UPDATE 
USING (
  auth.uid() = user_id
  OR 
  EXISTS(SELECT 1 FROM profiles WHERE auth.uid()=id AND role='admin' )
)
WITH CHECK (
  auth.uid() = user_id
  OR 
  EXISTS( SELECT 1 FROM profiles WHERE auth.uid()=id AND role ='admin')
);

ALTER TABLE cities 
ADD COLUMN image_url TEXT,
ADD COLUMN description TEXT, -- Optionnel : une petite phrase d'accroche pour la ville
ADD COLUMN lat DECIMAL(9,6),
ADD COLUMN lng DECIMAL(9,6);

-- creation d'un trigger qui cree automatique un profil lorsque qu'un user est creer manuellement 
-- dans supabase
-- Cette fonction crée une entrée dans la table profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'Nouvel Utilisateur'), -- Met un nom par défaut si vide
    'user'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ce trigger lance la fonction à chaque fois qu'un utilisateur est créé dans auth.users
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- DROP FUNCTION IF EXISTS handle_new_user();

-- Modifier le role user creer par trigger pas admin 
UPDATE profiles 
SET role = 'admin' 
WHERE id = 'c6862df1-451c-46aa-a707-88a2fad5dd1c';

-- Insertion des donnees de Test pour les tables events, deals , cities, influencers 


-- Nettoyage des données existantes pour repartir à zéro (Optionnel, attention !)
-- TRUNCATE cities, events, deals, influencers RESTART IDENTITY CASCADE;

-- 1. INSERTION DES VILLES (avec Images et Coordonnées)
INSERT INTO cities (name, slug, image_url, description, lat, lng) VALUES
('Paris', 'paris', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34', 'La ville lumière, capitale de la culture et de la mode.', 48.8566, 2.3522),
('Lyon', 'lyon', 'https://images.unsplash.com/photo-1509030464150-144d5809673d', 'Capitale mondiale de la gastronomie et ville historique.', 45.7640, 4.8357),
('Marseille', 'marseille', 'https://images.unsplash.com/photo-1507502707541-f369a3b18502', 'Cité phocéenne entre mer, collines et dynamisme urbain.', 43.2965, 5.3698);

-- 2. INSERTION D'ÉVÉNEMENTS (Liés aux villes créées)
INSERT INTO events (title, description, category, event_date, city_id, status, venue_name, image_url)
VALUES 
(
    'Jazz sur Seine', 
    'Un festival de jazz en plein air au cœur de Paris.', 
    'music', 
    '2026-06-15 20:00:00', 
    (SELECT id FROM cities WHERE slug = 'paris'), 
    'approved', 
    'Jardin du Luxembourg',
    'https://images.unsplash.com/photo-1511192336575-5a79af67a629'
),
(
    'Fête des Lumières', 
    'Spectacles visuels époustouflants dans toute la ville.', 
    'lifestyle', 
    '2026-12-08 18:00:00', 
    (SELECT id FROM cities WHERE slug = 'lyon'), 
    'approved', 
    'Place Bellecour',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745'
),
(
    'Salon de la Gastronomie', 
    'Dégustez les meilleurs produits du terroir.', 
    'food', 
    '2026-05-10 10:00:00', 
    (SELECT id FROM cities WHERE slug = 'marseille'), 
    'pending', -- Celui-ci est en attente pour tester le dashboard admin
    'Parc Chanot',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0'
);

-- 3. INSERTION DES DEALS (Classique et Premium pour tester les RLS)
INSERT INTO deals (title, brand_name, discount_value, is_premium, city_id, expiry_date)
VALUES 
('1 Café offert pour un brunch', 'Le Petit Bistrot', 'Gratuit', false, (SELECT id FROM cities WHERE slug = 'paris'), '2026-12-31'),
('Accès VIP Spa -50%', 'Hôtel Luxe & Spa', '-50%', true, (SELECT id FROM cities WHERE slug = 'paris'), '2026-06-01'),
('Happy Hour prolongé', 'Le Pub Lyonnais', '2 pour 1', false, (SELECT id FROM cities WHERE slug = 'lyon'), '2026-08-15');

-- 4. INSERTION D'INFLUENCEURS
INSERT INTO influencers (name, bio, category, city_id, social_links, profile_image)
VALUES 
(
    'Léa Mode Paris', 
    'Blogueuse mode et lifestyle à Paris.', 
    'Fashion', 
    (SELECT id FROM cities WHERE slug = 'paris'), 
    '{"instagram": "https://ig.me/leamode", "tiktok": "@leaparis"}',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330'
),
(
    'Alex Foodie Lyon', 
    'Je teste tous les bouchons lyonnais pour vous !', 
    'Food', 
    (SELECT id FROM cities WHERE slug = 'lyon'), 
    '{"instagram": "https://ig.me/alexfood", "youtube": "AlexLyon"}',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'
);

// creation de Table Favoris 

CREATE TABLE bookMarks(
  id UUID DEFAULT lg_random

)


// Creation des RLS sur la table event Pour l admin  
// l adminstrateur peuvent tous faire sur les evenement 
// ALTER TABLE event ENABLE ROW LEVEL SECURITY ;

CREATE POLICY " Les admin peuvent tout faire sur les evenements"
ON event 
FOR ALL
TO authenticated
USING(
  -- on verifie si pour un utilisateur identifie si son role dans la table profil est admin 
  EXISTS(
    SELECT 1 FROM profiles
    WHERE(
      profiles.id = auth.uid() 
      and 
      profiles.role = 'admin'
    )
  )
)
-- creation d une police sur la table Event pour les utilisateurs authentifié . 
CREATE POLICY " Les utilisateurs peuvent voir leurs propres events "
ON events
FOR SELECT 
TO authenticated 
USING(
  auth.uid() = user_id
)

-- Creation d une police sur table event pour l admintrateur 

CREATE POLICY " l administrateur peut voir tous les evenments "
ON events 
FOR SELECT 
TO authenficated 
USING(
  EXIST(
    SELECT 1 FROM profiles 
    WHERE (auth.uid() = id  and role = 'admin')
))
WITH CHECK (
   EXIST(
    SELECT 1 FROM profiles 
    WHERE (auth.uid() = id  and role = 'admin') 
))

-- Activation et Creation des RLS sur la tables 

ALTER TABLE ENABLE ROW LEVEL SECURITY 

CREATE POLICY " UN Administrateur  peut lire les information contenu dans les profiles"
ON profiles 
FOR SELECT 
TO authenticated
USING(
  EXISTS(
    SELECT 1 FROM profiles 
    WHERE (
      auth.uid() = id
      and 
      role = 'admin'
    )
  )
)

-- CREATION D'UN NOUVEAU TRIGGER POUR INSERER LES EMAILS 
-- REMARQUE :si tu a un trigger deja definir le nouveau trigger ne prend par en compte ce que l ancien 
-- faisait deja dont si tu prend en charge tout les colonnes definir dans ton precedent trigger il faut tous 
-- les redefinir dans ton nouveau 
-- le SECURITY DEFINER permet de contourner les regles RLS pour les  taches systemes automatique 
-- new contient les donnees qui arrive et paradoxallement ,
-- old contient les donnees avant la modification( utiles pour trigger update)

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, full_name)
  VALUES (
    new.id, 
    new.email, 
    'user', 
    COALESCE(new.raw_user_meta_data->>'full_name', 'Nouvel Utilisateur'), -- Met un nom par défaut si vide
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apres avoir definir notre fonction qui retourne un trigger ( declenche un evenement )
-- Il faut lancer cette evenement en lui donnant un nom on_auth_user_created
-- Le nom donner a cette autautomatisme pour servir a le supprimer plutard 

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- vu que le nouveau trigger ne va qu impacter sur les donnees nouvellement entrant il va falloir ajouter 
-- les donnees manuellement (email) dans notre BD 
-- une alternative serait utiliser un Script qui le fait automatiquement 


CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uid(),
  name TEXT NOT NULL ,
  age INTEGER NOT NULL,
  created_at TIMETAMPSTZ DEFAULT now()
)

CREATE TABLE posts(
  id  UUID PRIMARY KEY DEFAULT gen_random_uid()
  title TEXT NOT NULL,
  description TEXT NOT NULL ,
  user_id UUID NOT NULL  REFERENCES users(id) ON DELETE CASCADE
)

ALTER TABLE profiles 
ADD COLUMN email TEXT 

// vu 

UPDATE TABLE profile 
set email = auth.users.email
FROM auth.users