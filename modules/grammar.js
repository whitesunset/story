/**
 * @class Grammar
 * @property parts[] - parts of speech
 */
var Grammar = function (cfg) {
    this.cfg = this.getCfg(cfg);
    this.parts = ['noun', 'pnoun', 'adj', 'verb', 'adverb', 'prep', 'conj', 'interj'];
}

module.exports = Grammar;

var _ = require('underscore'),
    random = require('../../forte/core'),
    defaults = require('../config/default.json'),
    Random = new random();


Grammar.prototype.getCfg = function (cfg) {
    return this.cfg = _.extend({}, this.cfg || defaults, cfg);
}

Grammar.prototype.invoke = function (func, args) {
    var localized = func + '_' + this.cfg.locale;
    if(typeof this[localized] === 'function'){
        return this[localized].apply(this, args);
    }
}

Grammar.prototype.parse = function (template) {
    var words = template.split(' ').map(function (word) {
        var parts = word.replace(/[\[\]]*/gi, '').split('|');
        return parts[0];
    });
    return words;
}

/**
 * Get random phrase
 * @param cfg
 * @param json
 */
Grammar.prototype.phrase = function (cfg, json) {
    this.cfg = this.getCfg(cfg);
    var noun = require('../data/dictionary/nouns/' + this.cfg['locale'] + '.json'),
        verb = require('../data/dictionary/verbs/' + this.cfg['locale'] + '.json'),
        adj =  require('../data/dictionary/adjectives/' + this.cfg['locale'] + '.json'),
        dictionary = {
            noun: noun,
            verb: verb,
            adj: adj
        },
        json = json || dictionary,
        templates = this.cfg['templates'],
        template = Random.array.item(templates),
        replacements = this.parse(template),
        result = '',
        words = [],
        self = this;

    replacements.forEach(function (item, i, arr) {
        if(_.contains(self.parts, item)){
            words.push(self[item](dictionary[item]));
        }
    });

    console.log(words)

    return result;
}

Grammar.prototype.adj = function (dictionary) {
    return this.invoke('adj', [dictionary]);
}
Grammar.prototype.adj_ruRU = function (dictionary) {
    return Random.array.item(dictionary);
}

Grammar.prototype.noun = function (dictionary) {
    return this.invoke('noun', [dictionary]);
}
Grammar.prototype.noun_ruRU = function (dictionary) {
    var genders = ['masculine', 'feminine', 'neuter', 'plural_only'],
        gender = Random.array.item(genders),
        nouns = dictionary[gender],
        result = {
            gender: gender,
            gnums: Random.array.item(nouns)
        };
    return result;
}

/**
 * Pluralize word
 * @returns {string|*}
 * @param {array} word_forms
 * @param {number} num
 */
Grammar.prototype.pluralize = function (word_forms, num) {
    this.invoke('pluralize', [word_forms, num]);
}

/**
 * Pluralize word in Russian
 * @param {array} word_forms
 * @param {number} num
 * @returns {*}
 */
Grammar.prototype.pluralize_ruRU = function(word_forms, num){
    var cases = array (2, 0, 1, 1, 1, 2);
    return word_forms[ (num % 100 > 4 && num  % 100 < 20) ? 2 : cases[min(num % 10, 5)] ];
}

/**
 * Pluralize word in English
 * @param word_forms
 * @returns {*}
 */

Grammar.prototype.pluralize_enUS = function (word_forms){
    var dictionary = require('../data/grammar/plural/enUS.json'),
        result = word_forms + dictionary['##default##'];
    if (dictionary[word_forms]) {
        result = dictionary[word_forms];
    }
    return result;
}

/**
 * Decline word to case
 * @param word
 * @param _case
 * @returns {*}
 */
Grammar.prototype.toCase = function (word, _case) {
    return this.invoke('toCase', [word, _case]);
    /*var localized = 'toCase_' + this.cfg.locale;
    if (typeof this[localized] === 'function') {
        return this[localized](word, _case);
    }*/
}

Grammar.prototype.toCase_enUS = function (word, _case) {


}
Grammar.prototype.toCase_ruRU = function (word, _case) {
    var strPub = { // правила для окончаний
            "а": ["ы", "е", "у", "ой", "е"],
            "(ш/ж/к/ч)а": ["%и", "%е", "%у", "%ой", "%е"],
            "б/в/м/г/д/л/ж/з/к/н/п/т/ф/ч/ц/щ/р/х": ["%а", "%у", "%а", "%ом", "%е"],
            "и": ["ей", "ям", "%", "ями", "ях"],
            "ый": ["ого", "ому", "%", "ым", "ом"],
            "й": ["я", "ю", "я", "ем", "е"],
            "о": ["а", "у", "%", "ом", "е"],
            "с/ш": ["%а", "%у", "%", "%ом", "%е"],
            "ы": ["ов", "ам", "%", "ами", "ах"],
            "ь": ["я", "ю", "я", "ем", "е"],
            "уль": ["ули", "уле", "улю", "улей", "уле"],
            "(ч/ш/д/т)ь": ["%и", "%и", "%ь", "%ью", "%и"],
            "я": ["и", "е", "ю", "ей", "е"]
        },
        cases = { // номера для падежей, не считая Именительный
            "р": 0,
            "д": 1,
            "в": 2,
            "т": 3,
            "п": 4
        },
        exs = { // исключения, сколько символов забирать с конца
            "ц": 2,
            "ок": 2
        },
        lastIndex, reformedStr, forLong, splitted, groupped, forPseudo;
    for (var i in strPub) {
        if (i.length > 1 && word.slice(-i.length) == i) { // для окончаний, длиной >1
            lastIndex = i;
            reformedStr = word.slice(0, -lastIndex.length);
            break;
        }
        else if (/[\(\)]+/g.test(i)) { // фича: группировка окончаний
            i.replace(/\(([^\(\)]+)\)([^\(\)]+)?/g, function (a, b, c) {
                splitted = b.split("/");
                for (var o = 0; o < splitted.length; o++) {
                    groupped = splitted[o] + c;
                    strPub[groupped] = strPub[i];
                    if (word.slice(-groupped.length) == groupped) {
                        for (var x = 0, eachSplited = strPub[groupped]; x < eachSplited.length; x++) {
                            eachSplited[x] = eachSplited[x].replace("%", splitted[o]);
                        }
                        reformedStr = word.slice(0, -groupped.length);
                        forPseudo = groupped;
                    }
                    ;
                }
                ;
            });
        }
        else { // дефолт
            lastIndex = word.slice(-1);
            reformedStr = word.slice(0, -(forPseudo || lastIndex).length);
        }
        if (/\//.test(i) && !(/[\(\)]+/g.test(i)) && new RegExp(lastIndex).test(i)) forLong = i; // группированные окончания, разделающиеся слешем
        for (var o in exs) { // поиск исключений
            if (word.slice(-o.length) == o)reformedStr = word.slice(0, -exs[o]);
        }
    };
    return reformedStr + strPub[(forPseudo || forLong || lastIndex)][cases[_case]].replace("%", lastIndex);
}