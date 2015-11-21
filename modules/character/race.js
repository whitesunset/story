/** @class Race **/
var Race = function () {
    this.race = '';
}

module.exports = Race;

var random = require('../../../forte/core'),
    Random = new random(),
    defaults = require('../../config/default.json');

/**
 * Roll random race
 * @param cfg
 * @param json
 */
Race.prototype.roll = function (cfg, json) {
    cfg = cfg || defaults;
    var races = require('../../data/characters/races/' + cfg['locale'] + '.json');
    json = json || races;

    var setting = cfg['race']['setting'];
    var input = {
        type: 'array/item',
        values: json[setting]
    }

    this.race = Random.roll(input);
    return this.race;
}