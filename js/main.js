//slider
var slides = document.querySelectorAll('#slides .slide');
var currentSlide = 0;
var slideInterval = setInterval(nextSlide,3000);

function nextSlide() {
    slides[currentSlide].className = 'slide';
    currentSlide = (currentSlide+1)%slides.length;
    slides[currentSlide].className = 'slide active';
}

//autoLinker init
var autolinkerTwitter = new Autolinker( {
    urls : {
        schemeMatches : true,
        wwwMatches    : true,
        tldMatches    : false
    },
    email       : true,
    phone       : false,
    mention     : 'twitter',
    hashtag     : 'twitter',

    stripPrefix : true,
    stripTrailingSlash : true,
    newWindow   : true,

    truncate : {
        length   : 0,
        location : 'end'
    },

    className : ''
});
var autolinkerInstagram = new Autolinker( {
    urls : {
        schemeMatches : true,
        wwwMatches    : true,
        tldMatches    : false
    },
    email       : true,
    phone       : false,
    mention     : 'instagram',
    hashtag     : 'instagram',

    stripPrefix : true,
    stripTrailingSlash : true,
    newWindow   : true,

    truncate : {
        length   : 0,
        location : 'end'
    },

    className : ''
});

//random post picture
var postPic = new Array(
    'pix/image-1.jpg',
    'pix/image-2.jpg',
    'pix/image-3.jpg',
    'pix/image-4.jpg',
    'pix/image-5.jpg',
    'pix/image-6.jpg',
    'pix/image-7.jpg',
    'pix/image-8.jpg',
    'pix/image-9.jpg',
    'pix/image-10.jpg',
    'pix/image-11.jpg'
    );
function choosePic() {
    var randomNum = Math.floor(Math.random() * postPic.length);
    return randImage = postPic[randomNum];
}

//sort posts by date
function SortByDate(x,y) {
    var sortColumnName = 'item_published';
    return ((y[sortColumnName] == x[sortColumnName]) ? 0 : ((y[sortColumnName] > x[sortColumnName]) ? 1 : -1 ));
}

//find the relative date
var today = new Date();
const _MS_PER_DAY = 1000 * 60 * 60 * 24;
function dateDiffInDays(a, b) {
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

//read api response and create posts list
var data;

fetch('https://private-cc77e-aff.apiary-mock.com/posts').then(function(response) {
  if(response.ok) {
    response.json().then(function(json) {
      data = json;
      initialize();
    });
  } else {
    console.log('Fetch request failed with response ' + response.status + ': ' + response.statusText);
  }
});

function initialize() {
    var imageUrl = '',
        serviceText = '',
        linkText = '',
        linkUrl = '',
        icon = '',
        userName = '';

    var wall = document.getElementById('socialWall');
    var postsUl = document.createElement('ul');
    var service = 'all';

    updateDisplay(service);
    
    var filterButtons = document.getElementsByTagName('input');
    var filterButtonsCount = filterButtons.length;
    for (var i = 0; i < filterButtonsCount; i++) {
        filterButtons[i].onclick = function() {
            var previousButtonChecked = document.querySelector('label.active');
            console.log(previousButtonChecked);
            previousButtonChecked.classList.remove('active');

            var buttonChecked = document.getElementById(this.id);
            buttonChecked.parentElement.classList.add('active');
            updateDisplay(this.id);

            if(this.id == 'all') {
                moreButton.style.display = "block";
            } else {
                moreButton.style.display = "none";
            }

        };
    }

    var moreButton = document.getElementById('more');
    moreButton.onclick = function() {
        updateDisplay('all',true);
    };

    function updateDisplay(service,more) {
        if (more == null) {
            while(postsUl.firstChild){
                postsUl.removeChild(postsUl.firstChild);
            }
        }

        imageUrl = '';
        var posts = data.items;
        posts.sort(SortByDate);
        //for(var i = 0; i < offset && i < posts.length; i++){
        for (var i = 0; i < posts.length; i++) {
            if (service == 'all') {
                showPost(posts[i]);
            } else if ( (service == 'twitter') && (posts[i].service_name.toLowerCase() == 'twitter')) {
                showPost(posts[i]);
            } else if ((service == 'instagram') && (posts[i].service_name.toLowerCase() == 'instagram')) {
                showPost(posts[i]);
            } else if ((service == 'manual') && (posts[i].service_name.toLowerCase() == 'manual')) {
                showPost(posts[i]);
           }
        }
        wall.appendChild(postsUl);
    }

    function showPost(post) {
        var postItem = document.createElement('li');

        postServiceName =  post.service_name;
        postItem.setAttribute('class', 'post post--'+ postServiceName.toLowerCase());

        if (postServiceName == 'Twitter') {
            userName = post.item_data.user.username;
            serviceText = post.item_data.tweet;
            serviceText = autolinkerTwitter.link(serviceText);
            var twitterIcon = document.createElement('i');
            twitterIcon.setAttribute('class', 'post__icon fa fa-twitter');
            postItem.appendChild(twitterIcon);
            imageUrl = "";
        } else if (postServiceName == 'Instagram') {
            userName = post.item_data.user.username;
            serviceText = post.item_data.caption;
            serviceText = autolinkerInstagram.link(serviceText);
            imageUrl = post.item_data.image.medium;
            var instagramIcon = document.createElement('i');
            instagramIcon.setAttribute('class', 'post__icon fa fa-instagram');
            postItem.appendChild(instagramIcon);
        } else {
            serviceText = post.item_data.text;
            imageUrl = post.item_data.image_url;
            linkText = post.item_data.link_text;
            linkUrl = post.item_data.link;
            var manualIcon = document.createElement('span');
            manualIcon.setAttribute('class', 'post__icon');
            manualIcon.innerHTML = 'AFF';
            postItem.appendChild(manualIcon);
        }

        if (imageUrl) {
            var postImage = document.createElement('div');
            postImage.setAttribute('class', 'post__image');
            var img = document.createElement('img');
            img.setAttribute('class', 'img-fluid');
            img.src = choosePic();
            postImage.appendChild(img);
            postItem.appendChild(postImage);
        }

        if (userName && (postServiceName != 'Manual')) {
            var postUser = document.createElement('div');
            postUser.setAttribute('class', 'post__user');
            postUser.innerHTML = userName;
            postItem.appendChild(postUser);
        }

        var postDate = document.createElement('div');
        postDate.setAttribute('class', 'post__date');
        var postDateItem = post.item_published;
        postDateItemConv = new Date(postDateItem);
        ago = dateDiffInDays(postDateItemConv, today);

        postDate.innerHTML = 'Posted ' + ago + ' days ago';
        postItem.appendChild(postDate);

        var postText = document.createElement('div');
        postText.setAttribute('class', 'post__text');
        postText.innerHTML = serviceText;

        postItem.appendChild(postText);

        if (linkUrl) {
            var postLink = document.createElement('a');
            postLink.setAttribute('class', 'post__link');
            var postLinkText = document.createTextNode(linkText);
            postLink.setAttribute('href', linkUrl);
            postLink.setAttribute('target', '_blank');
            postLink.appendChild(postLinkText);
            postItem.appendChild(postLink);
        }

        postsUl.appendChild(postItem);
    }

}