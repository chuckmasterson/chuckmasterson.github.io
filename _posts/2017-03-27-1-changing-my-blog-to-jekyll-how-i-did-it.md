---
layout: post
title: "Changing My Blog to Jekyll: *How* I Did It"
subtitle: For those who want to make a Jekyll blog.
categories: [meta, computers]
---

*This is the second of two posts about redoing my blog. This one is mainly for other people who’d
like to make a Jekyll blog and are interested in how I did some of the things I did. If you’re
migrating from Blogger you’ll find it especially relevant.*
{: .prefatory }

This year I finished a long project: moving my entire twelve-year-long Blogger blog over to Jekyll.
Probably not a lot of people, especially programmers, have stuck with Blogger as long as I did.
I thought it was kinda charming, until I didn’t. But if you’re doing this with a Blogger blog of any
kind---or if you’ve just seen some of the stuff I’ve got going on and think it’s kinda neat---here’s
how I got all the functionality of Blogger that I cared about with the excellent duo of Jekyll and
GitHub. 

#### Step 1: Get my old posts.

Blogger gives you a button to get a copy of everything you’ve ever written to it, under `Settings >
Other > Import & Back Up > Back up Content`. It’s all there in one big XML dump.

#### Step 2: Translate to Jekyllese (YAML + Markdown).

While I was researching how to do this, I discovered A.J. O’Neal’s
[blogger2jekyll](https://git.daplie.com/coolaj86/blogger2jekyll). It looked quite promising, but
apparently something in the middle of my massive (8MB) XML file made it choke, and I could never get
it to go past the first hundred posts or so out of over 300.

I’d just recently been doing some WordPress work, so my solution was to set up a localhost with
a basic WordPress installation on it, and use it as a middleman. Blogger sucks and WordPress is
popular, so I figured a Blogger-to-WordPress migrator would be a well-used and well-refined bit of
code. And indeed, there’s a plugin named Blogger Importer, made by wordpressdotorg itself. It worked
beautifully.

Then I installed another plugin, Wordpress to Jekyll Exporter, which also worked a treat. Except it
didn’t export any comments. More on that later.

#### Step 3: Clean up, clean up.

I opened up my brand-new .md files and found that I had, here, a very bad combination. On the one
hand I had Blogger’s terrible awful formatting. For all of Blogger’s history, for example, it has
used `<div>`s for paragraphs, not `<p>`s. *The “p” stands for “paragraph”!!* It insists on wrapping
every post in a pointless `<div>`. Most styles are inline. The WYSIWYG editor peppers extra opening
and closing tags everywhere. Its formatting of images is some table-based stuff that may have made
perfect sense in the early ’00s but that developers now find horrifying. It’s also changed in subtle
ways over the years. On the other hand, I had my idiosyncratic insistence that paragraphs should be
indented, not spaced out from each other, compounded with how I didn’t know or care at all about W3C
standards.

The WordPress-to-Jekyll exporter seems to have tried its best to make it all Markdown, but it was
ugly in those files. So I spent a long time clearing out the crap and getting them down to bare
Markdown. It took a long time, but it felt good.

If you find yourself facing a similar task, my advice is: Use Vim. Make sure you install
[surround.vim](https://github.com/tpope/vim-surround). Then you can make up whatever macros you
need, right on the spot. Here are some that were helpful to me:

``` vim
" (p)aragraphs from (h)yphens - because that's how I paragraphed all my old
" blog posts
nnoremap <leader>ph :%s/^-\(-\)\@!/\r/gc<CR>
" (p)aragraphs from double line (b)reaks - because that's how I paragraphed
" all my even older blog posts
nnoremap <leader>pb :%s/<br \/> <br \/>/\r\r/gc<CR>
" (p)aragraphs from (n)ewlines - same as above but for single <br> tag
nnoremap <leader>pn :%s/<br \/>/\r\r/gc<CR>
" (p)aragraphs from non-breaking (s)paces
nnoremap <leader>ps :%s/\ \ \n&nbsp;\ &nbsp;/\r\r/gc
" (p)aragraphs from (i)nline line breaks
nnoremap <leader>pi :%s/<br\ \?\n\?\/>\ \?&nbsp;\ \?\n\?&nbsp;\ \?/\r\r/gc
" (s)ection (b)reak
inoremap \sb <CR>* * *<CR>
nnoremap <leader>sb i<CR>* * *<esc>
" pretty up linebreaks [run g(q)] on the body of the (p)ost
nnoremap <leader>qp ?^---<CR>jvGgq
" (d)elete (e)mpty divs
nnoremap <leader>de :%s/<div>\n<\/div>//g<CR>
" (d)elete extra (n)ewlines
nnoremap <leader>dn :%s/\n\n\+/\r\r/g<CR>
" (r)eplace non-breaking (s)paces with spaces
nnoremap <leader>rs :%s/&nbsp;/\ /g
" (r)eplace (i)talic tags <i>
nnoremap <leader>ri :%s/<\(\/\)\?i>/*/g<CR>
" (r)eplace e(m) tags <em>
nnoremap <leader>rm :%s/<\(\/\)\?em>/*/g<CR>
" (r)eplace (b)old tags <b>
nnoremap <leader>rb :%s/<\(\/\)\?b>/**/g<CR>
```

#### Step 4: Get my images.

Blogger uploads your images to Google Photos, but then it hides them from you in a secret area just
for Blogger images. They don’t seem to have mentioned this to anyone. The only way I found them was 
by going to
the Blogger menu: `Help`, then typed in “images”, and clicked on “Add images and videos to your
blog”. It says there, “Images in your blog are stored in a Google Album Archive...”, with a link.
Apparently if you’re logged in to Google, though, you can just go to
[get.google.com/albumarchive](https://get.google.com/albumarchive) and it’ll take you right to your
own.

Once you find the damn thing, you can click through to your blog’s image album, and in the top
corner there’ll be a “...” button. From that you can download all your photos in a big giant zip
folder.

I didn’t do this, though, because I had a different plan.

#### Step 5: Figure out image displaying.

Bare Markdown images work, but I like adding captions, and there’s not a great way to do that
without getting outside of Markdown. After I established that bare Markdown wouldn’t work, the best
solution was a [Jekyll `include`](http://jekyllrb.com/docs/includes/). I named mine `fig.html`.

With this tool available to me, I decided I’d also shorten all my image names! No more typing out
full URLs. Just `IMG_0408.jpg` or whatever my camera decided to name it. Then I’d chuck them all in
a single location, and set the name of that location in my `_config.yml`. I’ve liked this a lot.
When I want an image, I just write,

``` liquid
{% raw %}
{% include fig.html src="IMG_0408.jpg" caption="This photo gots a caption." %}
{% endraw %}
```

And `fig.html` does everything else for me.
{: .run-in }

At first I put all my images under `/assets/images/`. Then I realized I really should have small
versions of them, because some of my pictures are pretty heavy on load time, so I made `fig.html`
render an `<img>` tag that displays the small version, inside an `<a>` tag that links to the large
version. And I made folders full of large and small versions of all the images at
`/assets/images/lg/` and `/assets/images/sm/`. 

This strategy also worked excellently with [Magnific
Popup](http://dimsemenov.com/plugins/magnific-popup/). I knew I wanted a lightbox-style image
displayer, and after much looking I concluded Magnific was the best. I futzed with its CSS until it
displayed the snazzy captions I wanted, and I’m a happy user.

Finally I had one more realization, and that was that with all those images in the directory, doing
stuff to my site was now taking for*ever*, especially the Git operations.

I decided this was a problem worth bringing in an extra dependency for. So off of some other
Jekyller’s tip, I got set up with [Cloudinary](http://www.cloudinary.com). It’s a cloud-based image
hosting site. If you’re an obscure, little-read blogger like me, their free plan will be all the
bandwidth you could ever need. And they have the added benefit that you can have them serve your
image at different sizes just by feeding them a different URL.

To put it all together, my `_config.yml` ended up with the following in it:

``` yaml
image_dirs:
  local:
    root: "/assets/images"
    large: "/lg/"
    small: "/sm/"
  cloudinary:
    root: "http://res.cloudinary.com/chuckmasterson/image/upload"
    large: "/"
    small: "/c_limit,h_450,w_450/"
```

I've defined two places to look for the images. This way I can build and preview the site on my own
computer before pushing, using an [environment
variable](http://www.csinaction.com/2015/02/07/environments-in-jekyll-aka-jekyll_env/) with `$
JEKYLL_ENV=local bundle exec jekyll build`, and I can see the post with photos even if I’m away from
an internet connection. The bit in `cloudinary.small` tells Cloudinary to shrink the image to
450×450px before serving it.

`fig.html` looks like this, then:

``` liquid
{% raw %}
{% if jekyll.environment == "local" or include.elsewhere %}
  {% assign src_to_use = include.src %}
  {% assign img_root = site.image_dirs.local.root %}
  {% assign lg_dir = site.image_dirs.local.large %}
  {% assign sm_dir = site.image_dirs.local.small %}
{% else %}
  {% capture src_to_use %}{{ include.src
    | replace: "'", "_"
    | replace: " ", "_"
  }}{% endcapture %}
{% assign img_root = site.image_dirs.cloudinary.root %}
{% assign lg_dir = site.image_dirs.cloudinary.large %}
{% assign sm_dir = site.image_dirs.cloudinary.small %}
{% endif %}

<figure class="image-fig {{ include.class }}">
  <a class="mfp-trigger" href="{% if include.elsewhere %}{{ include.src }}
    {% else %}{{ img_root }}{{ lg_dir }}{{ src_to_use }}
    {% endif %}">
    <img
      {% if include.elsewhere %}
          src="{{ include.src | uri_escape }}"
      {% else %}
          src="{{ img_root }}{{ sm_dir }}{{ src_to_use }}"
      {% endif %}
    />
  </a>
  {% if include.caption %} <figcaption> {{ include.caption | markdownify }} </figcaption> {% endif
  %} 
</figure> 
{% endraw %}
```

All of this does make the process of adding images slightly more obtuse:

1.  Copy all images for the post into `/assets/images/staging/`.
2.  Copy again into `/assets/images/lg/`.
3.  Upload everything from the staging folder onto Cloudinary (simple drag-and-drop).
3.  Resize everything in the staging folder with
    
    ``` sh
    $ mogrify -resize 640x640 ./*.jpg
    ```
    
    (Which I keep saved in that folder as `resize.sh`.)
    {: .run-in}
4.  Move those into `/assets/images/sm/`.
5.  All done.

But I like the flexibility I get from it.

#### Step 6: Bring in the comments.

Most Jekyll setups kind of assume that you either don’t care what your readers have to say, or you
want to use Disqus or some other commenting thing that works via a database from another site. If
I wanted that, why make a static site in the first place?

Somehow or other I got tipped off to the existence of Eduardo Bouças’s excellent alternative
[Staticman](https://staticman.net/). This is a program that runs on a server somewhere else, and
uses GitHub’s API in a neat, creative way: it accepts a comment that’s submitted to it and processes
it into a YAML file. Then, with the program’s own GitHub account (@staticmanapp), it commits the
YAML file to your repo with the right name. And there you go. The comment appears without you having
to touch it. Or you can moderate it: then Staticman opens a pull request with the YAML file.

So I was like, “Sweet! Sign me up!”

But before I could do that, I had to make files out of my comments.

Recall from earlier that my comments were all still in a local WordPress installation, sitting there
in the database. Well, I brushed up a little on my MySQL, and eventually figured out the following
query, which I ran in phpMyAdmin, to get them out of the database and into one big file:

``` sql
SELECT CONCAT("author: \"", REPLACE(c.comment_author, '"', '\\"'), "\"
authorurl: ", c.comment_author_url, "
_id: ", c.comment_ID - 2, "
legacyslug: ", m.meta_value, "
timestamp: ", c.comment_date, "
text: \"", REPLACE(c.comment_content, '"', '\\"' ), "\"
DELIMITER"
  )
  FROM wp_comments c 
  INNER JOIN wp_posts p ON c.comment_post_ID = p.ID
  INNER JOIN wp_postmeta m ON p.ID = m.post_id
  WHERE c.comment_approved = 1
  AND m.meta_key = 'blogger_permalink'
  INTO OUTFILE "/var/lib/mysql-files/commentdump.txt";
```

This file then needs a bunch of processing. First, the backslashes. Urgh, no matter what escape
sequence I used, MySQL would give me either too many backslashes or none, wherever there was
a backslash in my comments. So, replace all the double backslashes:

``` sh
sed --in-place 's:\\":\":g' commentdump.txt
```

Now, the file is a bunch of valid YAML snippets, separated by a line with just the word `DELIMITER`
on it. So, split those apart using [`csplit`](http://www.computerhope.com/unix/ucsplit.htm), the
context-based file splitter.

``` sh
csplit -f comment -n 5 -s commentdump.txt -b '%d.yml' '/DELIMITER/+1' {*}
```

And also, there were a bunch of `^M` characters in there. Got rid of those.

``` sh
sed --in-place 's#^M\\##g' *.yml
# bash will insist that you type the ^M character over again (Ctrl-V, Ctrl-M)
```

Then a bunch of massaging:

``` sh
# remove leading slash from blogger_permalink field
sed -i 's#^legacyslug:\ /#legacyslug:\ #g' *.yml;

# convert slashes in blogger_permalink a.k.a. legacyslug into hyphens
for file in *.yml; do num=`grep -n 'legacyslug:' $file | cut -d : -f 1`; sed -i "${num}s:/:-:g" $file; done;

# remove .html from the end of the legacyslug field
for file in *.yml; do slug=`cat $file | grep "legacyslug" | sed "s/\.html//"`; sed -i "s/legacyslug.*/$slug/" $file; done;

# rename comments so they're sequential in the right order
for file in *.yml; do comwpid=`grep "^_id:" $file | awk -F" " '{print $NF}'`; fname=comment-$((9999 - comwpid)).yml; mv $file $fname; done

# create a folder for each slug that exists in the comments
for file in *.yml; do slug=`cat $file | grep 'legacyslug: ' | awk -F' ' ' { print $NF } ' | sed "s/\.html//"`; mkdir -p ~/PATH/TO/YOUR/_data/comments/$slug; done

# sort the comments into the folders you just made
for file in *.yml; do slug=`cat $file | grep 'legacyslug: ' | awk -F' ' ' { print $NF } '`; mv $file ~/PATH/TO/YOUR/_data/comments/$slug/; done;

# get rid of my old Blogger user url and replace with chuckmasterson.com
find . *.yml -exec sed 's#https://www.blogger.com/profile/03918675492238901083#http://www.chuckmasterson.com#' {} \;

# deletes everything in all the comment subfolders in _data/comments/,
# in case you mess things up and need to start over
find _data/comments -maxdepth 2 -type f -exec rm {} \;
```

If all those commands worked, you should be left with a folder called `_comments` with lots of
subfolders each with the name of one of your posts, in the format `yyyy-mm-name-of-post`. It’s
entirely likely that these won’t transfer exactly to your situation and you’ll need to learn a bit
about `sed`, `grep`, `cat`, `awk`, `tail`, and all those other bizarre file-manipulating Bash
commands. But you’ll get it eventually. I have faith. I knew nothing about those commands before
I started this project.

#### Step 7: Thread the comments

As if that weren’t enough, I wanted threaded commenting too, because I decided I could be as
perfectionist as I wanted. And so I found Michael Rose’s also-excellent
[instructions](https://mademistakes.com/articles/improving-jekyll-static-comments/) for how to get
that done.

I more or less lifted my comments section straight out of Michael’s [source
code](https://github.com/mmistakes/made-mistakes-jekyll) at `/src/_layouts/page__comments.html` and
`/src/_layouts/comment.html/`. `page__comments.html` goes into the `post` layout, and it loops
through each comment in the relevant directory, rendering them with `comment.html` and adding the
CSS class `child` to posts that have been made by replying to another post. It’s all quite clever
and Liquidy.

Trouble was, we both discovered later that it was incorrect. We were misusing a Staticman `option`
named `options[parent]`. `options[parent]` should later be very useful for setting up comment reply
emails, so we don’t want to misuse it in a way that makes that impossible. So I needed to
change some stuff in the comment rendering. The [commit where I did
that](https://github.com/chuckmasterson/chuckmasterson.github.io/commit/7e14591bb64bc95879548fd7dd2681e2bf7fb76d)
is much more useful to look at than anything I could write here, since you can see all the different
files I had to change, and how.

#### Step 8 (??): Comment reply notification emails

Ostensibly, Staticman has the capability to send a notification email to everyone who’s subscribed
to a post. However, several people in the comments on a [related
issue](https://github.com/eduardoboucas/staticman/issues/42) have tried to get it set up, by the
book, and it seems not to work quite yet. It could be that we’re all doing it wrong, or it could be
that Staticman is buggy. I don’t know yet, but I look forward to finding out and getting the emails
working. It’ll be the final piece in this puzzle.

#### Step 9: Forms

I’ve got a couple forms---one for [subscribing](/subscribe) and one for [manually
commenting](/manual-comment) in case comments aren’t working. These come to me through
[Formspree](http://formspree.io).

#### Step 10: Redirect

As [Yevgeniy Brikman has pointed
out](http://www.ybrikman.com/writing/2015/04/20/migrating-from-blogger-to-github-pages//), Blogger
doesn’t give you much flexibility in redirecting to a better site. Its templates use what he calls
“some sort of arcane XML syntax that only supports basic variable lookups, loops, and if/else
statements”. In other words, if you want to redirect from
chuckmasterson&shy;.blogspot&shy;.com/&shy;2015/&shy;04/&shy;something&shy;.html to
chuckmasterson&shy;.com/blog&shy;/2015/04&shy;/something, you’re not going to get the templating language to do it
for you. It can’t change the string that way. You’ll have to use a JavaScript redirect, unless you
want to do what Yevgeniy did and put an if-else statement in there that contains the URLs of every
post you’ve ever written. (If that sounds like fun, he’s got some Ruby on the post I linked, but
I couldn’t make it work since I’m not a Rubyist.) But you can salvage some SEO cred by setting your
`canonical` to the new blog.

My JavaScript redirect looks like this---including the ridiculous quote-escaping that Blogger’s
arcane XML garbage makes you do:

``` html
<script>
  var bsUrl=&quot;<data:blog.url/>&quot;;
  ghUrl = bsUrl.replace(&quot;blogspot.&quot;, &quot;&quot;);
</script>

<body onload='window.location = ghUrl'>
  [...]
```

Once you’ve got that, you also need to add `jekyll-redirect-from` to your Gemfile, and change
whatever bit of your YAML metadata has the original blogger URL so that the field is named
`redirect_from`. That’ll set it up so that when someone arrives from an old Blogger link, they’ll
get to the right Jekyll post.

#### Step 11: Enjoy

Blogging with Jekyll pairs well with [vim-jekyll](https://github.com/parkr/vim-jekyll).
