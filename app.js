const channelInput = document.getElementById('channel-id');
const tokenInput = document.getElementById('token');
const intervalInput = document.getElementById('interval');
const textareaInput = document.getElementById('textarea');
const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const addMessage = document.getElementById('add-message');
const addTimeout = document.getElementById('add-timer');
const parameterBlock = document.querySelector('.parameter-block')
const messagesBlock = document.querySelector('.messages');
const timeoutsBlock = document.querySelector('.timeouts');

console.log(messagesBlock);

let clear;

const manager = {
  messages: [],
  timeouts: [],

  addMessage(msg) {
    this.messages.unshift(msg);
    this.renderItems(messagesBlock, 'messages','messages-element');
  },

  addTimeout(timeout) {
    this.timeouts.unshift(timeout);
    this.renderItems(timeoutsBlock,'timeouts', 'timeout-element');
  },
  
  deleteMessage(i) {
    this.messages.splice(i, 1);
    this.renderItems(messagesBlock,'messages', 'messages-element');
  },

  deleteTimeouts(i) {
    this.timeouts.splice(i, 1);
    this.renderItems(timeoutsBlock,'timeouts', 'timeout-element');
  },
  
  renderItems(block, key, selector){
		if (block.children.length) block.innerHTML = '';
		const nodes = this[key].map((el, i) => {
      const node = document.createElement('div');
      node.classList.add(selector);
      node.dataset.index = i;
      node.innerHTML = el;
      return node;
    });
    block.append(...nodes);
  },
};

const randomInteger = (min, max) => {
  let rand = min + Math.random() * max;
  return Math.floor(rand);
};

const checkArray = base => {
  if (!base.length) {
    return null;
  }
  return base[randomInteger(0, base.length)];
};

const deleteByValue = (value, arr) => {
  const arrCopy = [...arr];
  const myIndex = arrCopy.indexOf(value);
  if (myIndex !== -1) {
    arrCopy.splice(myIndex, 1);
    return arrCopy;
  }
};


const deleteMessageFromBlock = e => {
  e.stopPropagation();
  if (e.target.classList.contains('messages-element')) {
    manager.deleteMessage.call(manager, +e.target.dataset.index);
  }
	if (e.target.classList.contains('timeout-element')) {
    manager.deleteTimeouts.call(manager, +e.target.dataset.index);
  }
};

const sendMessage = (baseList, tOutList) => {
  if (!baseList.length) {
    return sendMessage(manager.messages, tOutList);
  }
	if (!tOutList.length) {
    return sendMessage(baseList, manager.timeouts);
  }
  const channel = channelInput.value;
  const token = tokenInput.value;
  const textarea = checkArray(baseList);
  const newBase = deleteByValue(textarea, baseList);
  const tOUt = checkArray(tOutList);
  const newTOutList = deleteByValue(tOUt, tOutList)

  const url = `https://discord.com/api/v9/channels/${channel}/messages`;

  const headers = {
    accept: '*/*',
    authorization: token,
    'content-type': 'application/json',
  };

  const body = {
    content: textarea,
    tts: false,
  };
  console.group('message');
  console.log(body);
  console.log(headers);
  console.log(textarea);
  console.groupEnd();
  if (textarea) {
    fetch(url, {
      headers,
      body: JSON.stringify(body),
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
    }).then(data => {
      if (tOUt) {
        clear = setTimeout(() => {
          sendMessage(newBase, newTOutList);
        }, +tOUt);
      } else console.log(data.message);
    });
  }
};

const addMessage2Block = () => {
  const txt = textareaInput.value;
  manager.addMessage.call(manager, txt);
};

const addTimeout2block = () => {
  const tOut = intervalInput.value;
  const reg = new RegExp('^\\d+$');
	console.log(reg.test(tOut))
  if (reg.test(tOut)) manager.addTimeout.call(manager, tOut);
};

addMessage.addEventListener('click', addMessage2Block);
startBtn.addEventListener('click', () => sendMessage(manager.messages, manager.timeouts));
stopBtn.addEventListener('click', () => clearTimeout(clear));
parameterBlock.addEventListener('click', deleteMessageFromBlock);
addTimeout.addEventListener('click',  addTimeout2block);
