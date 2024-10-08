import { conScale, dialogueData } from './const.js';
import {k} from './kaboom.js' ;
import { displayDialogue, setCamScale } from './utils.js';

k.loadSprite('sheet' , 'public/spritesheet.png', {
    sliceX : 39,
    sliceY:31,
    anims:{
        'idle-down':936,
        'walk-down': { from : 936, to :939, loop : true, speed : 8 },
        'idle-side':975,
        'walk-side': { from : 975, to :978, loop : true, speed : 8 },
        'idle-up':1014,
        'walk-up': { from : 1014, to :1017, loop : true, speed : 8 },
    },
});

k.loadSprite('map' , 'public/map.png');
k.setBackground(k.Color.fromHex('#311047'));

k.scene('main', async ()=>{
    const mapData =  await (await fetch('public/map.json')).json()
    const layers = mapData.layers;
    const map = k.add([
        k.sprite ('map'),
        k.pos(),
        k.scale(conScale)
    ])

    const player = k.make([
      k.sprite("sheet", { anim: "idle-down" }),
      k.area({
        shape: new k.Rect(k.vec2(0, 3), 10, 10),
      }),
      k.body(),
      k.anchor("center"),
      k.pos(),
      k.scale(conScale),
      {
        speed: 250,
        direction: "down",
        isInDialogue: false,
      },
      "player",
    ]);

    for (const layer of layers ){
        if (layer.name === 'boundaries'){

            for (const boundary of layer.objects){
                map.add([
                    k.area({ 
                        shape : new k.Rect(k.vec2(0) , boundary.width , boundary.height),
                }),
                k.body({isStatic : true}),
                k.pos(boundary.x , boundary.y),
                boundary.name,
                ])
                if(boundary.name){
                    player.onCollide(boundary.name , ()=>{
                        player.isIndisp=true;
                        displayDialogue( dialogueData[boundary.name], ()=>{
                            player.isIndisp=false;
                        })
                    });
                }
            }
            continue;

        }
        if(layer.name==='spawnpoint'){
            for ( const entity of layer.objects){
                if (entity.name==='player'){
                    player.pos=k.vec2(
                        (map.pos.x + entity.x)*conScale,
                        (map.pos.y + entity.y)*conScale
                    );
                    console.log('Player position set:', player.pos);
                        k.add(player)
                        continue
                    
                }
            }
        }
    }
    setCamScale(k);

    k.onResize(() => {
      setCamScale(k);
    });
  

k.onUpdate(()=>{
    k.camPos(player.pos.x , player.pos.y + 100);
})

k.onMouseDown((mouseBtn) => {
    if (mouseBtn !== "left" || player.isIndisp) return;

    const worldMousePos = k.toWorld(k.mousePos());
    player.moveTo(worldMousePos, player.speed);


    //player directions movements

    const mouseAngle = player.pos.angle(worldMousePos);

    const lowerBound = 50;
    const upperBound = 125;

    if (
        mouseAngle > lowerBound &&
        mouseAngle < upperBound &&
        player.curAnim() !== "walk-up"
      ) {
        player.play("walk-up");
        player.direction = "up";
        return;
      }

      if (
        mouseAngle < -lowerBound &&
        mouseAngle > -upperBound &&
        player.curAnim() !== "walk-down"
      ) {
        player.play("walk-down");
        player.direction = "down";
        return;
      }


      if (Math.abs(mouseAngle) > upperBound) {
        player.flipX = false;
        if (player.curAnim() !== "walk-side") player.play("walk-side");
        player.direction = "right";
        return;
      }
  
      if (Math.abs(mouseAngle) < lowerBound) {
        player.flipX = true;
        if (player.curAnim() !== "walk-side") player.play("walk-side");
        player.direction = "left";
        return;
      }

})


// Handle keyboard input for player movement
k.onKeyDown("left", () => {
  if (player.isIndisp) return;
  player.move(-player.speed, 0);
  if (player.curAnim() !== "walk-side" || player.direction !== "left") {
      player.play("walk-side");
      player.flipX = true;
      player.direction = "left";
  }
});

k.onKeyDown("right", () => {
  if (player.isIndisp) return;
  player.move(player.speed, 0);
  if (player.curAnim() !== "walk-side" || player.direction !== "right") {
      player.play("walk-side");
      player.flipX = false;
      player.direction = "right";
  }
});

k.onKeyDown("up", () => {
  if (player.isIndisp) return;
  player.move(0, -player.speed);
  if (player.curAnim() !== "walk-up") {
      player.play("walk-up");
      player.direction = "up";
  }
});

k.onKeyDown("down", () => {
  if (player.isIndisp) return;
  player.move(0, player.speed);
  if (player.curAnim() !== "walk-down") {
      player.play("walk-down");
      player.direction = "down";
  }
});


function stopMov() {
    if (player.direction === "down") {
      player.play("idle-down");
      return;
    }
    if (player.direction === "up") {
      player.play("idle-up");
      return;
    }

    player.play("idle-side");
  }

  k.onKeyRelease(stopMov);

  k.onMouseRelease(stopMov);

})
k.go('main');

