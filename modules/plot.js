/** @class Plot **/
var Plot = function (cfg) {
    var Random = new random(),
        Grammar = new grammar(cfg);
    this.cfg = this.getCfg(cfg);
    this.grammar = new grammar(this.cfg);
}

module.exports = Plot;

var _ = require('underscore'),
    random = require('../../forte/core'),
    grammar = require('./grammar')
    defaults = require('../config/default.json');


Plot.prototype.getCfg = function (cfg) {
    return this.cfg = _.extend({}, this.cfg || defaults, cfg);
}

/**
 * Roll random genre
 * @param cfg
 * @param json
 */
Plot.prototype.genre = function (cfg, json) {
    cfg = cfg || defaults;
    var genres = require('../../data/plot/genres/' + cfg['locale'] + '.json');
    json = json || genres;

    var input = {
        type: 'object/item',
        values: json
    }

    this.genre = Random.roll(input);
    return this.genre;
}

Plot.prototype.name = function (cfg, json) {
    cfg = this.getCfg(cfg);
    cfg['templates'] = cfg['story']['name']['templates'];
    return this.grammar.phrase(cfg, json);
}