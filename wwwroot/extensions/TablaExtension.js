//importar librerias o clases base, padre etc..
import { BaseExtension } from "./BaseExtension.js";
import { TablaPanel} from "./TablaPanel.js";
//generar un constructor
class TablaExtension extends BaseExtension{
    constructor(viewer,options){
        super(viewer,options);
        // aqui se inicializa las propiedades del boton y el panel como nulos
        this._button = null;
        this._panel = null;
    }
    // integrar metodos load() y unload()
    async load(){
        super.load();
        await Promise.all([
            this.loadScript('https://unpkg.com/tabulator-tables@4.9.3/dist/js/tabulator.min.js', 'Tabulator'),
            this.loadStylesheet('https://unpkg.com/tabulator-tables@4.9.3/dist/css/tabulator.min.css')
        ]);
        console.log('TablaExtension a sido cargado con exito');
        return true;
    }

    unload(){
        super.unload();
        if(this._button){
            this.removeToolbarButton(this._button);
            this._button = null;
        }
        if(this._panel){
            this._panel.SetVisible(false);
            this._panel.unititialize();
            this._panel = null;
        }
        console.log('TablaExtension a sido descargado con exito');
        return true;

    }

    onToolbarCreated(){
        this._panel = new TablaPanel(this,'CUANTIFICACIONES','TablaPanel',{x:10,y:10});
        this._button = this.createToolbarButton('TablaPanelButton','https://img.icons8.com/windows/32/steel-i-beam.png','Cuantificaciones');
        this._button.onClick = () =>{
            this._panel.setVisible(!this._panel.isVisible());
            this._button.setState(this._panel.isVisible() ? Autodesk.Viewing.UI.Button.State.ACTIVE : Autodesk.Viewing.UI.Button.State.INACTIVE);
            if (this._panel.isVisible() && this.viewer.model) {
                this.updateDataPanel();
                this.colorChange();
            }
            else{
                this.viewer.clearThemingColors();
            }

        };   
    }


    // onModelLoaded(model){
    //     super.onModelLoaded(model);
    //     if(this._panel && this._panel.isVisible()){
    //         this.updaterm();
    //         console.log("esto se ejecuta en el lugar 1");
            
    //     }
    // }

    async updateDataPanel(){    
        const dbids = await this.findLeafNodes(this.viewer.model);
        this._panel.updateDataTable(this.viewer.model,dbids);
        
        this.viewer.getObjectTree((tree) => {
            if (dbids.length > 0) {
                this.viewer.fitToView(dbids, this.viewer.model);
            }
        });

        

    }

    async colorChange() {
        const dbids = await this.findLeafNodes(this.viewer.model);   
        let colorHex = "#FF0000"; // Color rojo
        let colorRGB = this.hexToRgb(colorHex); // Convertir el color a RGB
        let colorVector = new THREE.Vector4(colorRGB.r / 255, colorRGB.g / 255, colorRGB.b / 255, 1); 
        
        console.log("El cambio de color está activado", dbids);
        console.log("Color RGB:", colorRGB);
        console.log("Color Vector:", colorVector);
        // this.viewer.clearThemingColors();
        console.log("Aplicando color a los nodos:", dbids);
        for (let i = 0; i < dbids.length; i++) {
            this.viewer.setThemingColor(dbids[i], colorVector);
        }
    }

    hexToRgb(hex) {
        // Expandir la forma abreviada (ej. "03F") a la forma completa (ej. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function (m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }




}

Autodesk.Viewing.theExtensionManager.registerExtension('TablaExtension',TablaExtension);