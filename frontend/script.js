const role = localStorage.getItem("role");

async function loadComplaints() {
    const res = await fetch("/api/complaints");
    const data = await res.json();

    const list = document.getElementById("list");
    list.innerHTML = "";

    let filtered;

    if(role === "student"){
        filtered = data.slice(-1); // only last complaint
        document.getElementById("filter").style.display = "none";
        document.getElementById("filterTitle").style.display = "none";
    } else {
        const filter = document.getElementById("filter").value;
        filtered = filter === "All"
            ? data
            : data.filter(c => c.status === filter);
    }

    filtered.forEach(c => {
        list.innerHTML += `
            <li>
                <b>${c.title}</b><br>
                ${c.description}<br><br>

                Priority: <span class="badge ${c.priority}">${c.priority}</span>
                | Status: <span class="status">${c.status}</span>

                <br><br>

                ${
                    role === "admin" && c.status !== "Resolved"
                    ? `<button onclick="resolveComplaint('${c._id}')">Mark Resolved</button>`
                    : role === "admin" && c.status === "Resolved"
                    ? `<span style="color:green;font-weight:bold;">✔ Resolved</span>`
                    : ""
                }
            </li>
        `;
    });
}

async function submitComplaint() {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const priority = document.getElementById("priority").value;

    if(!title || !description){
        alert("Please fill all fields");
        return;
    }

    await fetch("/api/complaint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, priority })
    });

    document.getElementById("title").value = "";
    document.getElementById("description").value = "";

    loadComplaints();
}

async function resolveComplaint(id) {
    await fetch("/api/complaint/" + id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Resolved" })
    });

    loadComplaints();
}

function logout(){
    localStorage.removeItem("role");
    window.location.href="login.html";
}

loadComplaints();