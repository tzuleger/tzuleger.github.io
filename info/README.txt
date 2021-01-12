The website is built off of a script that uses a skeleton HTML code and a JSON file to build the page to it's bare minimum.
From there, the goal for the developer(s) of the website could edit the newly generated HTML code to their liking.
The main point of the generator is to create the skeleton of the Website so it's easy to create a new page from scratch.
Obviously, there are some setbacks (excuse that, as my front-end development skills are very rusty and definitely not as good as my back-end
development skills) such as alignment of the page. Additionally, the alert banner still needs work as you may notice that the Information
logo is misaligned with the text. I also would like to add a transition effect when a mouse leaves a box-- similar to how when you enter
a box, there is a transition effect.

The generation of a webpage is as simple as copying the contents of the Skeleton JSON file to the name of the JSON file that you want the
subdomain of. (For example, 3rt.com/careers/careers.html would mean you need a file named "careers.json" in the json folder and a file named
"careers.html" in the "careers" folder (since there is /careers/careers)). From there, you can follow the README (which I plan to rewrite)
to generate a webpage based off the syntax I've provided.

This can be seen as a "pseudo" programming language but interacted through JSON. Any feedback is appreciated, it only took a few hours to
write the generator. It was the figuring out the HTML/CSS that bottlenecked the development.

Images can be changed very easily as well as content/links/buttons/logos/etc.
