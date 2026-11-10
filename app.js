

/* =====================================================
   CENTRAL OPERACIONAL
   JavaScript + Supabase
===================================================== */


/* 1. CONFIGURAÇÃO DO SUPABASE */

const SUPABASE_URL = "https://yglribqswzcykduamaqw.supabase.co";
const SUPABASE_KEY = "sb_publishable_5E2kYBNGBueZbJfBL-ZYYQ_PCtIYpII";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


/* 2. ELEMENTOS PRINCIPAIS */

const loginView = document.getElementById("loginView");
const appView = document.getElementById("appView");

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

const recordDialog = document.getElementById("recordDialog");
const recordForm = document.getElementById("recordForm");
const formFields = document.getElementById("formFields");

const dialogTitle = document.getElementById("dialogTitle");
const formMessage = document.getElementById("formMessage");

const toast = document.getElementById("toast");


/* 3. ESTADO DA APLICAÇÃO */

let currentUser = null;
let currentTable = "activities";
let currentOperation = "invoices";
let editingRecordId = null;

const records = {
    activities: [],
    invoices: [],
    orders: [],
    receipts: [],
    stock: [],
    emails: [],
    improvements: []
};


/* 4. CONFIGURAÇÃO DOS MÓDULOS */

const modules = {

    activities: {
        title: "Atividade",
        table: "activities",

        fields: [
            { name: "title", label: "Título", required: true },
            { name: "description", label: "Descrição", type: "textarea" },
            { name: "category", label: "Categoria" },
            {
                name: "priority",
                label: "Prioridade",
                type: "select",
                options: ["Baixa", "Média", "Alta"]
            },
            {
                name: "status",
                label: "Status",
                type: "select",
                options: ["Pendente", "Em andamento", "Concluída"]
            },
            { name: "due_date", label: "Prazo", type: "date" }
        ],

        columns: [
            { key: "title", label: "Atividade" },
            { key: "category", label: "Categoria" },
            { key: "priority", label: "Prioridade" },
            { key: "due_date", label: "Prazo", date: true },
            { key: "status", label: "Status" }
        ],

        search: ["title", "description", "category", "status"]
    },


    invoices: {
        title: "Nota fiscal",
        table: "invoices",

        fields: [
            { name: "invoice_number", label: "Número da nota", required: true },
            { name: "supplier", label: "Fornecedor", required: true },
            { name: "invoice_date", label: "Data da nota", type: "date" },
            { name: "received_date", label: "Data de recebimento", type: "date" },
            { name: "order_number", label: "Número do pedido" },
            {
                name: "status",
                label: "Status",
                type: "select",
                options: ["Recebida", "Lançada", "Pendente", "Com divergência"]
            },
            { name: "notes", label: "Observações", type: "textarea" }
        ],

        columns: [
            { key: "invoice_number", label: "Nota fiscal" },
            { key: "supplier", label: "Fornecedor" },
            { key: "invoice_date", label: "Data", date: true },
            { key: "order_number", label: "Pedido" },
            { key: "status", label: "Status" }
        ],

        search: ["invoice_number", "supplier", "order_number", "status"]
    },


    orders: {
        title: "Pedido",
        table: "orders",

        fields: [
            { name: "order_number", label: "Número do pedido", required: true },
            { name: "supplier", label: "Fornecedor" },
            { name: "order_date", label: "Data do pedido", type: "date" },
            {
                name: "status",
                label: "Status",
                type: "select",
                options: ["Aberto", "Aguardando entrega", "Recebido", "Cancelado"]
            },
            { name: "notes", label: "Observações", type: "textarea" }
        ],

        columns: [
            { key: "order_number", label: "Pedido" },
            { key: "supplier", label: "Fornecedor" },
            { key: "order_date", label: "Data", date: true },
            { key: "status", label: "Status" }
        ],

        search: ["order_number", "supplier", "status"]
    },


    receipts: {
        title: "Recebimento",
        table: "receipts",

        fields: [
            { name: "supplier", label: "Fornecedor", required: true },
            { name: "order_number", label: "Número do pedido" },
            { name: "invoice_number", label: "Número da nota fiscal" },
            { name: "receipt_date", label: "Data do recebimento", type: "date" },
            {
                name: "status",
                label: "Status",
                type: "select",
                options: ["Aguardando conferência", "Em conferência", "Concluído", "Com divergência"]
            },
            { name: "notes", label: "Observações", type: "textarea" }
        ],

        columns: [
            { key: "supplier", label: "Fornecedor" },
            { key: "order_number", label: "Pedido" },
            { key: "invoice_number", label: "Nota fiscal" },
            { key: "receipt_date", label: "Recebimento", date: true },
            { key: "status", label: "Status" }
        ],

        search: ["supplier", "order_number", "invoice_number", "status"]
    },


    stock: {
        title: "Produto",
        table: "stock",

        fields: [
            { name: "product_name", label: "Nome do produto", required: true },
            { name: "product_code", label: "Código do produto" },
            { name: "category", label: "Categoria" },
            { name: "quantity", label: "Quantidade", type: "number" },
            { name: "minimum_quantity", label: "Estoque mínimo", type: "number" },
            { name: "location", label: "Localização" },
            {
                name: "status",
                label: "Status",
                type: "select",
                options: ["Disponível", "Reservado", "Indisponível"]
            },
            { name: "notes", label: "Observações", type: "textarea" }
        ],

        columns: [
            { key: "product_name", label: "Produto" },
            { key: "product_code", label: "Código" },
            { key: "quantity", label: "Quantidade" },
            { key: "minimum_quantity", label: "Mínimo" },
            { key: "location", label: "Localização" },
            { key: "status", label: "Status" }
        ],

        search: ["product_name", "product_code", "category", "location"]
    },


    emails: {
        title: "E-mail",
        table: "emails",

        fields: [
            { name: "subject", label: "Assunto", required: true },
            { name: "sender", label: "Remetente" },
            { name: "received_at", label: "Data de recebimento", type: "date" },
            {
                name: "status",
                label: "Status",
                type: "select",
                options: ["Não lido", "Pendente", "Respondido", "Resolvido"]
            },
            { name: "due_date", label: "Prazo de resposta", type: "date" },
            { name: "notes", label: "Observações", type: "textarea" }
        ],

        columns: [
            { key: "subject", label: "Assunto" },
            { key: "sender", label: "Remetente" },
            { key: "received_at", label: "Recebimento", date: true },
            { key: "due_date", label: "Prazo", date: true },
            { key: "status", label: "Status" }
        ],

        search: ["subject", "sender", "status", "notes"]
    },


    improvements: {
        title: "Melhoria",
        table: "improvements",

        fields: [
            { name: "title", label: "Nome da melhoria", required: true },
            { name: "problem", label: "Problema identificado", type: "textarea" },
            { name: "proposal", label: "Proposta de melhoria", type: "textarea" },
            { name: "expected_result", label: "Resultado esperado", type: "textarea" },
            {
                name: "status",
                label: "Status",
                type: "select",
                options: ["Ideia", "Em análise", "Aprovada", "Em andamento", "Concluída"]
            },
            { name: "result", label: "Resultado obtido", type: "textarea" },
            { name: "notes", label: "Observações", type: "textarea" }
        ],

        columns: [
            { key: "title", label: "Melhoria" },
            { key: "problem", label: "Problema" },
            { key: "proposal", label: "Proposta" },
            { key: "status", label: "Status" }
        ],

        search: ["title", "problem", "proposal", "status"]
    }

};


/* 5. FUNÇÕES AUXILIARES */

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}


function formatDate(value) {
    if (!value) return "—";

    const parts = String(value).split("-");

    if (parts.length !== 3) return value;

    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}


function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}


function setConnection(online, message) {
    const element = document.getElementById("connectionStatus");

    element.classList.toggle("online", online);
    element.querySelector("span").textContent = message;
}


function setLoading(button, loading, text = "Salvar registro") {
    button.disabled = loading;
    button.textContent = loading ? "Salvando..." : text;
}


/* 6. AUTENTICAÇÃO */

loginForm.addEventListener("submit", async event => {
    event.preventDefault();

    loginMessage.textContent = "Verificando acesso...";

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        loginMessage.textContent = "Não foi possível entrar. Verifique seu e-mail e senha.";
        console.error("Erro no login:", error.message);
        return;
    }

    currentUser = data.user;

    await openApplication();
});


document.getElementById("logoutBtn").addEventListener("click", async () => {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
        showToast("Não foi possível sair da conta.");
        console.error(error);
        return;
    }

    currentUser = null;
    appView.classList.add("hidden");
    loginView.classList.remove("hidden");

    showToast("Sessão encerrada.");
});


async function checkSession() {
    const { data, error } = await supabaseClient.auth.getSession();

    if (error) {
        console.error("Erro ao verificar sessão:", error.message);
        setConnection(false, "Erro de conexão");
        return;
    }

    if (data.session) {
        currentUser = data.session.user;
        await openApplication();
    } else {
        loginView.classList.remove("hidden");
        appView.classList.add("hidden");
        setConnection(false, "Não conectado");
    }
}


async function openApplication() {
    loginView.classList.add("hidden");
    appView.classList.remove("hidden");

    document.getElementById("todayDate").textContent =
        new Intl.DateTimeFormat("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }).format(new Date());

    setConnection(true, "Conectado");

    await loadAllData();
}


/* 7. BUSCAR DADOS NO SUPABASE */

async function loadTable(table) {
    const { data, error } = await supabaseClient
        .from(table)
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error(`Erro ao carregar ${table}:`, error);
        throw error;
    }

    records[table] = data || [];

    return records[table];
}


async function loadAllData() {
    setConnection(false, "Carregando dados...");

    try {
        const tables = Object.keys(modules);

        await Promise.all(tables.map(table => loadTable(table)));

        renderAll();
        setConnection(true, "Conectado");

    } catch (error) {
        setConnection(false, "Erro ao carregar");
        showToast("Erro ao carregar os dados.");
    }
}


/* 8. CADASTRAR E EDITAR REGISTROS */

function openRecordDialog(table, record = null) {
    currentTable = table;
    editingRecordId = record?.id || null;

    const config = modules[table];

    dialogTitle.textContent = editingRecordId
        ? `Editar ${config.title.toLowerCase()}`
        : `Novo ${config.title.toLowerCase()}`;

    formMessage.textContent = "";

    formFields.innerHTML = config.fields.map(field => {
        const value = record?.[field.name] ?? "";
        const fullWidth = field.type === "textarea" ? "full-width" : "";

        let inputHTML = "";

        if (field.type === "select") {
            inputHTML = `
                <select
                    name="${field.name}"
                    ${field.required ? "required" : ""}
                >
                    <option value="">Selecione</option>

                    ${field.options.map(option => `
                        <option
                            value="${escapeHTML(option)}"
                            ${value === option ? "selected" : ""}
                        >
                            ${escapeHTML(option)}
                        </option>
                    `).join("")}
                </select>
            `;

        } else if (field.type === "textarea") {
            inputHTML = `
                <textarea
                    name="${field.name}"
                    placeholder="${escapeHTML(field.label)}"
                >${escapeHTML(value)}</textarea>
            `;

        } else {
            inputHTML = `
                <input
                    type="${field.type || "text"}"
                    name="${field.name}"
                    value="${escapeHTML(value)}"
                    placeholder="${escapeHTML(field.label)}"
                    ${field.required ? "required" : ""}
                    ${field.type === "number" ? 'min="0" step="1"' : ""}
                >
            `;
        }

        return `
            <div class="field ${fullWidth}">
                <label>${escapeHTML(field.label)}</label>
                ${inputHTML}
            </div>
        `;
    }).join("");

    document.getElementById("saveRecordBtn").textContent =
        editingRecordId ? "Salvar alterações" : "Salvar registro";

    recordDialog.showModal();
}


async function saveRecord(event) {
    event.preventDefault();

    if (!currentUser) {
        showToast("Sua sessão expirou. Entre novamente.");
        return;
    }

    const button = document.getElementById("saveRecordBtn");
    const config = modules[currentTable];

    const formData = new FormData(recordForm);
    const payload = {};

    config.fields.forEach(field => {
        const value = formData.get(field.name);

        if (field.type === "number") {
            payload[field.name] =
                value === "" || value === null ? 0 : Number(value);
        } else {
            payload[field.name] = value === "" ? null : value;
        }
    });

    setLoading(button, true);

    let result;

    if (editingRecordId) {
        result = await supabaseClient
            .from(currentTable)
            .update(payload)
            .eq("id", editingRecordId)
            .select();

    } else {
        payload.user_id = currentUser.id;

        result = await supabaseClient
            .from(currentTable)
            .insert(payload)
            .select();
    }

    setLoading(button, false, editingRecordId
        ? "Salvar alterações"
        : "Salvar registro"
    );

    if (result.error) {
        console.error("Erro ao salvar:", result.error);
        formMessage.textContent = "Não foi possível salvar. Verifique os dados.";
        return;
    }

    recordDialog.close();
    recordForm.reset();

    showToast(editingRecordId
        ? "Registro atualizado com sucesso."
        : "Registro cadastrado com sucesso."
    );

    editingRecordId = null;

    await loadAllData();
}


recordForm.addEventListener("submit", saveRecord);


/* 9. EXCLUIR REGISTROS */

async function deleteRecord(table, id) {
    const confirmed = confirm("Tem certeza que deseja excluir este registro?");

    if (!confirmed) return;

    const { error } = await supabaseClient
        .from(table)
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Erro ao excluir:", error);
        showToast("Não foi possível excluir o registro.");
        return;
    }

    showToast("Registro excluído.");
    await loadAllData();
}


/* 10. RENDERIZAÇÃO DAS TABELAS */

function renderTable(table, targetId, search = "") {
    const config = modules[table];
    const target = document.getElementById(targetId);

    if (!target) return;

    const query = search.toLowerCase().trim();

    const filtered = records[table].filter(record => {
        return config.search.some(key =>
            String(record[key] ?? "").toLowerCase().includes(query)
        );
    });

    if (filtered.length === 0) {
        target.innerHTML = `
            <tr>
                <td colspan="${config.columns.length + 1}" class="empty">
                    Nenhum registro encontrado.
                </td>
            </tr>
        `;
        return;
    }

    target.innerHTML = filtered.map(record => `
        <tr>
            ${config.columns.map(column => {
                let value = record[column.key];

                if (column.date) {
                    value = formatDate(value);
                }

                return `
                    <td>${escapeHTML(value || "—")}</td>
                `;
            }).join("")}

            <td>
                <div class="row-actions">
                    <button
                        class="text-btn"
                        data-action="edit"
                        data-table="${table}"
                        data-id="${record.id}"
                    >
                        Editar
                    </button>

                    <button
                        class="text-btn"
                        data-action="delete"
                        data-table="${table}"
                        data-id="${record.id}"
                    >
                        Excluir
                    </button>
                </div>
            </td>
        </tr>
    `).join("");
}


/* 11. RENDERIZAR OPERAÇÕES */

const operationInfo = {
    invoices: {
        title: "Notas fiscais",
        description: "Controle das notas fiscais recebidas e lançadas."
    },

    orders: {
        title: "Pedidos",
        description: "Acompanhe os pedidos e suas entregas."
    },

    receipts: {
        title: "Recebimentos",
        description: "Registre e acompanhe o recebimento de mercadorias."
    },

    stock: {
        title: "Estoque",
        description: "Controle produtos, quantidades e localização."
    }
};


function renderOperation() {
    const config = modules[currentOperation];
    const info = operationInfo[currentOperation];

    document.getElementById("operationTitle").textContent = info.title;
    document.getElementById("operationDescription").textContent = info.description;
    document.getElementById("operationTableTitle").textContent = info.title;

    document.getElementById("operationTableHead").innerHTML = `
        <tr>
            ${config.columns.map(column => `
                <th>${escapeHTML(column.label)}</th>
            `).join("")}
            <th>Ações</th>
        </tr>
    `;

    const search = document.getElementById("operationSearch").value;

    renderTable(
        currentOperation,
        "operationTableBody",
        search
    );

    document.getElementById("operationAddBtn").dataset.add = currentOperation;
}


/* 12. INDICADORES E RELATÓRIOS */

function updateDashboard() {
    const activities = records.activities;

    document.getElementById("metricActivities").textContent =
        activities.length;

    document.getElementById("metricInProgress").textContent =
        activities.filter(item => item.status === "Em andamento").length;

    document.getElementById("metricCompleted").textContent =
        activities.filter(item => item.status === "Concluída").length;

    document.getElementById("metricPending").textContent =
        activities.filter(item => item.status === "Pendente").length;

    document.getElementById("reportInvoices").textContent =
        records.invoices.length;

    document.getElementById("reportOrders").textContent =
        records.orders.length;

    document.getElementById("reportReceipts").textContent =
        records.receipts.length;

    document.getElementById("reportStock").textContent =
        records.stock.length;


    const statuses = ["Pendente", "Em andamento", "Concluída"];

    const breakdown = statuses.map(status => {
        const total = activities.filter(item => item.status === status).length;
        const percentage = activities.length
            ? (total / activities.length) * 100
            : 0;

        return `
            <div class="breakdown-row">
                <span>${status}</span>
                <strong>${total}</strong>

                <div class="bar">
                    <span style="width: ${percentage}%"></span>
                </div>
            </div>
        `;
    }).join("");

    document.getElementById("activityBreakdown").innerHTML =
        breakdown || '<p class="empty">Sem atividades registradas.</p>';


    const warnings = records.stock.filter(item =>
        Number(item.quantity || 0) <= Number(item.minimum_quantity || 0)
    );

    document.getElementById("stockWarnings").innerHTML =
        warnings.length
            ? warnings.map(item => `
                <div class="breakdown-row">
                    <span>${escapeHTML(item.product_name)}</span>
                    <strong>${Number(item.quantity || 0)} un.</strong>
                </div>
            `).join("")
            : '<p class="empty">Nenhum produto abaixo do mínimo.</p>';
}


function renderAll() {
    renderTable("activities", "activitiesTable",
        document.querySelector('[data-search="activities"]').value
    );

    renderTable("emails", "emailsTable",
        document.querySelector('[data-search="emails"]').value
    );

    renderTable("improvements", "improvementsTable",
        document.querySelector('[data-search="improvements"]').value
    );

    renderOperation();
    updateDashboard();
}


/* 13. NAVEGAÇÃO PRINCIPAL */

document.querySelectorAll(".tab").forEach(button => {
    button.addEventListener("click", () => {
        const viewName = button.dataset.view;

        document.querySelectorAll(".tab").forEach(tab => {
            tab.classList.remove("active");
        });

        document.querySelectorAll(".view").forEach(view => {
            view.classList.remove("active-view");
        });

        button.classList.add("active");

        document.getElementById(`${viewName}View`)
            .classList.add("active-view");
    });
});


/* 14. NAVEGAÇÃO DAS OPERAÇÕES */

document.querySelectorAll(".subtab").forEach(button => {
    button.addEventListener("click", () => {
        currentOperation = button.dataset.operation;

        document.querySelectorAll(".subtab").forEach(tab => {
            tab.classList.remove("active");
        });

        button.classList.add("active");

        document.getElementById("operationSearch").value = "";

        renderOperation();
    });
});


/* 15. BOTÕES DE CADASTRO */

document.addEventListener("click", event => {
    const addButton = event.target.closest("[data-add]");

    if (addButton) {
        openRecordDialog(addButton.dataset.add);
        return;
    }

    const actionButton = event.target.closest("[data-action]");

    if (!actionButton) return;

    const table = actionButton.dataset.table;
    const id = actionButton.dataset.id;

    if (actionButton.dataset.action === "edit") {
        const record = records[table].find(item => item.id === id);

        if (record) {
            openRecordDialog(table, record);
        }
    }

    if (actionButton.dataset.action === "delete") {
        deleteRecord(table, id);
    }
});


/* 16. PESQUISA */

document.querySelectorAll("[data-search]").forEach(input => {
    input.addEventListener("input", () => {
        const table = input.dataset.search;

        const targetIds = {
            activities: "activitiesTable",
            emails: "emailsTable",
            improvements: "improvementsTable"
        };

        renderTable(table, targetIds[table], input.value);
    });
});


document.getElementById("operationSearch")
    .addEventListener("input", renderOperation);


/* 17. BOTÕES DO MODAL */

function closeDialog() {
    recordDialog.close();
    recordForm.reset();
    editingRecordId = null;
}

document.getElementById("closeDialogBtn")
    .addEventListener("click", closeDialog);

document.getElementById("cancelDialogBtn")
    .addEventListener("click", closeDialog);


/* 18. ATUALIZAR RELATÓRIOS */

document.getElementById("refreshReportsBtn")
    .addEventListener("click", loadAllData);


/* 19. INICIALIZAÇÃO */

checkSession();
