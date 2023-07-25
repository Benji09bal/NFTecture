1. NFTecture

GitHub Repositorie: https://github.com/Benji09bal/NFTecture
Video LOOM: 

Plateforme d'achat/vente de NFT représentant des créations d'architectes. 

-----------------------------------------------------------------------------------------------------------------------------------------

2. Description du projet

C'est une plateforme permettant de donner de la visibilité aux architectes concernant leurs réalisations et leur savoir-faire. 
Son but est la mise en relation des Architectes avec des acheteurs.
L'objectif étant:
- De Bénéficier d'une plateforme d'échange B to C.
- Tirer parti de la technologie blockchain et des
tokens non fongibles (NFT)
- Construire une plateforme sécurisée,
transparente et intuitive qui centralise l'offre et la
demande de ce marché.
- Permettre aux architectes et aux acheteurs de se
connecter et de s'engager dans le monde
numérique.
- Pas de recours à des intermédiaires qui ajoutent
de la complexité et des coûts au processus de
transaction = Réduire les parties-prenantes
superflues.
- Pouvoir acquérir non seulement la représentation
numérique d'une création ainsi que sa méthode de
réalisation (savoir-faire) et de l'opportunité de sa
revente futur .

-----------------------------------------------------------------------------------------------------------------------------------------

3. Comment installer et exécuter le projet

Ce projet NFT Marketplace a les exigences suivantes :

- [Node.js](https://nodejs.org/) 12.x ou version ultérieure
- Un compte [Infura](https://infura.io/) et un identifiant de projet
- Un compte [MetaMask](https://metamask.io/)
- Windows, Linux or MacOS

Installer le projet avec la commande: git clone <url du projet>

Prérequis: Avant d'exécuter les tests, assurez-vous d'avoir installé les dépendances nécessaires en exécutant la commande suivante :
$ npm install

Installer au besoin l'ensemble des dépendances tel que @Openzeppelin: npm install @openzeppelin/contracts

Vous devrez modifier le réseau de développement dans votre truffle-config.js pour qu'il corresponde au numéro de port. Maintenant, il suffit de lancer dans votre terminal à partir du dossier nft-marketplace:  

$ truffle migrate

Ce qui sera par défaut le réseau de développement. Cela compilera et déploiera vos contrats.

Maintenant pour effectuer les fonctionnalitées principales, vous pouvez exécuter le script run.js afin d'automatiser les tâches courantes. 
Il exécutera toutes nos différentes fonctions. Exécutez le :

$ truffle exec scripts/run.js

Exécution des Tests: Pour exécuter les tests, utilisez la commande suivante :
$ truffle test

Pensez à modifier vos fichiers de configuration Truffle pour utiliser les variables d'environnement que vous avez configurées. Créez un fichier .env avec le code suivant :

INFURA_KEY="<Your Infura project key>"
GANACHE_MNEMONIC="<Your Ganache mnemonic>"
GOERLI_MNEMONIC="<Your Metamask mnemonic>"

Le .gitignore ignore déjà .env, mais puisque vous remplissez votre clé mnémonique/secrète ici, VEUILLEZ NE PAS le mettre  N'IMPORTE OÙ.

Lancer le réseau souhaité dans votre terminal séparée. Ensuite, vous pouvez utiliser votre portefeuille MetaMask pour vous connecter à un réseau de votre choix
Ensuite, migrez votre contrat vers des tableaux de bord à l'aide de:

truffle migrate --network [NETWORK NAME]

Le terminal indiquera que vos contrats ont été déployés.
Après avoir modifié le numéro de compte et le reseau , vous pouvez exécuter à nouveau le script pour tester : 

$ truffle exec scripts/run.js

Vous aurez besoin d'un compte comme Infura IPFS et d'une passerelle dédiée pour télécharger vos métadonnées NFT. 

Passons en revue les concepts et utilitaires Web3 que nous avons utilisés pour connecter notre front.

     web3Modal est une bibliothèque que nous utilisons pour récupérer le fournisseur de réseau de l'utilisateur
     ipfs-http-client est une bibliothèque que nous utilisons pour télécharger les métadonnées NFT sur IPFS
     web3 est une bibliothèque qui nous permet d'utiliser nos abstractions de contrats intelligents

Pour voir le front en action, utilisez simplement les scripts de nœud dans package.json. Exécutez 

$ npm run dev 

à partir du dossier client et votre site Web devrait apparaître sur http://localhost:3000/ !

Notez que le front utilisera le réseau et le compte définis sur votre extension MetaMask.

Ajouter votre réseau à MetaMask (dans notre exemple nous ajoutons Ganache):

Si vous souhaitez utiliser Ganache comme réseau, vous pouvez ajouter le réseau à votre portefeuille MetaMask avec les propriétés suivantes :

     Nom du réseau : Ganache
     Nouvelle URL RPC : http://127.0.0.1:7545
     ID de chaîne : 1337
     Symbole monétaire : ETH

Ensuite, importez un nouveau compte avec la clé privée que vous importez dans votre métamask. 

-----------------------------------------------------------------------------------------------------------------------------------------

5. Les tests:

Le contrat comprend un ensemble de tests unitaires écrits en JavaScript à l'aide de la bibliothèque d'assertions Chai et des utilitaires de test OpenZeppelin. Ces tests couvrent différents scénarios et garantissent le comportement attendu du contrat. Ils peuvent être exécutés à l'aide de Truffle ou d'un framework de test compatible. 

Rapports de Test: Après l'exécution des tests, des rapports détaillés sont générés pour fournir des informations sur les résultats des tests, les événements déclenchés et les erreurs éventuelles.

Avertissement: Les tests sont destinés à vérifier le bon fonctionnement du contrat. Assurez-vous d'exécuter ces tests uniquement dans un environnement de développement ou de test, et non sur le réseau Ethereum principal (Mainnet), car cela pourrait entraîner des frais de transaction réels.

-----------------------------------------------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------------------------------------