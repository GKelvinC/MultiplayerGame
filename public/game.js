export default function createGame() {
  const state = {
    players: {},
    fruits: {},
    screen: {
      width: 10,
      height: 10
    }
  }

  const observers = []

  function start() {
    const frequency = 2000

    setInterval(addFruit, frequency)
  }


  function subscribe(observerFunction) {
    observers.push(observerFunction)
  }

  function notifyAll(command) {
    console.log(`keyboardListener --> Notifying ${observers.length} observers`);
    for (const observerFunction of observers) {
      observerFunction(command)
    }
  }
  function setState(newState) {
    Object.assign(state, newState)
  }
  function addPlayer(command) {
    const playerId = command.playerId
    const playerX = 'playerX' in command ? command.playerX : Math.floor(Math.random() * state.screen.width)
    const playerY = 'playerY' in command ? command.playerY : Math.floor(Math.random() * state.screen.height)

    state.players[playerId] = {
      x: playerX,
      y: playerY
    }

    notifyAll({
      type: 'add-player',
      playerId: playerId,
      playerX: playerX,
      playerY: playerY
    })
  }

  function removePlayer(command) {
    const playerId = command.playerId
    delete state.players[playerId]

    notifyAll({
      type: 'remove-player',
      playerId: playerId
    })
  }


  function addFruit(command) {
    const fruitId = command ? command.fruitId : Math.floor(Math.random() * 1000000)
    const fruitX = command ? command.fruitX : Math.floor(Math.random() * state.screen.width)
    const fruitY = command ? command.fruitY : Math.floor(Math.random() * state.screen.height)

    state.fruits[fruitId] = {
      x: fruitX,
      y: fruitY
    }

    notifyAll({
      type: 'add-fruit',
      fruitId: fruitId,
      fruitX: fruitX,
      fruitY: fruitY
    })
  }

  function removeFruit(command) {
    const fruitId = command.fruitId
    delete state.fruits[fruitId]

    notifyAll({
      type: 'remove-fruit',
      fruitId: fruitId,
    })
  }


  function checkForFruitColision(playerId) {
    const player = state.players[playerId]

    for (const fruitId in state.fruits) {
      const fruit = state.fruits[fruitId]
      console.log(`Checking ${playerId} and ${fruitId}`)

      if (player.x === fruit.x && player.y === fruit.y) {
        console.log(`COLISION between ${playerId} and ${fruitId}`)
        removeFruit({ fruitId: fruitId })
      }
    }
  }

  function movePlayer(command) {
    notifyAll(command)
    console.log(`game.movePlayer() --> Moving ${command.playerId} with ${command.keyPressed}`)
    const acceptedMoves = {
      ArrowUp(player) {
        if (player.y - 1 >= 0) {
          player.y -= 1
          return
        }
      },
      ArrowRight(player) {
        if (player.x + 1 < state.screen.width) {
          player.x += 1
          return
        }
      },
      ArrowDown(player) {
        if (player.y + 1 < state.screen.height) {
          player.y += 1
          return
        }
      },
      ArrowLeft(player) {
        if (player.x - 1 >= 0) {
          player.x -= 1
          return
        }
      },
    }

    const keyPressed = command.keyPressed;
    const playerId = command.playerId;
    const player = state.players[playerId];
    const moveFunction = acceptedMoves[keyPressed];

    if (player && moveFunction) {
      moveFunction(player)
      checkForFruitColision(playerId)
    }
  }



  return {
    start,
    subscribe,
    setState,
    addPlayer,
    addFruit,
    removePlayer,
    removeFruit,
    movePlayer,
    state
  }
}

