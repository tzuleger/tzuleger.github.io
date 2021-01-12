const GENERATING = true;

const HEADER_CSS_CLASS = "trt-header-main";
const IMAGE_PATH = "../imgs/"
const STORY_PATH = "../stories/"

const ELEMENTS_TO_REMOVE_WHEN_GENERATING = [ "require-js", "require-config", "init-script", "init-method" ];
const ELEMENTS_TO_REMOVE_WHEN_NOT_GENERATING = [ "carousel-script" ]

var imgMap = new Map();
var carouselMap = new Map();

var storiesData = new Map();
var json = { };
var idx = 2;

function init(fileName, toGenerate)
{
  require(['text!../json/' + fileName + '.json'], function(data)
  {
    json = JSON.parse(data)

    alertbanner();
    if(GENERATING)
    {
      carousel_init();
    }
    carousel();
    header();

    navbar();
    articles();
    stories();

    footer();

    setTimeout(finishUp, 3000);
  });
}

function finishUp()
{
  if(GENERATING)
  {
    for(var i = 0; i < ELEMENTS_TO_REMOVE_WHEN_GENERATING.length; ++i)
    {
      document.getElementById(ELEMENTS_TO_REMOVE_WHEN_GENERATING[i]).remove();
    }
    console.log(document.documentElement.innerHTML);
  }
  else
  {
    for(var i = 0; i < ELEMENTS_TO_REMOVE_WHEN_NOT_GENERATING.length; ++i)
    {
      document.getElementById(ELEMENTS_TO_REMOVE_WHEN_NOT_GENERATING[i]).remove();
    }
  }
}

function alertbanner()
{
  if(json.alertbanner.enabled)
  {
    document.getElementById('alertbanner').style.display = "block";
    document.getElementById('alert-banner-info').append(document.createTextNode(json.alertbanner.text.substring(0, 110))); // max of 110 characters
    document.getElementById('alert-banner-info').setAttribute("href", json.alertbanner.src);
    document.getElementById('navbar').style = "top:70px;"
  }
  else
  {
    document.getElementById('alertbanner').style.display = "none";
    document.getElementById('navbar').style.top = "0px;"
  }
}

function carousel_init()
{
  var script = document.getElementById('carousel-script');
  var s = '[ '
  for(var i = 0; i < Object.keys(json.header.images).length; ++i)
  {
    s += '{img:"' + json.header.images[i].src + '", x:' + json.header.images[i].x_position + ', y:' + json.header.images[i].y_position + '}';
    if((i+1) < Object.keys(json.header.images).length)
    {
      s += ', '
    }
  }
  script.prepend('carousel();\n\t\t');
  script.prepend('var idx = carouselList.length-1;\n\t\t')
  script.prepend('\n\t\tconst carouselList = ' + s + ' ];\n\t\t');
}

function carousel()
{
  var header = document.getElementsByClassName(HEADER_CSS_CLASS)[0];
  var numImages = Object.keys(json.header.images).length;

  idx = (++idx >= numImages) ? 0 : idx;
  img = json.header.images[idx].src;

  header.style.backgroundPosition = json.header.images[idx].x_position + "% " + json.header.images[idx].y_position + "%";
  header.style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('../imgs/" + img + "')";

  setTimeout(carousel, getTime(numImages) * 1000);
}

function getTime(numImages)
{
  // return a time between 1-7 based on how many images are in the carousel.
  return ((7 - (numImages / 5)) < 1) ? 1 : (7 - (numImages / 5));
}

function header()
{
  document.title = json.header.title;
  document.getElementById('subject').append(document.createTextNode(json.header.subject));
}

function navbar()
{
  if(json.navbar[0] == "sticky")
  {
    document.getElementById("navbar").style = "position:sticky;position:-webkit-sticky;top:90px;height:50px;";
  }
  Object.keys(json.navbar.navitems).forEach // for every nav item that was listed in the navbar section of the json file.
  (
    key =>
    {
      var val = json.navbar.navitems[key];
      var contents =
        (val.justification == "left") ? document.getElementById("left-navbar").getElementsByClassName("justify")[0] :
        (val.justification == "center") ? document.getElementById("center-navbar").getElementsByClassName("justify")[0] :
        (val.justification == "right") ? document.getElementById("right-navbar").getElementsByClassName("justify")[0] :
        "DEFAULT";

      if(contents == "DEFAULT")
      {
        contents = document.getElementById("left-navbar").getElementsByClassName("justify")[0];
      }

      if(val.input == "notype")
      {
        // handle the nav item being a no type.
        createNavItem(contents, key, val, "notype");
      }
      else if((typeof val.input) === "object" && (val.input != null))
      {
        // handle the nav item being a dropdown list
        createNavItem(contents, key, val, "dropdown");
      }
      else
      {
        // handle the nav item being a regular button
        createNavItem(contents, key, val, "button");
      }
    }
  );
}

function articles()
{
  if(!json.body.articles)
  {
    return;
  }
  Object.keys(json.body.articles).forEach
  (
    key =>
    {
      var val = json.body.articles[key];
      var art = document.createElement("article");

      var div = document.createElement("div");
      div.setAttribute("class", "article-box");
      div.setAttribute("id", key);
      div.style = "background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1))" + (val.img ? (", url(../imgs/" + val.img) : "") + ");";
      imgMap.set(key, val.img);
      div.onmouseenter = mouseOnArticle;
      div.onmouseleave = mouseOffArticle;
      div.setAttribute('onmouseenter', 'mouseOnArticle(this)');
      div.setAttribute('onmouseleave', 'mouseOffArticle(this)');
      div.setAttribute('onclick', 'window.location.href = ".' + val.input + '";');

      var title = document.createElement("h1");
      title.setAttribute("class", "article-title");
      title.append(document.createTextNode(val.title));
      div.append(title);

      var summary = document.createElement("h2");
      summary.setAttribute("class", "article-summary");
      summary.append(document.createTextNode(val.summary));
      div.append(summary);

      var description = document.createElement("h3");
      description.setAttribute("class", "article-description");
      description.append(document.createTextNode(val.description));
      div.append(description);

      art.append(div);
      document.getElementById("articles").append(art);
    }
  );
  var script = document.getElementById('article-hover');
  imgMap.forEach
  (
    function(value, key)
    {
      script.prepend(document.createTextNode('imgMap.set("' + key + '", "' + imgMap.get(key) + '");\n\t\t'));
    }
  )
  script.prepend(document.createTextNode('imgMap = new Map();\n\t\t'));
  script.prepend(document.createTextNode('\nconst IMAGE_PATH = "../imgs/";\n\t\t'));
}

function stories()
{
  var storiesDivs;
  if(!json.body.stories)
  {
    return;
  }
  if(json.body.stories.numColumns > 1)
  {
    for(var i = 0; i < json.body.stories.numColumns; ++i)
    {
      var newDiv = document.createElement('div');
      newDiv.setAttribute('class', 'story-bg');
      newDiv.setAttribute('style', 'float:left;width:calc(' + (1 / json.body.stories.numColumns)*100 + '% - 100px);');
      document.getElementById('stories').append(newDiv);
    }
    storiesDivs = document.getElementById('stories').getElementsByClassName('story-bg');
  }
  else
  {
    var newDiv = document.createElement('div');
    newDiv.setAttribute('class', 'story-bg');
    document.getElementById('stories').append(newDiv);
    storiesDivs = document.getElementById('stories').getElementsByClassName('story-bg');
  }

  Object.keys(json.body.stories).forEach(
    storyKey =>
    {
      if(storyKey != 'numColumns')
      {
        var storiesDiv = storiesDivs[(json.body.stories.numColumns > 1) ? json.body.stories[storyKey].colNum-1 : 0]
        var storySpan = document.createElement('span');
        storiesDiv.append(storySpan);

        var title = document.createElement('h1');
        title.setAttribute('class', 'story-title');
        title.append(json.body.stories[storyKey].title);
        storySpan.append(title);
        if(json.body.stories[storyKey].text.startsWith('!raw'))
        {
          // raw text, instead of a text file
        }
        else
        {
          require(['text!../stories/' + storyKey + '.txt'], function(story)
          {
            var text = document.createElement('p');
            text.setAttribute('class', 'story-text');

            images = story.match(/<SRC:.*>/g);
            if(images)
            {
              images.forEach(
                imageTag =>
                {

                  var formattedImageTag = imageTag.replace('<SRC:', '');
                  formattedImageTag = formattedImageTag.replace('>', '');
                  if(formattedImageTag in json.body.stories[storyKey].imgs)
                  {
                    var imgJsonData = json.body.stories[storyKey].imgs[formattedImageTag];
                    var img = document.createElement('img');
                    img.setAttribute('id', formattedImageTag);
                    img.setAttribute('style', 'width:' + imgJsonData.width + 'px;height:' + imgJsonData.height + 'px;');
                    img.setAttribute('src', '../imgs/' + imgJsonData.src);
                    img.setAttribute('align', imgJsonData.alignment);
                    img.setAttribute('hspace', '10;');
                    img.setAttribute('vspace', '10;');
                    text.append(img);
                  }
                  story = story.replace(imageTag, '');
                }
              )
            }
            text.append(story);
            storySpan.append(text);
          });
        }
      }
    }
  );
}

function footer()
{
  document.getElementById('footer-logo').src = IMAGE_PATH + json.footer.logo;
  document.getElementById('copyright').append(document.createTextNode(json.footer.copyright));

  var infoItems = json.footer.infoItems;
  Object.keys(infoItems).forEach
  (
    key =>
    {
      var div = document.getElementById("footer-" + infoItems[key].placement + "-col");
      var h1 = document.createElement('h1');
      h1.setAttribute('class', 'footer-text1 link-item');
      h1.setAttribute('href', infoItems[key].input);
      h1.append(document.createTextNode(infoItems[key].text));
      div.append(h1);
    }
  )
}

function mouseOnArticle(e)
{
  if(e.srcElement)
  {
    var articleBoxId = e.srcElement.id;
    document.getElementById(articleBoxId).style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4))" + ((imgMap.get(articleBoxId) != "undefined") ? (", url('" + IMAGE_PATH + imgMap.get(articleBoxId)) : "") + "')";
  }
}

function mouseOffArticle(e)
{
  if(e.srcElement)
  {
    var articleBoxId = e.srcElement.id;
    document.getElementById(articleBoxId).style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1))" + ((imgMap.get(articleBoxId) != "undefined") ? (", url('" + IMAGE_PATH + imgMap.get(articleBoxId)) : "") + "')";
  }
}

function hoverOn(e)
{
  if(e.srcElement)
  {
    e = e.srcElement;
    var menu = e.getElementsByClassName("dropdown-menu")[0];
    menu.style.display = "block";
  }
}

function hoverOff(e)
{
  if(e.srcElement)
  {
    e = e.srcElement;
    var menu = e.getElementsByClassName("dropdown-menu")[0];
    menu.style.display = "none";
  }
}

function createNavItem(contents, key, val, type)
{
  if(type == "notype")
  {

  }
  else if(type == "dropdown")
  {
    var div1 = document.createElement("div");
    div1.setAttribute("class", "navbar-brand nav-fill navbar-item dropdown");
    var a = document.createElement("a");
    a.setAttribute("href", "#");
    a.setAttribute("id", key);
    a.setAttribute("class", "navbar-brand nav-fill navbar-item dropdown-toggle");
    a.setAttribute("data-toggle", "dropdown");
    a.append(document.createTextNode(val.text.startsWith('override') ? val.text.substring(8, val.text.length) : val.text.substring(0, 10)));
    div1.appendChild(a);

    var div2 = document.createElement("div");
    div2.setAttribute("class", "trt-dropdown-menu dropdown-menu" + (val.dropTo ? (" drop-to-" + val.dropTo) : ""));
    div2.setAttribute("aria-labelledBy", "dropdownMenuButton");

    Object.keys(val.input).forEach
    (
      subkey =>
      {
        var subval = val.input[subkey];

        if((typeof (subval.input)) === "object" && ((subval.input) != null)) // check if the nav item is another dropdown.
        {
          createNavItem(div2, subkey, subval, "submenu");
        }
        else
        {
          var navitem = document.createElement("a");
          navitem.setAttribute("href", subval.input); // href to the link
          navitem.setAttribute("class", "dropdown-item" +
            (subval["text-color"] ? (" text-color-" + subval["text-color"]) : "") // append text color class (text-color-<JSON_TEXT-COLOR>)
          );
          navitem.append(document.createTextNode(subval.text.startsWith('override') ? subval.text.substring(8, subval.text.length) : subval.text.substring(0, 10))); // the text
          div2.appendChild(navitem);
        }
      }
    );
    div1.appendChild(div2);
    div1.onmouseenter = hoverOn;
    div1.onmouseleave = hoverOff;
    div1.setAttribute('onmouseenter', 'hoverOn(this)');
    div1.setAttribute('onmouseleave', 'hoverOff(this)');
    contents.appendChild(div1);
  }
  else if(type == "submenu")
  {
    var div1 = document.createElement("div");
    div1.setAttribute("class", "dropdown");
    var a = document.createElement("a");
    a.setAttribute("href", "#");
    a.setAttribute("id", key);
    a.setAttribute("class", "dropdown-item dropdown-toggle" +
      (val["text-color"] ? (" text-color-" + val["text-color"]) : "")
    );
    a.setAttribute("data-toggle", "dropdown");
    a.append(document.createTextNode(val.text.startsWith('override') ? val.text.substring(8, val.text.length) : val.text.substring(0, 10)));
    div1.appendChild(a);

    var div2 = document.createElement("div");
    div2.setAttribute("class", "trt-dropdown-menu dropdown-menu" + (val.dropTo ? (" drop-to-" + val.dropTo) : ""));
    div2.setAttribute("aria-labelledBy", "dropdownMenuButton");

    Object.keys(val.input).forEach
    (
      subkey =>
      {
        var subval = val.input[subkey];
        if((typeof (subval.input)) === "object" && ((subval.input) != null)) // check if the nav item is another dropdown.
        {
          createNavItem(div2, subkey, subval, "submenu");
        }
        else
        {
          var navitem = document.createElement("a");
          navitem.setAttribute("href", subval.input); // href to the link
          navitem.setAttribute("class", "dropdown-item" +
            (subval["text-color"] ? (" text-color-" + subval["text-color"]) : "") // append text color class (text-color-<JSON_TEXT-COLOR>)
          );
          navitem.append(document.createTextNode(subval.text.startsWith('override') ? subval.text.substring(8, subval.text.length) : subval.text.substring(0, 10))); // the text
          div2.appendChild(navitem);
        }
      }
    );
    div1.appendChild(div2);
    div1.onmouseenter = hoverOn;
    div1.onmouseleave = hoverOff;
    div1.setAttribute('onmouseenter', 'hoverOn(this)');
    div1.setAttribute('onmouseleave', 'hoverOff(this)');
    contents.appendChild(div1);
  }
  else if(type == "button")
  {
    var a = document.createElement("a");
    a.setAttribute("id", key);
    a.setAttribute("href", val.input)
    a.setAttribute("class","navbar-brand nav-fill navbar-item");
    a.append(document.createTextNode(val.text.startsWith('override') ? val.text.substring(8, val.text.length) : val.text.substring(0, 10)));
    contents.appendChild(a);
  }
}
