/// import * as Autodesk from "@types/forge-viewer";
/*gestiona la inicialización del visor de Autodesk y la carga de modelos en él.
Utiliza la función getAccessToken para obtener un token de acceso necesario para autenticar las solicitudes.
Proporciona funciones para inicializar el visor y cargar modelos, manejando tanto el éxito como el fracaso de las operaciones de carga */
import './extensions/PlantillaBoton.js';
import './extensions/CameraRotateExtension.js';
import './extensions/TablaExtension.js';
import './extensions/HistogramExtension.js';
async function getAccessToken(callback) {
    try {
        const resp = await fetch('/api/auth/token');
        if (!resp.ok) {
            throw new Error(await resp.text());
        }
        const { access_token, expires_in } = await resp.json();
        callback(access_token, expires_in);
    } catch (err) {
        alert('Could not obtain access token. See the console for more details.');
        console.error(err);
    }
}

export function initViewer(container) {
    return new Promise(function (resolve, reject) {
        Autodesk.Viewing.Initializer({ env: 'AutodeskProduction', getAccessToken }, function () {
            const config = {
                extensions: [
                    'Autodesk.DocumentBrowser',
                    'PlantillaBoton',
                    'CameraRotateExtension',
                    'TablaExtension',
                    'HistogramExtension',

                ]
            };
            const viewer = new Autodesk.Viewing.GuiViewer3D(container, config);
            viewer.start();
            viewer.setTheme('light-theme');
            resolve(viewer);
        });
    });
}

export function loadModel(viewer, urn) {
    return new Promise(function (resolve, reject) {
        function onDocumentLoadSuccess(doc) {
            resolve(viewer.loadDocumentNode(doc, doc.getRoot().getDefaultGeometry()));
        }
        function onDocumentLoadFailure(code, message, errors) {
            reject({ code, message, errors });
        }
        viewer.setLightPreset(0);
        Autodesk.Viewing.Document.load('urn:' + urn, onDocumentLoadSuccess, onDocumentLoadFailure);
    });
}
