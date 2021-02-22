
            /* Variáveis em JS: Usa-se o const quando sabe-se que mesmo com o passar do tempo o bloco de comando não haverá alterações;
            Recomenda-se: Let (mais usual) or Var (Clássico).
            Trocar para função toogle no futuro */


            const Modal = {
                open (){
                    // Abrir modal
                    // Adicionar a class active ao modal 
                    // alert('Abrir o modal'): funcionalidades e argumentos
                    document
                       .querySelector('.modal-overlay')
                       .classList
                       .add('active')
                },
                close (){
                    // Fechar o modal
                    // Remover a classe active do modal
                    document
                       .querySelector('.modal-overlay')
                       .classList
                       .remove('active')
                }
            }

            const Storage = {
                get () {
                    return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
                }, 

                set (transactions) {
                    localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
                }
            }

             // Só um igual equivale a atribuição;
             // == aí sim é igualdade :D

            //O que precisa ser feito? 
            // Preciso somar as entradas; 
            // Depois somar as saídas e remover das entradas o valor das saídas, assim obtendo o valor total
            // Refatoração :) refazer o que já foi feito afim de melhorar

            const Transaction = {
                all: Storage.get(),

                add(transaction) {
                    Transaction.all.push(transaction)

                   App.reload()
                },

                remove (index) {
                    Transaction.all.splice(index, 1)

                    App.reload()

                },

                incomes() {
                    
                    let income = 0;
                    // Pegar todas as transações
                     // Para cada transação, 
                    Transaction.all.forEach(transaction => {
                        //se ela for maior que zero 
                        if ( transaction.amount > 0) { 
                            // somar a uma variável e retornar 
                            income += transaction.amount; 

                        }

                    })
                  
                    return  income; 


                },

                expenses(){
                    let expense = 0;
                    // Pegar todas as transações
                     // Para cada transação, 
                    Transaction.all.forEach(transaction => {
                        //se ela for maior que zero 
                        if ( transaction.amount < 0) { 
                            // somar a uma variável e retornar 
                            expense += transaction.amount; 

                        }

                    })
                  
                    return  expense; 

                },
                
                total(){
                   return Transaction.incomes() + Transaction.expenses();

                }
            }

            //Lembretes: Substituir os dados do html com os dados do js

            //Se fosse uma string normal, sem crase/literals, teríamos erro porque não é permitido quebras assim

            const DOM = {
                transactionsContainer: document.querySelector('#data-table tbody'),

                addTransaction(transaction, index) {
                    const tr = document.createElement('tr')
                    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
                    tr.dataset.index = index

                    DOM.transactionsContainer.appendChild(tr)

                },

                innerHTMLTransaction (transaction, index) {
                    const CSSclass = transaction.amount > 0 ? "income" : "expense"

                    const amount = Utils.formatCurrency(transaction.amount)
                    
                    const html = `
                    <td class="description">${transaction.description}</td>
                    <td class="${CSSclass}">${amount}</td>
                    <td class="date">${transaction.date}</td>
                    <td>
                            <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover Transação">
                    </td>
                    `

                    return html 
                },

                updateBalance(){
                    document
                    .getElementById('incomeDisplay')
                    .innerHTML = Utils.formatCurrency(Transaction.incomes())
                    document
                    .getElementById('expenseDisplay')
                    .innerHTML = Utils.formatCurrency(Transaction.expenses())
                    document
                    .getElementById('totalDisplay')
                    .innerHTML = Utils.formatCurrency(Transaction.total())
                },


                clearTransaction() {
                    DOM.transactionsContainer.innerHTML = ""
                }

            }



            //replace: troca 
            //para trocar tudo: /0/g

            const Utils =  {
                formatAmount(value){
                    value = Number(value.replace(/\,\./g,"")) * 100
                    
                    return value 

                },

                formatDate(date){
                    const splittedDate = date.split("-")
                    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
                },

                formatCurrency(value) {
                    const signal = Number(value) < 0 ? "-" : ""                
                    
                    value = String(value).replace(/\D/g, "")

                    value = Number(value) / 100

                    value = value.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL"

                    })

                    return signal + value
                
                }
            }

            const Form = {
                description: document.querySelector('input#description'), 
                amount: document.querySelector('input#amount'), 
                date: document.querySelector('input#date'), 

                getValues() {
                    return {
                        description: Form.description.value,
                        amount: Form.amount.value,
                        date: Form.date.value
                    }
                },

                validateFields() {
                    const { description, amount, date } = Form.getValues()

                    if( description.trim() === "" ||
                        amount.trim() === "" ||
                        date.trim() === "" ) {
                            throw new Error("Por favor, preencha todos os campos!")
                        }
                   
                },

                formatValues() {
                    let { description, amount, date } = Form.getValues()

                    amount = Utils.formatAmount(amount)

                    date = Utils.formatDate(date)

                    return {
                        description, 
                        amount,
                        date
                    }
                },

               
               // Poderia fazer assim ou na própria linha do try colocar apenas Transaction.add(transaction)
                saveTransaction (transaction){
                    Transaction.add(transaction)
                },

                clearFields(){
                    Form.description.value = ""
                    Form.amount.value = ""
                    Form.date.value = ""
                },

                submit(event) {
                    event.preventDefault()

                    try {
                          // Verificar se todas as informações foram preenchidas
                        Form.validateFields()
                          // Pegar uma transação formatada 
                        const transaction = Form.formatValues()
                         // Salvar
                         // Transaction.add(transaction)
                        Form.saveTransaction(transaction)
                         // Apagar 
                        Form.clearFields
                         // Modal closed
                        Modal.close()
                         // Como temos um App.reload() no Add não foi preciso atualizar again :) 
                        
                    } catch (error) {
                        alert(error.message) 
                    }

                }

            }

           

            const App = {
                init() {

                    // Transaction.all.forEach(DOM.addTransaction)
                    Transaction.all.forEach((transaction, index) => {
                        DOM.addTransaction(transaction, index)
                    })
        
                    DOM.updateBalance()

                    Storage.set(Transaction.all)
        
                },

                reload() {
                    DOM.clearTransaction()
                    App.init()

                }

            }

            App.init()