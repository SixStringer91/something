const channelInput = document.getElementById('channel-id');
const tokenInput = document.getElementById('token');
const intervalInput = document.getElementById('interval');
const textareaInput = document.getElementById('textarea');
const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const addMessage = document.getElementById('add-message');
const messagesBlock = document.querySelector('.messages');

console.log(messagesBlock);

let clear;

const randomInteger = (min, max)  => {
  let rand = min + Math.random() * max;
  return Math.floor(rand);
}

const checkArray = (base) => {
	if (!base.length) {
		return null;
	}
	return base[randomInteger(0, base.length)]
}

const deleteByValue = (value, arr) => {
const arrCopy = [...arr];
	const myIndex = arrCopy.indexOf(value);
	if (myIndex !== -1) {
    arrCopy.splice(myIndex, 1);
    return arrCopy;
}
}



const manager = {
	messages: [],
	times: [],

	addMessage(msg){
		this.messages.unshift(msg);
		this.renderMessages();
	},	

	deleteMessage(i){
		this.messages.splice(i, 1);
		this.renderMessages();
	},

	renderMessages(){
		if(messagesBlock.children.length)	messagesBlock.innerHTML = '';
		const nodes = this.messages.map((el, i) => {
			const node = document.createElement('div');
			node.classList.add('messages-element');
			node.dataset.index = i;
			node.innerHTML = el;
			return node;
		});
		messagesBlock.append(...nodes);
	}
};

const addMessage2Block = (e) => {
	const txt = textareaInput.value;
	manager.addMessage.call(manager, txt);
}

const deleteMessageFromBlock = (e) => {
	e.stopPropagation();
	if (e.target.classList.contains('messages-element')) {
		manager.deleteMessage.call(manager, +e.target.dataset.index)
	}
}

const sendMessage = (base) => { 
	if (!base.length) {
		return sendMessage(manager.messages)
	}
  const channel = channelInput.value;
  const token = tokenInput.value;
  const interval = intervalInput.value || null;
  const textarea = checkArray(base);
  const newBase = deleteByValue(textarea, base);

  const url = `https://discord.com/api/v9/channels/${channel}/messages`;

  const headers = {
    'accept': '*/*',
    'authorization': token,
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
        if (interval) {
					clear = setTimeout(() => {
          sendMessage(newBase);
        }, +interval);
      } else console.log(data.message)
    });
  }
};


addMessage.addEventListener('click', addMessage2Block);
startBtn.addEventListener('click', () => sendMessage(manager.messages));
stopBtn.addEventListener('click', () => clearTimeout(clear));
messagesBlock.addEventListener('click', deleteMessageFromBlock);
