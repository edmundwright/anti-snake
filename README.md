# Anti-Snake

[Live link](http://edmund.io/anti-snake)

Twist on the classic Snake game, written in JavaScript. Snake is autonomous, and path-finds using a customized breadth-first-search, while player must build a maze to slow the snake in its search for the apple.

![screenshot]

## Features

- Snake path-finds using a customized breadth-first-search that takes into account the movement of the snake's tail
- When no path exists, snake switches to trying to cover the most distance, which helps in situations where path is blocked by snake itself.
- HTML elements only re-rendered when necessary.
- Uses mouse event listeners to allow smooth drawing of walls by the player.
- Game adjusts to fit in any window size.

[screenshot]: ./screenshot.jpg
