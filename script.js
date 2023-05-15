const allData = (() => {
    try {
        return JSON.parse(localStorage.getItem("data")) || []
    } catch {
        return []
    }

    return []
})();

function fetchData() {

    const countryInput = document.getElementById('countryInput');
    const country = countryInput.value.toLowerCase().trim();

    if (allData.length) {
        const filteredData = allData.filter(item => item.country.toLowerCase() === country);
        generateTable(filteredData);
    } else {
        fetch(`https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json`)
            .then(response => response.json())
            .then(data => {
                localStorage.setItem("data", JSON.stringify(data))

                const filteredData = data.filter(item => item.country.toLowerCase() === country);

                generateTable(filteredData);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

}

function generateTable(data) {
    const tableContainer = document.getElementById('tableContainer');

    tableContainer.innerHTML = '';

    if (data.length === 0) {
        tableContainer.innerHTML = '<p>No results found.</p>';
        return;
    }

    const table = document.createElement('table');
    table.className = 'result-table';

    const customTd = {
        web_pages: (webPages) => {
            const linkList = document.createElement('ul');
            webPages.forEach(webPage => {
                const linkItem = document.createElement('li');
                const link = document.createElement('a');
                link.href = webPage;
                link.textContent = webPage;
                linkItem.appendChild(link);
                linkList.appendChild(linkItem);

            });

            return linkList;
        }
    }

    const headers = Object.keys(data[0]);
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const numberSymbol = "№";
    headers.forEach((header, i) => {
        if (i === 0) {
            const thNumber = document.createElement('th');
            thNumber.textContent = numberSymbol;
            headerRow.appendChild(thNumber);
        }
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    data.forEach((item, index) => {
        const row = document.createElement('tr');

        (() => {
            const td = document.createElement('td');
            td.textContent = index + 1;
            row.appendChild(td);
        })()

        headers.forEach((header, i) => {
            const td = document.createElement('td');
            if (customTd[header]) {
                const tdData = customTd[header](item[header]);
                td.appendChild(tdData);
            } else {
                td.textContent = item[header];
            }
            row.appendChild(td);
        });

        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    tableContainer.appendChild(table);
}

function resetForm() {
    document.getElementById('countryInput').value = '';
    document.getElementById('tableContainer').innerHTML = '';
}