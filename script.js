// --- 1. VARIÁVEIS E CONSTANTES ---

// Tempos padrão em minutos
const WORK_MINUTES = 25;
const BREAK_MINUTES = 5;
const LONG_BREAK_MINUTES = 15;

// Variáveis de estado
let isWorking = true; // Começa no tempo de trabalho
let isRunning = false; // O timer está parado no início
let timeRemaining = WORK_MINUTES * 60; // Tempo inicial em segundos (25 min * 60 seg)
let intervalId = null; // Variável para armazenar o ID do setInterval
let tasks = []; // Array para armazenar as tarefas

// --- 2. ELEMENTOS DO DOM (Conectando HTML com JS) ---

// Elementos do Timer
const timerDisplay = document.getElementById('timer-display');
const phaseLabel = document.getElementById('phase-label');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const shortBreakBtn = document.getElementById('short-break-btn');
const longBreakBtn = document.getElementById('long-break-btn');

// Elementos da Lista de Tarefas
const newTaskInput = document.getElementById('new-task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const tasksContainer = document.getElementById('tasks-container');
const currentTaskIndicator = document.getElementById('current-task-indicator');


// --- FUNÇÃO AUXILIAR DE TEMPO ---

function getAlarmTime(minutesToAdd) {
    const now = new Date(); // Pega a data e hora atual
    // Adiciona os minutos necessários à hora atual
    now.setMinutes(now.getMinutes() + minutesToAdd); 
    
    // Pega a hora e o minuto formatados (sempre com dois dígitos)
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    return `${hours}:${minutes}`;
}


// --- 3. FUNÇÕES DE LÓGICA DA LISTA DE TAREFAS ---

function syncTaskWithTimer() {
    if (tasks.length > 0) {
        const currentTask = tasks[0];
        const alarmTime = getAlarmTime(WORK_MINUTES); // Calcula 25 minutos no futuro

        // NOVO TEXTO: Exibe a tarefa e o horário de pausa
        currentTaskIndicator.textContent = `Tarefa Atual: ${currentTask} (Pausa às ${alarmTime})`;
    } else {
        currentTaskIndicator.textContent = `Tarefa Atual: Nenhuma`;
    }
}

function deleteTask(taskText, listItem) {
    // Remove do Array
    tasks = tasks.filter(t => t !== taskText);
    
    // Remove do HTML de forma segura
    if (listItem && tasksContainer.contains(listItem)) {
        tasksContainer.removeChild(listItem);
    }
    
    // Resincroniza o timer
    syncTaskWithTimer();
}

function addTask() {
    const taskText = newTaskInput.value.trim();

    if (taskText === '') {
        alert('Por favor, digite uma tarefa válida.');
        return;
    }

    // 1. Adiciona a tarefa ao Array
    tasks.push(taskText);

    // 2. Cria o elemento LI no HTML
    const listItem = document.createElement('li');
    listItem.textContent = taskText;

    // Adiciona o botão de exclusão
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'X';
    // Define a ação de clique para deletar
    deleteBtn.onclick = () => deleteTask(taskText, listItem); 

    listItem.appendChild(deleteBtn);
    tasksContainer.appendChild(listItem);

    // 3. Limpa o input
    newTaskInput.value = '';

    // 4. Sincroniza o timer e exibe a hora da pausa
    syncTaskWithTimer();

    // NOVO CÓDIGO: Inicia o timer de 25 minutos automaticamente
    startTimer();

    // Alerta imediato com a hora da pausa
    const alarmTime = getAlarmTime(WORK_MINUTES);
    alert(`Tarefa "${taskText}" adicionada! Sua pausa será às ${alarmTime}. O timer de trabalho começou!`);
}


// --- 4. FUNÇÕES DE LÓGICA DO TIMER ---

function updateDisplay() {
    // Calcula minutos e segundos
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    
    // Formata para ter sempre dois dígitos (ex: 05, 10)
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    timerDisplay.textContent = `${formattedMinutes}:${formattedSeconds}`;
    
    // Atualiza a etiqueta (label)
    phaseLabel.textContent = isWorking ? 'Tempo de Trabalho' : 'Tempo de Descanso';
}

function tick() {
    // Se o tempo acabar
    if (timeRemaining <= 0) {
        clearInterval(intervalId);
        isRunning = false;

        // Se a fase que acabou era o TEMPO DE TRABALHO, remove a tarefa da lista.
        if (isWorking && tasks.length > 0) {
             // Chamamos deleteTask com a primeira tarefa do Array e o primeiro elemento <li> do DOM
             deleteTask(tasks[0], tasksContainer.firstElementChild); 
        }
        
        // Troca de fase: se estava trabalhando, vai descansar, e vice-versa
        isWorking = !isWorking;
        
        // Define o tempo para a nova fase
        timeRemaining = isWorking ? WORK_MINUTES * 60 : BREAK_MINUTES * 60;
        
        // Alerta o usuário sobre a mudança de fase
        alert(isWorking ? 'Hora de trabalhar!' : 'Hora de descansar!');

        // Reinicia a contagem 
        startTimer(); 
        
    } else {
        // Diminui o tempo em 1 segundo
        timeRemaining--;
    }
    
    updateDisplay();
}

function startTimer() {
    if (!isRunning) {
        // Inicia o intervalo de 1 segundo e guarda o ID
        intervalId = setInterval(tick, 1000);
        isRunning = true;
    }
}

function pauseTimer() {
    if (isRunning) {
        // Para a execução do setInterval usando o ID que guardamos
        clearInterval(intervalId);
        isRunning = false;
    }
}

function resetTimer() {
    pauseTimer(); // Primeiro, garante que o timer está parado
    isWorking = true; // Volta para o tempo de trabalho
    timeRemaining = WORK_MINUTES * 60; // Define o tempo inicial
    updateDisplay(); // Atualiza a tela
}

function startShortBreak() {
    pauseTimer(); 
    isWorking = false; 
    timeRemaining = BREAK_MINUTES * 60;
    updateDisplay(); 
    startTimer();
}

function startLongBreak() {
    pauseTimer();
    isWorking = false;
    timeRemaining = LONG_BREAK_MINUTES * 60; 
    updateDisplay();
    startTimer();
}


// --- 5. CONEXÃO DOS EVENTOS (LISTENERS) ---

// Listeners do Timer
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
shortBreakBtn.addEventListener('click', startShortBreak);
longBreakBtn.addEventListener('click', startLongBreak);

// Listeners da Lista de Tarefas
addTaskBtn.addEventListener('click', addTask);
newTaskInput.addEventListener('keypress', (e) => {
    // Adiciona a tarefa ao pressionar ENTER
    if (e.key === 'Enter') {
        addTask();
    }
});


// --- 6. INICIALIZAÇÃO ---

// Garante que o display inicial e o indicador de tarefa estão corretos ao carregar a página
updateDisplay();
syncTaskWithTimer();