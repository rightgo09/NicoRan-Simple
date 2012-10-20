(function() {
  // メインカテゴリ組立
  buildMainCategory();

  // Google feedsライブラリ読み込み
  google.load('feeds', '1');

  // ページ上部カテゴリアンカー
  $('ul#gnav>li>a')
    // href="#"をセットしないとポインタがクリック可にならない
    .each(function () {
      $(this).attr('href', '#');
    })
    // 指定カテゴリのランキングを取得するイベントをbind
    .click(function () {
      buildSubCategory($(this).attr('id'));
      initialize($(this).attr('id'));
      return false; // for anchor
    })
  ;

  // デフォルトランキング表示
  google.setOnLoadCallback(initialize);
}());

MAX_RANKING_NUMBER = 100;

function categories() {
  return [
    { id: "all", name: "総合", snav: [] },
    { id: "g_ent2", name: "エンタメ・音楽", snav: [
      { id: "g_ent2", name: "合算" },
      { id: "ent", name: "エンターテイメント" },
      { id: "music", name: "音楽" },
      { id: "sing", name: "歌ってみた" },
      { id: "play", name: "演奏してみた" },
      { id: "dance", name: "踊ってみた" },
      { id: "vocaloid", name: "VOCALOID" },
      { id: "nicoindies", name: "ニコインディーズ" },
    ]},
    { id: "g_life2", name: "生活・一般・スポ", snav: [
      { id: "g_life2", name: "合算" },
      { id: "animal", name: "動物" },
      { id: "cooking", name: "料理" },
      { id: "nature", name: "自然" },
      { id: "travel", name: "旅行" },
      { id: "sport", name: "スポーツ" },
      { id: "lecture", name: "ニコニコ動画講座" },
      { id: "drive", name: "車載動画" },
      { id: "history", name: "歴史" },
    ]},
    { id: "g_politics", name: "政治", snav: [] },
    { id: "g_tech", name: "科学・技術", snav: [
      { id: "g_tech", name: "合算" },
      { id: "science", name: "科学" },
      { id: "tech", name: "ニコニコ技術部" },
      { id: "handcraft", name: "ニコニコ手芸部" },
      { id: "make", name: "作ってみた" },
    ]},
    { id: "g_culture2", name: "アニメ・ゲーム・絵", snav: [
      { id: "g_culture2", name: "合算" },
      { id: "anime", name: "アニメ" },
      { id: "game", name: "ゲーム" },
      { id: "toho", name: "東方" },
      { id: "imas", name: "アイドルマスター" },
      { id: "radio", name: "ラジオ" },
      { id: "draw", name: "描いてみた" },
    ]},
    { id: "g_other", name: "その他", snav: [
      { id: "g_other", name: "合算" },
      { id: "are", name: "例のアレ" },
      { id: "diary", name: "日記" },
      { id: "other", name: "その他" },
    ]},
  ];
}

function buildMainCategory() {
  var categories_json = categories();
  var $gnav = $('ul#gnav');
  $.each(categories_json, function (i, gnav) {
    $gnav.append('<li><a id="'+gnav.id+'">'+gnav.name+'</a></li>');
  });
  buildSubCategory();
}
function buildSubCategory(category) {
  category = category || 'all';
  var categories_json = categories();
  var $snav = $('ul#snav');
  $snav.empty();
  $.each(categories_json, function (i, gnav) {
    if (gnav.id === category) {
      $.each(gnav.snav, function (j, snav) {
        $snav.append('<li><a id="'+snav.id+'">'+snav.name+'</a></li>');
      });
      $('ul#snav>li>a')
        .each(function () {
          $(this).attr('href', '#');
        })
        .click(function () {
          initialize($(this).attr('id'));
          return false;
        })
      ;
      return false; // break
    }
  });
}

function initialize(category) {
  var feed = new google.feeds.Feed(rssUrl(category));
  feed.setNumEntries(MAX_RANKING_NUMBER);
  feed.load(function (result) {
    if (result.error) return;
    var $ul_main_movies = $('ul.main-movies');
    // カテゴリ変更時のために一度空にする
    $ul_main_movies.empty();
    for (var i = 0, len = result.feed.entries.length; i < len; i++) {
      var entry = result.feed.entries[i];
      $ul_main_movies.append(buildMovieBody(entry));
    }
  });
}

function buildMovieBody(entry) {
  var title = entry.title;
  var link = entry.link;
  var timestamp = extractTimestamp(entry.publishedDate);
  var content = entry.content;
  var postDate = extractPostDate(content);
  var playCount = extractPlayCount(content);
  var commentCount = extractCommentCount(content);
  var imgLink = extractImgLink(content);
  var description = extractDescription(content);
  var movieLength = extractMovieLength(content);
  var movieBody =
     '<h3><a href="'+link+'" target="_blank" class="movie-link" title="'+title+'">'+title+'</a></h3>'
    +'<ul class="movie-info">'
    +'<li class="tag" style="display:none"></li>'
    +'<li class="postdate">'+postDate+' 投稿</li>'
    +'<li class="playcount">再生数 '+playCount+'</li>'
    +'<li class="commentcount">コメント '+commentCount+'</li>'
    +'<li class="addbookmark" style="display:none"></li>'
    +'</ul>'
    +'<blockquote cite="'+link+'">'
    +'<div class="movie-image">'
    +'<div class="movie-length">'+movieLength+'</div>'
    +'<a class="capture" href="'+link+'"><img src="'+imgLink+'" alt="'+title+'" title="'+title+'" class="movie-image"></a>'
    +'</div>'
    +'<div style="overflow:auto;zoom:1">'+ellipsisDescription(description)
    +'<cite title="'+title+'"><a href="'+link+'" target="_blank" class="movie-link"> 続きを読む</a></cite>'
    +'</div>'
    +'</blockquote>';
  return '<li>'+movieBody+'</li>';
}
function extractTimestamp(publishedDate) {
  var pdate = new Date(publishedDate);
  var pyear = pdate.getFullYear();
  var pmonth = pdate.getMonth() + 1;
  var pday = pdate.getDate();
  var phour = pdate.getHours();
  var pminute = pdate.getMinutes();
  var psecound = pdate.getSeconds();
  return pyear+'/'+zeroPad(pmonth)+'/'+zeroPad(pday)+' '+zeroPad(phour)+':'+zeroPad(pminute)+':'+zeroPad(psecound);
}
function zeroPad(num) {
  return (+num < 10 ? "0" : "") + num;
}
function extractPostDate(content) {
  return content.match(/<strong>([^>]*)<\/strong> 投稿/)[1];
}
function extractPlayCount(content) {
  return content.match(/再生：<strong>([^>]*)<\/strong>/)[1];
}
function extractCommentCount(content) {
  return content.match(/コメント：<strong>([^>]*)<\/strong>/)[1];
}
function extractImgLink(content) {
  return content.match(/<img.*?src="(.*?)"/)[1];
}
function extractDescription(content) {
  return content.match(/<p>.*?<\/p>\W+<p>(.*?)<\/p>/)[1];
}
function ellipsisDescription(description) {
  var ellipsisLength = 147;
  if (description.length > ellipsisLength) {
    return description.substring(0, ellipsisLength)+'...';
  }
  else {
    return description;
  }
}
function extractMovieLength(content) {
  return content.match(/<strong>(\d+:\d+)<\/strong>/)[1];
}

function rssUrl(category) {
  category = category || 'all';
  return 'http://www.nicovideo.jp/ranking/fav/daily/'+category+'?rss=2.0&lang=ja-jp';
}
