const STORAGE_KEY = "northstar-lending-demo";

const seedData = {
  customers: [
    { id: "CU-1048", name: "Priya Sharma", initials: "PS", email: "priya.sharma@email.com", phone: "+91 98765 42108", city: "Mumbai", joined: "Aug 28, 2026", loans: 2, borrowed: "₹ 18.5 L", status: "Verified", tone: "rose" },
    { id: "CU-1047", name: "Rahul Verma", initials: "RV", email: "rahul.verma@email.com", phone: "+91 98205 19876", city: "Pune", joined: "Aug 26, 2026", loans: 1, borrowed: "₹ 7.2 L", status: "Verified", tone: "blue" },
    { id: "CU-1046", name: "Meera Iyer", initials: "MI", email: "meera.iyer@email.com", phone: "+91 99876 54321", city: "Bengaluru", joined: "Aug 22, 2026", loans: 3, borrowed: "₹ 32.0 L", status: "Verified", tone: "purple" },
    { id: "CU-1045", name: "Aditya Nair", initials: "AN", email: "aditya.nair@email.com", phone: "+91 99001 22448", city: "Kochi", joined: "Aug 18, 2026", loans: 1, borrowed: "₹ 4.8 L", status: "Pending KYC", tone: "green" }
  ],
  applications: [
    { id: "APP-2084", name: "Priya Sharma", initials: "PS", type: "Personal loan", amount: "₹ 5,00,000", numericAmount: 500000, tenure: "24 months", date: "Today, 09:42 AM", status: "Pending", tone: "rose" },
    { id: "APP-2083", name: "Rahul Verma", initials: "RV", type: "Vehicle loan", amount: "₹ 7,20,000", numericAmount: 720000, tenure: "36 months", date: "Yesterday, 04:18 PM", status: "Pending", tone: "blue" },
    { id: "APP-2082", name: "Meera Iyer", initials: "MI", type: "Home loan", amount: "₹ 25,00,000", numericAmount: 2500000, tenure: "60 months", date: "Aug 29, 2026", status: "Approved", tone: "purple" },
    { id: "APP-2081", name: "Aditya Nair", initials: "AN", type: "Education loan", amount: "₹ 4,80,000", numericAmount: 480000, tenure: "24 months", date: "Aug 28, 2026", status: "Pending", tone: "green" },
    { id: "APP-2080", name: "Sneha Kapoor", initials: "SK", type: "Personal loan", amount: "₹ 3,50,000", numericAmount: 350000, tenure: "12 months", date: "Aug 27, 2026", status: "Approved", tone: "yellow" },
    { id: "APP-2079", name: "Vikram Singh", initials: "VS", type: "Vehicle loan", amount: "₹ 8,40,000", numericAmount: 840000, tenure: "36 months", date: "Aug 25, 2026", status: "Pending", tone: "blue" },
    { id: "APP-2078", name: "Nisha Thomas", initials: "NT", type: "Personal loan", amount: "₹ 2,00,000", numericAmount: 200000, tenure: "12 months", date: "Aug 24, 2026", status: "Rejected", tone: "lavender" },
    { id: "APP-2077", name: "Kabir Joshi", initials: "KJ", type: "Home loan", amount: "₹ 18,00,000", numericAmount: 1800000, tenure: "60 months", date: "Aug 22, 2026", status: "Pending", tone: "orange" }
  ],
  loans: [
    { id: "LN-2048", name: "Priya Sharma", initials: "PS", type: "Personal loan", principal: "₹ 5,00,000", emi: "₹ 23,075", due: "Sep 05, 2026", progress: 48, status: "Active", tone: "rose" },
    { id: "LN-2047", name: "Rahul Verma", initials: "RV", type: "Vehicle loan", principal: "₹ 7,20,000", emi: "₹ 22,800", due: "Sep 07, 2026", progress: 31, status: "Active", tone: "blue" },
    { id: "LN-2046", name: "Meera Iyer", initials: "MI", type: "Home loan", principal: "₹ 25,00,000", emi: "₹ 52,053", due: "Sep 10, 2026", progress: 18, status: "Active", tone: "purple" },
    { id: "LN-2045", name: "Sneha Kapoor", initials: "SK", type: "Personal loan", principal: "₹ 3,50,000", emi: "₹ 30,875", due: "Sep 12, 2026", progress: 72, status: "Active", tone: "yellow" },
    { id: "LN-2044", name: "Vikram Singh", initials: "VS", type: "Vehicle loan", principal: "₹ 8,40,000", emi: "₹ 26,620", due: "Sep 14, 2026", progress: 56, status: "Active", tone: "blue" }
  ],
  payments: [
    { id: "PAY-9921", name: "Priya Sharma", initials: "PS", loan: "LN-2048", date: "Sep 01, 2026", amount: "₹ 23,075", mode: "UPI", status: "Paid", tone: "rose" },
    { id: "PAY-9920", name: "Rahul Verma", initials: "RV", loan: "LN-2047", date: "Aug 31, 2026", amount: "₹ 22,800", mode: "Bank Transfer", status: "Paid", tone: "blue" },
    { id: "PAY-9919", name: "Meera Iyer", initials: "MI", loan: "LN-2046", date: "Aug 30, 2026", amount: "₹ 52,053", mode: "UPI", status: "Paid", tone: "purple" },
    { id: "PAY-9918", name: "Sneha Kapoor", initials: "SK", loan: "LN-2045", date: "Aug 29, 2026", amount: "₹ 30,875", mode: "Debit Card", status: "Paid", tone: "yellow" },
    { id: "PAY-9917", name: "Vikram Singh", initials: "VS", loan: "LN-2044", date: "Aug 28, 2026", amount: "₹ 26,620", mode: "UPI", status: "Paid", tone: "blue" }
  ]
};

const appState = loadState();
let activeView = "dashboard";
let toastTimer;

function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return structuredClone(seedData);
    const parsed = JSON.parse(stored);
    return { ...structuredClone(seedData), ...parsed };
  } catch (error) {
    return structuredClone(seedData);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));
}

function initialsFrom(name) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((word) => word[0].toUpperCase()).join("");
}

function avatar(name, initials, tone = "blue") {
  return `<span class="avatar avatar--${tone}">${escapeHtml(initials || initialsFrom(name))}</span>`;
}

function statusPill(status) {
  const statusClass = status.toLowerCase().replace(/\s+/g, "-");
  return `<span class="status-pill status-pill--${statusClass}">${escapeHtml(status)}</span>`;
}

function renderDashboard() {
  const recent = appState.applications.slice(0, 5);
  const tbody = document.getElementById("recentApplicationsTable");
  if (!tbody) return;
  tbody.innerHTML = recent.map((application) => `<tr>
    <td><div class="person-cell">${avatar(application.name, application.initials, application.tone)}<div class="person-details"><strong>${escapeHtml(application.name)}</strong><span>${escapeHtml(application.id)}</span></div></div></td>
    <td>${escapeHtml(application.type)}</td><td class="amount-cell">${escapeHtml(application.amount)}</td><td>${statusPill(application.status)}</td><td><button class="row-menu" aria-label="More actions" type="button">•••</button></td>
  </tr>`).join("");
}

function renderCustomers(query = "") {
  const normalizedQuery = query.toLowerCase();
  const customers = appState.customers.filter((customer) => `${customer.name} ${customer.email} ${customer.city} ${customer.id}`.toLowerCase().includes(normalizedQuery));
  const tbody = document.getElementById("customersTable");
  if (!tbody) return;
  tbody.innerHTML = customers.length ? customers.map((customer) => `<tr>
    <td><div class="person-cell">${avatar(customer.name, customer.initials, customer.tone)}<div class="person-details"><strong>${escapeHtml(customer.name)}</strong><span>${escapeHtml(customer.id)}</span></div></div></td>
    <td><div class="person-details"><strong>${escapeHtml(customer.phone)}</strong><span>${escapeHtml(customer.email)}</span></div></td><td>${escapeHtml(customer.joined)}</td><td>${customer.loans}</td><td class="amount-cell">${escapeHtml(customer.borrowed)}</td><td>${customer.status === "Verified" ? statusPill("Verified") : statusPill("Pending")}</td><td><button class="row-menu" aria-label="More actions" type="button">•••</button></td>
  </tr>`).join("") : emptyRow(7, "No customers match your search.");
  document.getElementById("customerTotal").textContent = String(appState.customers.length).padStart(2, "0");
  document.getElementById("customerNavCount").textContent = String(appState.customers.length).padStart(2, "0");
}

function renderApplications(query = "") {
  const normalizedQuery = query.toLowerCase();
  const applications = appState.applications.filter((application) => `${application.name} ${application.type} ${application.id} ${application.status}`.toLowerCase().includes(normalizedQuery));
  const tbody = document.getElementById("applicationsTable");
  if (!tbody) return;
  tbody.innerHTML = applications.length ? applications.map((application) => `<tr>
    <td class="id-cell">${escapeHtml(application.id)}</td><td><div class="person-cell">${avatar(application.name, application.initials, application.tone)}<span>${escapeHtml(application.name)}</span></div></td><td>${escapeHtml(application.type)}</td><td class="amount-cell">${escapeHtml(application.amount)}</td><td>${escapeHtml(application.tenure)}</td><td class="muted-cell">${escapeHtml(application.date)}</td><td>${statusPill(application.status)}</td><td><button class="row-menu" data-application-id="${escapeHtml(application.id)}" aria-label="Application actions" type="button">•••</button></td>
  </tr>`).join("") : emptyRow(8, "No applications match your search.");
  const pending = appState.applications.filter((application) => application.status === "Pending").length;
  document.getElementById("applicationTotal").textContent = String(appState.applications.length).padStart(2, "0");
  document.getElementById("applicationPending").textContent = String(pending).padStart(2, "0");
  document.getElementById("pendingNavCount").textContent = String(pending).padStart(2, "0");
}

function renderLoans(query = "") {
  const normalizedQuery = query.toLowerCase();
  const loans = appState.loans.filter((loan) => `${loan.name} ${loan.type} ${loan.id} ${loan.status}`.toLowerCase().includes(normalizedQuery));
  const tbody = document.getElementById("loansTable");
  if (!tbody) return;
  tbody.innerHTML = loans.length ? loans.map((loan) => `<tr>
    <td class="id-cell">${escapeHtml(loan.id)}</td><td><div class="person-cell">${avatar(loan.name, loan.initials, loan.tone)}<span>${escapeHtml(loan.name)}</span></div></td><td>${escapeHtml(loan.type)}</td><td class="amount-cell">${escapeHtml(loan.principal)}</td><td class="amount-cell">${escapeHtml(loan.emi)}</td><td class="muted-cell">${escapeHtml(loan.due)}</td><td class="progress-cell"><div class="table-progress"><span><i style="width:${loan.progress}%"></i></span><span>${loan.progress}%</span></div></td><td>${statusPill(loan.status)}</td>
  </tr>`).join("") : emptyRow(8, "No loans match your search.");
}

function renderPayments(query = "") {
  const normalizedQuery = query.toLowerCase();
  const payments = appState.payments.filter((payment) => `${payment.name} ${payment.loan} ${payment.id} ${payment.mode}`.toLowerCase().includes(normalizedQuery));
  const tbody = document.getElementById("paymentsTable");
  if (!tbody) return;
  tbody.innerHTML = payments.length ? payments.map((payment) => `<tr>
    <td class="id-cell">${escapeHtml(payment.id)}</td><td><div class="person-cell">${avatar(payment.name, payment.initials, payment.tone)}<span>${escapeHtml(payment.name)}</span></div></td><td class="id-cell">${escapeHtml(payment.loan)}</td><td class="muted-cell">${escapeHtml(payment.date)}</td><td class="amount-cell">${escapeHtml(payment.amount)}</td><td>${escapeHtml(payment.mode)}</td><td>${statusPill(payment.status)}</td>
  </tr>`).join("") : emptyRow(7, "No payments match your search.");
}

function emptyRow(columns, message) { return `<tr><td colspan="${columns}" class="empty-row">${escapeHtml(message)}</td></tr>`; }

function refreshAll() {
  renderDashboard();
  renderCustomers();
  renderApplications();
  renderLoans();
  renderPayments();
}

function setView(view) {
  const validViews = ["dashboard", "customers", "applications", "loans", "payments", "reports", "settings"];
  activeView = validViews.includes(view) ? view : "dashboard";
  document.querySelectorAll(".view-panel").forEach((panel) => panel.classList.toggle("is-visible", panel.dataset.panel === activeView));
  document.querySelectorAll(".nav-item").forEach((item) => item.classList.toggle("is-active", item.dataset.view === activeView));
  const label = activeView === "loans" ? "Active loans" : activeView[0].toUpperCase() + activeView.slice(1);
  document.getElementById("breadcrumbLabel").textContent = label;
  document.getElementById("sidebar").classList.remove("is-open");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  const firstInput = modal.querySelector("input, select, textarea");
  if (firstInput) setTimeout(() => firstInput.focus(), 80);
}

function closeModal(modal) {
  const target = typeof modal === "string" ? document.getElementById(modal) : modal;
  if (!target) return;
  target.classList.remove("is-open");
  target.setAttribute("aria-hidden", "true");
}

function showToast(message) {
  const toast = document.getElementById("toast");
  document.getElementById("toastMessage").textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 3200);
}

function formatCurrency(value) {
  return `₹ ${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.max(0, Number(value) || 0))}`;
}

function estimateEmi(principal, tenure, annualRate = 10.5) {
  const amount = Number(principal) || 0;
  const months = Number(tenure) || 0;
  if (!amount || !months) return 0;
  const monthlyRate = annualRate / 12 / 100;
  return amount * monthlyRate * (Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1));
}

function updateEmiPreview() {
  const form = document.getElementById("applicationForm");
  if (!form) return;
  const tenure = Number(form.elements.tenure.value.split(" ")[0]);
  document.getElementById("emiPreview").textContent = formatCurrency(estimateEmi(form.elements.amount.value, tenure));
}

function addApplication(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);
  const name = formData.get("name").trim();
  const type = formData.get("type");
  const amount = Number(formData.get("amount"));
  const tenure = formData.get("tenure");
  const nextNumber = 2084 + appState.applications.length - 8 + 1;
  appState.applications.unshift({ id: `APP-${nextNumber}`, name, initials: initialsFrom(name), type, amount: formatCurrency(amount), numericAmount: amount, tenure, date: "Just now", status: "Pending", purpose: formData.get("purpose"), tone: "teal" });
  saveState();
  refreshAll();
  closeModal("applicationModal");
  form.reset();
  updateEmiPreview();
  setView("applications");
  showToast("Application submitted and added to the review queue.");
}

function addCustomer(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const name = formData.get("name").trim();
  const nextNumber = 1048 + appState.customers.length - 4 + 1;
  appState.customers.unshift({ id: `CU-${nextNumber}`, name, initials: initialsFrom(name), email: formData.get("email"), phone: formData.get("phone"), city: formData.get("city"), joined: "Just now", loans: 0, borrowed: "₹ 0", status: "Verified", tone: "teal" });
  saveState();
  refreshAll();
  closeModal("customerModal");
  event.currentTarget.reset();
  setView("customers");
  showToast(`${name} was added to your customer directory.`);
}

function addPayment(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const loanValue = formData.get("loan");
  const [loanId, ...nameParts] = loanValue.split(" · ");
  const name = nameParts.join(" · ");
  appState.payments.unshift({ id: `PAY-${9922 + appState.payments.length - 5}`, name, initials: initialsFrom(name), loan: loanId, date: new Date(formData.get("date")).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }), amount: formatCurrency(formData.get("amount")), mode: formData.get("mode"), status: "Paid", tone: "teal" });
  saveState();
  refreshAll();
  closeModal("paymentModal");
  event.currentTarget.reset();
  setView("payments");
  showToast("Payment recorded successfully.");
}

function downloadCsv(filename, rows) {
  const csv = rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
  showToast(`${filename} is ready to download.`);
}

function bindEvents() {
  document.querySelectorAll(".nav-item").forEach((item) => item.addEventListener("click", () => setView(item.dataset.view)));
  document.querySelectorAll("[data-view-target]").forEach((button) => button.addEventListener("click", () => setView(button.dataset.viewTarget)));
  document.querySelectorAll("[data-open-modal]").forEach((button) => button.addEventListener("click", () => openModal(button.dataset.openModal)));
  document.querySelectorAll("[data-close-modal]").forEach((button) => button.addEventListener("click", () => closeModal(button.closest(".modal-backdrop"))));
  document.querySelectorAll(".modal-backdrop").forEach((backdrop) => backdrop.addEventListener("click", (event) => { if (event.target === backdrop) closeModal(backdrop); }));
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") document.querySelectorAll(".modal-backdrop.is-open").forEach(closeModal); });
  document.getElementById("mobileMenu").addEventListener("click", () => document.getElementById("sidebar").classList.toggle("is-open"));
  document.getElementById("searchToggle").addEventListener("click", () => { const search = document.getElementById("globalSearch"); search.classList.toggle("is-open"); if (search.classList.contains("is-open")) document.getElementById("globalSearchInput").focus(); });
  document.getElementById("globalSearchInput").addEventListener("input", (event) => { const term = event.target.value.toLowerCase(); const panel = document.querySelector(`[data-panel="${activeView}"]`); if (!panel) return; panel.querySelectorAll("tbody tr").forEach((row) => row.classList.toggle("is-filtered", term && !row.textContent.toLowerCase().includes(term))); });
  document.querySelectorAll("[data-table-search]").forEach((input) => input.addEventListener("input", (event) => { const table = event.target.dataset.tableSearch; if (table === "customers") renderCustomers(event.target.value); if (table === "applications") renderApplications(event.target.value); if (table === "loans") renderLoans(event.target.value); if (table === "payments") renderPayments(event.target.value); }));
  document.getElementById("applicationForm").addEventListener("submit", addApplication);
  document.getElementById("applicationForm").elements.amount.addEventListener("input", updateEmiPreview);
  document.getElementById("applicationForm").elements.tenure.addEventListener("change", updateEmiPreview);
  document.getElementById("customerForm").addEventListener("submit", addCustomer);
  document.getElementById("paymentForm").addEventListener("submit", addPayment);
  document.getElementById("saveSettings").addEventListener("click", () => showToast("Workspace settings saved successfully."));
  document.getElementById("exportLoans").addEventListener("click", () => downloadCsv("northstar-active-loans.csv", [["Loan ID", "Borrower", "Loan type", "Principal", "EMI", "Next due", "Progress", "Status"], ...appState.loans.map((loan) => [loan.id, loan.name, loan.type, loan.principal, loan.emi, loan.due, `${loan.progress}%`, loan.status])]));
  document.getElementById("exportReports").addEventListener("click", () => downloadCsv("northstar-portfolio-report.csv", [["Report", "Value"], ["Portfolio value", "₹ 2.84 Cr"], ["Outstanding balance", "₹ 1.92 Cr"], ["Collection performance", "94.8%"]]));
}

refreshAll();
bindEvents();
