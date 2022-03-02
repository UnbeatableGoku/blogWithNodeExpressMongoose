let myLeads = [];
var inputEl = document.getElementById("inputText");
const btn = document.getElementById("btnsubmit");
const ulEl = document.getElementById("ul-el");
const save = document.getElementById("save_btn")
const deleteBtn = document.getElementById("delete_btn")
const leadsFromLocalStorage = JSON.parse(localStorage.getItem("keys"))


if (leadsFromLocalStorage) {
    myLeads = (leadsFromLocalStorage);

    render(myLeads);
}

save.addEventListener("click", function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        myLeads.push(tabs[0].url)
        localStorage.setItem('keys', JSON.stringify(myLeads))
        render(myLeads)
    })
})

deleteBtn.addEventListener("dblclick", function() {
    localStorage.clear()
    myLeads = []
    render(myLeads)
})

btn.addEventListener("click", function() {
    myLeads.push(inputEl.value)
    inputEl.value = ""

    localStorage.setItem("keys", JSON.stringify(myLeads))

    render(myLeads)

})


function render(leads) {
    let myList = ""

    for (let i = 0; i < leads.length; i++) {
        myList += `
    <li>
        <a target='__blank' href='${leads[i]}'> 
            ${leads[i]}  
        </a>
    </li>`
    }

    ulEl.innerHTML = myList
}