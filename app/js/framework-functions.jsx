function clearCanvas(ctx, canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function updatePlayerCursor(player, inputStates) {
  // The player is just a circle, drawn at the mouse position
  // Just to test circle/circle collision.

  if(inputStates.mousePos) {
    player.x = inputStates.mousePos.x;
    player.y = inputStates.mousePos.y;

     // draws a circle
    // ctx.beginPath();
    // ctx.arc(player.x, player.y, player.boundingCircleRadius, 0, 2*Math.PI);
    // ctx.stroke();
  }
}

function updateGates(gatesArray) {
  for (var i = 0; i < gatesArray.length; i++) {
    gatesArray[i].draw();
  }
}


export { clearCanvas, updatePlayerCursor, updateGates }
