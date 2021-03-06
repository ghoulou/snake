window.onload = function() { // Un gestionnaire d'évènement pour l'évènement load (chargement) de la fenêtre.
                            // Cela permet d'empêcher l'exécution du code avant le chargement complet de tous les éléments de la page.
                       

    // on crée la variable canvas en dehors de la méthode init pour qu'elle puisse avoir une portée plus large que celle de la fonction init
    var canvasWidth= 900;  // La largeur de notre canvas
    var canvasHeight = 600; // La hauteur de notre canvas
    var blockSize = 30; // la largeur d'un block qui correspond au block du canvas ou du serpent
    var ctx; // je créer la variable contexte pour pouvoir l'utiliser ensuite
    var delay = 1000; // exprimé en millisecondes (1 seconde)
    // var xCoord = 0; // (x) horizontal : de base il est tout à gauche
    // var yCoord = 0; // (y) vertical ; de base il est tout en haut
    var snakee; // cette variable représente le serpent. L'objectif est de pouvoir l'utiliser dans toutes les méthodes (qu'elle ait une portée "globale"?)

    init(); // ici on exécute la fonction crée en dessous
        
    function init(){ // on appelle et on créer la fonction init

        // le canvas est la zone dans lequel le jeu va se dérouler
        // on utilise la méthode creatElement pour créer le canvas dynamiquement
        // le canvas est désormais un élément du DOM 
        // https://developer.mozilla.org/fr/docs/Web/API/Document/createElement (ALT + CLICK POUR SUIVRE DIRECT LE LIEN)
        // Dans un document HTML, la méthode  document.createElement() crée un élément HTML du type spécifié par  tagName
        // exemple : var element = document.createElement(tagName[, options]);
        var canvas = document.createElement('canvas'); 
    
        canvas.width = canvasWidth; // on définit largeur du canvas 
        canvas.height = canvasHeight; // on définit la hauteur du canvas
        canvas.style.border = "1px solid"; // on ajoute un bordure au canvas pour pouvoir mieux la visualiser
        document.body.appendChild(canvas); // ICI on RELIE le Canvas et le html (document) via le body
        ctx = canvas.getContext('2d'); // Je met le contexte en 2d ( il y a 4 possibilités mais ici on choisis 2d) https://developer.mozilla.org/fr/docs/Web/API/HTMLCanvasElement/getContext
        snakee = new Snake([[6,4],[5,4],[4,4],[3,4]] , "right") // Le body [] est le corps complet du serpent qui est représenté par 3 blocks. le 1er crochet représente le canvas et les crochets chaque block
        refreshCanvas(); // on appelle la fonction refreshCanvas pour la charger
   
    }

    function refreshCanvas() { // à chaque seconde on appelle la fonction refreshCanvas qui va permettre de faire bouger le snake par défaut
        
        
         // xCoord += 2; // valeur horizontal ( direction vers laquelle le serpent va se deplacer)
         // yCoord += 2; // valeur vertical : si on met par exemple le yCoord à 0, le block ne se déplacera que sur le xCoord !!

        // A chaque fois qu'une seconde passe ( 1000 milisecondes) on va le mettre dans une nouvelle position
        // ici on efface toute la largeur et la hauteur du canvas
        // https://developer.mozilla.org/fr/docs/Web/API/CanvasRenderingContext2D/clearRect (ALT + CLICK POUR SUIVRE DIRECT LE LIEN)
        ctx.clearRect(0,0, canvasWidth, canvasHeight);

        snakee.advance();
        // Ici la couleur de mon serpent
        // https://developer.mozilla.org/fr/docs/Tutoriel_canvas/Ajout_de_styles_et_de_couleurs (ALT + CLICK POUR SUIVRE DIRECT LE LIEN)
        //  ctx.fillStyle = "#3465A4"; 

        // (x, y, largeur, hauteur) x = horizontal, y = vertical, puis determiner la largeur et hauteur du block serpent
        // xCoord et yCoord sont les coordonnées du serpent dont les valeurs vont bouger à chaque fois que le canvas va être refresh
        // https://developer.mozilla.org/fr/docs/Web/API/CanvasRenderingContext2D/fillRect (ALT + CLICK POUR SUIVRE DIRECT LE LIEN)
        //  ctx.fillRect(xCoord, yCoord, 200, 30); 


        snakee.draw(); // Je veux que mon serpent se dessine 
        // setTimeout permet de définir un « minuteur » (timer) qui exécute une fonction ou un code donné après la fin du délai indiqué.
        // Execute moi refreshCanvas à chaque fois qu'un certain délai est passé (ici delay = 1000 milisecondes)
        // https://developer.mozilla.org/fr/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout
        setTimeout(refreshCanvas, delay);
    }

    function drawBlock(ctx,position) {
        // le canvas on ne lui parle pas en terme de block (il ne comprend notre définition de block), il comprend que les pixels
        // https://developer.mozilla.org/fr/docs/Web/API/CanvasRenderingContext2D/fillRect
        // ctx.fillRect(x, y, largeur, hauteur);
        var x = position[0] * blockSize; // la position de la longueur c'est le x de notre block * la taille de chaque block. position[0] c'est l'index du tableau qui stocke la longueur du block
        var y = position[1] * blockSize;
        ctx.fillRect(x, y, blockSize, blockSize); // ici on veut remplir le rectangle. ce rectangle fera une taille de la taille de nos blocksizes
    }

    // Je crée une fonction pour créer le serpent avec en parametre son body ( le prototype de notre serpent, si jamais on voulait en avoir plusieurs)
    // body = corps du serpent
    function Snake(body, direction) { // body represente le carré du snake rien à voir <body>
        this.body = body; 
        // Rappel sur this :
        // https://github.com/O-clock-Alumni/fiches-recap/blob/master/js/this.md (ALT + CLICK POUR SUIVRE DIRECT LE LIEN)
        // https://www.youtube.com/watch?v=IudrkWwOw8Y (ALT + CLICK POUR SUIVRE DIRECT LE LIEN)
        // Quand tu fais un console.log(this) ça te renvoie window, la valeur de l'objet global
        // this : lorsqu'il appelé dans une fonction ou appelé globalement fait référence à l'objet global
        // La valeur de this change si on l'appelle dans une methode ( methode = une fonction dans un objet )
        // this lorsqu'il est appelé dans une methode d'un objet this vaut alors la valeur de l'objet
        this.direction = direction;
        this.draw = function() { // methode qui permettra de dessiner le corps de notre serpent dans le canvas
            
            // save() ---> Sauvegarde l'état du canevas dans sa globalité
           
            // Les états du canvas sont stockés dans une pile. 
            // Chaque invocation de la méthode save() ajoute une copie de l'état courant  du canvas en haut de la pile.
            // La méthode save() peut être invoquée autant de fois que nécessaire. 
            // Chaque appel de restore() enlève le dernier état sauvegardé de la pile et tous les paramètres sauvegardés sont restaurés.
            ctx.save(); // sauvegarder le contexte du canvas cad son contenu comme il était avant que je commence à rentrer dans cette fonction
            ctx.fillStyle = "#3465A4"; 
            // Pour rappel : le corps du serpent est un ensemble de petits blocks, ces blocks sont définis par son body
            // chaque block a un X et un Y que nous allons mettre dans des tableaux
            // chaque block ( du corps du serpent) sera un tableau avec deux valeurs son X et son Y
                // tant que le i est inferieur à la longueur du corps du serpent
                // ( body est un array donc on peut utiliser la proprité length )
                // ce for permettra de passer sur chacun des membres du body du serpent
                for(var i = 0; i < this.body.length; i++) { 

                    // La variable this a comme valeur l’objet qui est en train d’être construit.

                    // permet de dessiner un block, (contexte du canvas dans lequel elle doit dessiner, et la position du block à dessiner )
                    // On veut passer sur chacun des blocks du body
                    // Au debut de la boucle i = 0, ensuite i = 1, i= 2 etc .. jusqu'a 3 ( le nombre de nos blocks dans le body du serpent)
                    drawBlock(ctx, this.body[i]); 

            }
            ctx.restore()  // restore() ---> Restore le plus récent état sauvegardé du canevas.
        };
        
        this.advance = function() {// fonction pour le faire avancer 
        // On duplique la tete et on enleve le dernier element du corps ( la queue ) pour le faire déplacer 

        var nextPosition = this.body[0].slice(); // slice permet de copier un element
            switch(this.direction)
            {
                case "left":
                    break;
                case "droite":
                    break;
                case "down":
                    break;
                case "up":

            }
        this.body.unshift(nextPosition) //permet de rajouter ce qu'il y a entre parenthese (ici nextPosition) à la premiere place
        this.body.pop(); // pop permet de supprimer le dernier element d'un array

    };

    }
}
