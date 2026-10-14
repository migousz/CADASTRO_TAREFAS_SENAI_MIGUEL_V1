
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

// Carrega os dados salvos
let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
let nivel = parseInt(localStorage.getItem('nivel')) || 1;
let xp = parseInt(localStorage.getItem('xp')) || 0;

const xpMaximo = 100;

// Relógio
function atualizarRelogio() {
    const agora = new Date();

    const horas = String(agora.getHours()).padStart(2, '0');
    const minutos = String(agora.getMinutes()).padStart(2, '0');
    const segundos = String(agora.getSeconds()).padStart(2, '0');

    relogioElemento.textContent = `${horas}:${minutos}:${segundos}`;
}

setInterval(atualizarRelogio, 1000);
atualizarRelogio();

// Salva os dados no navegador
function salvarDados() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
    localStorage.setItem('nivel', nivel);
    localStorage.setItem('xp', xp);
}

// Atualiza o contador
function atualizarContador() {
    const total = tarefas.length;

    contadorTarefas.textContent =
        `${total} ${total === 1 ? 'tarefa' : 'tarefas'} na lista`;
}

// Move o personagem conforme o XP
function atualizarPersonagem() {
    if (!personagemContainer) return;

    const progresso = xp / xpMaximo;
    const deslocamento = progresso * 180;

    personagemContainer.style.transform =
        `translate(${-deslocamento}px, ${-deslocamento}px)`;

    const cor = ((nivel - 1) * 45) % 360;
    personagemContainer.style.filter = `hue-rotate(${cor}deg)`;
}

// Atualiza o painel de XP
function atualizarXpUI() {
    textoNivel.textContent = `Nível ${nivel}`;
    textoXp.textContent = `${xp} / ${xpMaximo} XP`;

    const porcentagem = (xp / xpMaximo) * 100;
    barraXp.style.width = `${porcentagem}%`;

    atualizarPersonagem();
}

// Mostra as tarefas na tela
function renderizarTarefas() {
    listaTarefas.innerHTML = '';

    tarefas.forEach((tarefa, index) => {
        const item = document.createElement('li');
        item.className = 'item-tarefa';

        if (tarefa.concluida) {
            item.classList.add('concluido');
        }

        const info = document.createElement('div');
        info.className = 'info-tarefa-container';

        const texto = document.createElement('span');
        texto.textContent = tarefa.texto;
        info.appendChild(texto);

        if (tarefa.horario) {
            const horario = document.createElement('span');
            horario.className = 'horario-tarefa';
            horario.textContent = `Adicionada às ${tarefa.horario}`;
            info.appendChild(horario);
        }

        const acoes = document.createElement('div');
        acoes.className = 'acoes-tarefa';

        const botaoConcluir = document.createElement('button');
        botaoConcluir.className = 'botao-acao concluir';
        botaoConcluir.setAttribute(
            'aria-label',
            tarefa.concluida ? 'Desmarcar tarefa' : 'Concluir tarefa'
        );

        const iconeConcluir = document.createElement('i');
        iconeConcluir.className = tarefa.concluida
            ? 'fa-solid fa-circle-check'
            : 'fa-regular fa-circle-check';

        botaoConcluir.appendChild(iconeConcluir);

        botaoConcluir.addEventListener('click', () => {
            alternarConcluido(index);
        });

        const botaoExcluir = document.createElement('button');
        botaoExcluir.className = 'botao-acao excluir';
        botaoExcluir.setAttribute('aria-label', 'Excluir tarefa');

        const iconeExcluir = document.createElement('i');
        iconeExcluir.className = 'fa-solid fa-trash';

        botaoExcluir.appendChild(iconeExcluir);

        botaoExcluir.addEventListener('click', () => {
            excluirTarefa(index);
        });

        acoes.appendChild(botaoConcluir);
        acoes.appendChild(botaoExcluir);

        item.appendChild(info);
        item.appendChild(acoes);

        listaTarefas.appendChild(item);
    });

    atualizarContador();
    atualizarXpUI();
}

// Concluir ou reabrir uma tarefa
function alternarConcluido(index) {
    const tarefa = tarefas[index];

    if (!tarefa) return;

    if (!tarefa.concluida) {
        tarefa.concluida = true;
        xp += 10;

        while (xp >= xpMaximo) {
            xp -= xpMaximo;
            nivel++;

            alert(`Parabéns! Você subiu para o nível ${nivel}!`);
        }
    } else {
        tarefa.concluida = false;
        xp = Math.max(0, xp - 10);
    }

    salvarDados();
    renderizarTarefas();
}

// Excluir uma tarefa
function excluirTarefa(index) {
    tarefas.splice(index, 1);

    salvarDados();
    renderizarTarefas();
}

// Adicionar uma tarefa
function adicionarTarefa() {
    const textoTarefa = campoTarefa.value.trim();

    if (textoTarefa === '') {
        alert('Por favor, digite uma tarefa!');
        campoTarefa.focus();
        return;
    }

    const agora = new Date();

    const horario = [
        String(agora.getHours()).padStart(2, '0'),
        String(agora.getMinutes()).padStart(2, '0'),
        String(agora.getSeconds()).padStart(2, '0')
    ].join(':');

    tarefas.push({
        texto: textoTarefa,
        concluida: false,
        horario: horario
    });

    campoTarefa.value = '';

    salvarDados();
    renderizarTarefas();
    campoTarefa.focus();
}

// Alternar entre tema claro e escuro
function atualizarIconeTema() {
    const escuro = document.body.classList.contains('modo-escuro');

    iconeTema.className = escuro
        ? 'fa-solid fa-sun'
        : 'fa-solid fa-moon';
}

botaoAlternarTema.addEventListener('click', () => {
    document.body.classList.toggle('modo-escuro');

    const escuro = document.body.classList.contains('modo-escuro');

    localStorage.setItem('modoEscuro', escuro);

    atualizarIconeTema();
});

// Botão de adicionar
botaoAdicionar.addEventListener('click', adicionarTarefa);

// Adicionar usando a tecla Enter
campoTarefa.addEventListener('keydown', (evento) => {
    if (evento.key === 'Enter') {
        adicionarTarefa();
    }
});

// Restaura o tema escolhido
if (localStorage.getItem('modoEscuro') === 'true') {
    document.body.classList.add('modo-escuro');
}

atualizarIconeTema();
renderizarTarefas();