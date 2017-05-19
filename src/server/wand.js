// @flow

import { STATIC_PATH } from '../shared/config'

const wand = () =>
`<!doctype html>
<html>
  <head>
    <title>Wand</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font: 13px Helvetica, Arial; }
      .send_message { background: #000; padding: 3px; position: fixed; bottom: 0; width: 100%; }
      .send_message input { border: 0; padding: 10px; width: 90%; margin-right: .5%; }
      .send_message button { width: 9%; background: rgb(130, 224, 255); border: none; padding: 10px; }
      #messages { list-style-type: none; margin: 0; padding: 0; }
      #messages li { padding: 5px 10px; }
      #messages li:nth-child(odd) { background: #eee; }
    </style>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"> </script>
    <script src="https://unpkg.com/mqtt@2.7.1/dist/mqtt.min.js"> </script>
    <script src="${STATIC_PATH}/js/gyronorm.complete.min.js"></script>
    <script>
      $(document).ready(function() {
        var client = mqtt.connect("ws://test.mosca.io");
        channel = prompt("Whats the channel name?");
        client.subscribe(channel);

        client.on("message", function (topic, payload) {
          $('#messages').append($('<li>').text(payload));
        })

        var gn = new GyroNorm();

        gn.init({frequency: 300}).then(function(){
          gn.start(function(data){
            client.publish(channel,  data.dm.gx + " " + data.dm.gy + " " + data.dm.gz )
          })
        }).catch(function(e){
          console.log(e) 
        });
      });
    </script>
  </head>
  <body>
    <ul id="messages"></ul>
    <div class="send_message">
      <input id="m" autocomplete="off" /><button id="send">Send</button>
    </div>
  </body>
</html>
`

export default wand

