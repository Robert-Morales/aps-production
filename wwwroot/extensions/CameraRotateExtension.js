import { BaseExtension } from "./BaseExtension.js";

class CameraRotateExtension extends BaseExtension{
    constructor(viewer, options){
        super(viewer, options);
        this._button = null;
    }
    async load(){
        super.load();
        console.log("la extension de rotacion de camara fue cargado con exito");
        return true;
    }
    unload(){
        super.unload();
        return true;  
    }
    onToolbarCreated(){
        this._button = this.createToolbarButton('iconoEjemplo','https://img.icons8.com/windows/32/gear.png','Nuevo Boton');

        let viewer = this.viewer;
        let started = false; 

        let rotateCamera = () => {
            if (started) {
                requestAnimationFrame(rotateCamera);
            }

            const nav = viewer.navigation;
            const up = nav.getCameraUpVector();
            const axis = new THREE.Vector3(0, 0, 1);
            const speed = 10.0 * Math.PI / 180;
            const matrix = new THREE.Matrix4().makeRotationAxis(axis, speed * 0.1);
            let pos = nav.getPosition();
            pos.applyMatrix4(matrix);
            up.applyMatrix4(matrix);
            nav.setView(pos, new THREE.Vector3(0, 0, 0));
            nav.setCameraUpVector(up);
            

        };
        this._button.onClick = () =>{
            started = !started;
            if (started) {
                console.log("Inició la rotación"); 
                this.viewer.fitToView(0, this.viewer.model);
                rotateCamera();

            }else{
                console.log("Se detuvo la rotación"); 
            }                      
        };        
    }    
}

Autodesk.Viewing.theExtensionManager.registerExtension('CameraRotateExtension',CameraRotateExtension);
