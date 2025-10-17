//DATA
const clients = [
    { id: crypto.randomUUID(), firstName: "Lilian", lastName: "Sinsau" },
    { id: crypto.randomUUID(), firstName: "Zoro", lastName: "Shinso" },
    { id: crypto.randomUUID(), firstName: "Suzanne", lastName: "Bien-Aimé" }
];

const accounts = [
  {
    id: crypto.randomUUID(),
    clientId: clients[0].id, //Lilian
    balance: 3700,
    historic: [
      { type: "deposit", amount: 1200, date: new Date().toLocaleString() },
      { type: "deposit", amount: 3000, date: new Date().toLocaleString() },
      { type: "withdrawal", amount: 500, date: new Date().toLocaleString() },
    ],
  },
  {
    id: crypto.randomUUID(),
    clientId: clients[0].id, //Lilian
    balance: 4100,
    historic: [
      { type: "deposit", amount: 4000, date: new Date().toLocaleString() },
      { type: "transfer", amount: 100, date: new Date().toLocaleString() },
    ],
  },
  {
    id: crypto.randomUUID(),
    clientId: clients[1].id, //Zoro
    balance: 900,
    historic: [
      { type: "deposit", amount: 800, date: new Date().toLocaleString() },
      { type: "deposit", amount: 200, date: new Date().toLocaleString() },
      { type: "transfer", amount: 100, date: new Date().toLocaleString() },
    ],
  },
  {
    id: crypto.randomUUID(),
    clientId: clients[2].id, //Suzanne
    balance: 2200,
    historic: [
      { type: "deposit", amount: 2500, date: new Date().toLocaleString() },
      { type: "withdrawal", amount: 300, date: new Date().toLocaleString() },
    ],
  },
];


//ERRORS
const checkClientExists = (clientId) => {
  if (!findClient(clientId)) throw new Error(`Client with ID ${clientId} not found.`);
};

const checkAccountExists = (accountId) => {
  if (!findAccount(accountId)) throw new Error(`Account with ID ${accountId} not found.`);
};

const checkValidAmount = (amount) => {
  if (typeof amount !== 'number' || amount <= 0) throw new Error('Invalid amount. Must be a positive number.');
};


//CLIENTS
const getClients = () => clients;

const findClient = (clientId) => clients.find(client => client.id === clientId);

const createClient = (firstName, lastName) => {
    if (!firstName || !lastName) throw new Error('First name and last name must be completed.');

    const client = {
        id : crypto.randomUUID(),
        firstName,
        lastName,
    }
    clients.push(client);

    return client.id;
}


//ACCOUNTS
const getAccounts = () => accounts;

const findAccount = (accountId) => accounts.find(account => account.id === accountId);

const getAccount = (accountId) => {
    checkAccountExists(accountId);
    return findAccount(accountId);
}

const getClientAccounts = (clientId) =>  {
    checkClientExists(clientId);
    return accounts.filter(account => account.clientId === clientId);
}


const createAccount = (clientId, initialBalance) => {
    checkClientExists(clientId);
    checkValidAmount(initialBalance)

    const account = {
        id : crypto.randomUUID(),
        clientId,
        balance : initialBalance,
        historic : [],
    }
    accounts.push(account);
    createTransaction(account.id, 'deposit', initialBalance);

    return account.id;
}

const deleteAccount = (accountId) => {
    const account = getAccount(accountId);

    if (account.balance !== 0) throw new Error('Cannot delete a non-empty account.');

    const index = accounts.findIndex(account => account.id === accountId);
    accounts.splice(index, 1);
    console.log(`Account n°${accountId} deleted.`);
}


//TRANSACTIONS
const createTransaction = (accountId, type, amount) => {
    const account = getAccount(accountId);
    const transaction = {
        type,
        amount,
        date : new Date().toLocaleString(),
    }
    account.historic.push(transaction);
}

const depositToAccount = (accountId, amount) => {
    checkValidAmount(amount);

    const account = getAccount(accountId);
    account.balance += amount;
    createTransaction(accountId, 'deposit', amount);

    console.log(`Deposit of ${amount}€ on account n°${accountId}. New balance : ${account.balance}€`);
}

const withdrawFromAccount = (accountId, amount) => {
    checkValidAmount(amount);

    const account = getAccount(accountId);
    if (account.balance < amount) throw new Error('Insufficient balance.');

    account.balance -= amount;
    createTransaction(accountId, 'withdrawal', amount);

    console.log(`Withdraw of ${amount}€ on account n°${accountId}. New balance : ${account.balance}€`);
}

const transferBetweenAccounts = (fromAccountId, toAccountId, amount) => {
    checkValidAmount(amount);
    if (fromAccountId === toAccountId) throw new Error('Cannot transfer to the same account.');

    const fromAccount = getAccount(fromAccountId);
    const toAccount = getAccount(toAccountId);

    if (fromAccount.balance < amount) throw new Error('Insufficient balance.');

    fromAccount.balance -= amount;
    toAccount.balance += amount;

    createTransaction(fromAccountId, 'transfer', amount);
    createTransaction(toAccountId, 'transfer', amount);

    console.log(`Transfer of ${amount}€ from account n°${fromAccountId} (${fromAccount.balance}€) to account n°${toAccountId} (${toAccount.balance}€)`);
}


//AFFICHAGES
const getAccountBalance = (accountId) => {
    const account = getAccount(accountId);
    console.log(`Balance of account n°${accountId} : ${account.balance}€.`);
}

const getClientTotalBalance = (clientId) => {
    const amount = getClientAccounts(clientId).reduce((sum, account) => sum + account.balance, 0);
    console.log(`Client n°${clientId} total balance : ${amount}€.`);
}

const getBankTotalBalance = () => {
    const amount = accounts.reduce((sum, account) => sum + account.balance, 0);
    console.log(`Bank owns ${amount}€.`);
}

const getTransactions = (accountId) => {
    const account = getAccount(accountId);
    console.log(`Transactions for account n°${accountId}:`);

    account.historic.forEach((transaction) => {
        console.log(`- [${transaction.date}] ${transaction.type} of ${transaction.amount}€`);
    })
}