/**
 * 公共方法
 */
import * as THREE from 'three'
let spriteMaterial = new THREE.SpriteMaterial();
let textImgParam = {
  fontSize: 28,
  fontColor: "#ffffff",
  text: ["文字"],
  offsetY: 1,
  url: '',
  scale: new THREE.Vector3(5, 5, 5),
  position: new THREE.Vector3(0, 0, 0),
}
function spriteTextImg(param) {
  return new Promise((resolve) => {
      let textImgParam1 = Object.assign({}, textImgParam, param);

      let canvas = document.createElement('canvas');
      let context = canvas.getContext('2d');

      //1.将背景绘画出来
      let canvasBg = document.createElement('canvas');
      let ctxBg = canvasBg.getContext('2d');
      let bgImg = new Image();
      bgImg.src = textImgParam1.url;
      bgImg.onload = function () {
          //使用原图片的高宽避免形变
          canvas.width = bgImg.width;
          canvas.height = bgImg.height;

          canvasBg.width = bgImg.width;
          canvasBg.height = bgImg.height;

          //将原图片全部绘画到canvas中
          ctxBg.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

          //2.文字绘画
          let textArr = [];
          for (let index = 0; index < textImgParam1.text.length; index++) {

              textArr.push(createText({
                  width: canvasBg.width / textImgParam1.text.length,
                  height: canvasBg.height * textImgParam1.offsetY,
                  fontSize: textImgParam1.fontSize,
                  fontColor: textImgParam1.fontColor,
                  text: textImgParam1.text[index],
              }));

              if (textImgParam1.text.length == index + 1) {
                  let textAndBg = new Image();
                  textAndBg.src = textArr[0].toDataURL();
                  textAndBg.onload = function () {
                      context.drawImage(bgImg, 0, 0);
                      textArr.forEach((textCanvas, i) => {
                          if (i == 0) {
                              context.drawImage(textCanvas, 0, 0);

                          } else {
                              context.drawImage(textCanvas, canvasBg.width / 2, 0);
                          }

                          if (textArr.length == i + 1) {
                              resolve(canvas);
                          }

                      });
                  }

              }

          }

      }

  });
}

function createText(param) {
  let text = param.text;
  let bgColor = param.bgColor ? param.bgColor : "#ffffff";
  let fontColor = param.fontColor ? param.fontColor : "#000000";
  let fontface = param.fontface ? param.fontface : "Arial";
  let fontsize = param.fontSize ? param.fontSize : 40;
  let borderThickness = param.borderThickness ? param.borderThickness : 5;

  let canvas = document.createElement('canvas');
  let context = canvas.getContext('2d');

  canvas.width = param.width ? param.width : 128;
  canvas.height = param.height ? param.height : 64;

  context.font = 'bold' + " " + fontsize + "px" + " " + fontface;
  context.fontWeight = "bold";
  context.fillStyle = fontColor ? fontColor : "#ffffff";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, canvas.width /2, canvas.height / 3);

  return canvas;
}

export function createSpriteTextImg(param, callBack) {
  spriteTextImg(param).then(canvas => {
      let texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      let spriteMaterialClone = spriteMaterial.clone();
      spriteMaterialClone.map = texture;
      let sprite = new THREE.Sprite(spriteMaterialClone);
      let scale = param.scale ? param.scale : new THREE.Vector3(10, 10, 10);
      let position = param.position ? param.position : new THREE.Vector3(0, 0, 0);
      sprite.scale.set(scale.x, scale.y, scale.z);
      sprite.position.set(position.x, position.y, position.z);
      sprite.name = param.name ? param.name : '';
      callBack && callBack(sprite);
  });
}

export function getContainerXY(event, container) {
  let rect = container.getBoundingClientRect();
  let click = getWindowXY(event);
  let point_left = click.x - rect.left;
  let point_top = click.y - rect.top;
  return new THREE.Vector2((point_left / rect.width) * 2 - 1, -(point_top / rect.height) * 2 + 1);
}

export function getWindowXY(event) {
  let x = 0;
  let y = 0;
  if (event.changedTouches) {
      x = event.changedTouches[0].pageX;
      y = event.changedTouches[0].pageY;
  } else {
      x = event.clientX;
      y = event.clientY;
  }

  return new THREE.Vector2().set(x, y);
}

export function getObjectAndPoint(mouse, raycaster, camera, pickArry) {
  raycaster.setFromCamera(mouse, camera);
  let intersects = raycaster.intersectObjects(pickArry, true);
  if (!intersects) return false;
  let intersectObj = {};
  if (intersects.length > 0) {
      for (let i = 0; i < intersects.length; i++) {
          if (intersects[i].object.isMesh) {
              intersectObj = intersects[i];
              break;
          }
      }
  }

  if (!intersectObj) return false;

  return {
      object: intersectObj.object ? intersectObj.object : null,
      point: intersectObj.point,
      boxName: intersectObj.boxName ? intersectObj.boxName : null,
  };
}


