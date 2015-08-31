# Applegrams

Multiplayer game where you must constantly modify and reaarange your board to make words. Purplish-red tiles indicate a legal scrabble word (both horizontally and vertically where applicable). Light blue tiles indicate a vertically invalid scrabble word. Light orange tiles indicate a horizontally invalid scrabble word.

Each game begins with a pool of 144 tiles and each player is randomly given 7 starting tiles. To move a tile, click on the tile and then click on the destination where you want the tile placed. When any player arranges all his/her tiles in valid order, 1 additional tile will be allocated to each player. Triple click on any tile to exchange it for three randomly generated letters from the tile pool. Once the remaning tile pool is less than the amount of players, the first person to arrange a connected, valid scrabble board WINS!!!

Currently supports multiplayer mode of up to 10 players. The first player to join the game will be given host privileges.

Live app: https://applegrams2.herokuapp.com/


Github soruce for local host 3000
npm install
node app.js
