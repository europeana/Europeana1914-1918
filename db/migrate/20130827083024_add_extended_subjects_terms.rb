# encoding: UTF-8
class AddExtendedSubjectsTerms < ActiveRecord::Migration
  SUBJECTS = [
    "Guerre mondiale (1914-1918)",
    "Guerre mondiale (1914-1918) -- Origines",
    "Déclaration de guerre -- 1900-1945",
    "Guerre mondiale (1914-1918) -- Campagnes et batailles",
    "Guerre mondiale (1914-1918) -- Champs de bataille",
    "Guerre mondiale (1914-1918) -- Campagnes et batailles -- Front occidental",
    "Guerre mondiale (1914-1918) -- Campagnes et batailles -- Front oriental",
    "Guerre mondiale (1914-1918) -- Campagnes et batailles -- Balkans",
    "Guerre mondiale (1914-1918) -- Campagnes et batailles -- Italie",
    "Guerre mondiale (1914-1918) -- Opérations navales",
    "Guerre mondiale (1914-1918) -- Opérations aérienes",
    "Guerre mondiale (1914-1918)--Campagnes et batailles -- Afrique",
    "Guerre mondiale (1914-1918)--Campagnes et batailles -- Asie",
    "Guerre mondiale (1914-1918) -- Guerre de tranchées ",
    "Guerre mondiale (1914-1918) -- Histoire des unités",
    "Prisonniers de guerre -- 1900-1945",
    "Guerre mondiale (1914-1918) -- Prisonniers et prisons",
    "Guerre mondiale (1914-1918) -- Récits personnels",
    "Guerre mondiale (1914-1918) -- Histoire diplomatique",
    "Guerre mondiale (1914-1918) -- Propagande",
    "Guerre mondiale (1914-1918) -- Autriche",
    "Guerre mondiale (1914-1918) -- Belgique",
    "Guerre mondiale (1914-1918) -- France",
    "Guerre mondiale (1914-1918) -- Allemagne",
    "Guerre mondiale (1914-1918) -- Grande-Bretagne",
    "Guerre mondiale (1914-1918) -- Italie",
    "Guerre mondiale (1914-1918) -- Serbie",
    "Guerre mondiale (1914-1918) -- Technologie",
    "Guerre mondiale (1914-1918) -- Transport",
    "Guerre mondiale (1914-1918) -- Aspect sanitaire",
    "Guerre mondiale (1914-1918) -- Soins médicaux",
    "Guerre mondiale (1914-1918) -- Aspect économique",
    "Guerre mondiale (1914-1918) -- Destruction et pillage",
    "Guerre mondiale (1914-1918) -- Finances",
    "Guerre mondiale (1914-1918) -- Aspect social",
    "Guerre mondiale (1914-1918) -- Femmes",
    "Droit",
    "Droit -- Législation",
    "Guerre (droit international)",
    "Droit militaire",
    "Guerre mondiale (1914-1918) -- Réfugiés",
    "Guerre mondiale (1914-1918) -- Atrocités",
    "Guerre mondiale (1914-1918) -- Aspect religieux",
    "Guerre mondiale (1914-1918) -- Sermons",
    "Guerre mondiale (1914-1918) -- Aspect moral",
    "Objection de conscience -- 1900-1945",
    "Guerre mondiale (1914-1918) -- Objecteurs de conscience",
    "Vie intellectuelle -- 1900-1945",
    "Guerre mondiale (1914-1918) -- Littérature et guerre",
    "Guerre mondiale (1914-1918)-- Roman",
    "Guerre mondiale (1914-1918)-- Poésie",
    "Guerre mondiale (1914-1918)-- Pièces de théâtre",
    "Guerre mondiale (1914-1918)-- Ouvrages pour la jeunesse",
    "Guerre mondiale (1914-1918) -- Art et guerre",
    "Guerre mondiale (1914-1918) -- Caricatures et dessins humoristiques",
    "Guerre mondiale (1914-1918) -- Chansons",
    "Guerre mondiale (1914-1918) -- Musique et guerre",
    "Musique militaire -- 20e siècle",
    "Guerre mondiale (1914-1918) -- Cinéma et guerre ",
    "Guerre mondiale (1914-1918)-- Films de fiction",
    "Guerre mondiale (1914-1918) -- Monuments",
    "Guerre mondiale (1914-1918) -- Historiographie",
    "Mémoire collective -- 1900-1945"
  ]

  def self.up
    if mf = MetadataField.find_by_name("extended_subjects")
      mf.taxonomy_terms.clear
      SUBJECTS.each do |subject|
        unless mf.taxonomy_terms.find_by_term(subject)
          tt = TaxonomyTerm.new(:term => subject)
          mf.taxonomy_terms << tt
        end
      end
    end
  end

  def self.down
    if mf = MetadataField.find_by_name("extended_subjects")
      mf.taxonomy_terms.clear
    end
  end
end




  


