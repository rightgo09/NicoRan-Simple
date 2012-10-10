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
