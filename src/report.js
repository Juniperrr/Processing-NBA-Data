console.log('working');

nba = require('./nba');
hoffy = require('./hoffy');

function totalScore(team, data) {
    var buckets = hoffy.bucket(data, player => player.TEAM_CITY === team);
    return buckets[0].reduce((accum, player) => {return (accum + player.PTS)}, 0); 
}
function totalScoreObj(data) {
    teamCities = nba.getTeamCities(data);
    var teamScoreObj = {
        [teamCities[0]]: totalScore(teamCities[0], data),
        [teamCities[1]]: totalScore(teamCities[1], data),
    };
    return teamScoreObj;
}

function filter3pt(data) {
    const moreThanOne3pt = data.filter((currPlayer) => currPlayer.FG3A > 1);
    return moreThanOne3pt;
}

function topThree(data) {
    var filteredArr = filter3pt(data).sort((prevPlayer, currPlayer) =>  currPlayer.FG3_PCT - prevPlayer.FG3_PCT);
    return filteredArr.slice(0, 3);
}

function processInput(json){
    var headers = json.resultSets[0].headers;
    var rows = json.resultSets[0].rowSet;
    var data = hoffy.rowsToObjects({headers, rows});
    teamCities = nba.getTeamCities(data);
    console.log("* The score was:", totalScoreObj(data));
    console.log("* The best passer was:", nba.bestPasser(data).PLAYER_NAME, "with", nba.bestPasser(data).AST, "assists.");
    console.log("* The rebouds per team were:", nba.reboundTotals(data));
    console.log("* The vest 3-point shooters were: ");
    console.log("1.", topThree(data)[0].PLAYER_NAME + ":", topThree(data)[0].FG3_PCT);
    console.log("2.", topThree(data)[1].PLAYER_NAME + ":", topThree(data)[1].FG3_PCT);
    console.log("3.", topThree(data)[2].PLAYER_NAME + ":", topThree(data)[2].FG3_PCT);
}

var filePath = process.argv[2];
console.log(filePath);
if (filePath !== undefined) {
    fileReadFn = hoffy.readAndExtractWith(JSON.parse);
    fileReadFn(filePath, output => processInput(output), null);
}