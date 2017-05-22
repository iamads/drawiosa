// @flow

import { STATIC_PATH } from '../shared/config'

const wand = () =>
`<!doctype html>
<html>
  <head>
    <title>Wand</title>
    <style>
    </style>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"> </script>
    <script src="https://unpkg.com/mqtt@2.7.1/dist/mqtt.min.js"> </script>
    <script src="${STATIC_PATH}/js/gyronorm.complete.min.js"></script>
    <script>
      $(document).ready(function() {
        var client = mqtt.connect("ws://test.mosca.io");
        channel = prompt("Whats the channel name?");
        client.subscribe(channel);

				var cool_button_state = { wand: "up" }

				function toggle_and_send_cool_button_state(){
					if (cool_button_state.wand === "down"){
						cool_button_state.wand = "up"
					} else {
						cool_button_state.wand = "down"
					}
					console.log(channel, cool_button_state)
					client.publish(channel, JSON.stringify(cool_button_state))
				}


        client.on("message", function (topic, payload) {
          //$('#messages').append($('<li>').text(payload));
        })

        var gn = new GyroNorm();

        gn.init({frequency: 300}).then(function(){
          gn.start(function(data){
            client.publish(channel, JSON.stringify({ wand: "move", x: data.dm.gx, y: data.dm.gy, z: data.dm.gz }) )
          })
        }).catch(function(e){
          console.log(e) 
        });

				$('#cool_button').on('click', function(){
					console.log("clicked")
					toggle_and_send_cool_button_state()
				})

				toggle_and_send_cool_button_state()
      });
    </script>
  </head>
  <body>
    <ul id="messages"></ul>
    <div class="send_message">
      <button type="button" id="cool_button" style="background-color: royalblue; border: none; color: white; padding: 200px 200px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;"> Click Me!</button>
    </div>
  </body>
</html>
`

export default wand

