console.log("hola mundo");
class Dashboard {
    constructor(viewer, panels, progressData) {
        //var _this = this;
        this._viewer = viewer;
        this._panels = panels;
        this._progressData = progressData;
        this.adjustLayout();
        // this._viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, (viewer) => {
        //     _this.loadPanels();
        // });
    }

    adjustLayout() {
        // this function may vary for layout to layout...
        // for learn forge tutorials, let's get the ROW and adjust the size of the 
        // columns so it can fit the new dashboard column, also we added a smooth transition css class for a better user experience
        var row = $(".row").children();
        $(row[0]).removeClass('col-sm-4').addClass('col-sm-2 transition-width');
        $(row[1]).removeClass('col-sm-8').addClass('col-sm-7 transition-width').after('<div class="col-sm-3 transition-width" id="dashboard"></div>');
        //console.log("adjustLayout");
        this.loadPanels();
        this._viewer.resize();
    }

    loadPanels () {
        var _this = this;
        var data = new ModelData(this._viewer, this._progressData);
        data.init(function () {
            $('#dashboard').empty();
            _this._panels.forEach(function (panel) {
                // let's create a DIV with the Panel Function name and load it
                panel.load('dashboard', viewer, data);
            });
        });
    }
}