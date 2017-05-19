// @flow

import { STATIC_PATH } from '../shared/config'

const canvas = () =>
`<!doctype html>
<html>
  <head>
    <title>Canvas</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"> </script>
    <script src="https://unpkg.com/mqtt@2.7.1/dist/mqtt.min.js"> </script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/phaser/2.6.2/phaser.min.js"></script>
    <script>
      $(document).ready(function() {
        var client = mqtt.connect("ws://test.mosca.io");
        channel = prompt("Whats the channel name?");
        client.subscribe(channel);

        client.on("message", function (topic, payload) {
					coordinates = payload.toString().split(" ")
					console.log("choo" +  coordinates);
					update.apply(Object.create(null), coordinates)	
        })
				
				var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create,  render: render });

				function preload() {
					game.load.image('phaser', "${STATIC_PATH}/ball.png");
				}

				var sprite;

				function create() {

						//  To make the sprite move we need to enable Arcade Physics
						game.physics.startSystem(Phaser.Physics.ARCADE);

						sprite = game.add.sprite(game.world.centerX, game.world.centerY, 'phaser');
						sprite.anchor.set(0.5);

						//  And enable the Sprite to have a physics body:
						game.physics.arcade.enable(sprite);

				}

				function update(x,y,z) {
			//			//  If the sprite is > 8px away from the pointer then let's move to it
			//			//if (game.physics.arcade.distanceToPointer(sprite, game.input.activePointer) > 8)
			//			{
			//					//  Make the object seek to the active pointer (mouse or touch).
			//					game.physics.arcade.moveToPointer(sprite, 300);
			//			}
			//			else
			//			{
			//					//  Otherwise turn off velocity because we're close enough to the pointer
			//					sprite.body.velocity.set(0);
			//			}
					console.log("yo", x, y)
					x = parseFloat(x)
					y = parseFloat(y)
					console.log("sprite", sprite.x, sprite.y, x, y)
					game.physics.arcade.moveToXY(sprite, sprite.x + x, sprite.y + y)
				}

				function render () {
					game.debug.inputInfo(32, 32);
				}
			 
      });
    </script>
  </head>
  <body>
  </body>
</html>
`

export default canvas
