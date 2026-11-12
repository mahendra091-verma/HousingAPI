
// ======================================
// HOUSING API MANAGEMENT SYSTEM
// ======================================

const API_URL = "http://127.0.0.1:8000/houses/";

// HTML Elements
const housingForm = document.getElementById("housingForm");
const tableBody = document.querySelector("tbody");
const message = document.getElementById("message");


// ======================================
// 1. SHOW MESSAGE
// ======================================

function showMessage(text, success = true) {

    message.textContent = text;

    message.style.color = success ? "green" : "red";

}


// ======================================
// 2. GET ALL HOUSING RECORDS
// ======================================

async function getHousingRecords() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Unable to fetch housing records");
        }

        const houses = await response.json();

        displayHousingRecords(houses);

    }

    catch (error) {

        console.error(error);

        showMessage(error.message, false);

    }

}


// ======================================
// 3. DISPLAY HOUSING RECORDS
// ======================================

function displayHousingRecords(houses) {

    tableBody.innerHTML = "";

    houses.forEach((house) => {

        const row = document.createElement("tr");

        const values = [
            house.house_id,
            house.owner_name,
            house.district,
            house.area,
            house.status
        ];

        values.forEach((value) => {

            const cell = document.createElement("td");

            cell.textContent = value;

            row.appendChild(cell);

        });

        // Delete Button
        const actionCell = document.createElement("td");

        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {

            deleteHousingRecord(house.house_id);

        });

        actionCell.appendChild(deleteButton);

        row.appendChild(actionCell);

        tableBody.appendChild(row);

    });

}


// ======================================
// 4. ADD NEW HOUSING RECORD
// ======================================

housingForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const houseData = {

        house_id: document.getElementById("house_id").value.trim(),

        owner_name: document.getElementById("owner_name").value.trim(),

        district: document.getElementById("district").value.trim(),

        area: Number(document.getElementById("area").value),

        building_type: document.getElementById("building_type").value,

        status: document.getElementById("status").value

    };

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(houseData)

        });

        if (!response.ok) {

            throw new Error("Unable to add housing record");

        }

        showMessage("Housing record added successfully!");

        housingForm.reset();

        getHousingRecords();

    }

    catch (error) {

        console.error(error);

        showMessage(error.message, false);

    }

});


// ======================================
// 5. DELETE HOUSING RECORD
// ======================================

async function deleteHousingRecord(houseId) {

    const confirmation = confirm(
        "Are you sure you want to delete this house?"
    );

    if (!confirmation) {
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}${encodeURIComponent(houseId)}`,
            {
                method: "DELETE"
            }
        );

        if (!response.ok) {

            throw new Error("Unable to delete housing record");

        }

        showMessage("Housing record deleted successfully!");

        getHousingRecords();

    }

    catch (error) {

        console.error(error);

        showMessage(error.message, false);

    }

}


// ======================================
// 6. SEARCH HOUSING RECORD
// ======================================

async function searchHousingRecord(houseId) {

    if (!houseId.trim()) {

        showMessage("Please enter House ID", false);

        return;

    }

    try {

        const response = await fetch(
            `${API_URL}${encodeURIComponent(houseId)}`
        );

        if (!response.ok) {

            throw new Error("House not found");

        }

        const house = await response.json();

        displayHousingRecords([house]);

        showMessage("Housing record found!");

    }

    catch (error) {

        console.error(error);

        showMessage(error.message, false);

    }

}


// ======================================
// 7. INITIALIZE APPLICATION
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    getHousingRecords();

    console.log("Housing API Application Started");

});
