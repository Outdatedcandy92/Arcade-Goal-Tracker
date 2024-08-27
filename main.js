/* popUp() Logic */
function popUp(ImgSrc) {
    const imageContainer = document.getElementById("imageContainer");
    const popUpDiv = document.getElementById("popUp");

    imageContainer.src = ImgSrc;
    popUpDiv.style.display = "flex";
}

/* dismissPopUp() Logic */
function dismissPopUp() {
    document.getElementById("popUp").style.display = "none";
}

/* populateTable() Logic */
function populateTable() {
    fetch("data.json")
        .then(response => response.json())
        .then(data => {
            const sortedData = data.reduce((acc, item) => {
                item.stock === 0 ? (item.hours = "SOLD OUT", acc.outOfStock.push(item)) : acc.inStock.push(item);
                return acc;
            }, { inStock: [], outOfStock: [] });

            sortedData.inStock.sort((a, b) => parseInt(a.hours) - parseInt(b.hours));
            const finalData = sortedData.inStock.concat(sortedData.outOfStock);

            appendDataToTable(finalData);
        })
        .catch(error => console.error("Error:", error));
}

function appendDataToTable(dataArray) {
    const tableBody = document.getElementById("table-body");

    dataArray.forEach((data, index) => {
        const descriptionHTML = data.description && data.description !== "undefined"
            ? `<h6><span>DESCRIPTION</span>: ${data.description}</h6>`
            : "";

        const row = document.createElement("tr");

        let hoursHTML = `<td>🎟️${data.hours}</td>`;
        let inputFieldHTML = `
            <td>
                <button class="decrement">-</button>
                <input type="number" value="0" min="0" step="1">
                <button class="increment">+</button>
            </td>
        `;

        if (data.hours === "SOLD OUT") {
            hoursHTML = `<td colspan="2">🎟️${data.hours}</td>`;
            inputFieldHTML = "";
        }

        row.innerHTML = `
            <td>${index + 1}</td>
            <td><img onclick="popUp(this.src)" src="${data.imageURL}"></td>
            <td>
                <div>
                    <h3>${data.name}</h3>
                    ${descriptionHTML}
                </div>
            </td>
            ${hoursHTML}
            ${inputFieldHTML}
        `;

        tableBody.appendChild(row);

        if (data.hours !== "SOLD OUT") {
            const inputField = row.querySelector("input[type='number']");
            row.querySelector(".decrement").addEventListener("click", () => inputField.value = Math.max(0, parseInt(inputField.value) - 1));
            row.querySelector(".increment").addEventListener("click", () => inputField.value = parseInt(inputField.value) + 1);
        }
    });
}

/* logTableData() Logic */
function logTableData() {
    const currentTicketValue = parseInt(document.getElementById("currentTicket").value);
    const tableRows = document.querySelectorAll("#table-body tr");
    let totalTicketsSum = 0;

    tableRows.forEach((row, index) => {
        const inputField = row.querySelector("input[type='number']");
        if (inputField) {
            const inputValue = parseInt(inputField.value);
            if (inputValue > 0) {
                const ticketsCell = row.querySelector("td:nth-child(4)");
                if (ticketsCell) {
                    const tickets = parseInt(ticketsCell.textContent.replace("🎟️", ""));
                    const totalTickets = tickets * inputValue;
                    totalTicketsSum += totalTickets;
                    console.log(`Row ${index + 1}: Name: ${row.querySelector("td:nth-child(3)").textContent.trim()}, Total Tickets: ${totalTickets}, Quantity: ${inputValue}`);
                }
            }
        }
    });

    console.log(`Aggregate Total of Tickets across your Selection: ${totalTicketsSum}`);

    const timeDifference = new Date("August 31, 2024").getTime() - new Date().getTime();
    const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    const remainingTickets = totalTicketsSum - currentTicketValue;

    document.getElementById("info-div").style.display = "block";
    const hoursPerDay = (remainingTickets / daysLeft).toFixed(2);

    document.getElementById("info-text").textContent = remainingTickets <= 0 ? "You've got enough tickets.": `You would need to complete a total of ${remainingTickets} tickets in the next ${daysLeft} days. That's an average of ${hoursPerDay} tickets per day.`;
};

document.addEventListener("DOMContentLoaded", populateTable);