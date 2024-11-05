import { BaseExtension } from "./BaseExtension.js";


class PlantillaBoton extends BaseExtension{
    constructor(viewer, options){
        super(viewer,options);
        this._button = null;
    }
    // onToolbarCreated: Cuando se crea la barra de herramienta
    onToolbarCreated(){ 
        // De esta forma se crea el boton con su icono
        this._button = this.createToolbarButton('nuevoIconoPlantilla', 'https://img.icons8.com/ios-glyphs/30/link--v1.png','Texto Flotante');
    }
}  
// Registrar la extension llamando al siguente codigo
Autodesk.Viewing.theExtensionManager.registerExtension('PlantillaBoton', PlantillaBoton);
// Para que funciona el icono se tiene que importar en "viewer.js" e instanciarlo