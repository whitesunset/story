var Story = function (cfg) {
    var Grammar = new grammar(cfg),
        Plot = new plot(cfg);
    this.cfg = cfg || defaults;
    this.plot = Plot;
    this.grammar = Grammar;
}
module.exports = Story;

var defaults = require('./config/default.json'),
    grammar = require('./modules/grammar'),
    plot = require('./modules/plot');

Story.prototype.getLocale = function () {
    return this.cfg.locale;
}