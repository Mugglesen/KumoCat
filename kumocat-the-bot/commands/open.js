module.exports = {
    name: 'Open',
    description: 'Pack opener',
    execute(message, args) {
        //Some packs cant be opened

        if (args.includes('fortune') || (args.includes(/key+s$/))) {
            return message.channel.send("I'm sorry I can't open Fortune Keys :(");
        } else if (args.includes('magnificence') || (args.includes(/coupon+s*/) || args.includes(/ticket+s*/))) {
            return message.channel.send("I'm sorry I can't use the Palette of Fortune :(")
        }
  
        // Check amount and packname

        const Amount = args.shift();    

        // Check if amount is a number & not too high.
        const isNumber = /\d+/;
        if (!isNumber.test(Amount)) {
            return message.channel.send('Please tell me the amount of packs too, meow.');
        } else if (Amount > 10000) {
            return message.channel.send('Thats too many! Meoooow. No more than 10,000!');
        }

        function getPackObject(packName) {
            let packAlias = packName.toString().replace(/,/g,'').replace(/\s+/g, '').toLowerCase();
            //Check for variations and create a list of possible pack names
            let namesToTry = [];
            namesToTry.push(packAlias);
            if (packAlias.endsWith('es')) {
                namesToTry.push(packAlias.slice(0,-2));
            } else if (packAlias.endsWith('s')) {
                namesToTry.push(packAlias.slice(0,-1));
            }

            //Find the droptable based on possible pack names
            let packObject;
            for (let i = 0; i < namesToTry.length; i++) {
                try {
                    packObject = new require(`../droptables/${namesToTry[i]}.js`);
                    return packObject;
                } catch (error) {
                    continue;
                }
            }
            return packAlias;
        }

        //Create the pack object
        const Pack = getPackObject(args);
        if (typeof(Pack) == 'string') {
            return message.channel.send(`Double check your spelling! ... or maybe I just don't have the droptable of "${Pack}" yet, meow.`);
        }

        //const packName = msg.replace(packAmount,'');


        //const Pack = new require(`../droptables/${packAlias}.js`);
        //console.log(Pack.dropTable);
    
        //insert code around here to find pack ID and quest ID 
        let packId;
        Pack.imageId ? packId = Pack.imageId : packId = 23830;

        //const questId = 40251;
    
        let inventory = [];

        function updateInventoryWith(packObject, packAmount) {
            let packLoot = [];
            let extraPacks = [];
            let tempInventory = [];
            let total = 0;

            let range = packObject.dropTable.reduce((arr, {dropChance}, i) => {
                arr[i] = (total += dropChance);
                return arr;
            }, [])

            for (let i = 0; i < packAmount; i++) {
                let randomDrop = Math.random() * total;
                let index = range.findIndex(v => v >= randomDrop);
                let loot = packObject.dropTable[index];

                packLoot.push(loot.name);
                if (loot.hasDroptable) {
                    extraPacks.push(loot.name);
                }
            }

            inventory.push({name:packObject.name, amount: parseInt(packAmount), loot: packLoot});

            if (extraPacks.length > 0) {
                for (const [packName, packAmount] of Object.entries(sortItems(extraPacks))) {
                    let newPack = getPackObject(packName);
                    tempInventory = updateInventoryWith(newPack, packAmount);
                    //inventory.push({name:packName, amount:packAmount, loot: tempInventory.loot});
                }
            }

            return inventory;

        }

        function sortItems(inventory) {
            let countedItem = {};
            inventory.forEach(function(i) {
                countedItem[i] = (countedItem[i] || 0)+1; 
            });
            return countedItem;
        }

        updateInventoryWith(Pack, Amount);
        
        
        // Create the Embed content
        const inventoryAndLoot = [];
        inventory.forEach(function(pack){
            let lootString = '';
            for (const [itemName, itemAmount] of Object.entries(sortItems(pack.loot))) {
                lootString += itemAmount +'x '+itemName+"\n";
            }
            inventoryAndLoot.push({name:pack.name + ' ('+ pack.amount +')', value: lootString})
        });
        
        const packLoot = {
            color: 0xFFD700,
            author: {
            name: 'Opening packs...',
            icon_url: 'http://www.pwdatabase.com/images/icons/generalm/'+packId+'.png',
            },
            fields: inventoryAndLoot,
            //timestamp: 'I took me '+timerStop-timerStart*100+' time to open '+packAmount+' packs - '+new Date(),
            timestamp: new Date(),
        };
        return message.channel.send({ embed: packLoot });

    },
};