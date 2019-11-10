/**
 * @class Hatena
 */

function Hatena($elem) {
  this.$elem = $elem;
  this.tag   = 'li';
  this.sort  = 'count';

  this.init.apply(this);
}
Hatena.URL = 'https://log.chocolateboard.net';
Hatena.prototype = {

  init: function() {
    this.loadEntries();
  },

  loadEntries: function() {
    var _this = this;
    var d = $.Deferred();

    $.ajax({
      type: 'GET',
      url:  'https://b.hatena.ne.jp/entrylist/json',
      data: {
        sort: _this.sort,
        url: Hatena.URL
      },
      dataType: 'jsonp',
      jsonp : 'callback',
      success: function(data) {
        _this.appendHtml(_this.$elem, _this.setDataForEachEntries(data));
        d.resolve();
      },
      error: function(e) {
        console.log(e);
      }
    });
    return d.promise();
  },

  setDataForEachEntries: function(entries) {
    var _this = this;
    var htmlTag = _this.tag;
    var title, link, count, htmlSrc;
    var newCommers = [];

    if(entries.length <= 0) return;

    $.each(entries, function(index, entry){
      title = entry.title;
      link  = entry.link;
      count = entry.count;

      htmlSrc  = '<' + htmlTag + '>';
      htmlSrc += '<a href="' + link + '">';
      htmlSrc += title;
      htmlSrc += '</a>';
      htmlSrc += ' (B! :: ' + count + ') ';
      htmlSrc += '</' + htmlTag + '>';

      newCommers.push(htmlSrc);
    });

    return newCommers;
  },

  appendHtml: function($elem, htmlSrcArray) {

    if(htmlSrcArray.length <= 0) return;
    $.each(htmlSrcArray, function(index, htmlSrc){
      $elem.append(htmlSrc);
    });
  }
};

// export
module.exports = Hatena;
