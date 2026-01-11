-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : dim. 11 jan. 2026 à 16:41
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `winkcfo_db`
--

-- --------------------------------------------------------

--
-- Structure de la table `dettes`
--

CREATE TABLE `dettes` (
  `id` int(11) NOT NULL,
  `creancier` varchar(255) NOT NULL COMMENT 'Nom du Tiers ou de la Banque',
  `type` enum('EMPRUNT_BANQUE','TONTINE','LOYER','FOURNISSEUR','SALAIRE_RETARD','AUTRE') DEFAULT 'AUTRE',
  `montant_total` int(11) NOT NULL,
  `reste_a_payer` int(11) NOT NULL,
  `date_echeance` date NOT NULL,
  `statut` enum('EN_COURS','RETARD','PAYE','ANNULE') DEFAULT 'EN_COURS',
  `priorite` int(11) DEFAULT 2 COMMENT '1=Vital, 2=Important, 3=Faible',
  `description` text DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `employes`
--

CREATE TABLE `employes` (
  `id` int(11) NOT NULL,
  `nom_complet` varchar(255) NOT NULL,
  `telephone` varchar(50) NOT NULL,
  `role` enum('LIVREUR_MOTO','PIETON','BUREAU','DG') DEFAULT 'LIVREUR_MOTO',
  `salaire_base` int(11) DEFAULT 0,
  `date_embauche` date DEFAULT NULL,
  `solde_courant` int(11) DEFAULT 0 COMMENT 'Positif = Il doit de l argent, Négatif = On lui doit',
  `est_actif` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `historique_kpi`
--

CREATE TABLE `historique_kpi` (
  `id` int(11) NOT NULL,
  `date_snapshot` date NOT NULL,
  `tresorerie_dispo` int(11) DEFAULT 0,
  `dette_totale` int(11) DEFAULT 0,
  `profit_net_mensuel` int(11) DEFAULT 0,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `motos`
--

CREATE TABLE `motos` (
  `id` int(11) NOT NULL,
  `matricule` varchar(50) NOT NULL,
  `modele` varchar(100) DEFAULT 'TVS HLX 150',
  `date_achat` date DEFAULT NULL,
  `etat` enum('ACTIVE','PANNE','GARAGE','VENDUE','VOLEE') DEFAULT 'ACTIVE',
  `km_actuel` int(11) DEFAULT 0,
  `prochaine_vidange_km` int(11) DEFAULT 3000,
  `date_fin_assurance` date DEFAULT NULL,
  `recette_totale` int(11) DEFAULT 0,
  `cout_entretien_total` int(11) DEFAULT 0,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `portefeuille_dg`
--

CREATE TABLE `portefeuille_dg` (
  `id` int(11) NOT NULL,
  `date_mouvement` date NOT NULL,
  `montant` int(11) NOT NULL,
  `type` enum('APPORT_PERSO','RETRAIT_PERSO','PRET_A_ENTREPRISE') NOT NULL,
  `description` text DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `previsions`
--

CREATE TABLE `previsions` (
  `id` int(11) NOT NULL,
  `mois_cible` varchar(7) NOT NULL COMMENT 'Format YYYY-MM',
  `charge_fixe_estimee` int(11) DEFAULT 0,
  `recette_attendue_min` int(11) DEFAULT 0,
  `recette_attendue_max` int(11) DEFAULT 0,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `regles_alertes`
--

CREATE TABLE `regles_alertes` (
  `id` int(11) NOT NULL,
  `type_alerte` varchar(50) NOT NULL COMMENT 'CONSO_CARBURANT, ECART_RECETTE...',
  `seuil_declenchement` float DEFAULT 0 COMMENT 'Ex: 30 pour 30%',
  `message_template` varchar(255) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `tiers`
--

CREATE TABLE `tiers` (
  `id` int(11) NOT NULL,
  `nom_complet` varchar(255) NOT NULL,
  `type` enum('BAILLEUR','FOURNISSEUR','BANQUE','ETAT','AUTRE') DEFAULT 'AUTRE',
  `telephone` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `date_transaction` date DEFAULT NULL,
  `type` enum('ENTREE','SORTIE') NOT NULL,
  `montant` int(11) NOT NULL,
  `famille` enum('EXPLOITATION','FINANCE','REGULARISATION','CHARGES_OPS','CHARGES_FIXES','REMBOURSEMENT') NOT NULL,
  `categorie` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `moyen_paiement` enum('CASH','ORANGE_MONEY','MTN_MOMO','VIREMENT') DEFAULT 'CASH',
  `moto_id` int(11) DEFAULT NULL,
  `employe_id` int(11) DEFAULT NULL,
  `dette_id` int(11) DEFAULT NULL,
  `tiers_id` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `dettes`
--
ALTER TABLE `dettes`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `employes`
--
ALTER TABLE `employes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `telephone` (`telephone`);

--
-- Index pour la table `historique_kpi`
--
ALTER TABLE `historique_kpi`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `date_snapshot` (`date_snapshot`);

--
-- Index pour la table `motos`
--
ALTER TABLE `motos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `matricule` (`matricule`);

--
-- Index pour la table `portefeuille_dg`
--
ALTER TABLE `portefeuille_dg`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `previsions`
--
ALTER TABLE `previsions`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `regles_alertes`
--
ALTER TABLE `regles_alertes`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `tiers`
--
ALTER TABLE `tiers`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_trans_moto` (`moto_id`),
  ADD KEY `fk_trans_emp` (`employe_id`),
  ADD KEY `fk_trans_dette` (`dette_id`),
  ADD KEY `fk_trans_tiers` (`tiers_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `dettes`
--
ALTER TABLE `dettes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `employes`
--
ALTER TABLE `employes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `historique_kpi`
--
ALTER TABLE `historique_kpi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `motos`
--
ALTER TABLE `motos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `portefeuille_dg`
--
ALTER TABLE `portefeuille_dg`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `previsions`
--
ALTER TABLE `previsions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `regles_alertes`
--
ALTER TABLE `regles_alertes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `tiers`
--
ALTER TABLE `tiers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `fk_trans_dette` FOREIGN KEY (`dette_id`) REFERENCES `dettes` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_trans_emp` FOREIGN KEY (`employe_id`) REFERENCES `employes` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_trans_moto` FOREIGN KEY (`moto_id`) REFERENCES `motos` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_trans_tiers` FOREIGN KEY (`tiers_id`) REFERENCES `tiers` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
