HEADER: The main header, with the carousel in the background.
  - title: Should stay the same as the company name.
  - quote: Company's slogan/quote, anything that could draw user's attention.
  - images: List of images that are in the carousel. (Timing will range between 5-8 seconds depending on # of pictures.)
    - src: The name of the file. This should always be in the "imgs" folder. Include the extension
    - x-position: Use percentages, this is to position the x posimage properly, when the screen is at 100% zoom.
    - y-position: Use percentages, this is to position the y pos of the image properly, when the screen is at 100% zoom.

NAVBAR: The navigation bar that allows easy navigation to the user.
  - justification: Justifies the contents to the left of the parent object. Resizable supported. Zoom supported.
    - left
    - center
    - right
    - nothing: Do not add justification into the dictionary at all. This is caught if justification is necessary to NAVBAR, otherwise it's meant for recursive submenus
  - text: The text that is displayed on the nav item.
  - input: Specifies the input type of the link.
    - DROPDOWN:
      -  Provide a dictionary {x1:y1, x2:y2, ...} | x1 is the text to show to user, y1 is the corresponding link to that text.
        - NOT SUPPORTED YET: Additionally, dropdown items can be recursive dropdown menus. Instead of a link, add another dictionary with the same contents as above.
    - BUTTON:
      - Provide a link.
    - NO-TYPE:
      - Provide the string: "notype"
