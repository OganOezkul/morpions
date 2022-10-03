// false -> le tours au joueur 1
// true -> le tours au joueur 2
var tours = false;

// afin de pouvoir identifier quel joueur a placé l'élément dans la case
// 0xaa -> joueur 1
// 0xff -> joueur 2
var joueurID = 0;

// juste pour façiliter le codage
const JOUEUR_1_ID = 0xaa;
const JOUEUR_2_ID = 0xff;

// les points
var joueur1Points = 0;
var joueur2Points = 0;

// le nombre de clique fait par les deux joueurs combinés
var joueursCoups = 0;

// es - ce que la partie à commencé
// true -> oui
// false -> faux
var jeuCommence = true;

// afin de pouvoir vérouiller la case déjà utilisée par un des deux joueurs
// morpionCases[y][x][1] -> qui a posé la case!
// morpionCases[y][1][x] -> si une case est posée ou pas
var morpionCases =
[
    [[false, 0], [false, 0], [false, 0]],
    [[false, 0], [false, 0], [false, 0]],
    [[false, 0], [false, 0], [false, 0]]
];

function resetGame()
{
    // nettoyer tout le tableau des cases
    for (i = 0; i < morpionCases.length; i++)
     {
         morpionCases[i][0][0] = false;
         morpionCases[i][0][1] = 0;
         morpionCases[i][1][0] = false;
         morpionCases[i][1][1] = 0;
         morpionCases[i][2][0] = false;
         morpionCases[i][2][1] = 0;
     }
    
    // terminer la partie!
    jeuCommence = false;
    
    // remttre le compteur de clique à 0
    joueursCoups = 0;
}

// méthode qui va permettre d'afficher un écran
function matchNulleScreen()
{
    let matchNulleParagraph = document.createElement("h2");
    matchNulleParagraph.innerHTML = "Match Nulle!";
    
    // un bouton qui permettera au joueur de recommencer la partie
    let restartButton = document.createElement("button");
    restartButton.textContent = "Faire une autre partie";
    
    // lorsque l'utilisateur appuis sur le boutton
    $(restartButton).click(function(){ 
        // retirer les elements en question
        document.body.removeChild(matchNulleParagraph);
        document.body.removeChild(restartButton);
        
        // retirer tout les classes de tout les cases
        $("td").removeAttr("class");
        
        // recommencer une nouvelle partie
        jeuCommence = true;
    });
    
    document.body.append(matchNulleParagraph);
    document.body.append(restartButton);
    
    resetGame();
    
}

// pour afficher le message comme quoi le joueur à gagné
function winningScreen(joueur)
{
    // un text H2 qui sera ajouté dans la page
    let winningParagraph = document.createElement("h2");
    winningParagraph.innerHTML = (joueur == JOUEUR_1_ID ? "Joueur 1" : "Joueur 2") + " a gagné!";
    
    // un bouton qui permettera au joueur de recommencer la partie
    let restartButton = document.createElement("button");
    restartButton.textContent = "Faire une autre partie"
    
    // lorsque l'utilisateur appuis sur le boutton
    $(restartButton).click(function(){ 
        // retirer les elements en question
        document.body.removeChild(winningParagraph);
        document.body.removeChild(restartButton);
        
        // retirer tout les classes de tout les cases
        $("td").removeAttr("class");
        
        // recommencer une nouvelle partie
        jeuCommence = true;
    });
    
    // ajouter les elements sur la page
    document.body.append(winningParagraph);
    document.body.append(restartButton);
    
    resetGame();
    
    if (joueur == JOUEUR_1_ID) { joueur1Points++; }
    else { joueur2Points++; }
}

$(function(){
    
    // quand le gars clique sur une des cellules du tableau
    $("td").click(function(){
        
        // de 0 à 2
        let Ligne = $(this).parent().index();   // recuperer la ligne
        let Colonne = $(this).index();          // recupere la colonne
        
        if (morpionCases[Ligne][Colonne][0] == false)
        {            
            if (jeuCommence == true)
            {
                joueursCoups++;
                
                // ajout de la classe dependant du tous
                if (tours == false) { $(this).addClass("rond symbole_0"); }
                else { $(this).addClass("croix symbole_1"); }
                
                // afin que le joueur ne puisse pas cliquer deux fois sur une même case
                // ainsi que déterminer qui a posé la case
                morpionCases[Ligne][Colonne][0] = true;
                if (tours == false) { morpionCases[Ligne][Colonne][1] = JOUEUR_1_ID; }
                else { morpionCases[Ligne][Colonne][1] = JOUEUR_2_ID; }

                // si faux -> vrai
                // autrement -> faux
                tours = (tours == true ? false : true);

                // juste pour éviter defaire tout ces tests a chaque fois que l'user clique
                if (joueursCoups >= 5)
                {
                    // faire le control
                    // 1) la ligne
                    if 
                    (
                        (morpionCases[Ligne][0][1] != 0) &&
                        (morpionCases[Ligne][1][1] == morpionCases[Ligne][0][1] && morpionCases[Ligne][2][1] == morpionCases[Ligne][1][1])   
                    )
                    {
                        winningScreen(morpionCases[Ligne][0][1]);
                    }
                    else
                    {
                        // 2) contrôle de la colonne
                        if 
                        (
                            (morpionCases[0][Colonne][1] != 0) &&
                            (morpionCases[1][Colonne][1] == morpionCases[0][Colonne][1] && morpionCases[2][Colonne][1] == morpionCases[1][Colonne][1])
                        )
                        {
                            winningScreen(morpionCases[0][Colonne][1]);
                        }
                        else
                        {
                            // 3) contrôle de la diagonale
                            if 
                            (
                                (
                                    (morpionCases[0][0][1] != 0) &&
                                    (morpionCases[1][1][1] == morpionCases[0][0][1] && morpionCases[2][2][1] == morpionCases[1][1][1])
                                ) ||
                                (
                                    (morpionCases[0][2][1] != 0) &&
                                    (morpionCases[1][1][1] == morpionCases[0][2][1] && morpionCases[2][0][1] == morpionCases[1][1][1])
                                )
                            )
                            {
                                // pourquoi cette case - là?
                                // c'est simple. pour faire un diagonal dans le morpion. Il y a forcément un joueur qui a cliqué ici. c'est à dire au milieu de la grille
                                winningScreen(morpionCases[1][1][1]);
                            }
                        }
                    }
                    
                    if (joueursCoups >= 9)
                    {
                        // match nul
                        // vue que le joueur aurait cliqué sur tout les cases sans avoir gagné
                        matchNulleScreen();
                    }
                }
            }
        }
    });
});