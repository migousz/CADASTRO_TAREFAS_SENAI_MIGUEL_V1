const campoTarefa = document.getElementById('campo-tarefa');
const botaoAdicionar = document.getElementById('botao-adicionar');
const listaTarefas = document.getElementById('lista-tarefas');
const contadorTarefas = document.getElementById('contador-tarefas');
const botaoAlternarTema = document.getElementById('botao-alternar-tema');
const iconeTema = botaoAlternarTema.querySelector('i');

const textoNivel = document.getElementById('texto-nivel');
const textoXp = document.getElementById('texto-xp');
const barraXp = document.getElementById('barra-xp');
const relogioElemento = document.getElementById('relogio');
const personagemContainer = document.getElementById('personagem-pixel'); 

let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
let nivel = parseInt(localStorage.getItem('nivel')) || 1;
let xp = parseInt(localStorage.getItem('xp')) || 0;
const xpMaximo = 100;

function atualizarRelogio() {
    const agora = new Date();
    const horas = String(agora.getHours()).padStart(2, '0');
    const minutos = String(agora.getMinutes()).padStart(2, '0');
    const segundos = String(agora.getSeconds()).padStart(2, '0');
    relogioElemento.textContent = `${horas}:${minutos}:${segundos}`;
}
setInterval(atualizarRelogio, 1000);
atualizarRelogio();

function salvarDados() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
    localStorage.setItem('nivel', nivel);
    localStorage.setItem('xp', xp);
}

function atualizarContador() {
    const total = tarefas.length;
    contadorTarefas.textContent = `${total} ${total === 1 ? 'tarefa' : 'tarefas'} na lista`;
}

function atualizarPersonagem() {
    if (!personagemContainer) return;
    
    const porcentagemProgresso = xp / xpMaximo;
    
    const deslocamentoMaximo = 180; 
    
    const moveX = -(porcentagemProgresso * deslocamentoMaximo);
    const moveY = -(porcentagemProgresso * deslocamentoMaximo);
    
    // Altera a skin de acordo com o nível usando filtro
    const mudancaSkin = ((nivel - 1) * 45) % 360;
    
    // Move e colore
    personagemContainer.style.transform = `translate(${moveX}px, ${moveY}px)`;
    personagemContainer.style.filter = `hue-rotate(${mudancaSkin}deg)`;
}

function atualizarXpUI() {
    textoNivel.textContent = `Nível ${nivel}`;
    textoXp.textContent = `${xp} / ${xpMaximo} XP`;
    const porcentagem = (xp / xpMaximo) * 100;
    barraXp.style.width = `${porcentagem}%`;
    
    // Sincroniza a posição do personagem com o XP
    atualizarPersonagem();
}

function renderizarTarefas() {
    listaTarefas.innerHTML = '';

    tarefas.forEach((tarefa, index) => {
        const itemLista = document.createElement('li');
        itemLista.className = `item-tarefa ${tarefa.concluida ? 'concluido' : ''}`;

        const horarioExibicao = tarefa.horario 
            ? `<span class="horario-tarefa">Adicionada às ${tarefa.horario}</span>` 
            : '';

        itemLista.innerHTML = `
            <div class="info-tarefa-container">
                <span>${tarefa.texto}</span>
                ${horarioExibicao}
            </div>
            <div class="acoes-tarefa">
                <button class="botao-acao concluir" onclick="alternarConcluido(${index})">
                    <i class="fa-regular fa-circle-check"></i>
                </button>
                <button class="botao-acao excluir" onclick="excluirTarefa(${index})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;

        listaTarefas.appendChild(itemLista);
    });

    atualizarContador();
    atualizarXpUI();
}

window.alternarConcluido = function (index) {
    const eraConcluida = tarefas[index].concluida;
    tarefas[index].concluida = !tarefas[index].concluida;

    // XP: ganha 10 XP 
    if (!eraConcluida && tarefas[index].concluida) {
        xp += 10;
        if (xp >= xpMaximo) {
            xp -= xpMaximo;
            nivel++;
            alert(`Parabéns! Você subiu para o Nível ${nivel}!`);
        }
    } else if (eraConcluida && !tarefas[index].concluida) {
     
        xp = Math.max(0, xp - 10);
    }

    salvarDados();
    renderizarTarefas();
};

window.excluirTarefa = function (index) {
    tarefas.splice(index, 1);
    salvarDados();
    renderizarTarefas();
};

function adicionarTarefa() {
    const textoTarefa = campoTarefa.value.trim();

    if (textoTarefa === '') {
        alert('Por favor, digite uma tarefa!');
        return;
    }

    const agora = new Date();
    const horarioCriacao = `${String(agora.getHours()).padStart(2, '0')}:${String(agora.getMinutes()).padStart(2, '0')}:${String(agora.getSeconds()).padStart(2, '0')}`;

    tarefas.push({ texto: textoTarefa, concluida: false, horario: horarioCriacao });
    
    campoTarefa.value = '';
    salvarDados();
    renderizarTarefas();
}

botaoAlternarTema.addEventListener('click', () => {
    document.body.classList.toggle('modo-escuro');

    if (document.body.classList.contains('modo-escuro')) {
        iconeTema.classList.remove('fa-moon');
        iconeTema.classList.add('fa-sun');
    } else {
        iconeTema.classList.remove('fa-sun');
        iconeTema.classList.add('fa-moon');
    }
});

botaoAdicionar.addEventListener('click', adicionarTarefa);

campoTarefa.addEventListener('keypress', (evento) => {
    if (evento.key === 'Enter') {
        adicionarTarefa();
    }
});

renderizarTarefas();