import { Layer } from "../../models";

export type Point3D = { x: number, y: number, z: number };
export type Point2D = { x: number, y: number };

export function translate(point: Point3D, offset: Point3D): Point3D {
    return {
        x: point.x - offset.x,
        y: point.y - offset.y,
        z: point.z - offset.z
    };
}

export function rotateX(point: Point3D, angle: number): Point3D {
    const rad = (Math.PI / 180) * angle;
    const cosAngle = Math.cos(rad);
    const sinAngle = Math.sin(rad);
    return {
        x: point.x,
        y: point.y * cosAngle - point.z * sinAngle,
        z: point.y * sinAngle + point.z * cosAngle
    };
}

export function perspectiveProjection(point: Point3D, focalLength: number, cameraDistance: number): Point2D {
    return {
        x: (focalLength * point.x) / (point.z + cameraDistance),
        y: (focalLength * point.y) / (point.z + cameraDistance)
    };
}

export function convertPoint3DTo2D(point: Point3D, layer: Layer): Point2D {
        const cameraOffset: Point3D = { x: layer.offset[0], y: -layer.offset[1], z: -layer.offset[2] };
        const point3D: Point3D = { x: point.x, y: -point.y, z: -point.z };
        const translatedPoint = translate(point3D, cameraOffset);
        const rotatedPoint = rotateX(translatedPoint, layer.rotation);
        const projectedPoint: Point2D = perspectiveProjection(rotatedPoint, 410, layer.distance);
        return {x: -projectedPoint.y, y: projectedPoint.x}
}
