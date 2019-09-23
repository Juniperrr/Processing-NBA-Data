// nba.js
hoffy = require('./hoffy');
function bestPasser(data) {
    var best_passer = data.reduce((prevHighest, currPlayer, idx, data) => {
        if (prevHighest.AST < currPlayer.AST) {
            prevHighest = currPlayer;
        }
        return prevHighest;
    });
    return best_passer;
}

function getTeamCities(playerStatArr) {
    var teamsArr = playerStatArr.map(player => player.TEAM_CITY);
    return Array.from(new Set(teamsArr));
}
function teamRebounds(team, data) {
    var buckets = hoffy.bucket(data, player => player.TEAM_CITY === team);
    return buckets[0].reduce((accum, player) => {return (accum + player.REB)}, 0); 
}
function reboundTotals(data) {
    var teamCities = nba.getTeamCities(data);
    var reboundTotals = {
        [teamCities[0]]: teamRebounds(teamCities[0], data),
        [teamCities[1]]: teamRebounds(teamCities[1], data),
    };
    return reboundTotals;
}

/*
function bucket(arr, fn) {
    const tru = arr.filter(fn);
    const fal = arr.filter(val => fn(val) === false);
    return [tru,fal];
}
*/
module.exports = {
    bestPasser: bestPasser,
    getTeamCities: getTeamCities,
    teamRebounds: teamRebounds,
    reboundTotals: reboundTotals,
}