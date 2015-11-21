var plot = require('./modules/plot'),
    grammar = require('./modules/grammar'),
    race = require('./modules/character/race'),
    story = require('./index'),
    Plot = new plot(),
    Grammar = new grammar(),
    Race = new race(),
    Story = new story({"locale": "ruRU"});

//console.log(Story.grammar.toCase({locale: 'ruRU'}));
console.log(Story.plot.name());
