// @flow

// import { STATIC_PATH } from '../shared/config'

const canvas = () =>
`<!doctype html>
<html>
  <head>
    <title>Canvas</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"> </script>
    <script src="https://unpkg.com/mqtt@2.7.1/dist/mqtt.min.js"> </script>
    <script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
    <script>
      $(document).ready(function() {
				var svg = d3.select('body')
					.append('svg')
					.attr('width', 1000)
					.attr('height', 1000);
					
				var color = d3.scale.category20();
				
				var line = d3.svg.line()
						.interpolate("basis");
				
				var drawObj = {
					isDown: false,
					dataPoints: [[100,100]],
					currentPath: null,
					color: 0
				}

        var client = mqtt.connect("ws://test.mosca.io");
        channel = "jack" ;//prompt("Whats the channel name?");
        client.subscribe(channel);

        client.on("message", function (topic, payload) {
          message = JSON.parse(payload.toString());

          if (message.wand === "down") {
						console.log("down")
            drawObj.isDown = true
          }

          if (message.wand === "move"){
            if (drawObj.isDown){
              movement_x = parseFloat(message.x)
              movement_y = parseFloat(message.y)
              movement_z = parseFloat(message.z)
							if (drawObj.dataPoints.length > 0) {
								new_x = drawObj.dataPoints[drawObj.dataPoints.length - 1][0] + movement_x
								new_y = drawObj.dataPoints[drawObj.dataPoints.length - 1][1] + movement_y
							} else {
								new_x = movement_x
								new_y = movement_y
							}

              drawObj.dataPoints.push([new_x, new_y]);
            }
            if (!drawObj.currentPath){
              console.log("jack");
              drawObj.currentPath = svg.append("path")
                .attr("class","currentPath")
                .style("stroke-width", 1)
                .style("stroke",color(drawObj.color))
                .style("fill", "none");
            }
            drawObj.currentPath
              .datum(drawObj.dataPoints)
              .attr("d", line);
				
						console.log(drawObj.dataPoints);
          }
          
          if (message.wand === "up"){
						console.log("up")
					  drawObj.isDown = false;
						drawObj.currentPath.attr("class","oldPath");
						drawObj.dataPoints = [];
						drawObj.currentPath = null;
						if (++drawObj.color > 19) {
							drawObj.color = 0;
						} 
          }
				});
		  });
    </script>
  </head>
  <body>
  </body>
</html>
`

export default canvas
