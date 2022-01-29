const argv = require('yargs').argv;


const clientsNumber = argv.clients || 1;
const targerUrl = argv.url || 'https://a-sahar-apm.emea-ent.f5demos.com/';




const selectors = ['adjective','animal','color', 'location'];

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); 
  }


const main = async () => {
        const client = new (require('./puppet'))( {
            targetUrl: targerUrl,
            puppetOptions: {
                headless: true
            }
        });
    
        try {            
            await client.init();                                    
            await client.enterWord(selectors[getRandomInt(0,3)], getRandomInt(1000000,9999999).toString());            
            await client.wait(5000);
            await client.close();
        } catch(e) {            
            await client.close();
            console.log(e);            
        }          
}

const client = async (clientId) => {
    for (let i=0;i<10000; i++) {        
        console.log('Client',clientId,'running');
        await main();
    }
}



(async () => {
    for (let i=0; i<clientsNumber; i++) {
        client(i);
    }
})().catch((e) => {
    console.log(e);
    process.exit(1);
});
    




