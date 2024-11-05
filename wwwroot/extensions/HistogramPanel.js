
//CLASE PARA DESPLEGAR EL PANEL DE HERRAMIENTAS CON LOS BOTONES DE GRAFICAS  https://www.chartjs.org/docs/latest
export class HistogramPanel extends Autodesk.Viewing.UI.DockingPanel {
    constructor(extension, id, title, options) {
        super(extension.viewer.container, id, title, options);
        this.extension = extension;
        this.container.style.left = (options.x || 0) + 'px';
        this.container.style.top = (options.y || 0) + 'px';
        this.container.style.width = (options.width || 450) + 'px';
        this.container.style.height = (options.height || 600) + 'px';
        this.container.style.resize = 'none';
        this.chartType = options.chartType || 'bar'; 
        this.chart = this.createChart();
    }

    initialize() {
        this.title = this.createTitleBar(this.titleLabel || this.container.id);
        this.initializeMoveHandlers(this.title);
        this.container.appendChild(this.title);
        this.content = document.createElement('div');
        this.content.style.height = '250px';
        this.content.style.backgroundColor = 'transparent';
        this.content.innerHTML = `
            <div class="props-container" style="position: relative; height: 25px; padding: 0.5em;">
                <select class="props"></select>
            </div>
            <div class="chart-container" style="position: relative; height: 325px; padding: 0.5em;">
                <canvas class="chart"></canvas>
            </div>
        `;
        this.select = this.content.querySelector('select.props');
        this.canvas = this.content.querySelector('canvas.chart');
        this.container.appendChild(this.content);
        console.log("aqui se evidencia la primera variable_ evei 1",this.select);
        console.log("aqui se evidencia la primera variable_ evei 2",this.select.value);
    }
                    
    createChart() {
        return new Chart(this.canvas.getContext('2d'), {
            type: this.chartType,
            data: {
                labels: [],
                datasets: [{ data: [], backgroundColor: [], borderColor: [], borderWidth: 1 }],
            },
            options: { maintainAspectRatio: false }
        });
    }

    /// INTERACTUO CON LA METADATA DEL MODELO 
    async setModel(model) {
        console.log("aqui se evidencia la primera variable1",this.select);
        const propertyNames = await this.extension.findPropertyNames(model);
        console.log("aqui se evidencia la primera variable2",this.select);
        console.log("aqui se evidencia la primera variable23",propertyNames[1]);
        this.select.innerHTML = propertyNames.map(prop => `<option value="${prop}">${prop}</option>`).join('\n');
        console.log("aqui se evidencia la primera variable3",this.select);
        this.select.onchange = () => this.updateChart(model, this.select.value); // este codigo permite cambia la propiedad
        this.updateChart(model, propertyNames[1]);//actualizar a valor por defecto
        console.log("aqui se evidencia la primera variable",this.select);
        
    }

    async updateChart(model, propName) {
        console.log("contador de cambios");
        this.colorChange(model);
        const histogram = await this.extension.findPropertyValueOccurrences(model, propName); // este propName es el que tiene parametros
        const propertyValues = Array.from(histogram.keys());
        this.chart.data.labels = propertyValues;
        const dataset = this.chart.data.datasets[0];
        dataset.label = propName;
        dataset.data = propertyValues.map(val => histogram.get(val).length);

        
        // let generatedColors = [];
        // if (dataset.data.length > 0) {
        //     generatedColors = dataset.data.map((val, index) => `hsla(${Math.round(index * (360 / dataset.data.length))}, 100%, 50%, 0.5)`);
        //     dataset.backgroundColor = dataset.borderColor = generatedColors;
        // }

        let generatedColors = [];
        if (dataset.data.length > 0) {
            const colorCount = dataset.data.length;
            
            // Generar colores espaciados de forma uniforme en el espectro
            generatedColors = dataset.data.map((val, index) => {
                // Espaciar los matices por todo el espectro (360°)
                const hue = (index * 137.508) % 360;  // Usar el número áureo para evitar cercanía
                const saturation = 90;                // Mantener alta saturación para colores vibrantes
                const lightness = 50;                 // Luminosidad equilibrada
        
                return `hsla(${Math.round(hue)}, ${saturation}%, ${lightness}%, 0.7)`;  // Opacidad del 70%
            });
        
            dataset.backgroundColor = dataset.borderColor = generatedColors;
        }

        this.chart.update();

        console.log("mostrando dataset", dataset.data);
        
        // const index = items[0].index;
        const dbids = [];

        for (let i = 0; i < dataset.data.length; i++) {
            dbids[i] = histogram.get(propertyValues[i]);
        }

        console.log(dbids);
        
        
        
        // console.log("muestra de filtro IDSA", dbids);
        
        //const dbids = await this.extension.findLeafNodes(model);
        //const dbids = dataset.data;
        await this.colorChange(model, dbids, generatedColors);

        this.chart.config.options.onClick = (ev, items) => {
            if (items.length === 1) {
                
                const index = items[0].index;
                console.log("mostrando el items a secas", items);

                console.log("mostrando el items", items[0]);
                console.log("mostrando el index2", index);

                console.log("mostrando el property",propertyValues[index]);
                    
                const dbids = histogram.get(propertyValues[index]);

                console.log("mostrando el dbids del puie",dbids);

                var red = new THREE.Vector4(1, 0, 0, 1);
                console.log("revisar si se imprmie0");

                this.extension.viewer.isolate(dbids);
                console.log("revisar si se imprmie1");
                this.extension.viewer.select(dbids,model,Autodesk.Viewing.SelectionType.OVERLAYED);
                console.log("revisar si se imprmie2");
                
                // this.extension.viewer.setSelectionColor(red,Autodesk.Viewing.SelectionType.OVERLAYED);
                // this.extension.viewer.isolate(dbids);
                // this.extension.viewer.fitToView(dbids);

                
            }
        };
    }

    async colorChange(model, dbids, generatedColors) {
    
        for (let i = 0; i < dbids.length; i++) {
            
            let colorHsla = generatedColors[i % generatedColors.length];
            
            
            let colorRGB = this.hexToRgb(colorHsla); 
            let colorVector = new THREE.Vector4(colorRGB.r / 255, colorRGB.g / 255, colorRGB.b / 255, 1);
    
            
            for (let j = 0; j < dbids[i].length; j++) {
                let id = dbids[i][j];
                console.log(`Aplicando color ${colorRGB} al nodo ${id}`);
    
                
                this.extension.viewer.setThemingColor(id, colorVector);
            }
        }
    }

    hexToRgb(hsla) {
        const [h, s, l, a] = hsla.match(/hsla?\((\d+),\s*(\d+)%,\s*(\d+)%.*\)/).slice(1, 5).map(Number);
    
        const c = (1 - Math.abs(2 * l / 100 - 1)) * (s / 100);
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l / 100 - c / 2;
    
        let r = 0, g = 0, b = 0;
    
        if (0 <= h && h < 60) { r = c; g = x; b = 0; }
        else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
        else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
        else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
        else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
        else if (300 <= h && h < 360) { r = c; g = 0; b = x; }
    
        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);
    
        return { r, g, b };
    }



    // async colorChange(model) {
    //     const dbids = await this.extension.findLeafNodes(model);   
    //     let colorHex = "#FF0000"; // Color rojo
    //     let colorRGB = this.hexToRgb(colorHex); // Convertir el color a RGB
    //     let colorVector = new THREE.Vector4(colorRGB.r / 255, colorRGB.g / 255, colorRGB.b / 255, 1); 
        
        
    //     console.log("Color RGB:", colorRGB);
    //     console.log("Color Vector:", colorVector);
    //     // this.viewer.clearThemingColors();
        
    //     for (let i = 0; i < dbids.length; i++) {
    //         this.extension.viewer.setThemingColor(dbids[i], colorVector);
    //     }
    // }

    // hexToRgb(hex) {
    //     // Expandir la forma abreviada (ej. "03F") a la forma completa (ej. "0033FF")
    //     var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    //     hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    //         return r + r + g + g + b + b;
    //     });

    //     var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    //     return result ? {
    //         r: parseInt(result[1], 16),
    //         g: parseInt(result[2], 16),
    //         b: parseInt(result[3], 16)
    //     } : null;
    // }

}