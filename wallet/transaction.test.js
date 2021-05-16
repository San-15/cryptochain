const Transaction = require('./transaction');
const Wallet = require('./index');
const { verifySignature } = require('../util');
const { REWARD_INPUT,MINING_REWARD } = require('../config');

describe('Transaction',()=>{
    let transaction,senderWallet,recipient,amount;

    beforeEach(()=>{
        senderWallet = new Wallet();
        recipient = 'recipient-public-key';
        amount = 50;
        transaction = new Transaction({senderWallet,recipient,amount});
    });

    it('has an `id`',()=>{
        expect(transaction).toHaveProperty('id');
    });

    describe('outputMap',()=>{
        it('has an `outputMap`',()=>{
            expect(transaction).toHaveProperty('outputMap');
        });

        it('outputs the amount to the recipient',()=>{
            expect(transaction.outputMap[recipient]).toEqual(amount);
        });

        it('outputs the remaining balance for the `senderWallet`',()=>{
            expect(transaction.outputMap[senderWallet.publicKey])
            .toEqual(senderWallet.balance - amount);
        });
    });

    describe('input',()=>{
        it('has an `input`',()=>{
            expect(transaction).toHaveProperty('input');
        });

        it('has an `timestamp` in the input',()=>{
            expect(transaction.input).toHaveProperty('timestamp');
        });

        it('sets the `amount` to the `senderWallet` balance',()=>{
            expect(transaction.input.amount).toEqual(senderWallet.balance);
        });

        it('sets the `address` to the `senderWallet` address',()=>{
            expect(transaction.input.address).toEqual(senderWallet.publicKey);
        });

        it('signs the input',()=>{
            expect(
                verifySignature({
                    publicKey: senderWallet.publicKey,
                    data: transaction.outputMap,
                    signature: transaction.input.signature
                })
            ).toBe(true);            
        });
    });

   describe('validTransaction()',()=>{
       let errorMock;

       beforeEach(()=>{
        errorMock=jest.fn();

        global.console.error = errorMock;
       });
       describe('when the transaction is valid',()=>{
           it('returns true',()=>{
               expect(Transaction.validTransaction(transaction)).toBe(true);
           });
       });

       describe('when the transaction is invalid',()=>{
           describe('and a transaction outputMap value is invalid',()=>{
            it('returns false and logs an error ',()=>{
                transaction.outputMap[senderWallet.publicKey]= 967679;

                expect(Transaction.validTransaction(transaction)).toBe(false);
                expect(errorMock).toHaveBeenCalled();
            });
           });
           describe('and the transaction input signature is invalid',()=>{
            it('returns false and logs an error ',()=>{
                transaction.input.signature = new Wallet().sign('data');

                expect(Transaction.validTransaction(transaction)).toBe(false);   
                expect(errorMock).toHaveBeenCalled();
            });
           });
        });

   });

   describe('update()',()=>{
       let originalSignature,originalSenderOutput,nextrecipient,nextAmount;
    
       describe('and the amount is invalid',()=>{
           it('throws an error',()=>{

            expect(()=>{
                transaction.update({
                senderWallet,recipient:'foo',amount:987654
                })
            }).toThrow('Amount exceeds balance');            
        });
       });

       describe('and the amount is valid',()=>{
        beforeEach(()=>{
            originalSignature=transaction.input.signature;
            originalSenderOutput=transaction.outputMap[senderWallet.publicKey];
            nextrecipient='next-recipient';
            nextAmount=20;
    
            transaction.update({senderWallet,recipient:nextrecipient,amount:nextAmount});
           });
    
           it('outputs the amount to the next recipient',()=>{
               expect(transaction.outputMap[nextrecipient]).toEqual(nextAmount);
           });
    
           it('subtracts the amount from the original sender output amount',()=>{
               expect(transaction.outputMap[senderWallet.publicKey]
                ).toEqual(originalSenderOutput-nextAmount);
           });
    
           it('maintains a total output that matches the input amount',()=>{
               expect(
                Object.values(transaction.outputMap)
               .reduce((total ,outputAmount) => total + outputAmount)
               ).toEqual(transaction.input.amount);
               
           });
    
           it('re-signs the transaction',()=>{
               expect(transaction.input.signature).not.toEqual(originalSignature);
           });

           describe('and another update for the same recipient',()=>{
            let addedAmount;

            beforeEach(()=>{
                addedAmount = 80;
                transaction.update({
                    senderWallet,recipient: nextrecipient,amount: addedAmount
                });
            });

            it('adds to the recipient amount',()=>{
                expect(transaction.outputMap[nextrecipient])
                .toEqual(nextAmount + addedAmount);
            });

            it('subtracts the amount from the original sender output amount',()=>{
              expect(transaction.outputMap[senderWallet.publicKey])
              .toEqual(originalSenderOutput - nextAmount - addedAmount);  
            });


           });
       });

   });

   describe('rewardTransaction()',()=>{
       let rewardTransaction,minerWallet;

       beforeEach(()=>{
        minerWallet = new Wallet();
        rewardTransaction = Transaction.rewardTransaction({minerWallet});           
       });

    it('creates a transaction with the reward input',()=>{
       expect(rewardTransaction.input).toEqual(REWARD_INPUT); 
    });

    it('creates one transaction for the miner with the `MINING_REWARD`',()=>{
        expect(rewardTransaction.outputMap[minerWallet.publicKey]).toEqual(MINING_REWARD);
    });
   });
});