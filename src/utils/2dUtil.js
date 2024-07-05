import * as THREE from 'three'
// 求p点在线段上的最近点和距离
export function calculatePointOnLineNear(s, e, p){
    console.log(s, e, p);
    const line3d = new THREE.Line3(s, e);
    const resultPoint = new THREE.Vector3();
    line3d.closestPointToPoint(p, true, resultPoint)
    const length = p.distanceTo(resultPoint);
    return {
        p: {x: resultPoint.x, y: resultPoint.y},
        dis: length
    }
}
