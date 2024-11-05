// table.js

export async function fetchModelData(urn) {
    try {
        const resp = await fetch(`/api/models/${urn}/data`);
        if (!resp.ok) {
            throw new Error(await resp.text());
        }
        return await resp.json(); // Suponiendo que la respuesta es un JSON con los datos
    } catch (err) {
        alert('Could not fetch model data. See the console for more details.');
        console.error(err);
    }
}

export function generateTable(data) {
    const table = document.createElement('table');
    table.className = 'model-data-table';

    // Generar encabezados
    const headerRow = document.createElement('tr');
    Object.keys(data[0]).forEach(key => {
        const th = document.createElement('th');
        th.textContent = key;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Generar filas
    data.forEach(item => {
        const row = document.createElement('tr');
        Object.values(item).forEach(value => {
            const td = document.createElement('td');
            td.textContent = value;
            row.appendChild(td);
        });
        table.appendChild(row);
    });

    return table;
}

export async function displayModelData(viewer, urn) {
    const data = await fetchModelData(urn);
    if (data) {
        const table = generateTable(data);
        const container = document.getElementById('data-table-container'); // Asegúrate de tener un contenedor en tu HTML
        container.innerHTML = ''; // Limpiar contenido anterior
        container.appendChild(table);
    }
}
