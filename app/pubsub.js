const PubNub = require('pubnub');

const credentials={
    publishKey: 'pub-c-fc65ec91-aa26-443d-bc02-a8cbc4a07c5b',
    subscribeKey: 'sub-c-43c3794c-8ccd-11eb-ba34-0aef9ee2f18f',
    secretKey: 'sec-c-ZTExZjNiNmItNTVkZC00NWZjLTlhMWItMzBjMjhhZjJhMmM2'

};

const CHANNELS={
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN',
    TRANSACTION: 'TRANSACTION'
}

class PubSub{
    constructor({blockchain,transactionPool,wallet}){
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        
        this.pubnub = new PubNub(credentials);

        this.pubnub.subscribe({channels: Object.values(CHANNELS)});

        this.pubnub.addListener(this.listener());
    }

    listener() {
        return{
            message: messageObject => {
                const { channel,message} = messageObject;

                console.log(`Message Received. Channel: ${channel}. Message: ${message}.`);

                const parsedMessage = JSON.parse(message);

                switch(channel) {
                    case CHANNELS.BLOCKCHAIN:
                      this.blockchain.replaceChain(parsedMessage, true,()=>{
                        this.transactionPool.clearBlockchainTransactions({
                          chain: parsedMessage
                        });
                      });
                      break;
                    case CHANNELS.TRANSACTION:
                        if (!this.transactionPool.existingTransaction({
                          inputAddress: this.wallet.publicKey
                        })) {
                          this.transactionPool.setTransaction(parsedMessage);
                        }
                     break;
                    default:
                     return;
                }
            }
        }
    }

    publish({channel,message}){
        this.pubnub.publish({channel,message});
    }

    broadcastChain(){
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        });
    }

    broadcastTransaction(transaction) {
        this.publish({
          channel: CHANNELS.TRANSACTION,
          message: JSON.stringify(transaction)
        });
      }

    subscribeToChannels() {
        this.pubnub.subscribe({
          channels: [Object.values(CHANNELS)]
        });
      }
}



module.exports = PubSub;