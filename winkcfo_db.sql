-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : dim. 11 jan. 2026 à 16:27
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
  `creancier` varchar(255) NOT NULL,
  `montant_total` int(11) NOT NULL,
  `reste_a_payer` int(11) NOT NULL,
  `date_echeance` date NOT NULL,
  `statut` enum('PAYE','EN_COURS','RETARD','ANNULE') DEFAULT 'EN_COURS',
  `priorite` int(11) DEFAULT 2,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `dettes`
--

INSERT INTO `dettes` (`id`, `creancier`, `montant_total`, `reste_a_payer`, `date_echeance`, `statut`, `priorite`, `createdAt`, `updatedAt`) VALUES
(1, 'Dette du 10', 440000, 440000, '2026-01-10', 'EN_COURS', 1, '2026-01-09 13:09:23', '2026-01-09 13:09:23'),
(2, 'Dette du 15', 220500, 220500, '2026-01-15', 'EN_COURS', 1, '2026-01-09 13:09:23', '2026-01-09 13:09:23'),
(3, 'Loyer Bureau', 105000, 5000, '2026-01-06', 'EN_COURS', 1, '2026-01-09 13:09:23', '2026-01-09 13:09:23');

-- --------------------------------------------------------

--
-- Structure de la table `employes`
--

CREATE TABLE `employes` (
  `id` int(11) NOT NULL,
  `nom_complet` varchar(255) NOT NULL,
  `telephone` varchar(255) DEFAULT NULL,
  `role` enum('LIVREUR_MOTO','PIETON','BUREAU','DG') NOT NULL,
  `salaire_base` int(11) DEFAULT 0,
  `est_actif` tinyint(1) DEFAULT 1,
  `solde_salaire_a_payer` int(11) DEFAULT 0 COMMENT 'Si positif, on lui doit. Si négatif, il nous doit (avance).',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `employes`
--

INSERT INTO `employes` (`id`, `nom_complet`, `telephone`, `role`, `salaire_base`, `est_actif`, `solde_salaire_a_payer`, `createdAt`, `updatedAt`) VALUES
(1, 'Le Patron (Toi)', NULL, 'DG', 0, 1, 0, '2026-01-09 13:09:23', '2026-01-09 13:09:23'),
(2, 'Jean Livreur', NULL, 'LIVREUR_MOTO', 60000, 1, 0, '2026-01-09 13:09:23', '2026-01-09 13:09:23');

-- --------------------------------------------------------

--
-- Structure de la table `motos`
--

CREATE TABLE `motos` (
  `id` int(11) NOT NULL,
  `matricule` varchar(255) NOT NULL,
  `modele` varchar(255) DEFAULT 'TVS',
  `date_achat` date DEFAULT NULL,
  `etat` enum('ACTIVE','PANNE','VENDUE','VOLÉE') DEFAULT 'ACTIVE',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `recette_totale_cumulee` int(11) DEFAULT 0,
  `depense_totale_cumulee` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `motos`
--

INSERT INTO `motos` (`id`, `matricule`, `modele`, `date_achat`, `etat`, `createdAt`, `updatedAt`, `recette_totale_cumulee`, `depense_totale_cumulee`) VALUES
(1, 'CE-123-AB', 'TVS HLX 150', '2025-06-01', 'ACTIVE', '2026-01-09 13:09:23', '2026-01-09 13:09:23', 0, 0),
(2, 'CE-999-ZZ', 'TVS HLX 150', '2025-08-15', 'PANNE', '2026-01-09 13:09:23', '2026-01-09 13:09:23', 0, 0);

-- --------------------------------------------------------

--
-- Structure de la table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `date_transaction` date DEFAULT NULL,
  `type` enum('ENTREE','SORTIE') NOT NULL,
  `montant` int(11) NOT NULL,
  `famille` enum('EXPLOITATION','FINANCE','REGULARISATION','CHARGES_OPS','CHARGES_FIXES') NOT NULL,
  `categorie` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `moto_id` int(11) DEFAULT NULL,
  `employe_id` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
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
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `motos`
--
ALTER TABLE `motos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `matricule` (`matricule`),
  ADD UNIQUE KEY `matricule_2` (`matricule`),
  ADD UNIQUE KEY `matricule_3` (`matricule`),
  ADD UNIQUE KEY `matricule_4` (`matricule`),
  ADD UNIQUE KEY `matricule_5` (`matricule`),
  ADD UNIQUE KEY `matricule_6` (`matricule`),
  ADD UNIQUE KEY `matricule_7` (`matricule`),
  ADD UNIQUE KEY `matricule_8` (`matricule`),
  ADD UNIQUE KEY `matricule_9` (`matricule`);

--
-- Index pour la table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `moto_id` (`moto_id`),
  ADD KEY `employe_id` (`employe_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `dettes`
--
ALTER TABLE `dettes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `employes`
--
ALTER TABLE `employes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `motos`
--
ALTER TABLE `motos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
  ADD CONSTRAINT `transactions_ibfk_13` FOREIGN KEY (`moto_id`) REFERENCES `motos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `transactions_ibfk_14` FOREIGN KEY (`employe_id`) REFERENCES `employes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
