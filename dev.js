var plot = require('./modules/plot'),
    grammar = require('./modules/grammar'),
    race = require('./modules/character/race'),
    story = require('./index'),
    cfg = {"locale": "ruRU"},
    //Plot = new plot(),
    //Grammar = new grammar(),
    //Race = new race(),
    Story = new story(cfg);

//console.log(Story.grammar.toCase('молочный', 'в'));
console.log(Story.plot.name());
