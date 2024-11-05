//creacion del objeto TABLA_CONFIG
let iterador = 1;

const TABLA_CONFIG = {

    // Lista de parametros para filtrar
    requiredProps: ['ElementId', 'Name', 'Category', 'Area', 'Volume', 'Level', 'Base Constraint', 'IP_ING_Tipo Elemento', 'Phase Created', 'Edited by'],

    responsiveLayout:true,

    columns:[
        {title:'Id Elemento', field:'idValue',responsive:3},
        {title: 'Contador',field:'enumeradorValue',responsive:1},
        //{title: 'Nombre', field:'name', with:150,responsive:0},
        {title: 'Categoria',field:'categoryValue',responsive:1},
        {title: 'Area', field:'areaValue',responsive:0,topCalc:"sum",topCalcParams:{precison:1,}},
        {title: 'Volumen', field: 'volumenValue',responsive:0,topCalc:"sum",topCalcParams:{precison:1,}},
        {title: 'Cantidad', field: 'countValue',responsive:0,topCalc:"sum",topCalcParams:{precison:1,}},
        {title:'Nivel',field:'nivelValue',responsive:0},
        {title: 'Tipologia Elemento',field:'tipologiaValue',responsive:1},
        {title: 'Fase Creacion',field:'faseCreacionValue',responsive:1},
        // {title: 'Ultimo Editor',field:'byEditValue',responsive:1},
        {title: 'Unico Id',field:'dbidser',responsive:1},
        

    ],
    // Creacion de cada fila para cada elemento
    createRow:(id,name,props) =>{
        const idValue = props.find(p => p.displayName === 'ElementId')?.displayValue;
        const enumeradorValue = iterador++;
        const categoryValue = props.find(p => p.displayName === 'Category')?.displayValue;
        const areaValue = props.find(p => p.displayName ==='Area')?.displayValue;
        const volumenValue = props.find(p => p.displayName ==='Volume')?.displayValue;
        const countValue = 1;
        const nivelValue = props.find(p => p.displayName ==='Level' || p.displayName ==='Base Constraint')?.displayValue;
        const tipologiaValue = props.find(p => p.displayName === 'IP_ING_Tipo Elemento')?.displayValue;
        const faseCreacionValue = props.find(p => p.displayName === 'Phase Created')?.displayValue;
        const byEditValue = props.find(p => p.displayName === 'Edited by')?.displayValue;
        const idModelValue = id;
        //console.log("enumerador", enumeradorValue);
        
        
        return {idValue,name, categoryValue,areaValue,volumenValue,countValue,nivelValue,tipologiaValue,faseCreacionValue,byEditValue,idModelValue,enumeradorValue};
    },
    
    
    // Esta parte es para darle isolate a los elementos seleccionados de la tabla
    onRowClick: (rower,viewer) =>{
        //console.log("se esta aislando el id:", rower.dbidser);
        if (!viewer.model) {
            console.error("El modelo no está cargado.");
            return;
        }
        
        console.log("se activo el click en la tabla",rower);
        viewer.isolate(rower.dbidser);

        // viewer.getObjectTree((tree) => {
        //     // Llamar a fitToView con el ID del objeto aislado
        //     //viewer.fitToView(rower.dbidser, viewer.modelo);
        //     console.log("asi se muestra el modelo para la tabla",viewer.modelo);    
        //     if (!modelo) {
        //         console.error("El modelo no está definido.");
        //         return;
        //     }
            
        // });

        // viewer.fitToView([rower.dbidser], modelo);
        //viewer.toggleSelect([row.dbid],Autodesk.Viewing.SelectionType.OVERLAYED);
        //viewer.toggleVisibility([row.dbid]);
    }
};

export class TablaPanel extends Autodesk.Viewing.UI.DockingPanel{
    constructor(extension,id,title,options){
        super(extension.viewer.container,id,title,options);
        this.extension = extension;
        this.container.style.left = (options.x || 0) + 'px';
        this.container.style.top = (options.y || 0) + 'px';
        this.container.style.width = (options.width || 500) + 'px';
        this.container.style.height = (options.height || 400) + 'px';
        this.container.style.resize = 'both';
        this.container.style.ovwrflow = 'overlay';
        this.model = extension.viewer.model;
        this.viewer = extension.viewer;

        //this.extension.viewer.panel = this;
    }

    initialize() {
        this.title = this.createTitleBar("TABLA DE CANTIDADES" || this.titleLabel || this.container.id);
        this.initializeMoveHandlers(this.title); // permite mover el panel dentro del viewer
        this.container.appendChild(this.title); // permite tener encabezado
        this.content = document.createElement('div');
        this.content.style.height = '550px';
        this.content.style.backgroundColor = 'white';
        this.content.innerHTML = `<div class="tabla-container" style="position: relative; height: 450px;"></div>`;
        this.container.appendChild(this.content);
        console.log("aqui se inicializa el panel", this.model);
        
        // See http://tabulator.info
        this.table = new Tabulator('.tabla-container', {
            height: '100%',
            layout: 'fitColumns',
            columns: TABLA_CONFIG.columns,
            groupBy: TABLA_CONFIG.groupBy,
            selectable:true,
            rowClick: (event, row) => {
                console.log("probando el click", this.model);
                
                // Obtiene los datos de la fila que fue clickeada
                const rowData = row.getData();
                
                console.log("revisando el uso de extesnisonviewer",this.model);
                console.log("revisando el uso de extesnisonviewer",this.viewer);

                // Aislar el elemento en el visor de Autodesk usando su ID
                const dbId = rowData.dbidser; // Suponiendo que dbidser es el ID del elemento
                //this.extension.viewer.isolate(dbId); // Aislar el elemento
                this.viewer.fitToView(dbId, this.viewer.model);
                this.viewer.isolate(dbId, this.viewer.model);

                

                


                
            }
        });


        
        
        this.exportbutton = document.createElement('button');
        this.exportbutton.innerHTML = 'EXPORTAR XLSX';
        this.exportbutton.style.width = (this.options.buttonWidth || 100) + 'px';
        this.exportbutton.style.height = (this.options.buttonHeight || 30) + 'px';
        this.exportbutton.style.margin = (this.options.margin || 5) + 'px';
        this.exportbutton.style.verticalAlign = (this.options.verticalAlign || 'middle');
        this.exportbutton.style.backgroundColor = (this.options.backgroundColor || 'white');
        this.exportbutton.style.borderRadius = (this.options.borderRadius || 8) + 'px';
        this.exportbutton.style.borderStyle = (this.options.borderStyle || 'groove');
        this.exportbutton.style.color = "black";

        this.exportbutton.onclick = this.exportExcel.bind(this);
        this.container.appendChild(this.exportbutton);
    }

    exportExcel(){
        let data = this.table.download("xlsx","PLANILLA DETALLADA DE CANTIDADES.xlsx",{sheetName:"DATA"});
        console.log("LA TABLA A SIDO EXPORTADA!",data);
    }

    // este metodo update lo que hace es 
    updateDataTable(modelo,dbidser){
        
        modelo.getBulkProperties(dbidser,{propFilter:TABLA_CONFIG.requiredProps},(results) =>{
            const arrayProps = results.map((result) => TABLA_CONFIG.createRow(result.dbider,result.name,result.properties));
            const arrayPropsAll = dbidser.map((dbidser, index) => ({ dbidser, ...arrayProps[index] }));
            this.table.replaceData(arrayPropsAll);         
        },(err)=>{
            console.error(err);
        });
    }
    // const modelo = this.viewer.model;
    // console.log("aqui probando el modelo", modelo);

}

