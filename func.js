
// =====================================
// HOUSING API MANAGEMENT SYSTEM
// =====================================

// FastAPI backend URL
const API_URL = "http://127.0.0.1:8000/houses/";

// Get HTML elements
const housingForm = document.querySelector("form");
const tableBody = document.querySelector("tbody");

// =====================================
// 1. LOAD HOUSING RECORDS
// =====================================

async function getHousingRecords() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to fetch housing records");
        }

        const houses = await response.json();

        displayHousingRecords(houses);

    } catch (error) {

        console.error("Error:", error.message);

    }
}


// =====================================
// 2. DISPLAY HOUSING RECORDS
// =====================================

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

        values.forEach(value => {

            const cell = document.createElement("td");

            cell.textContent = value;

            row.appendChild(cell);

        });

        // Delete button
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


// =====================================
// 3. ADD HOUSING RECORD
// =====================================

housingForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const inputs = housingForm.querySelectorAll("input, select");

    const houseData = {

        house_id: inputs[0].value.trim(),

        owner_name: inputs[1].value.trim(),

        district: inputs[2].value.trim(),

        area: Number(inputs[3].value),

        building_type: inputs[4].value,

        status: inputs[5].value

    };

    // Validation
    if (
        !houseData.house_id ||
        !houseData.owner_name ||
        !houseData.district ||
        !houseData.area ||
        !houseData.building_type ||
        !houseData.status
    ) {

        alert("Please fill all fields");

        return;

    }

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

        alert("Housing record added successfully!");

        housingForm.reset();

        getHousingRecords();

    } catch (error) {

        alert(error.message);

        console.error(error);

    }

});


// =====================================
// 4. DELETE HOUSING RECORD
// =====================================

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

        alert("Housing record deleted!");

        getHousingRecords();

    } catch (error) {

        alert(error.message);

        console.error(error);

    }

}


// =====================================
// 5. SEARCH HOUSING RECORD
// =====================================

async function searchHousingRecord(houseId) {

    try {

        const response = await fetch(
            `${API_URL}${encodeURIComponent(houseId)}`
        );

        if (!response.ok) {

            throw new Error("House not found");

        }

        const house = await response.json();

        console.log("House Details:", house);

        alert(
            `House ID: ${house.house_id}\n` +
            `Owner: ${house.owner_name}\n` +
            `District: ${house.district}`
        );

    } catch (error) {

        alert(error.message);

    }

}


// =====================================
// 6. INITIALIZE APPLICATION
// =====================================

document.addEventListener("DOMContentLoaded", () => {

    getHousingRecords();

    console.log("Housing API Application Started");

});
