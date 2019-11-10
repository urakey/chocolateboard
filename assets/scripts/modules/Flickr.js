/**
 * @class Flickr
 */

function Flickr($elem) {
  this.$elem = $elem;
  this.tag   = 'li';

  this.options = {
    size: 'medium',
    sort: 'date-taken-desc',
    tags: ['instagram','Instagram'],
    per_page: 60
  };

  this.init.apply(this);
}
Flickr.USER_ID = '97236009@N03';
Flickr.API_KEY = '8f313ebf61928276db22daf2b929c54c';
Flickr.prototype = {

  init: function() {
    var suffix  = this.setPhotoSuffix(this.size);
    this.loadPhotos(this.$elem, suffix);
  },

  loadPhotos: function($elem, suffix) {
    var _this = this;
    var d     = $.Deferred();
    var data  = {
      format: 'json',
      method: 'flickr.photos.search',
      user_id: Flickr.USER_ID,
      api_key: Flickr.API_KEY
    };

    data = $.extend(data, _this.options);

    $.ajax({
      type: 'GET',
      url: 'https://www.flickr.com/services/rest/',
      data: data,
      dataType: 'jsonp',
      jsonp: 'jsoncallback'
    })
    .done(function(data) {
      if (data.stat == 'ok') {
        if(data.photos.length <= 0) return;
        _this.appendHtml($elem, _this.formatHtml(data, suffix));
      }
      d.resolve();
    })
    .fail(function(xhr, status, error) {
      console.log(xhr, status, error);
    });
    return d.promise();
  },

  formatHtml: function(data, suffix) {
    var photos  = data.photos;
    var htmlTag = this.tag;
    var id, owner, secret, server, farm, title, ispublic, isfriend, isfamily;
    var link, imgPath, tmpHtmlSrc;
    var htmlSrc = '';

    $.each(photos.photo, function(index, item){
      id       = item.id;
      owner    = item.owner;
      secret   = item.secret;
      server   = item.server;
      farm     = item.farm;
      title    = item.title;
      ispublic = item.ispublic;
      isfriend = item.isfriend;
      isfamily = item.isfamily;

      link = 'https://www.flickr.com/photos/' + owner + '/' + id + '/';
      imgPath = 'https://farm' + farm + '.static.flickr.com/' + server + '/' + id + '_' + secret + suffix + '.jpg';

      tmpHtmlSrc  = '<' + htmlTag + '>';
      tmpHtmlSrc += '<a href="' + link + '" target="_blank">';
      tmpHtmlSrc += '<img src="' + imgPath + '" alt="' + title + '">';
      tmpHtmlSrc += '</a>';
      tmpHtmlSrc += '</' + htmlTag + '>';

      htmlSrc += tmpHtmlSrc;
    });

    return htmlSrc;
  },

  appendHtml: function($elem, htmlSrc) {
    if(!htmlSrc) return;
    $elem.append(htmlSrc);
  },

  setPhotoSuffix: function(size) {
    var suffix;

    switch(size) {
      case 'square':
        suffix = '_s';
        break;
      case 'large_square':
        suffix = '_q';
        break;
      case 'thumbnail':
        suffix = '_t';
        break;
      case 'small':
        suffix = '_m';
        break;
      case 'small_320':
        suffix = '_n';
        break;
      case 'medium_640':
        suffix = '_z';
        break;
      case 'medium_800':
        suffix = '_c';
        break;
      case 'large':
        suffix = '_b';
        break;
      case 'original':
        suffix = '_o';
        break;
      default:
        suffix = '';
        break;
    }

    return suffix;
  }
};

// export
module.exports = Flickr;
